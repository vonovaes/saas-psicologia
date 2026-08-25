import { UserRepository, AuditLogRepository } from '../repositories';
import { User, UserRole } from '../lib/prisma-client';

export class UserService {
  private userRepository: UserRepository;
  private auditLogRepository: AuditLogRepository;

  constructor(tenantId: string) {
    this.userRepository = new UserRepository(tenantId);
    this.auditLogRepository = new AuditLogRepository(tenantId);
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async createUser(data: {
    email: string;
    passwordHash: string;
    role?: UserRole;
  }): Promise<User> {
    const user = await this.userRepository.create(data);

    await this.auditLogRepository.create({
      action: 'USER_CREATED',
      resource: 'User',
      userId: user.id,
      metadata: { email: user.email, role: user.role },
    });

    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const user = await this.userRepository.update(id, data);

    await this.auditLogRepository.create({
      action: 'USER_UPDATED',
      resource: 'User',
      userId: id,
      metadata: { changes: data },
    });

    return user;
  }

  async softDeleteUser(id: string): Promise<User> {
    const user = await this.userRepository.softDelete(id);

    await this.auditLogRepository.create({
      action: 'USER_DELETED',
      resource: 'User',
      userId: id,
      metadata: { email: user.email },
    });

    return user;
  }

  async listUsers(): Promise<User[]> {
    return this.userRepository.listAll();
  }

  async validateCredentials(email: string, passwordHash: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;

    if (user.passwordHash !== passwordHash) {
      await this.auditLogRepository.create({
        action: 'LOGIN_FAILED',
        resource: 'User',
        userId: user.id,
        metadata: { reason: 'invalid_password' },
      });
      return null;
    }

    await this.auditLogRepository.create({
      action: 'LOGIN_SUCCESS',
      resource: 'User',
      userId: user.id,
    });

    return user;
  }
}
