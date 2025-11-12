import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { AffiliateNav } from "@/components/AffiliateNav";
import { MousePointerClick, RefreshCw, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/StatsCard";
import { ChartWidget } from "@/components/ChartWidget";
import { DataTable } from "@/components/DataTable";
import { FilterBar } from "@/components/FilterBar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Click {
  id: string;
  affiliateId: string;
  referralCode: string;
  landingPage: string;
  referrer: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  converted: boolean;
}

const AffiliateClicks = () => {
  const { toast } = useToast();
  const [clicks, setClicks] = useState<Click[]>([]);
  const [filteredClicks, setFilteredClicks] = useState<Click[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClicksData();
  }, []);

  useEffect(() => {
    filterClicks();
  }, [searchQuery, clicks]);

  const loadClicksData = async () => {
    try {
      // Mock data - replace with actual API call
      const mockClicks: Click[] = [
        {
          id: "click-1",
          affiliateId: "aff-1",
          referralCode: "REF123",
          landingPage: "/offers/food-delivery",
          referrer: "facebook.com",
          ipAddress: "197.231.xxx.xxx",
          userAgent: "Mobile Safari",
          timestamp: new Date("2024-03-10T14:30:00"),
          converted: true,
        },
        {
          id: "click-2",
          affiliateId: "aff-1",
          referralCode: "REF123",
          landingPage: "/offers/home-services",
          referrer: "twitter.com",
          ipAddress: "197.232.xxx.xxx",
          userAgent: "Chrome Mobile",
          timestamp: new Date("2024-03-10T15:45:00"),
          converted: false,
        },
        {
          id: "click-3",
          affiliateId: "aff-1",
          referralCode: "REF123",
          landingPage: "/offers/food-delivery",
          referrer: "instagram.com",
          ipAddress: "197.233.xxx.xxx",
          userAgent: "Chrome",
          timestamp: new Date("2024-03-11T09:15:00"),
          converted: true,
        },
      ];
      
      setClicks(mockClicks);
      setFilteredClicks(mockClicks);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error loading clicks",
        description: "Please try again later",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const filterClicks = () => {
    if (!searchQuery) {
      setFilteredClicks(clicks);
      return;
    }

    const filtered = clicks.filter(
      (click) =>
        click.referralCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        click.landingPage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        click.referrer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredClicks(filtered);
  };

  const clicksPerDay = [
    { date: "Mar 5", clicks: 34 },
    { date: "Mar 6", clicks: 42 },
    { date: "Mar 7", clicks: 38 },
    { date: "Mar 8", clicks: 51 },
    { date: "Mar 9", clicks: 47 },
    { date: "Mar 10", clicks: 63 },
    { date: "Mar 11", clicks: 55 },
  ];

  const clicksBySource = [
    { name: "Facebook", clicks: 125 },
    { name: "Instagram", clicks: 98 },
    { name: "Twitter", clicks: 76 },
    { name: "Direct", clicks: 45 },
    { name: "Other", clicks: 32 },
  ];

  const columns = [
    {
      key: "timestamp",
      label: "Date & Time",
      render: (click: Click) => (
        <div>
          <p className="font-medium text-foreground">
            {click.timestamp.toLocaleDateString()}
          </p>
          <p className="text-xs text-muted-foreground">
            {click.timestamp.toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    {
      key: "referralCode",
      label: "Referral Code",
      render: (click: Click) => (
        <Badge variant="outline">{click.referralCode}</Badge>
      ),
    },
    {
      key: "landingPage",
      label: "Landing Page",
    },
    {
      key: "referrer",
      label: "Source",
      render: (click: Click) => (
        <span className="text-sm text-muted-foreground">{click.referrer}</span>
      ),
    },
    {
      key: "converted",
      label: "Status",
      render: (click: Click) => (
        <Badge
          variant={click.converted ? "default" : "secondary"}
          className={click.converted ? "bg-success text-success-foreground" : ""}
        >
          {click.converted ? "Converted" : "Pending"}
        </Badge>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="bg-gradient-primary text-primary-foreground p-6">
        <div className="container mx-auto">
          <div className="flex items-center gap-3">
            <MousePointerClick className="w-6 h-6" />
            <div>
              <h1 className="text-2xl font-bold">Click Tracking</h1>
              <p className="text-sm opacity-90">Monitor your referral clicks</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <AffiliateNav />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatsCard
            title="Total Clicks"
            value={clicks.length}
            icon={MousePointerClick}
            iconColor="text-primary"
          />
          <StatsCard
            title="Converted"
            value={clicks.filter((c) => c.converted).length}
            icon={TrendingUp}
            iconColor="text-success"
          />
          <StatsCard
            title="Conversion Rate"
            value={`${((clicks.filter((c) => c.converted).length / clicks.length) * 100 || 0).toFixed(1)}%`}
            icon={TrendingUp}
            iconColor="text-accent"
          />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <ChartWidget
            title="Clicks Per Day"
            type="line"
            data={clicksPerDay}
            dataKeys={{ x: "date", y: "clicks" }}
          />
          <ChartWidget
            title="Clicks by Source"
            type="bar"
            data={clicksBySource}
            dataKeys={{ x: "name", y: "clicks" }}
          />
        </div>

        {/* Filters & Table */}
        <FilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          showDateRange
          onExport={() => toast({ title: "Exporting clicks data..." })}
        />

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Clicks ({filteredClicks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredClicks}
              columns={columns}
              pageSize={10}
              emptyMessage="No clicks found"
            />
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default AffiliateClicks;
