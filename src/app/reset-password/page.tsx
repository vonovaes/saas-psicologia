import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { auth } from '@/server/lib/auth';
import ResetPasswordForm from './ResetPasswordForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Redefinir senha — Acolha',
};

export default async function ResetPasswordPage() {
  const session = await auth();
  if (session?.user) {
    redirect('/dashboard');
  }
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}
