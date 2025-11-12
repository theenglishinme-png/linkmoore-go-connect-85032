import { useState, useEffect } from "react";
import { Settings, Phone, Zap, CreditCard, Save, Check, UserCog, Home, Store, X } from "lucide-react";
import { api, Offer } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentAccountForm } from "@/components/AgentAccountForm";
import { PaymentMethodConfig } from "@/components/PaymentMethodConfig";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [saved, setSaved] = useState<Record<string, boolean>>({});
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  // Twilio Configuration
  const [twilioConfig, setTwilioConfig] = useState({
    accountSid: "",
    authToken: "",
    phoneNumber: "",
    enabled: false,
  });

  // OpenAI Configuration
  const [openAIConfig, setOpenAIConfig] = useState({
    apiKey: "",
    model: "gpt-4o-mini",
    enabled: false,
  });

  // Payment Gateway Configuration
  const [paymentConfig, setPaymentConfig] = useState({
    provider: "stripe",
    stripeSecretKey: "",
    stripePublishableKey: "",
    paystackSecretKey: "",
    paystackPublicKey: "",
    enabled: false,
  });

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      const allOffers = await api.offers.getAll();
      setOffers(allOffers);
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

  const handleApprove = async (offerId: string) => {
    try {
      await api.offers.updateStatus(offerId, "APPROVED");
      toast({
        title: "Offer approved",
        description: "The offer is now live in the marketplace",
      });
      loadOffers();
    } catch (error) {
      toast({
        title: "Error approving offer",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (offerId: string) => {
    try {
      await api.offers.updateStatus(offerId, "REJECTED");
      toast({
        title: "Offer rejected",
        description: "The promoter has been notified",
      });
      loadOffers();
    } catch (error) {
      toast({
        title: "Error rejecting offer",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleSave = (section: string) => {
    // API call would go here
    toast({
      title: "Configuration Saved",
      description: `${section} settings have been updated successfully.`,
    });
    setSaved({ ...saved, [section]: true });
    setTimeout(() => {
      setSaved({ ...saved, [section]: false });
    }, 2000);
  };

  const pendingOffers = offers.filter(o => o.status === "PENDING");
  const approvedOffers = offers.filter(o => o.status === "APPROVED");
  const rejectedOffers = offers.filter(o => o.status === "REJECTED");

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
      <header className="bg-gradient-primary text-primary-foreground p-6 shadow-strong">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6" />
              <div>
                <h1 className="text-2xl font-bold">Admin Panel</h1>
                <p className="text-sm opacity-90">Platform Configuration</p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="icon"
              onClick={() => navigate("/")}
              title="Home"
            >
              <Home className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs defaultValue="offers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 text-xs">
            <TabsTrigger value="offers">
              <Store className="w-4 h-4 mr-1" />
              Offers
            </TabsTrigger>
            <TabsTrigger value="operations">
              <Settings className="w-4 h-4 mr-1" />
              Operations
            </TabsTrigger>
            <TabsTrigger value="agents">
              <UserCog className="w-4 h-4 mr-1" />
              Agents
            </TabsTrigger>
            <TabsTrigger value="twilio">
              <Phone className="w-4 h-4 mr-1" />
              Twilio
            </TabsTrigger>
            <TabsTrigger value="openai">
              <Zap className="w-4 h-4 mr-1" />
              AI
            </TabsTrigger>
            <TabsTrigger value="payment">
              <CreditCard className="w-4 h-4 mr-1" />
              Payments
            </TabsTrigger>
          </TabsList>

          {/* Offers Management */}
          <TabsContent value="offers">
            <div className="space-y-4">
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <Card className="shadow-card">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
                    <p className="text-2xl font-bold text-accent">{pendingOffers.length}</p>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Approved</p>
                    <p className="text-2xl font-bold text-success">{approvedOffers.length}</p>
                  </CardContent>
                </Card>
                <Card className="shadow-card">
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">Rejected</p>
                    <p className="text-2xl font-bold text-destructive">{rejectedOffers.length}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Pending Offers */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Pending Offers - Awaiting Approval</CardTitle>
                  <CardDescription>Review and approve or reject offers from promoters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {loading ? (
                    <p className="text-center text-muted-foreground py-8">Loading offers...</p>
                  ) : pendingOffers.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No pending offers to review
                    </p>
                  ) : (
                    pendingOffers.map((offer) => (
                      <Card key={offer.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-foreground">{offer.name}</h4>
                                {getStatusBadge(offer.status)}
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">
                                By {offer.promoterName} • {offer.vendorName}
                              </p>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                {offer.description}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            <Badge variant="outline" className="text-xs">{offer.category}</Badge>
                            <Badge variant="outline" className="text-xs">
                              {offer.commission.type === "PERCENTAGE"
                                ? `${offer.commission.value}% Commission`
                                : `${offer.commission.value} MZN`}
                            </Badge>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              className="flex-1 bg-success hover:bg-success/90"
                              onClick={() => handleApprove(offer.id)}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleReject(offer.id)}
                            >
                              <X className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* All Offers Summary */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>All Offers Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Approved Offers ({approvedOffers.length})</p>
                    {approvedOffers.slice(0, 3).map((offer) => (
                      <div key={offer.id} className="flex items-center justify-between p-2 bg-muted rounded">
                        <span className="text-sm">{offer.name}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">{offer.salesCount} sales</Badge>
                          {getStatusBadge(offer.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Operations Control */}
          <TabsContent value="operations">
            <div className="grid gap-4">
              {/* Active Agents */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Active Agents</CardTitle>
                  <CardDescription>Currently online call agents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { name: "Agent Maria", status: "Available", calls: 12 },
                      { name: "Agent João", status: "On Call", calls: 8 },
                      { name: "Agent Carlos", status: "Available", calls: 15 },
                    ].map((agent) => (
                      <div key={agent.name} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{agent.name}</p>
                          <p className="text-sm text-muted-foreground">{agent.calls} calls today</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          agent.status === "Available" ? "bg-success text-success-foreground" : "bg-primary text-primary-foreground"
                        }`}>
                          {agent.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Call & Order Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-base">Call Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Today</span>
                        <span className="font-bold">124</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">This Week</span>
                        <span className="font-bold">892</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">This Month</span>
                        <span className="font-bold">3,456</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardHeader>
                    <CardTitle className="text-base">Order Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Pending</span>
                        <span className="font-bold text-primary">24</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Completed</span>
                        <span className="font-bold text-success">156</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Today</span>
                        <span className="font-bold">180</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Financial Overview */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Financial Overview</CardTitle>
                  <CardDescription>Platform revenue and commissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Today's Revenue</p>
                      <p className="text-2xl font-bold text-foreground">12,450 MZN</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Commission Earned</p>
                      <p className="text-2xl font-bold text-accent">3,200 MZN</p>
                    </div>
                    <div className="text-center p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground mb-1">Referral Payouts</p>
                      <p className="text-2xl font-bold text-primary">850 MZN</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Call Agent Accounts */}
          <TabsContent value="agents">
            <AgentAccountForm />
          </TabsContent>

          {/* Twilio Configuration */}
          <TabsContent value="twilio">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Twilio Call Routing</CardTitle>
                <CardDescription>
                  Configure call routing and forwarding when businesses don't answer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="twilio-enabled">Enable Call Routing</Label>
                  <Switch
                    id="twilio-enabled"
                    checked={twilioConfig.enabled}
                    onCheckedChange={(checked) =>
                      setTwilioConfig({ ...twilioConfig, enabled: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twilio-sid">Account SID</Label>
                  <Input
                    id="twilio-sid"
                    type="text"
                    placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    value={twilioConfig.accountSid}
                    onChange={(e) =>
                      setTwilioConfig({ ...twilioConfig, accountSid: e.target.value })
                    }
                    disabled={!twilioConfig.enabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twilio-token">Auth Token</Label>
                  <Input
                    id="twilio-token"
                    type="password"
                    placeholder="Enter your Twilio auth token"
                    value={twilioConfig.authToken}
                    onChange={(e) =>
                      setTwilioConfig({ ...twilioConfig, authToken: e.target.value })
                    }
                    disabled={!twilioConfig.enabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twilio-phone">Phone Number</Label>
                  <Input
                    id="twilio-phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={twilioConfig.phoneNumber}
                    onChange={(e) =>
                      setTwilioConfig({ ...twilioConfig, phoneNumber: e.target.value })
                    }
                    disabled={!twilioConfig.enabled}
                  />
                </div>

                <Button
                  onClick={() => handleSave("Twilio")}
                  className="w-full"
                  variant="call"
                  disabled={!twilioConfig.enabled}
                >
                  {saved.Twilio ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Configuration
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* OpenAI Configuration */}
          <TabsContent value="openai">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Smart Search & Classification</CardTitle>
                <CardDescription>
                  Configure intelligent search and request classification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="openai-enabled">Enable Smart Search</Label>
                  <Switch
                    id="openai-enabled"
                    checked={openAIConfig.enabled}
                    onCheckedChange={(checked) =>
                      setOpenAIConfig({ ...openAIConfig, enabled: checked })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="openai-key">OpenAI API Key</Label>
                  <Input
                    id="openai-key"
                    type="password"
                    placeholder="sk-proj-..."
                    value={openAIConfig.apiKey}
                    onChange={(e) =>
                      setOpenAIConfig({ ...openAIConfig, apiKey: e.target.value })
                    }
                    disabled={!openAIConfig.enabled}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="openai-model">Model</Label>
                  <Input
                    id="openai-model"
                    type="text"
                    value={openAIConfig.model}
                    onChange={(e) =>
                      setOpenAIConfig({ ...openAIConfig, model: e.target.value })
                    }
                    disabled={!openAIConfig.enabled}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recommended: gpt-4o-mini for cost efficiency
                  </p>
                </div>

                <Button
                  onClick={() => handleSave("OpenAI")}
                  className="w-full"
                  variant="call"
                  disabled={!openAIConfig.enabled}
                >
                  {saved.OpenAI ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Configuration
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Configuration */}
          <TabsContent value="payment">
            <div className="space-y-4">
              {/* Stripe/Paystack Configuration */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Payment Gateway</CardTitle>
                  <CardDescription>
                    Configure Stripe or Paystack for wallet transactions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="payment-enabled">Enable Payments</Label>
                    <Switch
                      id="payment-enabled"
                      checked={paymentConfig.enabled}
                      onCheckedChange={(checked) =>
                        setPaymentConfig({ ...paymentConfig, enabled: checked })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payment-provider">Payment Provider</Label>
                    <select
                      id="payment-provider"
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={paymentConfig.provider}
                      onChange={(e) =>
                        setPaymentConfig({ ...paymentConfig, provider: e.target.value })
                      }
                      disabled={!paymentConfig.enabled}
                    >
                      <option value="stripe">Stripe</option>
                      <option value="paystack">Paystack</option>
                    </select>
                  </div>

                  {paymentConfig.provider === "stripe" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="stripe-secret">Stripe Secret Key</Label>
                        <Input
                          id="stripe-secret"
                          type="password"
                          placeholder="sk_live_..."
                          value={paymentConfig.stripeSecretKey}
                          onChange={(e) =>
                            setPaymentConfig({
                              ...paymentConfig,
                              stripeSecretKey: e.target.value,
                            })
                          }
                          disabled={!paymentConfig.enabled}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="stripe-public">Stripe Publishable Key</Label>
                        <Input
                          id="stripe-public"
                          type="text"
                          placeholder="pk_live_..."
                          value={paymentConfig.stripePublishableKey}
                          onChange={(e) =>
                            setPaymentConfig({
                              ...paymentConfig,
                              stripePublishableKey: e.target.value,
                            })
                          }
                          disabled={!paymentConfig.enabled}
                        />
                      </div>
                    </>
                  )}

                  {paymentConfig.provider === "paystack" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="paystack-secret">Paystack Secret Key</Label>
                        <Input
                          id="paystack-secret"
                          type="password"
                          placeholder="sk_live_..."
                          value={paymentConfig.paystackSecretKey}
                          onChange={(e) =>
                            setPaymentConfig({
                              ...paymentConfig,
                              paystackSecretKey: e.target.value,
                            })
                          }
                          disabled={!paymentConfig.enabled}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paystack-public">Paystack Public Key</Label>
                        <Input
                          id="paystack-public"
                          type="text"
                          placeholder="pk_live_..."
                          value={paymentConfig.paystackPublicKey}
                          onChange={(e) =>
                            setPaymentConfig({
                              ...paymentConfig,
                              paystackPublicKey: e.target.value,
                            })
                          }
                          disabled={!paymentConfig.enabled}
                        />
                      </div>
                    </>
                  )}

                  <Button
                    onClick={() => handleSave("Payment")}
                    className="w-full"
                    variant="call"
                    disabled={!paymentConfig.enabled}
                  >
                    {saved.Payment ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Configuration
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* PayPal, M-Pesa, e-Mola Configuration */}
              <PaymentMethodConfig />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
