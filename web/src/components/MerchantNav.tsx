'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MerchantNav() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/merchant/profile', label: 'Perfil' },
    { href: '/merchant/prices', label: 'Precios' },
  ];

  return (
    <nav className="flex flex-col space-y-1">
      {navLinks.map(link => {
        const isActive = pathname.endsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-2 rounded-md text-sm font-medium ${
              isActive
                ? 'bg-gray-200 text-gray-900'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
