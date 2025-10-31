import { render } from './ui.js';
import { getState, hydrateAuth, setState, subscribe } from './state.js';
import { BREAKPOINTS, resolveBreakpoint } from './constants.js';

const DEFAULT_TAB = 'dados';
const VALID_VIEWS = new Set(['dados', 'test-drive', 'conexoes', 'ajuda', 'login']);

const debounce = (fn, delay = 160) => {
  let timer = 0;
  return (...args) => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => fn(...args), delay);
  };
};

const syncHashWithState = (state) => {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return;
  if (!VALID_VIEWS.has(hash)) return;
  if (state.currentView === hash) return;

  setState({ currentView: hash }, 'route:hash');
};

const syncStateWithHash = (state) => {
  if (state.currentView === 'login') {
    window.location.hash = '';
    return;
  }

  if (window.location.hash.replace('#', '') !== state.currentView) {
    window.location.hash = state.currentView;
  }
};

const handleHashChange = () => {
  const state = getState();
  syncHashWithState(state);
};

const applyLayoutResize = () => {
  const width = window.innerWidth;
  const breakpoint = resolveBreakpoint(width);
  const isMobile = width < BREAKPOINTS.md;
  const { layout } = getState();

  if (
    layout &&
    layout.breakpoint === breakpoint &&
    layout.isMobile === isMobile
  ) {
    return;
  }

  setState(
    {
      layout: {
        breakpoint,
        isMobile,
      },
    },
    'layout:resize',
  );
};

const applyLayoutScroll = () => {
  const scrollY = Math.round(window.scrollY || 0);
  document.documentElement.style.setProperty('--scroll-y', `${scrollY}`);
};

const bootstrap = () => {
  hydrateAuth();

  const state = getState();
  if (state.currentView !== 'login') {
    const hashTarget = window.location.hash.replace('#', '') || DEFAULT_TAB;
    if (VALID_VIEWS.has(hashTarget)) {
      setState({ currentView: hashTarget }, 'route:init');
    } else {
      setState({ currentView: DEFAULT_TAB }, 'route:init-default');
    }
  }

  render(getState());

  subscribe((nextState) => {
    render(nextState);
    syncStateWithHash(nextState);
  });

  window.addEventListener('hashchange', handleHashChange);
  window.addEventListener('resize', debounce(applyLayoutResize, 180));
  document.addEventListener('scroll', debounce(applyLayoutScroll, 120), { passive: true });

  setState({ hasHydrated: true }, 'app:hydrated');
  applyLayoutResize();
  applyLayoutScroll();

  console.log('[OMR:APP] Aplicação carregada.');
};

bootstrap();
