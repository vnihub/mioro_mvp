'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export function MerchantNav() {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { href: '/merchant/profile', label: 'Perfil' },
    { href: '/merchant/prices', label: 'Precios' },
  ];

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <nav className="flex flex-col justify-between h-full">
      <div>
        {navLinks.map(link => {
          const isActive = pathname.endsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                isActive
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
      <div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50"
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}
