import { Package, Pill, ShoppingBag, Truck, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { cn } from "@/lib/utils";
import chickenSoup from "@/assets/chicken-soup.jpg";
import gingerTea from "@/assets/ginger-tea.jpg";
import tissues from "@/assets/tissues.jpg";
import thermometer from "@/assets/thermometer.jpg";
import orangeJuice from "@/assets/orange-juice.jpg";
import vitamins from "@/assets/vitamins.jpg";

const Meds = () => {
  const [expandedRx, setExpandedRx] = useState<string | null>(null);
  const prescriptions = [
    {
      id: "1",
      name: "Amoxicillin 500mg",
      dosage: "Take 1 capsule 3 times daily",
      refillsLeft: 2,
      copay: "$10",
    },
    {
      id: "2",
      name: "Ibuprofen 200mg",
      dosage: "Take 1-2 tablets every 4-6 hours as needed",
      refillsLeft: 0,
      copay: "$5",
    },
  ];

  const comfortItems = [
    { name: "Chicken Noodle Soup", category: "Food", image: chickenSoup },
    { name: "Ginger Tea", category: "Beverages", image: gingerTea },
    { name: "Tissues (3-pack)", category: "Essentials", image: tissues },
    { name: "Digital Thermometer", category: "Medical", image: thermometer },
    { name: "Orange Juice", category: "Beverages", image: orangeJuice },
    { name: "Vitamin C", category: "Supplements", image: vitamins },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Medications & Supplies
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Fill prescriptions and order comfort items—all delivered to your door.
          </p>
        </div>

        {/* Prescriptions Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Pill className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Your Prescriptions</h2>
          </div>
          <div className="grid gap-4">
            {prescriptions.map((rx, index) => (
              <Card 
                key={rx.id} 
                className="border-border hover:shadow-lg transition-all animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Pill className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{rx.name}</h3>
                          <p className="text-sm text-muted-foreground">{rx.dosage}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {rx.refillsLeft} refills left
                            </Badge>
                            <span className="text-sm font-medium text-primary">{rx.copay} copay</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 md:w-auto w-full">
                      <Collapsible open={expandedRx === `${rx.id}-amazon`} onOpenChange={(open) => setExpandedRx(open ? `${rx.id}-amazon` : null)}>
                        <CollapsibleTrigger asChild>
                          <Button className="bg-[#FF9900] hover:bg-[#FF9900]/90 text-white w-full justify-between">
                            <div className="flex items-center">
                              <Package className="w-4 h-4 mr-2" />
                              Amazon Pharmacy
                            </div>
                            <ChevronDown className={cn("w-4 h-4 transition-transform", expandedRx === `${rx.id}-amazon` && "rotate-180")} />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 p-4 bg-card/50 rounded-lg border border-border">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-foreground">Amazon Pharmacy</span>
                              <Badge className="bg-[#FF9900] text-white">Prime Eligible</Badge>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Price:</span>
                                <span className="font-medium text-foreground">{rx.copay}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Delivery:</span>
                                <span className="font-medium text-success">FREE 1-2 Day Shipping</span>
                              </div>
                            </div>
                            <Button className="w-full bg-[#FFD814] hover:bg-[#FFD814]/90 text-black font-semibold">
                              Add to Amazon Cart
                            </Button>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>

                      <Collapsible open={expandedRx === `${rx.id}-walgreens`} onOpenChange={(open) => setExpandedRx(open ? `${rx.id}-walgreens` : null)}>
                        <CollapsibleTrigger asChild>
                          <Button className="bg-[#E31837] hover:bg-[#E31837]/90 text-white w-full justify-between">
                            <div className="flex items-center">
                              <Truck className="w-4 h-4 mr-2" />
                              Walgreens
                            </div>
                            <ChevronDown className={cn("w-4 h-4 transition-transform", expandedRx === `${rx.id}-walgreens` && "rotate-180")} />
                          </Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 p-4 bg-card/50 rounded-lg border border-border">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-foreground">Walgreens Pharmacy</span>
                              <Badge className="bg-[#E31837] text-white">myWalgreens</Badge>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Price:</span>
                                <span className="font-medium text-foreground">{rx.copay}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Pickup:</span>
                                <span className="font-medium text-[hsl(var(--blue))]">Ready in 1 hour</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Delivery:</span>
                                <span className="font-medium text-success">Same-day available</span>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <Button className="bg-[#E31837] hover:bg-[#E31837]/90 text-white font-semibold">
                                Order Pickup
                              </Button>
                              <Button variant="outline" className="border-[#E31837] text-[#E31837] hover:bg-[#E31837]/10 font-semibold">
                                Delivery
                              </Button>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Comfort Items Section */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <ShoppingBag className="w-6 h-6 text-[hsl(var(--blue))]" />
            <h2 className="text-2xl font-semibold text-foreground">Comfort & Supplies</h2>
          </div>
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Recommended for Your Recovery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {comfortItems.map((item, index) => (
                  <Card 
                    key={item.name} 
                    className="border-border hover:shadow-md transition-all overflow-hidden group animate-fade-in-up hover:scale-105"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-4 space-y-3">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="space-y-1 text-center">
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-[#FF6B6B] hover:bg-[#FF6B6B]/90 text-white text-xs">
                          <Truck className="w-3 h-3 mr-1" />
                          DoorDash
                        </Button>
                        <Button size="sm" className="flex-1 bg-[#FF9F00] hover:bg-[#FF9F00]/90 text-white text-xs">
                          <ShoppingBag className="w-3 h-3 mr-1" />
                          Instacart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="mt-8 border-accent/30 bg-accent-lighter">
          <CardContent className="p-6 flex items-start gap-4">
            <Package className="w-6 h-6 text-accent-foreground mt-1 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-semibold text-accent-foreground">Fast, Contactless Delivery</h3>
              <p className="text-sm text-accent-foreground/80">
                Most items can be delivered within 1-2 hours. Prescriptions typically arrive within 24 hours.
                All deliveries are contactless for your safety.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Meds;
