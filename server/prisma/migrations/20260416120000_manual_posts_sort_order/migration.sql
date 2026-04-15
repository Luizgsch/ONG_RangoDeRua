-- Ordem manual da galeria (drag-and-drop no admin). Menor = aparece primeiro no site.
ALTER TABLE "manual_posts" ADD COLUMN "sort_order" INTEGER NOT NULL DEFAULT 0;

-- Mantém o comportamento anterior (mais recente primeiro) como ordem inicial.
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at DESC) - 1 AS pos
  FROM manual_posts
)
UPDATE manual_posts AS m
SET sort_order = ranked.pos
FROM ranked
WHERE m.id = ranked.id;
