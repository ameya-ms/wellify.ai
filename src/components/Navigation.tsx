import { Link, useLocation } from "react-router-dom";
import { Activity, Home, Pill, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/insurance/wellify_logo.png";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/symptoms", label: "Check Symptoms", icon: Activity },
    { path: "/meds", label: "Meds & Delivery", icon: Pill },
    { path: "/insurance", label: "Insurance Info", icon: Shield },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-md border-b border-border/50 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-3 group">
              {/* constrain by height so it never overflows the nav; keep aspect ratio with w-auto */}
              <img
                src={logo}
                alt="Wellify logo"
                className="h-12 md:h-16 w-auto object-contain bg-transparent ml-2"
              />
            <span className="sr-only">wellify.ai</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200",
                  "hover:bg-primary-lighter/50",
                  location.pathname === path
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </div>
          
          <div className="md:hidden flex items-center space-x-1">
            {navItems.map(({ path, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={cn(
                  "p-2 rounded-lg transition-all duration-200",
                  "hover:bg-primary-lighter/50",
                  location.pathname === path
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
