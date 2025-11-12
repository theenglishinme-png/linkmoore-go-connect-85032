import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  MousePointerClick, 
  Users, 
  DollarSign,
  ShoppingBag,
  ArrowRight,
  RefreshCw,
  Store
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api, Offer } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Affiliate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalEarnings: 0,
    totalClicks: 0,
    totalLeads: 0,
    totalReferrals: 0,
  });
  const [topOffers, setTopOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [affiliateStats, offers] = await Promise.all([
        api.affiliate.getStats("aff-1"),
        api.offers.getApproved()
      ]);
      
      setStats(affiliateStats);
      setTopOffers(offers.slice(0, 3)); // Top 3 offers
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error loading dashboard",
        description: "Please try again later",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleViewMarketplace = () => {
    navigate("/referrals");
  };

  const handleViewReferrals = () => {
    navigate("/profile");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Affiliate Dashboard</h1>
              <p className="text-sm opacity-90">Track your performance & earnings</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/promoter")}
            >
              Switch to Promoter
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <DollarSign className="w-5 h-5 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalEarnings.toFixed(2)}
              </p>
              <p className="text-xs text-muted-foreground">Total Earnings (MZN)</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <MousePointerClick className="w-5 h-5 text-primary" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.totalClicks}</p>
              <p className="text-xs text-muted-foreground">Total Clicks</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <Users className="w-5 h-5 text-accent" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.totalLeads}</p>
              <p className="text-xs text-muted-foreground">Total Leads</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-success" />
              </div>
              <p className="text-2xl font-bold text-foreground">{stats.totalReferrals}</p>
              <p className="text-xs text-muted-foreground">Referrals</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button
              variant="default"
              className="w-full"
              onClick={handleViewMarketplace}
            >
              <Store className="w-4 h-4 mr-2" />
              Browse Offers
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleViewReferrals}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              My Referrals
            </Button>
          </CardContent>
        </Card>

        {/* Top Offers */}
        <Card className="shadow-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Top Converting Offers</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewMarketplace}
              >
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {topOffers.map((offer) => (
              <Card
                key={offer.id}
                className="cursor-pointer hover:shadow-hover transition-all border"
                onClick={() => navigate(`/referrals`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">{offer.name}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{offer.vendorName}</p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {offer.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap mt-3">
                    <Badge variant="outline" className="text-xs">
                      {offer.salesCount} Sales
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {offer.epc.toFixed(2)} MZN EPC
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {offer.conversionRate.toFixed(1)}% CR
                    </Badge>
                    <Badge className="bg-success text-success-foreground text-xs">
                      {offer.commission.type === "PERCENTAGE"
                        ? `${offer.commission.value}% Commission`
                        : `${offer.commission.value} MZN`}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Affiliate;
