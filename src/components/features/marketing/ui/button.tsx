import Link from 'next/link';
import { cn } from '@/lib/cn';

const variants = {
  primary:
    'bg-acolha-accent text-white hover:bg-acolha-accent-hover focus-visible:outline-acolha-accent',
  secondary:
    'border border-acolha-line bg-white/80 text-acolha-accent hover:bg-white focus-visible:outline-acolha-accent',
  ghost:
    'text-acolha-muted hover:text-acolha-ink focus-visible:outline-acolha-accent',
  inverse:
    'bg-white text-acolha-accent hover:bg-acolha-mist focus-visible:outline-white',
} as const;

const sizes = {
  sm: 'min-h-11 px-4 py-2 text-sm',
  md: 'min-h-11 px-5 py-2.5 text-sm',
  lg: 'min-h-12 px-6 py-3.5 text-sm',
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60';

function isInternalHref(href: string) {
  return href.startsWith('/') || href.startsWith('#');
}

type MarketingButtonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
  href?: string;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'className' | 'children' | 'type'> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className' | 'children' | 'href' | 'type'> & {
    type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  };

export function MarketingButton({
  variant = 'primary',
  size = 'md',
  className,
  children,
  href,
  type = 'button',
  ...props
}: MarketingButtonProps) {
  const classes = cn(baseClass, variants[variant], sizes[size], className);

  if (href) {
    if (isInternalHref(href)) {
      return (
        <Link href={href} className={classes} {...props}>
          {children}
        </Link>
      );
    }

    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
