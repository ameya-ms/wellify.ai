import { useState, useRef } from "react";
import { Clock, MapPin, Stethoscope, AlertCircle, Car, Activity, Thermometer, Heart, Brain, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SymptomSearch } from "@/components/SymptomSearch";
import UberBooking from "@/components/UberBooking";
import LyftBooking from "@/components/LyftBooking";

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

const symptomCategories = [
  { icon: Thermometer, label: "Fever & Chills", color: "bg-destructive/10 text-destructive border-destructive/20" },
  { icon: Activity, label: "Respiratory", color: "bg-primary/10 text-primary border-primary/20" },
  { icon: Heart, label: "Digestive", color: "bg-accent/10 text-accent-foreground border-accent/30" },
  { icon: Brain, label: "Neurological", color: "bg-success/10 text-success border-success/20" },
];

const Symptoms = () => {
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customSymptom, setCustomSymptom] = useState("");
  const customInputRef = useRef<HTMLInputElement>(null);

  const facilities: Facility[] = [
    {
      id: "hall-health",
      name: "Hall Health Center",
      location: "3920 NE Stevens Way, Seattle, WA 98195",
      waitTime: "25 min",
      specialty: "Primary care clinic serving UW students and faculty",
      services: ["Cold & Flu", "Minor Injuries", "Wellness Checks"],
      severity: "low",
      distance: "0.3 miles",
    },
    {
      id: "uw-urgent-care",
      name: "UW Medical Center - Urgent Care",
      location: "4245 Roosevelt Way NE, Seattle, WA 98105",
      waitTime: "35 min",
      specialty: "Urgent care for non-emergency medical needs",
      services: ["Sprains", "Infections", "Diagnostic Tests"],
      severity: "medium",
      distance: "1.2 miles",
    },
    {
      id: "uwmc",
      name: "UW Medical Center",
      location: "1959 NE Pacific St, Seattle, WA 98195",
      waitTime: "45 min",
      specialty: "Full-service hospital with 24/7 emergency care",
      services: ["Emergency Care", "Specialist Referrals", "Advanced Treatment"],
      severity: "medium",
      distance: "1.8 miles",
    },
  ];

  const handleContinue = () => {
    if (symptoms.length > 0) {
      setShowResults(true);
    }
  };

  const handleCategoryClick = (category: string) => {
    setSymptoms([category]);
    setShowResults(true);
  };

  const handleAddCustomSymptom = () => {
    if (customSymptom.trim()) {
      setSymptoms([...symptoms, customSymptom.trim()]);
      setCustomSymptom("");
      setShowCustomInput(false);
    }
  };

  const handleCustomInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddCustomSymptom();
    }
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
    <div className="min-h-screen pt-32 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {!showResults ? (
          <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="relative text-center space-y-4 mb-8">
              <div className="absolute inset-0 -z-10 opacity-10 rounded-2xl overflow-hidden h-64">
                <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80" alt="" className="w-full h-full object-cover" />
              </div>
              <div className="py-20">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                  What are your symptoms?
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Tell us what you're experiencing, and we'll recommend the best care option for you.
                </p>
              </div>
            </div>

            {/* Search and Symptom Selection Combined */}
            <Card className="shadow-xl border-border/50 backdrop-blur-sm">
              <CardContent className="p-6 space-y-6">
                {/* Search Bar */}
                <div className="space-y-3">
                  <SymptomSearch onSymptomChange={setSymptoms} />
                  
                  {/* Selected Symptoms Display */}
                  {symptoms.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {symptoms.map((symptom) => (
                        <Badge
                          key={symptom}
                          className="bg-primary text-primary-foreground pl-3 pr-2 py-1.5 flex items-center gap-2"
                        >
                          {symptom}
                          <button
                            onClick={() => setSymptoms(symptoms.filter(s => s !== symptom))}
                            className="hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">or select below</span>
                  </div>
                </div>

                {/* Multiselect Symptom Grid */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">
                    Select Your Symptoms
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {[
                      "Fever", "Cough", "Headache", "Sore Throat", 
                      "Nausea", "Fatigue", "Body Aches", "Chills",
                      "Congestion", "Runny Nose", "Sneezing", "Dizziness",
                      "Shortness of Breath", "Chest Pain", "Stomach Pain"
                    ].map((symptom) => (
                      <button
                        key={symptom}
                        onClick={() => {
                          if (symptoms.includes(symptom)) {
                            setSymptoms(symptoms.filter(s => s !== symptom));
                          } else {
                            setSymptoms([...symptoms, symptom]);
                          }
                        }}
                        className={`p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                          symptoms.includes(symptom)
                            ? "bg-primary text-primary-foreground border-primary shadow-md"
                            : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                        }`}
                      >
                        {symptom}
                      </button>
                    ))}
                    
                    {/* Add Custom Symptom Button/Input */}
                    {!showCustomInput ? (
                      <button
                        onClick={() => {
                          setShowCustomInput(true);
                          setTimeout(() => customInputRef.current?.focus(), 100);
                        }}
                        className="p-3 rounded-lg border-2 border-dashed border-primary/50 text-sm font-medium transition-all duration-200 bg-card text-primary hover:border-primary hover:bg-primary/5 flex items-center justify-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Symptom
                      </button>
                    ) : (
                      <div className="p-2 rounded-lg border-2 border-primary bg-card flex items-center gap-2">
                        <input
                          ref={customInputRef}
                          type="text"
                          value={customSymptom}
                          onChange={(e) => setCustomSymptom(e.target.value)}
                          onKeyDown={handleCustomInputKeyDown}
                          onBlur={() => {
                            if (!customSymptom.trim()) {
                              setShowCustomInput(false);
                            }
                          }}
                          placeholder="Enter symptom..."
                          className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
                        />
                        <button
                          onClick={handleAddCustomSymptom}
                          className="text-primary hover:text-primary/80"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Categories */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-foreground text-center">
                Or select a category
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {symptomCategories.map((category, index) => (
                  <button
                    key={category.label}
                    onClick={() => handleCategoryClick(category.label)}
                    className="group relative overflow-hidden rounded-xl p-6 border-2 hover:scale-105 transition-all duration-300 animate-scale-in bg-card hover:shadow-xl"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex flex-col items-center gap-3 relative z-10">
                      <category.icon className="h-8 w-8 text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium text-foreground text-center">
                        {category.label}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            {/* Continue Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleContinue}
                disabled={symptoms.length === 0}
                size="lg"
                className="px-12 py-6 text-lg hover:scale-105 transition-transform"
              >
                Continue to Results
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-fade-in">
            {/* Back button */}
            <Button
              variant="outline"
              onClick={() => setShowResults(false)}
              className="mb-4"
            >
              ← Back to Search
            </Button>

            {/* Emergency Alert */}
            <Card className="border-destructive bg-destructive/5 animate-scale-in">
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
                {facilities.map((facility, index) => (
                  <Card
                    key={facility.id}
                    className="hover:shadow-2xl transition-all duration-300 border-border/50 backdrop-blur-sm animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <CardHeader className="pb-3">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <CardTitle className="text-2xl text-foreground">
                            {facility.name}
                          </CardTitle>
                          {index === 0 && (
                            <Badge className="bg-primary text-primary-foreground">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {facility.specialty}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Hours */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Hours</h4>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Monday-Sunday</span>
                          <span className="text-foreground">24 Hours - 24 Hours</span>
                        </div>
                      </div>

                      {/* Estimated Wait Time */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Estimated Wait Time</h4>
                        <p className="text-sm text-foreground">{facility.waitTime}</p>
                      </div>

                      {/* Location */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Location</h4>
                        <p className="text-sm text-foreground">{facility.location}</p>
                      </div>

                      {/* Get Directions */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Get Directions:</h4>
                        <div className="space-y-3">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(facility.location)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-primary hover:underline text-sm"
                          >
                            <MapPin className="w-4 h-4" />
                            Open in Google Maps
                          </a>
                          <div className="flex gap-3">
                            <UberBooking 
                              destination={{
                                name: facility.name,
                                address: facility.location,
                                latitude: facility.id === "hall-health" ? 47.6553 : 
                                         facility.id === "uw-urgent-care" ? 47.6603 : 47.6503,
                                longitude: facility.id === "hall-health" ? -122.3035 : 
                                          facility.id === "uw-urgent-care" ? -122.3135 : -122.3135
                              }}
                              onRideBooked={(result) => {
                                console.log('Uber ride booked:', result);
                              }}
                            />
                            <LyftBooking 
                              destination={{
                                name: facility.name,
                                address: facility.location,
                                latitude: facility.id === "hall-health" ? 47.6553 : 
                                         facility.id === "uw-urgent-care" ? 47.6603 : 47.6503,
                                longitude: facility.id === "hall-health" ? -122.3035 : 
                                          facility.id === "uw-urgent-care" ? -122.3135 : -122.3135
                              }}
                              onRideBooked={(result) => {
                                console.log('Lyft ride booked:', result);
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Contact */}
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Contact</h4>
                        <div className="flex items-center gap-3 text-sm">
                          <a href="tel:(206)598-3300" className="text-primary hover:underline">
                            (206) 598-3300
                          </a>
                          <span className="text-muted-foreground">•</span>
                          <a href="#" className="text-primary hover:underline">
                            Visit MyChart
                          </a>
                        </div>
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
