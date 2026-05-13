-- Fallback: garante que a coluna sort_order existe em manual_posts
-- Se já existe, PostgreSQL ignora o erro (coluna não será duplicada)
ALTER TABLE "manual_posts" ADD COLUMN IF NOT EXISTS "sort_order" INTEGER NOT NULL DEFAULT 0;
