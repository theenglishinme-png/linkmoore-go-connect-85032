import { Phone, ShoppingBag, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
  name: string;
  category: string;
  rating: number;
  verified?: boolean;
  image?: string;
  price?: string;
  onCall?: () => void;
  onOrder?: () => void;
}

export const ServiceCard = ({
  name,
  category,
  rating,
  verified = false,
  image,
  price,
  onCall,
  onOrder,
}: ServiceCardProps) => {
  return (
    <Card className="overflow-hidden shadow-card hover:shadow-hover transition-all">
      <div className="relative h-32 bg-gradient-to-br from-primary/10 to-primary/5">
        {image && (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        )}
        {verified && (
          <Badge className="absolute top-2 right-2 bg-success text-success-foreground">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Verified
          </Badge>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground">{category}</p>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-accent text-accent" />
            <span className="text-sm font-medium text-foreground">{rating}</span>
          </div>
          {price && (
            <span className="text-sm font-semibold text-primary">{price}</span>
          )}
        </div>

        <div className="flex gap-2">
          <Button 
            variant="call" 
            size="sm" 
            className="flex-1"
            onClick={onCall}
          >
            <Phone className="w-4 h-4" />
            Call
          </Button>
          {onOrder && (
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={onOrder}
            >
              <ShoppingBag className="w-4 h-4" />
              Order
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
