'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

// --- Login Form Component ---
const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('test@merchant.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Login failed');
      }
      router.push('/merchant/profile'); // Redirect to profile page
    } catch (err: any) {
      setError('Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="email-login" className="text-sm font-medium text-gray-700">Dirección de email</label>
        <div className="mt-1">
          <input id="email-login" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>
      </div>
      <div>
        <label htmlFor="password-login" className="text-sm font-medium text-gray-700">Contraseña</label>
        <div className="mt-1">
          <input id="password-login" name="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>
      </div>
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      <div>
        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50">
          {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
        </button>
      </div>
    </form>
  );
};

// --- Registration Form Component ---
const RegisterForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    legal_name: '',
    display_name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Registration failed');
      }
      router.push('/merchant/profile'); // Redirect to profile on success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="legal_name" className="text-sm font-medium text-gray-700">Nombre Legal del Negocio</label>
        <div className="mt-1">
          <input id="legal_name" name="legal_name" type="text" required value={formData.legal_name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>
      </div>
      <div>
        <label htmlFor="display_name" className="text-sm font-medium text-gray-700">Nombre a Mostrar (de la tienda)</label>
        <div className="mt-1">
          <input id="display_name" name="display_name" type="text" required value={formData.display_name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>
      </div>
      <div>
        <label htmlFor="email-register" className="text-sm font-medium text-gray-700">Dirección de email</label>
        <div className="mt-1">
          <input id="email-register" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>
      </div>
      <div>
        <label htmlFor="password-register" className="text-sm font-medium text-gray-700">Contraseña</label>
        <div className="mt-1">
          <input id="password-register" name="password" type="password" autoComplete="new-password" required value={formData.password} onChange={handleChange} className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
        </div>
      </div>
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
      <div>
        <button type="submit" disabled={loading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-primary)] disabled:opacity-50">
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>
      </div>
    </form>
  );
};

// --- Main Page Component ---
export default function AccesoPage() {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            <button 
              onClick={() => setActiveTab('login')} 
              className={`${activeTab === 'login' ? 'border-[var(--color-primary)] text-[var(--color-primary-dark)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => setActiveTab('register')} 
              className={`${activeTab === 'register' ? 'border-[var(--color-primary)] text-[var(--color-primary-dark)]' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Registrarse
            </button>
          </nav>
        </div>
        
        {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}

      </div>
    </div>
  );
}