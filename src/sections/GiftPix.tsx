import { useEffect, useState } from 'react';
import { Gift, Copy, Check, Wallet, Building2, Heart } from 'lucide-react';
import { toast } from 'sonner';
import { useConfig } from '../context/ConfigContext';

const GiftPix = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const { config } = useConfig();
  const { pix, colors } = config;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('pix');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pix.pixKey.replace(/\s/g, ''));
      setCopied(true);
      toast.success(pix.copiedText, {
        duration: 3000,
      });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast.error('Erro ao copiar');
    }
  };

  return (
    <section 
      id="pix" 
      className="section-padding relative overflow-hidden"
      style={{ background: `linear-gradient(to bottom, ${colors.background}, #EDE8DC)` }}
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                     w-[600px] h-[600px] rounded-full blur-3xl
                     transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
          }`}
          style={{ backgroundColor: `${colors.accent}1A` }}
        />
      </div>

      <div className="container-custom relative z-10">
        {/* Title */}
        <div 
          className={`text-center mb-10 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <Gift className="w-8 h-8" style={{ color: colors.accent }} />
            <h2 
              className="font-display text-3xl sm:text-4xl md:text-5xl"
              style={{ color: colors.primary }}
            >
              {pix.title}
            </h2>
          </div>
          <p 
            className="font-body text-base sm:text-lg max-w-2xl mx-auto"
            style={{ color: colors.secondary }}
          >
            {pix.description}
          </p>
        </div>

        {/* Dream Card */}
        <div 
          className={`max-w-xl mx-auto mb-8 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ transitionDelay: '0.2s' }}
        >
          <div 
            className="rounded-2xl p-6 border"
            style={{ 
              background: `linear-gradient(to right, ${colors.accent}33, ${colors.accent}1A)`,
              borderColor: `${colors.accent}4D`
            }}
          >
            <div className="flex items-center gap-4">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${colors.accent}4D` }}
              >
                <Heart className="w-8 h-8" style={{ color: colors.primary }} />
              </div>
              <div>
                <h3 
                  className="font-display text-xl mb-1"
                  style={{ color: colors.primary }}
                >
                  {pix.dreamTitle}
                </h3>
                <p 
                  className="font-body"
                  style={{ color: colors.secondary }}
                >
                  {pix.dreamText}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* PIX Card */}
        <div 
          className={`max-w-md mx-auto transition-all duration-800 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}
          style={{ transitionDelay: '0.4s' }}
        >
          <div 
            className="relative rounded-3xl p-8 border-2 shadow-2xl"
            style={{ 
              backgroundColor: `${colors.background}F2`,
              borderColor: colors.accent,
              boxShadow: `0 0 60px ${colors.accent}33`
            }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: `linear-gradient(to bottom right, ${colors.accent}, ${colors.secondary})` }}
              >
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-display text-2xl" style={{ color: colors.primary }}>Chave PIX</h3>
              <p className="font-body text-sm mt-1" style={{ color: colors.secondary }}>Clique para copiar</p>
            </div>

            {/* PIX Info */}
            <div className="space-y-4 mb-6">
              <div 
                className="rounded-xl p-4 text-center"
                style={{ backgroundColor: colors.background }}
              >
                <p className="font-body text-xs mb-1" style={{ color: colors.secondary }}>Chave (Telefone)</p>
                <p 
                  className="font-display text-2xl sm:text-3xl tracking-wider"
                  style={{ color: colors.primary }}
                >
                  {pix.pixKey}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div 
                  className="rounded-xl p-3 text-center"
                  style={{ backgroundColor: colors.background }}
                >
                  <p className="font-body text-xs mb-1" style={{ color: colors.secondary }}>Nome</p>
                  <p 
                    className="font-body text-lg font-semibold"
                    style={{ color: colors.primary }}
                  >
                    {pix.pixName}
                  </p>
                </div>
                <div 
                  className="rounded-xl p-3 text-center"
                  style={{ backgroundColor: colors.background }}
                >
                  <p className="font-body text-xs mb-1" style={{ color: colors.secondary }}>Banco</p>
                  <div className="flex items-center justify-center gap-2">
                    <Building2 className="w-4 h-4" style={{ color: colors.primary }} />
                    <p 
                      className="font-body text-lg font-semibold"
                      style={{ color: colors.primary }}
                    >
                      {pix.pixBank}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopyPix}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl
                        font-semibold text-lg transition-all duration-300
                        hover:scale-[1.02] active:scale-[0.98]`}
              style={{
                backgroundColor: copied ? colors.primary : colors.accent,
                color: copied ? colors.background : colors.primary,
              }}
            >
              {copied ? (
                <>
                  <Check className="w-6 h-6" />
                  <span>{pix.copiedText}</span>
                </>
              ) : (
                <>
                  <Copy className="w-6 h-6" />
                  <span>{pix.copyButtonText}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Thank You Message */}
        <p 
          className={`text-center font-accent text-xl mt-8 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ 
            color: colors.secondary,
            transitionDelay: '0.6s'
          }}
        >
          {pix.thankYouMessage}
        </p>
      </div>
    </section>
  );
};

export default GiftPix;
