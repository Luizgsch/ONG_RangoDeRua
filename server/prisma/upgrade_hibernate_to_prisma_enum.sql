-- Rode uma vez se a tabela `volunteers` veio do Hibernate com `disponibilidade` VARCHAR.
-- Depois: npx prisma db push  (ou npx prisma migrate dev)

CREATE TYPE "Availability" AS ENUM ('ONCE_A_MONTH', 'TWICE_A_MONTH', 'EVENTUAL', 'REMOTE');

ALTER TABLE "volunteers" DROP CONSTRAINT IF EXISTS "volunteers_disponibilidade_check";

ALTER TABLE "volunteers"
  ALTER COLUMN "disponibilidade" SET DATA TYPE "Availability"
  USING ("disponibilidade"::"Availability");
