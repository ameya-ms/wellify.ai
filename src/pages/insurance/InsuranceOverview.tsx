import { Link } from "react-router-dom";
import { Shield, FileText, HelpCircle, Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const InsuranceOverview = () => {
  const quickStats = [
    { label: "Active Plan", value: "UW Student Health", icon: Shield },
    { label: "Annual Deductible", value: "$500", icon: FileText },
    { label: "Out-of-Pocket Max", value: "$2,500", icon: CheckCircle },
  ];

  const coverageHighlights = [
    {
      title: "Hall Health Visits",
      coverage: "$20 copay",
      description: "Primary care and same-day appointments",
      color: "bg-success/10 text-success border-success/20",
    },
    {
      title: "UW Medical Center",
      coverage: "80% covered",
      description: "After $500 deductible",
      color: "bg-primary/10 text-primary border-primary/20",
    },
    {
      title: "Emergency Room",
      coverage: "100% covered",
      description: "For true emergencies",
      color: "bg-accent/10 text-accent-foreground border-accent/30",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 space-y-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Insurance Overview
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your UW student health insurance at a glance
          </p>
        </div>

        {/* Insurance Card Upload */}
        <Card className="mb-8 border-border animate-fade-in-up" style={{ animationDelay: "100ms" }}>
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
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Card
                </Button>
                <Button className="hover:scale-105 transition-transform">
                  Select Plan
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {quickStats.map((stat, index) => (
            <Card 
              key={stat.label} 
              className="border-border hover:shadow-lg transition-all animate-fade-in-up group"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <stat.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coverage Highlights */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Coverage Highlights</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {coverageHighlights.map((item, index) => (
              <Card 
                key={item.title} 
                className="border-border hover:shadow-lg transition-all animate-fade-in-up"
                style={{ animationDelay: `${(index + 5) * 100}ms` }}
              >
                <CardContent className="p-6 space-y-3">
                  <Badge className={item.color}>
                    {item.title}
                  </Badge>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-foreground">{item.coverage}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/insurance/plans">
            <Card className="border-border hover:shadow-xl transition-all cursor-pointer group hover:scale-105 duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  View Plan Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  See detailed coverage information for all UW health facilities and services.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/insurance/faq">
            <Card className="border-border hover:shadow-xl transition-all cursor-pointer group hover:scale-105 duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-foreground">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <HelpCircle className="w-5 h-5 text-accent-foreground" />
                  </div>
                  Common Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Find answers to frequently asked questions about your insurance coverage.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InsuranceOverview;
