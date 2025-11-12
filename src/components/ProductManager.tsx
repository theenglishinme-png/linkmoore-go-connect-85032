import { useState } from "react";
import { Plus, Edit2, Trash2, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  discount?: {
    enabled: boolean;
    type: "percentage" | "fixed";
    value: number;
  };
  affiliateFee?: {
    enabled: boolean;
    type: "percentage" | "fixed";
    value: number;
  };
}

export const ProductManager = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Margherita Pizza",
      description: "Classic tomato sauce and mozzarella",
      price: 250,
      category: "Pizza",
      discount: { enabled: true, type: "percentage", value: 10 },
      affiliateFee: { enabled: true, type: "percentage", value: 5 },
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    discountEnabled: false,
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: "",
    affiliateFeeEnabled: false,
    affiliateFeeType: "percentage" as "percentage" | "fixed",
    affiliateFeeValue: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const product: Product = {
      id: editingProduct?.id || Date.now().toString(),
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image || undefined,
      discount: formData.discountEnabled
        ? {
            enabled: true,
            type: formData.discountType,
            value: parseFloat(formData.discountValue),
          }
        : undefined,
      affiliateFee: formData.affiliateFeeEnabled
        ? {
            enabled: true,
            type: formData.affiliateFeeType,
            value: parseFloat(formData.affiliateFeeValue),
          }
        : undefined,
    };

    if (editingProduct) {
      setProducts(products.map((p) => (p.id === editingProduct.id ? product : p)));
      toast({
        title: "Product Updated",
        description: `${product.name} has been updated successfully.`,
      });
    } else {
      setProducts([...products, product]);
      toast({
        title: "Product Created",
        description: `${product.name} has been added to your store.`,
      });
    }

    resetForm();
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image || "",
      discountEnabled: product.discount?.enabled || false,
      discountType: product.discount?.type || "percentage",
      discountValue: product.discount?.value.toString() || "",
      affiliateFeeEnabled: product.affiliateFee?.enabled || false,
      affiliateFeeType: product.affiliateFee?.type || "percentage",
      affiliateFeeValue: product.affiliateFee?.value.toString() || "",
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const product = products.find((p) => p.id === id);
    setProducts(products.filter((p) => p.id !== id));
    toast({
      title: "Product Deleted",
      description: `${product?.name} has been removed from your store.`,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
      discountEnabled: false,
      discountType: "percentage",
      discountValue: "",
      affiliateFeeEnabled: false,
      affiliateFeeType: "percentage",
      affiliateFeeValue: "",
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Product Management</CardTitle>
            <CardDescription>Create and manage your products and services</CardDescription>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-border rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-foreground">
                {editingProduct ? "Edit Product" : "New Product"}
              </h4>
              <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                Cancel
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (MZN)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label htmlFor="image">Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button type="button" variant="outline" size="icon">
                    <ImageIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Discount Settings */}
            <div className="space-y-3 p-3 border border-border rounded">
              <div className="flex items-center justify-between">
                <Label htmlFor="discount-enabled">Enable Discount</Label>
                <Switch
                  id="discount-enabled"
                  checked={formData.discountEnabled}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, discountEnabled: checked })
                  }
                />
              </div>

              {formData.discountEnabled && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Discount Type</Label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.discountType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          discountType: e.target.value as "percentage" | "fixed",
                        })
                      }
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (MZN)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="discount-value">Discount Value</Label>
                    <Input
                      id="discount-value"
                      type="number"
                      step="0.01"
                      value={formData.discountValue}
                      onChange={(e) =>
                        setFormData({ ...formData, discountValue: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Affiliate Fee Settings */}
            <div className="space-y-3 p-3 border border-border rounded">
              <div className="flex items-center justify-between">
                <Label htmlFor="affiliate-enabled">Enable Affiliate Fee</Label>
                <Switch
                  id="affiliate-enabled"
                  checked={formData.affiliateFeeEnabled}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, affiliateFeeEnabled: checked })
                  }
                />
              </div>

              {formData.affiliateFeeEnabled && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Fee Type</Label>
                    <select
                      className="w-full h-10 px-3 rounded-md border border-input bg-background"
                      value={formData.affiliateFeeType}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          affiliateFeeType: e.target.value as "percentage" | "fixed",
                        })
                      }
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (MZN)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="affiliate-value">Fee Value</Label>
                    <Input
                      id="affiliate-value"
                      type="number"
                      step="0.01"
                      value={formData.affiliateFeeValue}
                      onChange={(e) =>
                        setFormData({ ...formData, affiliateFeeValue: e.target.value })
                      }
                    />
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" variant="call">
              {editingProduct ? "Update Product" : "Create Product"}
            </Button>
          </form>
        )}

        {/* Product List */}
        <div className="space-y-3">
          {products.map((product) => (
            <div
              key={product.id}
              className="flex items-start gap-3 p-3 border border-border rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-foreground">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline">{product.category}</Badge>
                  <Badge variant="default">{product.price} MZN</Badge>
                  {product.discount?.enabled && (
                    <Badge className="bg-success text-success-foreground">
                      {product.discount.type === "percentage"
                        ? `${product.discount.value}% OFF`
                        : `${product.discount.value} MZN OFF`}
                    </Badge>
                  )}
                  {product.affiliateFee?.enabled && (
                    <Badge variant="secondary">
                      {product.affiliateFee.type === "percentage"
                        ? `${product.affiliateFee.value}% Affiliate`
                        : `${product.affiliateFee.value} MZN Affiliate`}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
