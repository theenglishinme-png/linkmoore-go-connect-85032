import { useState } from "react";
import { Phone, TrendingUp, Clock, CheckCircle2, Shield, Home } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderFormBuilder } from "@/components/OrderFormBuilder";
import { StockControl } from "@/components/StockControl";
import { CallScriptsManager } from "@/components/CallScriptsManager";
import { ProductManager } from "@/components/ProductManager";
import { BusinessDetailsForm } from "@/components/BusinessDetailsForm";

const Business = () => {
  const navigate = useNavigate();
  const [callsToday] = useState(24);
  const [ordersToday] = useState(12);
  const [revenue] = useState(3450.00);

  const recentOrders = [
    {
      id: "1",
      customer: "João Silva",
      type: "Pizza Delivery",
      amount: 250,
      status: "completed" as const,
      time: "10 min ago",
    },
    {
      id: "2",
      customer: "Maria Santos",
      type: "Call - Service Request",
      amount: 0,
      status: "pending" as const,
      time: "25 min ago",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold">Business Dashboard</h1>
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
                <CheckCircle2 className="w-3 h-3" />
                Verified
              </Badge>
            </div>
          </div>
          <p className="text-sm opacity-90">Pizza Maputo</p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <Phone className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-foreground">{callsToday}</p>
              <p className="text-xs text-muted-foreground">Calls Today</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-success" />
              <p className="text-2xl font-bold text-foreground">{ordersToday}</p>
              <p className="text-xs text-muted-foreground">Orders</p>
            </CardContent>
          </Card>
          
          <Card className="shadow-card">
            <CardContent className="p-4 text-center">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold text-foreground">{revenue}</p>
              <p className="text-xs text-muted-foreground">Revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Orders & Calls */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="orders" className="space-y-3 mt-4">
            {recentOrders.map((order) => (
              <Card key={order.id} className="shadow-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-foreground">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">{order.type}</p>
                    </div>
                    <Badge 
                      variant={order.status === "completed" ? "default" : "secondary"}
                      className={order.status === "completed" ? "bg-success text-success-foreground" : ""}
                    >
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {order.time}
                    </span>
                    {order.amount > 0 && (
                      <span className="font-semibold text-foreground">{order.amount} MZN</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="products" className="space-y-4 mt-4">
            <ProductManager />
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4 mt-4">
            <BusinessDetailsForm />
            <OrderFormBuilder />
            <CallScriptsManager />
            <StockControl />
          </TabsContent>
        </Tabs>
      </main>

      <BottomNav />
    </div>
  );
};

export default Business;
