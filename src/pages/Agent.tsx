import { Home } from "lucide-react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { OrderConfirmationPanel } from "@/components/OrderConfirmationPanel";
import { useNavigate } from "react-router-dom";

const Agent = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Agent Dashboard</h1>
              <p className="text-sm opacity-90">Order Confirmation & Management</p>
            </div>
            <Button 
              variant="secondary" 
              size="icon"
              onClick={() => navigate("/")}
              title="Home"
            >
              <Home className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <OrderConfirmationPanel />
      </main>

      <BottomNav />
    </div>
  );
};

export default Agent;
