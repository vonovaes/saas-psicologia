'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminLayout } from '@/components/layout/AdminLayout';

type DnsRecord = { type?: string; name?: string; value?: string };

type TenantDomain = {
  id: string;
  domain: string;
  dnsStatus: 'PENDING' | 'VERIFIED' | 'ERROR';
  sslStatus: 'PENDING' | 'ACTIVE' | 'ERROR';
  isPrimary: boolean;
};

function extractDnsRecords(result: any): DnsRecord[] {
  const records =
    result?.dnsRecords ||
    result?.records ||
    result?.domain?.dnsRecords ||
    result?.domain?.records ||
    result?.verification ||
    [];
  return records.map((r: any) => ({
    type: r?.type,
    name: r?.name || r?.domain,
    value: r?.value,
  }));
}

function isVerified(result: any) {
  return result?.verified === true;
}

function StatusBadge({ label, ok }: { label: string; ok: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
        ok ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}
    >
      {label}
    </span>
  );
}

export default function DominiosPage() {
  const router = useRouter();
  const [domain, setDomain] = useState('');
  const [domains, setDomains] = useState<TenantDomain[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listLoading, setListLoading] = useState(true);
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);

  const stopPolling = () => {
    if (pollRef.current) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const loadDomains = useCallback(async () => {
    try {
      const res = await fetch('/api/vercel/domains');
      if (res.status === 401) {
        router.push('/login');
        return;
      }
      const json = await res.json();
      if (res.ok) setDomains(json?.domains || []);
    } catch {
      // silencioso: a lista é best-effort
    } finally {
      setListLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadDomains();
    return stopPolling;
  }, [loadDomains]);

  const verifyDomain = useCallback(
    async (name: string) => {
      try {
        const res = await fetch(`/api/vercel/domains?domain=${encodeURIComponent(name)}`);
        const json = await res.json();
        if (!res.ok) {
          setStatus(`Erro ao verificar: ${json?.error || res.status}`);
          return false;
        }
        setDnsRecords(extractDnsRecords(json?.result));
        if (json?.domain) {
          setDomains((prev) =>
            prev.map((d) => (d.id === json.domain.id ? json.domain : d))
          );
        }
        if (isVerified(json?.result)) {
          setStatus('Domínio verificado e HTTPS ativo.');
          stopPolling();
          return true;
        }
        setStatus('Aguardando verificação DNS.');
        return false;
      } catch (err: any) {
        setStatus(`Erro ao verificar: ${err?.message || String(err)}`);
        return false;
      }
    },
    []
  );

  const startPolling = useCallback(
    (name: string) => {
      stopPolling();
      setSelectedDomain(name);
      pollRef.current = window.setInterval(() => {
        verifyDomain(name);
      }, 8000);
    },
    [verifyDomain]
  );

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setDnsRecords([]);
    try {
      const res = await fetch('/api/vercel/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Erro desconhecido');

      setDnsRecords(extractDnsRecords(json?.result));
      setStatus(
        json?.alreadyExists
          ? 'Este domínio já estava cadastrado. Verificando status...'
          : 'Domínio adicionado. Copie os registros abaixo e adicione no provedor do domínio.'
      );
      setDomain('');
      await loadDomains();
      startPolling(domain.trim().toLowerCase());
    } catch (err: any) {
      setStatus(`Erro: ${err?.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(name: string) {
    if (!window.confirm(`Remover o domínio ${name}?`)) return;
    try {
      const res = await fetch(`/api/vercel/domains?domain=${encodeURIComponent(name)}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Erro desconhecido');
      if (selectedDomain === name) {
        stopPolling();
        setSelectedDomain(null);
        setDnsRecords([]);
      }
      setStatus(`Domínio ${name} removido.`);
      await loadDomains();
    } catch (err: any) {
      setStatus(`Erro ao remover: ${err?.message || String(err)}`);
    }
  }

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setStatus('Copiado para a área de transferência.');
    } catch {
      setStatus('Falha ao copiar.');
    }
  }

  return (
    <AdminLayout
      title="Domínio personalizado"
      subtitle="Aponte seu próprio domínio (ex: seusite.com.br) para sua página"
      breadcrumb={[{ label: 'Domínio' }]}
      maxWidth="lg"
    >
      <form onSubmit={handleAdd} className="space-y-3 max-w-md">
        <label className="block">
          <span className="text-sm">Novo domínio (ex: exemplo.com)</span>
          <input
            className="mt-1 block w-full rounded border px-3 py-2"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="seu-dominio.com"
          />
        </label>

        <button
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
          disabled={loading || !domain}
        >
          {loading ? 'Adicionando...' : 'Adicionar domínio'}
        </button>

        {status && <div className="mt-3 text-sm">{status}</div>}
      </form>

      <section className="mt-8 max-w-2xl">
        <h2 className="text-lg font-medium">Seus domínios</h2>
        {listLoading ? (
          <p className="mt-2 text-sm text-gray-500">Carregando...</p>
        ) : domains.length === 0 ? (
          <p className="mt-2 text-sm text-gray-500">
            Nenhum domínio cadastrado ainda.
          </p>
        ) : (
          <ul className="mt-3 space-y-3">
            {domains.map((d) => (
              <li
                key={d.id}
                className="flex items-center justify-between gap-3 rounded border p-3"
              >
                <div>
                  <div className="font-medium">{d.domain}</div>
                  <div className="mt-1 flex gap-2">
                    <StatusBadge
                      label={`DNS: ${d.dnsStatus}`}
                      ok={d.dnsStatus === 'VERIFIED'}
                    />
                    <StatusBadge
                      label={`SSL: ${d.sslStatus}`}
                      ok={d.sslStatus === 'ACTIVE'}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded bg-gray-200 text-sm"
                    onClick={() => {
                      setSelectedDomain(d.domain);
                      verifyDomain(d.domain);
                    }}
                  >
                    Verificar
                  </button>
                  {d.dnsStatus !== 'VERIFIED' && (
                    <button
                      type="button"
                      className="px-3 py-1.5 rounded bg-gray-200 text-sm"
                      onClick={() => startPolling(d.domain)}
                    >
                      Monitorar
                    </button>
                  )}
                  <button
                    type="button"
                    className="px-3 py-1.5 rounded bg-red-100 text-red-700 text-sm"
                    onClick={() => handleRemove(d.domain)}
                  >
                    Remover
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {dnsRecords.length > 0 && (
        <section className="mt-6 max-w-md">
          <h2 className="text-lg font-medium">
            Registros DNS a configurar{selectedDomain ? ` (${selectedDomain})` : ''}
          </h2>
          <ul className="mt-2 space-y-2 text-sm">
            {dnsRecords.map((r, i) => (
              <li key={i} className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium">
                    {r.type} — {r.name}
                  </div>
                  <div className="text-xs text-gray-600">{r.value}</div>
                </div>
                <div>
                  <button
                    className="ml-2 px-2 py-1 bg-gray-100 rounded"
                    onClick={() => copyToClipboard(`${r.name} ${r.type} ${r.value}`)}
                  >
                    Copiar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-medium">Observações</h2>
        <ol className="list-decimal list-inside mt-2 text-sm">
          <li>
            Se o provedor usar proxy (ex: Cloudflare &quot;orange cloud&quot;), peça para
            desativar o proxy até a verificação.
          </li>
          <li>
            A propagação pode levar alguns minutos até horas — use
            &quot;Monitorar&quot; para verificação automática.
          </li>
        </ol>
      </section>
    </AdminLayout>
  );
}
