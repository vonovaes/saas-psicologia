-- Adiciona slug único ao Tenant para URLs públicas /p/[slug]

-- 1. Coluna nullable para permitir backfill
ALTER TABLE "Tenant" ADD COLUMN "slug" TEXT;

-- 2. Backfill: slugifica o nome (minúsculas, sem acentos comuns, hífens)
UPDATE "Tenant"
SET "slug" = trim(both '-' from lower(
  regexp_replace(
    translate(
      name,
      'áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ',
      'aaaaaeeeeiiiiooooouuuucnAAAAAEEEEIIIIOOOOOUUUUCN'
    ),
    '[^a-zA-Z0-9]+', '-', 'g'
  )
));

-- 3. Garante unicidade caso existam slugs duplicados (adiciona sufixo do id)
WITH dup AS (
  SELECT id, slug, row_number() OVER (PARTITION BY slug ORDER BY "createdAt") AS rn
  FROM "Tenant"
)
UPDATE "Tenant" t
SET slug = t.slug || '-' || substring(t.id, 1, 4)
FROM dup
WHERE t.id = dup.id AND dup.rn > 1;

-- 4. Restrições finais
ALTER TABLE "Tenant" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Tenant_slug_key" ON "Tenant"("slug");
