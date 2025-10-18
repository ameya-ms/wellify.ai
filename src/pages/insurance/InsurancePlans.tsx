import { useState } from "react";
import { MessageSquare, Shield, Send, Building2, Ambulance, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

const InsurancePlans = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I can help you understand your insurance coverage. Ask me anything about copays, deductibles, or what's covered at UW facilities.",
      sender: "ai",
    },
  ]);
  const [input, setInput] = useState("");

  const coverageDetails = {
    hallHealth: [
      { service: "Primary Care Visit", coverage: "$20 copay", details: "Same-day appointments available" },
      { service: "Specialist Referral", coverage: "$30 copay", details: "Pre-authorization required" },
      { service: "Lab Work", coverage: "$10 copay", details: "Most common tests covered" },
      { service: "Vaccinations", coverage: "100% covered", details: "Preventive care included" },
    ],
    uwmc: [
      { service: "Emergency Room", coverage: "100% after deductible", details: "$500 annual deductible" },
      { service: "Specialist Visit", coverage: "80% after deductible", details: "Referral required" },
      { service: "Diagnostic Tests", coverage: "80% after deductible", details: "X-rays, MRI, CT scans" },
      { service: "Hospital Stay", coverage: "80% after deductible", details: "$2,500 out-of-pocket max" },
    ],
    urgent: [
      { service: "Urgent Care Visit", coverage: "$40 copay", details: "Walk-ins welcome" },
      { service: "Minor Procedures", coverage: "$60 copay", details: "Stitches, X-rays, etc." },
      { service: "After-Hours Care", coverage: "$40 copay", details: "Evenings and weekends" },
    ],
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
    };

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: "Based on your UW student insurance plan, most primary care visits at Hall Health have a $20 copay. Emergency care is 100% covered after your $500 deductible. Would you like to know more about any specific service?",
      sender: "ai",
    };

    setMessages([...messages, userMessage, aiResponse]);
    setInput("");
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12 space-y-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Plan Details & Coverage
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Detailed coverage information for all UW health services
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* AI Chat Assistant */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Ask About Your Coverage</h2>
            </div>

            <Card className="border-border animate-fade-in-up">
              <CardHeader className="bg-muted/50 border-b border-border">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
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
                      } animate-fade-in`}
                    >
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-foreground"
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
                    <Button type="submit" size="icon" className="hover:scale-110 transition-transform">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Coverage Details Tabs */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Coverage by Facility</h2>
            </div>

            <Tabs defaultValue="hallHealth" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="hallHealth" className="flex items-center gap-2">
                  <Building2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Hall Health</span>
                </TabsTrigger>
                <TabsTrigger value="uwmc" className="flex items-center gap-2">
                  <Ambulance className="w-4 h-4" />
                  <span className="hidden sm:inline">UWMC</span>
                </TabsTrigger>
                <TabsTrigger value="urgent" className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  <span className="hidden sm:inline">Urgent Care</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="hallHealth" className="space-y-4 mt-6">
                {coverageDetails.hallHealth.map((item, index) => (
                  <Card 
                    key={item.service} 
                    className="border-border hover:shadow-lg transition-all animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{item.service}</h3>
                        <Badge className="bg-success/10 text-success border-success/20">
                          {item.coverage}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.details}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="uwmc" className="space-y-4 mt-6">
                {coverageDetails.uwmc.map((item, index) => (
                  <Card 
                    key={item.service} 
                    className="border-border hover:shadow-lg transition-all animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{item.service}</h3>
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          {item.coverage}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.details}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="urgent" className="space-y-4 mt-6">
                {coverageDetails.urgent.map((item, index) => (
                  <Card 
                    key={item.service} 
                    className="border-border hover:shadow-lg transition-all animate-fade-in-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-foreground">{item.service}</h3>
                        <Badge className="bg-accent/10 text-accent-foreground border-accent/30">
                          {item.coverage}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.details}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsurancePlans;
