import express from 'express';/*

import http from 'http';  transcribe-proxy.js

import { WebSocketServer } from 'ws';  --------------------

import { spawn } from 'child_process';  WebSocket proxy that accepts binary audio blobs (MediaRecorder webm/opus) from the browser,

import { TranscribeStreamingClient, StartStreamTranscriptionCommand } from '@aws-sdk/client-transcribe-streaming';  pipes them into ffmpeg to convert to PCM16LE 16kHz mono, and forwards raw PCM audio to

  Amazon Transcribe Streaming (StartStreamTranscription) using the AWS SDK v3.

const REGION = process.env.AWS_REGION || 'us-west-2';

const client = new TranscribeStreamingClient({ region: REGION });  Requirements:

    - Node 18+

const app = express();    - ffmpeg installed and available in PATH

const server = http.createServer(app);    - npm install express ws @aws-sdk/client-transcribe-streaming-node

const wss = new WebSocketServer({ server, path: '/transcribe' });    - AWS credentials in env: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY



app.get('/', (req, res) => res.send('Transcribe proxy running'));  Notes:

    - This is an example and not hardened for production. Add authentication, rate-limiting,

// Helper: create an async iterable that yields raw PCM chunks from ffmpeg stdout      error handling, and secure deployment before using publicly.

function pcmIterable(ffmpegStdout) {    - The browser uses MediaRecorder to send webm/opus blobs; ffmpeg converts them to PCM.

  return (async function* () {    - The AWS SDK v3 transcribe streaming client expects an async iterable of AudioEvent objects.

    for await (const chunk of ffmpegStdout) {*/

      yield { AudioEvent: { AudioChunk: new Uint8Array(chunk) } };

    }const express = require('express');

  })();const http = require('http');

}const WebSocket = require('ws');

const { spawn } = require('child_process');

// On WebSocket connection: start ffmpeg and Transcribe, pipe incoming blobs to ffmpeg.stdin

wss.on('connection', (ws) => {// AWS Transcribe Streaming client (Node-specific package)

  console.log('Client connected for transcription');const { TranscribeStreamingClient, StartStreamTranscriptionCommand } = require('@aws-sdk/client-transcribe-streaming-node');



  // start ffmpeg to convert webm/opus -> s16le (PCM 16-bit signed LE) 16kHz monoconst REGION = process.env.AWS_REGION || 'us-west-2';

  const ffmpeg = spawn('ffmpeg', [

    '-loglevel', 'error',const client = new TranscribeStreamingClient({ region: REGION });

    '-hide_banner',

    '-f', 'webm',const app = express();

    '-i', 'pipe:0',const server = http.createServer(app);

    '-ar', '16000',const wss = new WebSocket.Server({ server, path: '/transcribe' });

    '-ac', '1',

    '-f', 's16le',app.get('/', (req, res) => res.send('Transcribe proxy running'));

    'pipe:1',

  ]);// Helper: create an async iterable that yields raw PCM chunks from ffmpeg stdout

function pcmIterable(ffmpegStdout) {

  ffmpeg.on('error', (err) => {  const reader = ffmpegStdout[Symbol.asyncIterator] ? ffmpegStdout[Symbol.asyncIterator]() : null;

    console.error('ffmpeg error', err);  if (!reader) {

    ws.close(1011, 'ffmpeg error');    // Node streams: implement manual async iterator

  });    const stream = ffmpegStdout;

    return (async function* () {

  ffmpeg.stderr.on('data', (d) => console.error('ffmpeg:', d.toString()));      for await (const chunk of stream) {

        yield { AudioEvent: { AudioChunk: new Uint8Array(chunk) } };

  // Create an async iterable for audio events from ffmpeg stdout      }

  const audioStream = pcmIterable(ffmpeg.stdout);    })();

  }

  // Start Transcribe streaming command

  const command = new StartStreamTranscriptionCommand({  return (async function* () {

    LanguageCode: 'en-US',    for await (const chunk of ffmpegStdout) {

    MediaSampleRateHertz: 16000,      yield { AudioEvent: { AudioChunk: new Uint8Array(chunk) } };

    MediaEncoding: 'pcm',    }

    AudioStream: audioStream,  })();

  });}



  // Send transcription events back to client// On WebSocket connection: start ffmpeg and Transcribe, pipe incoming blobs to ffmpeg.stdin

  (async () => {wss.on('connection', (ws) => {

    try {  console.log('Client connected for transcription');

      const response = await client.send(command);

      for await (const event of response.TranscriptResultStream) {  // start ffmpeg to convert webm/opus -> s16le (PCM 16-bit signed LE) 16kHz mono

        if (event.TranscriptEvent) {  // ffmpeg reads from stdin and writes raw PCM to stdout

          const results = event.TranscriptEvent.Transcript.Results;  const ffmpeg = spawn('ffmpeg', [

          if (results && results.length > 0) {    '-loglevel', 'error',

            const result = results[0];    '-hide_banner',

            if (result.Alternatives && result.Alternatives.length > 0) {    '-f', 'webm', // input format from MediaRecorder

              const transcript = result.Alternatives[0].Transcript || '';    '-i', 'pipe:0',

              ws.send(JSON.stringify({    '-ar', '16000', // sample rate

                type: 'transcript',    '-ac', '1', // mono

                transcript,    '-f', 's16le',

                isPartial: result.IsPartial    'pipe:1',

              }));  ]);

            }

          }  ffmpeg.on('error', (err) => {

        }    console.error('ffmpeg error', err);

      }    ws.close(1011, 'ffmpeg error');

    } catch (err) {  });

      console.error('Transcribe stream error', err);

      try {  ffmpeg.stderr.on('data', (d) => { /* optional logging */ });

        ws.send(JSON.stringify({ type: 'error', error: String(err) }));

      } catch (e) {  // Create an async iterable for audio events from ffmpeg stdout

        console.error('Failed to send error to client', e);  const audioStream = pcmIterable(ffmpeg.stdout);

      }

    }  // Start Transcribe streaming command

  })();  const command = new StartStreamTranscriptionCommand({

    LanguageCode: 'en-US',

  ws.on('message', (message) => {    MediaSampleRateHertz: 16000,

    if (typeof message === 'string') {    MediaEncoding: 'pcm',

      try {    // AudioStream will be provided as an async iterable

        const msg = JSON.parse(message);    AudioStream: audioStream,

        if (msg && msg.type === 'stop') {  });

          try { ffmpeg.stdin.end(); } catch(e){}

        }  // Send transcription events back to client

      } catch (err) {  (async () => {

        console.warn('Unknown text message', err);    try {

      }      const response = await client.send(command);

      return;      // response is an async iterable of events

    }      for await (const event of response.TranscriptResultStream || response) {

        // TranscriptEvent contains results

    // Binary chunk: write into ffmpeg stdin        if (event.TranscriptEvent) {

    try {          const results = event.TranscriptEvent.Transcript.Results;

      ffmpeg.stdin.write(Buffer.from(message));          if (results && results.length > 0) {

    } catch (err) {            const top = results[0];

      console.error('Failed to write to ffmpeg stdin', err);            if (top.Alternatives && top.Alternatives.length > 0) {

    }              const transcript = top.Alternatives[0].Transcript || '';

  });              // send partial/final transcripts to client

              ws.send(JSON.stringify({ type: 'transcript', transcript, isPartial: !top.IsPartial ? false : top.IsPartial }));

  ws.on('close', () => {            }

    try { ffmpeg.stdin.end(); } catch(e){}          }

    try { ffmpeg.kill('SIGKILL'); } catch(e){}        }

  });      }

});    } catch (err) {

      console.error('Transcribe stream error', err);

const port = process.env.PORT || 8081;      try { ws.send(JSON.stringify({ type: 'error', error: String(err) })); } catch(e){}

server.listen(port, () => console.log(`Transcribe proxy listening on ws://localhost:${port}/transcribe`));    }
  })();

  ws.on('message', (message) => {
    // Expect binary audio chunks from client (MediaRecorder blobs) or control JSON messages
    if (typeof message === 'string') {
      try {
        const msg = JSON.parse(message);
        if (msg && msg.type === 'stop') {
          // end ffmpeg stdin so it flushes
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
