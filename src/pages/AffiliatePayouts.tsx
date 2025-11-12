import { useState, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { AffiliateNav } from "@/components/AffiliateNav";
import { Wallet, DollarSign, RefreshCw, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/StatsCard";
import { ChartWidget } from "@/components/ChartWidget";
import { DataTable } from "@/components/DataTable";
import { FilterBar } from "@/components/FilterBar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { api, Payout } from "@/lib/api";

const AffiliatePayouts = () => {
  const { toast } = useToast();
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [filteredPayouts, setFilteredPayouts] = useState<Payout[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPayoutsData();
  }, []);

  useEffect(() => {
    filterPayouts();
  }, [searchQuery, statusFilter, payouts]);

  const loadPayoutsData = async () => {
    try {
      const payoutData = await api.affiliate.getPayouts("aff-1");
      setPayouts(payoutData);
      setFilteredPayouts(payoutData);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error loading payouts",
        description: "Please try again later",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const filterPayouts = () => {
    let filtered = payouts;

    if (statusFilter !== "all") {
      filtered = filtered.filter((payout) => payout.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(
        (payout) =>
          payout.method.toLowerCase().includes(searchQuery.toLowerCase()) ||
          payout.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPayouts(filtered);
  };

  const totalPaid = payouts
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payouts
    .filter((p) => p.status === "PENDING")
    .reduce((sum, p) => sum + p.amount, 0);

  const payoutTrend = [
    { month: "Jan", amount: 850 },
    { month: "Feb", amount: 1200 },
    { month: "Mar", amount: 950 },
    { month: "Apr", amount: 1500 },
    { month: "May", amount: 1300 },
    { month: "Jun", amount: 1800 },
  ];

  const columns = [
    {
      key: "requestDate",
      label: "Date",
      render: (payout: Payout) => (
        <div>
          <p className="font-medium text-foreground">
            {payout.requestDate.toLocaleDateString()}
          </p>
          <p className="text-xs text-muted-foreground">
            {payout.requestDate.toLocaleTimeString()}
          </p>
        </div>
      ),
    },
    {
      key: "id",
      label: "Payout ID",
      render: (payout: Payout) => (
        <Badge variant="outline">{payout.id}</Badge>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (payout: Payout) => (
        <span className="font-semibold text-foreground">
          {payout.amount.toFixed(2)} MZN
        </span>
      ),
    },
    {
      key: "method",
      label: "Method",
    },
    {
      key: "status",
      label: "Status",
      render: (payout: Payout) => (
        <Badge
          variant={
            payout.status === "COMPLETED"
              ? "default"
              : payout.status === "PENDING"
              ? "secondary"
              : "destructive"
          }
          className={
            payout.status === "COMPLETED"
              ? "bg-success text-success-foreground"
              : ""
          }
        >
          {payout.status}
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
            <Wallet className="w-6 h-6" />
            <div>
              <h1 className="text-2xl font-bold">Payouts</h1>
              <p className="text-sm opacity-90">Manage your earnings withdrawals</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <AffiliateNav />

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <StatsCard
            title="Total Paid Out"
            value={`${totalPaid.toFixed(2)} MZN`}
            icon={DollarSign}
            iconColor="text-success"
          />
          <StatsCard
            title="Pending Payouts"
            value={`${totalPending.toFixed(2)} MZN`}
            icon={Clock}
            iconColor="text-accent"
          />
          <StatsCard
            title="Total Payouts"
            value={payouts.length}
            icon={Wallet}
            iconColor="text-primary"
          />
        </div>

        {/* Request Payout Card */}
        <Card className="shadow-card bg-gradient-accent text-accent-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Available Balance</h3>
                <p className="text-3xl font-bold">2,130.25 MZN</p>
                <p className="text-sm opacity-90 mt-1">Minimum payout: 100 MZN</p>
              </div>
              <Button variant="secondary" size="lg">
                Request Payout
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        <ChartWidget
          title="Payout History"
          type="bar"
          data={payoutTrend}
          dataKeys={{ x: "month", y: "amount" }}
          colors={["hsl(var(--success))"]}
        />

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
                { label: "Completed", value: "COMPLETED" },
                { label: "Pending", value: "PENDING" },
                { label: "Rejected", value: "REJECTED" },
              ],
              onChange: setStatusFilter,
            },
          ]}
          showDateRange
          onExport={() => toast({ title: "Exporting payouts data..." })}
        />

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Payout History ({filteredPayouts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredPayouts}
              columns={columns}
              pageSize={10}
              emptyMessage="No payouts yet"
            />
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default AffiliatePayouts;
