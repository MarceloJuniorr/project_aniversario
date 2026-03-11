import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Copy, Check, Navigation, Shirt } from 'lucide-react';
import { toast } from 'sonner';
import { useConfig } from '../context/ConfigContext';

const EventDetails = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const { config } = useConfig();
  const { eventDetails, colors } = config;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('detalhes');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(eventDetails.address);
      setCopied(true);
      toast.success('Endereço copiado!', {
        description: 'O endereço foi copiado para a área de transferência.',
        duration: 3000,
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast.error('Erro ao copiar');
    }
  };

  const handleOpenMaps = () => {
    const address = encodeURIComponent(eventDetails.address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
  };

  const details = [
    {
      icon: Calendar,
      title: 'Data',
      value: eventDetails.date,
      bgColor: `${colors.accent}33`,
    },
    {
      icon: Clock,
      title: 'Horário',
      value: eventDetails.time,
      bgColor: `${colors.primary}33`,
    },
    {
      icon: MapPin,
      title: 'Local',
      value: eventDetails.location,
      bgColor: `${colors.secondary}33`,
    },
    {
      icon: Shirt,
      title: eventDetails.dressCodeLabel,
      value: eventDetails.dressCode,
      bgColor: `${colors.accent}4D`,
    },
  ];

  return (
    <section 
      id="detalhes" 
      className="section-padding"
      style={{ background: `linear-gradient(to bottom, ${colors.background}, #EDE8DC)` }}
    >
      <div className="container-custom">
        {/* Title */}
        <h2 
          className={`font-display text-3xl sm:text-4xl md:text-5xl text-center mb-12 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ color: colors.primary }}
        >
          {eventDetails.title}
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {details.map((detail, index) => (
            <div
              key={detail.title}
              className={`group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 
                         border shadow-lg
                         hover:shadow-xl hover:-translate-y-1
                         transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ 
                transitionDelay: `${0.2 + index * 0.2}s`,
                borderColor: `${colors.accent}33`,
                boxShadow: `0 10px 30px ${colors.primary}0D`
              }}
            >
              {/* Icon */}
              <div 
                className="w-14 h-14 rounded-xl flex items-center justify-center mb-4
                           group-hover:scale-110 transition-transform duration-300"
                style={{ backgroundColor: detail.bgColor }}
              >
                <detail.icon className="w-7 h-7" style={{ color: colors.primary }} />
              </div>

              {/* Content */}
              <h3 
                className="font-display text-lg mb-2"
                style={{ color: colors.secondary }}
              >
                {detail.title}
              </h3>
              <p 
                className="font-body text-xl font-semibold"
                style={{ color: colors.primary }}
              >
                {detail.value}
              </p>
            </div>
          ))}
        </div>

        {/* Address Card */}
        <div 
          className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 
                     border-2 shadow-xl
                     transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ 
            transitionDelay: '0.8s',
            borderColor: `${colors.accent}4D`
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Map Icon */}
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ 
                background: `linear-gradient(to bottom right, ${colors.accent}4D, ${colors.secondary}33)` 
              }}
            >
              <Navigation className="w-8 h-8" style={{ color: colors.primary }} />
            </div>

            {/* Address Text */}
            <div className="flex-1">
              <h3 
                className="font-display text-xl mb-1"
                style={{ color: colors.primary }}
              >
                Endereço
              </h3>
              <p 
                className="font-body text-base sm:text-lg"
                style={{ color: colors.secondary }}
              >
                {eventDetails.address}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={handleCopyAddress}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium
                         transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.background,
                }}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    <span>{eventDetails.copyButtonText}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleOpenMaps}
                className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium
                         transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: colors.accent,
                  color: colors.primary,
                }}
              >
                <MapPin className="w-5 h-5" />
                <span>{eventDetails.mapsButtonText}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div 
          className={`flex items-center justify-center gap-4 mt-10 transition-all duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '1s' }}
        >
          <div 
            className="w-20 h-px"
            style={{ background: `linear-gradient(to right, transparent, ${colors.accent}, transparent)` }}
          />
        </div>
      </div>
    </section>
  );
};

export default EventDetails;
