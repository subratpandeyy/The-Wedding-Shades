import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const Contact = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for reaching out. We'll get back to you soon.",
    });
    setIsOpen(false);
  };

  const contactInfo = [
    { icon: Phone, label: "Phone", value: "+91 98765 43210" },
    { icon: Mail, label: "Email", value: "hello@kalastudios.in" },
    { icon: MapPin, label: "Location", value: "Bhubaneshwar, Odisha" },
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 z-50"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Overlay & Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-card rounded-xl w-[90%] max-w-3xl shadow-elegant overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            <div className="p-6 flex justify-between items-center border-b border-border">
              <h2 className="text-2xl font-bold text-foreground">
                Get in <span className="text-gradient-gold font-corinthia text-4xl">Touch</span>
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-2xl text-muted-foreground hover:text-foreground"
              >
                ×
              </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 p-6">
              {/* Contact Form */}
              <Card className="shadow-elegant border-border">
                <CardContent className="p-6">
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
                      <Input type="tel" placeholder="+91 ...." className="border-border" required />
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
              <div className="space-y-6">
                <Card className="bg-background border-border shadow-soft">
                  <CardContent className="p-6 space-y-6">
                    {contactInfo.map((info, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                          <info.icon className="w-6 h-6 text-primary" />
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
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Follow Our Journey</h3>
                    <div className="flex space-x-4">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full w-10 h-10 transition-smooth hover:scale-110 bg-white"
                      >
                        <Instagram className="w-5 h-5" />
                      </Button>
                      <Button
                        variant="secondary"
                        size="icon"
                        className="rounded-full w-10 h-10 transition-smooth hover:scale-110 bg-white"
                      >
                        <Facebook className="w-5 h-5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;
