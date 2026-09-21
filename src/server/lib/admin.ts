import { auth } from './auth';

/**
 * Retorna a sessão se o usuário for super admin da plataforma, null caso contrário.
 * Usar em rotas /api/admin/* e páginas /admin/*.
 */
export async function requireSuperAdmin() {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) return null;
  return session;
}
