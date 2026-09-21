import { redirect } from 'next/navigation';
import { auth } from '@/server/lib/auth';
import ForgotPasswordForm from './ForgotPasswordForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recuperar senha — Acolha',
};

export default async function ForgotPasswordPage() {
  const session = await auth();
  if (session?.user) {
    redirect('/dashboard');
  }
  return <ForgotPasswordForm />;
}
