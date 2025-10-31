import { setState } from './state.js';

export const renderOnboarding = () => `
  <aside class="onboarding-pop fixed inset-x-4 bottom-24 z-40 sm:inset-x-auto sm:right-6 sm:w-80">
    <div class="onboarding-callout px-5 py-5">
      <header class="space-y-2">
        <p class="badge-attention">Atenção</p>
        <h4 class="text-base font-semibold text-text">Finalize a configuração piloto</h4>
        <p class="text-xs text-text-muted">Completar estes passos libera o teste completo.</p>
      </header>
      <ol class="onboarding-steps space-y-3 pt-3 text-sm text-text">
        <li class="flex items-start gap-3"><span class="pulse-dot mt-1"></span> Preencha os dados do negocio.</li>
        <li class="flex items-start gap-3"><span class="pulse-dot mt-1"></span> Teste a experiencia no simulador.</li>
        <li class="flex items-start gap-3"><span class="pulse-dot mt-1"></span> Conecte o WhatsApp na aba Conexoes.</li>
      </ol>
      <button id="close-onboarding" class="toggle-chip onboarding-dismiss mt-4 w-full justify-center text-sm">Entendi</button>
    </div>
  </aside>
`;

export const bindOnboardingDismiss = () => {
  const close = document.getElementById('close-onboarding');
  if (!close) return;
  close.addEventListener('click', () => setState({ isTourVisible: false }, 'onboarding:dismiss'));
};
