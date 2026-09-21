'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface TenantRow {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  status: 'TRIAL' | 'ACTIVE' | 'SUSPENDED';
  plan: string | null;
  createdAt: string;
  leadsCount: number;
  usersCount: number;
  published: boolean;
  domains: { domain: string; dnsStatus: string; sslStatus: string }[];
}

const STATUS_STYLE: Record<TenantRow['status'], string> = {
  TRIAL: 'bg-amber-100 text-amber-800',
  ACTIVE: 'bg-emerald-100 text-emerald-800',
  SUSPENDED: 'bg-red-100 text-red-800',
};

const STATUS_LABEL: Record<TenantRow['status'], string> = {
  TRIAL: 'Teste',
  ACTIVE: 'Ativo',
  SUSPENDED: 'Suspenso',
};

export function TenantsTable({ tenants }: { tenants: TenantRow[] }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(tenant: TenantRow, status: TenantRow['status']) {
    const action = status === 'SUSPENDED' ? 'suspender' : 'reativar';
    if (!confirm(`Confirma ${action} o tenant "${tenant.name}"?`)) return;

    setPending(tenant.id);
    setError(null);
    try {
      const res = await fetch('/api/admin/tenants', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId: tenant.id, status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Erro ${res.status}`);
      }
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao atualizar tenant');
    } finally {
      setPending(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {error && (
        <div className="border-b border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 font-medium">Tenant</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Página</th>
              <th className="px-4 py-3 font-medium">Domínios</th>
              <th className="px-4 py-3 font-medium">Leads</th>
              <th className="px-4 py-3 font-medium">Cadastro</th>
              <th className="px-4 py-3 font-medium text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tenants.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50/60">
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.contactEmail}</p>
                  <p className="font-mono text-xs text-gray-400">/p/{t.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[t.status]}`}
                  >
                    {STATUS_LABEL[t.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {t.published ? (
                    <a
                      href={`/p/${t.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-acolha-accent hover:underline"
                    >
                      Publicada ↗
                    </a>
                  ) : (
                    <span className="text-gray-400">Rascunho</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">
                  {t.domains.length === 0
                    ? '—'
                    : t.domains.map((d) => (
                        <div key={d.domain}>
                          {d.domain}{' '}
                          <span className="text-gray-400">({d.dnsStatus}/{d.sslStatus})</span>
                        </div>
                      ))}
                </td>
                <td className="px-4 py-3 text-gray-700">{t.leadsCount}</td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(t.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3 text-right">
                  {t.status === 'SUSPENDED' ? (
                    <button
                      onClick={() => updateStatus(t, 'ACTIVE')}
                      disabled={pending === t.id}
                      className="rounded-full border border-emerald-200 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-50"
                    >
                      {pending === t.id ? '...' : 'Reativar'}
                    </button>
                  ) : (
                    <button
                      onClick={() => updateStatus(t, 'SUSPENDED')}
                      disabled={pending === t.id}
                      className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      {pending === t.id ? '...' : 'Suspender'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {tenants.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                  Nenhum tenant cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
