import { TenantProfileRepository, AuditLogRepository } from '../repositories';
import { TenantProfile } from '../lib/prisma-client';

export class TenantProfileService {
  private profileRepository: TenantProfileRepository;
  private auditLogRepository: AuditLogRepository;

  constructor(tenantId: string) {
    this.profileRepository = new TenantProfileRepository(tenantId);
    this.auditLogRepository = new AuditLogRepository(tenantId);
  }

  async getProfile(): Promise<TenantProfile | null> {
    return this.profileRepository.findByTenant();
  }

  async createProfile(data: {
    displayName: string;
    specialties: string[];
    city: string;
    description: string;
    address?: string;
    profileImageUrl?: string;
    attendanceType?: string;
  }): Promise<TenantProfile> {
    const profile = await this.profileRepository.create(data);

    await this.auditLogRepository.create({
      action: 'PROFILE_CREATED',
      resource: 'TenantProfile',
      metadata: { displayName: profile.displayName },
    });

    return profile;
  }

  async updateProfile(data: Partial<TenantProfile>): Promise<TenantProfile> {
    const profile = await this.profileRepository.update(data);

    await this.auditLogRepository.create({
      action: 'PROFILE_UPDATED',
      resource: 'TenantProfile',
      metadata: { changes: data },
    });

    return profile;
  }

  async upsertProfile(data: {
    displayName: string;
    specialties: string[];
    city: string;
    description: string;
    address?: string;
    profileImageUrl?: string;
    attendanceType?: string;
  }): Promise<TenantProfile> {
    const existingProfile = await this.getProfile();
    const profile = await this.profileRepository.upsert(data);

    const action = existingProfile ? 'PROFILE_UPDATED' : 'PROFILE_CREATED';

    await this.auditLogRepository.create({
      action,
      resource: 'TenantProfile',
      metadata: { displayName: profile.displayName },
    });

    return profile;
  }
}
