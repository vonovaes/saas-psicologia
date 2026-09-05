'use client';

import { useState } from 'react';
import { Button, Input } from '@/components/ui';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useLeads } from '@/hooks/useApi';

export default function LeadsPage() {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { leads, loading, refetch } = useLeads({ startDate, endDate });
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = async () => {
    try {
      setExporting(true);
      
      // Create CSV content
      const headers = ['Nome', 'Telefone', 'Mensagem', 'Origem', 'Data de Criação'];
      const rows = leads.map(lead => [
        lead.name,
        lead.phone,
        lead.message || '',
        lead.source,
        new Date(lead.createdAt).toLocaleString('pt-BR'),
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `leads-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const handleDeleteLead = async (leadId: string) => {
    if (window.prompt('Digite DELETE_LEAD para anonimizar este lead.') !== 'DELETE_LEAD') return;
    const response = await fetch('/api/data-delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'lead', leadId, confirmation: 'DELETE_LEAD' }),
    });
    if (!response.ok) {
      window.alert('Não foi possível anonimizar o lead.');
      return;
    }
    await refetch();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <AdminLayout
      title="Leads"
      subtitle="Visualize e gerencie os leads recebidos através da landing page"
      breadcrumb={[{ label: 'Leads' }]}
      actions={
        <Button
          onClick={handleExportCSV}
          variant="secondary"
          loading={exporting}
          disabled={leads.length === 0}
        >
          {exporting ? 'Exportando...' : 'Exportar CSV'}
        </Button>
      }
    >
      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Inicial
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Final
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="flex items-end">
            <Button
              onClick={handleClearFilters}
              variant="outline"
              className="w-full"
            >
              Limpar Filtros
            </Button>
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <p>Carregando leads...</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">Nenhum lead encontrado</p>
            <p className="text-sm mt-2">
              {startDate || endDate ? 'Tente ajustar os filtros' : 'Os leads aparecerão aqui quando forem recebidos'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Telefone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mensagem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Origem
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data de Criação
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{lead.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {lead.message || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {lead.source}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{formatDate(lead.createdAt)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button variant="danger" size="sm" onClick={() => handleDeleteLead(lead.id)}>Anonimizar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Total de Leads</p>
          <p className="text-3xl font-bold text-gray-900">{leads.length}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Origem: Formulário</p>
          <p className="text-3xl font-bold text-gray-900">
            {leads.filter(l => l.source === 'FORMULARIO').length}
          </p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-sm text-gray-500">Leads Hoje</p>
          <p className="text-3xl font-bold text-gray-900">
            {leads.filter(l => {
              const today = new Date().toDateString();
              return new Date(l.createdAt).toDateString() === today;
            }).length}
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
