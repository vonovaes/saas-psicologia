import { auth } from '@/server/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-900">Painel Administrativo</h1>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">
                {session.user.email}
              </span>
              <form action="/api/auth/signout" method="POST">
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                >
                  Sair
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Bem-vindo ao Painel!
              </h2>
              <p className="text-gray-600 mb-4">
                Tenant ID: {session.user.tenantId}
              </p>
              <p className="text-gray-600 mb-4">
                Role: {session.user.role}
              </p>
              <p className="text-sm text-gray-500">
                O painel administrativo está em desenvolvimento.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
