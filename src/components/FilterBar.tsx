import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Search, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: {
    label: string;
    value: string;
    options: FilterOption[];
    onChange: (value: string) => void;
  }[];
  onExport?: () => void;
  showDateRange?: boolean;
  onDateRangeClick?: () => void;
}

export const FilterBar = ({
  searchValue,
  onSearchChange,
  filters = [],
  onExport,
  showDateRange,
  onDateRangeClick,
}: FilterBarProps) => {
  return (
    <Card className="shadow-card">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-3">
          {onSearchChange && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
              />
              {searchValue && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            {showDateRange && (
              <Button variant="outline" size="sm" onClick={onDateRangeClick}>
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            )}

            {filters.map((filter) => (
              <Select key={filter.label} value={filter.value} onValueChange={filter.onChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder={filter.label} />
                </SelectTrigger>
                <SelectContent>
                  {filter.options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}

            {onExport && (
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
