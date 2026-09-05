import { redirect } from 'next/navigation';
import { auth } from '@/server/lib/auth';
import LoginForm from './LoginForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entrar — Acolha',
};

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) {
    redirect('/dashboard');
  }
  return <LoginForm />;
}
