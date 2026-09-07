/**
 * Gera slug URL-safe a partir de um nome.
 * "Dra. João da Silva" → "dra-joao-da-silva"
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // remove acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

/**
 * Gera slug único consultando o banco. Adiciona sufixo numérico
 * se necessário: "joao-silva", "joao-silva-2", ...
 */
export async function generateUniqueSlug(
  name: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  const base = slugify(name) || 'perfil';
  let slug = base;
  let counter = 2;

  while (await exists(slug)) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
}
