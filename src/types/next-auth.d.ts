import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      role: string;
      tenantId: string;
      isSuperAdmin: boolean;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    role: string;
    tenantId: string;
    isSuperAdmin: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    role: string;
    tenantId: string;
    isSuperAdmin: boolean;
  }
}
