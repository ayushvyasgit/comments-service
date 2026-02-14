-- CreateTable
CREATE TABLE "likes" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "comment_id" UUID NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "likes_tenant_id_comment_id_idx" ON "likes"("tenant_id", "comment_id");

-- CreateIndex
CREATE INDEX "likes_user_id_idx" ON "likes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "likes_tenant_id_comment_id_user_id_key" ON "likes"("tenant_id", "comment_id", "user_id");

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
