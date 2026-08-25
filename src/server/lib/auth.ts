import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { UserService } from '../services/user.service';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const loginSchema = z.object({
  email: z.string().min(1, 'Email é obrigatório').email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: '/login',
  },
  providers: [
    Credentials({
      authorize: async (credentials) => {
        try {
          console.log('=== AUTH: Iniciando autorização ===');
          console.log('Credentials recebidas:', credentials);
          
          // Validar credenciais
          const { email, password } = loginSchema.parse(credentials);
          console.log('Credentials validadas:', { email });

          // Em um sistema multi-tenant, precisamos obter o tenantId
          // No Auth.js v5, não temos acesso direto ao contexto de request
          // Vamos buscar o usuário globalmente e validar o tenant depois
          
          // Buscar usuário por email (global, sem filtro de tenant inicial)
          const { prisma } = await import('../lib/prisma');
          const user = await prisma.user.findFirst({
            where: { email },
            include: { tenant: true },
          });
          
          console.log('Usuário encontrado:', user ? { id: user.id, email: user.email, tenantId: user.tenantId } : null);
          
          if (!user) {
            console.error('User not found:', email);
            return null;
          }

          // Verificar senha usando bcrypt
          const passwordMatch = await bcrypt.compare(password, user.passwordHash);
          console.log('Senha match:', passwordMatch);
          
          if (!passwordMatch) {
            console.error('Invalid password for user:', email);
            return null;
          }

          // Verificar se usuário está ativo (não deletado)
          if (user.deletedAt) {
            console.error('User is deleted:', email);
            return null;
          }

          // Verificar se tenant está ativo
          if (user.tenant.status !== 'ACTIVE' && user.tenant.status !== 'TRIAL') {
            console.error('Tenant is not active:', user.tenant.status);
            return null;
          }

          console.log('=== AUTH: Autorização bem-sucedida ===');
          // Retornar usuário para a sessão
          return {
            id: user.id,
            email: user.email,
            role: user.role,
            tenantId: user.tenantId,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.tenantId = user.tenantId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
        session.user.tenantId = token.tenantId as string;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
  // CSRF protection is enabled by default in Auth.js v5
  // The following options enhance CSRF security
  useSecureCookies: process.env.NODE_ENV === 'production',
});
