'use client';

/**
 * Placeholder exibido apenas no editor quando uma seção não tem
 * conteúdo para renderizar (ex: FAQ sem perguntas, mapa sem endereço).
 * Na página pública a seção continua oculta.
 */
export function SectionEmptyState({ message }: { message: string }) {
  return (
    <section className="py-12 px-4 bg-site-bg">
      <div className="max-w-3xl mx-auto border-2 border-dashed border-site-primary/30 rounded-xl p-8 text-center">
        <p className="text-site-text-muted text-sm">{message}</p>
        <p className="text-site-text-muted/60 text-xs mt-1">
          Esta seção ficará oculta na página publicada enquanto estiver vazia.
        </p>
      </div>
    </section>
  );
}
