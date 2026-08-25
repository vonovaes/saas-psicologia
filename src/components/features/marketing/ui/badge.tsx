import { cn } from '@/lib/cn';

export function Badge({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full bg-acolha-mist px-3 py-1 text-xs font-medium tracking-[0.14em] text-acolha-accent uppercase',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
