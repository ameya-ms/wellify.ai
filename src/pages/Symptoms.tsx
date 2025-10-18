import { useState } from "react";
import { Building2, Clock, MapPin, Stethoscope, AlertCircle, Car } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Facility {
  id: string;
  name: string;
  location: string;
  waitTime: string;
  specialty: string;
  services: string[];
  severity: "low" | "medium" | "high";
  distance: string;
}

const Symptoms = () => {
  const [symptoms, setSymptoms] = useState("");
  const [showResults, setShowResults] = useState(false);

  const facilities: Facility[] = [
    {
      id: "hall-health",
      name: "Hall Health Center",
      location: "UW Campus - NE Campus Parkway",
      waitTime: "25-35 min",
      specialty: "Primary Care & Same-Day Visits",
      services: ["Cold & Flu", "Minor Injuries", "Wellness Checks"],
      severity: "low",
      distance: "0.3 miles",
    },
    {
      id: "uw-urgent-care",
      name: "UW Medical Center - Urgent Care",
      location: "Roosevelt Way NE",
      waitTime: "45-55 min",
      specialty: "Urgent Care & Walk-ins",
      services: ["Sprains", "Infections", "Diagnostic Tests"],
      severity: "medium",
      distance: "1.2 miles",
    },
    {
      id: "uwmc",
      name: "UW Medical Center",
      location: "Montlake Blvd NE",
      waitTime: "1-2 hours",
      specialty: "Emergency & Specialized Care",
      services: ["Emergency Care", "Specialist Referrals", "Advanced Treatment"],
      severity: "medium",
      distance: "1.8 miles",
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return "bg-success/10 text-success border-success/20";
      case "medium":
        return "bg-accent/10 text-accent-foreground border-accent/30";
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Check Your Symptoms
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tell us what's wrong, and we'll show you exactly where to go.
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-12 shadow-lg border-border">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <label htmlFor="symptoms" className="block text-sm font-medium text-foreground mb-2">
                  What symptoms are you experiencing?
                </label>
                <Input
                  id="symptoms"
                  type="text"
                  placeholder="e.g., sore throat, fever, headache..."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="text-lg h-12"
                />
              </div>
              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary-light">
                Find Care Options
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {showResults && (
          <div className="space-y-8">
            {/* Emergency Alert (conditional) */}
            <Card className="border-destructive bg-destructive/5">
              <CardContent className="p-6 flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-destructive mt-1 flex-shrink-0" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-destructive text-lg">
                    Experiencing Severe Symptoms?
                  </h3>
                  <p className="text-sm text-foreground">
                    If you have severe chest pain, difficulty breathing, or other life-threatening symptoms, call 911 immediately or go to the nearest emergency room.
                  </p>
                  <Button variant="destructive" size="sm" className="mt-2">
                    Call 911
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-2xl font-semibold text-foreground mb-6">
                Recommended Care Options
              </h2>
              <div className="grid gap-6">
                {facilities.map((facility) => (
                  <Card key={facility.id} className="hover:shadow-xl transition-all duration-300 border-border">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-2xl text-primary">
                            {facility.name}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{facility.location}</span>
                            <span className="text-sm">• {facility.distance}</span>
                          </div>
                        </div>
                        <Badge className={getSeverityColor(facility.severity)}>
                          Best Match
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                          <Clock className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-xs text-muted-foreground">Wait Time</div>
                            <div className="font-semibold text-foreground">{facility.waitTime}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg">
                          <Stethoscope className="w-5 h-5 text-primary" />
                          <div>
                            <div className="text-xs text-muted-foreground">Specialty</div>
                            <div className="font-semibold text-foreground text-sm">{facility.specialty}</div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm font-medium text-foreground mb-2">Services Available:</div>
                        <div className="flex flex-wrap gap-2">
                          {facility.services.map((service) => (
                            <Badge key={service} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button className="flex-1 bg-[#000000] hover:bg-[#000000]/90 text-white">
                          <Car className="w-4 h-4 mr-2" />
                          Request Uber
                        </Button>
                        <Button className="flex-1 bg-[#FF00BF] hover:bg-[#FF00BF]/90 text-white">
                          <Car className="w-4 h-4 mr-2" />
                          Request Lyft
                        </Button>
                        <Button variant="outline" className="border-primary text-primary hover:bg-primary-lighter/50">
                          <MapPin className="w-4 h-4 mr-2" />
                          Directions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Symptoms;
