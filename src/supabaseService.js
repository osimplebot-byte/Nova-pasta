import { supabase } from './supabase.js';

const createClientError = (code, message) => {
  const error = new Error(message);
  error.code = code;
  return error;
};

const sanitizeString = (value) => (typeof value === 'string' ? value.trim() : value ?? '');

const parsePreco = (value) => {
  if (value === null || value === undefined) return null;
  const normalized = String(value)
    .replace(/[^0-9.,-]/g, '')
    .replace(',', '.');
  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};

const mapProdutoRow = (row) => ({
  id: row.id,
  nome: row.nome || '',
  descricao: row.descricao || '',
  preco: row.preco !== null && row.preco !== undefined ? String(row.preco) : '',
});

const mapFaqRow = (row) => ({
  id: row.id,
  pergunta: row.pergunta || '',
  resposta: row.resposta || '',
});

const mapInstanciaRow = (row) => {
  const settings = row?.settings && typeof row.settings === 'object' ? row.settings : {};
  const lastEvent = (() => {
    if (!row?.last_event) return '';
    if (typeof row.last_event === 'string') return row.last_event;
    if (typeof row.last_event.message === 'string') return row.last_event.message;
    try {
      return JSON.stringify(row.last_event);
    } catch (error) {
      return '';
    }
  })();

  return {
    id: row.id,
    empresa_id: row.empresa_id,
    evolution_instance_id: row.evolution_instance_id || '',
    status: row.status || 'desconectado',
    mensagem_rejeicao: settings.mensagem_rejeicao || '',
    rejeitar_chamadas: Boolean(settings.rejeitar_chamadas),
    ignorar_grupos: Boolean(settings.ignorar_grupos),
    sempre_online: Boolean(settings.sempre_online),
    ler_mensagens: Boolean(settings.ler_mensagens),
    sincronizar_historico: Boolean(settings.sincronizar_historico),
    last_event: lastEvent,
    logs: Array.isArray(settings.logs) ? settings.logs : [],
    qr_svg: settings.qr_svg || null,
  };
};

const getAuthenticatedUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    throw createClientError(error.code || 'AUTH_ERROR', error.message || 'Falha ao consultar sessão.');
  }
  if (!data?.user) {
    throw createClientError('AUTH_REQUIRED', 'Sessão expirada. Faça login novamente.');
  }
  return data.user;
};

const ensureUsuarioRecord = async (user, overrides = {}) => {
  if (!user?.id) return null;

  const payload = {
    id: user.id,
    email: overrides.email || user.email || user.user_metadata?.email || null,
  };

  try {
    const { error: upsertError } = await supabase
      .from('usuarios')
      .upsert(payload, { onConflict: 'id' });

    if (upsertError && upsertError.code !== '23505') {
      throw upsertError;
    }

    const { data, error: fetchError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    return data || payload;
  } catch (error) {
    throw createClientError(error.code || 'INTERNAL_ERROR', error.message || 'Erro ao sincronizar usuário.');
  }
};

export const signInWithEmail = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    throw createClientError(error.code || 'AUTH_INVALID', error.message || 'Não foi possível autenticar.');
  }
  return data;
};

export const signUpWithEmail = async (email, password, metadata = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata },
  });

  if (error) {
    throw createClientError(error.code || 'AUTH_ERROR', error.message || 'Não foi possível criar a conta.');
  }

  if (data?.session?.user) {
    try {
      await ensureUsuarioRecord(data.session.user, { email, ...metadata });
    } catch (syncError) {
      console.warn('[OMR:SUPABASE] Falha ao sincronizar registro do usuário após cadastro', syncError);
    }
  }

  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw createClientError(error.code || 'AUTH_ERROR', error.message || 'Falha ao encerrar sessão.');
  }
};

export const fetchWorkspaceContext = async () => {
  const user = await getAuthenticatedUser();

  let usuario = null;
  try {
    usuario = await ensureUsuarioRecord(user);
  } catch (error) {
    console.warn('[OMR:SUPABASE] Falha ao garantir registro do usuário', error);
  }

  const { data: empresas, error: empresaError } = await supabase
    .from('empresas')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1);

  if (empresaError) {
    throw createClientError(empresaError.code || 'INTERNAL_ERROR', empresaError.message || 'Erro ao carregar empresa.');
  }

  const empresaRow = empresas?.[0] || null;
  let produtos = [];
  let faqs = [];
  let instancias = [];

  if (empresaRow) {
    const { data: produtosRows, error: produtosError } = await supabase
      .from('produtos')
      .select('*')
      .eq('empresa_id', empresaRow.id)
      .order('created_at', { ascending: true });

    if (produtosError) {
      throw createClientError(produtosError.code || 'INTERNAL_ERROR', produtosError.message || 'Erro ao carregar produtos.');
    }

    produtos = (produtosRows || []).map(mapProdutoRow);

    const { data: faqsRows, error: faqsError } = await supabase
      .from('faqs')
      .select('*')
      .eq('empresa_id', empresaRow.id)
      .order('created_at', { ascending: true });

    if (faqsError) {
      throw createClientError(faqsError.code || 'INTERNAL_ERROR', faqsError.message || 'Erro ao carregar FAQs.');
    }

    faqs = (faqsRows || []).map(mapFaqRow);

    const { data: instanciasRows, error: instanciasError } = await supabase
      .from('instancias')
      .select('*')
      .eq('empresa_id', empresaRow.id)
      .order('created_at', { ascending: true });

    if (instanciasError) {
      throw createClientError(
        instanciasError.code || 'INTERNAL_ERROR',
        instanciasError.message || 'Erro ao carregar instâncias.',
      );
    }

    instancias = (instanciasRows || []).map(mapInstanciaRow);
  }

  const empresa = empresaRow
    ? {
        id: empresaRow.id,
        user_id: empresaRow.user_id,
        nome: empresaRow.nome || '',
        tipo: empresaRow.tipo || '',
        horario_funcionamento: empresaRow.horario_funcionamento || '',
        contatos_extras: empresaRow.contatos_extras || '',
        endereco: empresaRow.endereco || '',
        observacoes: empresaRow.observacoes || '',
        persona: empresaRow.persona || 'josi',
        produtos,
        faqs,
        updated_at: empresaRow.updated_at || empresaRow.created_at || null,
      }
    : null;

  return {
    user: { id: user.id, email: user.email },
    usuario,
    empresa,
    instancias,
  };
};

export const saveWorkspaceContext = async (payload) => {
  const user = await getAuthenticatedUser();

  await ensureUsuarioRecord(user);

  const empresaNome = sanitizeString(payload?.empresa?.nome);
  if (!empresaNome) {
    throw createClientError('INVALID_INPUT', 'Informe o nome da empresa.');
  }

  const empresaData = {
    nome: empresaNome,
    tipo: sanitizeString(payload?.empresa?.tipo),
    horario_funcionamento: sanitizeString(payload?.empresa?.horario_funcionamento),
    contatos_extras: sanitizeString(payload?.empresa?.contatos_extras),
    endereco: sanitizeString(payload?.empresa?.endereco),
    observacoes: sanitizeString(payload?.empresa?.observacoes),
    persona: payload?.empresa?.persona || 'josi',
  };

  const { data: empresaLookup, error: lookupError } = await supabase
    .from('empresas')
    .select('id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1);

  if (lookupError) {
    throw createClientError(lookupError.code || 'INTERNAL_ERROR', lookupError.message || 'Erro ao consultar empresa.');
  }

  let empresaId = empresaLookup?.[0]?.id || null;

  if (empresaId) {
    const { error: updateError } = await supabase
      .from('empresas')
      .update(empresaData)
      .eq('id', empresaId);

    if (updateError) {
      throw createClientError(updateError.code || 'INTERNAL_ERROR', updateError.message || 'Erro ao atualizar empresa.');
    }
  } else {
    const { data: inserted, error: insertError } = await supabase
      .from('empresas')
      .insert([{ ...empresaData, user_id: user.id }])
      .select()
      .single();

    if (insertError) {
      throw createClientError(insertError.code || 'INTERNAL_ERROR', insertError.message || 'Erro ao criar empresa.');
    }

    empresaId = inserted?.id || null;
  }

  if (!empresaId) {
    throw createClientError('INTERNAL_ERROR', 'Não foi possível determinar a empresa.');
  }

  const produtosPayload = Array.isArray(payload?.produtos) ? payload.produtos : [];
  const faqsPayload = Array.isArray(payload?.faqs) ? payload.faqs : [];

  const { error: deleteProdutosError } = await supabase.from('produtos').delete().eq('empresa_id', empresaId);
  if (deleteProdutosError) {
    throw createClientError(deleteProdutosError.code || 'INTERNAL_ERROR', deleteProdutosError.message || 'Erro ao atualizar produtos.');
  }

  if (produtosPayload.length > 0) {
    const produtosInsert = produtosPayload
      .map((item) => ({
        empresa_id: empresaId,
        nome: sanitizeString(item?.nome),
        descricao: sanitizeString(item?.descricao) || null,
        preco: parsePreco(item?.preco),
      }))
      .filter((item) => item.nome);

    if (produtosInsert.length > 0) {
      const { error: produtosInsertError } = await supabase.from('produtos').insert(produtosInsert);
      if (produtosInsertError) {
        throw createClientError(
          produtosInsertError.code || 'INTERNAL_ERROR',
          produtosInsertError.message || 'Erro ao salvar produtos.',
        );
      }
    }
  }

  const { error: deleteFaqsError } = await supabase.from('faqs').delete().eq('empresa_id', empresaId);
  if (deleteFaqsError) {
    throw createClientError(deleteFaqsError.code || 'INTERNAL_ERROR', deleteFaqsError.message || 'Erro ao atualizar FAQs.');
  }

  if (faqsPayload.length > 0) {
    const faqsInsert = faqsPayload
      .map((item) => ({
        empresa_id: empresaId,
        pergunta: sanitizeString(item?.pergunta),
        resposta: sanitizeString(item?.resposta),
      }))
      .filter((item) => item.pergunta && item.resposta);

    if (faqsInsert.length > 0) {
      const { error: faqsInsertError } = await supabase.from('faqs').insert(faqsInsert);
      if (faqsInsertError) {
        throw createClientError(
          faqsInsertError.code || 'INTERNAL_ERROR',
          faqsInsertError.message || 'Erro ao salvar FAQs.',
        );
      }
    }
  }

  return fetchWorkspaceContext();
};
