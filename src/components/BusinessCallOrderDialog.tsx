import { useState, useEffect } from "react";
import { X, Phone, ShoppingBag, Star, CheckCircle2, Package, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { InCallControls } from "./InCallControls";
import { CalendarScheduler } from "./CalendarScheduler";
import { CheckoutDialog } from "./CheckoutDialog";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  inStock: boolean;
  image?: string;
}

interface Business {
  id: string;
  name: string;
  category: string;
  rating: number;
  verified: boolean;
  phone: string;
  description?: string;
  hours?: string;
  location?: string;
}

interface BusinessCallOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  business: Business;
  mode: "call" | "order";
}

export const BusinessCallOrderDialog = ({
  open,
  onOpenChange,
  business,
  mode,
}: BusinessCallOrderDialogProps) => {
  const { toast } = useToast();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isInCall, setIsInCall] = useState(false);
  const [callDuration, setCallDuration] = useState("0:00");
  const [showScheduler, setShowScheduler] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [completedOrderId, setCompletedOrderId] = useState("");

  // Mock products - would come from API in real implementation
  const products: Product[] = [
    {
      id: "1",
      name: "Margherita Pizza",
      description: "Classic tomato sauce and mozzarella",
      price: 250,
      category: "Pizza",
      inStock: true,
    },
    {
      id: "2",
      name: "Pepperoni Pizza",
      description: "Pepperoni, tomato sauce, and mozzarella",
      price: 280,
      category: "Pizza",
      inStock: true,
    },
    {
      id: "3",
      name: "Hawaiian Pizza",
      description: "Ham, pineapple, and mozzarella",
      price: 270,
      category: "Pizza",
      inStock: false,
    },
    {
      id: "4",
      name: "Garlic Bread",
      description: "Toasted bread with garlic butter",
      price: 80,
      category: "Sides",
      inStock: true,
    },
  ];

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isInCall) {
      let seconds = 0;
      interval = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        setCallDuration(`${mins}:${secs.toString().padStart(2, "0")}`);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isInCall]);

  const handleCall = () => {
    toast({
      title: "Connecting Call",
      description: `Calling ${business.name}...`,
    });
    setIsInCall(true);
  };

  const handleEndCall = () => {
    toast({
      title: "Call Ended",
      description: `Call duration: ${callDuration}`,
    });
    setIsInCall(false);
    setCallDuration("0:00");
    onOpenChange(false);
  };

  const handlePlaceOrder = () => {
    if (selectedProducts.length === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one item to order",
        variant: "destructive",
      });
      return;
    }

    const orderId = `ORD-${Date.now()}`;
    setCompletedOrderId(orderId);
    setCheckoutOpen(true);
  };

  const handlePaymentSuccess = () => {
    setOrderPlaced(true);
    setSelectedProducts([]);
  };

  const handleScheduleAppointment = (date: Date, time: string) => {
    setShowScheduler(false);
    onOpenChange(false);
  };

  const total = products
    .filter((p) => selectedProducts.includes(p.id))
    .reduce((sum, p) => sum + p.price, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-3">
            {mode === "call" ? (
              <Phone className="w-5 h-5 text-primary" />
            ) : (
              <ShoppingBag className="w-5 h-5 text-primary" />
            )}
            {mode === "call" ? "Call Business" : "Place Order"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-180px)]">
          <div className="px-6 pb-6 space-y-4">
            {/* In-Call Controls */}
            {isInCall && (
              <>
                <InCallControls onEndCall={handleEndCall} callDuration={callDuration} />
                <Separator />
              </>
            )}
            {/* Business Info */}
            <Card className="shadow-card">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      {business.name}
                      {business.verified && (
                        <CheckCircle2 className="w-4 h-4 text-success" />
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">{business.category}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="text-sm font-medium">{business.rating}</span>
                  </div>
                </div>
                {business.description && (
                  <p className="text-sm text-muted-foreground mb-3">
                    {business.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 text-sm">
                  {business.phone && (
                    <Badge variant="outline" className="gap-1">
                      <Phone className="w-3 h-3" />
                      {business.phone}
                    </Badge>
                  )}
                  {business.hours && (
                    <Badge variant="outline" className="gap-1">
                      <Clock className="w-3 h-3" />
                      {business.hours}
                    </Badge>
                  )}
                  {business.location && (
                    <Badge variant="outline">{business.location}</Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary (after payment) */}
            {orderPlaced && isInCall && (
              <Card className="bg-success/10 border-success">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-success mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground mb-1">Order Confirmed</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        Order ID: {completedOrderId}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Total Paid: <span className="font-semibold text-success">{total} MZN</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        Your order has been confirmed and will be processed shortly.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Products/Services Menu */}
            {!orderPlaced && (mode === "order" || isInCall) && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">
                      {mode === "call" || isInCall ? "Available Products & Services" : "Menu"}
                    </h4>
                    {(mode === "call" || isInCall) && business.category.includes("Service") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowScheduler(!showScheduler)}
                      >
                        Schedule
                      </Button>
                    )}
                  </div>
                  {(mode === "call" || isInCall) && (
                    <p className="text-sm text-muted-foreground">
                      {isInCall ? "Order while on the call" : "Browse available items"}
                    </p>
                  )}

                  {showScheduler ? (
                    <CalendarScheduler
                      businessName={business.name}
                      onSchedule={handleScheduleAppointment}
                    />
                  ) : (
                    <>
                    {products.map((product) => (
                      <Card
                        key={product.id}
                        className={`${mode === "order" || isInCall ? "cursor-pointer" : ""} transition-all ${
                          selectedProducts.includes(product.id)
                            ? "ring-2 ring-primary"
                            : ""
                        } ${!product.inStock ? "opacity-50" : ""}`}
                        onClick={() => (mode === "order" || isInCall) && product.inStock && toggleProduct(product.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h5 className="font-medium text-foreground">
                                  {product.name}
                                </h5>
                                {!product.inStock && (
                                  <Badge variant="destructive" className="text-xs">
                                    Out of Stock
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {product.description}
                              </p>
                              <div className="flex items-center gap-2">
                                <Badge>{product.category}</Badge>
                                <span className="text-sm font-semibold text-primary">
                                  {product.price} MZN
                                </span>
                              </div>
                            </div>
                            {(mode === "order" || isInCall) && selectedProducts.includes(product.id) && (
                              <CheckCircle2 className="w-5 h-5 text-primary ml-2" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    </>
                  )}
                </div>

                {/* Order Summary */}
                {(mode === "order" || isInCall) && selectedProducts.length > 0 && (
                  <>
                    <Separator />
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          {selectedProducts.length} item(s) selected
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-foreground">Total</span>
                        <span className="text-lg font-bold text-primary">{total} MZN</span>
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        {!isInCall && (
          <div className="p-6 pt-4 border-t border-border flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            {mode === "call" ? (
              <Button variant="call" onClick={handleCall} className="flex-1">
                <Phone className="w-4 h-4 mr-2" />
                Call Now
              </Button>
            ) : (
              <Button
                variant="earn"
                onClick={handlePlaceOrder}
                className="flex-1"
                disabled={selectedProducts.length === 0}
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                Proceed to Checkout
              </Button>
            )}
          </div>
        )}
        
        {isInCall && selectedProducts.length > 0 && !orderPlaced && (
          <div className="p-6 pt-4 border-t border-border">
            <Button
              variant="earn"
              onClick={handlePlaceOrder}
              className="w-full"
            >
              <ShoppingBag className="w-4 h-4 mr-2" />
              Checkout ({total} MZN)
            </Button>
          </div>
        )}
      </DialogContent>

      {/* Checkout Dialog */}
      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        amount={total}
        orderId={completedOrderId}
        businessName={business.name}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </Dialog>
  );
};
