import { Link, useLocation } from "react-router-dom";
import { Activity, Home, Pill, Shield, LogIn, LogOut, User } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/use-toast";
import logo from "../assets/insurance/wellify_logo.png";

const Navigation = () => {
  const location = useLocation();
  const { isAuthenticated, user, signOut, loading } = useAuth();
  const { toast } = useToast();

  // Don't render navigation if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was an error signing you out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
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
                className="h-24 md:h-32 w-auto object-contain bg-transparent ml-2"
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
            {isAuthenticated ? (
              <div className="flex items-center space-x-2 ml-2">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{user?.attributes?.email || user?.username}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              </div>
            ) : (
              <Link to="/signin">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 ml-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Button>
              </Link>
            )}
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
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="p-2"
              >
                <LogOut className="w-5 h-5" />
              </Button>
            ) : (
              <Link to="/signin">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                >
                  <LogIn className="w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
