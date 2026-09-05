'use client';

import { useState, useEffect } from 'react';
import { SiteRenderer } from '@/landing/SiteRenderer';
import { SiteData } from '@/landing/types';
import { TenantThemeData } from '@/landing/themes/tokens';

interface PublicDataResponse extends SiteData {
  theme?: TenantThemeData;
}

export default function TenantLandingPage() {
  const [data, setData] = useState<PublicDataResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const response = await fetch('/api/public/data');
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching public data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0b0c]">
        <div className="text-gray-400">Carregando...</div>
      </div>
    );
  }

  if (!data?.profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0b0c]">
        <div className="text-gray-400">Página não encontrada</div>
      </div>
    );
  }

  return <SiteRenderer data={data} theme={data.theme} />;
}
