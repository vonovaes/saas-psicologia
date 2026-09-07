'use client';

import { useState, useEffect } from 'react';
import { Button, Input, FieldGroup } from '@/components/ui';
import { AdminLayout } from '@/components/layout/AdminLayout';

interface AccountData {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  tenant: { name: string; slug: string };
}

export default function ProfilePage() {
  const [account, setAccount] = useState<AccountData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugSaving, setSlugSaving] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const response = await fetch('/api/account');
        if (!response.ok) throw new Error('Failed to fetch account');
        const data = await response.json();
        setAccount(data.user);
        setName(data.user.name ?? '');
        setSlug(data.user.tenant?.slug ?? '');
      } catch (error) {
        console.error('Error fetching account:', error);
        setMessage({ type: 'error', text: 'Erro ao carregar dados da conta' });
      } finally {
        setLoading(false);
      }
    };
    fetchAccount();
  }, []);

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error('Failed to update');
      setMessage({ type: 'success', text: 'Nome atualizado com sucesso!' });
    } catch (error) {
      console.error('Error updating name:', error);
      setMessage({ type: 'error', text: 'Erro ao atualizar nome' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem' });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to change password');

      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erro ao alterar senha',
      });
    } finally {
      setSaving(false);
    }
  };

  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${slug}`;

  const handleSaveSlug = async (e: React.FormEvent) => {
    e.preventDefault();
    setSlugSaving(true);
    setMessage(null);
    try {
      const response = await fetch('/api/account', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to update slug');
      setAccount((prev) =>
        prev ? { ...prev, tenant: { ...prev.tenant, slug } } : prev
      );
      setMessage({ type: 'success', text: 'Endereço da página atualizado!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Erro ao atualizar endereço',
      });
    } finally {
      setSlugSaving(false);
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(publicUrl);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Minha página profissional',
          url: publicUrl,
        });
        return;
      } catch {
        // usuário cancelou ou share indisponível → cai no copy
      }
    }
    handleCopyLink();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <AdminLayout
      title="Minha Conta"
      subtitle="Gerencie seus dados de acesso e informações da conta"
      breadcrumb={[{ label: 'Minha Conta' }]}
      maxWidth="lg"
    >
      {message && (
        <div className={`mb-6 p-4 rounded ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Dados da Conta */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Dados da Conta</h3>
        <form onSubmit={handleSaveName} className="space-y-4">
          <FieldGroup>
            <Input
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome"
            />
            <Input
              label="Email"
              value={account?.email ?? ''}
              disabled
              title="O email de acesso não pode ser alterado"
            />
          </FieldGroup>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" loading={saving} disabled={saving}>
              Salvar
            </Button>
          </div>
        </form>
      </div>

      {/* Alterar Senha */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Alterar Senha</h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          <Input
            label="Senha atual"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <FieldGroup>
            <Input
              label="Nova senha"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <Input
              label="Confirmar nova senha"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </FieldGroup>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" loading={saving} disabled={saving}>
              Alterar senha
            </Button>
          </div>
        </form>
      </div>

      {/* Página pública — link editável + compartilhamento */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-1">Sua página pública</h3>
        <p className="text-sm text-gray-500 mb-4">
          Este é o endereço que você pode divulgar para pacientes.
        </p>
        <form onSubmit={handleSaveSlug} className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[220px]">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              Endereço
            </label>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l px-3 py-2">
                /p/
              </span>
              <input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="flex-1 border border-gray-300 rounded-r px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="seu-nome"
              />
            </div>
          </div>
          <Button type="submit" variant="outline" size="sm" loading={slugSaving} disabled={slugSaving}>
            Salvar endereço
          </Button>
        </form>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="px-3 py-2 text-sm rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {linkCopied ? '✓ Copiado!' : 'Copiar link'}
          </button>
          <button
            type="button"
            onClick={handleShare}
            className="px-3 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Compartilhar
          </button>
          <a
            href={`/p/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-sm rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Abrir página ↗
          </a>
        </div>
      </div>

      {/* Informações da Conta */}
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Informações</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Papel</p>
            <p className="text-gray-900 font-medium">{account?.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Conta criada em</p>
            <p className="text-gray-900 font-medium">
              {account?.createdAt
                ? new Date(account.createdAt).toLocaleDateString('pt-BR')
                : '—'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Consultório</p>
            <p className="text-gray-900 font-medium">{account?.tenant.name}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
