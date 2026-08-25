export function getHostname(host: string) {
  return host.split(':')[0].toLowerCase();
}

export function isPlatformHost(host: string) {
  const configuredHosts = (process.env.PLATFORM_HOSTS ?? '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  const hostname = getHostname(host);
  return hostname === 'localhost' || hostname === '127.0.0.1' || configuredHosts.includes(hostname);
}

export function getLoginHref() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (!appUrl) return '/login';

  try {
    return new URL('/login', appUrl).toString();
  } catch {
    return '/login';
  }
}

export function getSalesContactUrl() {
  const url = process.env.NEXT_PUBLIC_SALES_CONTACT_URL?.trim();
  return url || null;
}
