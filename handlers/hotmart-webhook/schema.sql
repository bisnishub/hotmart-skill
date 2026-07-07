-- Tabela de auditoria do webhook (base pra métricas e reprocessamento)
create table if not exists public.webhook_logs (
  id                    uuid primary key default gen_random_uuid(),
  created_at            timestamptz not null default now(),
  source                text not null,            -- 'hotmart'
  event_type            text not null,            -- 'PURCHASE_APPROVED', 'ping', ...
  payload               jsonb,                    -- evento bruto completo
  processed_transaction text                      -- marca de dedupe (venda processada)
);

create index if not exists webhook_logs_source_created_idx
  on public.webhook_logs (source, created_at desc);
create index if not exists webhook_logs_processed_tx_idx
  on public.webhook_logs (processed_transaction)
  where processed_transaction is not null;

-- Trave o acesso público (a function usa service_role e ignora RLS)
alter table public.webhook_logs enable row level security;
