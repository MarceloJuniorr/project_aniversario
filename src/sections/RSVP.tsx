import { useEffect, useState } from 'react';
import { Send, User, Phone, Users, MessageSquare, CheckCircle, Loader2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';
import { useConfig } from '../context/ConfigContext';

interface FormData {
  name: string;
  phone: string;
  attending: string;
  companions: string[];
  message: string;
}

const RSVP = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phone: '',
    attending: '',
    companions: [],
    message: '',
  });
  
  const { config, addGuest } = useConfig();
  const { rsvp, colors } = config;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const section = document.getElementById('rsvp');
    if (section) observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Adicionar campo de acompanhante
  const addCompanionField = () => {
    setFormData(prev => ({
      ...prev,
      companions: [...prev.companions, '']
    }));
  };

  // Remover campo de acompanhante
  const removeCompanionField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      companions: prev.companions.filter((_, i) => i !== index)
    }));
  };

  // Atualizar nome do acompanhante
  const updateCompanionName = (index: number, name: string) => {
    setFormData(prev => ({
      ...prev,
      companions: prev.companions.map((c, i) => i === index ? name : c)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.attending) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar dados do convidado
      const guest = {
        name: formData.name,
        phone: formData.phone,
        attending: formData.attending === 'sim',
        message: formData.message,
        status: 'pending' as const,
      };

      // Filtrar acompanhantes não vazios
      const validCompanions = formData.companions.filter(c => c.trim() !== '');

      // Salvar no Supabase
      await addGuest(guest, validCompanions);

      setIsSuccess(true);
      toast.success(rsvp.successTitle, {
        description: rsvp.successMessage,
        duration: 5000,
      });

    } catch (error) {
      toast.error('Erro ao enviar confirmação. Tente novamente.');
      console.error('Error submitting RSVP:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      name: '',
      phone: '',
      attending: '',
      companions: [],
      message: '',
    });
  };

  const inputClass = "w-full px-4 py-3 rounded-xl transition-all duration-300 focus:outline-none";
  const inputStyle = {
    backgroundColor: `${colors.background}CC`,
    border: `2px solid ${colors.accent}4D`,
    color: colors.primary,
  };

  if (isSuccess) {
    return (
      <section 
        id="rsvp" 
        className="section-padding"
        style={{ background: `linear-gradient(to bottom, #EDE8DC, ${colors.background})` }}
      >
        <div className="container-custom max-w-2xl">
          <div 
            className="rounded-3xl p-8 sm:p-12 text-center border-2 shadow-xl"
            style={{ 
              backgroundColor: `${colors.background}E6`,
              borderColor: `${colors.accent}4D`
            }}
          >
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ backgroundColor: `${colors.primary}33` }}
            >
              <CheckCircle className="w-10 h-10" style={{ color: colors.primary }} />
            </div>
            <h3 
              className="font-display text-2xl sm:text-3xl mb-4"
              style={{ color: colors.primary }}
            >
              {rsvp.successTitle}
            </h3>
            <p 
              className="font-body mb-8"
              style={{ color: colors.secondary }}
            >
              {rsvp.successMessage}
            </p>
            <button
              onClick={handleReset}
              className="px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: colors.primary,
                color: colors.background,
              }}
            >
              Enviar outra confirmação
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section 
      id="rsvp" 
      className="section-padding"
      style={{ background: `linear-gradient(to bottom, #EDE8DC, ${colors.background})` }}
    >
      <div className="container-custom max-w-2xl">
        {/* Title */}
        <div 
          className={`text-center mb-10 transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
        >
          <h2 
            className="font-display text-3xl sm:text-4xl md:text-5xl mb-4"
            style={{ color: colors.primary }}
          >
            {rsvp.title}
          </h2>
          <p 
            className="font-body text-base sm:text-lg"
            style={{ color: colors.secondary }}
          >
            {rsvp.subtitle} <span className="font-semibold" style={{ color: colors.primary }}>{rsvp.deadline}</span>.
          </p>
        </div>

        {/* Form */}
        <form 
          onSubmit={handleSubmit}
          className={`rounded-3xl p-6 sm:p-10 border-2 shadow-xl
                     transition-all duration-800 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
          style={{ 
            transitionDelay: '0.3s',
            backgroundColor: `${colors.background}E6`,
            borderColor: `${colors.accent}4D`
          }}
        >
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label 
                className="flex items-center gap-2 font-body text-sm mb-2"
                style={{ color: colors.secondary }}
              >
                <User className="w-4 h-4" />
                {rsvp.nameLabel} *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Digite seu nome completo"
                className={inputClass}
                style={inputStyle}
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label 
                className="flex items-center gap-2 font-body text-sm mb-2"
                style={{ color: colors.secondary }}
              >
                <Phone className="w-4 h-4" />
                {rsvp.phoneLabel} *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(38) 99999-9999"
                className={inputClass}
                style={inputStyle}
                required
              />
            </div>

            {/* Attending */}
            <div>
              <label 
                className="flex items-center gap-2 font-body text-sm mb-2"
                style={{ color: colors.secondary }}
              >
                <CheckCircle className="w-4 h-4" />
                {rsvp.attendingLabel} *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label 
                  className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer
                             transition-all duration-300 ${
                    formData.attending === 'sim'
                      ? 'bg-opacity-10'
                      : 'hover:bg-opacity-5'
                  }`}
                  style={{
                    borderColor: formData.attending === 'sim' ? colors.primary : `${colors.accent}4D`,
                    backgroundColor: formData.attending === 'sim' ? `${colors.primary}1A` : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    name="attending"
                    value="sim"
                    checked={formData.attending === 'sim'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="font-body" style={{ color: colors.primary }}>{rsvp.yesOption}</span>
                </label>
                <label 
                  className={`flex items-center justify-center gap-3 p-4 rounded-xl border-2 cursor-pointer
                             transition-all duration-300 ${
                    formData.attending === 'nao'
                      ? 'bg-opacity-10'
                      : 'hover:bg-opacity-5'
                  }`}
                  style={{
                    borderColor: formData.attending === 'nao' ? colors.secondary : `${colors.accent}4D`,
                    backgroundColor: formData.attending === 'nao' ? `${colors.secondary}1A` : 'transparent',
                  }}
                >
                  <input
                    type="radio"
                    name="attending"
                    value="nao"
                    checked={formData.attending === 'nao'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <span className="font-body" style={{ color: colors.primary }}>{rsvp.noOption}</span>
                </label>
              </div>
            </div>

            {/* Companions - Só aparece se for confirmar presença */}
            {formData.attending === 'sim' && (
              <div className="animate-fade-in">
                <label 
                  className="flex items-center gap-2 font-body text-sm mb-3"
                  style={{ color: colors.secondary }}
                >
                  <Users className="w-4 h-4" />
                  {rsvp.companionsLabel}
                </label>
                
                {/* Lista de campos de acompanhantes */}
                <div className="space-y-3 mb-3">
                  {formData.companions.map((companion, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={companion}
                        onChange={(e) => updateCompanionName(index, e.target.value)}
                        placeholder={rsvp.companionPlaceholder}
                        className={`${inputClass} flex-1`}
                        style={inputStyle}
                      />
                      <button
                        type="button"
                        onClick={() => removeCompanionField(index)}
                        className="px-3 py-2 rounded-xl transition-colors"
                        style={{ 
                          backgroundColor: `${colors.secondary}33`,
                          color: colors.secondary
                        }}
                        title={rsvp.removeCompanionButton}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Botão adicionar acompanhante */}
                <button
                  type="button"
                  onClick={addCompanionField}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors text-sm"
                  style={{ 
                    backgroundColor: `${colors.accent}33`,
                    color: colors.primary
                  }}
                >
                  <Plus className="w-4 h-4" />
                  {rsvp.addCompanionButton}
                </button>
              </div>
            )}

            {/* Message */}
            <div>
              <label 
                className="flex items-center gap-2 font-body text-sm mb-2"
                style={{ color: colors.secondary }}
              >
                <MessageSquare className="w-4 h-4" />
                {rsvp.messageLabel}
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Escreva uma mensagem para o Rafael..."
                rows={4}
                className={`${inputClass} resize-none`}
                style={inputStyle}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl
                       font-semibold text-lg transition-all duration-300
                       disabled:opacity-70 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: colors.accent,
                color: colors.primary,
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>{rsvp.submitButton}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default RSVP;
