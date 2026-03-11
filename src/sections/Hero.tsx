import { useEffect, useRef, useState } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { config } = useConfig();
  const { hero, colors } = config;

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const scrollToDetails = () => {
    const detailsSection = document.getElementById('detalhes');
    if (detailsSection) {
      detailsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen w-full overflow-hidden flex items-center justify-center"
    >
      {/* Background Image with Blur */}
      <div 
        className={`absolute inset-0 z-0 transition-all duration-1500 ${
          isLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
        }`}
      >
        <img
          src={hero.backgroundImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
        {/* Dynamic overlay with configurable opacity */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, ${colors.primary}${Math.round(hero.overlayOpacity * 2.55).toString(16).padStart(2, '0')} 0%, ${colors.primary}${Math.round(hero.overlayOpacity * 1.5).toString(16).padStart(2, '0')} 50%, ${colors.primary}${Math.round(hero.overlayOpacity * 2).toString(16).padStart(2, '0')} 100%)`
          }}
        />
        <div 
          className="absolute inset-0"
          style={{ backdropFilter: `blur(${hero.blurAmount}px)` }}
        />
      </div>

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-float"
            style={{
              backgroundColor: colors.accent,
              opacity: 0.4,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-20 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Date Label */}
        <div 
          className={`flex items-center justify-center gap-2 mb-6 transition-all duration-800 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '0.5s' }}
        >
          <Calendar className="w-5 h-5" style={{ color: colors.accent }} />
          <span 
            className="font-accent text-lg tracking-wider"
            style={{ color: colors.background }}
          >
            {hero.date}
          </span>
        </div>

        {/* Main Title */}
        <h1 
          className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl mb-6 text-shadow-hero transition-all duration-1000 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ 
            color: colors.background,
            transitionDelay: '0.7s'
          }}
        >
          {hero.title}
        </h1>

        {/* Subtitle */}
        <p 
          className={`font-body text-lg sm:text-xl md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed transition-all duration-800 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ 
            color: `${colors.background}E6`,
            transitionDelay: '1s'
          }}
        >
          {hero.subtitle}
        </p>

        {/* CTA Button */}
        <div 
          className={`transition-all duration-600 ${
            isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          style={{ transitionDelay: '1.2s' }}
        >
          <a 
            href="#rsvp"
            className="inline-block font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: colors.accent,
              color: colors.primary,
              boxShadow: `0 0 30px ${colors.accent}4D`,
            }}
          >
            {hero.ctaButton}
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToDetails}
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 transition-all duration-500 cursor-pointer ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          color: `${colors.background}B3`,
          transitionDelay: '1.5s'
        }}
        aria-label="Rolar para baixo"
      >
        <ChevronDown className="w-8 h-8 animate-bounce" />
      </button>
    </section>
  );
};

export default Hero;
