import { Heart } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Kala Studios</h3>
            <p className="opacity-90 leading-relaxed">
              Capturing life's precious moments with artistry, cultural authenticity, and timeless elegance.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
            <ul className="space-y-2 opacity-90">
              <li><button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover:opacity-100 transition-smooth">About Us</button></li>
              <li><button onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })} className="hover:opacity-100 transition-smooth">Services</button></li>
              <li><button onClick={() => document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })} className="hover:opacity-100 transition-smooth">Portfolio</button></li>
              <li><button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover:opacity-100 transition-smooth">Contact</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-lg">Business Hours</h4>
            <ul className="space-y-2 opacity-90">
              <li>Monday - Saturday: 10am - 7pm</li>
              <li>Sunday: By Appointment</li>
              <li className="pt-2">Available for destination shoots</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 pt-8 text-center">
          <p className="opacity-90 flex items-center justify-center gap-2">
            Crafted with <Heart className="w-4 h-4 fill-current" /> by Kala Studios © 2024
          </p>
          <button 
            onClick={scrollToTop}
            className="mt-4 opacity-75 hover:opacity-100 transition-smooth text-sm"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
