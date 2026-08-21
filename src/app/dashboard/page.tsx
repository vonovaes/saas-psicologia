import { auth } from '@/server/lib/auth';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui';
import Link from 'next/link';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Painel Administrativo</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              {session.user.email}
            </span>
            <Link href="/profile">
              <Button variant="secondary" size="sm">
                Editar Perfil
              </Button>
            </Link>
            <form action="/api/auth/signout" method="POST">
              <Button type="submit" variant="danger" size="sm">
                Sair
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
          <p className="mt-2 text-gray-600">Bem-vindo ao painel administrativo</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/profile" className="block">
            <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Editar Perfil</h3>
                <div className="bg-blue-100 p-2 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Atualize suas informações profissionais, especialidades e configurações de contato.
              </p>
            </div>
          </Link>

          <Link href="/faq" className="block">
            <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Gestão de FAQ</h3>
                <div className="bg-green-100 p-2 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.091 0 3.228.835 3.772 2 2.091 0 3.228-.835 3.772-2.091V9c-1.087-.766-2.287-1.322-3.515-1.89V5.356c0-1.673-1.107-3.006-2.573-3.006-1.466 0-2.573 1.333-2.573 3.006v1.754C8.228 6.35 7.028 6.906 5.94 7.672V9c.544 1.255 1.681 2.091 3.772 2.091 2.091 0 3.228-.836 3.772-2.091V9c-1.087.766-2.287 1.322-3.515 1.89v1.754c0 1.673 1.107 3.006 2.573 3.006 1.466 0 2.573-1.333 2.573-3.006v-1.754c1.228-.568 2.428-1.124 3.515-1.89V9c-.544-1.255-1.681-2.091-3.772-2.091z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Gerencie as perguntas e respostas frequentes da sua landing page.
              </p>
            </div>
          </Link>

          <Link href="/leads" className="block">
            <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Leads</h3>
                <div className="bg-purple-100 p-2 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                Visualize e gerencie os leads recebidos através da landing page.
              </p>
            </div>
          </Link>
        </div>

        {/* User Info */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações da Sessão</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-gray-900 font-medium">{session.user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tenant ID</p>
              <p className="text-gray-900 font-medium">{session.user.tenantId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="text-gray-900 font-medium">{session.user.role}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
