import { supabase } from './supabase.js';
import { BREAKPOINTS, resolveBreakpoint } from './constants.js';

const listeners = new Set();

const defaultAuth = {
  user: null,
  sessionToken: null,
};

const initialWidth = typeof window !== 'undefined' ? window.innerWidth : BREAKPOINTS.md;

const state = {
  theme: localStorage.getItem('omr:theme') || 'light',
  currentView: 'login',
  auth: defaultAuth,
  usuario: null,
  empresa: null,
  instancias: [],
  pending: {
    login: false,
    dadosSave: false,
    signup: false,
    chatSend: false,
    instRefresh: false,
    instDisconnect: false,
    instSave: false,
    supportSend: false,
  },
  forms: {
    login: { email: '' },
    dados: null,
    instancias: null,
    support: '',
    chatPersona: 'josi',
  },
  chat: {
    messages: [],
    useDemo: false,
  },
  onboardingStep: 0,
  isTourVisible: true,
  hasHydrated: false,
  toast: null,
  isSignupOpen: false,
  isDrawerOpen: false,
  layout: {
    breakpoint: resolveBreakpoint(initialWidth),
    isMobile: initialWidth < BREAKPOINTS.md,
  },
};

export const getState = () => state;

export const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const setState = (partial, reason = 'state:update') => {
  const next = typeof partial === 'function' ? partial(state) : partial;

  Object.assign(state, next);
  console.log('[OMR:STATE]', reason, { ...next });

  if (Object.prototype.hasOwnProperty.call(next, 'theme')) {
    persistTheme(state.theme);
  }

  if (Object.prototype.hasOwnProperty.call(next, 'auth')) {
    persistAuth(state.auth);
  }

  if (Object.prototype.hasOwnProperty.call(next, 'layout')) {
    syncLayout(state.layout);
  }

  listeners.forEach((listener) => listener(state));
};

const persistTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('omr:theme', theme);
};

const syncLayout = (layout) => {
  if (!layout) return;
  document.documentElement.dataset.breakpoint = layout.breakpoint;
  document.documentElement.dataset.viewport = layout.isMobile ? 'mobile' : 'desktop';
};

const persistAuth = (auth) => {
  try {
    if (auth?.sessionToken) {
      localStorage.setItem(
        'omr:session',
        JSON.stringify({
          user: auth.user,
          sessionToken: auth.sessionToken,
        }),
      );
    } else {
      localStorage.removeItem('omr:session');
    }
  } catch (error) {
    console.warn('[OMR:STATE] Falha ao persistir sessão', error);
  }
};

export const hydrateAuth = async () => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error('[OMR:STATE] Falha ao consultar sessão Supabase', error);
      return null;
    }

    if (!session?.user) {
      setState({ auth: { ...defaultAuth }, currentView: 'login', usuario: null }, 'hydrate-auth:guest');
      return null;
    }

    const authState = {
      user: { id: session.user.id, email: session.user.email },
      sessionToken: session.access_token,
    };

    setState(
      {
        auth: authState,
        currentView: 'dados',
        usuario: null,
      },
      'hydrate-auth',
    );

    return authState;
  } catch (error) {
    console.error('[OMR:STATE] Erro inesperado ao hidratar sessão', error);
    return null;
  }
};

// aplica o tema persistido imediatamente
document.documentElement.setAttribute('data-theme', state.theme);
syncLayout(state.layout);

export const showToast = (message, tone = 'success') => {
  setState(
    {
      toast: {
        message,
        tone,
        ts: Date.now(),
      },
    },
    'toast:show',
  );

  window.setTimeout(() => {
    setState({ toast: null }, 'toast:clear');
  }, 3000);
};
