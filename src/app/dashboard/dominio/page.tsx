'use client';

import { useEffect, useRef, useState } from 'react';

type DnsRecord = { type?: string; name?: string; value?: string };

function extractDnsRecords(result: any): DnsRecord[] {
  return (
    result?.dnsRecords ||
    result?.records ||
    result?.domain?.dnsRecords ||
    result?.domain?.records ||
    []
  ).map((r: any) => ({ type: r?.type, name: r?.name, value: r?.value }));
}

function isVerified(result: any) {
  return (
    result?.verified === true ||
    result?.state === 'READY' ||
    result?.status === 'VERIFIED' ||
    result?.domain?.verified === true
  );
}

export default function DominiosPage() {
  const [domain, setDomain] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>([]);
  const [domainStatus, setDomainStatus] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    };
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    setDnsRecords([]);
    setDomainStatus(null);
    try {
      const res = await fetch('/api/vercel/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Erro desconhecido');

      const result = json?.result;
      const records = extractDnsRecords(result);
      setDnsRecords(records);
      setStatus('Domínio adicionado. Copie os registros abaixo e adicione no provedor do domínio.');

      // start polling
      startPolling();
    } catch (err: any) {
      setStatus(`Erro: ${err?.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  }

  function startPolling() {
    if (pollRef.current) window.clearInterval(pollRef.current);
    pollRef.current = window.setInterval(async () => {
      try {
        const res = await fetch(`/api/vercel/domains?domain=${encodeURIComponent(domain)}`);
        const json = await res.json();
        if (!res.ok) {
          setStatus(`Erro ao verificar: ${json?.error || res.status}`);
          return;
        }
        const result = json?.result;
        setDnsRecords(extractDnsRecords(result));
        if (isVerified(result)) {
          setDomainStatus('VERIFIED');
          setStatus('Domínio verificado e HTTPS ativo.');
          if (pollRef.current) {
            window.clearInterval(pollRef.current);
            pollRef.current = null;
          }
        } else {
          setDomainStatus('PENDING');
          setStatus('Aguardando verificação DNS.');
        }
      } catch (err: any) {
        setStatus(`Erro polling: ${err?.message || String(err)}`);
      }
    }, 8000);
  }

  async function manualCheck() {
    if (pollRef.current) window.clearInterval(pollRef.current);
    startPolling();
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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Domínios personalizados</h1>
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

        <div className="flex gap-2">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
            disabled={loading || !domain}
          >
            {loading ? 'Adicionando...' : 'Adicionar domínio'}
          </button>

          <button
            type="button"
            onClick={manualCheck}
            className="px-4 py-2 rounded bg-gray-200"
            disabled={!domain}
          >
            Verificar agora
          </button>
        </div>

        {status && <div className="mt-3 text-sm">{status}</div>}
        {domainStatus && <div className="mt-1 text-sm">Status: {domainStatus}</div>}
      </form>

      {dnsRecords.length > 0 && (
        <section className="mt-6 max-w-md">
          <h2 className="text-lg font-medium">Registros DNS a configurar</h2>
          <ul className="mt-2 space-y-2 text-sm">
            {dnsRecords.map((r, i) => (
              <li key={i} className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-medium">{r.type} — {r.name}</div>
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
          <li>Se o provedor usar proxy (ex: Cloudflare "orange cloud"), peça para desativar o proxy até a verificação.</li>
          <li>A propagação pode levar alguns minutos até horas — mantenha esta página aberta para polling automático.</li>
        </ol>
      </section>
    </div>
  );
}
