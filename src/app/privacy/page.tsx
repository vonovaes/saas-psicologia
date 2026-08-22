import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade da plataforma',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0b0c] text-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-light mb-8">Política de Privacidade</h1>
        
        <div className="space-y-8 text-gray-300 font-light leading-relaxed">
          <section>
            <h2 className="text-2xl font-medium mb-4 text-amber-400">1. Introdução</h2>
            <p>
              Esta Política de Privacidade descreve como coletamos, usamos e protegemos suas informações pessoais ao utilizar nossa plataforma de serviços psicológicos. Estamos comprometidos em proteger sua privacidade e garantir a segurança dos seus dados em conformidade com a Lei Geral de Proteção de Dados (LGPD) - Lei nº 13.709/2018.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-amber-400">2. Informações que Coletamos</h2>
            <p>Coletamos as seguintes informações pessoais:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Dados de Contato:</strong> Nome, telefone, email (quando fornecido)</li>
              <li><strong>Dados de Uso:</strong> Logs de acesso, dados de navegação, IP address</li>
              <li><strong>Dados Profissionais:</strong> Informações sobre sua clínica/consultório (se você for um profissional cadastrado)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-amber-400">3. Como Usamos suas Informações</h2>
            <p>Utilizamos suas informações para:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Processar solicitações de contato e agendamentos</li>
              <li>Fornecer os serviços solicitados</li>
              <li>Melhorar nossos serviços e experiência do usuário</li>
              <li>Comunicar atualizações sobre nossos serviços</li>
              <li>Cumprir obrigações legais e regulatórias</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-amber-400">4. Compartilhamento de Informações</h2>
            <p>
              Não vendemos, alugamos ou compartilham suas informações pessoais com terceiros, exceto nas seguintes situações:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Com seu consentimento explícito</li>
              <li>Para cumprir obrigações legais</li>
              <li>Com provedores de serviços que executam serviços em nosso nome</li>
              <li>Em caso de fusão, aquisição ou venda de ativos</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-amber-400">5. Segurança dos Dados</h2>
            <p>
              Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações pessoais contra acesso não autorizado, alteração, destruição ou perda acidental. Isso inclui:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Criptografia de dados em trânsito e em repouso</li>
              <li>Controle de acesso restrito a informações</li>
              <li>Auditorias regulares de segurança</li>
              <li>Backups regulares dos dados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-amber-400">6. Seus Direitos (LGPD)</h2>
            <p>De acordo com a LGPD, você tem os seguintes direitos:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Confirmação:</strong> Confirmar se seus dados estão sendo processados</li>
              <li><strong>Acesso:</strong> Solicitar acesso aos seus dados pessoais</li>
              <li><strong>Correção:</strong> Solicitar correção de dados incompletos ou incorretos</li>
              <li><strong>Eliminação:</strong> Solicitar a exclusão de seus dados pessoais</li>
              <li><strong>Portabilidade:</strong> Solicitar a transferência de seus dados para outro fornecedor</li>
              <li><strong>Oposição:</strong> Opor-se ao processamento de seus dados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-amber-400">7. Consentimento</h2>
            <p>
              Ao fornecer suas informações através de nossos formulários de contato, você consente expressamente no processamento de seus dados para os fins descritos nesta política. Você pode retirar seu consentimento a qualquer momento entrando em contato conosco.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-amber-400">8. Cookies e Tecnologias Similares</h2>
            <p>
              Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso do site e para fins de marketing. Você pode configurar seu navegador para recusar cookies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-amber-400">9. Menores de Idade</h2>
            <p>
              Nossos serviços não são destinados a menores de 18 anos. Não coletamos intencionalmente informações de menores.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-amber-400">10. Mudanças nesta Política</h2>
            <p>
              Podemos atualizar esta política de privacidade periodicamente. Notificaremos você sobre mudanças significativas através de nosso site ou por email.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-amber-400">11. Contato</h2>
            <p>
              Se você tiver dúvidas sobre esta política de privacidade ou sobre seus dados pessoais, entre em contato conosco através dos canais disponíveis na landing page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-medium mb-4 text-amber-400">12. Data de Vigência</h2>
            <p>
              Esta política entra em vigor a partir de {new Date().toLocaleDateString('pt-BR')} e foi atualizada pela última vez em {new Date().toLocaleDateString('pt-BR')}.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
          <p>Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}
