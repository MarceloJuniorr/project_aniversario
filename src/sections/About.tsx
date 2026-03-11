import { useEffect, useState } from 'react';
import { Heart, TreeDeciduous, TreePine } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

const About = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { config } = useConfig();
  const { about, colors } = config;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('sobre');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      id="sobre" 
      className="section-padding"
      style={{ backgroundColor: colors.background }}
    >
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Image */}
          <div 
            className={`relative transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'
            }`}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              {/* Image with diagonal clip effect */}
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  src={about.image}
                  alt="Rafael Medeiros"
                  className={`w-full h-full object-cover transition-transform duration-1500 ${
                    isVisible ? 'scale-100' : 'scale-110'
                  }`}
                />
              </div>
              
              {/* Overlay gradient */}
              <div 
                className="absolute inset-0"
                style={{ background: `linear-gradient(to top, ${colors.primary}66, transparent)` }}
              />
            </div>

            {/* Decorative Elements */}
            <div 
              className="absolute -bottom-4 -right-4 w-24 h-24 border-2 rounded-2xl -z-10"
              style={{ borderColor: colors.accent }}
            />
            <div 
              className="absolute -top-4 -left-4 w-16 h-16 rounded-full -z-10"
              style={{ backgroundColor: `${colors.accent}33` }}
            />
            
            {/* Floating Icon */}
            <div 
              className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full shadow-lg animate-float"
            >
              <TreeDeciduous className="w-6 h-6" style={{ color: colors.accent }} />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {/* Title */}
            <h2 
              className={`font-display text-3xl sm:text-4xl md:text-5xl transition-all duration-800 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
              }`}
              style={{ 
                color: colors.primary,
                transitionDelay: '0.3s'
              }}
            >
              {about.title}
            </h2>

            {/* Description */}
            <div 
              className={`space-y-4 transition-all duration-800 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '0.5s' }}
            >
              <p 
                className="font-body text-base sm:text-lg leading-relaxed"
                style={{ color: colors.secondary }}
              >
                {about.paragraph1}
              </p>
              
              <p 
                className="font-body text-base sm:text-lg leading-relaxed"
                style={{ color: colors.secondary }}
              >
                {about.paragraph2}
              </p>
            </div>

            {/* Highlight Box */}
            <div 
              className={`p-6 rounded-r-xl border-l-4 transition-all duration-800 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ 
                background: `linear-gradient(to right, ${colors.accent}33, ${colors.accent}1A)`,
                borderLeftColor: colors.accent,
                transitionDelay: '0.7s'
              }}
            >
              <div className="flex items-start gap-4">
                <Heart 
                  className="w-6 h-6 flex-shrink-0 mt-1 animate-heart-beat" 
                  style={{ color: colors.accent }}
                />
                <div>
                  <p 
                    className="font-display text-lg sm:text-xl font-semibold"
                    style={{ color: colors.primary }}
                  >
                    {about.highlightTitle}
                  </p>
                  <p 
                    className="font-accent text-xl sm:text-2xl mt-1"
                    style={{ color: colors.secondary }}
                  >
                    {about.highlightText}
                  </p>
                </div>
              </div>
            </div>

            {/* Quote */}
            <div 
              className={`relative pt-6 transition-all duration-800 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: '0.9s' }}
            >
              <TreePine 
                className="absolute -top-2 left-0 w-12 h-12" 
                style={{ color: `${colors.accent}33` }}
              />
              <blockquote 
                className="font-accent text-xl sm:text-2xl italic pl-8 border-l-2"
                style={{ 
                  color: colors.secondary,
                  borderLeftColor: `${colors.accent}80`
                }}
              >
                {about.quote}
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
