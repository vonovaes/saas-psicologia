'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

const TOUR_SEEN_KEY = 'acolha-editor-tour-seen';

/**
 * Tour guiado do editor (driver.js). Roda uma única vez quando a página
 * é aberta com ?tour=1 — usado no fim do onboarding para ensinar o
 * fluxo editar → publicar. Marca localStorage para não repetir.
 */
export function EditorTour() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('tour') !== '1') return;
    if (localStorage.getItem(TOUR_SEEN_KEY)) return;

    // Aguarda o preview renderizar antes de destacar os elementos
    const timeout = setTimeout(() => {
      const tour = driver({
        showProgress: true,
        allowClose: true,
        overlayOpacity: 0.55,
        nextBtnText: 'Próximo →',
        prevBtnText: '← Voltar',
        doneBtnText: 'Começar a editar',
        progressText: '{{current}} de {{total}}',
        onDestroyed: () => {
          localStorage.setItem(TOUR_SEEN_KEY, '1');
        },
        steps: [
          {
            element: '[data-tour="preview"]',
            popover: {
              title: 'Sua página está aqui',
              description:
                'Clique em qualquer texto ou foto para editar diretamente na página.',
            },
          },
          {
            element: '[data-tour="sections"]',
            popover: {
              title: 'Organize os blocos',
              description:
                'Reordene, oculte ou adicione seções da sua página.',
            },
          },
          {
            element: '[data-tour="personalize"]',
            popover: {
              title: 'Cores e identidade',
              description:
                'Troque cores, fontes e o template inteiro quando quiser.',
            },
          },
          {
            element: '[data-tour="publish"]',
            popover: {
              title: 'Publique quando estiver pronto',
              description:
                'Nada vai ao ar sem você clicar aqui. Explore à vontade.',
            },
          },
        ],
      });
      tour.drive();
    }, 600);

    return () => clearTimeout(timeout);
  }, []);

  return null;
}
