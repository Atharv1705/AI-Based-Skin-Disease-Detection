import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { 
  Camera, 
  Home, 
  History, 
  Info, 
  User, 
  Menu, 
  X,
  Stethoscope,
  LogOut,
  LogIn
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Detection", href: "/detection", icon: Camera, protected: true },
  { name: "History", href: "/history", icon: History, protected: true },
  { name: "About", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: Info },
  { name: "Profile", href: "/profile", icon: User, protected: true },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  return (
    <nav className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                SkinAI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              // Skip protected routes if user is not authenticated
              if (!user && item.protected) {
                return null;
              }
              
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? "medical" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center space-x-2",
                      isActive && "shadow-medical"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Button>
                </Link>
              );
            })}
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Auth Buttons */}
            {user ? (
              <Button
                onClick={signOut}
                variant="outline"
                size="sm"
                className="text-foreground hover:text-destructive transition-colors ml-2"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="medical" size="sm" className="ml-2">
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card/95 backdrop-blur-md rounded-lg mt-2 shadow-card">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                // Skip protected routes if user is not authenticated
                if (!user && item.protected) {
                  return null;
                }
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className="block"
                  >
                    <Button
                      variant={isActive ? "medical" : "ghost"}
                      size="sm"
                      className="w-full justify-start space-x-2"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Button>
                  </Link>
                );
              })}
              
              {/* Theme Toggle Mobile */}
              <div className="px-3 py-2">
                <ThemeToggle />
              </div>
              
              {/* Mobile Auth Buttons */}
              {user ? (
                <Button
                  onClick={() => {
                    signOut();
                    setIsOpen(false);
                  }}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start space-x-2 text-foreground hover:text-destructive transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </Button>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)} className="block">
                  <Button variant="medical" size="sm" className="w-full justify-start space-x-2">
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}