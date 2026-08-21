import { headers } from 'next/headers';

export class TenantContext {
  static async getTenantId(): Promise<string | null> {
    try {
      const headersList = await headers();
      return headersList.get('x-tenant-id');
    } catch (error) {
      // Em contextos onde headers não estão disponíveis (ex: server components diretos)
      return null;
    }
  }

  static async getTenantStatus(): Promise<string | null> {
    try {
      const headersList = await headers();
      return headersList.get('x-tenant-status');
    } catch (error) {
      return null;
    }
  }

  static async getDomainId(): Promise<string | null> {
    try {
      const headersList = await headers();
      return headersList.get('x-domain-id');
    } catch (error) {
      return null;
    }
  }

  static async requireTenantId(): Promise<string> {
    const tenantId = await this.getTenantId();
    if (!tenantId) {
      throw new Error('Tenant context not found - middleware may not be properly configured');
    }
    return tenantId;
  }

  static async isTenantActive(): Promise<boolean> {
    const status = await this.getTenantStatus();
    return status === 'ACTIVE' || status === 'TRIAL';
  }

  static async isTenantSuspended(): Promise<boolean> {
    const status = await this.getTenantStatus();
    return status === 'SUSPENDED';
  }
}
