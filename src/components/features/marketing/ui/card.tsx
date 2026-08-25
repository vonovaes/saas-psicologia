import { cn } from '@/lib/cn';

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <article
      className={cn(
        'rounded-2xl border border-acolha-line bg-white p-7 shadow-[0_16px_40px_-32px_rgba(24,49,43,0.35)]',
        className,
      )}
      {...props}
    >
      {children}
    </article>
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-xl font-semibold tracking-tight', className)} {...props} />;
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('mt-3 leading-7 text-acolha-body', className)} {...props} />;
}
