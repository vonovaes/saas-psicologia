/**
 * Cria (ou promove) um usuário super admin da plataforma.
 *
 * Uso:
 *   npx tsx scripts/create-admin.ts <email> <senha> [nome]
 *
 * Exemplo:
 *   npx tsx scripts/create-admin.ts admin@acolha.com.br "SenhaForte123" "Vinicius"
 *
 * O usuário admin precisa pertencer a um tenant (User.tenantId é obrigatório),
 * então este script garante a existência de um tenant reservado "Acolha"
 * (slug "acolha") e vincula o admin a ele.
 */
import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const PLATFORM_TENANT_SLUG = 'acolha';

async function main() {
  const [email, password, name] = process.argv.slice(2);

  if (!email || !password) {
    console.error('Uso: npx tsx scripts/create-admin.ts <email> <senha> [nome]');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('Senha deve ter no mínimo 8 caracteres.');
    process.exit(1);
  }

  const normalizedEmail = email.toLowerCase().trim();

  // Tenant reservado da plataforma
  const platformTenant = await prisma.tenant.upsert({
    where: { slug: PLATFORM_TENANT_SLUG },
    update: {},
    create: {
      name: 'Acolha',
      slug: PLATFORM_TENANT_SLUG,
      crp: 'N/A',
      contactEmail: normalizedEmail,
      status: 'ACTIVE',
    },
  });

  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findFirst({
    where: { email: normalizedEmail },
  });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: { isSuperAdmin: true, passwordHash, deletedAt: null },
    });
    console.log(`✅ Usuário ${normalizedEmail} promovido a super admin (senha atualizada).`);
  } else {
    await prisma.user.create({
      data: {
        tenantId: platformTenant.id,
        email: normalizedEmail,
        name: name ?? 'Admin',
        passwordHash,
        role: 'OWNER',
        isSuperAdmin: true,
      },
    });
    console.log(`✅ Super admin criado: ${normalizedEmail}`);
  }

  console.log('Acesse /admin após fazer login.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
