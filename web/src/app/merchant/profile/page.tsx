'use client';

import { useState, useEffect } from 'react';

// --- INTERFACES ---
interface OpeningHours {
  [key: string]: { open: string; close: string } | null;
}

interface ProfileData {
  id: number;
  name: string;
  address_line: string;
  phone: string;
  whatsapp: string;
  email: string;
  logo_url?: string;
  store_image_url?: string;
  opening_hours?: OpeningHours;
  description?: string;
}

// --- SKELETON COMPONENT ---
const ProfileSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl shadow-md animate-pulse">
    <div className="h-8 bg-gray-200 rounded-md w-1/3 mb-6"></div>
    <div className="mb-8">
      <div className="h-6 bg-gray-200 rounded-md w-1/4 mb-2"></div>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-full bg-gray-200"></div>
        <div>
          <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
      <div className="h-4 bg-gray-200 rounded-md w-1/2 mt-2"></div>
    </div>
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i}>
          <div className="h-5 w-1/4 bg-gray-200 rounded-md mb-1"></div>
          <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
        </div>
      ))}
      <div className="flex justify-end pt-4">
        <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

// --- MAIN PAGE COMPONENT ---
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
        const res = await fetch('/api/merchant/profile', { cache: 'no-store' });
        if (!res.ok) throw new Error('Failed to load profile');
        const data = await res.json();
        setProfile(data);
      } catch (err: any) {
        setError('No se pudo cargar el perfil. Inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleOpeningHoursChange = (day: string, field: 'open' | 'close', value: string) => {
    setProfile(prev => {
      const openingHours = prev.opening_hours || {};
      const dayHours = openingHours[day];

      if (dayHours === null) {
        return prev; // Day is closed, should not be editable
      }

      const newDayHours = { ...(dayHours || { open: '', close: '' }), [field]: value };
      const newOpeningHours = { ...openingHours, [day]: newDayHours };
      
      return { ...prev, opening_hours: newOpeningHours };
    });
  };

  const handleClosedChange = (day: string, isClosed: boolean) => {
    setProfile(prev => {
      const openingHours = prev.opening_hours || {};
      const newOpeningHours = { ...openingHours };

      if (isClosed) {
        newOpeningHours[day] = null;
      } else {
        newOpeningHours[day] = { open: '09:00', close: '17:00' };
      }

      return { ...prev, opening_hours: newOpeningHours };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const profileToSend = {
        ...profile,
        id: profile.id,
        opening_hours: profile.opening_hours || {},
      };
      const res = await fetch('/api/merchant/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileToSend),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save profile');
      }
      setSuccess('¡Perfil actualizado con éxito!');
    } catch (err: any) {
      setError('No se pudo guardar el perfil. Revisa los datos.');
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
      setProfile(prev => ({ ...prev, logo_url: `${data.logoUrl}?t=${new Date().getTime()}` }));
      setSuccess('¡Logo actualizado con éxito!');
    } catch (err: any) {
      setError('No se pudo subir el logo. Inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  const handleStoreImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.append('store_image', file);
    try {
      const res = await fetch('/api/merchant/upload-store-image', {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Store image upload failed');
      }
      const data = await res.json();
      setProfile(prev => ({ ...prev, store_image_url: `${data.imageUrl}?t=${new Date().getTime()}` }));
      setSuccess('¡Imagen de la tienda actualizada con éxito!');
    } catch (err: any) {
      setError('No se pudo subir la imagen. Inténtalo de nuevo.');
    }
  };

  if (loading) return <ProfileSkeleton />;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h1 className="text-2xl font-bold font-display mb-6">Perfil de la Tienda</h1>
      
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Logo de la Tienda</h2>
        <div className="flex items-center gap-4">
          <img src={profile.logo_url || 'https://via.placeholder.com/100'} alt="Logo actual" className="w-24 h-24 rounded-full border bg-gray-100 object-cover" />
          <div>
            <label htmlFor="logo-upload" className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300">
              Elegir Nuevo Logo
            </label>
            <input id="logo-upload" type="file" name="logo" accept="image/png, image/jpeg, image/webp" onChange={handleLogoUpload} className="hidden" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Formatos aceptados: PNG, JPG, WEBP. Tamaño máx: 2MB.</p>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-2">Foto de la Tienda</h2>
        <div className="flex items-center gap-4">
          <img src={profile.store_image_url || 'https://via.placeholder.com/150x100'} alt="Imagen actual de la tienda" className="w-40 h-28 rounded-lg border bg-gray-100 object-cover" />
          <div>
            <label htmlFor="store-image-upload" className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-300">
              Elegir Nueva Foto
            </label>
            <input id="store-image-upload" type="file" name="store_image" accept="image/png, image/jpeg, image/webp" onChange={handleStoreImageUpload} className="hidden" />
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Esta imagen ayudará a los clientes a reconocer tu tienda. Tamaño máx: 10MB.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="id" value={profile.id || ''} />
        <div>
          <label htmlFor="address_line" className="text-sm font-medium text-gray-700">Dirección <span className="text-red-500">*</span></label>
          <input type="text" name="address_line" id="address_line" value={profile.address_line || ''} onChange={handleInputChange} required className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">Número de Teléfono <span className="text-red-500">*</span></label>
          <input type="tel" name="phone" id="phone" value={profile.phone || ''} onChange={handleInputChange} required className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>
        <div>
          <label htmlFor="email" className="text-sm font-medium text-gray-700">Email de Contacto <span className="text-red-500">*</span></label>
          <input type="email" name="email" id="email" value={profile.email || ''} onChange={handleInputChange} required className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>
        <div>
          <label htmlFor="whatsapp" className="text-sm font-medium text-gray-700">Número de WhatsApp (opcional)</label>
          <input type="tel" name="whatsapp" id="whatsapp" value={profile.whatsapp || ''} onChange={handleInputChange} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium text-gray-700">Descripción de la tienda</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            maxLength={1000}
            value={profile.description || ''}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          />
          <p className="text-xs text-gray-500 mt-1 text-right">{profile.description?.length || 0} / 1000</p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Horario de Apertura</h2>
          <div className="space-y-2">
            {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => {
              const isClosed = !profile.opening_hours || profile.opening_hours[day] === null;
              const dayTranslations: { [key: string]: string } = {
                monday: 'Lunes',
                tuesday: 'Martes',
                wednesday: 'Miércoles',
                thursday: 'Jueves',
                friday: 'Viernes',
                saturday: 'Sábado',
                sunday: 'Domingo'
              };

              return (
                <div key={day} className="grid grid-cols-1 md:grid-cols-4 items-center gap-2 p-2 rounded-lg hover:bg-gray-50">
                  <label htmlFor={`closed-${day}`} className="capitalize text-sm font-medium text-gray-700 select-none">{dayTranslations[day]}</label>
                  <input 
                    type="time" 
                    value={isClosed ? '' : profile.opening_hours?.[day]?.open || ''} 
                    onChange={e => handleOpeningHoursChange(day, 'open', e.target.value)} 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={isClosed}
                  />
                  <input 
                    type="time" 
                    value={isClosed ? '' : profile.opening_hours?.[day]?.close || ''} 
                    onChange={e => handleOpeningHoursChange(day, 'close', e.target.value)} 
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] disabled:bg-gray-100 disabled:cursor-not-allowed"
                    disabled={isClosed}
                  />
                  <div className="flex items-center justify-end">
                    <input
                      type="checkbox"
                      id={`closed-${day}`}
                      checked={isClosed}
                      onChange={e => handleClosedChange(day, e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                    />
                    <label htmlFor={`closed-${day}`} className="ml-2 text-sm text-gray-600 select-none cursor-pointer">Cerrado</label>
                  </div>
                </div>
              )
            })}
          </div>
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
