import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Package, 
  Plus, 
  TrendingUp,
  DollarSign,
  Eye,
  Edit,
  Clock
} from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api, Offer } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const Promoter = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    category: "",
    commissionType: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    commissionValue: "",
  });

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const promoterOffers = await api.promoter.getOffers("promoter-1");
      setOffers(promoterOffers);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error loading offers",
        description: "Please try again later",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleCreateOffer = async () => {
    if (!formData.name || !formData.description || !formData.url || !formData.commissionValue) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await api.promoter.createOffer({
        name: formData.name,
        description: formData.description,
        url: formData.url,
        category: formData.category,
        commission: {
          type: formData.commissionType,
          value: parseFloat(formData.commissionValue),
        },
        status: "PENDING",
        promoterId: "promoter-1",
        promoterName: "João Silva",
        vendorName: "My Business",
        salesCount: 0,
        epc: 0,
        conversionRate: 0,
        launchDate: new Date(),
      });

      toast({
        title: "Offer created!",
        description: "Your offer is pending admin approval",
      });

      setShowCreateDialog(false);
      setFormData({
        name: "",
        description: "",
        url: "",
        category: "",
        commissionType: "PERCENTAGE",
        commissionValue: "",
      });
      loadOffers();
    } catch (error) {
      toast({
        title: "Error creating offer",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      PENDING: "bg-accent text-accent-foreground",
      APPROVED: "bg-success text-success-foreground",
      REJECTED: "bg-destructive text-destructive-foreground",
    };
    return (
      <Badge className={statusColors[status as keyof typeof statusColors]}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-accent text-accent-foreground p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Promoter Dashboard</h1>
              <p className="text-sm opacity-90">Create & manage your offers</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate("/affiliate")}
            >
              Switch to Affiliate
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Create Offer Button */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="w-full" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create New Offer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Offer</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Offer Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Premium Food Delivery Bundle"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your offer and what makes it special..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">Offer URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://example.com/offer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Food & Delivery"
                />
              </div>

              <div className="space-y-2">
                <Label>Commission Type *</Label>
                <Select
                  value={formData.commissionType}
                  onValueChange={(value: "PERCENTAGE" | "FIXED") =>
                    setFormData({ ...formData, commissionType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED">Fixed Amount (MZN)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="commissionValue">
                  Commission Value * {formData.commissionType === "PERCENTAGE" ? "(%)" : "(MZN)"}
                </Label>
                <Input
                  id="commissionValue"
                  type="number"
                  step="0.01"
                  value={formData.commissionValue}
                  onChange={(e) => setFormData({ ...formData, commissionValue: e.target.value })}
                  placeholder={formData.commissionType === "PERCENTAGE" ? "15" : "50"}
                />
              </div>

              <Button onClick={handleCreateOffer} className="w-full">
                Create Offer
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Offers List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="w-5 h-5" />
              My Offers ({offers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading offers...</p>
            ) : offers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No offers yet. Create your first offer to get started!
              </p>
            ) : (
              offers.map((offer) => (
                <Card key={offer.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{offer.name}</h4>
                          {getStatusBadge(offer.status)}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {offer.description}
                        </p>
                        <p className="text-xs text-muted-foreground">{offer.category}</p>
                      </div>
                    </div>

                    {offer.status === "APPROVED" && (
                      <div className="grid grid-cols-3 gap-2 mb-3 p-3 bg-muted/50 rounded-md">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Sales</p>
                          <p className="font-semibold text-foreground">{offer.salesCount}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">EPC</p>
                          <p className="font-semibold text-foreground">{offer.epc.toFixed(2)} MZN</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">Conv. Rate</p>
                          <p className="font-semibold text-foreground">{offer.conversionRate.toFixed(1)}%</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {offer.commission.type === "PERCENTAGE"
                          ? `${offer.commission.value}% Commission`
                          : `${offer.commission.value} MZN`}
                      </Badge>
                      {offer.status === "PENDING" && (
                        <Badge variant="outline" className="text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          Awaiting Approval
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </main>

      <BottomNav />
    </div>
  );
};

export default Promoter;
