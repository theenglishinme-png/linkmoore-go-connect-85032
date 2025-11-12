import { Search, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
}

export const SearchBar = ({ 
  placeholder = "Who do you want to call? What do you need?", 
  onSearch 
}: SearchBarProps) => {
  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2 bg-card rounded-lg shadow-card border border-border p-2 focus-within:shadow-hover focus-within:border-primary transition-all">
        <Search className="w-5 h-5 text-muted-foreground ml-2" />
        <Input
          type="text"
          placeholder={placeholder}
          className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder:text-muted-foreground"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSearch) {
              onSearch(e.currentTarget.value);
            }
          }}
        />
        <Button size="icon" variant="ghost" className="rounded-full">
          <Mic className="w-5 h-5 text-muted-foreground" />
        </Button>
      </div>
    </div>
  );
};
