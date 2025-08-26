'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [shopName, setShopName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== passwordConfirmation) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shopName, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Registration failed');
      }
      router.push('/merchant/profile');
    } catch (err: any) {
      setError(err.message || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center font-display">Crear Cuenta de Comerciante</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="shopName" className="text-sm font-medium text-gray-700">Nombre de la tienda</label>
            <div className="mt-1">
              <input id="shopName" name="shopName" type="text" required value={shopName} onChange={(e) => setShopName(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Dirección de email</label>
            <div className="mt-1">
              <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña</label>
            <div className="mt-1">
              <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            </div>
          </div>
          <div>
            <label htmlFor="passwordConfirmation" className="text-sm font-medium text-gray-700">Confirmar Contraseña</label>
            <div className="mt-1">
              <input id="passwordConfirmation" name="passwordConfirmation" type="password" required value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
            </div>
          </div>
          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          <div>
            <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50">
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </div>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)]">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
