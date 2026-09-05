import { ReactNode } from 'react';
import { ThemeTokens, tokensToCssVars, DEFAULT_TOKENS } from './tokens';

interface ThemeProviderProps {
  tokens?: ThemeTokens;
  children: ReactNode;
}

/**
 * Injeta os design tokens do tema como CSS variables no escopo
 * .tenant-site. O tema inteiro da landing muda trocando apenas
 * essas variáveis — sem reescrever classes.
 */
export function ThemeProvider({ tokens = DEFAULT_TOKENS, children }: ThemeProviderProps) {
  const cssVars = tokensToCssVars(tokens) as React.CSSProperties;

  return (
    <div className="tenant-site" style={cssVars}>
      {children}
    </div>
  );
}
