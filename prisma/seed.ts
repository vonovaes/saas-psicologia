import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (cuidado em produção!)
  console.log('🧹 Limpando dados existentes...');
  await prisma.auditLog.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenantProfile.deleteMany();
  await prisma.tenantSettings.deleteMany();
  await prisma.domain.deleteMany();
  await prisma.tenant.deleteMany();

  // Criar tenant de teste
  console.log('🏢 Criando tenant de teste...');
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Dr. João Silva',
      crp: '12345/SP',
      contactEmail: 'joao.silva@example.com',
      status: 'TRIAL',
      plan: 'BASIC',
    },
  });

  console.log(`✅ Tenant criado: ${tenant.name} (ID: ${tenant.id})`);

  // Criar domínio de teste
  console.log('🌐 Criando domínio de teste...');
  const domain = await prisma.domain.create({
    data: {
      tenantId: tenant.id,
      domain: 'localhost',
      dnsStatus: 'VERIFIED',
      sslStatus: 'ACTIVE',
      isPrimary: true,
    },
  });

  console.log(`✅ Domínio criado: ${domain.domain} (ID: ${domain.id})`);

  // Criar usuário de teste
  console.log('👤 Criando usuário de teste...');
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const user = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      email: 'admin@psicologos.test',
      passwordHash,
      role: 'OWNER',
    },
  });

  console.log(`✅ Usuário criado: ${user.email} (ID: ${user.id})`);
  console.log(`🔑 Senha de teste: password123`);

  // Criar configurações do tenant
  console.log('⚙️ Criando configurações do tenant...');
  const settings = await prisma.tenantSettings.create({
    data: {
      tenantId: tenant.id,
      whatsappNumber: '+5511999999999',
      instagramHandle: 'dr.joaosilva',
      googleMapsEmbedUrl: 'https://maps.google.com/?q=Av+Paulista+1000,São+Paulo',
    },
  });

  console.log(`✅ Configurações criadas (ID: ${settings.id})`);

  // Criar perfil do tenant
  console.log('📝 Criando perfil do tenant...');
  const profile = await prisma.tenantProfile.create({
    data: {
      tenantId: tenant.id,
      displayName: 'Dr. João Silva',
      specialties: ['Ansiedade', 'Depressão', 'Terapia Cognitivo-Comportamental'],
      city: 'São Paulo',
      description: 'Psicólogo clínico com mais de 10 anos de experiência em terapia cognitivo-comportamental. Especializado em tratamento de ansiedade e depressão, oferecendo um acolhimento seguro e personalizado para cada paciente.',
      address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP',
      attendanceType: 'Presencial e Online',
    },
  });

  console.log(`✅ Perfil criado (ID: ${profile.id})`);

  // Criar FAQs de exemplo
  console.log('❓ Criando FAQs de exemplo...');
  const faqs = await Promise.all([
    prisma.faq.create({
      data: {
        tenantId: tenant.id,
        question: 'Como funciona a primeira consulta?',
        answer: 'A primeira consulta é uma sessão de avaliação onde conhecemos sua história, queixas e objetivos. Dura cerca de 50 minutos e não há compromisso de continuidade.',
        position: 1,
      },
    }),
    prisma.faq.create({
      data: {
        tenantId: tenant.id,
        question: 'Quais são as formas de pagamento?',
        answer: 'Aceitamos pagamento em dinheiro, cartão de crédito, débito e PIX. Também trabalhamos com convênios específicos.',
        position: 2,
      },
    }),
    prisma.faq.create({
      data: {
        tenantId: tenant.id,
        question: 'As sessões são presenciais ou online?',
        answer: 'Ofereço ambas as modalidades. As sessões online são realizadas via videochamada com a mesma qualidade e privacidade das presenciais.',
        position: 3,
      },
    }),
  ]);

  console.log(`✅ ${faqs.length} FAQs criadas`);

  // Criar alguns leads de exemplo
  console.log('📧 Criando leads de exemplo...');
  const leads = await Promise.all([
    prisma.lead.create({
      data: {
        tenantId: tenant.id,
        name: 'Maria Santos',
        phone: '+5511988888888',
        message: 'Gostaria de agendar uma consulta para tratar de ansiedade.',
        source: 'FORMULARIO',
        consentedAt: new Date(),
      },
    }),
    prisma.lead.create({
      data: {
        tenantId: tenant.id,
        name: 'Pedro Oliveira',
        phone: '+5511977777777',
        message: 'Preciso de terapia para depressão. Tem horário disponível?',
        source: 'FORMULARIO',
        consentedAt: new Date(),
      },
    }),
  ]);

  console.log(`✅ ${leads.length} leads criados`);

  console.log('🎉 Seed concluído com sucesso!');
  console.log('\n📋 Dados de acesso:');
  console.log(`   Email: admin@psicologos.test`);
  console.log(`   Senha: password123`);
  console.log(`   Domínio: localhost`);
  console.log(`   Tenant ID: ${tenant.id}`);
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
