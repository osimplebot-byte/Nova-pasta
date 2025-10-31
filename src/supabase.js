import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.46.1';

const getWindowEnv = () => {
  if (typeof window === 'undefined') return {};
  return window.__OMR_ENV__ || {};
};

const getImportMetaEnv = () => {
  // import.meta may not exist in some runtimes (like Node when bundling)
  try {
    if (typeof import.meta !== 'undefined' && import.meta?.env) {
      return import.meta.env;
    }
  } catch (error) {
    console.warn('[OMR:SUPABASE] import.meta.env indisponível', error);
  }
  return {};
};

const getProcessEnv = () => {
  if (typeof process !== 'undefined' && process?.env) {
    return process.env;
  }
  return {};
};

const pickEnvValue = (sources, keys) => {
  for (const source of sources) {
    if (!source) continue;
    for (const key of keys) {
      if (key in source && source[key]) {
        return source[key];
      }
    }
  }
  return null;
};

const windowEnv = getWindowEnv();
const importMetaEnv = getImportMetaEnv();
const processEnv = getProcessEnv();

const supabaseUrl =
  windowEnv.supabaseUrl ||
  windowEnv.supabaseProjectUrl ||
  pickEnvValue([windowEnv, importMetaEnv, processEnv], [
    'SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_URL',
    'VITE_SUPABASE_URL',
    'PUBLIC_SUPABASE_URL',
  ]);

const supabaseAnonKey =
  windowEnv.supabaseAnonKey ||
  windowEnv.supabasePublicAnonKey ||
  pickEnvValue([windowEnv, importMetaEnv, processEnv], [
    'SUPABASE_ANON_KEY',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'VITE_SUPABASE_ANON_KEY',
    'PUBLIC_SUPABASE_ANON_KEY',
  ]);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[OMR:SUPABASE] Configuração ausente. Defina supabaseUrl e supabaseAnonKey em window.__OMR_ENV__ ou variáveis públicas.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'omr-supabase-auth',
    autoRefreshToken: true,
  },
});

export const getSupabaseConfig = () => ({
  url: supabaseUrl,
  anonKey: supabaseAnonKey,
});
