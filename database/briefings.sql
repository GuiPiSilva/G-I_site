CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS public.gi_site_briefings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company text NOT NULL,
  social text NOT NULL DEFAULT '',
  current_site text NOT NULL DEFAULT '',
  segment text NOT NULL,
  company_age text NOT NULL DEFAULT '',
  business_description text NOT NULL,
  audience text NOT NULL,
  differentials text NOT NULL DEFAULT '',
  site_type text NOT NULL,
  goals jsonb NOT NULL DEFAULT '[]'::jsonb,
  pages text NOT NULL DEFAULT '',
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  brand_identity text NOT NULL DEFAULT '',
  colors text NOT NULL DEFAULT '',
  "references" text NOT NULL DEFAULT '',
  reference_notes text NOT NULL DEFAULT '',
  avoid text NOT NULL DEFAULT '',
  domain text NOT NULL DEFAULT '',
  hosting text NOT NULL DEFAULT '',
  deadline text NOT NULL DEFAULT '',
  budget text NOT NULL DEFAULT '',
  materials text NOT NULL DEFAULT '',
  notes text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Novo' CHECK (status IN ('Novo','Em análise','Aguardando cliente','Concluído')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS gi_site_briefings_created_at_idx ON public.gi_site_briefings (created_at DESC);
CREATE INDEX IF NOT EXISTS gi_site_briefings_status_idx ON public.gi_site_briefings (status);
-- Esta tabela é acessada exclusivamente pelo backend usando DATABASE_URL.
-- Não conceda acesso direto ao papel público/anon.