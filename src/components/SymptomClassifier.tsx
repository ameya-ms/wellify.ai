import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff } from "lucide-react";

type Classification = {
  age?: string;
  gender?: string;
  symptom_code?: string;
  urgency?: string;
  time_of_day?: string;
  wait_load_A?: string;
  wait_load_B?: string;
  wait_load_C?: string;
  specialty_match_A?: string;
  specialty_match_B?: string;
  specialty_match_C?: string;
};

export default function SymptomClassifier() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Classification | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const recognitionRef = React.useRef<any>(null);

  const supportsSpeech = typeof window !== "undefined" && (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  const toggleListening = () => {
    if (!supportsSpeech) {
      setError("Speech recognition not supported in this browser.");
      return;
    }

    if (listening) {
      // stop
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    setError(null);
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recog = new SpeechRecognition();
    recognitionRef.current = recog;
    recog.lang = "en-US";
    recog.interimResults = true;
    recog.maxAlternatives = 1;

    let interim = "";

    recog.onstart = () => {
      setListening(true);
    };

    recog.onerror = (ev: any) => {
      setError(ev.error || "Speech recognition error");
      setListening(false);
    };

    recog.onresult = (event: any) => {
      interim = "";
      let finalTranscript = text || "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += (finalTranscript ? " " : "") + transcript;
        } else {
          interim += transcript;
        }
      }
      setText(finalTranscript + (interim ? ` ${interim}` : ""));
    };

    recog.onend = () => {
      setListening(false);
    };

    try {
      recog.start();
    } catch (err: any) {
      setError(err.message || String(err));
      setListening(false);
    }
  };

  const classify = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const resp = await fetch("/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!resp.ok) throw new Error(`Server error ${resp.status}`);
      const data = await resp.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border">
      <CardContent>
        <div className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="Type symptoms here (e.g. 'I've had fever and cough since yesterday')"
            className="w-full p-3 rounded-lg bg-card text-foreground placeholder:text-muted-foreground outline-none"
          />

          <div className="flex items-center gap-3">
            <Button onClick={classify} disabled={!text.trim() || loading}>
              {loading ? "Classifying…" : "Classify"}
            </Button>
            <Button variant="outline" onClick={() => { setText(""); setResult(null); setError(null); }}>
              Clear
            </Button>
            {/* Microphone control */}
            <Button
              variant={listening ? undefined : "outline"}
              onClick={toggleListening}
              aria-pressed={listening}
              title={listening ? "Stop recording" : "Record symptoms by voice"}
            >
              {listening ? <Mic className="w-4 h-4 text-red-400" /> : <MicOff className="w-4 h-4" />}
            </Button>
          </div>

          {error && <div className="text-destructive text-sm">{error}</div>}

          {result && (
            <div className="overflow-auto">
              <table className="w-full text-sm table-fixed">
                <tbody>
                  {Object.entries(result).map(([k, v]) => (
                    <tr key={k} className="border-t border-border">
                      <td className="py-2 font-medium w-40 capitalize">{k.replace(/_/g, " ")}</td>
                      <td className="py-2">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
