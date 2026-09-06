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
        {account?.tenant.slug && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">Sua página pública</p>
            <div className="flex items-center gap-2 mt-1">
              <code className="text-sm text-blue-700 bg-blue-50 px-2 py-1 rounded">
                /p/{account.tenant.slug}
              </code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/p/${account.tenant.slug}`
                  );
                }}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Copiar link
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
