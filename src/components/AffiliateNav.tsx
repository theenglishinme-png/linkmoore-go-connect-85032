import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, MousePointerClick, CheckCircle2, Wallet, Store } from "lucide-react";
import { cn } from "@/lib/utils";

export const AffiliateNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: "/affiliate", label: "Dashboard", icon: Home },
    { path: "/referrals", label: "Offers", icon: Store },
    { path: "/affiliate/clicks", label: "Clicks", icon: MousePointerClick },
    { path: "/affiliate/conversions", label: "Conversions", icon: CheckCircle2 },
    { path: "/affiliate/payouts", label: "Payouts", icon: Wallet },
  ];

  return (
    <Card className="shadow-card">
      <CardContent className="p-3">
        <div className="flex gap-2 overflow-x-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => navigate(item.path)}
                className={cn(
                  "whitespace-nowrap",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
