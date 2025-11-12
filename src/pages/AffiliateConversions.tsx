import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { AffiliateNav } from "@/components/AffiliateNav";
import { CheckCircle2, DollarSign, RefreshCw, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/StatsCard";
import { ChartWidget } from "@/components/ChartWidget";
import { DataTable } from "@/components/DataTable";
import { FilterBar } from "@/components/FilterBar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Conversion {
  id: string;
  affiliateId: string;
  customerEmail: string;
  offerName: string;
  orderId: string;
  amount: number;
  commission: number;
  status: "APPROVED" | "PENDING" | "REJECTED";
  conversionDate: Date;
}

const AffiliateConversions = () => {
  const { toast } = useToast();
  const [conversions, setConversions] = useState<Conversion[]>([]);
  const [filteredConversions, setFilteredConversions] = useState<Conversion[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversionsData();
  }, []);

  useEffect(() => {
    filterConversions();
  }, [searchQuery, statusFilter, conversions]);

  const loadConversionsData = async () => {
    try {
      const mockConversions: Conversion[] = [
        {
          id: "conv-1",
          affiliateId: "aff-1",
          customerEmail: "customer1@example.com",
          offerName: "Premium Food Delivery Bundle",
          orderId: "ORD-12345",
          amount: 250.00,
          commission: 37.50,
          status: "APPROVED",
          conversionDate: new Date("2024-03-10T16:30:00"),
        },
        {
          id: "conv-2",
          affiliateId: "aff-1",
          customerEmail: "customer2@example.com",
          offerName: "Home Services Package",
          orderId: "ORD-12346",
          amount: 500.00,
          commission: 50.00,
          status: "PENDING",
          conversionDate: new Date("2024-03-11T10:15:00"),
        },
        {
          id: "conv-3",
          affiliateId: "aff-1",
          customerEmail: "customer3@example.com",
          offerName: "Beauty & Wellness Services",
          orderId: "ORD-12347",
          amount: 180.00,
          commission: 36.00,
          status: "APPROVED",
          conversionDate: new Date("2024-03-09T14:20:00"),
        },
      ];
      
      setConversions(mockConversions);
      setFilteredConversions(mockConversions);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error loading conversions",
        description: "Please try again later",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const filterConversions = () => {
    let filtered = conversions;

    if (statusFilter !== "all") {
      filtered = filtered.filter((conv) => conv.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (conv) =>
          conv.offerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conv.orderId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredConversions(filtered);
  };

  const totalRevenue = conversions.reduce((sum, c) => sum + c.amount, 0);
  const totalCommission = conversions.reduce((sum, c) => sum + c.commission, 0);
  const approvedCommission = conversions
    .filter((c) => c.status === "APPROVED")
    .reduce((sum, c) => sum + c.commission, 0);

  const conversionsByDay = [
    { date: "Mar 5", conversions: 8, revenue: 450 },
    { date: "Mar 6", conversions: 12, revenue: 680 },
    { date: "Mar 7", conversions: 9, revenue: 520 },
    { date: "Mar 8", conversions: 15, revenue: 890 },
    { date: "Mar 9", conversions: 11, revenue: 640 },
    { date: "Mar 10", conversions: 18, revenue: 1020 },
    { date: "Mar 11", conversions: 14, revenue: 780 },
  ];

  const columns = [
    {
      key: "conversionDate",
      label: "Date",
      render: (conv: Conversion) => (
        <div>
          <p className="font-medium text-foreground">
            {conv.conversionDate.toLocaleDateString()}
          </p>
          <p className="text-xs text-muted-foreground">
            {conv.conversionDate.toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    {
      key: "offerName",
      label: "Offer",
      render: (conv: Conversion) => (
        <div>
          <p className="font-medium text-foreground">{conv.offerName}</p>
          <p className="text-xs text-muted-foreground">{conv.orderId}</p>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Order Amount",
      render: (conv: Conversion) => (
        <span className="font-semibold text-foreground">
          {conv.amount.toFixed(2)} MZN
        </span>
      ),
    },
    {
      key: "commission",
      label: "Commission",
      render: (conv: Conversion) => (
        <span className="font-semibold text-success">
          {conv.commission.toFixed(2)} MZN
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (conv: Conversion) => (
        <Badge
          variant={
            conv.status === "APPROVED"
              ? "default"
              : conv.status === "PENDING"
              ? "secondary"
              : "destructive"
          }
          className={
            conv.status === "APPROVED"
              ? "bg-success text-success-foreground"
              : ""
          }
        >
          {conv.status}
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
            <CheckCircle2 className="w-6 h-6" />
            <div>
              <h1 className="text-2xl font-bold">Conversions</h1>
              <p className="text-sm opacity-90">Track your successful referrals</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <AffiliateNav />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCard
            title="Total Conversions"
            value={conversions.length}
            icon={CheckCircle2}
            iconColor="text-success"
          />
          <StatsCard
            title="Total Revenue"
            value={`${totalRevenue.toFixed(2)} MZN`}
            icon={DollarSign}
            iconColor="text-primary"
          />
          <StatsCard
            title="Total Commission"
            value={`${totalCommission.toFixed(2)} MZN`}
            icon={DollarSign}
            iconColor="text-accent"
          />
          <StatsCard
            title="Approved Commission"
            value={`${approvedCommission.toFixed(2)} MZN`}
            icon={TrendingUp}
            iconColor="text-success"
          />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <ChartWidget
            title="Conversions Over Time"
            type="line"
            data={conversionsByDay}
            dataKeys={{ x: "date", y: ["conversions"] }}
          />
          <ChartWidget
            title="Revenue Trend"
            type="bar"
            data={conversionsByDay}
            dataKeys={{ x: "date", y: "revenue" }}
            colors={["hsl(var(--success))"]}
          />
        </div>

        {/* Filters & Table */}
        <FilterBar
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          filters={[
            {
              label: "Status",
              value: statusFilter,
              options: [
                { label: "All Statuses", value: "all" },
                { label: "Approved", value: "APPROVED" },
                { label: "Pending", value: "PENDING" },
                { label: "Rejected", value: "REJECTED" },
              ],
              onChange: setStatusFilter,
            },
          ]}
          showDateRange
          onExport={() => toast({ title: "Exporting conversions data..." })}
        />

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">
              Conversions ({filteredConversions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredConversions}
              columns={columns}
              pageSize={10}
              emptyMessage="No conversions found"
            />
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default AffiliateConversions;
