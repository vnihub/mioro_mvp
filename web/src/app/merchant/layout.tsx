import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { MerchantNav } from '@/components/MerchantNav';
import { Pool } from 'pg';

export const dynamic = 'force-dynamic';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function getShopForMerchant(merchantId: number) {
  const res = await pool.query('SELECT name FROM shops WHERE merchant_id = $1 ORDER BY id LIMIT 1', [merchantId]);
  return res.rows[0];
}

export default async function MerchantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session.user_id || !session.merchant_id) {
    redirect('/login');
  }

  const shop = await getShopForMerchant(session.merchant_id);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="md:w-1/4 lg:w-1/5">
          <div className="p-4 mb-6 bg-gray-100 rounded-xl">
            <p className="text-sm text-gray-500">Editando</p>
            <h2 className="font-bold text-lg text-gray-800">{shop?.name || 'Tu Tienda'}</h2>
          </div>
          <MerchantNav />
        </aside>
        <main className="flex-grow md:w-3/4 lg:w-4/5">
          {children}
        </main>
      </div>
    </div>
  );
}