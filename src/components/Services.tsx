import { Sparkles, Users, Calendar, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import weddingImage from "@/assets/wedding-couple.jpg";
import familyImage from "@/assets/family-portrait.jpg";
import eventImage from "@/assets/event-dance.jpg";
import productImage from "@/assets/product-jewelry.jpg";

import wed from "@/assets/wed.jpg";
import event from "@/assets/event.jpg";
import portrait from "@/assets/portrait.jpg";

const Services = () => {
  const services = [
    {
      title: "Wedding Photography",
      description: "Comprehensive coverage of your special day, from intimate rituals to grand celebrations, capturing every precious moment with cinematic storytelling.",
      image: wed,
      features: ["Pre-wedding shoots", "Full-day coverage", "Cinematic highlights", "Traditional rituals"]
    },
    {
      title: "Portrait Sessions",
      description: "Professional portraits that capture personality and elegance, from individual headshots to multi-generational family treasures.",
      image: portrait,
      features: ["Individual portraits", "Family sessions", "Professional headshots", "Studio & outdoor"]
    },
    {
      title: "Event Coverage",
      description: "Dynamic photography for cultural events, festivals, and celebrations, preserving the energy and emotion of every occasion.",
      image: event,
      features: ["Cultural festivals", "Corporate events", "Milestone celebrations", "Performances"]
    },
    {
      title: "Product Photography",
      description: "Stunning commercial photography that elevates your brand, perfect for jewelry, fashion, and luxury goods with cultural appeal.",
      image: productImage,
      features: ["Jewelry & accessories", "Fashion editorial", "Lifestyle products", "E-commerce ready"]
    }
  ];

  return (
    <section id="services" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our <span className="text-gradient-gold font-corinthia text-6xl px-2">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Tailored photography services that capture your vision with artistry, professionalism, and cultural authenticity.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <Card 
              key={index}
              className="overflow-hidden hover:shadow-elegant transition-smooth animate-scale-in group border-border"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={service.image} 
                  alt={service.title}
                  className="w-full h-full object-cover transition-smooth group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent flex items-end">
                  <div className="p-6 flex items-center space-x-3">
                    <h3 className="text-2xl font-bold text-white">{service.title}</h3>
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4 leading-relaxed">{service.description}</p>
                <ul className="space-y-2">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-sm text-foreground">
                      <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-3" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
