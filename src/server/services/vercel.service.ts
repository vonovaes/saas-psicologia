/**
 * Serviço mínimo para integrar com a Vercel Domains API
 * Usa VERCEL_TOKEN (env) para autenticar.
 * Implementa métodos simples: addDomain, getDomain, listDomains.
 */

const VERCEL_API = 'https://api.vercel.com';

function getAuthHeaders() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) throw new Error('Missing VERCEL_TOKEN env var');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export class VercelService {
  async addDomain(projectId: string, domain: string) {
    const res = await fetch(`${VERCEL_API}/v10/projects/${projectId}/domains`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name: domain }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Vercel addDomain failed: ${res.status} ${text}`);
    }

    return res.json();
  }

  async getDomain(projectId: string, domain: string) {
    const res = await fetch(`${VERCEL_API}/v10/projects/${projectId}/domains/${encodeURIComponent(domain)}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Vercel getDomain failed: ${res.status} ${text}`);
    }

    return res.json();
  }

  async listDomains(projectId: string) {
    const res = await fetch(`${VERCEL_API}/v10/projects/${projectId}/domains`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Vercel listDomains failed: ${res.status} ${text}`);
    }

    return res.json();
  }
}

export const vercelService = new VercelService();
