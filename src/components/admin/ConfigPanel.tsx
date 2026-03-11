import { useState, useRef, memo } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { 
  Palette, Type, Image, Calendar, MapPin, Gift, 
  RefreshCw, Download, Upload, Eye, EyeOff, Save,
  ChevronDown, ChevronUp, Loader2, Check
} from 'lucide-react';
import { toast } from 'sonner';

// Componente InputField separado para evitar perda de foco
interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'textarea' | 'color' | 'number';
  placeholder?: string;
  min?: number;
  max?: number;
}

const InputField = memo(({ label, value, onChange, type = 'text', placeholder, min, max }: InputFieldProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label className="block font-body text-sm text-[#5C4024] mb-2">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-3 bg-[#F5F0E6] border border-[#D4AF37]/30 rounded-xl text-[#3D2914] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 resize-none transition-all"
        />
      ) : type === 'color' ? (
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={value}
            onChange={handleChange}
            className="w-16 h-10 rounded-lg border border-[#D4AF37]/30 cursor-pointer"
          />
          <span className="font-mono text-sm text-[#5C4024]">{value}</span>
        </div>
      ) : (
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          min={min}
          max={max}
          className="w-full px-4 py-3 bg-[#F5F0E6] border border-[#D4AF37]/30 rounded-xl text-[#3D2914] focus:outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
        />
      )}
    </div>
  );
});

InputField.displayName = 'InputField';

interface SectionProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  onSave: () => void;
  isSaving: boolean;
  hasChanges: boolean;
}

const CollapsibleSection = ({ 
  title, icon: Icon, children, isOpen, onToggle, onSave, isSaving, hasChanges 
}: SectionProps) => (
  <div className="bg-white rounded-xl border border-[#D4AF37]/30 overflow-hidden mb-4">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-[#F5F0E6] to-white hover:from-[#EDE8DC] transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[#D4AF37]/20 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#3D2914]" />
        </div>
        <span className="font-display text-lg text-[#3D2914]">{title}</span>
        {hasChanges && (
          <span className="px-2 py-0.5 bg-[#D4AF37]/20 text-[#8B6914] text-xs rounded-full">
            Modificado
          </span>
        )}
      </div>
      {isOpen ? <ChevronUp className="w-5 h-5 text-[#8B6914]" /> : <ChevronDown className="w-5 h-5 text-[#8B6914]" />}
    </button>
    {isOpen && (
      <div className="p-4">
        {children}
        <div className="mt-4 flex justify-end">
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-[#4A5D23] text-white rounded-lg hover:bg-[#3D4A1C] transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
              </>
            )}
          </button>
        </div>
      </div>
    )}
  </div>
);

const ConfigPanel = () => {
  const { 
    config, 
    updateHero, 
    updateCountdown, 
    updateAbout, 
    updateEventDetails, 
    updateRsvp, 
    updatePix, 
    updateFooter,
    updateColors,
    resetConfig,
    exportConfig,
    importConfig
  } = useConfig();

  const [openSections, setOpenSections] = useState<string[]>(['hero']);
  const [previewMode, setPreviewMode] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importRef = useRef<HTMLInputElement>(null);

  // Estados locais para cada seção
  const [heroData, setHeroData] = useState(config.hero);
  const [colorsData, setColorsData] = useState(config.colors);
  const [countdownData, setCountdownData] = useState(config.countdown);
  const [aboutData, setAboutData] = useState(config.about);
  const [eventDetailsData, setEventDetailsData] = useState(config.eventDetails);
  const [rsvpData, setRsvpData] = useState(config.rsvp);
  const [pixData, setPixData] = useState(config.pix);
  const [footerData, setFooterData] = useState(config.footer);

  const toggleSection = (section: string) => {
    setOpenSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleImageUpload = (section: 'hero' | 'about', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        if (section === 'hero') {
          setHeroData(prev => ({ ...prev, backgroundImage: base64 }));
        } else {
          setAboutData(prev => ({ ...prev, image: base64 }));
        }
        toast.success('Imagem carregada! Clique em Salvar para confirmar.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (section: string, updateFn: (data: any) => Promise<void>, data: any) => {
    setSavingSection(section);
    try {
      await updateFn(data);
      toast.success(`${section} salvo com sucesso!`);
    } catch (error) {
      toast.error(`Erro ao salvar ${section}`);
      console.error(error);
    } finally {
      setSavingSection(null);
    }
  };

  const handleExport = () => {
    const data = exportConfig();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `config_rafael_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Configuração exportada!');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const success = await importConfig(reader.result as string);
        if (success) {
          // Atualizar estados locais
          setHeroData(config.hero);
          setColorsData(config.colors);
          setCountdownData(config.countdown);
          setAboutData(config.about);
          setEventDetailsData(config.eventDetails);
          setRsvpData(config.rsvp);
          setPixData(config.pix);
          setFooterData(config.footer);
          toast.success('Configuração importada com sucesso!');
        } else {
          toast.error('Erro ao importar configuração');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleReset = async () => {
    if (confirm('Tem certeza que deseja resetar todas as configurações?')) {
      await resetConfig();
      // Atualizar estados locais
      setHeroData(config.hero);
      setColorsData(config.colors);
      setCountdownData(config.countdown);
      setAboutData(config.about);
      setEventDetailsData(config.eventDetails);
      setRsvpData(config.rsvp);
      setPixData(config.pix);
      setFooterData(config.footer);
      toast.success('Configurações resetadas!');
    }
  };

  if (previewMode) {
    return (
      <div className="fixed inset-0 bg-white z-50">
        <div className="absolute top-4 right-4 z-50">
          <button
            onClick={() => setPreviewMode(false)}
            className="flex items-center gap-2 px-4 py-2 bg-[#3D2914] text-white rounded-lg hover:bg-[#5C4024] transition-colors"
          >
            <EyeOff className="w-4 h-4" />
            <span>Sair da Prévia</span>
          </button>
        </div>
        <iframe 
          src="/" 
          className="w-full h-full border-0"
          title="Preview"
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={() => setPreviewMode(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#4A5D23] text-white rounded-lg hover:bg-[#3D4A1C] transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>Ver Site</span>
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-[#D4AF37] text-[#3D2914] rounded-lg hover:bg-[#C4A030] transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Config</span>
        </button>
        <button
          onClick={() => importRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 bg-[#8B6914] text-white rounded-lg hover:bg-[#7A5C12] transition-colors"
        >
          <Upload className="w-4 h-4" />
          <span>Importar Config</span>
        </button>
        <input
          ref={importRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Resetar</span>
        </button>
      </div>

      {/* Hero Section */}
      <CollapsibleSection
        title="Hero (Capa)"
        icon={Image}
        isOpen={openSections.includes('hero')}
        onToggle={() => toggleSection('hero')}
        onSave={() => handleSave('Hero', updateHero, heroData)}
        isSaving={savingSection === 'Hero'}
        hasChanges={JSON.stringify(heroData) !== JSON.stringify(config.hero)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Data do Evento"
            value={heroData.date}
            onChange={(v) => setHeroData(prev => ({ ...prev, date: v }))}
          />
          <InputField
            label="Título"
            value={heroData.title}
            onChange={(v) => setHeroData(prev => ({ ...prev, title: v }))}
          />
          <div className="md:col-span-2">
            <InputField
              label="Subtítulo"
              value={heroData.subtitle}
              onChange={(v) => setHeroData(prev => ({ ...prev, subtitle: v }))}
              type="textarea"
            />
          </div>
          <InputField
            label="Texto do Botão"
            value={heroData.ctaButton}
            onChange={(v) => setHeroData(prev => ({ ...prev, ctaButton: v }))}
          />
          <div className="mb-4">
            <label className="block font-body text-sm text-[#5C4024] mb-2">Imagem de Fundo</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('hero', e)}
                className="hidden"
                ref={fileInputRef}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-[#F5F0E6] border border-[#D4AF37]/30 rounded-lg hover:bg-[#EDE8DC] transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Escolher Imagem</span>
              </button>
              {heroData.backgroundImage && (
                <img 
                  src={heroData.backgroundImage} 
                  alt="Preview" 
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
            </div>
          </div>
          <InputField
            label="Opacidade do Overlay (0-100)"
            value={String(heroData.overlayOpacity)}
            onChange={(v) => setHeroData(prev => ({ ...prev, overlayOpacity: parseInt(v) || 60 }))}
            type="number"
            min={0}
            max={100}
          />
          <InputField
            label="Blur da Imagem (0-10px)"
            value={String(heroData.blurAmount)}
            onChange={(v) => setHeroData(prev => ({ ...prev, blurAmount: parseInt(v) || 2 }))}
            type="number"
            min={0}
            max={10}
          />
        </div>
      </CollapsibleSection>

      {/* Colors Section */}
      <CollapsibleSection
        title="Cores do Tema"
        icon={Palette}
        isOpen={openSections.includes('colors')}
        onToggle={() => toggleSection('colors')}
        onSave={() => handleSave('Cores', updateColors, colorsData)}
        isSaving={savingSection === 'Cores'}
        hasChanges={JSON.stringify(colorsData) !== JSON.stringify(config.colors)}
      >
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <InputField
            label="Cor Primária (Marrom Escuro)"
            value={colorsData.primary}
            onChange={(v) => setColorsData(prev => ({ ...prev, primary: v }))}
            type="color"
          />
          <InputField
            label="Cor Secundária (Marrom Médio)"
            value={colorsData.secondary}
            onChange={(v) => setColorsData(prev => ({ ...prev, secondary: v }))}
            type="color"
          />
          <InputField
            label="Cor de Destaque (Dourado)"
            value={colorsData.accent}
            onChange={(v) => setColorsData(prev => ({ ...prev, accent: v }))}
            type="color"
          />
          <InputField
            label="Cor de Fundo"
            value={colorsData.background}
            onChange={(v) => setColorsData(prev => ({ ...prev, background: v }))}
            type="color"
          />
          <InputField
            label="Cor do Texto"
            value={colorsData.text}
            onChange={(v) => setColorsData(prev => ({ ...prev, text: v }))}
            type="color"
          />
          <InputField
            label="Cor do Texto Claro"
            value={colorsData.textLight}
            onChange={(v) => setColorsData(prev => ({ ...prev, textLight: v }))}
            type="color"
          />
        </div>
      </CollapsibleSection>

      {/* Countdown Section */}
      <CollapsibleSection
        title="Contagem Regressiva"
        icon={Calendar}
        isOpen={openSections.includes('countdown')}
        onToggle={() => toggleSection('countdown')}
        onSave={() => handleSave('Contagem', updateCountdown, countdownData)}
        isSaving={savingSection === 'Contagem'}
        hasChanges={JSON.stringify(countdownData) !== JSON.stringify(config.countdown)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Título"
            value={countdownData.title}
            onChange={(v) => setCountdownData(prev => ({ ...prev, title: v }))}
          />
          <InputField
            label="Subtítulo"
            value={countdownData.subtitle}
            onChange={(v) => setCountdownData(prev => ({ ...prev, subtitle: v }))}
          />
          <InputField
            label="Data Alvo (YYYY-MM-DD)"
            value={countdownData.targetDate}
            onChange={(v) => setCountdownData(prev => ({ ...prev, targetDate: v }))}
          />
          <InputField
            label="Horário Alvo (HH:MM)"
            value={countdownData.targetTime}
            onChange={(v) => setCountdownData(prev => ({ ...prev, targetTime: v }))}
          />
        </div>
      </CollapsibleSection>

      {/* About Section */}
      <CollapsibleSection
        title="Sobre o Rafael"
        icon={Type}
        isOpen={openSections.includes('about')}
        onToggle={() => toggleSection('about')}
        onSave={() => handleSave('Sobre', updateAbout, aboutData)}
        isSaving={savingSection === 'Sobre'}
        hasChanges={JSON.stringify(aboutData) !== JSON.stringify(config.about)}
      >
        <div className="space-y-4">
          <InputField
            label="Título"
            value={aboutData.title}
            onChange={(v) => setAboutData(prev => ({ ...prev, title: v }))}
          />
          <InputField
            label="Parágrafo 1"
            value={aboutData.paragraph1}
            onChange={(v) => setAboutData(prev => ({ ...prev, paragraph1: v }))}
            type="textarea"
          />
          <InputField
            label="Parágrafo 2"
            value={aboutData.paragraph2}
            onChange={(v) => setAboutData(prev => ({ ...prev, paragraph2: v }))}
            type="textarea"
          />
          <InputField
            label="Título do Destaque"
            value={aboutData.highlightTitle}
            onChange={(v) => setAboutData(prev => ({ ...prev, highlightTitle: v }))}
          />
          <InputField
            label="Texto do Destaque"
            value={aboutData.highlightText}
            onChange={(v) => setAboutData(prev => ({ ...prev, highlightText: v }))}
          />
          <InputField
            label="Citação"
            value={aboutData.quote}
            onChange={(v) => setAboutData(prev => ({ ...prev, quote: v }))}
            type="textarea"
          />
          <div className="mb-4">
            <label className="block font-body text-sm text-[#5C4024] mb-2">Imagem</label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload('about', e)}
                className="hidden"
                id="about-image-upload"
              />
              <label
                htmlFor="about-image-upload"
                className="flex items-center gap-2 px-4 py-2 bg-[#F5F0E6] border border-[#D4AF37]/30 rounded-lg hover:bg-[#EDE8DC] transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Escolher Imagem</span>
              </label>
              {aboutData.image && (
                <img 
                  src={aboutData.image} 
                  alt="Preview" 
                  className="w-16 h-16 object-cover rounded-lg"
                />
              )}
            </div>
          </div>
        </div>
      </CollapsibleSection>

      {/* Event Details Section */}
      <CollapsibleSection
        title="Detalhes do Evento"
        icon={MapPin}
        isOpen={openSections.includes('eventDetails')}
        onToggle={() => toggleSection('eventDetails')}
        onSave={() => handleSave('Evento', updateEventDetails, eventDetailsData)}
        isSaving={savingSection === 'Evento'}
        hasChanges={JSON.stringify(eventDetailsData) !== JSON.stringify(config.eventDetails)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Título da Seção"
            value={eventDetailsData.title}
            onChange={(v) => setEventDetailsData(prev => ({ ...prev, title: v }))}
          />
          <InputField
            label="Data"
            value={eventDetailsData.date}
            onChange={(v) => setEventDetailsData(prev => ({ ...prev, date: v }))}
          />
          <InputField
            label="Horário"
            value={eventDetailsData.time}
            onChange={(v) => setEventDetailsData(prev => ({ ...prev, time: v }))}
          />
          <InputField
            label="Local"
            value={eventDetailsData.location}
            onChange={(v) => setEventDetailsData(prev => ({ ...prev, location: v }))}
          />
          <div className="md:col-span-2">
            <InputField
              label="Endereço Completo"
              value={eventDetailsData.address}
              onChange={(v) => setEventDetailsData(prev => ({ ...prev, address: v }))}
              type="textarea"
            />
          </div>
          <InputField
            label="Label Traje"
            value={eventDetailsData.dressCodeLabel}
            onChange={(v) => setEventDetailsData(prev => ({ ...prev, dressCodeLabel: v }))}
          />
          <InputField
            label="Descrição do Traje"
            value={eventDetailsData.dressCode}
            onChange={(v) => setEventDetailsData(prev => ({ ...prev, dressCode: v }))}
          />
          <InputField
            label="Texto Botão Copiar"
            value={eventDetailsData.copyButtonText}
            onChange={(v) => setEventDetailsData(prev => ({ ...prev, copyButtonText: v }))}
          />
          <InputField
            label="Texto Botão Maps"
            value={eventDetailsData.mapsButtonText}
            onChange={(v) => setEventDetailsData(prev => ({ ...prev, mapsButtonText: v }))}
          />
        </div>
      </CollapsibleSection>

      {/* RSVP Section */}
      <CollapsibleSection
        title="Confirmação de Presença (RSVP)"
        icon={Check}
        isOpen={openSections.includes('rsvp')}
        onToggle={() => toggleSection('rsvp')}
        onSave={() => handleSave('RSVP', updateRsvp, rsvpData)}
        isSaving={savingSection === 'RSVP'}
        hasChanges={JSON.stringify(rsvpData) !== JSON.stringify(config.rsvp)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Título"
            value={rsvpData.title}
            onChange={(v) => setRsvpData(prev => ({ ...prev, title: v }))}
          />
          <InputField
            label="Subtítulo"
            value={rsvpData.subtitle}
            onChange={(v) => setRsvpData(prev => ({ ...prev, subtitle: v }))}
          />
          <InputField
            label="Prazo de Confirmação"
            value={rsvpData.deadline}
            onChange={(v) => setRsvpData(prev => ({ ...prev, deadline: v }))}
          />
          <InputField
            label="Label Nome"
            value={rsvpData.nameLabel}
            onChange={(v) => setRsvpData(prev => ({ ...prev, nameLabel: v }))}
          />
          <InputField
            label="Label Telefone"
            value={rsvpData.phoneLabel}
            onChange={(v) => setRsvpData(prev => ({ ...prev, phoneLabel: v }))}
          />
          <InputField
            label="Label Comparecerá"
            value={rsvpData.attendingLabel}
            onChange={(v) => setRsvpData(prev => ({ ...prev, attendingLabel: v }))}
          />
          <InputField
            label="Opção Sim"
            value={rsvpData.yesOption}
            onChange={(v) => setRsvpData(prev => ({ ...prev, yesOption: v }))}
          />
          <InputField
            label="Opção Não"
            value={rsvpData.noOption}
            onChange={(v) => setRsvpData(prev => ({ ...prev, noOption: v }))}
          />
          <InputField
            label="Label Acompanhantes"
            value={rsvpData.companionsLabel}
            onChange={(v) => setRsvpData(prev => ({ ...prev, companionsLabel: v }))}
          />
          <InputField
            label="Texto Botão Adicionar Acompanhante"
            value={rsvpData.addCompanionButton}
            onChange={(v) => setRsvpData(prev => ({ ...prev, addCompanionButton: v }))}
          />
          <InputField
            label="Texto Botão Remover Acompanhante"
            value={rsvpData.removeCompanionButton}
            onChange={(v) => setRsvpData(prev => ({ ...prev, removeCompanionButton: v }))}
          />
          <InputField
            label="Placeholder Nome Acompanhante"
            value={rsvpData.companionPlaceholder}
            onChange={(v) => setRsvpData(prev => ({ ...prev, companionPlaceholder: v }))}
          />
          <InputField
            label="Label Mensagem"
            value={rsvpData.messageLabel}
            onChange={(v) => setRsvpData(prev => ({ ...prev, messageLabel: v }))}
          />
          <InputField
            label="Texto Botão Enviar"
            value={rsvpData.submitButton}
            onChange={(v) => setRsvpData(prev => ({ ...prev, submitButton: v }))}
          />
          <InputField
            label="Título Sucesso"
            value={rsvpData.successTitle}
            onChange={(v) => setRsvpData(prev => ({ ...prev, successTitle: v }))}
          />
          <div className="md:col-span-2">
            <InputField
              label="Mensagem de Sucesso"
              value={rsvpData.successMessage}
              onChange={(v) => setRsvpData(prev => ({ ...prev, successMessage: v }))}
              type="textarea"
            />
          </div>
        </div>
      </CollapsibleSection>

      {/* PIX Section */}
      <CollapsibleSection
        title="Presente no PIX"
        icon={Gift}
        isOpen={openSections.includes('pix')}
        onToggle={() => toggleSection('pix')}
        onSave={() => handleSave('PIX', updatePix, pixData)}
        isSaving={savingSection === 'PIX'}
        hasChanges={JSON.stringify(pixData) !== JSON.stringify(config.pix)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Título"
            value={pixData.title}
            onChange={(v) => setPixData(prev => ({ ...prev, title: v }))}
          />
          <div className="md:col-span-2">
            <InputField
              label="Descrição"
              value={pixData.description}
              onChange={(v) => setPixData(prev => ({ ...prev, description: v }))}
              type="textarea"
            />
          </div>
          <InputField
            label="Título do Sonho"
            value={pixData.dreamTitle}
            onChange={(v) => setPixData(prev => ({ ...prev, dreamTitle: v }))}
          />
          <InputField
            label="Texto do Sonho"
            value={pixData.dreamText}
            onChange={(v) => setPixData(prev => ({ ...prev, dreamText: v }))}
            type="textarea"
          />
          <InputField
            label="Chave PIX"
            value={pixData.pixKey}
            onChange={(v) => setPixData(prev => ({ ...prev, pixKey: v }))}
          />
          <InputField
            label="Nome no PIX"
            value={pixData.pixName}
            onChange={(v) => setPixData(prev => ({ ...prev, pixName: v }))}
          />
          <InputField
            label="Banco"
            value={pixData.pixBank}
            onChange={(v) => setPixData(prev => ({ ...prev, pixBank: v }))}
          />
          <InputField
            label="Texto Botão Copiar"
            value={pixData.copyButtonText}
            onChange={(v) => setPixData(prev => ({ ...prev, copyButtonText: v }))}
          />
          <InputField
            label="Texto Copiado"
            value={pixData.copiedText}
            onChange={(v) => setPixData(prev => ({ ...prev, copiedText: v }))}
          />
          <InputField
            label="Mensagem de Agradecimento"
            value={pixData.thankYouMessage}
            onChange={(v) => setPixData(prev => ({ ...prev, thankYouMessage: v }))}
            type="textarea"
          />
        </div>
      </CollapsibleSection>

      {/* Footer Section */}
      <CollapsibleSection
        title="Rodapé"
        icon={Type}
        isOpen={openSections.includes('footer')}
        onToggle={() => toggleSection('footer')}
        onSave={() => handleSave('Rodapé', updateFooter, footerData)}
        isSaving={savingSection === 'Rodapé'}
        hasChanges={JSON.stringify(footerData) !== JSON.stringify(config.footer)}
      >
        <div className="space-y-4">
          <InputField
            label="Texto do Rodapé"
            value={footerData.text}
            onChange={(v) => setFooterData(prev => ({ ...prev, text: v }))}
            type="textarea"
          />
          <InputField
            label="Ano"
            value={footerData.year}
            onChange={(v) => setFooterData(prev => ({ ...prev, year: v }))}
          />
        </div>
      </CollapsibleSection>

      <div className="mt-8 p-4 bg-[#4A5D23]/10 rounded-xl border border-[#4A5D23]/30">
        <p className="text-sm text-[#4A5D23]">
          💡 <strong>Dica:</strong> Edite os campos acima e clique em "Salvar Alterações" para cada seção. 
          As configurações são salvas no Supabase e ficam disponíveis para todos os usuários.
        </p>
      </div>
    </div>
  );
};

export default ConfigPanel;
