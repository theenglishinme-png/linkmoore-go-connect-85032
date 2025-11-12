import { Wallet, TrendingUp, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface WalletCardProps {
  balance: number;
  cashback: number;
  referralEarnings: number;
}

export const WalletCard = ({ balance, cashback, referralEarnings }: WalletCardProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleCashOut = () => {
    toast({
      title: "Cash Out",
      description: "Processing your cash out request...",
    });
  };

  return (
    <Card className="bg-gradient-primary text-primary-foreground shadow-strong">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Wallet className="w-5 h-5" />
          LinkMoore Wallet
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm opacity-90">Available Balance</p>
          <p className="text-3xl font-bold">{balance.toFixed(2)} MZN</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-primary-foreground/20">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs opacity-90">
              <TrendingUp className="w-3 h-3" />
              Cashback
            </div>
            <p className="text-lg font-semibold">{cashback.toFixed(2)} MZN</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs opacity-90">
              <Gift className="w-3 h-3" />
              Referrals
            </div>
            <p className="text-lg font-semibold">{referralEarnings.toFixed(2)} MZN</p>
          </div>
        </div>

        <Button variant="secondary" className="w-full mt-2" onClick={handleCashOut}>
          Cash Out
        </Button>
      </CardContent>
    </Card>
  );
};
