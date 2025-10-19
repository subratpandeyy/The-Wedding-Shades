"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ReactLenis from "lenis/react";
import { cn } from "@/lib/utils";

// === Import your images ===
import wed from "@/assets/wed.jpg";
import event from "@/assets/event.jpg";
import portrait from "@/assets/portrait.jpg";
import productImage from "@/assets/product-jewelry.jpg";

interface CardData {
  id: number | string;
  image: string;
  alt?: string;
}

interface StickyCard002Props {
  cards: CardData[];
  className?: string;
  containerClassName?: string;
  imageClassName?: string;
}

const StickyCard002 = ({
  cards,
  className,
  containerClassName,
  imageClassName,
}: StickyCard002Props) => {
  const container = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [loadedImages, setLoadedImages] = useState<number[]>([]);

  // === Lazy-load images ===
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute("data-index") || "0");
          if (entry.isIntersecting) {
            setLoadedImages((prev) =>
              prev.includes(index) ? prev : [...prev, index]
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "300px" }
    );

    imageRefs.current.forEach((img) => {
      if (img) observer.observe(img);
    });

    return () => observer.disconnect();
  }, []);

  // === GSAP Scroll Animation (Slide + text follow) ===
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const images = imageRefs.current;
      const texts = textRefs.current;
      const total = images.length;

      if (!images[0]) return;

      // Reset initial state
      images.forEach((img, i) => {
        gsap.set(img, {
          y: i === 0 ? "0%" : "100%",
          scale: 1,
          zIndex: total - i,
        });
        gsap.set(texts[i], {
          y: i === 0 ? "0%" : "100%",
          opacity: 1,
          zIndex: total - i,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".sticky-cards",
          start: "top top",
          end: `+=${window.innerHeight * (total - 1)}`,
          scrub: 0.,
          pin: true,
          pinSpacing: true,
        },
      });

      // Slide images & texts together
      for (let i = 0; i < total - 1; i++) {
        const current = images[i];
        const next = images[i + 1];
        const currentText = texts[i];
        const nextText = texts[i + 1];
        if (!current || !next || !currentText || !nextText) continue;

        tl.to([current, currentText], {
          y: "-30%",
          scale: 0.95,
          duration: 1,
          ease: "power2.inOut",
        })
          .set([next, nextText], { zIndex: total + i + 1 })
          .to([next, nextText], {
            y: "0%",
            scale: 1,
            duration: 1,
            ease: "power2.inOut",
          });
      }

      const resizeObserver = new ResizeObserver(() => ScrollTrigger.refresh());
      if (container.current) resizeObserver.observe(container.current);

      return () => {
        resizeObserver.disconnect();
        tl.scrollTrigger?.kill();
        tl.kill();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: container }
  );

  return (
    <section id="services" className="bg-card py-24">
      <div className="container mx-auto px-4">
      <div className="max-w-3xl mx-auto text-center mb-10 animate-fade-in">
      <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Our <span className="text-gradient-gold font-corinthia text-6xl px-1">Services</span>
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
          Tailored photography services that capture your vision with artistry, professionalism, and cultural authenticity.
          </p>
          </div>
          </div>
    <div
      className={cn("relative min-h-[200vh] w-full", className)}
      ref={container}
    >
      <div className="sticky-cards relative flex h-screen w-full items-center justify-center overflow-hidden p-3 lg:p-8">
        <div
          className={cn(
            "relative flex flex-col items-center justify-center h-[90%] w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-3xl overflow-hidden rounded-2xl",
            containerClassName
          )}
        >
          {cards.map((card, i) => (
            <div
              key={card.id}
              className="absolute flex flex-col items-center justify-center w-full h-full"
            >
              <img
                data-index={i}
                src={loadedImages.includes(i) ? card.image : ""}
                alt={card.alt || ""}
                className={cn(
                  "absolute h-full w-full object-cover rounded-2xl will-change-transform",
                  imageClassName
                )}
                ref={(el) => (imageRefs.current[i] = el)}
              />
              <div
                ref={(el) => (textRefs.current[i] = el)}
                className="absolute bottom-10 text-white text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wide text-center font-corinthia"
              >
                {card.alt}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </section>
  );
};

// === Wrapper with ReactLenis ===
const Skiper17 = () => {
  const studioCards = [
    { id: 1, image: wed, alt: "Wedding Photography" },
    { id: 2, image: portrait, alt: "Portrait Sessions" },
    { id: 3, image: event, alt: "Event Coverage" },
    { id: 4, image: productImage, alt: "Product Photography" },
  ];

  return (
    <ReactLenis root>
      <section className="relative w-full bg-black text-white">
        <StickyCard002 cards={studioCards} />
      </section>
    </ReactLenis>
  );
};

export default Skiper17;
