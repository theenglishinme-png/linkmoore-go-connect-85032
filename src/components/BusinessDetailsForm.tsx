import { useState } from "react";
import { Building2, Phone, MapPin, Clock, FileText, Image as ImageIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface BusinessDetails {
  businessName: string;
  category: string;
  phone: string;
  email: string;
  location: string;
  address: string;
  hours: string;
  description: string;
  website?: string;
  storePicture?: string;
}

export const BusinessDetailsForm = () => {
  const { toast } = useToast();
  const [details, setDetails] = useState<BusinessDetails>({
    businessName: "Pizza Maputo",
    category: "Food & Delivery",
    phone: "+258 84 111 1111",
    email: "contact@pizzamaputo.co.mz",
    location: "Maputo",
    address: "Av. Julius Nyerere, 1234",
    hours: "9:00 AM - 11:00 PM",
    description: "Best pizzas in Maputo. Fresh ingredients, fast delivery.",
    website: "https://pizzamaputo.co.mz",
    storePicture: "",
  });

  const handleChange = (field: keyof BusinessDetails, value: string) => {
    setDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Business Details Updated",
      description: "Your business information has been saved successfully.",
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Business Details
        </CardTitle>
        <CardDescription>
          Manage your business information and contact details
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName">Business Name</Label>
              <Input
                id="businessName"
                value={details.businessName}
                onChange={(e) => handleChange("businessName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={details.category}
                onChange={(e) => handleChange("category", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={details.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={details.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                City/Location
              </Label>
              <Input
                id="location"
                value={details.location}
                onChange={(e) => handleChange("location", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours" className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Business Hours
              </Label>
              <Input
                id="hours"
                value={details.hours}
                onChange={(e) => handleChange("hours", e.target.value)}
                placeholder="9:00 AM - 5:00 PM"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Full Address</Label>
              <Input
                id="address"
                value={details.address}
                onChange={(e) => handleChange("address", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                type="url"
                value={details.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="https://yourbusiness.com"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="storePicture" className="flex items-center gap-1">
                <ImageIcon className="w-4 h-4" />
                Store Picture
              </Label>
              <div className="flex gap-2">
                <Input
                  id="storePicture"
                  type="url"
                  value={details.storePicture}
                  onChange={(e) => handleChange("storePicture", e.target.value)}
                  placeholder="https://example.com/store-image.jpg or upload"
                />
                <Button type="button" variant="outline" size="icon">
                  <ImageIcon className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Upload or paste URL of your store's main picture
              </p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description" className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                Business Description
              </Label>
              <Textarea
                id="description"
                value={details.description}
                onChange={(e) => handleChange("description", e.target.value)}
                rows={3}
                required
              />
            </div>
          </div>

          <Button type="submit" variant="call" className="w-full">
            Save Business Details
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
