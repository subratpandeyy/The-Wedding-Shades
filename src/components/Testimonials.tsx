import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Testimonials = () => {
  const testimonials = [
    {
      name: "Priya & Rahul Sharma",
      role: "Wedding Clients",
      content: "Kala Studios captured our wedding with such elegance and cultural sensitivity. Every ritual, every emotion was preserved beautifully. The team understood our vision perfectly and delivered beyond expectations.",
      rating: 5
    },
    {
      name: "Meera Kapoor",
      role: "Portrait Session",
      content: "The family portraits we received are absolutely stunning. The attention to detail, the lighting, the composition - everything was perfect. These photos will be treasured for generations.",
      rating: 5
    },
    {
      name: "Vikram Industries",
      role: "Commercial Client",
      content: "Outstanding product photography that elevated our jewelry collection. Professional, creative, and delivered exactly what we needed for our marketing campaigns. Highly recommended!",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Client <span className="text-gradient-gold">Testimonials</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Hear from our satisfied clients about their experience with Kala Studios.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="bg-card border-border shadow-soft hover:shadow-elegant transition-smooth animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
