import { useState } from "react";
import { Phone, PhoneIncoming, PhoneOutgoing, Users, FileText, Home, ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { InCallControls } from "@/components/InCallControls";
import { OrderConfirmationPanel } from "@/components/OrderConfirmationPanel";

const CallAgent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [callInProgress, setCallInProgress] = useState(false);
  const [activeCallType, setActiveCallType] = useState<"inbound" | "outbound" | null>(null);
  const [showInCallMenu, setShowInCallMenu] = useState(false);
  const [callDuration, setCallDuration] = useState("0:00");
  
  const [scripts, setScripts] = useState({
    preSession: "Good [morning/afternoon], this is [Agent Name] from [Business Name]. How may I assist you today?",
  });

  const inboundCalls = [
    { id: "1", customer: "João Silva", business: "Pizza Maputo", time: "2 min ago", status: "waiting" },
    { id: "2", customer: "Maria Santos", business: "Quick Plumbing", time: "5 min ago", status: "waiting" },
  ];

  const handleStartCall = (type: "inbound" | "outbound", callId?: string) => {
    setCallInProgress(true);
    setActiveCallType(type);
    toast({
      title: `${type === "inbound" ? "Inbound" : "Outbound"} Call Started`,
      description: `Connected to ${type === "inbound" ? "customer" : "business"}`,
    });
  };

  const handleEndCall = () => {
    setCallInProgress(false);
    setActiveCallType(null);
    toast({
      title: "Call Ended",
      description: "Call duration: 5m 23s",
    });
  };

  const handleConferenceCall = () => {
    toast({
      title: "Conference Call",
      description: "Connecting third party to the call...",
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Call Agent Dashboard</h1>
            <div className="flex gap-2">
              <Button 
                variant="secondary" 
                size="icon"
                onClick={() => navigate("/")}
                title="Home"
              >
                <Home className="w-4 h-4" />
              </Button>
              <Badge variant="secondary" className="gap-1">
                {callInProgress ? "On Call" : "Available"}
              </Badge>
            </div>
          </div>
          <p className="text-sm opacity-90">Agent ID: AG-12345</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
      {/* Active Call Panel */}
        {callInProgress && (
          <div className="space-y-4">
            <InCallControls onEndCall={handleEndCall} callDuration={callDuration} />
            
            <Card className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    Call Details - {activeCallType === "inbound" ? "Inbound" : "Outbound"}
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowInCallMenu(!showInCallMenu)}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    {showInCallMenu ? "Hide Menu" : "Show Menu"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-semibold text-foreground">João Silva</p>
                  <p className="text-sm text-muted-foreground">Pizza Maputo</p>
                  <p className="text-xs text-muted-foreground">+258 84 123 4567</p>
                </div>

                {showInCallMenu && (
                  <div className="space-y-3 border-t pt-4">
                    <h4 className="font-semibold text-sm">Available Products</h4>
                    {[
                      { name: "Margherita Pizza", price: 250 },
                      { name: "Pepperoni Pizza", price: 280 },
                      { name: "Garlic Bread", price: 80 },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-card border rounded-lg"
                      >
                        <span className="text-sm font-medium">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-primary">
                            {item.price} MZN
                          </span>
                          <Button size="sm" variant="outline">
                            Add
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Call Notes</Label>
                  <Textarea placeholder="Enter call notes here..." rows={3} />
                </div>

                <Button onClick={handleConferenceCall} variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Add Third Party to Call
                </Button>
              </CardContent>
            </Card>

            <OrderConfirmationPanel />
          </div>
        )}

        <Tabs defaultValue="inbound" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inbound">Inbound Calls</TabsTrigger>
            <TabsTrigger value="outbound">Outbound</TabsTrigger>
            <TabsTrigger value="scripts">Scripts</TabsTrigger>
          </TabsList>

          {/* Inbound Calls */}
          <TabsContent value="inbound" className="space-y-3 mt-4">
            {inboundCalls.map((call) => (
              <Card key={call.id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <PhoneIncoming className="w-4 h-4 text-primary" />
                        <p className="font-semibold text-foreground">{call.customer}</p>
                      </div>
                      <p className="text-sm text-muted-foreground">{call.business}</p>
                      <p className="text-xs text-muted-foreground">{call.time}</p>
                    </div>
                    <Button
                      onClick={() => handleStartCall("inbound", call.id)}
                      variant="call"
                      disabled={callInProgress}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Answer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {inboundCalls.length === 0 && (
              <Card className="shadow-card">
                <CardContent className="p-8 text-center">
                  <PhoneIncoming className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-muted-foreground">No incoming calls</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Outbound Calls */}
          <TabsContent value="outbound" className="space-y-4 mt-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <PhoneOutgoing className="w-5 h-5" />
                  Make Outbound Call
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="businessSelect">Select Business</Label>
                  <select
                    id="businessSelect"
                    className="w-full h-10 px-3 rounded-md border border-input bg-background"
                  >
                    <option>Pizza Maputo</option>
                    <option>Quick Plumbing</option>
                    <option>TaxiGo</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    placeholder="Enter customer name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+258 84 123 4567"
                  />
                </div>

                <Button
                  onClick={() => handleStartCall("outbound")}
                  className="w-full"
                  variant="call"
                  disabled={callInProgress}
                >
                  <PhoneOutgoing className="w-4 h-4 mr-2" />
                  Start Outbound Call
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Scripts */}
          <TabsContent value="scripts" className="space-y-4 mt-4">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Pre-Session Scripts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Business-specific scripts for handling calls
                </p>

                <div className="space-y-3">
                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Pizza Maputo - Greeting</h4>
                    <p className="text-sm text-foreground">{scripts.preSession}</p>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Pizza Maputo - Order Taking</h4>
                    <p className="text-sm text-foreground">
                      "I'd be happy to help you place an order. What size pizza would you like? We have Small, Medium, and Large available."
                    </p>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">Pizza Maputo - Closing</h4>
                    <p className="text-sm text-foreground">
                      "Your order has been placed successfully. It will be delivered within 30-45 minutes. Is there anything else I can help you with?"
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <PhoneIncoming className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-foreground">24</p>
              <p className="text-xs text-muted-foreground">Calls Today</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Phone className="w-6 h-6 mx-auto mb-2 text-success" />
              <p className="text-2xl font-bold text-foreground">5:23</p>
              <p className="text-xs text-muted-foreground">Avg Duration</p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Users className="w-6 h-6 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold text-foreground">12</p>
              <p className="text-xs text-muted-foreground">Orders</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CallAgent;
