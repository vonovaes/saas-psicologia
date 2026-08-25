import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'O Acolha é um construtor de sites?',
    answer:
      'Não. O Acolha oferece uma página profissional já estruturada para captação de contatos. Você informa seus dados; a plataforma cuida da publicação.',
  },
  {
    question: 'Consigo usar um domínio próprio?',
    answer:
      'Sim. Cada psicólogo pode conectar um domínio próprio. A configuração de DNS e o certificado HTTPS fazem parte do fluxo da plataforma.',
  },
  {
    question: 'Há CRM, agenda ou blog?',
    answer:
      'Não neste recorte. O foco é presença digital e conversão em contato por WhatsApp ou formulário, sem transformar o dia a dia em gestão de um sistema complexo.',
  },
  {
    question: 'Como as pessoas entram em contato?',
    answer:
      'Pela landing page pública: botão de WhatsApp e, quando habilitado, formulário com consentimento de privacidade. Os envios do formulário ficam registrados para você.',
  },
];

export function AcolhaFaq() {
  return (
    <div className="divide-y divide-acolha-line rounded-2xl border border-acolha-line bg-white">
      {faqs.map((item) => (
        <details key={item.question} className="group px-6 py-1">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-lg font-medium tracking-tight marker:content-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-acolha-accent [&::-webkit-details-marker]:hidden">
            {item.question}
            <ChevronDown
              className="h-5 w-5 shrink-0 text-acolha-accent transition-transform duration-200 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <p className="pb-5 leading-7 text-acolha-body">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
