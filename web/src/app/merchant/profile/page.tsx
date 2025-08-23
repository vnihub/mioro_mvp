'use client';

import { useState, useEffect } from 'react';

interface ProfileData {
  id: number; // Changed from shop_id to id
  name: string;
  address_line: string;
  phone: string;
  whatsapp: string;
  logo_url?: string;
}

export default function MerchantProfilePage() {
  const [profile, setProfile] = useState<Partial<ProfileData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/merchant/profile');
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        setProfile(data); // Data already contains 'id'
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch('/api/merchant/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save profile');
      }
      setSuccess('¡Perfil actualizado con éxito!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.append('logo', file);
    try {
      const res = await fetch('/api/merchant/upload-logo', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Logo upload failed');
      }
      const data = await res.json();
      setProfile(prev => ({ ...prev, logo_url: data.logoUrl }));
      setSuccess('¡Logo actualizado con éxito!');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Cargando perfil...</p>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold font-display mb-6">Perfil de la Tienda</h1>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Logo de la Tienda</h2>
        <div className="flex items-center gap-4">
          <img src={profile.logo_url || 'https://via.placeholder.com/100'} alt="Current logo" className="w-24 h-24 rounded-full border bg-gray-100 object-cover" />
          <div>
            <label htmlFor="logo-upload" className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300">
              Elegir Nuevo Logo
            </label>
            <input id="logo-upload" type="file" name="logo" accept="image/png, image/jpeg, image/webp" onChange={handleLogoUpload} className="hidden" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Formatos aceptados: PNG, JPG, WEBP. Tamaño máx: 2MB.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="address_line" className="text-sm font-medium text-gray-700">Dirección <span className="text-red-500">*</span></label>
          <input type="text" name="address_line" id="address_line" value={profile.address_line || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">Número de Teléfono <span className="text-red-500">*</span></label>
          <input type="tel" name="phone" id="phone" value={profile.phone || ''} onChange={handleInputChange} pattern="^(?:\+34)?[6789]\d{8}$" title="Por favor, introduce un número de teléfono español válido de 9 dígitos (ej. 612345678 o +34612345678)" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>
        <div>
          <label htmlFor="whatsapp" className="text-sm font-medium text-gray-700">Número de WhatsApp (opcional)</label>
          <input type="tel" name="whatsapp" id="whatsapp" value={profile.whatsapp || ''} onChange={handleInputChange} pattern="^(?:\+34)?[6789]\d{8}$" title="Por favor, introduce un número de WhatsApp español válido de 9 dígitos (ej. 612345678 o +34612345678)" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>
        <div className="flex items-center justify-end gap-4 pt-4">
          {error && <p className="text-sm text-red-500">Error: {error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}
          <button type="submit" disabled={saving} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] font-semibold disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar Perfil'}
          </button>
        </div>
      </form>
    </div>
  );
}
