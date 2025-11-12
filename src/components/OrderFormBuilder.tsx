import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, FileText } from "lucide-react";

interface FormField {
  id: string;
  label: string;
  type: "text" | "number" | "select";
  required: boolean;
  options?: string[];
}

export const OrderFormBuilder = () => {
  const { toast } = useToast();
  const [formName, setFormName] = useState("");
  const [fields, setFields] = useState<FormField[]>([]);
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldType, setNewFieldType] = useState<"text" | "number" | "select">("text");

  const addField = () => {
    if (!newFieldLabel) {
      toast({
        title: "Error",
        description: "Please enter a field label",
        variant: "destructive",
      });
      return;
    }

    const newField: FormField = {
      id: Date.now().toString(),
      label: newFieldLabel,
      type: newFieldType,
      required: true,
    };

    setFields([...fields, newField]);
    setNewFieldLabel("");
    toast({
      title: "Field Added",
      description: `"${newFieldLabel}" has been added to the form`,
    });
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
    toast({
      title: "Field Removed",
      description: "Field has been removed from the form",
    });
  };

  const saveForm = () => {
    if (!formName) {
      toast({
        title: "Error",
        description: "Please enter a form name",
        variant: "destructive",
      });
      return;
    }

    if (fields.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one field",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Order Form Saved",
      description: `"${formName}" has been created successfully`,
    });
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Order Form Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="formName">Form Name</Label>
          <Input
            id="formName"
            placeholder="e.g., Pizza Order Form"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </div>

        <div className="space-y-3">
          <Label>Add Form Fields</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Field label"
              value={newFieldLabel}
              onChange={(e) => setNewFieldLabel(e.target.value)}
              className="flex-1"
            />
            <select
              value={newFieldType}
              onChange={(e) => setNewFieldType(e.target.value as "text" | "number" | "select")}
              className="px-3 rounded-md border border-input bg-background"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="select">Dropdown</option>
            </select>
            <Button type="button" onClick={addField} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {fields.length > 0 && (
          <div className="space-y-2">
            <Label>Form Fields</Label>
            <div className="space-y-2">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-3 bg-muted rounded-md"
                >
                  <div>
                    <p className="font-medium text-foreground">{field.label}</p>
                    <p className="text-xs text-muted-foreground capitalize">{field.type}</p>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeField(field.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button onClick={saveForm} className="w-full" variant="call">
          Save Order Form
        </Button>
      </CardContent>
    </Card>
  );
};
