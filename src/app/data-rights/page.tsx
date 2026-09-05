'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Textarea } from '@/components/ui';
import { AdminLayout } from '@/components/layout/AdminLayout';

export default function DataRightsPage() {
  const router = useRouter();
  const [requestType, setRequestType] = useState<'delete' | 'export' | 'access'>('delete');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/data-rights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestType,
          message,
        }),
      });

      if (!response.ok) throw new Error('Failed to submit request');

      setSubmitted(true);
      setMessage('');
    } catch (error) {
      console.error('Error submitting request:', error);
      setSubmitError('Erro ao enviar solicitação. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout
      title="Direitos de Dados (LGPD)"
      subtitle="Exerça seus direitos conforme a Lei Geral de Proteção de Dados"
      breadcrumb={[{ label: 'Direitos de Dados' }]}
      maxWidth="lg"
    >
      {submitted ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <h3 className="text-xl font-semibold text-green-800 mb-2">Solicitação Enviada!</h3>
          <p className="text-green-700">
            Entraremos em contato em até 15 dias úteis com uma resposta.
          </p>
          <Button
            onClick={() => setSubmitted(false)}
            variant="outline"
            className="mt-6"
          >
            Fazer outra solicitação
          </Button>
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {submitError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {submitError}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Solicitação
              </label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value as any)}
                className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="delete">Solicitar Exclusão de Dados</option>
                <option value="export">Solicitar Exportação de Dados</option>
                <option value="access">Solicitar Acesso aos Dados</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem (opcional)
              </label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Descreva sua solicitação com mais detalhes..."
                rows={4}
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Ao solicitar a exclusão de dados, você será desconectado e seus dados serão anonimizados conforme a LGPD. Esta ação não pode ser desfeita.
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                onClick={() => router.push('/dashboard')}
                variant="outline"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Solicitação'}
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Adicionais</h3>
        <ul className="space-y-2 text-gray-600 text-sm">
          <li>• Responderemos dentro de 15 dias úteis</li>
          <li>• Para exclusão, dados serão anonimizados em até 30 dias</li>
          <li>• Exportação será fornecida em formato legível</li>
          <li>• Acesso é fornecido visualmente no painel administrativo</li>
          <li>• Para dúvidas, consulte nossa política de privacidade</li>
        </ul>
      </div>
    </AdminLayout>
  );
}
