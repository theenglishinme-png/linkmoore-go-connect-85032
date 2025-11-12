import { Phone, ShoppingBag, Wallet, TrendingUp } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const CategoryTabs = ({ activeTab, onTabChange }: CategoryTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-4 bg-secondary">
        <TabsTrigger value="call" className="flex flex-col items-center gap-1 py-3">
          <Phone className="w-4 h-4" />
          <span className="text-xs">Call</span>
        </TabsTrigger>
        <TabsTrigger value="order" className="flex flex-col items-center gap-1 py-3">
          <ShoppingBag className="w-4 h-4" />
          <span className="text-xs">Order</span>
        </TabsTrigger>
        <TabsTrigger value="wallet" className="flex flex-col items-center gap-1 py-3">
          <Wallet className="w-4 h-4" />
          <span className="text-xs">Wallet</span>
        </TabsTrigger>
        <TabsTrigger value="earn" className="flex flex-col items-center gap-1 py-3">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs">Earn</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};
