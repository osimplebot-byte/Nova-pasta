#!/usr/bin/env node
import crypto from 'node:crypto';

const resolveEnv = (keys) => {
  for (const key of keys) {
    if (process.env[key]) return process.env[key];
  }
  return null;
};

const supabaseUrl =
  resolveEnv(['SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'VITE_SUPABASE_URL', 'PUBLIC_SUPABASE_URL']) ||
  process.env.SUPABASE_PROJECT_URL;
const supabaseAnonKey =
  resolveEnv(['SUPABASE_ANON_KEY', 'NEXT_PUBLIC_SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY', 'PUBLIC_SUPABASE_ANON_KEY']) ||
  process.env.SUPABASE_PUBLIC_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[QA] Defina SUPABASE_URL e SUPABASE_ANON_KEY antes de executar o teste.');
  process.exitCode = 1;
  process.exit();
}

const randomId = crypto.randomBytes(4).toString('hex');
const email = `qa+${Date.now()}_${randomId}@omr.studio.test`;
const password = `Supabase${randomId}!9`;

const baseHeaders = {
  apikey: supabaseAnonKey,
  'Content-Type': 'application/json',
};

const request = async (path, init = {}) => {
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: {
      ...baseHeaders,
      ...(init.headers || {}),
    },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(body?.error_description || body?.message || 'Request failed');
    error.status = response.status;
    error.body = body;
    throw error;
  }
  return body;
};

const main = async () => {
  console.log('[QA] Iniciando teste de integração Supabase');
  console.log('[QA] URL:', supabaseUrl);

  const signUpData = await request('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      data: { full_name: 'QA Bot', whatsapp: '+5511999999999' },
    }),
  });

  let accessToken = signUpData?.access_token;
  let refreshToken = signUpData?.refresh_token;
  let user = signUpData?.user || signUpData?.session?.user || null;

  if (!accessToken) {
    console.log('[QA] Cadastro exige confirmação de e-mail, tentando login para obter token.');
    const loginData = await request('/auth/v1/token?grant_type=password', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    accessToken = loginData.access_token;
    refreshToken = loginData.refresh_token;
    user = loginData.user;
  }

  if (!accessToken || !user?.id) {
    throw new Error('Não foi possível obter sessão após cadastro. Verifique políticas de confirmação.');
  }

  console.log('[QA] Usuário autenticado:', user.id);

  const authHeaders = {
    Authorization: `Bearer ${accessToken}`,
    Prefer: 'return=representation,resolution=merge-duplicates',
  };

  // garante o registro em public.usuarios
  const usuarioRow = await request('/rest/v1/usuarios', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify([
      {
        id: user.id,
        email,
      },
    ]),
  });
  console.log('[QA] Registro usuarios criado/atualizado:', usuarioRow?.[0]?.id);

  const empresaPayload = {
    id: crypto.randomUUID(),
    user_id: user.id,
    nome: 'Empresa QA',
    tipo: 'Tecnologia',
    horario_funcionamento: 'Seg a Sex 09h-18h',
    contatos_extras: 'contato@qa.test',
    endereco: 'Rua Teste, 123',
    observacoes: 'Cadastro automático QA',
    persona: 'josi',
  };

  const empresas = await request('/rest/v1/empresas', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify([empresaPayload]),
  });

  const empresaId = empresas?.[0]?.id;
  if (!empresaId) {
    throw new Error('Falha ao inserir empresa de teste.');
  }
  console.log('[QA] Empresa criada:', empresaId);

  const produtos = await request('/rest/v1/produtos', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify([
      {
        empresa_id: empresaId,
        nome: 'Produto QA',
        descricao: 'Fluxo automatizado para testes.',
        preco: 199.9,
      },
    ]),
  });
  console.log('[QA] Produtos inseridos:', produtos.length);

  const faqs = await request('/rest/v1/faqs', {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify([
      {
        empresa_id: empresaId,
        pergunta: 'Como funciona o teste?',
        resposta: 'Executamos integração ponta a ponta via Supabase.',
      },
    ]),
  });
  console.log('[QA] FAQs inseridas:', faqs.length);

  const context = await request(
    `/rest/v1/empresas?select=*,produtos(*),faqs(*)&id=eq.${empresaId}`,
    {
      method: 'GET',
      headers: authHeaders,
    },
  );

  console.log('[QA] Contexto carregado com', {
    empresas: context.length,
    produtos: context?.[0]?.produtos?.length || 0,
    faqs: context?.[0]?.faqs?.length || 0,
  });

  if (!refreshToken) {
    console.warn('[QA] Aviso: refresh token ausente, confirme configuração de autenticação do projeto.');
  }

  console.log('[QA] Teste concluído com sucesso para o usuário', email);
};

main().catch((error) => {
  console.error('[QA] Falha no teste Supabase:', error.status, error.message);
  if (error.body) {
    console.error('[QA] Resposta:', JSON.stringify(error.body));
  }
  process.exitCode = 1;
});
