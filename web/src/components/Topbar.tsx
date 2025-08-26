import Link from 'next/link';
import Image from 'next/image';

export default function Topbar() {
  return (
    <header className="bg-gray-100 border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/">
              <Image
                src="/main_logo.png"
                alt="Logo de Mioro"
                width={127}
                height={40}
                priority
              />
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Acceso Comerciantes
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
