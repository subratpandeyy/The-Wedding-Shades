import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

type Category = "all" | "wedding" | "portrait" | "event" | "product";

interface PortfolioItem {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  category: Category;
}

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState<Category>("all");
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  const API_BASE = "https://theweddingshades.onrender.com";

  const categories = [
    { id: "all" as Category, label: "All Work" },
    { id: "wedding" as Category, label: "Weddings" },
    { id: "portrait" as Category, label: "Portraits" },
    { id: "event" as Category, label: "Events" },
    { id: "product" as Category, label: "Products" },
  ];

  // Fetch data
  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const { data } = await axios.get(`${API_BASE}/posts`);
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch portfolio:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter((item) => item.category === activeCategory);

  if (loading) return <p className="text-center py-20">Loading...</p>;

  return (
    <section id="portfolio" className="py-24 bg-card pattern-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our <span className="text-gradient-gold font-corinthia text-6xl">Portfolio</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore our collection of visual stories, crafted with passion and precision.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredItems.map((item) => (
            <div
              key={item._id}
              className="group relative overflow-hidden rounded-lg shadow-soft hover:shadow-elegant transition-smooth cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-smooth group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/90 text-sm">{item.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
