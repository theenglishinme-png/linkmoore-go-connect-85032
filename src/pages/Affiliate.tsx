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
  Store,
  Target,
  CheckCircle2
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { AffiliateNav } from "@/components/AffiliateNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatsCard } from "@/components/StatsCard";
import { ChartWidget } from "@/components/ChartWidget";
import { DataTable } from "@/components/DataTable";
import { api, Offer, Referral } from "@/lib/api";
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
  const [recentReferrals, setRecentReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [affiliateStats, offers, referrals] = await Promise.all([
        api.affiliate.getStats("aff-1"),
        api.offers.getApproved(),
        api.affiliate.getReferrals("aff-1")
      ]);
      
      setStats(affiliateStats);
      setTopOffers(offers.slice(0, 3));
      setRecentReferrals(referrals.slice(0, 5));
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

  // Mock chart data
  const performanceData = [
    { date: "Mon", clicks: 45, conversions: 12 },
    { date: "Tue", clicks: 52, conversions: 15 },
    { date: "Wed", clicks: 38, conversions: 9 },
    { date: "Thu", clicks: 67, conversions: 18 },
    { date: "Fri", clicks: 71, conversions: 22 },
    { date: "Sat", clicks: 55, conversions: 14 },
    { date: "Sun", clicks: 48, conversions: 11 },
  ];

  const commissionData = [
    { name: "Approved", value: stats.totalEarnings, fill: "hsl(var(--success))" },
    { name: "Pending", value: 320.50, fill: "hsl(var(--accent))" },
    { name: "Processing", value: 150.25, fill: "hsl(var(--primary))" },
  ];

  const referralColumns = [
    {
      key: "offerName",
      label: "Offer",
      render: (ref: Referral) => (
        <div>
          <p className="font-medium text-foreground">{ref.offerName}</p>
          <p className="text-xs text-muted-foreground">
            {ref.clickDate.toLocaleDateString()}
          </p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (ref: Referral) => (
        <Badge
          variant={
            ref.status === "APPROVED"
              ? "default"
              : ref.status === "PENDING"
              ? "secondary"
              : "destructive"
          }
          className={
            ref.status === "APPROVED"
              ? "bg-success text-success-foreground"
              : ""
          }
        >
          {ref.status}
        </Badge>
      ),
    },
    {
      key: "commission",
      label: "Commission",
      render: (ref: Referral) => (
        <span className="font-semibold text-foreground">
          {ref.commission.toFixed(2)} MZN
        </span>
      ),
    },
  ];

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
        {/* Navigation Tabs */}
        <AffiliateNav />

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Earnings (MZN)"
            value={stats.totalEarnings.toFixed(2)}
            icon={DollarSign}
            iconColor="text-success"
          />
          <StatsCard
            title="Total Clicks"
            value={stats.totalClicks}
            icon={MousePointerClick}
            iconColor="text-primary"
          />
          <StatsCard
            title="Total Conversions"
            value={stats.totalLeads}
            icon={CheckCircle2}
            iconColor="text-accent"
          />
          <StatsCard
            title="Conversion Rate"
            value={`${((stats.totalLeads / stats.totalClicks) * 100 || 0).toFixed(1)}%`}
            icon={Target}
            iconColor="text-success"
          />
        </div>

        {/* Charts Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <ChartWidget
            title="Performance Over Time"
            type="line"
            data={performanceData}
            dataKeys={{ x: "date", y: ["clicks", "conversions"] }}
            colors={["hsl(var(--primary))", "hsl(var(--success))"]}
          />
          <ChartWidget
            title="Commission Distribution"
            type="pie"
            data={commissionData}
            dataKeys={{ name: "name", value: "value" }}
            height={300}
          />
        </div>

        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
              onClick={() => navigate("/affiliate/clicks")}
            >
              <MousePointerClick className="w-4 h-4 mr-2" />
              View Clicks
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/affiliate/conversions")}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Conversions
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/affiliate/payouts")}
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Payouts
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity and Top Offers */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Referrals */}
          <Card className="shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Referrals</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewReferrals}
                >
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={recentReferrals}
                columns={referralColumns}
                pageSize={5}
                emptyMessage="No referrals yet. Start promoting offers!"
              />
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
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {offer.salesCount} Sales
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {offer.conversionRate.toFixed(1)}% CR
                      </Badge>
                      <Badge className="bg-success text-success-foreground text-xs">
                        {offer.commission.type === "PERCENTAGE"
                          ? `${offer.commission.value}%`
                          : `${offer.commission.value} MZN`}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Affiliate;
