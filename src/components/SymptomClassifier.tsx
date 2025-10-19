import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mic, MicOff } from "lucide-react";

interface SymptomClassifierProps {
  onSymptomsExtracted?: (symptoms: string[]) => void;
}

export default function SymptomClassifier({ onSymptomsExtracted }: SymptomClassifierProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [listening, setListening] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
    setSuccessMessage(null);
    try {
      const resp = await fetch("http://localhost:8081/api/classify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (!resp.ok) throw new Error(`Server error ${resp.status}`);
      const data = await resp.json();
      
      // Extract symptoms from the response
      if (data.symptoms && data.symptoms.length > 0) {
        if (onSymptomsExtracted) {
          onSymptomsExtracted(data.symptoms);
        }
        setSuccessMessage(`Found ${data.symptoms.length} symptom(s): ${data.symptoms.join(", ")}`);
        setText(""); // Clear the text after successful extraction
      } else {
        setError("No symptoms found in the text. Please try describing your symptoms differently.");
      }
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
            placeholder="Type or speak symptoms here (e.g. 'I've had fever and cough since yesterday')"
            className="w-full p-3 rounded-lg bg-card text-foreground placeholder:text-muted-foreground outline-none"
          />

          <div className="flex items-center gap-3">
            <Button onClick={classify} disabled={!text.trim() || loading}>
              {loading ? "Classifying…" : "Submit"}
            </Button>
            <Button variant="outline" onClick={() => { setText(""); setError(null); setSuccessMessage(null); }}>
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
          {successMessage && <div className="text-green-600 text-sm">{successMessage}</div>}
        </div>
      </CardContent>
    </Card>
  );
}
