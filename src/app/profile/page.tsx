'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input, Textarea, Select, Button, FieldGroup } from '@/components/ui';
import { PreviewWrapper } from '@/components/features/preview/PreviewWrapper';
import { LivePreview } from '@/components/features/preview/LivePreview';
import { usePreviewStateManager } from '@/components/features/preview/PreviewStateManager';
import { useProfile, useFaqs, useTheme } from '@/hooks/useApi';
import { TenantThemeData } from '@/landing/themes/tokens';

interface ProfileData {
  displayName: string;
  specialties: string[];
  city: string;
  description: string;
  address: string;
  attendanceType: 'Presencial' | 'Online' | 'Presencial e Online';
  profileImageUrl: string | null;
}

interface SettingsData {
  whatsappNumber: string;
  instagramHandle: string;
  googleMapsEmbedUrl: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { profile: fetchedProfile, settings: fetchedSettings, loading: profileLoading } = useProfile();
  const { faqs, loading: faqsLoading } = useFaqs();
  const { theme } = useTheme();
  const loading = profileLoading || faqsLoading;

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [profile, setProfile] = useState<ProfileData>({
    displayName: '',
    specialties: [],
    city: '',
    description: '',
    address: '',
    attendanceType: 'Presencial e Online',
    profileImageUrl: null,
  });

  const [settings, setSettings] = useState<SettingsData>({
    whatsappNumber: '',
    instagramHandle: '',
    googleMapsEmbedUrl: '',
  });

  const [specialtyInput, setSpecialtyInput] = useState('');
  const [previewData, setPreviewData] = useState({ profile, settings, faqs });

  const { debouncedUpdate } = usePreviewStateManager({
    onDataChange: (data) => setPreviewData(data),
    debounceMs: 300,
  });

  // Sincroniza estado local quando os dados da API chegam
  useEffect(() => {
    if (fetchedProfile) {
      setProfile({
        ...fetchedProfile,
        attendanceType: fetchedProfile.attendanceType as ProfileData['attendanceType'],
      });
    }
    if (fetchedSettings) {
      setSettings(fetchedSettings);
    }
  }, [fetchedProfile, fetchedSettings]);

  useEffect(() => {
    setPreviewData({ profile, settings, faqs });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [faqs]);

  const addSpecialty = () => {
    if (specialtyInput.trim() && !profile.specialties.includes(specialtyInput.trim())) {
      const updatedProfile = {
        ...profile,
        specialties: [...profile.specialties, specialtyInput.trim()],
      };
      setProfile(updatedProfile);
      setSpecialtyInput('');
      debouncedUpdate({ profile: updatedProfile, settings, faqs });
    }
  };

  const removeSpecialty = (index: number) => {
    const updatedProfile = {
      ...profile,
      specialties: profile.specialties.filter((_, i) => i !== index),
    };
    setProfile(updatedProfile);
    debouncedUpdate({ profile: updatedProfile, settings, faqs });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, settings }),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil' });
    } finally {
      setSaving(false);
    }
  };

  const updateProfileField = (field: keyof typeof profile, value: any) => {
    const updatedProfile = { ...profile, [field]: value };
    setProfile(updatedProfile);
    debouncedUpdate({ profile: updatedProfile, settings, faqs });
  };

  const updateSettingsField = (field: keyof typeof settings, value: any) => {
    const updatedSettings = { ...settings, [field]: value };
    setSettings(updatedSettings);
    debouncedUpdate({ profile, settings: updatedSettings, faqs });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <PreviewWrapper
      title="Editar Perfil"
      preview={<LivePreview profile={previewData.profile} settings={previewData.settings} faqs={previewData.faqs} theme={theme as TenantThemeData | undefined} />}
    >
      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="flex items-center space-x-2 text-sm">
          <button
            onClick={() => router.push('/dashboard')}
            className="text-gray-500 hover:text-gray-700"
          >
            Dashboard
          </button>
          <span className="text-gray-400">/</span>
          <span className="text-gray-900">Editar Perfil</span>
        </nav>
      </div>

      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Editar Perfil</h2>
        <p className="mt-2 text-gray-600">Atualize as informações do seu perfil profissional. As alterações aparecem no preview em tempo real.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded ${
          message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Informações Básicas */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Informações Básicas</h3>
          
          <FieldGroup>
            <Input
              id="displayName"
              label="Nome de Exibição"
              value={profile.displayName}
              onChange={(e) => updateProfileField('displayName', e.target.value)}
              required
            />

            <Input
              id="city"
              label="Cidade"
              value={profile.city}
              onChange={(e) => updateProfileField('city', e.target.value)}
              required
            />

            <Select
              id="attendanceType"
              label="Tipo de Atendimento"
              value={profile.attendanceType}
              onChange={(e) => updateProfileField('attendanceType', e.target.value as any)}
              options={[
                { value: 'Presencial', label: 'Presencial' },
                { value: 'Online', label: 'Online' },
                { value: 'Presencial e Online', label: 'Presencial e Online' },
              ]}
              required
            />
          </FieldGroup>
        </div>

        {/* Especialidades */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Especialidades</h3>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={specialtyInput}
                onChange={(e) => setSpecialtyInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialty())}
                placeholder="Adicionar especialidade"
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addSpecialty}
                variant="primary"
              >
                Adicionar
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {profile.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="inline-flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {specialty}
                  <button
                    type="button"
                    onClick={() => removeSpecialty(index)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Descrição */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Descrição Profissional</h3>
          
          <Textarea
            id="description"
            label="Sobre Você"
            value={profile.description}
            onChange={(e) => updateProfileField('description', e.target.value)}
            rows={6}
            required
          />
        </div>

        {/* Endereço */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Endereço</h3>
          
          <Input
            id="address"
            label="Endereço Completo"
            value={profile.address}
            onChange={(e) => updateProfileField('address', e.target.value)}
          />
        </div>

        {/* Configurações de Contato */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Configurações de Contato</h3>
          
          <FieldGroup>
            <Input
              id="whatsappNumber"
              label="WhatsApp"
              value={settings.whatsappNumber}
              onChange={(e) => updateSettingsField('whatsappNumber', e.target.value)}
              placeholder="+5511999999999"
            />

            <Input
              id="instagramHandle"
              label="Instagram"
              value={settings.instagramHandle}
              onChange={(e) => updateSettingsField('instagramHandle', e.target.value)}
              placeholder="@seuinstagram"
            />

            <Input
              id="googleMapsEmbedUrl"
              label="URL do Google Maps Embed"
              type="url"
              value={settings.googleMapsEmbedUrl}
              onChange={(e) => updateSettingsField('googleMapsEmbedUrl', e.target.value)}
              placeholder="https://maps.google.com/?q=seu+endereco"
            />
          </FieldGroup>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            onClick={() => router.push('/dashboard')}
            variant="outline"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={saving}
            disabled={saving}
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </PreviewWrapper>
  );
}
