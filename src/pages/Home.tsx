import { Link } from "react-router-dom";
import { Activity, Clock, Heart, Shield, ArrowRight, Zap, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollReveal } from "@/components/ScrollReveal";
import heroImage from "@/assets/hero-image.jpg";
import hallHealthExterior from "@/assets/hall-health-exterior.jpg";
import studentsApp from "@/assets/students-app.jpg";
import doctorConsultation from "@/assets/doctor-consultation.jpg";

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

  const benefits = [
    {
      icon: Zap,
      title: "Instant Symptom Analysis",
      description: "Our AI analyzes your symptoms in seconds and recommends the best care facility for your needs.",
      image: studentsApp,
    },
    {
      icon: CheckCircle,
      title: "Professional Medical Support",
      description: "Connect with UW healthcare professionals who understand student life and health challenges.",
      image: doctorConsultation,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image with Low Opacity */}
        <div className="absolute inset-0 -z-10">
          <img
            src={heroImage}
            alt=""
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        </div>
        
        {/* Centered Content */}
        <div className="container mx-auto px-4 text-center py-32">
          <ScrollReveal>
            <div className="max-w-4xl mx-auto space-y-8">
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                taking "get well soon" literally.
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
                Navigate healthcare with confidence. Find care, order meds, and understand your insurance, all in
                one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                <Link to="/symptoms">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto shadow-lg hover:shadow-primary/50 hover:scale-105 transition-all group"
                  >
                    Check Your Symptoms
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link to="/insurance">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-primary/50 text-foreground hover:bg-primary/10 hover:border-primary"
                  >
                    Insurance Help
                  </Button>
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-4xl font-bold text-foreground">How We Help</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                We've simplified the confusing parts of being sick so you can focus on feeling better.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }, index) => (
              <ScrollReveal key={title} delay={index * 100} direction="up">
                <Card className="border-border/50 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 bg-card/80 backdrop-blur-sm group h-full">
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                    <p className="text-muted-foreground">{description}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Hall Health Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="left">
              <div className="relative">
                <div className="absolute -inset-4 bg-accent/20 blur-3xl rounded-full" />
                <img
                  src={hallHealthExterior}
                  alt="Hall Health Center exterior"
                  className="relative rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" delay={200}>
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                  <span className="text-primary font-semibold">On-Campus Care</span>
                </div>
                <h2 className="text-4xl font-bold text-foreground">Your Health, Steps Away</h2>
                <p className="text-lg text-muted-foreground">
                  Hall Health Center is right on campus, making it easy to get the care you need without disrupting your
                  schedule. From cold and flu to mental health support, we're here for you.
                </p>
                <ul className="space-y-3">
                  {[
                    "Walk-in appointments available",
                    "Same-day urgent care",
                    "Mental health counseling",
                    "Pharmacy on-site",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3 text-foreground">
                      <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <Link to="/symptoms">
                  <Button size="lg" className="mt-4 hover:scale-105 transition-transform">
                    Find Care Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl font-bold text-foreground">Why Students Love Wellify</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built specifically for UW students, by people who understand your needs.
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-24">
            {benefits.map((benefit, index) => (
              <div key={benefit.title} className="grid lg:grid-cols-2 gap-12 items-center">
                <ScrollReveal direction="left" delay={100}>
                  <div className="relative">
                    <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full" />
                    <img
                      src={benefit.image}
                      alt={benefit.title}
                      className="relative rounded-2xl shadow-2xl w-full h-auto"
                    />
                  </div>
                </ScrollReveal>

                <ScrollReveal direction="right" delay={200}>
                  <div className="space-y-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold text-foreground">{benefit.title}</h3>
                    <p className="text-lg text-muted-foreground">{benefit.description}</p>
                  </div>
                </ScrollReveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal direction="scale">
            <Card className="bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 border-primary/30 shadow-2xl shadow-primary/30 backdrop-blur-sm">
              <CardContent className="p-12 text-center space-y-6">
                <h2 className="text-4xl font-bold text-foreground">Not Feeling Well?</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Start by checking your symptoms. We'll show you exactly where to go and help you get there.
                </p>
                <Link to="/symptoms">
                  <Button
                    size="lg"
                    className="shadow-lg hover:shadow-xl hover:shadow-primary/50 hover:scale-105 transition-all"
                  >
                    Get Started Now
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default Home;
