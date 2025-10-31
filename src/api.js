import { getState, setState } from './state.js';

const CONFIG = {
  baseUrl: window.__OMR_ENV__?.apiBaseUrl || 'https://omelhorrobo-n8n.cloudfy.live/webhook/api-backend',
  timeout: 20000,
};

const withTimeout = (promise, ms) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('REQUEST_TIMEOUT')), ms);
    promise
      .then((result) => {
        clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });

const buildRequestBody = (action, payload, includeAuth = true) => {
  const body = {
    action,
    payload,
  };

  if (includeAuth) {
    const { auth } = getState();
    body.auth = {
      user_id: auth?.user?.id || null,
      session_token: auth?.sessionToken || null,
    };
  }

  return body;
};

const parseResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  const envelope = {
    status: response.status,
    ok: response.ok && data?.ok,
    data: data?.data || null,
    error: data?.error || null,
    meta: data?.meta || null,
  };

  if (!envelope.ok) {
    throw envelope.error || { code: 'INTERNAL_ERROR', message: 'Erro inesperado' };
  }

  return envelope;
};

export const api = {
  async post(action, payload = {}, { auth = true } = {}) {
    console.log('[OMR:API]', '->', action, payload);

    const response = await withTimeout(
      fetch(CONFIG.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(buildRequestBody(action, payload, auth)),
      }),
      CONFIG.timeout,
    ).catch((error) => {
      console.error('[OMR:API]', 'x', action, error);
      throw error;
    });

    const parsed = await parseResponse(response);

    console.log('[OMR:API]', 'ok', action, parsed.data);

    if (action === 'auth.logout') {
      setState({ auth: { user: null, sessionToken: null }, currentView: 'login' }, 'logout');
    }

    return parsed;
  },
};
