import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, type Guest, type Companion } from '../lib/supabase';

export interface SiteConfig {
  // Hero Section
  hero: {
    date: string;
    title: string;
    subtitle: string;
    ctaButton: string;
    backgroundImage: string;
    overlayOpacity: number;
    blurAmount: number;
  };
  
  // Countdown Section
  countdown: {
    title: string;
    subtitle: string;
    targetDate: string;
    targetTime: string;
  };
  
  // About Section
  about: {
    title: string;
    paragraph1: string;
    paragraph2: string;
    highlightTitle: string;
    highlightText: string;
    quote: string;
    image: string;
  };
  
  // Event Details Section
  eventDetails: {
    title: string;
    date: string;
    time: string;
    location: string;
    address: string;
    dressCode: string;
    dressCodeLabel: string;
    copyButtonText: string;
    mapsButtonText: string;
  };
  
  // RSVP Section
  rsvp: {
    title: string;
    subtitle: string;
    deadline: string;
    nameLabel: string;
    phoneLabel: string;
    attendingLabel: string;
    yesOption: string;
    noOption: string;
    companionsLabel: string;
    addCompanionButton: string;
    removeCompanionButton: string;
    companionPlaceholder: string;
    messageLabel: string;
    submitButton: string;
    successTitle: string;
    successMessage: string;
  };
  
  // PIX Section
  pix: {
    title: string;
    description: string;
    dreamTitle: string;
    dreamText: string;
    pixKey: string;
    pixName: string;
    pixBank: string;
    copyButtonText: string;
    copiedText: string;
    thankYouMessage: string;
  };
  
  // Footer
  footer: {
    text: string;
    year: string;
  };
  
  // Theme Colors
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textLight: string;
  };
}

const defaultConfig: SiteConfig = {
  hero: {
    date: '04 de Abril de 2026',
    title: 'Rafael Medeiros',
    subtitle: 'Estou completando mais um ano de vida e quero comemorar com você!',
    ctaButton: 'Confirmar Presença',
    backgroundImage: '/images/rafael-cavalo.jpg',
    overlayOpacity: 60,
    blurAmount: 2,
  },
  countdown: {
    title: 'Faltam apenas...',
    subtitle: 'Para a grande celebração',
    targetDate: '2026-04-04',
    targetTime: '19:00',
  },
  about: {
    title: 'Sobre o Rafael',
    paragraph1: 'Amante da vida no campo, dos cavalos e do gado. Rafael é aquele tipo de pessoa que encontra felicidade nas coisas simples: um pôr do sol no sítio, o galope de um cavalo, a companhia de bons amigos.',
    paragraph2: 'Sempre com um sorriso no rosto e pronto para novas aventuras, ele valoriza cada momento compartilhado com quem ama.',
    highlightTitle: 'Agora ele tem um novo sonho:',
    highlightText: 'comprar seu próprio cavalo!',
    quote: '"A vida é melhor quando vivida com paixão e propósito."',
    image: '/images/rafael-escultura.jpg',
  },
  eventDetails: {
    title: 'Detalhes do Evento',
    date: '04 de Abril de 2026',
    time: '19:00 horas',
    location: 'Sítio Recanto das Netinhas',
    address: 'Estrada Chico Mendes, 900 - Quintas do Jacuba, Contagem - MG',
    dressCode: 'Estilo Country',
    dressCodeLabel: 'Traje',
    copyButtonText: 'Copiar',
    mapsButtonText: 'Ver no Maps',
  },
  rsvp: {
    title: 'Confirme sua Presença',
    subtitle: 'Sua presença é muito importante! Por favor, confirme até',
    deadline: '28 de março',
    nameLabel: 'Nome Completo',
    phoneLabel: 'Telefone',
    attendingLabel: 'Você vai comparecer?',
    yesOption: 'Sim, vou!',
    noOption: 'Não poderei',
    companionsLabel: 'Acompanhantes',
    addCompanionButton: 'Adicionar Acompanhante',
    removeCompanionButton: 'Remover',
    companionPlaceholder: 'Nome do acompanhante',
    messageLabel: 'Deixe uma mensagem (opcional)',
    submitButton: 'Enviar Confirmação',
    successTitle: 'Confirmação Enviada!',
    successMessage: 'Obrigado por confirmar sua presença! Estamos ansiosos para celebrar com você.',
  },
  pix: {
    title: 'Presente no PIX',
    description: 'Rafael está juntando dinheiro para realizar o sonho de comprar seu próprio cavalo. Sua contribuição será muito bem-vinda!',
    dreamTitle: 'O Sonho do Rafael',
    dreamText: 'Comprar seu próprio cavalo para continuar vivendo sua paixão pelo campo!',
    pixKey: '38 998288370',
    pixName: 'Rafael',
    pixBank: 'Santander',
    copyButtonText: 'Copiar Chave PIX',
    copiedText: 'Copiado!',
    thankYouMessage: 'Obrigado por fazer parte deste sonho! 🐴',
  },
  footer: {
    text: 'Feito com ❤️ para celebrar a vida do Rafael',
    year: '2026',
  },
  colors: {
    primary: '#3D2914',
    secondary: '#5C4024',
    accent: '#D4AF37',
    background: '#F5F0E6',
    text: '#3D2914',
    textLight: '#5C4024',
  },
};

interface ConfigContextType {
  config: SiteConfig;
  isLoading: boolean;
  updateConfig: (section: keyof SiteConfig, data: any) => Promise<void>;
  updateHero: (data: Partial<SiteConfig['hero']>) => Promise<void>;
  updateCountdown: (data: Partial<SiteConfig['countdown']>) => Promise<void>;
  updateAbout: (data: Partial<SiteConfig['about']>) => Promise<void>;
  updateEventDetails: (data: Partial<SiteConfig['eventDetails']>) => Promise<void>;
  updateRsvp: (data: Partial<SiteConfig['rsvp']>) => Promise<void>;
  updatePix: (data: Partial<SiteConfig['pix']>) => Promise<void>;
  updateFooter: (data: Partial<SiteConfig['footer']>) => Promise<void>;
  updateColors: (data: Partial<SiteConfig['colors']>) => Promise<void>;
  resetConfig: () => Promise<void>;
  exportConfig: () => string;
  importConfig: (json: string) => Promise<boolean>;
  // Guests
  guests: GuestWithCompanions[];
  fetchGuests: () => Promise<void>;
  addGuest: (guest: Omit<Guest, 'id' | 'created_at' | 'updated_at'>, companions: string[]) => Promise<void>;
  updateGuestStatus: (id: string, status: Guest['status']) => Promise<void>;
  deleteGuest: (id: string) => Promise<void>;
}

export interface GuestWithCompanions extends Guest {
  companions: Companion[];
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<SiteConfig>(defaultConfig);
  const [guests, setGuests] = useState<GuestWithCompanions[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar configurações do Supabase
  const fetchConfig = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('site_configurations')
        .select('config_key, config_value');

      if (error) {
        console.error('Error fetching config:', error);
        // Fallback para localStorage
        const saved = localStorage.getItem('site_config');
        if (saved) {
          setConfig({ ...defaultConfig, ...JSON.parse(saved) });
        }
        return;
      }

      if (data && data.length > 0) {
        const newConfig = { ...defaultConfig };
        data.forEach((item: any) => {
          if (item.config_key in newConfig) {
            (newConfig as any)[item.config_key] = item.config_value;
          }
        });
        setConfig(newConfig);
        localStorage.setItem('site_config', JSON.stringify(newConfig));
      }
    } catch (e) {
      console.error('Error loading config:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Carregar convidados do Supabase
  const fetchGuests = useCallback(async () => {
    try {
      const { data: guestsData, error: guestsError } = await supabase
        .from('guests')
        .select('*')
        .order('created_at', { ascending: false });

      if (guestsError) {
        console.error('Error fetching guests:', guestsError);
        return;
      }

      // Buscar acompanhantes
      const { data: companionsData, error: companionsError } = await supabase
        .from('companions')
        .select('*');

      if (companionsError) {
        console.error('Error fetching companions:', companionsError);
        return;
      }

      // Juntar convidados com acompanhantes
      const guestsWithCompanions = (guestsData || []).map((guest: Guest) => ({
        ...guest,
        companions: (companionsData || []).filter((c: Companion) => c.guest_id === guest.id),
      }));

      setGuests(guestsWithCompanions);
    } catch (e) {
      console.error('Error loading guests:', e);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
    fetchGuests();
  }, [fetchConfig, fetchGuests]);

  // Atualizar configuração no Supabase
  const updateConfigInDB = async (section: keyof SiteConfig, data: any) => {
    try {
      const { error } = await supabase
        .from('site_configurations')
        .upsert({
          config_key: section,
          config_value: data,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'config_key'
        });

      if (error) {
        console.error('Error updating config:', error);
        throw error;
      }
    } catch (e) {
      console.error('Error updating config:', e);
    }
  };

  const updateConfig = async (section: keyof SiteConfig, data: any) => {
    const newConfig = {
      ...config,
      [section]: { ...config[section], ...data },
    };
    setConfig(newConfig);
    localStorage.setItem('site_config', JSON.stringify(newConfig));
    await updateConfigInDB(section, newConfig[section]);
  };

  const updateHero = async (data: Partial<SiteConfig['hero']>) => await updateConfig('hero', data);
  const updateCountdown = async (data: Partial<SiteConfig['countdown']>) => await updateConfig('countdown', data);
  const updateAbout = async (data: Partial<SiteConfig['about']>) => await updateConfig('about', data);
  const updateEventDetails = async (data: Partial<SiteConfig['eventDetails']>) => await updateConfig('eventDetails', data);
  const updateRsvp = async (data: Partial<SiteConfig['rsvp']>) => await updateConfig('rsvp', data);
  const updatePix = async (data: Partial<SiteConfig['pix']>) => await updateConfig('pix', data);
  const updateFooter = async (data: Partial<SiteConfig['footer']>) => await updateConfig('footer', data);
  const updateColors = async (data: Partial<SiteConfig['colors']>) => await updateConfig('colors', data);

  const resetConfig = async () => {
    setConfig(defaultConfig);
    localStorage.removeItem('site_config');
    
    // Resetar no Supabase
    for (const key of Object.keys(defaultConfig)) {
      await updateConfigInDB(key as keyof SiteConfig, (defaultConfig as any)[key]);
    }
  };

  const exportConfig = () => JSON.stringify(config, null, 2);

  const importConfig = async (json: string) => {
    try {
      const parsed = JSON.parse(json);
      const newConfig = { ...defaultConfig, ...parsed };
      setConfig(newConfig);
      localStorage.setItem('site_config', JSON.stringify(newConfig));
      
      // Importar para o Supabase
      for (const key of Object.keys(newConfig)) {
        await updateConfigInDB(key as keyof SiteConfig, (newConfig as any)[key]);
      }
      
      return true;
    } catch (e) {
      console.error('Error importing config:', e);
      return false;
    }
  };

  // Adicionar convidado
  const addGuest = async (guest: Omit<Guest, 'id' | 'created_at' | 'updated_at'>, companionNames: string[]) => {
    try {
      // Inserir convidado
      const { data: guestData, error: guestError } = await supabase
        .from('guests')
        .insert([guest])
        .select()
        .single();

      if (guestError) throw guestError;

      // Inserir acompanhantes
      if (companionNames.length > 0 && guestData) {
        const companions = companionNames
          .filter(name => name.trim() !== '')
          .map(name => ({
            guest_id: guestData.id,
            name: name.trim(),
          }));

        if (companions.length > 0) {
          const { error: companionsError } = await supabase
            .from('companions')
            .insert(companions);

          if (companionsError) throw companionsError;
        }
      }

      // Recarregar lista
      await fetchGuests();
    } catch (e) {
      console.error('Error adding guest:', e);
      throw e;
    }
  };

  // Atualizar status do convidado
  const updateGuestStatus = async (id: string, status: Guest['status']) => {
    try {
      const { error } = await supabase
        .from('guests')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // Atualizar estado local
      setGuests(prev => prev.map(g => 
        g.id === id ? { ...g, status } : g
      ));
    } catch (e) {
      console.error('Error updating guest status:', e);
      throw e;
    }
  };

  // Deletar convidado e seus acompanhantes
  const deleteGuest = async (id: string) => {
    try {
      // Primeiro, deletar os acompanhantes ( CASCADE deve fazer isso, mas garantimos manualmente )
      const { error: companionsError } = await supabase
        .from('companions')
        .delete()
        .eq('guest_id', id);
      
      if (companionsError) {
        console.error('Error deleting companions:', companionsError);
      }

      // Depois, deletar o convidado
      const { error } = await supabase
        .from('guests')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting guest:', error);
        throw error;
      }

      // Atualizar estado local
      setGuests(prev => prev.filter(g => g.id !== id));
    } catch (e) {
      console.error('Error deleting guest:', e);
      throw e;
    }
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        isLoading,
        updateConfig,
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
        importConfig,
        guests,
        fetchGuests,
        addGuest,
        updateGuestStatus,
        deleteGuest,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
