import { MarketingButton } from '@/components/features/marketing/ui/button';

type KnowAcolhaCtaProps = {
  salesContactUrl: string | null;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'inverse';
  describedBy?: string;
  onClick?: () => void;
};

export function KnowAcolhaCta({
  salesContactUrl,
  size = 'lg',
  variant = 'primary',
  describedBy = 'acolha-cta-note',
  onClick,
}: KnowAcolhaCtaProps) {
  const label = 'Quero conhecer o Acolha';

  if (salesContactUrl) {
    return (
      <MarketingButton href={salesContactUrl} size={size} variant={variant} onClick={onClick}>
        {label}
      </MarketingButton>
    );
  }

  return (
    <MarketingButton href="/signup" size={size} variant={variant} aria-describedby={describedBy} onClick={onClick}>
      {label}
    </MarketingButton>
  );
}
