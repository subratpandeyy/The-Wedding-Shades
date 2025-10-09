import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon.",
    });
  };

  const contactInfo = [
    { icon: Phone, label: "Phone", value: "+91 98765 43210" },
    { icon: Mail, label: "Email", value: "hello@kalastudios.in" },
    { icon: MapPin, label: "Location", value: "Mumbai, Maharashtra" },
  ];

  return (
    <section id="contact" className="py-24 bg-card pattern-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Get in <span className="text-gradient-gold font-corinthia text-6xl">Touch</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Ready to create timeless memories? Let's discuss your photography needs.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="shadow-elegant border-border animate-fade-in-up">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Your Name</label>
                  <Input placeholder="Enter your full name" className="border-border" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Email Address</label>
                  <Input type="email" placeholder="your@email.com" className="border-border" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Phone Number</label>
                  <Input type="tel" placeholder="+91 98765 43210" className="border-border" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Service Interest</label>
                  <Input placeholder="e.g., Wedding Photography" className="border-border" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-foreground">Your Message</label>
                  <Textarea 
                    placeholder="Tell us about your event, date, and any specific requirements..."
                    className="min-h-32 border-border"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-elegant transition-smooth"
                  size="lg"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Card className="bg-background border-border shadow-soft">
              <CardContent className="p-8 space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground mb-1">{info.label}</p>
                      <p className="text-muted-foreground">{info.value}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-primary text-primary-foreground border-0 shadow-elegant">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Follow Our Journey</h3>
                <p className="mb-6 opacity-90">
                  Stay updated with our latest work, behind-the-scenes moments, and photography tips.
                </p>
                <div className="flex space-x-4">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="rounded-full w-12 h-12 transition-smooth hover:scale-110"
                  >
                    <Instagram className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="rounded-full w-12 h-12 transition-smooth hover:scale-110"
                  >
                    <Facebook className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="bg-gradient-to-br from-accent to-secondary p-8 rounded-lg text-white shadow-elegant">
              <h3 className="text-2xl font-bold mb-3">Book Your Session</h3>
              <p className="mb-4 opacity-90">
                Limited slots available. Reserve your date today to ensure availability for your special occasion.
              </p>
              <p className="text-sm opacity-80">
                ⭐ Special packages available for wedding season
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
