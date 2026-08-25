export default function Suspended() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-yellow-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Conta temporariamente suspensa
        </h1>
        <p className="text-gray-600 mb-6">
          Esta conta está temporariamente suspensa. Entre em contato com o suporte para
          regularizar a situação.
        </p>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>Possíveis motivos:</strong>
            <ul className="list-disc list-inside mt-2 text-left">
              <li>Pagamento em atraso</li>
              <li>Violação dos termos de uso</li>
              <li>Atualização cadastral pendente</li>
            </ul>
          </p>
        </div>
        <a
          href="mailto:suporte@exemplo.com"
          className="inline-block bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Contatar suporte
        </a>
      </div>
    </div>
  );
}
