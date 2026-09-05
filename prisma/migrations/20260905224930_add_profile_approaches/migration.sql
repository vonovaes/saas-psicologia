-- AlterTable
ALTER TABLE "TenantProfile" ADD COLUMN     "approaches" TEXT[] DEFAULT ARRAY[]::TEXT[];
