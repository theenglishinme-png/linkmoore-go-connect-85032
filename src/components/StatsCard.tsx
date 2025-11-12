import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatsCard = ({ title, value, icon: Icon, iconColor = "text-primary", trend }: StatsCardProps) => {
  return (
    <Card className="shadow-card hover:shadow-hover transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-lg bg-muted ${iconColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          {trend && (
            <div className={`text-xs font-medium ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
              {trend.isPositive ? '+' : ''}{trend.value}%
            </div>
          )}
        </div>
        <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
        <p className="text-sm text-muted-foreground">{title}</p>
      </CardContent>
    </Card>
  );
};
