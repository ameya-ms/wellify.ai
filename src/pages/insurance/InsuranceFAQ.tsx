import { HelpCircle, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

const InsuranceFAQ = () => {
  const faqCategories = [
    {
      category: "Getting Started",
      color: "bg-primary/10 text-primary border-primary/20",
      questions: [
        {
          q: "How do I activate my UW student health insurance?",
          a: "Your UW student health insurance is automatically active when you enroll in classes. You can access your insurance card through the MyUW portal under 'Insurance & Benefits'.",
        },
        {
          q: "Where can I find my insurance card?",
          a: "Log into MyUW portal and navigate to Insurance & Benefits. You can download a digital copy or request a physical card be mailed to you.",
        },
        {
          q: "Do I need to choose a primary care doctor?",
          a: "No, UW student health insurance doesn't require you to choose a PCP. You can visit any in-network provider, including Hall Health Center.",
        },
      ],
    },
    {
      category: "Coverage & Costs",
      color: "bg-success/10 text-success border-success/20",
      questions: [
        {
          q: "What's the difference between copay and deductible?",
          a: "A copay is a fixed amount you pay for specific services (like $20 for a Hall Health visit). A deductible ($500 annually) is what you pay before insurance covers larger expenses at 80%.",
        },
        {
          q: "Are prescriptions covered?",
          a: "Yes, most generic prescriptions have a $10-15 copay. Brand-name drugs may have higher copays. Check with your pharmacy or the AI assistant for specific medications.",
        },
        {
          q: "What happens if I reach my out-of-pocket maximum?",
          a: "Once you've paid $2,500 in qualifying expenses in a year, your insurance covers 100% of covered services for the rest of that year.",
        },
        {
          q: "Is mental health care covered?",
          a: "Yes! Mental health services at Hall Health Counseling Center are covered with the same $20 copay as other primary care visits.",
        },
      ],
    },
    {
      category: "Using Your Insurance",
      color: "bg-accent/10 text-accent-foreground border-accent/30",
      questions: [
        {
          q: "Do I need a referral to see a specialist?",
          a: "For specialists at UW Medical Center, yes. Hall Health can provide referrals. Some specialists may be seen without referral - check with your provider first.",
        },
        {
          q: "What if I need care outside of UW facilities?",
          a: "You can visit any in-network provider. Check the provider directory in MyUW or call the insurance line to verify coverage before your visit.",
        },
        {
          q: "How do I file a claim?",
          a: "Most in-network providers file claims automatically. If you paid out-of-pocket, download a claim form from MyUW and submit with receipts to the address listed.",
        },
        {
          q: "What's covered in an emergency?",
          a: "Emergency care is 100% covered after your deductible at any ER, not just UW facilities. Always call 911 or go to the nearest ER for true emergencies.",
        },
      ],
    },
  ];

  const quickTips = [
    "Always bring your insurance card to appointments",
    "Call ahead to confirm your insurance is accepted",
    "Keep track of your deductible and out-of-pocket max",
    "For emergencies, coverage is the same at any ER",
    "Generic prescriptions are usually cheaper than brand-name",
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-12 space-y-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Common questions about your UW student health insurance
          </p>
        </div>

        {/* Quick Tips */}
        <Card className="mb-12 border-primary/20 bg-primary/5 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              💡 Quick Tips
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {quickTips.map((tip, index) => (
                <li key={index}>• {tip}</li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqCategories.map((category, catIndex) => (
            <div 
              key={category.category} 
              className="animate-fade-in-up"
              style={{ animationDelay: `${(catIndex + 2) * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <HelpCircle className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-semibold text-foreground">{category.category}</h2>
                <Badge className={category.color}>{category.questions.length}</Badge>
              </div>

              <Card className="border-border">
                <CardContent className="p-6">
                  <Accordion type="single" collapsible className="w-full">
                    {category.questions.map((item, index) => (
                      <AccordionItem key={index} value={`item-${catIndex}-${index}`}>
                        <AccordionTrigger className="text-left hover:text-primary">
                          <span className="font-medium">{item.q}</span>
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {item.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="mt-12 border-accent/30 bg-accent/5 animate-fade-in-up" style={{ animationDelay: "500ms" }}>
          <CardContent className="p-6 space-y-3">
            <h3 className="font-semibold text-foreground">Still Have Questions?</h3>
            <p className="text-muted-foreground">
              Contact UW Student Health Insurance Services:
            </p>
            <div className="space-y-1 text-sm">
              <p className="text-foreground">📞 Phone: (206) 543-9601</p>
              <p className="text-foreground">📧 Email: insurance@uw.edu</p>
              <p className="text-foreground">🕐 Hours: Mon-Fri, 8am-5pm</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InsuranceFAQ;
