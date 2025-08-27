import type { NextPage } from 'next';

async function getShops() {
  const res = await fetch('http://localhost:3000/api/admin/shops', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch shops');
  return res.json();
}

const AdminShopsPage: NextPage = async () => {
  const shops = await getShops();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin: All Shops</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100">
              {shops.length > 0 && Object.keys(shops[0]).map(key => (
                <th key={key} className="py-2 px-4 border-b">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {shops.map((shop: any) => (
              <tr key={shop.id}>
                {Object.entries(shop).map(([key, value]) => (
                  <td key={key} className="py-2 px-4 border-b whitespace-nowrap">
                    {typeof value === 'boolean' ? value.toString() : (value ? String(value) : 'NULL')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminShopsPage;
