import type { NextPage } from 'next';

async function getShopData(id: string) {
  const res = await fetch(`http://localhost:3000/api/shops/${id}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch shop data');
  return res.json();
}

const ShopPage: NextPage<{ params: { id: string } }> = async ({ params }) => {
  const shopData = await getShopData(params.id);

  const formatOpeningHours = (hours: { open: string, close: string } | null): string => {
    if (!hours || !hours.open || !hours.close) {
      return 'Cerrado';
    }
    return `${hours.open} - ${hours.close}`;
  };

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
  const openingHoursToday = shopData.opening_hours ? formatOpeningHours(shopData.opening_hours[today]) : 'No disponible';

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                {shopData.logo_url ? (
          <img src={shopData.logo_url} alt={`${shopData.name} logo`} className="w-24 h-24 rounded-full border" />
        ) : (
          <div className="w-24 h-24 rounded-full border bg-gray-200 flex items-center justify-center">
            <span className="text-sm text-gray-500">No Logo</span>
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{shopData.name}</h1>
          
          <p className="text-gray-500 mt-1">Precios actualizados hace {new Date(shopData.last_price_update_at).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</p>
          {shopData.verification_level === 'basic' && (
            <span className="mt-2 inline-flex items-center rounded-full px-2 py-0.5 text-xs bg-green-100 text-green-800">
              Comercio verificado
            </span>
          )}
        </div>
      </div>
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm py-4 my-6 border-b border-gray-200 grid grid-cols-3 gap-3">
        <a href={`tel:${shopData.phone}`} className="text-center py-2 px-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)]">Llamar</a>
        <a href={`https://wa.me/${shopData.whatsapp?.replace(/\s/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-center py-2 px-3 bg-green-600 text-white rounded-lg hover:bg-green-700">WhatsApp</a>
        <a href={`https://maps.google.com/?q=${encodeURIComponent(shopData.address_line)}`} target="_blank" rel="noopener noreferrer" className="text-center py-2 px-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cómo llegar</a>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Precios de compra por gramo</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metal</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pureza</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Compra €/g</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {shopData.scrap_prices.map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.metal}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{item.purity}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">{item.price_eur.toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Bullion y monedas</h2>
          {shopData.bullion_prices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Compra €/ud</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Venta €/ud</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {shopData.bullion_prices.map((item: any, index: number) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{item.sku}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">{item.side === 'buy' ? `${item.price_eur.toFixed(2)} €` : '-'}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{item.side === 'sell' ? `${item.price_eur.toFixed(2)} €` : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-sm text-gray-500">No se compran/venden bullions.</p>}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="p-4 bg-gray-50 rounded-lg border h-full">
            <h3 className="font-semibold">Información</h3>
            {shopData.description && <p className="mt-2 text-sm text-gray-600"><strong>Descripción:</strong> {shopData.description}</p>}
            <p className="mt-2 text-sm text-gray-600"><strong>Dirección:</strong> {shopData.address_line}</p>
            <p className="text-sm text-gray-600"><strong>Teléfono:</strong> {shopData.phone || 'No disponible'}</p>
            <p className="text-sm text-gray-600"><strong>Horario de hoy:</strong> {openingHoursToday}</p>
            <p className="mt-4 text-xs text-gray-500">Aviso: Los precios pueden cambiar según el análisis de pureza y peso.</p>
        </div>
        {shopData.store_image_url && (
          <div className="w-full">
            <img src={shopData.store_image_url} alt={`Foto de la tienda ${shopData.name}`} className="w-full h-auto rounded-lg shadow-md" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
