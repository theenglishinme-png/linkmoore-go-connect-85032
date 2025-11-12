import { useState, useEffect } from "react";
import { Share2, Copy, Check, Store, Search, TrendingUp, MousePointerClick } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { api, Offer } from "@/lib/api";

const ReferralGenerator = () => {
  const { toast } = useToast();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [generatedLink, setGeneratedLink] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOffers();
  }, []);

  useEffect(() => {
    filterOffers();
  }, [searchQuery, selectedCategory, offers]);

  const loadOffers = async () => {
    try {
      const approvedOffers = await api.offers.getApproved();
      setOffers(approvedOffers);
      setFilteredOffers(approvedOffers);
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

  const filterOffers = () => {
    let filtered = offers;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(offer => offer.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(offer =>
        offer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        offer.vendorName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOffers(filtered);
  };

  const categories = ["all", ...Array.from(new Set(offers.map(o => o.category)))];

  const handleGenerateLink = async (offer: Offer) => {
    try {
      const link = await api.affiliate.generateReferralLink("aff-1", offer.id);
      setGeneratedLink(link);
      setSelectedOffer(offer);
      toast({
        title: "Referral Link Generated!",
        description: "Share this link to earn commissions",
      });
    } catch (error) {
      toast({
        title: "Error generating link",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast({
      title: "Link Copied!",
      description: "Paste it anywhere to share",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-accent text-accent-foreground p-6 shadow-strong">
        <div className="container mx-auto">
          <div className="flex items-center gap-3">
            <Store className="w-6 h-6" />
            <div>
              <h1 className="text-2xl font-bold">Affiliate Marketplace</h1>
              <p className="text-sm opacity-90">Browse offers & earn commissions</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Search & Filter */}
        <Card className="shadow-card">
          <CardContent className="p-4 space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search offers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category === "all" ? "All Categories" : category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Offers Grid */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">
              Available Offers ({filteredOffers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <p className="text-center text-muted-foreground py-8">Loading offers...</p>
            ) : filteredOffers.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No offers found. Try adjusting your filters.
              </p>
            ) : (
              filteredOffers.map((offer) => (
                <Card
                  key={offer.id}
                  className="border hover:shadow-hover transition-all"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground mb-1">{offer.name}</h4>
                        <p className="text-xs text-muted-foreground mb-2">{offer.vendorName}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {offer.description}
                        </p>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-3 gap-2 mb-3 p-3 bg-muted/50 rounded-md">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Sales</p>
                        </div>
                        <p className="font-semibold text-foreground">{offer.salesCount}</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <MousePointerClick className="w-3 h-3 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">EPC</p>
                        </div>
                        <p className="font-semibold text-foreground">{offer.epc.toFixed(2)} MZN</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground mb-1">Conv. Rate</p>
                        <p className="font-semibold text-foreground">{offer.conversionRate.toFixed(1)}%</p>
                      </div>
                    </div>

                    {/* Badges & CTA */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-success text-success-foreground text-xs">
                          {offer.commission.type === "PERCENTAGE"
                            ? `${offer.commission.value}% Commission`
                            : `${offer.commission.value} MZN`}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {offer.category}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleGenerateLink(offer)}
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Get Link
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>

        {/* Generated Link Display */}
        {generatedLink && selectedOffer && (
          <Card className="shadow-card bg-gradient-accent text-accent-foreground">
            <CardContent className="p-6 space-y-4">
              <div className="bg-background/10 p-4 rounded-md">
                <h4 className="font-semibold mb-1">{selectedOffer.name}</h4>
                <p className="text-sm opacity-90">{selectedOffer.vendorName}</p>
                <Badge className="mt-2 bg-success text-success-foreground">
                  {selectedOffer.commission.type === "PERCENTAGE"
                    ? `${selectedOffer.commission.value}% Commission`
                    : `${selectedOffer.commission.value} MZN Commission`}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Your Referral Link</h3>
                <div className="bg-background/10 p-3 rounded-md break-all text-sm font-mono">
                  {generatedLink}
                </div>
              </div>
              <Button
                variant="secondary"
                className="w-full"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Link
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        )}
      </main>

      <BottomNav />
    </div>
  );
};

export default ReferralGenerator;
