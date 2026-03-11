import { useEffect, useState } from 'react';
import { useConfig } from '../context/ConfigContext';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const Countdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const { config } = useConfig();
  const { countdown, colors } = config;

  useEffect(() => {
    const targetDate = new Date(`${countdown.targetDate}T${countdown.targetTime}:00`);

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    const section = document.getElementById('countdown');
    if (section) observer.observe(section);

    return () => {
      clearInterval(timer);
      observer.disconnect();
    };
  }, [countdown.targetDate, countdown.targetTime]);

  const timeUnits = [
    { value: timeLeft.days, label: 'Dias' },
    { value: timeLeft.hours, label: 'Horas' },
    { value: timeLeft.minutes, label: 'Minutos' },
    { value: timeLeft.seconds, label: 'Segundos' },
  ];

  return (
    <section 
      id="countdown" 
      className="section-padding"
      style={{ background: `linear-gradient(180deg, ${colors.background} 0%, #EDE8DC 100%)` }}
    >
      <div className="container-custom">
        {/* Title */}
        <h2 
          className={`font-display text-3xl sm:text-4xl md:text-5xl text-center mb-12 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{ color: colors.primary }}
        >
          {countdown.title}
        </h2>

        {/* Countdown Cards */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-8">
          {timeUnits.map((unit, index) => (
            <div
              key={unit.label}
              className={`relative transition-all duration-600 ${
                isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
              }`}
              style={{ transitionDelay: `${0.2 + index * 0.15}s` }}
            >
              {/* Orbit Ring */}
              <div 
                className="absolute inset-0 rounded-full border-2 animate-spin"
                style={{ 
                  borderColor: `${colors.accent}4D`,
                  animationDuration: '8s'
                }}
              />
              
              {/* Card */}
              <div 
                className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 
                          bg-white/80 backdrop-blur-sm rounded-full 
                          flex flex-col items-center justify-center
                          shadow-lg"
                style={{ 
                  border: `2px solid ${colors.accent}80`,
                  boxShadow: `0 10px 30px ${colors.accent}1A`
                }}
              >
                <span 
                  className="font-display text-3xl sm:text-4xl md:text-5xl font-bold"
                  style={{ color: colors.primary }}
                >
                  {String(unit.value).padStart(2, '0')}
                </span>
                <span 
                  className="font-body text-xs sm:text-sm mt-1"
                  style={{ color: colors.secondary }}
                >
                  {unit.label}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <p 
          className={`font-accent text-xl sm:text-2xl text-center mt-10 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ 
            color: colors.secondary,
            transitionDelay: '0.8s'
          }}
        >
          {countdown.subtitle}
        </p>

        {/* Decorative Line */}
        <div 
          className={`flex items-center justify-center gap-4 mt-8 transition-all duration-1000 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ transitionDelay: '1s' }}
        >
          <div 
            className="w-16 h-px"
            style={{ background: `linear-gradient(to right, transparent, ${colors.accent})` }}
          />
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colors.accent }}
          />
          <div 
            className="w-16 h-px"
            style={{ background: `linear-gradient(to left, transparent, ${colors.accent})` }}
          />
        </div>
      </div>
    </section>
  );
};

export default Countdown;
