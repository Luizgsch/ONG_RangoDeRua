-- CreateTable
CREATE TABLE "instagram_posts" (
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "permalink" TEXT NOT NULL,
    "caption" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instagram_posts_pkey" PRIMARY KEY ("id")
);
