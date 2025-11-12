import { useState } from "react";
import { CheckCircle2, Phone, CreditCard, Clock, User, Package } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

interface PendingOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  businessName: string;
  items: { name: string; price: number }[];
  total: number;
  status: "pending" | "confirmed" | "payment_sent" | "paid" | "completed";
  timestamp: Date;
}

export const OrderConfirmationPanel = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<PendingOrder[]>([
    {
      id: "ord-001",
      customerName: "João Silva",
      customerPhone: "+258 84 123 4567",
      businessName: "Pizza Maputo",
      items: [
        { name: "Margherita Pizza", price: 250 },
        { name: "Garlic Bread", price: 80 },
      ],
      total: 330,
      status: "pending",
      timestamp: new Date(),
    },
    {
      id: "ord-002",
      customerName: "Maria Santos",
      customerPhone: "+258 84 987 6543",
      businessName: "Pizza Maputo",
      items: [{ name: "Pepperoni Pizza", price: 280 }],
      total: 280,
      status: "confirmed",
      timestamp: new Date(Date.now() - 5 * 60000),
    },
  ]);

  const [notes, setNotes] = useState<{ [key: string]: string }>({});

  const handleConfirm = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "confirmed" } : order
      )
    );
    toast({
      title: "Order Confirmed",
      description: "Customer has been notified via phone call.",
    });
  };

  const handleSendPaymentRequest = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "payment_sent" } : order
      )
    );
    toast({
      title: "Payment Request Sent",
      description: "Customer will receive payment notification with checkout link.",
    });
  };

  const handleMarkPaid = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "paid" } : order
      )
    );
    toast({
      title: "Payment Confirmed",
      description: "Order status updated. Customer and business notified.",
    });
  };

  const handleComplete = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "completed" } : order
      )
    );
    toast({
      title: "Order Completed",
      description: "Order has been marked as completed.",
    });
  };

  const getStatusBadge = (status: PendingOrder["status"]) => {
    const variants: Record<PendingOrder["status"], { variant: string; label: string }> = {
      pending: { variant: "secondary", label: "Pending Confirmation" },
      confirmed: { variant: "default", label: "Confirmed" },
      payment_sent: { variant: "default", label: "Payment Request Sent" },
      paid: { variant: "default", label: "Paid" },
      completed: { variant: "default", label: "Completed" },
    };
    const { variant, label } = variants[status];
    return (
      <Badge
        variant={variant as any}
        className={status === "paid" ? "bg-success text-success-foreground" : ""}
      >
        {label}
      </Badge>
    );
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Phone className="w-5 h-5" />
          Agent Order Confirmation
        </CardTitle>
        <CardDescription>
          Confirm orders via phone call and send payment requests to customers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No pending orders at the moment
          </div>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="border-2">
              <CardContent className="p-4 space-y-4">
                {/* Order Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground flex items-center gap-2">
                      Order #{order.id}
                      {getStatusBadge(order.status)}
                    </h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {order.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* Customer Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{order.customerPhone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-muted-foreground" />
                    <span>{order.businessName}</span>
                  </div>
                </div>

                <Separator />

                {/* Order Items */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold">Items Ordered</Label>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-sm bg-muted p-2 rounded"
                    >
                      <span>{item.name}</span>
                      <span className="font-medium">{item.price} MZN</span>
                    </div>
                  ))}
                  <div className="flex items-center justify-between pt-2 font-semibold">
                    <span>Total Amount</span>
                    <span className="text-primary text-lg">{order.total} MZN</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor={`notes-${order.id}`}>Agent Notes</Label>
                  <Textarea
                    id={`notes-${order.id}`}
                    value={notes[order.id] || ""}
                    onChange={(e) =>
                      setNotes((prev) => ({ ...prev, [order.id]: e.target.value }))
                    }
                    rows={2}
                    placeholder="Add any special instructions or notes..."
                  />
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  {order.status === "pending" && (
                    <Button
                      variant="call"
                      className="w-full"
                      onClick={() => handleConfirm(order.id)}
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      Confirm Order via Call
                    </Button>
                  )}

                  {order.status === "confirmed" && (
                    <Button
                      variant="earn"
                      className="w-full"
                      onClick={() => handleSendPaymentRequest(order.id)}
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Send Payment Request
                    </Button>
                  )}

                  {order.status === "payment_sent" && (
                    <Button
                      variant="default"
                      className="w-full bg-success text-success-foreground"
                      onClick={() => handleMarkPaid(order.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark as Paid
                    </Button>
                  )}

                  {order.status === "paid" && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleComplete(order.id)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Complete Order
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};
