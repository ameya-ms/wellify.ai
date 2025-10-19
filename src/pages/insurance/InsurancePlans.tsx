// import { useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { MessageSquare, Shield, Send, Building2, Ambulance, Stethoscope } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// interface Message {
//   id: string;
//   text: string;
//   sender: "user" | "ai";
// }

// interface CoverageItem {
//   facility: string;
//   service: string;
//   coverage: string;
//   details: string;
// }

// const InsurancePlans = () => {
//   const [searchParams] = useSearchParams();
//   const selectedProvider = searchParams.get('provider') || 'Your Insurance Provider';
  
//   const [messages, setMessages] = useState<Message[]>([
//     { 
//       id: "1", 
//       text: "Hi! I can help you understand your insurance coverage. Ask me about Medicare, Apple Care, or Health 101!", 
//       sender: "ai" 
//     },
//   ]);
//   const [input, setInput] = useState("");
//   const [coverageDetails, setCoverageDetails] = useState({
//     hallHealth: [] as CoverageItem[],
//     uwmc: [] as CoverageItem[],
//     urgent: [] as CoverageItem[],
//   });

//   const handleSend = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!input.trim()) return;

//     const userMessage: Message = { id: Date.now().toString(), text: input, sender: "user" };
//     setMessages((prev) => [...prev, userMessage]);
    
//     const userInput = input;
//     setInput("");

//     try {
//       const response = await fetch("http://127.0.0.1:8000/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ message: userInput }),
//       });
      
//       const data = await response.json();

//       console.log("=== BACKEND RESPONSE ===");
//       console.log("Reply:", data.reply);
//       console.log("Coverage Info:", data.coverageInfo);
//       console.log("========================");

//       const aiMessage: Message = { 
//         id: (Date.now() + 1).toString(), 
//         text: data.reply, 
//         sender: "ai" 
//       };
//       setMessages((prev) => [...prev, aiMessage]);

//       // Dynamically populate coverage tabs from AI response
//       if (data.coverageInfo && data.coverageInfo.length > 0) {
//         const newCoverage = { 
//           hallHealth: [] as CoverageItem[], 
//           uwmc: [] as CoverageItem[], 
//           urgent: [] as CoverageItem[] 
//         };
        
//         data.coverageInfo.forEach((item: CoverageItem, index: number) => {
//           const facilityLower = item.facility.toLowerCase();
          
//           // Strategy 1: Map specific facilities to tabs
//           if (facilityLower.includes("part a") || facilityLower.includes("primary")) {
//             newCoverage.hallHealth.push(item);
//           } else if (facilityLower.includes("part b") || facilityLower.includes("specialist")) {
//             newCoverage.uwmc.push(item);
//           } else if (facilityLower.includes("part c") || facilityLower.includes("part d") || facilityLower.includes("emergency")) {
//             newCoverage.urgent.push(item);
//           } 
//           // Strategy 2: Round-robin distribution for everything else
//           else {
//             const tabIndex = index % 3;
//             if (tabIndex === 0) {
//               newCoverage.hallHealth.push(item);
//             } else if (tabIndex === 1) {
//               newCoverage.uwmc.push(item);
//             } else {
//               newCoverage.urgent.push(item);
//             }
//           }
//         });
        
//         // Balance tabs if any is empty - redistribute evenly
//         const allItems = [...newCoverage.hallHealth, ...newCoverage.uwmc, ...newCoverage.urgent];
//         if (newCoverage.hallHealth.length === 0 || newCoverage.uwmc.length === 0 || newCoverage.urgent.length === 0) {
//           console.log("⚖️ Rebalancing tabs to ensure all are populated...");
//           newCoverage.hallHealth = [];
//           newCoverage.uwmc = [];
//           newCoverage.urgent = [];
          
//           allItems.forEach((item, idx) => {
//             const tabIdx = idx % 3;
//             if (tabIdx === 0) newCoverage.hallHealth.push(item);
//             else if (tabIdx === 1) newCoverage.uwmc.push(item);
//             else newCoverage.urgent.push(item);
//           });
//         }
        
//         setCoverageDetails(newCoverage);
//         console.log("📊 Updated coverage details:", {
//           hallHealth: newCoverage.hallHealth.length,
//           uwmc: newCoverage.uwmc.length,
//           urgent: newCoverage.urgent.length
//         });
//       }

//     } catch (error) {
//       console.error("Error calling backend:", error);
//       const aiMessage: Message = {
//         id: (Date.now() + 2).toString(),
//         text: "Sorry, something went wrong while fetching coverage info.",
//         sender: "ai",
//       };
//       setMessages((prev) => [...prev, aiMessage]);
//     }
//   };

//   const renderCoverageCards = (items: CoverageItem[], badgeColor: string) => {
//     if (items.length === 0) {
//       return (
//         <div className="text-center py-8 text-muted-foreground">
//           <p className="text-sm">No coverage information available yet.</p>
//           <p className="text-xs mt-2">Ask a question to see coverage details!</p>
//         </div>
//       );
//     }

//     return items.map((item, index) => (
//       <Card 
//         key={index} 
//         className="border-border hover:shadow-lg transition-all animate-fade-in-up"
//         style={{ animationDelay: `${index * 50}ms` }}
//       >
//         <CardContent className="p-4">
//           <div className="flex items-start justify-between mb-2">
//             <h3 className="font-semibold text-foreground">{item.service}</h3>
//             <Badge className={`bg-${badgeColor}/10 text-${badgeColor} border-${badgeColor}/20`}>
//               {item.coverage}
//             </Badge>
//           </div>
//           <p className="text-sm text-muted-foreground">{item.details}</p>
//         </CardContent>
//       </Card>
//     ));
//   };

//   return (
//     <div className="min-h-screen pt-24 pb-12">
//       <div className="container mx-auto px-4 max-w-6xl">
//         <div className="text-center mb-12 space-y-4 animate-fade-in-up">
//           <h1 className="text-4xl md:text-5xl font-bold text-foreground">
//             Plan Details & Coverage
//           </h1>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Detailed coverage information for all UW health services
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-2 gap-8">
//           {/* Chat Section */}
//           <div className="space-y-6">
//             <div className="flex items-center gap-3">
//               <MessageSquare className="w-6 h-6 text-primary" />
//               <h2 className="text-2xl font-semibold text-foreground">Ask About Your Coverage</h2>
//             </div>

//             <Card className="border-border animate-fade-in-up">
//               <CardHeader className="bg-muted/50 border-b border-border">
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
//                     <MessageSquare className="w-4 h-4 text-primary-foreground" />
//                   </div>
//                   AI Coverage Assistant
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="p-0">
//                 <div className="h-96 overflow-y-auto p-4 space-y-4">
//                   {messages.map((msg) => (
//                     <div 
//                       key={msg.id} 
//                       className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
//                     >
//                       <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
//                         msg.sender === "user" 
//                           ? "bg-primary text-primary-foreground" 
//                           : "bg-muted text-foreground"
//                       }`}>
//                         <p className="text-sm">{msg.text}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//                 <form onSubmit={handleSend} className="p-4 border-t border-border">
//                   <div className="flex gap-2">
//                     <Input
//                       value={input}
//                       onChange={(e) => setInput(e.target.value)}
//                       placeholder="Ask about copays, coverage, deductibles..."
//                       className="flex-1"
//                     />
//                     <Button type="submit" size="icon" className="hover:scale-110 transition-transform">
//                       <Send className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 </form>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Coverage Details Section */}
//           <div className="space-y-6">
//             <div className="flex items-center gap-3">
//               <Shield className="w-6 h-6 text-primary" />
//               <h2 className="text-2xl font-semibold text-foreground">Coverage by Facility</h2>
//             </div>
//             <p className="text-sm text-muted-foreground">
//               Coverage is provided by <span className="font-medium text-foreground">{selectedProvider}</span>
//             </p>

//             <Tabs defaultValue="hallHealth" className="w-full">
//               <TabsList className="grid w-full grid-cols-3">
//                 <TabsTrigger value="hallHealth" className="flex items-center gap-2">
//                   <Building2 className="w-4 h-4" />
//                   <span className="hidden sm:inline">Hall Health</span>
//                 </TabsTrigger>
//                 <TabsTrigger value="uwmc" className="flex items-center gap-2">
//                   <Ambulance className="w-4 h-4" />
//                   <span className="hidden sm:inline">UWMC</span>
//                 </TabsTrigger>
//                 <TabsTrigger value="urgent" className="flex items-center gap-2">
//                   <Stethoscope className="w-4 h-4" />
//                   <span className="hidden sm:inline">Urgent Care</span>
//                 </TabsTrigger>
//               </TabsList>

//               <TabsContent value="hallHealth" className="space-y-4 mt-6">
//                 {renderCoverageCards(coverageDetails.hallHealth, "success")}
//               </TabsContent>

//               <TabsContent value="uwmc" className="space-y-4 mt-6">
//                 {renderCoverageCards(coverageDetails.uwmc, "primary")}
//               </TabsContent>

//               <TabsContent value="urgent" className="space-y-4 mt-6">
//                 {renderCoverageCards(coverageDetails.urgent, "accent")}
//               </TabsContent>
//             </Tabs>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default InsurancePlans;


import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { MessageSquare, Shield, Send, Building2, Ambulance, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
}

interface CoverageItem {
  facility: string;
  service: string;
  coverage: string;
  details: string;
}

const InsurancePlans = () => {
  const [searchParams] = useSearchParams();
  const selectedProvider = searchParams.get('provider') || 'Your Insurance Provider';
  
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: "1", 
      text: "Hi! I can help you understand your insurance coverage. Ask me about **Medicare**, **Apple Care**, or **Health 101**!", 
      sender: "ai" 
    },
  ]);
  const [input, setInput] = useState("");
  const [coverageDetails, setCoverageDetails] = useState({
    hallHealth: [] as CoverageItem[],
    uwmc: [] as CoverageItem[],
    urgent: [] as CoverageItem[],
  });

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    
    const userInput = input;
    setInput("");

    try {
      const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userInput }),
      });
      
      const data = await response.json();

      console.log("=== BACKEND RESPONSE ===");
      console.log("Reply:", data.reply);
      console.log("Coverage Info:", data.coverageInfo);
      console.log("========================");

      const aiMessage: Message = { 
        id: (Date.now() + 1).toString(), 
        text: data.reply, 
        sender: "ai" 
      };
      setMessages((prev) => [...prev, aiMessage]);

      // Dynamically populate coverage tabs from AI response
      if (data.coverageInfo && data.coverageInfo.length > 0) {
        const newCoverage = { 
          hallHealth: [] as CoverageItem[], 
          uwmc: [] as CoverageItem[], 
          urgent: [] as CoverageItem[] 
        };
        
        data.coverageInfo.forEach((item: CoverageItem, index: number) => {
          const facilityLower = item.facility.toLowerCase();
          
          // Strategy 1: Map specific facilities to tabs
          if (facilityLower.includes("part a") || facilityLower.includes("primary")) {
            newCoverage.hallHealth.push(item);
          } else if (facilityLower.includes("part b") || facilityLower.includes("specialist")) {
            newCoverage.uwmc.push(item);
          } else if (facilityLower.includes("part c") || facilityLower.includes("part d") || facilityLower.includes("emergency")) {
            newCoverage.urgent.push(item);
          } 
          // Strategy 2: Round-robin distribution for everything else
          else {
            const tabIndex = index % 3;
            if (tabIndex === 0) {
              newCoverage.hallHealth.push(item);
            } else if (tabIndex === 1) {
              newCoverage.uwmc.push(item);
            } else {
              newCoverage.urgent.push(item);
            }
          }
        });
        
        // Balance tabs if any is empty - redistribute evenly
        const allItems = [...newCoverage.hallHealth, ...newCoverage.uwmc, ...newCoverage.urgent];
        if (newCoverage.hallHealth.length === 0 || newCoverage.uwmc.length === 0 || newCoverage.urgent.length === 0) {
          console.log("⚖️ Rebalancing tabs to ensure all are populated...");
          newCoverage.hallHealth = [];
          newCoverage.uwmc = [];
          newCoverage.urgent = [];
          
          allItems.forEach((item, idx) => {
            const tabIdx = idx % 3;
            if (tabIdx === 0) newCoverage.hallHealth.push(item);
            else if (tabIdx === 1) newCoverage.uwmc.push(item);
            else newCoverage.urgent.push(item);
          });
        }
        
        setCoverageDetails(newCoverage);
        console.log("📊 Updated coverage details:", {
          hallHealth: newCoverage.hallHealth.length,
          uwmc: newCoverage.uwmc.length,
          urgent: newCoverage.urgent.length
        });
      }

    } catch (error) {
      console.error("Error calling backend:", error);
      const aiMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: "Sorry, something went wrong while fetching coverage info.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMessage]);
    }
  };

  const renderCoverageCards = (items: CoverageItem[], badgeColor: string) => {
    if (items.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No coverage information available yet.</p>
          <p className="text-xs mt-2">Ask a question to see coverage details!</p>
        </div>
      );
    }

    return items.map((item, index) => (
      <Card 
        key={index} 
        className="border-border hover:shadow-lg transition-all animate-fade-in-up"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-foreground">{item.service}</h3>
            <Badge className={`bg-${badgeColor}/10 text-${badgeColor} border-${badgeColor}/20`}>
              {item.coverage}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{item.details}</p>
        </CardContent>
      </Card>
    ));
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
          {/* Chat Section */}
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
                  {messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
                    >
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        msg.sender === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-foreground"
                      }`}>
                        {msg.sender === "ai" ? (
                          <div className="prose prose-sm max-w-none dark:prose-invert prose-p:my-2 prose-headings:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.text}
                            </ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm">{msg.text}</p>
                        )}
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

          {/* Coverage Details Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-semibold text-foreground">Coverage by Facility</h2>
            </div>
            <p className="text-sm text-muted-foreground">
              Coverage is provided by <span className="font-medium text-foreground">{selectedProvider}</span>
            </p>

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
                {renderCoverageCards(coverageDetails.hallHealth, "success")}
              </TabsContent>

              <TabsContent value="uwmc" className="space-y-4 mt-6">
                {renderCoverageCards(coverageDetails.uwmc, "primary")}
              </TabsContent>

              <TabsContent value="urgent" className="space-y-4 mt-6">
                {renderCoverageCards(coverageDetails.urgent, "accent")}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsurancePlans;