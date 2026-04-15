-- Galeria manual: substitui manual_instagram_posts por manual_posts (URL + chave Cloudinary).

DROP TABLE IF EXISTS "manual_instagram_posts";

CREATE TABLE "manual_posts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "image_url" TEXT NOT NULL,
    "image_key" TEXT NOT NULL,
    "permalink" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "manual_posts_pkey" PRIMARY KEY ("id")
);
