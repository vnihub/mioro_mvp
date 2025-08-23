import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { MerchantNav } from '@/components/MerchantNav';

export default async function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.user_id) {
    redirect('/login');
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4 lg:w-1/5">
          <MerchantNav />
        </aside>
        <main className="flex-grow md:w-3/4 lg:w-4/5">
          {children}
        </main>
      </div>
    </div>
  );
}