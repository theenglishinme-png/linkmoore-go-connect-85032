import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus, Package } from "lucide-react";

interface StockItem {
  id: string;
  name: string;
  quantity: number;
  minQuantity: number;
  price: number;
}

export const StockControl = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<StockItem[]>([
    { id: "1", name: "Large Pizza", quantity: 25, minQuantity: 10, price: 300 },
    { id: "2", name: "Medium Pizza", quantity: 18, minQuantity: 15, price: 250 },
    { id: "3", name: "Small Pizza", quantity: 8, minQuantity: 10, price: 150 },
  ]);

  const [newItem, setNewItem] = useState({
    name: "",
    quantity: "",
    minQuantity: "",
    price: "",
  });

  const updateQuantity = (id: string, change: number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + change);
        if (newQuantity < item.minQuantity) {
          toast({
            title: "Low Stock Alert",
            description: `${item.name} is below minimum quantity`,
            variant: "destructive",
          });
        }
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const addItem = () => {
    if (!newItem.name || !newItem.quantity || !newItem.price) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const item: StockItem = {
      id: Date.now().toString(),
      name: newItem.name,
      quantity: parseInt(newItem.quantity),
      minQuantity: parseInt(newItem.minQuantity) || 0,
      price: parseFloat(newItem.price),
    };

    setItems([...items, item]);
    setNewItem({ name: "", quantity: "", minQuantity: "", price: "" });
    toast({
      title: "Item Added",
      description: `${item.name} has been added to inventory`,
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="w-5 h-5" />
          Stock Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add New Item */}
        <div className="space-y-3 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold text-sm">Add New Item</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="col-span-2">
              <Label>Item Name</Label>
              <Input
                placeholder="Product name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </div>
            <div>
              <Label>Quantity</Label>
              <Input
                type="number"
                placeholder="0"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
              />
            </div>
            <div>
              <Label>Min. Qty</Label>
              <Input
                type="number"
                placeholder="0"
                value={newItem.minQuantity}
                onChange={(e) => setNewItem({ ...newItem, minQuantity: e.target.value })}
              />
            </div>
            <div className="col-span-2">
              <Label>Price (MZN)</Label>
              <Input
                type="number"
                placeholder="0.00"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={addItem} className="w-full" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Item
          </Button>
        </div>

        {/* Stock List */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm">Current Inventory</h3>
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-card rounded-md border border-border"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  Stock: {item.quantity} | Min: {item.minQuantity} | {item.price} MZN
                </p>
                {item.quantity < item.minQuantity && (
                  <p className="text-xs text-destructive font-medium">⚠️ Low Stock</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => updateQuantity(item.id, -1)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => updateQuantity(item.id, 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
