-- CreateTable
CREATE TABLE "TenantTheme" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "templateId" TEXT NOT NULL DEFAULT 'noite',
    "tokens" JSONB NOT NULL DEFAULT '{}',
    "sections" JSONB NOT NULL DEFAULT '[]',
    "draft" JSONB,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TenantTheme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TenantTheme_tenantId_key" ON "TenantTheme"("tenantId");

-- AddForeignKey
ALTER TABLE "TenantTheme" ADD CONSTRAINT "TenantTheme_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
