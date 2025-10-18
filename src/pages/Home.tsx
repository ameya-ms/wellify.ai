import { Link } from "react-router-dom";
import { Activity, Clock, Heart, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/hero-image.jpg";

const Home = () => {
  const features = [
    {
      icon: Activity,
      title: "Find the Right Care",
      description: "Get personalized recommendations for where to go based on your symptoms and wait times.",
    },
    {
      icon: Clock,
      title: "Real-Time Wait Times",
      description: "See current wait times at Hall Health, UWMC, and urgent care facilities.",
    },
    {
      icon: Heart,
      title: "Easy Medication Access",
      description: "Order prescriptions and comfort supplies with one-tap delivery.",
    },
    {
      icon: Shield,
      title: "Insurance Made Simple",
      description: "Understand your coverage with AI-powered answers in plain language.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl font-bold text-primary leading-tight">
                  Making Being Sick Easier at UW
                </h1>
                <p className="text-xl text-muted-foreground">
                  Navigate healthcare with confidence. Find care, order meds, and understand your insurance—all in one place.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/symptoms">
                  <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary-light shadow-lg hover:shadow-xl transition-all">
                    Check Your Symptoms
                  </Button>
                </Link>
                <Link to="/insurance">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary-lighter/50">
                    Insurance Help
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-hero opacity-20 blur-3xl rounded-full" />
              <img 
                src={heroImage}
                alt="Happy UW students feeling better"
                className="relative rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-4xl font-bold text-primary">How We Help</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We've simplified the confusing parts of being sick so you can focus on feeling better.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card">
                <CardContent className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-hero border-0 shadow-2xl">
            <CardContent className="p-12 text-center space-y-6">
              <h2 className="text-4xl font-bold text-primary-foreground">
                Not Feeling Well?
              </h2>
              <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Start by checking your symptoms. We'll show you exactly where to go and help you get there.
              </p>
              <Link to="/symptoms">
                <Button size="lg" variant="secondary" className="shadow-lg hover:shadow-xl">
                  Get Started Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
