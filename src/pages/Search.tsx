import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowLeft, Filter } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { ServiceCard } from "@/components/ServiceCard";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Search = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const results = [
    {
      id: "1",
      name: "Pizza Maputo Delivery",
      category: "Food & Delivery",
      rating: 4.5,
      verified: true,
      price: "150-300 MZN",
    },
    {
      id: "2",
      name: "Burger House",
      category: "Food & Delivery",
      rating: 4.2,
      verified: true,
      price: "200-350 MZN",
    },
    {
      id: "3",
      name: "Sushi Express",
      category: "Food & Delivery",
      rating: 4.7,
      verified: true,
      price: "300-500 MZN",
    },
  ];

  const handleCall = (name: string) => {
    toast({
      title: "Initiating call...",
      description: `Connecting you to ${name}`,
    });
    // Navigate to call agent page
    navigate("/agent");
  };

  const handleOrder = (name: string) => {
    toast({
      title: "Opening order form...",
      description: `Preparing order from ${name}`,
    });
    // Navigate to business products page
    navigate("/business");
  };

  const handleFilter = () => {
    toast({
      title: "Filters",
      description: "Filter options would appear here"
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <SearchBar
                placeholder="Search for services..."
                onSearch={(q) => setQuery(q)}
              />
            </div>
            <Button variant="outline" size="icon" onClick={handleFilter}>
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Results */}
      <main className="container mx-auto px-4 py-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            {results.length} results {query && `for "${query}"`}
          </h2>
        </div>

        <div className="space-y-4">
          {results.map((service) => (
            <ServiceCard
              key={service.id}
              {...service}
              onCall={() => handleCall(service.name)}
              onOrder={() => handleOrder(service.name)}
            />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Search;
