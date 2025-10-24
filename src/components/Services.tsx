"use client";

import { useEffect, useRef, useState, memo } from "react";
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

// Memoized card component to prevent unnecessary re-renders
const CardItem = memo(({ 
  card, 
  index, 
  imageClassName,
  onImageRef,
  onTextRef,
  shouldLoad
}: {
  card: CardData;
  index: number;
  imageClassName?: string;
  onImageRef: (el: HTMLImageElement | null, idx: number) => void;
  onTextRef: (el: HTMLDivElement | null, idx: number) => void;
  shouldLoad: boolean;
}) => (
  <div className="absolute flex flex-col items-center justify-center w-full h-full">
    <img
      data-index={index}
      src={shouldLoad ? card.image : ""}
      alt={card.alt || ""}
      className={cn(
        "absolute h-full w-full object-cover rounded-2xl will-change-transform",
        imageClassName
      )}
      ref={(el) => onImageRef(el, index)}
      loading="lazy"
      decoding="async"
    />
    <div
      ref={(el) => onTextRef(el, index)}
      className="absolute bottom-10 text-white text-3xl sm:text-4xl md:text-5xl font-semibold tracking-wide text-center font-corinthia"
    >
      {card.alt}
    </div>
  </div>
));

CardItem.displayName = "CardItem";

const StickyCard002 = ({
  cards,
  className,
  containerClassName,
  imageClassName,
}: StickyCard002Props) => {
  const container = useRef<HTMLDivElement | null>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0])); // Preload first image
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // === Optimized lazy-load images ===
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const newLoaded = new Set(loadedImages);
        let hasChanges = false;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index") || "0");
            if (!newLoaded.has(index)) {
              newLoaded.add(index);
              hasChanges = true;
            }
            observer.unobserve(entry.target);
          }
        });

        if (hasChanges) {
          setLoadedImages(newLoaded);
        }
      },
      { rootMargin: "400px" }
    );

    imageRefs.current.forEach((img) => {
      if (img) observer.observe(img);
    });

    return () => observer.disconnect();
  }, []);

  // === Optimized GSAP Animation ===
  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);
      const images = imageRefs.current.filter(Boolean);
      const texts = textRefs.current.filter(Boolean);
      const total = images.length;

      if (total === 0) return;

      // Batch GSAP operations
      gsap.set(images, { force3D: true });
      gsap.set(texts, { force3D: true });

      // Reset initial state in batch
      images.forEach((img, i) => {
        gsap.set(img, {
          y: i === 0 ? "0%" : "100%",
          scale: 1,
          zIndex: total - i,
        });
      });

      texts.forEach((text, i) => {
        gsap.set(text, {
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
          scrub: 0.5, // Slightly higher for smoother feel
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          fastScrollEnd: true,
          preventOverlaps: true,
        },
      });

      tlRef.current = tl;

      // Optimized animation loop
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
        }, i)
          .set([next, nextText], { zIndex: total + i + 1 }, i + 0.5)
          .to([next, nextText], {
            y: "0%",
            scale: 1,
            duration: 1,
            ease: "power2.inOut",
          }, i + 0.5);
      }

      // Debounced refresh on resize
      let resizeTimer: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          ScrollTrigger.refresh();
        }, 150);
      };

      window.addEventListener("resize", handleResize, { passive: true });

      return () => {
        window.removeEventListener("resize", handleResize);
        clearTimeout(resizeTimer);
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    },
    { scope: container, dependencies: [cards.length] }
  );

  const handleImageRef = (el: HTMLImageElement | null, idx: number) => {
    imageRefs.current[idx] = el;
  };

  const handleTextRef = (el: HTMLDivElement | null, idx: number) => {
    textRefs.current[idx] = el;
  };

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
              <CardItem
                key={card.id}
                card={card}
                index={i}
                imageClassName={imageClassName}
                onImageRef={handleImageRef}
                onTextRef={handleTextRef}
                shouldLoad={loadedImages.has(i)}
              />
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
    <ReactLenis root options={{ lerp: 0.1, smoothWheel: true }}>
      <section className="relative w-full bg-black text-white">
        <StickyCard002 cards={studioCards} />
      </section>
    </ReactLenis>
  );
};

export default Skiper17;