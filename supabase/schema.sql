-- Schema Supabase para o MVP do OMR Studio
-- Executar em um projeto Supabase com role suficiente (p. ex. via SQL Editor).

create extension if not exists "pgcrypto";

create table if not exists public.usuarios (
    id uuid primary key default gen_random_uuid(),
    email text not null unique,
    password_hash text,
    created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.empresas (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null references public.usuarios(id) on delete cascade,
    nome text not null,
    tipo text,
    horario_funcionamento text,
    contatos_extras text,
    endereco text,
    observacoes text,
    persona text not null default 'josi',
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.produtos (
    id uuid primary key default gen_random_uuid(),
    empresa_id uuid not null references public.empresas(id) on delete cascade,
    nome text not null,
    descricao text,
    preco numeric(12, 2),
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.faqs (
    id uuid primary key default gen_random_uuid(),
    empresa_id uuid not null references public.empresas(id) on delete cascade,
    pergunta text not null,
    resposta text not null,
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists public.instancias (
    id uuid primary key default gen_random_uuid(),
    empresa_id uuid not null references public.empresas(id) on delete cascade,
    evolution_instance_id text unique,
    status text not null default 'desconectado' check (status in ('desconectado', 'conectando', 'conectado', 'erro')),
    settings jsonb not null default '{}'::jsonb,
    last_event jsonb,
    created_at timestamptz not null default timezone('utc'::text, now()),
    updated_at timestamptz not null default timezone('utc'::text, now())
);

create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at := timezone('utc'::text, now());
    return new;
end;
$$;

create trigger set_timestamp_empresas
    before update on public.empresas
    for each row
    execute procedure public.handle_updated_at();

create trigger set_timestamp_produtos
    before update on public.produtos
    for each row
    execute procedure public.handle_updated_at();

create trigger set_timestamp_faqs
    before update on public.faqs
    for each row
    execute procedure public.handle_updated_at();

create trigger set_timestamp_instancias
    before update on public.instancias
    for each row
    execute procedure public.handle_updated_at();

create index if not exists idx_empresas_user on public.empresas(user_id);
create index if not exists idx_produtos_empresa on public.produtos(empresa_id);
create index if not exists idx_faqs_empresa on public.faqs(empresa_id);
create index if not exists idx_instancias_empresa on public.instancias(empresa_id);

alter table public.usuarios enable row level security;
alter table public.empresas enable row level security;
alter table public.produtos enable row level security;
alter table public.faqs enable row level security;
alter table public.instancias enable row level security;

create policy "Usuarios: acesso próprio" on public.usuarios
    for all
    using (id = auth.uid())
    with check (id = auth.uid());

create policy "Empresas: acesso do dono" on public.empresas
    for all
    using (user_id = auth.uid())
    with check (user_id = auth.uid());

create policy "Produtos: acesso via empresa" on public.produtos
    for all
    using (
        exists (
            select 1 from public.empresas e
            where e.id = produtos.empresa_id
              and e.user_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from public.empresas e
            where e.id = produtos.empresa_id
              and e.user_id = auth.uid()
        )
    );

create policy "FAQs: acesso via empresa" on public.faqs
    for all
    using (
        exists (
            select 1 from public.empresas e
            where e.id = faqs.empresa_id
              and e.user_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from public.empresas e
            where e.id = faqs.empresa_id
              and e.user_id = auth.uid()
        )
    );

create policy "Instancias: acesso via empresa" on public.instancias
    for all
    using (
        exists (
            select 1 from public.empresas e
            where e.id = instancias.empresa_id
              and e.user_id = auth.uid()
        )
    )
    with check (
        exists (
            select 1 from public.empresas e
            where e.id = instancias.empresa_id
              and e.user_id = auth.uid()
        )
    );
