const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { spawn } = require('child_process');
const { TranscribeStreamingClient, StartStreamTranscriptionCommand } = require('@aws-sdk/client-transcribe-streaming');

// Load AWS credentials from shared credentials file
const { fromIni } = require("@aws-sdk/credential-providers");

console.log('Starting transcribe proxy server...');

const REGION = process.env.AWS_REGION || 'us-west-2';
console.log('Using AWS Region:', REGION);

const client = new TranscribeStreamingClient({ 
    region: REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server, path: '/transcribe' });

app.get('/', (req, res) => res.send('Transcribe proxy running'));

// Helper: create an async iterable that yields raw PCM chunks from ffmpeg stdout
function pcmIterable(ffmpegStdout) {
  return (async function* () {
    for await (const chunk of ffmpegStdout) {
      yield { AudioEvent: { AudioChunk: new Uint8Array(chunk) } };
    }
  })();
}

// On WebSocket connection: start ffmpeg and Transcribe, pipe incoming blobs to ffmpeg.stdin
wss.on('connection', (ws) => {
  console.log('Client connected for transcription');

  // start ffmpeg to convert webm/opus -> s16le (PCM 16-bit signed LE) 16kHz mono
  const ffmpeg = spawn('ffmpeg', [
    '-loglevel', 'error',
    '-hide_banner',
    '-f', 'webm',
    '-i', 'pipe:0',
    '-ar', '16000',
    '-ac', '1',
    '-f', 's16le',
    'pipe:1',
  ]);

  ffmpeg.on('error', (err) => {
    console.error('ffmpeg error', err);
    ws.close(1011, 'ffmpeg error');
  });

  ffmpeg.stderr.on('data', (d) => console.error('ffmpeg:', d.toString()));

  // Create an async iterable for audio events from ffmpeg stdout
  const audioStream = pcmIterable(ffmpeg.stdout);

  // Start Transcribe streaming command
  const command = new StartStreamTranscriptionCommand({
    LanguageCode: 'en-US',
    MediaSampleRateHertz: 16000,
    MediaEncoding: 'pcm',
    AudioStream: audioStream
  });

  // Send transcription events back to client
  (async () => {
    try {
      const response = await client.send(command);
      for await (const event of response.TranscriptResultStream) {
        if (event.TranscriptEvent) {
          const results = event.TranscriptEvent.Transcript.Results;
          if (results && results.length > 0) {
            const result = results[0];
            if (result.Alternatives && result.Alternatives.length > 0) {
              const transcript = result.Alternatives[0].Transcript || '';
              ws.send(JSON.stringify({
                type: 'transcript',
                transcript,
                isPartial: result.IsPartial
              }));
            }
          }
        }
      }
    } catch (err) {
      console.error('Transcribe stream error', err);
      try {
        ws.send(JSON.stringify({ type: 'error', error: String(err) }));
      } catch (e) {
        console.error('Failed to send error to client', e);
      }
    }
  })();

  ws.on('message', (message) => {
    if (typeof message === 'string') {
      try {
        const msg = JSON.parse(message);
        if (msg && msg.type === 'stop') {
          try { ffmpeg.stdin.end(); } catch(e){}
        }
      } catch (err) {
        console.warn('Unknown text message', err);
      }
      return;
    }

    // Binary chunk: write into ffmpeg stdin
    try {
      ffmpeg.stdin.write(Buffer.from(message));
    } catch (err) {
      console.error('Failed to write to ffmpeg stdin', err);
    }
  });

  ws.on('close', () => {
    try { ffmpeg.stdin.end(); } catch(e){}
    try { ffmpeg.kill('SIGKILL'); } catch(e){}
  });
});

const port = process.env.PORT || 8081;
server.listen(port, () => console.log(`Transcribe proxy listening on ws://localhost:${port}/transcribe`));