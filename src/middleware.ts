import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rotas que não precisam de resolução de tenant
const PUBLIC_ROUTES = [
  '/',
  '/privacy',
  '/api/health',
  '/api/public',
  '/api/tenant-resolve',
  '/api/test-tenant-resolution',
  '/api/test-resolve',
  '/api/test-db',
  '/api/debug-tenant',
  '/api/auth',
  '/api/profile',
  '/api/faq',
  '/api/lead',
  '/login',
  '/_next',
  '/favicon.ico',
  '/robots.txt',
];

// Rotas do painel administrativo (precisam de autenticação)
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/faq',
  '/leads',
  '/data-rights',
  '/editor',
  '/onboarding',
  '/api/upload',
  '/api/data-delete',
  '/api/theme',
  '/api/account',
];

function validateHost(host: string): boolean {
  if (!host || typeof host !== 'string') {
    return false;
  }
  
  // Validação básica de formato de host
  const hostRegex = /^[a-zA-Z0-9][a-zA-Z0-9-_.]*[a-zA-Z0-9](:[0-9]+)?$/;
  return hostRegex.test(host);
}

export async function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl;

  // Validar host
  if (!validateHost(host)) {
    return NextResponse.redirect(new URL('/not-found', request.url));
  }

  // Verificar se é rota pública que não precisa de tenant
  if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
    // Para login, tentar resolver tenant para injetar contexto
    if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
      try {
        const resolveUrl = new URL('/api/tenant-resolve', request.url);
        // Normalizar host removendo porta
        const normalizedHost = host.split(':')[0];
        resolveUrl.searchParams.set('host', normalizedHost);
        
        const resolveResponse = await fetch(resolveUrl.toString(), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (resolveResponse.ok) {
          const resolution = await resolveResponse.json();
          const response = NextResponse.next();
          response.headers.set('x-tenant-id', resolution.tenantId);
          response.headers.set('x-tenant-status', resolution.status);
          response.headers.set('x-domain-id', resolution.domainId || '');
          response.headers.set('x-host', host);
          return response;
        }
      } catch (error) {
        console.error('Error resolving tenant for login:', error);
      }
    }
    return NextResponse.next();
  }

  // Verificar se é rota protegida (precisa de autenticação)
  // Não verificamos autenticação no middleware - deixamos para o server component
  // Isso evita problemas com Edge Runtime e Prisma
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    // Adicionar flag para indicar que é rota protegida
    const response = NextResponse.next();
    response.headers.set('x-protected-route', 'true');
    return response;
  }

  // Para rotas públicas que precisam de contexto de tenant (landing pages)
  // Chamar API interna para resolver tenant
  try {
    const resolveUrl = new URL('/api/tenant-resolve', request.url);
    // Normalizar host removendo porta
    const normalizedHost = host.split(':')[0];
    resolveUrl.searchParams.set('host', normalizedHost);
    
    const resolveResponse = await fetch(resolveUrl.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!resolveResponse.ok) {
      if (resolveResponse.status === 404) {
        return NextResponse.redirect(new URL('/not-found', request.url));
      }
      if (resolveResponse.status === 403) {
        return NextResponse.redirect(new URL('/suspended', request.url));
      }
      // Para outros erros, continuar sem contexto
      return NextResponse.next();
    }

    const resolution = await resolveResponse.json();

    // Adicionar tenantId ao contexto da requisição via headers
    const response = NextResponse.next();
    response.headers.set('x-tenant-id', resolution.tenantId);
    response.headers.set('x-tenant-status', resolution.status);
    response.headers.set('x-domain-id', resolution.domainId || '');
    response.headers.set('x-host', host);

    return response;
  } catch (error) {
    console.error('Middleware error:', error);
    // Em caso de erro, continuar sem contexto de tenant (fallback)
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - root path (landing page)
     * - privacy page
     * - api routes that don't need tenant resolution
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!^$|privacy|signup|p/|api/signup|api/health|api/public|api/tenant-resolve|api/test-tenant-resolution|api/test-resolve|api/test-db|api/debug-tenant|api/auth|api/profile|api/faq|api/lead|api/upload|api/data-delete|api/theme|api/account|_next/static|_next/image|favicon.ico).*)',
  ],
};
