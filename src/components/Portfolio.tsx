import { useState } from "react";
import { Button } from "@/components/ui/button";
import weddingImage from "@/assets/wedding-couple.jpg";
import familyImage from "@/assets/family-portrait.jpg";
import eventImage from "@/assets/event-dance.jpg";
import productImage from "@/assets/product-jewelry.jpg";

type Category = 'all' | 'wedding' | 'portrait' | 'event' | 'product';

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState<Category>('all');

  const categories = [
    { id: 'all' as Category, label: 'All Work' },
    { id: 'wedding' as Category, label: 'Weddings' },
    { id: 'portrait' as Category, label: 'Portraits' },
    { id: 'event' as Category, label: 'Events' },
    { id: 'product' as Category, label: 'Products' },
  ];

  const portfolioItems = [
    { id: 1, category: 'wedding', image: weddingImage, title: 'Royal Wedding Ceremony', description: 'Traditional Hindu wedding' },
    { id: 2, category: 'portrait', image: familyImage, title: 'Family Heritage', description: 'Multi-generational portrait' },
    { id: 3, category: 'event', image: eventImage, title: 'Cultural Festival', description: 'Dance performance' },
    { id: 4, category: 'product', image: productImage, title: 'Luxury Collection', description: 'Traditional jewelry' },
    { id: 5, category: 'wedding', image: weddingImage, title: 'Elegant Celebration', description: 'Destination wedding' },
    { id: 6, category: 'portrait', image: familyImage, title: 'Timeless Beauty', description: 'Individual portrait' },
  ];

  const filteredItems = activeCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeCategory);

  return (
    <section id="portfolio" className="py-24 bg-card pattern-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our <span className="text-gradient-gold">Portfolio</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Explore our collection of visual stories, crafted with passion and precision.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className={`transition-smooth ${
                activeCategory === category.id 
                  ? 'bg-primary text-primary-foreground shadow-elegant' 
                  : 'hover:bg-muted'
              }`}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {filteredItems.map((item, index) => (
            <div 
              key={item.id}
              className="group relative overflow-hidden rounded-lg shadow-soft hover:shadow-elegant transition-smooth animate-scale-in cursor-pointer"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-smooth group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-smooth flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/90 text-sm">{item.description}</p>
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
