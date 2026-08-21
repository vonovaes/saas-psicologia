'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { Button, Input, Textarea } from '@/components/ui';

interface Faq {
  id: string;
  question: string;
  answer: string;
  position: number;
}

export default function FaqPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);
  const [formData, setFormData] = useState({ question: '', answer: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const response = await fetch('/api/faq');
      if (!response.ok) throw new Error('Failed to fetch FAQs');
      
      const data = await response.json();
      setFaqs(data.faqs || []);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar FAQs' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingFaq(null);
    setFormData({ question: '', answer: '' });
    setShowModal(true);
  };

  const handleEdit = (faq: Faq) => {
    setEditingFaq(faq);
    setFormData({ question: faq.question, answer: faq.answer });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta FAQ?')) return;

    try {
      const response = await fetch(`/api/faq?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete FAQ');

      setMessage({ type: 'success', text: 'FAQ excluída com sucesso!' });
      fetchFaqs();
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      setMessage({ type: 'error', text: 'Erro ao excluir FAQ' });
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return;

    const newFaqs = [...faqs];
    const temp = newFaqs[index];
    newFaqs[index] = newFaqs[index - 1];
    newFaqs[index - 1] = temp;

    await reorderFaqs(newFaqs);
  };

  const handleMoveDown = async (index: number) => {
    if (index === faqs.length - 1) return;

    const newFaqs = [...faqs];
    const temp = newFaqs[index];
    newFaqs[index] = newFaqs[index + 1];
    newFaqs[index + 1] = temp;

    await reorderFaqs(newFaqs);
  };

  const reorderFaqs = async (newFaqs: Faq[]) => {
    try {
      const updates = newFaqs.map((faq, index) => ({
        id: faq.id,
        position: index + 1,
      }));

      const response = await fetch('/api/faq', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reorder: true, updates }),
      });

      if (!response.ok) throw new Error('Failed to reorder FAQs');

      setFaqs(newFaqs);
    } catch (error) {
      console.error('Error reordering FAQs:', error);
      setMessage({ type: 'error', text: 'Erro ao reordenar FAQs' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const url = editingFaq ? '/api/faq' : '/api/faq';
      const method = editingFaq ? 'PUT' : 'POST';
      const body = editingFaq ? { ...formData, id: editingFaq.id } : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error('Failed to save FAQ');

      setMessage({ type: 'success', text: editingFaq ? 'FAQ atualizada com sucesso!' : 'FAQ criada com sucesso!' });
      setShowModal(false);
      fetchFaqs();
    } catch (error) {
      console.error('Error saving FAQ:', error);
      setMessage({ type: 'error', text: 'Erro ao salvar FAQ' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="text-gray-600 hover:text-gray-900"
            >
              Dashboard
            </button>
            <Button
              onClick={handleLogout}
              variant="danger"
              size="sm"
            >
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center space-x-2 text-sm">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-500 hover:text-gray-700"
          >
            Dashboard
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Gestão de FAQ</span>
        </nav>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Gestão de FAQ</h2>
            <p className="mt-2 text-gray-600">Gerencie as perguntas e respostas frequentes da sua landing page</p>
          </div>
          <Button onClick={handleCreate} variant="primary">
            Adicionar FAQ
          </Button>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* FAQ List */}
        <div className="bg-white shadow rounded-lg">
          {faqs.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-lg">Nenhuma FAQ cadastrada</p>
              <p className="text-sm mt-2">Clique em "Adicionar FAQ" para começar</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {faqs.map((faq, index) => (
                <div key={faq.id} className="p-6 flex items-start gap-4">
                  <div className="flex flex-col gap-1 pt-2">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === faqs.length - 1}
                      className="text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ↓
                    </button>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{faq.question}</h3>
                    <p className="mt-2 text-gray-600">{faq.answer}</p>
                    <p className="mt-1 text-xs text-gray-400">Posição: {faq.position}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(faq)}
                      variant="secondary"
                      size="sm"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDelete(faq.id)}
                      variant="danger"
                      size="sm"
                    >
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Section */}
        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Preview da Landing Page</h3>
          <div className="bg-gray-50 rounded-lg p-6">
            {faqs.length === 0 ? (
              <p className="text-gray-500 text-center">As FAQs aparecerão aqui na sua landing page</p>
            ) : (
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <h4 className="font-medium text-gray-900">{faq.question}</h4>
                    <p className="mt-2 text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {editingFaq ? 'Editar FAQ' : 'Nova FAQ'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <Input
                label="Pergunta"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="Ex: Como funciona a primeira consulta?"
                required
              />

              <Textarea
                label="Resposta"
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                rows={4}
                placeholder="Forneça uma resposta clara e informativa"
                required
              />

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  variant="outline"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  loading={saving}
                  disabled={saving}
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
