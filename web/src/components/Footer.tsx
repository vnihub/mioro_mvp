import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Mioro. Todos los derechos reservados.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <Link href="/admin/shops" className="text-sm text-gray-500 hover:text-gray-900">
              Admin Shops
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
}
