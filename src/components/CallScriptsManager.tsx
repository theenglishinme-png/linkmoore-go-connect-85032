import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { FileText, Save } from "lucide-react";

export const CallScriptsManager = () => {
  const { toast } = useToast();
  const [scripts, setScripts] = useState({
    greeting: "Thank you for calling [Business Name]. How may I help you today?",
    orderTaking: "I'd be happy to help you place an order. What would you like to order?",
    closing: "Thank you for your order. Is there anything else I can help you with today?",
  });

  const handleSave = () => {
    toast({
      title: "Scripts Saved",
      description: "Call handling scripts have been updated successfully",
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Call Handling Scripts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Optional: Customize scripts for call agents to use when handling customer calls
        </p>

        <div className="space-y-2">
          <Label htmlFor="greeting">Greeting Script</Label>
          <Textarea
            id="greeting"
            rows={2}
            value={scripts.greeting}
            onChange={(e) => setScripts({ ...scripts, greeting: e.target.value })}
            placeholder="Enter greeting script"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="orderTaking">Order Taking Script</Label>
          <Textarea
            id="orderTaking"
            rows={3}
            value={scripts.orderTaking}
            onChange={(e) => setScripts({ ...scripts, orderTaking: e.target.value })}
            placeholder="Enter order taking script"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="closing">Closing Script</Label>
          <Textarea
            id="closing"
            rows={2}
            value={scripts.closing}
            onChange={(e) => setScripts({ ...scripts, closing: e.target.value })}
            placeholder="Enter closing script"
          />
        </div>

        <Button onClick={handleSave} className="w-full" variant="call">
          <Save className="w-4 h-4 mr-2" />
          Save Scripts
        </Button>
      </CardContent>
    </Card>
  );
};
