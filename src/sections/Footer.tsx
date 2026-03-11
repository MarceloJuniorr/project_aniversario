import { Heart, Settings } from 'lucide-react';
import { useConfig } from '../context/ConfigContext';

const Footer = () => {
  const { config } = useConfig();
  const { footer, colors } = config;

  return (
    <footer 
      className="py-8"
      style={{ backgroundColor: colors.primary }}
    >
      <div className="container-custom">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Decorative Line */}
          <div 
            className="w-24 h-px mb-6"
            style={{ background: `linear-gradient(to right, transparent, ${colors.accent}80, transparent)` }}
          />
          
          {/* Message */}
          <p 
            className="font-body flex items-center gap-2 flex-wrap justify-center"
            style={{ color: `${colors.background}CC` }}
          >
            {footer.text.split('❤️')[0]}
            <Heart className="w-4 h-4 text-red-400 animate-heart-beat fill-red-400" />
            {footer.text.split('❤️')[1]}
          </p>
          
          {/* Year */}
          <p 
            className="font-accent mt-2 text-sm"
            style={{ color: `${colors.accent}99` }}
          >
            {footer.year}
          </p>

          {/* Admin Button */}
          <a 
            href="/admin.html"
            className="mt-6 flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 hover:scale-105"
            style={{ 
              borderColor: `${colors.accent}66`,
              color: `${colors.background}CC`,
              backgroundColor: `${colors.accent}1A`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${colors.accent}33`;
              e.currentTarget.style.borderColor = colors.accent;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = `${colors.accent}1A`;
              e.currentTarget.style.borderColor = `${colors.accent}66`;
            }}
          >
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Administração do Site</span>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
