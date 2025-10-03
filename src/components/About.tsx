import { Camera, Heart, Award } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Camera,
      title: "Professional Excellence",
      description: "Over a decade of experience capturing life's most precious moments with artistic vision and technical mastery."
    },
    {
      icon: Heart,
      title: "Cultural Sensitivity",
      description: "Deep understanding and respect for Indian traditions, ensuring every cultural nuance is beautifully preserved."
    },
    {
      icon: Award,
      title: "Award-Winning Team",
      description: "Recognized nationally for our innovative approach and commitment to delivering stunning, timeless imagery."
    }
  ];

  return (
    <section id="about" className="py-24 bg-card pattern-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About <span className="text-gradient-gold">Kala Studios</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            At Kala Studios, we believe every photograph tells a story. Our passion is to capture the essence 
            of your most cherished moments with artistic vision, cultural authenticity, and cinematic beauty. 
            From intimate portraits to grand celebrations, we craft visual narratives that last generations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-background p-8 rounded-lg shadow-soft hover:shadow-elegant transition-smooth animate-fade-in-up text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <feature.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
