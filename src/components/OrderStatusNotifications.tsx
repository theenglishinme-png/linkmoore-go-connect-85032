import { Clock, CreditCard, CheckCircle2, Package, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

interface OrderNotification {
  id: string;
  orderId: string;
  businessName: string;
  status: "pending_payment" | "payment_request" | "confirmed" | "completed";
  amount: number;
  timestamp: Date;
  items: string[];
}

export const OrderStatusNotifications = () => {
  const notifications: OrderNotification[] = [
    {
      id: "1",
      orderId: "ORD-001",
      businessName: "Pizza Maputo",
      status: "payment_request",
      amount: 330,
      timestamp: new Date(Date.now() - 10 * 60000),
      items: ["Margherita Pizza", "Garlic Bread"],
    },
    {
      id: "2",
      orderId: "ORD-002",
      businessName: "Quick Plumbing",
      status: "confirmed",
      amount: 500,
      timestamp: new Date(Date.now() - 30 * 60000),
      items: ["Emergency Plumbing Service"],
    },
    {
      id: "3",
      orderId: "ORD-003",
      businessName: "TaxiGo",
      status: "completed",
      amount: 150,
      timestamp: new Date(Date.now() - 120 * 60000),
      items: ["Airport Transfer"],
    },
    {
      id: "4",
      orderId: "ORD-004",
      businessName: "Burger House",
      status: "pending_payment",
      amount: 280,
      timestamp: new Date(Date.now() - 5 * 60000),
      items: ["Burger Deluxe", "Fries"],
    },
  ];

  const getStatusConfig = (status: OrderNotification["status"]) => {
    const configs = {
      pending_payment: {
        icon: Clock,
        label: "Pending Payment",
        variant: "secondary" as const,
        color: "text-muted-foreground",
      },
      payment_request: {
        icon: CreditCard,
        label: "Payment Requested",
        variant: "default" as const,
        color: "text-primary",
      },
      confirmed: {
        icon: CheckCircle2,
        label: "Order Confirmed",
        variant: "default" as const,
        color: "text-success",
      },
      completed: {
        icon: Package,
        label: "Completed",
        variant: "outline" as const,
        color: "text-muted-foreground",
      },
    };
    return configs[status];
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          Order Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {notifications.map((notification) => {
              const config = getStatusConfig(notification.status);
              const StatusIcon = config.icon;

              return (
                <Card key={notification.id} className="shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <StatusIcon className={`w-4 h-4 ${config.color}`} />
                          <span className="font-semibold text-sm">
                            {notification.businessName}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Order #{notification.orderId}
                        </p>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{notification.amount} MZN</p>
                        <p className="text-xs text-muted-foreground">
                          {notification.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs text-muted-foreground mb-1">Items:</p>
                      <div className="flex flex-wrap gap-1">
                        {notification.items.map((item, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {notification.status === "payment_request" && (
                      <Button variant="earn" size="sm" className="w-full">
                        <CreditCard className="w-3 h-3 mr-2" />
                        Pay Now
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
