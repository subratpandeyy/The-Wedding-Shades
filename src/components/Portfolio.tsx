import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Camera } from "lucide-react";

type Category = "all" | "Wedding" | "Portraits" | "Events" | "Products";

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

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // you can adjust this as needed

  // Overlay state
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  const API_BASE = "https://theweddingshades.onrender.com";

  const categories = [
    { id: "all" as Category, label: "All Work" },
    { id: "Wedding" as Category, label: "Weddings" },
    { id: "Portraits" as Category, label: "Portraits" },
    { id: "Events" as Category, label: "Events" },
    { id: "Products" as Category, label: "Products" },
  ];

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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  if (loading) return <p className="text-center py-20">Loading...</p>;

  return (
    <section id="portfolio" className="py-24 bg-card pattern-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Our{" "}
            <span className="text-gradient-gold font-corinthia text-6xl px-2">
              Portfolio
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore our collection of visual stories, crafted with passion and
            precision.
          </p>
        </div>

        {!items || items.length === 0 ? (
          <p className="text-center py-20 flex flex-row justify-center gap-2 text-gray-700">
            The Gallery is Empty! <Camera />
          </p>
        ) : (
          <>
            {/* Category Filter */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={
                    activeCategory === category.id ? "default" : "outline"
                  }
                  onClick={() => {
                    setActiveCategory(category.id);
                    setCurrentPage(1);
                  }}
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* Portfolio Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {currentItems.map((item) => (
                <div
                  key={item._id}
                  className="group relative overflow-hidden rounded-lg shadow-soft hover:shadow-elegant transition-smooth cursor-pointer"
                  onClick={() => setSelectedItem(item)} // Open overlay
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <Button
                  variant="outline"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Prev
                </Button>
                <span className="px-3">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Overlay Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative bg-white rounded-lg overflow-hidden max-w-3xl w-full shadow-elegant"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedItem.imageUrl}
              alt={selectedItem.title}
              className="w-full h-[70vh] object-cover"
            />
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">{selectedItem.title}</h3>
              <p className="text-gray-700">{selectedItem.content}</p>
            </div>
            <button
              className="absolute top-3 right-3 bg-black/60 text-white px-3 py-1 rounded hover:bg-black"
              onClick={() => setSelectedItem(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Portfolio;
