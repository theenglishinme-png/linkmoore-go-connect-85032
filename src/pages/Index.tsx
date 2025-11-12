import { useState } from "react";
import { Phone, Sparkles, Wallet, Shield } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { CategoryTabs } from "@/components/CategoryTabs";
import { ServiceCard } from "@/components/ServiceCard";
import { WalletCard } from "@/components/WalletCard";
import { BottomNav } from "@/components/BottomNav";
import { BusinessCallOrderDialog } from "@/components/BusinessCallOrderDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [activeTab, setActiveTab] = useState("call");
  const { toast } = useToast();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"call" | "order">("call");
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);

  const handleSearch = (query: string) => {
    toast({
      title: "Searching...",
      description: `Looking for: ${query}`,
    });
    navigate(`/search?q=${query}`);
  };

  const handleCall = (service: typeof featuredServices[0]) => {
    setSelectedBusiness({
      id: service.id,
      name: service.name,
      category: service.category,
      rating: service.rating,
      verified: service.verified,
      phone: "+258 84 111 1111",
      description: "Quality service provider in Maputo",
      hours: "9:00 AM - 6:00 PM",
      location: "Maputo",
    });
    setDialogMode("call");
    setDialogOpen(true);
  };

  const handleOrder = (service: typeof featuredServices[0]) => {
    setSelectedBusiness({
      id: service.id,
      name: service.name,
      category: service.category,
      rating: service.rating,
      verified: service.verified,
      phone: "+258 84 111 1111",
      description: "Quality service provider in Maputo",
      hours: "9:00 AM - 6:00 PM",
      location: "Maputo",
    });
    setDialogMode("order");
    setDialogOpen(true);
  };

  const featuredServices = [
    {
      id: "1",
      name: "Pizza Maputo",
      category: "Food & Delivery",
      rating: 4.5,
      verified: true,
      price: "150-300 MZN",
    },
    {
      id: "2",
      name: "Quick Plumbing",
      category: "Home Services",
      rating: 4.8,
      verified: true,
      price: "500+ MZN",
    },
    {
      id: "3",
      name: "TaxiGo",
      category: "Transportation",
      rating: 4.3,
      verified: true,
      price: "50-200 MZN",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              LinkMoore Go
            </h1>
            <p className="text-sm text-muted-foreground">Call. Order. Earn.</p>
          </div>
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Wallet Card */}
        <WalletCard 
          balance={1250.50} 
          cashback={45.20} 
          referralEarnings={120.00} 
        />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="call" 
            className="h-20 flex-col gap-2"
            onClick={() => navigate("/search")}
          >
            <Phone className="w-6 h-6" />
            <span>Call Business</span>
          </Button>
          <Button 
            variant="earn" 
            className="h-20 flex-col gap-2"
            onClick={() => navigate("/referrals")}
          >
            <Wallet className="w-6 h-6" />
            <span>Earn & Refer</span>
          </Button>
        </div>

        {/* Featured Services */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Featured Services</h2>
            <Button variant="link" className="text-sm" onClick={() => navigate("/search")}>
              View All
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {featuredServices.map((service) => (
              <ServiceCard
                key={service.id}
                {...service}
                onCall={() => handleCall(service)}
                onOrder={() => handleOrder(service)}
              />
            ))}
          </div>
        </section>

        {/* Categories Grid */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Browse Categories</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { name: "Food", emoji: "🍕" },
              { name: "Transport", emoji: "🚗" },
              { name: "Home", emoji: "🏠" },
              { name: "Beauty", emoji: "💇" },
              { name: "Health", emoji: "⚕️" },
              { name: "Shopping", emoji: "🛍️" },
            ].map((category) => (
              <button
                key={category.name}
                className="bg-card rounded-lg p-4 shadow-card hover:shadow-hover transition-all flex flex-col items-center gap-2"
                onClick={() => handleSearch(category.name)}
              >
                <span className="text-3xl">{category.emoji}</span>
                <span className="text-sm font-medium text-foreground">{category.name}</span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Admin Access Button - Fixed position */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 right-4 z-50 bg-card border-2 border-primary shadow-strong"
        onClick={() => navigate("/admin")}
        title="Admin Panel"
      >
        <Shield className="w-5 h-5 text-primary" />
      </Button>

      {/* Business Call/Order Dialog */}
      {selectedBusiness && (
        <BusinessCallOrderDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          business={selectedBusiness}
          mode={dialogMode}
        />
      )}

    </div>
  );
};

export default Index;

