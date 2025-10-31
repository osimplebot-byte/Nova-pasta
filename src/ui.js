import { api } from './api.js';
import { getState, setState, showToast } from './state.js';

const icon = (name, classes = '') => {
  const cls = `icon ${classes}`.trim();
  switch (name) {
    case 'menu':
      return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>`;
    case 'sun':
      return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M12 3v2M12 19v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M3 12h2M19 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg>`;
    case 'moon':
      return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>`;
    case 'logout':
      return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M10 17l5-5-5-5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M15 12H3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>`;
    case 'dados':
      return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="12" cy="5" rx="7" ry="3" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5 5v9c0 1.66 3.13 3 7 3s7-1.34 7-3V5" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M5 14v5c0 1.66 3.13 3 7 3s7-1.34 7-3v-5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
    case 'test-drive':
      return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16v11H7l-3 3V4z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><circle cx="12" cy="9.5" r="1" fill="currentColor"/><circle cx="16" cy="9.5" r="1" fill="currentColor"/><circle cx="8" cy="9.5" r="1" fill="currentColor"/></svg>`;
    case 'conexoes':
      return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M14.47 14.47a5 5 0 0 0 0-7.07l-1.41-1.41a5 5 0 0 0-7.07 0L4.34 7.64a5 5 0 0 0 0 7.07l1.41 1.41" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><path d="M9.53 9.53a5 5 0 0 0 0 7.07l1.41 1.41a5 5 0 0 0 7.07 0l1.65-1.65a5 5 0 0 0 0-7.07l-1.41-1.41" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>`;
    case 'ajuda':
      return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 18h.01M9.09 9a3 3 0 1 1 4.24 4.24c-.48.49-.83.86-.83 1.76V16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
    case 'close':
      return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M6 18L18 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg>`;
    case 'trash':
      return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M10 11v6M14 11v6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
    case 'user':
      return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5z" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M4 21a8 8 0 0 1 16 0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/></svg>`;
    case 'check-circle':
      return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"/></svg>`;
    case 'alert-triangle':
      return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" fill="none" stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"/><path d="M12 9v4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><circle cx="12" cy="16" r="1" fill="currentColor"/></svg>`;
    case 'info-circle':
      return `<svg class="${cls}" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M11.5 11.5h1v4" fill="none" stroke="currentColor" stroke-linecap="round" stroke-width="1.5"/><circle cx="12" cy="8" r="0.75" fill="currentColor"/></svg>`;
    default:
      return '';
  }
};

const TOAST_TONES = {
  success: { icon: 'check-circle', ariaLive: 'polite' },
  error: { icon: 'alert-triangle', ariaLive: 'assertive' },
  info: { icon: 'info-circle', ariaLive: 'polite' },
};

const TAB_CONFIG = [
  { id: 'dados', label: 'Dados', icon: 'dados' },
  { id: 'test-drive', label: 'Test-Drive', icon: 'test-drive' },
  { id: 'conexoes', label: 'Conexoes', icon: 'conexoes' },
  { id: 'ajuda', label: 'Ajuda', icon: 'ajuda' },
];

const PERSONA_OPTIONS = [
  { id: 'josi', label: 'Josi', description: 'Acolhedora', accent: '#D81B60', accentRgb: '216, 27, 96', initial: 'J' },
  { id: 'clara', label: 'Clara', description: 'Objetiva', accent: '#5ad7ff', accentRgb: '90, 215, 255', initial: 'C' },
];

const root = document.getElementById('app');
const lazyModules = {
  onboarding: null,
};

const ensureOnboardingModule = () => {
  if (!lazyModules.onboarding) {
    lazyModules.onboarding = import('./onboarding.js');
  }
  return lazyModules.onboarding;
};

const hydrateLazyComponents = (state) => {
  const slot = document.getElementById('onboarding-slot');
  if (!slot) return;

  if (state.isTourVisible) {
    ensureOnboardingModule()
      .then(({ renderOnboarding, bindOnboardingDismiss }) => {
        if (!document.body.contains(slot)) return;
        if (!getState().isTourVisible) {
          slot.innerHTML = '';
          return;
        }
        slot.innerHTML = renderOnboarding();
        bindOnboardingDismiss();
      })
      .catch((error) => console.error('[OMR:UI] Falha ao carregar onboarding', error));
  } else {
    slot.innerHTML = '';
  }
};

export const render = (state) => {
  if (!root) return;

  if (state.currentView === 'login') {
    root.innerHTML = renderLogin(state);
    bindLoginView();
    return;
  }

  root.innerHTML = renderShell(state);
  bindShellView();
  hydrateLazyComponents(state);
};

const renderLogin = (state) => {
  const themeIcon = state.theme === 'light' ? '☾' : '☀';

  return `
  <main class="app-shell items-center justify-center bg-bg px-4 py-20 text-text">
    <section class="neon-card w-full max-w-xl fade-in-up">
      <div class="relative z-10 space-y-8 rounded-3xl bg-transparent px-10 py-12">
        <button id="theme-toggle" class="icon-toggle absolute right-6 top-6" type="button" aria-label="Alternar tema">
          <span aria-hidden="true">${themeIcon}</span>
          <span class="sr-only">Alternar tema</span>
        </button>
        <header class="space-y-2 text-center">
          <p class="pill-label text-primary">OMR Studio Piloto</p>
          <h1 class="text-3xl font-semibold tracking-wide text-text">Entrar</h1>
          <p class="text-sm text-text-muted">Use seu e-mail institucional para configurar a instancia piloto.</p>
        </header>

        <form id="login-form" class="space-y-6">
          <label class="block space-y-2 text-sm text-text">
            <span class="font-medium">Email</span>
            <input class="input-field w-full" type="email" id="login-email" required placeholder="voce@escola.com" autocomplete="email" />
          </label>
          <label class="block space-y-2 text-sm text-text">
            <span class="font-medium">Senha</span>
            <input class="input-field w-full" type="password" id="login-password" required placeholder="********" autocomplete="current-password" />
          </label>
          <button id="login-submit" class="btn-primary w-full px-4 py-3 text-sm font-semibold uppercase tracking-[0.24em]" type="submit">
            Entrar
          </button>
          <p class="space-y-1 text-center text-xs text-text-muted">
            <span class="block">
              Precisa liberar acesso?
              <button id="open-signup" type="button" class="text-primary underline">
                Solicite seu piloto
              </button>
            </span>
            <span class="block">
              Apenas testando?
              <button id="enter-demo" type="button" class="text-text underline">
                Entrar no modo demo
              </button>
            </span>
          </p>
        </form>

        <footer class="flex items-center justify-end text-xs text-text-muted">
          <a class="icon-button" href="https://wa.me/5511999999999?text=Preciso%20de%20suporte%20no%20OMR%20Studio" target="_blank" rel="noopener">
            <span class="wa-icon" aria-hidden="true"></span>
            <span class="sr-only">Suporte via WhatsApp</span>
          </a>
        </footer>
      </div>
    </section>
    ${state.isSignupOpen ? renderSignupModal() : ''}
    ${renderToastContainer(state)}
  </main>
`;
};

const renderShell = (state) => `
  <div class="app-shell bg-bg text-text">
    ${renderDrawer(state)}
    ${renderAppHeader(state)}
    <main class="flex-1 overflow-y-auto px-4 pb-28 pt-8 sm:px-8">
      <div class="page-container">
        ${renderView(state)}
      </div>
    </main>
    ${renderTabs(state)}
    <div id="onboarding-slot" data-lazy="onboarding"></div>
    ${renderToastContainer(state)}
  </div>
`;



const renderDrawer = (state) => `
  <div class="drawer ${state.isDrawerOpen ? 'open' : ''}" data-drawer-root>
    <div class="drawer-backdrop" data-drawer-close></div>
    <aside class="drawer-panel" role="dialog" aria-modal="true" aria-label="Menu principal">
      <header class="drawer-header">
        <span class="drawer-logo">OMR Studio</span>
        <button class="icon-toggle" type="button" data-drawer-close aria-label="Fechar menu">
          ${icon('close')}
        </button>
      </header>
      <nav class="drawer-nav" role="navigation">
        ${TAB_CONFIG.map(
          (tab) => `
            <button
              class="drawer-link ${state.currentView === tab.id ? 'active' : ''}"
              data-drawer-link="${tab.id}"
              type="button"
            >
              ${icon(tab.icon, 'drawer-link-icon')}
              <span>${tab.label}</span>
            </button>
          `,
        ).join('')}
      </nav>
    </aside>
  </div>
`;

const renderTabs = (state) => `
  <nav class="tab-bar fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-2 px-4 py-4 sm:relative sm:mx-auto sm:max-w-4xl sm:rounded-2xl sm:border sm:border-border sm:px-6">
    ${TAB_CONFIG.map(
      (tab) => `
        <button
          class="tab-item flex flex-1 flex-col items-center gap-1 text-sm ${state.currentView === tab.id ? 'active text-primary' : 'text-text-muted'}"
          data-tab="${tab.id}"
          ${state.currentView === tab.id ? 'aria-current="page"' : ''}
        >
          ${icon(tab.icon, 'tab-icon')}
          <span class="tab-label">${tab.label}</span>
        </button>
      `,
    ).join('')}
  </nav>
`;

const renderView = (state) => {
  switch (state.currentView) {
    case 'dados':
      return renderDados(state);
    case 'test-drive':
      return renderTestDrive();
    case 'conexoes':
      return renderConexoes(state);
    case 'ajuda':
      return renderAjuda();
    default:
      return `<section class="neon-card p-8 text-text">View em construcao.</section>`;
  }
};

const renderAppHeader = (state) => {
  const themeIconName = state.theme === 'light' ? 'sun' : 'moon';

  return `
  <header class="app-topbar glass-panel sticky top-6 z-30 mx-4 flex items-center gap-4 rounded-2xl px-4 py-3 sm:mx-8">
    <button id="drawer-toggle" class="icon-toggle" type="button" aria-label="Abrir menu de secoes">
      ${icon('menu')}
    </button>
    <div class="topbar-title-group">
      <p class="topbar-title">Painel do Piloto</p>
      <span class="topbar-subtitle text-primary">OMR Studio</span>
    </div>
    <div class="topbar-actions">
      <button id="theme-toggle" class="icon-toggle" type="button" aria-label="Alternar tema">
        ${icon(themeIconName)}
        <span class="sr-only">Alternar tema</span>
      </button>
      <button id="logout" class="icon-toggle" type="button" aria-label="Encerrar sessao">
        ${icon('logout')}
        <span class="sr-only">Sair</span>
      </button>
    </div>
  </header>
`;
};

const renderDados = (state) => {
  const empresa = state.empresa || {};
  const persona = empresa.persona || 'josi';

  return `
    <section class="space-y-6">
      <header class="space-y-1">
        <h3 class="text-lg font-semibold text-text">Dados do negocio</h3>
        <p class="text-sm text-text-muted">Preencha as informacoes base para alimentar o agente.</p>
      </header>

      <form id="dados-form" class="neon-card space-y-6 px-6 py-7">
        <div class="grid gap-4">
          ${renderTextField('empresa_nome', 'Nome da empresa', empresa.nome, true)}
          ${renderTextField('empresa_tipo', 'Tipo de negocio', empresa.tipo)}
          ${renderTextField('horario_funcionamento', 'Horario de funcionamento', empresa.horario_funcionamento)}
          ${renderTextField('contatos_extras', 'Contatos extras', empresa.contatos_extras)}
          ${renderTextField('endereco', 'Endereco', empresa.endereco)}
          ${renderTextArea('observacoes', 'Observacoes', empresa.observacoes)}
        </div>

        <div class="space-y-2">
          <span class="text-sm font-medium text-text">Personalidade</span>
          <div class="persona-grid" role="radiogroup">
            ${PERSONA_OPTIONS.map(
              (option) => `
                <label class="persona-card ${persona === option.id ? 'active' : ''}" data-persona="${option.id}" style="--persona-accent: ${option.accent}; --persona-accent-rgb: ${option.accentRgb}">
                  <input type="radio" class="sr-only persona-input" name="persona" value="${option.id}" ${persona === option.id ? 'checked' : ''} />
                  <div class="persona-card-body">
                    <span class="persona-avatar">${option.initial}</span>
                    <div class="persona-info">
                      <span class="persona-name">${option.label}</span>
                      <span class="persona-desc">${option.description}</span>
                    </div>
                  </div>
                </label>
              `,
            ).join('')}
          </div>
        </div>

        <section class="space-y-4">
          <header>
            <h4 class="text-sm font-semibold text-text">Produtos</h4>
            <p class="text-xs text-text-muted">Liste produtos ou servicos oferecidos.</p>
          </header>
          <div id="produtos-list" class="space-y-3">
            ${(empresa.produtos || []).map((produto, index) => renderProdutoCard(index, produto)).join('')}
          </div>
          <button id="add-produto" type="button" class="toggle-chip text-sm">+ Adicionar produto</button>
        </section>

        <section class="space-y-4">
          <header>
            <h4 class="text-sm font-semibold text-text">FAQs</h4>
            <p class="text-xs text-text-muted">Questoes frequentes para o bot.</p>
          </header>
          <div id="faqs-list" class="space-y-3">
            ${(empresa.faqs || []).map((faq, index) => renderFaqCard(index, faq)).join('')}
          </div>
          <button id="add-faq" type="button" class="toggle-chip text-sm">+ Adicionar FAQ</button>
        </section>

        <div class="space-y-2">
          <label class="text-sm font-medium text-text">Planilha oficial (.xlsx)</label>
          <input id="planilha-upload" type="file" accept=".xlsx,.csv" class="input-field w-full border-dashed" />
          <p class="text-xs text-text-muted">
            Baixe o template <a class="text-primary underline" href="#" id="download-template">aqui</a>.
          </p>
        </div>

        <div class="flex items-center justify-between text-xs text-text-muted">
          <span>Ultima sincronizacao: ${empresa.updated_at ? new Date(empresa.updated_at).toLocaleString('pt-BR') : 'nunca'}</span>
          <button type="submit" class="btn-primary px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em]">
            Salvar
          </button>
        </div>
      </form>
    </section>
  `;
};

const renderTestDrive = () => `
  <section class="space-y-4">
    <header class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 class="text-lg font-semibold text-text">Simulador</h3>
        <p class="text-sm text-text-muted">Converse com o agente usando dados reais ou demo.</p>
      </div>
      <div class="flex items-center gap-2">
        <select id="persona-toggle" class="input-field text-sm">
          <option value="josi">Josi</option>
          <option value="clara">Clara</option>
        </select>
        <button id="toggle-demo" class="toggle-chip text-xs">Dados demo</button>
      </div>
    </header>

    <section class="neon-card flex flex-col gap-4 px-6 py-6">
      <div id="chat-log" class="glass-panel flex max-h-[360px] flex-col gap-3 overflow-y-auto px-4 py-4 text-sm text-text">
        <p class="text-text-muted">Nenhuma mensagem ainda. Envie algo para comecar.</p>
      </div>
      <div class="flex flex-col gap-3">
        <div class="flex flex-wrap gap-2 text-xs">
          ${['Quais produtos voces oferecem?', 'Qual o horario de atendimento?', 'Existe suporte humano?']
                .map((suggestion) => `
                  <button class="toggle-chip text-xs" data-suggestion="${suggestion}">
                    ${suggestion}
                  </button>
                `)
                .join('')}
            </div>
            <form id="chat-form" class="flex gap-2">
              <input id="chat-input" class="input-field flex-1 text-sm" placeholder="Digite uma mensagem..." />
              <button type="submit" class="btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em]">Enviar</button>
            </form>
          </div>
        </section>
      </section>
    `;

const renderConexoes = (state) => {
  const instancia = state.instancias?.[0] || {};

  return `
    <section class="space-y-6">
      <header class="space-y-1">
        <h3 class="text-lg font-semibold text-text">Conexoes Evolution API</h3>
        <p class="text-sm text-text-muted">Status da integracao com WhatsApp.</p>
      </header>

      <section class="neon-card space-y-4 px-6 py-6">
        <div class="flex flex-col gap-4 md:flex-row">
          <div class="flex-1 space-y-2">
            <p class="text-sm text-text-muted">Status atual</p>
            <p class="text-2xl font-semibold text-text">${instancia.status || 'Desconectado'}</p>
            <div class="text-xs text-text-muted">Ultimo evento: ${instancia.last_event || 'Sem registros'}</div>
          </div>
          <div class="glass-panel flex flex-1 items-center justify-center rounded-2xl px-4 py-4 text-center text-sm text-text-muted">
            ${instancia.qr_svg ? `<img src="data:image/svg+xml;utf8,${encodeURIComponent(instancia.qr_svg)}" alt="QR Code" class="max-w-[240px]" />` : 'Nenhum QR disponivel. Clique em atualizar conexao.'}
          </div>
        </div>

        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          ${renderToggle('rejeitar_chamadas', 'Rejeitar chamadas', instancia.rejeitar_chamadas)}
          ${renderToggle('ignorar_grupos', 'Ignorar grupos', instancia.ignorar_grupos)}
          ${renderToggle('sempre_online', 'Sempre online', instancia.sempre_online)}
          ${renderToggle('ler_mensagens', 'Marcar como lidas', instancia.ler_mensagens)}
          ${renderToggle('sincronizar_historico', 'Sincronizar historico', instancia.sincronizar_historico)}
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-text">Mensagem para chamadas rejeitadas</label>
          <textarea id="mensagem-rejeicao" class="input-field h-24 w-full text-sm" placeholder="Mensagem de retorno">${instancia.mensagem_rejeicao || ''}</textarea>
        </div>

        <div class="flex flex-wrap gap-2">
          <button id="inst-refresh" class="btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em]">Atualizar conexao</button>
          <button id="inst-disconnect" class="toggle-chip text-sm" type="button">Desconectar</button>
          <button id="inst-save" class="toggle-chip text-sm" type="button">Salvar configuracoes</button>
        </div>
      </section>

      <section class="neon-card px-6 py-6">
        <header class="mb-3 text-sm font-semibold text-text">Eventos recentes</header>
        <ul class="space-y-2 text-sm text-text-muted" id="inst-log">
          ${(instancia.logs || [{ ts: Date.now(), message: 'Sem logs disponiveis.' }])
            .map((log) => `<li>• ${formatLog(log)}</li>`)
            .join('')}
        </ul>
      </section>
    </section>
  `;
};

const renderAjuda = () => `
  <section class="space-y-6">
    <header class="space-y-1">
      <h3 class="text-lg font-semibold text-text">Suporte OMR</h3>
      <p class="text-sm text-text-muted">Consulte a base rapida ou acione a equipe humana.</p>
    </header>

    <section class="neon-card space-y-4 px-6 py-6">
      <div class="space-y-3">
        <h4 class="text-sm font-semibold text-text">Links uteis</h4>
        <ul class="space-y-2 text-sm text-text-muted">
          <li><a class="text-primary underline" href="https://docs.omrstudio.dev/base" target="_blank" rel="noopener">Documento base</a></li>
          <li><a class="text-primary underline" href="mailto:suporte@omrstudio.dev" target="_blank" rel="noopener">Contato por e-mail</a></li>
        </ul>
      </div>

      <form id="support-form" class="space-y-3">
        <label class="text-sm font-medium text-text" for="support-message">Enviar mensagem</label>
        <textarea id="support-message" class="input-field h-32 w-full text-sm" placeholder="Explique o ocorrido..."></textarea>
        <button type="submit" class="btn-primary px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em]">
          Enviar
        </button>
      </form>
    </section>
  </section>
`;

const renderToastContainer = (state) => {
  const toast = state.toast;
  const toneKey = toast?.tone && TOAST_TONES[toast.tone] ? toast.tone : 'info';
  const tone = TOAST_TONES[toneKey];
  const toneClass = `toast--${toneKey}`;

  return `
  <div class="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-center space-y-2 sm:items-end sm:space-y-3" data-toast-container aria-atomic="true">
    ${
      toast
        ? `<div class="toast ${toneClass} pointer-events-auto fade-in-up" role="status" aria-live="${tone.ariaLive}">
            <span class="toast__icon">${icon(tone.icon)}</span>
            <span class="toast__content">${toast.message}</span>
          </div>`
        : ''
    }
  </div>
`;
};

const renderTextField = (name, label, value = '', required = false) => `
  <label class="block space-y-1 text-sm text-text">
    <span class="font-medium">${label}${required ? ' *' : ''}</span>
    <input name="${name}" value="${value || ''}" class="input-field w-full text-sm" ${required ? 'required' : ''} />
  </label>
`;

const renderTextArea = (name, label, value = '', required = false) => `
  <label class="block space-y-1 text-sm text-text">
    <span class="font-medium">${label}${required ? ' *' : ''}</span>
    <textarea name="${name}" rows="3" class="input-field w-full text-sm" ${required ? 'required' : ''}>${value || ''}</textarea>
  </label>
`;

const renderProdutoCard = (index, produto = {}) => `
  <div class="editable-card glass-panel space-y-3 px-4 py-4" data-produto="${index}">
    <div class="editable-card-header">
      <span class="editable-card-title" data-card-label>Produto ${index + 1}</span>
      <button type="button" class="icon-toggle danger" data-remove-produto aria-label="Remover produto">
        ${icon('trash')}
      </button>
    </div>
    <label class="block space-y-1 text-sm text-text">
      <span class="font-medium">Nome *</span>
      <input class="input-field w-full text-sm" name="produtos[${index}].nome" data-field="nome" value="${produto?.nome || ''}" required />
    </label>
    <label class="block space-y-1 text-sm text-text">
      <span class="font-medium">Descricao</span>
      <input class="input-field w-full text-sm" name="produtos[${index}].descricao" data-field="descricao" value="${produto?.descricao || ''}" />
    </label>
    <label class="block space-y-1 text-sm text-text">
      <span class="font-medium">Preco</span>
      <input class="input-field w-full text-sm" name="produtos[${index}].preco" data-field="preco" value="${produto?.preco || ''}" />
    </label>
  </div>
`;

const renderFaqCard = (index, faq = {}) => `
  <div class="editable-card glass-panel space-y-3 px-4 py-4" data-faq="${index}">
    <div class="editable-card-header">
      <span class="editable-card-title" data-card-label>FAQ ${index + 1}</span>
      <button type="button" class="icon-toggle danger" data-remove-faq aria-label="Remover FAQ">
        ${icon('trash')}
      </button>
    </div>
    <label class="block space-y-1 text-sm text-text">
      <span class="font-medium">Pergunta *</span>
      <input class="input-field w-full text-sm" name="faqs[${index}].pergunta" data-field="pergunta" value="${faq?.pergunta || ''}" required />
    </label>
    <label class="block space-y-1 text-sm text-text">
      <span class="font-medium">Resposta *</span>
      <textarea class="input-field w-full text-sm" rows="3" name="faqs[${index}].resposta" data-field="resposta" required>${faq?.resposta || ''}</textarea>
    </label>
  </div>
`;

const renderToggle = (name, label, checked) => `
  <label class="glass-panel flex items-center justify-between gap-3 rounded-2xl px-4 py-3 text-sm">
    <span>${label}</span>
    <input type="checkbox" name="${name}" ${checked ? 'checked' : ''} class="h-5 w-5 rounded border-border text-primary focus:ring-primary" />
  </label>
`;

const formatLog = (log) => {
  if (typeof log === 'string') return log;
  const timestamp = log.ts ? new Date(log.ts).toLocaleTimeString('pt-BR') : '';
  return `${timestamp ? `[${timestamp}] ` : ''}${log.message || 'Evento registrado.'}`;
};

const bindLoginView = () => {
  bindThemeSwitchers();

  const form = document.getElementById('login-form');
  const submit = document.getElementById('login-submit');

  form?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = /** @type {HTMLInputElement} */ (document.getElementById('login-email'))?.value.trim();
    const password = /** @type {HTMLInputElement} */ (document.getElementById('login-password'))?.value.trim();

    if (!email || !password) {
      showToast('Informe email e senha.', 'error');
      return;
    }

    const previousLabel = submit?.textContent || 'Entrar';
    if (submit) {
      submit.disabled = true;
      submit.textContent = 'Conectando...';
    }

    try {
      const { data } = await api.post('auth.login', { email, password }, { auth: false });
      await handleLoginSuccess(data, { fallbackEmail: email });
    } catch (error) {
      console.error('[OMR:UI] auth.login falhou', error);
      showToast(error?.message || 'Falha ao autenticar. Confira as credenciais.', 'error');
    } finally {
      if (submit && document.body.contains(submit)) {
        submit.disabled = false;
        submit.textContent = previousLabel;
      }
    }
  });

  const openSignup = document.getElementById('open-signup');
  openSignup?.addEventListener('click', () => setState({ isSignupOpen: true }, 'signup:open'));

  const enterDemo = document.getElementById('enter-demo');
  enterDemo?.addEventListener('click', () =>
    handleLoginSuccess(
      {
        user_id: 'demo-user',
        email: 'demo@omr.studio',
        session_token: `demo-${Date.now()}`,
      },
      { skipContext: true, fallbackEmail: 'demo@omr.studio' },
    ),
  );

  bindSignupModal();
};

const bindShellView = () => {
  bindThemeSwitchers();
  bindDrawer();
  bindLogout();
  bindTabs();
  bindDadosForm();
  bindChat();
  bindInstancias();
  bindSupportForm();
};

const bindThemeSwitchers = () => {
  document.querySelectorAll('#theme-toggle').forEach((button) => {
    button.addEventListener('click', () => {
      const { theme } = getState();
      setState({ theme: theme === 'light' ? 'dark' : 'light' }, 'theme:toggle');
    });
  });
};

const bindLogout = () => {
  const btn = document.getElementById('logout');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    try {
      await api.post('auth.logout');
    } catch (error) {
      console.info('[OMR:UI] auth.logout skipped', error);
    } finally {
      setState({ auth: { user: null, sessionToken: null }, currentView: 'login' }, 'logout:manual');
      showToast('Sessao encerrada.');
    }
  });
};

const bindDrawer = () => {
  const toggle = document.getElementById('drawer-toggle');
  const drawerRoot = document.querySelector('[data-drawer-root]');
  if (!drawerRoot) return;

  const closeDrawer = () => setState({ isDrawerOpen: false }, 'drawer:close');

  toggle?.addEventListener('click', () => {
    setState({ isDrawerOpen: true }, 'drawer:open');
  });

  drawerRoot.querySelectorAll('[data-drawer-close]').forEach((node) => {
    node.addEventListener('click', closeDrawer);
  });

  drawerRoot.querySelectorAll('[data-drawer-link]').forEach((node) => {
    node.addEventListener('click', () => {
      const target = node.getAttribute('data-drawer-link');
      if (!target) return;
      setState({ currentView: target, isDrawerOpen: false }, 'drawer:navigate');
      window.location.hash = target;
    });
  });
};

const bindTabs = () => {
  document.querySelectorAll('[data-tab]').forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      if (!target) return;
      setState({ currentView: target, isDrawerOpen: false }, 'nav:tab');
      window.location.hash = target;
    });
  });
};

const bindDadosForm = () => {
  const form = document.getElementById('dados-form');
  if (!form) return;

  const produtosList = document.getElementById('produtos-list');
  const faqsList = document.getElementById('faqs-list');

  const reindexCollection = (container, attr, collectionName, labelPrefix) => {
    if (!container) return;
    container.querySelectorAll(`[${attr}]`).forEach((node, index) => {
      node.setAttribute(attr, index);
      node.querySelectorAll('[data-field]').forEach((input) => {
        const field = input.getAttribute('data-field');
        if (!field) return;
        input.name = `${collectionName}[${index}].${field}`;
      });
      const label = node.querySelector('[data-card-label]');
      if (label) {
        label.textContent = `${labelPrefix} ${index + 1}`;
      }
    });
  };

  const appendProdutoCard = () => {
    if (!produtosList) return;
    const index = produtosList.querySelectorAll('[data-produto]').length;
    produtosList.insertAdjacentHTML('beforeend', renderProdutoCard(index));
    reindexCollection(produtosList, 'data-produto', 'produtos', 'Produto');
    produtosList.querySelector('[data-produto]:last-child input[data-field="nome"]')?.focus();
  };

  const appendFaqCard = () => {
    if (!faqsList) return;
    const index = faqsList.querySelectorAll('[data-faq]').length;
    faqsList.insertAdjacentHTML('beforeend', renderFaqCard(index));
    reindexCollection(faqsList, 'data-faq', 'faqs', 'FAQ');
    faqsList.querySelector('[data-faq]:last-child input[data-field="pergunta"]')?.focus();
  };

  document.getElementById('add-produto')?.addEventListener('click', appendProdutoCard);
  document.getElementById('add-faq')?.addEventListener('click', appendFaqCard);

  produtosList?.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-remove-produto]');
    if (!trigger) return;
    const card = trigger.closest('[data-produto]');
    card?.remove();
    reindexCollection(produtosList, 'data-produto', 'produtos', 'Produto');
  });

  faqsList?.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-remove-faq]');
    if (!trigger) return;
    const card = trigger.closest('[data-faq]');
    card?.remove();
    reindexCollection(faqsList, 'data-faq', 'faqs', 'FAQ');
  });

  const personaInputs = form.querySelectorAll('.persona-input');
  const syncPersonaCards = () => {
    form.querySelectorAll('.persona-card').forEach((card) => {
      const input = card.querySelector('.persona-input');
      card.classList.toggle('active', Boolean(input?.checked));
    });
  };
  personaInputs.forEach((input) => input.addEventListener('change', syncPersonaCards));
  syncPersonaCards();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);

    const payload = {
      empresa: {
        nome: data.get('empresa_nome') || '',
        tipo: data.get('empresa_tipo') || '',
        horario_funcionamento: data.get('horario_funcionamento') || '',
        contatos_extras: data.get('contatos_extras') || '',
        endereco: data.get('endereco') || '',
        observacoes: data.get('observacoes') || '',
        persona: data.get('persona') || 'josi',
      },
      produtos: [],
      faqs: [],
    };

    produtosList?.querySelectorAll('[data-produto]').forEach((node, index) => {
      const nome = data.get(`produtos[${index}].nome`);
      if (!nome) return;
      payload.produtos.push({
        nome,
        descricao: data.get(`produtos[${index}].descricao`) || '',
        preco: data.get(`produtos[${index}].preco`) || '',
      });
    });

    faqsList?.querySelectorAll('[data-faq]').forEach((node, index) => {
      const pergunta = data.get(`faqs[${index}].pergunta`);
      const resposta = data.get(`faqs[${index}].resposta`);
      if (!pergunta || !resposta) return;
      payload.faqs.push({ pergunta, resposta });
    });

    try {
      await api.post('dados.save', payload);
      showToast('Dados salvos com sucesso.');
      setState({ empresa: { ...payload.empresa, produtos: payload.produtos, faqs: payload.faqs } }, 'dados:update');
    } catch (error) {
      showToast(error?.message || 'Erro ao salvar dados.', 'error');
    }
  });
};

const bindChat = () => {
  const form = document.getElementById('chat-form');
  if (!form) return;

  const input = document.getElementById('chat-input');
  const log = document.getElementById('chat-log');
  const personaSelect = document.getElementById('persona-toggle');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = input?.value.trim();
    if (!message) return;

    appendChatMessage(log, 'Voce', message);
    input.value = '';

    try {
      const { data } = await api.post('sim.chat', {
        persona: personaSelect?.value || 'josi',
        message,
      });

      appendChatMessage(log, 'Agente', data?.reply || 'Sem resposta.');
    } catch (error) {
      appendChatMessage(log, 'Agente', error?.message || 'Falha ao processar.');
    }
  });

  document.querySelectorAll('[data-suggestion]').forEach((button) => {
    button.addEventListener('click', () => {
      if (!input) return;
      input.value = button.getAttribute('data-suggestion') || '';
      input.focus();
    });
  });
};

const appendChatMessage = (log, author, message) => {
  if (!log) return;
  const bubble = document.createElement('div');
  bubble.className = `glass-panel flex flex-col gap-1 px-4 py-3 text-sm ${author === 'Voce' ? 'self-end text-right' : 'self-start text-left'}`;
  bubble.innerHTML = `<span class="text-xs font-semibold text-primary">${author}</span><p class="whitespace-pre-line text-text">${message}</p>`;
  log.appendChild(bubble);
  log.scrollTop = log.scrollHeight;
};

const bindInstancias = () => {
  const refresh = document.getElementById('inst-refresh');
  const disconnect = document.getElementById('inst-disconnect');
  const save = document.getElementById('inst-save');

  refresh?.addEventListener('click', async () => {
    try {
      const { data } = await api.post('inst.refresh');
      showToast('Conexao atualizada.');
      setState({ instancias: [data] }, 'inst:refresh');
    } catch (error) {
      showToast(error?.message || 'Erro ao atualizar conexao.', 'error');
    }
  });

  disconnect?.addEventListener('click', async () => {
    try {
      await api.post('inst.disconnect');
      showToast('Instancia desconectada.');
      setState({ instancias: [] }, 'inst:disconnect');
    } catch (error) {
      showToast(error?.message || 'Erro ao desconectar.', 'error');
    }
  });

  save?.addEventListener('click', async () => {
    const payload = {
      rejeitar_chamadas: Boolean(document.querySelector('input[name="rejeitar_chamadas"]')?.checked),
      ignorar_grupos: Boolean(document.querySelector('input[name="ignorar_grupos"]')?.checked),
      sempre_online: Boolean(document.querySelector('input[name="sempre_online"]')?.checked),
      ler_mensagens: Boolean(document.querySelector('input[name="ler_mensagens"]')?.checked),
      sincronizar_historico: Boolean(document.querySelector('input[name="sincronizar_historico"]')?.checked),
      mensagem_rejeicao: document.getElementById('mensagem-rejeicao')?.value || '',
    };

    try {
      await api.post('inst.update', payload);
      showToast('Configuracoes salvas.');
    } catch (error) {
      showToast(error?.message || 'Erro ao salvar configuracoes.', 'error');
    }
  });
};

const bindSupportForm = () => {
  const form = document.getElementById('support-form');
  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const message = document.getElementById('support-message')?.value.trim();
    if (!message) return;

    try {
      const { data } = await api.post('support.chat', { message });
      showToast(data?.reply || 'Solicitacao enviada.');
      document.getElementById('support-message').value = '';
    } catch (error) {
      showToast(error?.message || 'Erro ao enviar mensagem.', 'error');
    }
  });
};

const handleLoginSuccess = async (data, options = {}) => {
  const { skipContext = false, fallbackEmail = null, fallbackUserId = null } = options;

  const userId = data?.user_id ?? data?.user?.id ?? fallbackUserId ?? null;
  const userEmail = data?.email ?? data?.user?.email ?? fallbackEmail ?? null;
  const sessionToken = data?.session_token ?? data?.sessionToken ?? null;

  const nextState = {
    auth: {
      user: { id: userId, email: userEmail },
      sessionToken,
    },
    currentView: 'dados',
    isSignupOpen: false,
  };

  if (data?.empresa) {
    nextState.empresa = data.empresa;
  }

  if (Array.isArray(data?.instancias)) {
    nextState.instancias = data.instancias;
  }

  setState(nextState, 'login:success');

  showToast(skipContext ? 'Sessao demo iniciada.' : 'Sessao iniciada com sucesso.');

  if (skipContext) return;

  try {
    const context = await api.post('auth.me');
    setState(
      {
        empresa: context.data?.empresa || null,
        instancias: context.data?.instancias || [],
      },
      'auth:hydrate',
    );
  } catch (error) {
    console.warn('[OMR:UI] auth.me falhou', error);
  }
};

const renderSignupModal = () => `
  <div class="modal-backdrop" role="dialog" aria-modal="true">
    <div class="modal-panel">
      <div class="modal-content">
        <button class="modal-close" id="close-signup" type="button">Fechar</button>
        <header class="space-y-2 text-center">
          <p class="pill-label text-primary">Criar conta</p>
          <h2 class="text-2xl font-semibold tracking-wide text-text">Acessar o OMR Studio</h2>
          <p class="text-sm text-text-muted">Preencha os campos e nossa equipe habilita sua instancia piloto.</p>
        </header>

        <form id="signup-form" class="space-y-4">
          <div class="grid gap-3 sm:grid-cols-2">
            <label class="text-sm text-text">
              <span class="font-medium">Nome completo</span>
              <input class="input-field mt-2 w-full" name="full_name" required />
            </label>
            <label class="text-sm text-text">
              <span class="font-medium">Email institucional</span>
              <input class="input-field mt-2 w-full" type="email" name="email" required />
            </label>
          </div>
          <label class="text-sm text-text">
            <span class="font-medium">WhatsApp</span>
            <input class="input-field mt-2 w-full" name="whatsapp" placeholder="(11) 99999-9999" />
          </label>
          <div class="grid gap-3 sm:grid-cols-2">
            <label class="text-sm text-text">
              <span class="font-medium">Senha</span>
              <input class="input-field mt-2 w-full" type="password" name="password" required />
            </label>
            <label class="text-sm text-text">
              <span class="font-medium">Confirmar senha</span>
              <input class="input-field mt-2 w-full" type="password" name="password_confirm" required />
            </label>
          </div>
          <label class="flex items-start gap-2 text-xs text-text-muted">
            <input id="signup-terms" type="checkbox" class="mt-1 h-4 w-4 rounded border-border" required />
            <span>Concordo com os termos de uso piloto e politicas de dados OMR.</span>
          </label>
          <button type="submit" class="btn-primary w-full py-3 text-sm font-semibold uppercase tracking-[0.24em]">
            Enviar cadastro
          </button>
        </form>
      </div>
    </div>
  </div>
`;

const bindSignupModal = () => {
  const closeBtn = document.getElementById('close-signup');
  const form = document.getElementById('signup-form');

  closeBtn?.addEventListener('click', () => setState({ isSignupOpen: false }, 'signup:close'));

  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const password = data.get('password');
    const confirm = data.get('password_confirm');

    if (password !== confirm) {
      showToast('As senhas nao conferem.', 'error');
      return;
    }

    showToast('Cadastro enviado (modo demo).');
    setState({ isSignupOpen: false }, 'signup:submitted');
  });
};



