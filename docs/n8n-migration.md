# N8N — Migração do Fluxo Legado para o Endpoint Unificado

## 1. Visão Geral
O fluxo legado separava as ações em três módulos (Database, Evolution API e Simulador IA) com nomes de ação desconexos do SPA atual. O backend agora exige um único endpoint (`POST https://omelhorrobo-n8n.cloudfy.live/webhook/api-backend`) que recebe o envelope `{ action, auth, payload }` e responde `{ ok, data, error, meta }`.

Para compatibilidade com o frontend do MVP, todas as ações devem seguir o namespace documentado em `read.me` e em `agents.md`. O `Switch` principal precisa rotear pelos novos grupos `auth.*`, `dados.*`, `sim.*`, `inst.*`, `support.*` e `internal.*`.

## 2. Mapeamento de Ações
| Fluxo legado | Novo contrato | Observações |
| --- | --- | --- |
| `login` | `auth.login` | Enviado sem `auth`. Payload `{ email, password }`. Retorne `{ user_id, session_token }`. |
| `registro` | **Sem equivalente direto** | Cadastro será tratato fora do MVP. Remover do roteamento. |
| `buscar_dados` | `dados.get` | Sem payload. Retorne `{ empresa, produtos, faqs }`. |
| `salvar_dados` | `dados.save` | Payload `{ empresa, produtos[], faqs[] }`. Retorne `{ saved: true }` ou estrutura similar em `data`. |
| `conectar_wpp` | `inst.qr` | Sem payload. Retorne `{ status, qr_svg? }`. |
| `desconectar_wpp` | `inst.disconnect` | Sem payload. Retorne `{ disconnected: true }`. |
| `status_wpp` | `inst.status` | Sem payload. Retorne `{ status, battery?, platform?, last_event? }`. |
| `config_wpp` | `inst.update` | Payload com switches `{ rejeitar_chamadas, ignorar_grupos, sempre_online, ler_mensagens, sincronizar_historico, mensagem_rejeicao }`. |
| `chat` | `sim.chat` | Payload `{ persona, message }`. Retorne `{ reply, usage? }`. |
| *(novo)* | `auth.me` | Valida sessão existente. Sem payload. Deve retornar `{ user, empresa, instancias }`. |
| *(novo)* | `auth.logout` | Sem payload. Apenas invalida token atual. |
| *(novo)* | `inst.refresh` | Reexecuta handshake/QR. Reutiliza resposta de `inst.status`. |
| *(novo)* | `support.chat` | Payload `{ message }`. Retorne `{ reply, escalate? }`. |
| *(novo)* | `internal.notify` | Payload `{ type, details }`. Apenas confirmar `{ delivered: true }`. |

## 3. Estrutura Recomendada do Fluxo
1. **Webhook único** recebendo o envelope `{ action, auth, payload }`.
2. **Node Function/Set** para normalizar `body.action`, `body.auth` e `body.payload` caso necessário.
3. **Switch (`body.action`)** com expressões explícitas, evitando regex genérico. Sugestão:
   - `Starts With` → `auth.`
   - `Starts With` → `dados.`
   - `Starts With` → `sim.`
   - `Starts With` → `inst.`
   - `Starts With` → `support.`
   - `Starts With` → `internal.`
4. Cada saída do Switch chama um **Subworkflow dedicado** ou **Function** conforme o módulo:
   - `auth.*` → Workflow `Auth` (Supabase Auth + sessão).
   - `dados.*` → Workflow `Dados` (Supabase CRUD).
   - `sim.*` → Workflow `Simulador IA` (prompt builder + LLM).
   - `inst.*` → Workflow `Evolution API`.
   - `support.*` → Workflow `Suporte`.
   - `internal.*` → Workflow `Backoffice Hooks`.
5. **Respond to Webhook** uniformizando `{ ok, data, error }`:
   - Sucesso: `{ ok: true, data: { ... }, error: null }`.
   - Erro: `{ ok: false, error: { code, message }, data: null }`.

## 4. Payloads Detalhados
### 4.1 Autenticação
- `auth.login`
  ```json
  {
    "action": "auth.login",
    "auth": false,
    "payload": { "email": "user@dominio.com", "password": "***" }
  }
  ```
- `auth.me`
  ```json
  { "action": "auth.me", "auth": { "user_id": "UUID", "session_token": "token" }, "payload": {} }
  ```
- `auth.logout`
  ```json
  { "action": "auth.logout", "auth": { "user_id": "UUID", "session_token": "token" }, "payload": {} }
  ```

### 4.2 Dados do Negócio
- `dados.get`
  ```json
  { "action": "dados.get", "auth": { "user_id": "UUID", "session_token": "token" }, "payload": {} }
  ```
- `dados.save`
  ```json
  {
    "action": "dados.save",
    "auth": { "user_id": "UUID", "session_token": "token" },
    "payload": {
      "empresa": { "nome": "Minha Empresa", "tipo": "Cafeteria", "horario_funcionamento": "Seg-Sex 09:00-18:00", "contatos_extras": "@cafeteria", "endereco": "Rua das Flores", "observacoes": "Promo do dia", "persona": "josi" },
      "produtos": [ { "nome": "Café Latte", "descricao": "200ml", "preco": 12.9 } ],
      "faqs": [ { "pergunta": "Tem delivery?", "resposta": "Sim, via iFood." } ]
    }
  }
  ```

### 4.3 Simulador IA
- `sim.chat`
  ```json
  {
    "action": "sim.chat",
    "auth": { "user_id": "UUID", "session_token": "token" },
    "payload": { "persona": "clara", "message": "Quais serviços vocês oferecem?" }
  }
  ```

### 4.4 Evolution API
- `inst.status`
  ```json
  { "action": "inst.status", "auth": { "user_id": "UUID", "session_token": "token" }, "payload": {} }
  ```
- `inst.qr`
  ```json
  { "action": "inst.qr", "auth": { "user_id": "UUID", "session_token": "token" }, "payload": {} }
  ```
- `inst.update`
  ```json
  {
    "action": "inst.update",
    "auth": { "user_id": "UUID", "session_token": "token" },
    "payload": {
      "rejeitar_chamadas": true,
      "ignorar_grupos": false,
      "sempre_online": true,
      "ler_mensagens": true,
      "sincronizar_historico": false,
      "mensagem_rejeicao": "No momento não atendemos chamadas. Envie uma mensagem."
    }
  }
  ```
- `inst.refresh`
  ```json
  { "action": "inst.refresh", "auth": { "user_id": "UUID", "session_token": "token" }, "payload": {} }
  ```
- `inst.disconnect`
  ```json
  { "action": "inst.disconnect", "auth": { "user_id": "UUID", "session_token": "token" }, "payload": {} }
  ```

### 4.5 Suporte e Notificações
- `support.chat`
  ```json
  {
    "action": "support.chat",
    "auth": { "user_id": "UUID", "session_token": "token" },
    "payload": { "message": "Preciso falar com um humano" }
  }
  ```
- `internal.notify`
  ```json
  {
    "action": "internal.notify",
    "auth": { "user_id": "UUID", "session_token": "token" },
    "payload": { "type": "new_account", "details": { "email": "user@dominio.com" } }
  }
  ```

## 5. Próximos Passos no N8N
1. Atualizar o `Switch` principal para usar os novos prefixos de ação.
2. Substituir as chamadas aos subworkflows antigos pelos módulos alinhados ao contrato (Auth, Dados, Evolution, Simulador, Suporte, Interno).
3. Ajustar as funções/HTTP Requests internos para respeitar a estrutura de payload descrita acima.
4. Garantir que todos os retornos usem o envelope `{ ok, data, error, meta? }` com mensagens de erro padronizadas (`INVALID_INPUT`, `AUTH_REQUIRED`, `INTERNAL_ERROR`).
5. Remover rotas não suportadas no MVP (`registro`, endpoints temporários de teste, etc.).

Seguindo estes passos, o fluxo ficará compatível com o SPA atual e com o contrato de backend definido pela equipe OMR.

## 6. Workflow de Referência
O arquivo `docs/n8n-workflow.json` contém o fluxo completo pronto para importação no N8N. Copie o conteúdo e utilize a opção **Import workflow** para substituir o fluxo legado.
