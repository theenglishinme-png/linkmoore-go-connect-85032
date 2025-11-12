import { useState } from "react";
import { CreditCard, Code, DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PaymentConfig {
  paypal: {
    enabled: boolean;
    buttonCode: string;
  };
  mpesa: {
    enabled: boolean;
    apiCode: string;
  };
  emola: {
    enabled: boolean;
    apiCode: string;
  };
}

export const PaymentMethodConfig = () => {
  const { toast } = useToast();
  const [config, setConfig] = useState<PaymentConfig>({
    paypal: {
      enabled: false,
      buttonCode: `<!-- PayPal Button Code Example -->
<div id="paypal-button-container"></div>
<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID&currency=USD"></script>
<script>
  paypal.Buttons({
    createOrder: function(data, actions) {
      return actions.order.create({
        purchase_units: [{
          amount: { value: '0.01' }
        }]
      });
    }
  }).render('#paypal-button-container');
</script>`,
    },
    mpesa: {
      enabled: false,
      apiCode: `// M-Pesa API Integration Example
const mpesaConfig = {
  consumerKey: 'YOUR_CONSUMER_KEY',
  consumerSecret: 'YOUR_CONSUMER_SECRET',
  shortcode: 'YOUR_SHORTCODE',
  passkey: 'YOUR_PASSKEY',
  callbackUrl: 'YOUR_CALLBACK_URL'
};

// STK Push request
async function initiateMpesaPayment(amount, phoneNumber) {
  // Implementation here
}`,
    },
    emola: {
      enabled: false,
      apiCode: `// e-Mola API Integration Example
const emolaConfig = {
  merchantId: 'YOUR_MERCHANT_ID',
  apiKey: 'YOUR_API_KEY',
  apiSecret: 'YOUR_API_SECRET',
  callbackUrl: 'YOUR_CALLBACK_URL'
};

// Payment request
async function initiateEmolaPayment(amount, phoneNumber) {
  // Implementation here
}`,
    },
  });

  const handleToggle = (method: keyof PaymentConfig, enabled: boolean) => {
    setConfig((prev) => ({
      ...prev,
      [method]: { ...prev[method], enabled },
    }));
  };

  const handleCodeChange = (
    method: keyof PaymentConfig,
    field: "buttonCode" | "apiCode",
    value: string
  ) => {
    setConfig((prev) => ({
      ...prev,
      [method]: { ...prev[method], [field]: value },
    }));
  };

  const handleSave = () => {
    toast({
      title: "Payment Configuration Saved",
      description: "Your payment methods have been updated successfully.",
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Methods Configuration
        </CardTitle>
        <CardDescription>
          Configure payment methods for orders and referral checkouts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="paypal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="paypal">PayPal</TabsTrigger>
            <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
            <TabsTrigger value="emola">e-Mola</TabsTrigger>
          </TabsList>

          {/* PayPal Configuration */}
          <TabsContent value="paypal" className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <Label className="text-base font-semibold">Enable PayPal</Label>
                <p className="text-sm text-muted-foreground">
                  Accept PayPal payments with embedded checkout
                </p>
              </div>
              <Switch
                checked={config.paypal.enabled}
                onCheckedChange={(checked) => handleToggle("paypal", checked)}
              />
            </div>

            {config.paypal.enabled && (
              <div className="space-y-2">
                <Label htmlFor="paypal-code" className="flex items-center gap-1">
                  <Code className="w-4 h-4" />
                  PayPal Button Code
                </Label>
                <Textarea
                  id="paypal-code"
                  value={config.paypal.buttonCode}
                  onChange={(e) =>
                    handleCodeChange("paypal", "buttonCode", e.target.value)
                  }
                  rows={12}
                  className="font-mono text-xs"
                  placeholder="Paste your PayPal button code here..."
                />
                <p className="text-xs text-muted-foreground">
                  This code will be embedded in payment notifications and referral checkout pages
                </p>
              </div>
            )}
          </TabsContent>

          {/* M-Pesa Configuration */}
          <TabsContent value="mpesa" className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <Label className="text-base font-semibold">Enable M-Pesa</Label>
                <p className="text-sm text-muted-foreground">
                  Accept M-Pesa mobile money payments
                </p>
              </div>
              <Switch
                checked={config.mpesa.enabled}
                onCheckedChange={(checked) => handleToggle("mpesa", checked)}
              />
            </div>

            {config.mpesa.enabled && (
              <div className="space-y-2">
                <Label htmlFor="mpesa-code" className="flex items-center gap-1">
                  <Code className="w-4 h-4" />
                  M-Pesa API Configuration
                </Label>
                <Textarea
                  id="mpesa-code"
                  value={config.mpesa.apiCode}
                  onChange={(e) => handleCodeChange("mpesa", "apiCode", e.target.value)}
                  rows={12}
                  className="font-mono text-xs"
                  placeholder="Paste your M-Pesa API configuration here..."
                />
                <p className="text-xs text-muted-foreground">
                  Configure M-Pesa API credentials for STK Push payments
                </p>
              </div>
            )}
          </TabsContent>

          {/* e-Mola Configuration */}
          <TabsContent value="emola" className="space-y-4 mt-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <Label className="text-base font-semibold">Enable e-Mola</Label>
                <p className="text-sm text-muted-foreground">
                  Accept e-Mola mobile money payments
                </p>
              </div>
              <Switch
                checked={config.emola.enabled}
                onCheckedChange={(checked) => handleToggle("emola", checked)}
              />
            </div>

            {config.emola.enabled && (
              <div className="space-y-2">
                <Label htmlFor="emola-code" className="flex items-center gap-1">
                  <Code className="w-4 h-4" />
                  e-Mola API Configuration
                </Label>
                <Textarea
                  id="emola-code"
                  value={config.emola.apiCode}
                  onChange={(e) => handleCodeChange("emola", "apiCode", e.target.value)}
                  rows={12}
                  className="font-mono text-xs"
                  placeholder="Paste your e-Mola API configuration here..."
                />
                <p className="text-xs text-muted-foreground">
                  Configure e-Mola API credentials for payment processing
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Button onClick={handleSave} variant="call" className="w-full mt-6">
          <DollarSign className="w-4 h-4 mr-2" />
          Save Payment Configuration
        </Button>
      </CardContent>
    </Card>
  );
};
