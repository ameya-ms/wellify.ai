import { useState } from "react";
import { MessageSquare, Shield, Upload, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

const Insurance = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I can help you understand your insurance coverage. Ask me anything about copays, deductibles, or what's covered at UW facilities.",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");

  const coverageSummaries = [
    {
      title: "Hall Health Visits",
      coverage: "Up to $20 copay per visit",
      details: "Primary care and same-day appointments covered. Specialist referrals may require additional copay.",
    },
    {
      title: "UW Medical Center",
      coverage: "80% covered after deductible",
      details: "Emergency care, specialist visits, and diagnostic tests. Annual deductible: $500.",
    },
    {
      title: "Emergency Room",
      coverage: "Fully covered for emergencies",
      details: "No copay for true emergencies. If admitted, standard hospital copay applies.",
    },
  ];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };

    // Simulate AI response
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: "Based on your UW student insurance plan, most primary care visits at Hall Health have a $20 copay. Emergency care is fully covered when it's a true emergency. Would you like to know more about any specific service?",
      sender: "ai",
    };

    setMessages([...messages, userMessage, aiResponse]);
    setInput("");
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Insurance Coverage
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understand what you're covered for—in plain English.
          </p>
        </div>

        {/* Insurance Card Upload */}
        <Card className="mb-8 border-border">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="flex-1 space-y-2">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Your Insurance Plan
                </h3>
                <p className="text-sm text-muted-foreground">
                  Upload your insurance card or select your plan to get personalized coverage information.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary-lighter/50">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Card
                </Button>
                <Button className="bg-primary hover:bg-primary-light">
                  Select Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Chat Interface */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Ask About Your Coverage</h2>
            </div>

            <Card className="border-border">
              <CardHeader className="bg-secondary/30 border-b border-border">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-hero flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-primary-foreground" />
                  </div>
                  AI Coverage Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-foreground"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSend} className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about copays, coverage, deductibles..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon" className="bg-primary hover:bg-primary-light">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Coverage Summary */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Coverage Summary</h2>
            </div>

            <div className="space-y-4">
              {coverageSummaries.map((item) => (
                <Card key={item.title} className="border-border hover:shadow-lg transition-all">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-lg text-foreground">{item.title}</h3>
                      <Badge className="bg-success/10 text-success border-success/20">
                        Covered
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="text-primary font-medium">{item.coverage}</p>
                      <p className="text-sm text-muted-foreground">{item.details}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Tips */}
            <Card className="border-accent/30 bg-accent-lighter">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold text-accent-foreground flex items-center gap-2">
                  💡 Quick Tips
                </h3>
                <ul className="space-y-2 text-sm text-accent-foreground/80">
                  <li>• Always bring your insurance card to appointments</li>
                  <li>• Call ahead to confirm your insurance is accepted</li>
                  <li>• Keep track of your deductible and out-of-pocket max</li>
                  <li>• For emergencies, coverage is the same at any ER</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Insurance;
