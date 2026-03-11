import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para as tabelas
export interface Guest {
  id?: string;
  name: string;
  phone: string;
  attending: boolean;
  message?: string;
  status: 'pending' | 'confirmed' | 'declined';
  created_at?: string;
  updated_at?: string;
}

export interface Companion {
  id?: string;
  guest_id: string;
  name: string;
  created_at?: string;
}

export interface SiteConfiguration {
  id?: string;
  config_key: string;
  config_value: any;
  updated_at?: string;
}
