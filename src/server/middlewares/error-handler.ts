export class TenantResolutionError extends Error {
  constructor(
    message: string,
    public code: 'DOMAIN_NOT_FOUND' | 'TENANT_SUSPENDED' | 'TENANT_NOT_FOUND' | 'INVALID_HOST'
  ) {
    super(message);
    this.name = 'TenantResolutionError';
  }
}

export class TenantContextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TenantContextError';
  }
}

export function handleTenantError(error: unknown): Response {
  if (error instanceof TenantResolutionError) {
    switch (error.code) {
      case 'DOMAIN_NOT_FOUND':
        return new Response(
          JSON.stringify({ error: 'Domain not found', message: error.message }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      case 'TENANT_SUSPENDED':
        return new Response(
          JSON.stringify({ error: 'Tenant suspended', message: error.message }),
          { status: 403, headers: { 'Content-Type': 'application/json' } }
        );
      case 'TENANT_NOT_FOUND':
        return new Response(
          JSON.stringify({ error: 'Tenant not found', message: error.message }),
          { status: 404, headers: { 'Content-Type': 'application/json' } }
        );
      case 'INVALID_HOST':
        return new Response(
          JSON.stringify({ error: 'Invalid host', message: error.message }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      default:
        return new Response(
          JSON.stringify({ error: 'Unknown error', message: error.message }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
  }

  if (error instanceof TenantContextError) {
    return new Response(
      JSON.stringify({ error: 'Tenant context error', message: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Erros genéricos
  return new Response(
    JSON.stringify({ error: 'Internal server error', message: 'An unexpected error occurred' }),
    { status: 500, headers: { 'Content-Type': 'application/json' } }
  );
}
