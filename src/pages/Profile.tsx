import { Share2, Gift, Settings, LogOut, User as UserIcon } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { OrderStatusNotifications } from "@/components/OrderStatusNotifications";

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-6">
        <div className="container mx-auto flex items-center gap-4">
          <Avatar className="w-16 h-16 border-2 border-primary-foreground/20">
            <AvatarFallback className="text-xl bg-primary-foreground/10">JS</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-bold">João Silva</h1>
            <p className="text-sm opacity-90">joao@example.com</p>
            <p className="text-sm opacity-90">+258 84 123 4567</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Order Status Notifications */}
        <OrderStatusNotifications />

        {/* Referral Card */}
        <Card 
          className="bg-gradient-accent text-accent-foreground shadow-strong cursor-pointer hover:shadow-hover transition-all"
          onClick={() => navigate('/referrals')}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold text-lg">Earn Together</h3>
                  <p className="text-sm opacity-90">Share products & services to earn</p>
                </div>
              </div>
              <Share2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Menu Options */}
        <div className="space-y-3">
          <Card 
            className="shadow-card cursor-pointer hover:shadow-hover transition-all"
            onClick={() => toast({ title: "Edit Profile", description: "Profile editing would open here" })}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5 text-primary" />
                <span className="font-medium text-foreground">Edit Profile</span>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="shadow-card cursor-pointer hover:shadow-hover transition-all"
            onClick={() => navigate('/referrals')}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-accent" />
                <span className="font-medium text-foreground">Referral History</span>
              </div>
              <span className="text-sm text-muted-foreground">5 friends</span>
            </CardContent>
          </Card>

          <Card 
            className="shadow-card cursor-pointer hover:shadow-hover transition-all"
            onClick={() => toast({ title: "Settings", description: "Settings page would open here" })}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-foreground">Settings</span>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="shadow-card cursor-pointer hover:shadow-hover transition-all"
            onClick={() => toast({ title: "Log Out", description: "Logging out..." })}
          >
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-destructive" />
                <span className="font-medium text-destructive">Log Out</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">24</p>
              <p className="text-xs text-muted-foreground">Total Calls</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-xs text-muted-foreground">Orders</p>
            </CardContent>
          </Card>
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-accent">5</p>
              <p className="text-xs text-muted-foreground">Referrals</p>
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Profile;
