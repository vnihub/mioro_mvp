'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Purity { id: number; label: string; }
interface City { id: number; name: string; }
interface BullionSku { id: number; product_name: string; metal_code: string; }
interface SearchResult {
  shop_id: string;
  shop_name: string;
  logo_url: string | null;
  estimated_payout_eur: number;
  last_price_update_at: string;
}

export default function Home() {
  const [searchType, setSearchType] = useState<'scrap' | 'bullion'>('scrap');
  const [city, setCity] = useState('1');
  const [metal, setMetal] = useState('gold');
  const [purity, setPurity] = useState('4');
  const [bullionSkuId, setBullionSkuId] = useState('');
  const [weight, setWeight] = useState('10'); // Used for scrap weight and bullion quantity

  const [cities, setCities] = useState<City[]>([]);
  const [purities, setPurities] = useState<Purity[]>([]);
  const [bullionSkus, setBullionSkus] = useState<BullionSku[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch cities and bullion SKUs
  useEffect(() => {
    setCities([{ id: 1, name: 'Madrid' }, { id: 2, name: 'Barcelona' }]);
    const fetchBullionSkus = async () => {
      try {
        const res = await fetch('/api/bullion-skus');
        if (!res.ok) throw new Error('Failed to fetch bullion products');
        const data = await res.json();
        setBullionSkus(data);
      } catch (err: any) {
        console.error('Error fetching bullion SKUs:', err);
      }
    };
    fetchBullionSkus();
  }, []);

  // Update purities based on selected metal for scrap search
  useEffect(() => {
    if (searchType === 'scrap') {
      if (metal === 'gold') {
        setPurities([{ id: 4, label: '18K' }, { id: 7, label: '24K' }]);
      } else if (metal === 'silver') {
        setPurities([{ id: 11, label: '925' }]);
      } else if (metal === 'platinum') {
        setPurities([{ id: 14, label: '950' }]);
      } else { setPurities([]); }
    }
  }, [metal, searchType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults([]);

    let payload: any = { city_id: parseInt(city) };

    if (searchType === 'scrap') {
      payload = { ...payload, metal, purity_id: parseInt(purity), weight_grams: parseFloat(weight) };
    } else {
      payload = { ...payload, bullion_sku_id: parseInt(bullionSkuId), quantity: parseFloat(weight) };
    }

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, search_type: searchType }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Error al cargar los resultados');
      }
      const data = await response.json();
      setResults(data.results);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl md:text-4xl font-display font-semibold">Vende tu oro, plata y platino al mejor precio en tu ciudad</h1>
        <p className="mt-4 text-lg text-gray-600">Compara precios de compra actualizados por comercios locales</p>
      </div>

      <div className="mt-8 max-w-md mx-auto bg-white p-6 rounded-2xl shadow-md">
        <form onSubmit={handleSubmit}>
          {/* Search Type Toggle */}
          <div className="mb-4 flex justify-center space-x-4">
            <button type="button" onClick={() => setSearchType('scrap')} className={`px-4 py-2 rounded-lg font-semibold ${searchType === 'scrap' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 text-gray-700'}`}>Chatarra</button>
            <button type="button" onClick={() => setSearchType('bullion')} className={`px-4 py-2 rounded-lg font-semibold ${searchType === 'bullion' ? 'bg-[var(--color-primary)] text-white' : 'bg-gray-200 text-gray-700'}`}>Bullion</button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="city" className="text-sm font-medium text-gray-700">Ciudad</label>
              <select id="city" value={city} onChange={e => setCity(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 bg-white focus:ring-2 focus:ring-[var(--color-primary)]">
                <option value="">Selecciona una ciudad</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {searchType === 'scrap' ? (
              <>
                <div>
                  <label htmlFor="metal" className="text-sm font-medium text-gray-700">Metal</label>
                  <select id="metal" value={metal} onChange={e => setMetal(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 bg-white focus:ring-2 focus:ring-[var(--color-primary)]">
                    <option value="gold">Oro</option>
                    <option value="silver">Plata</option>
                    <option value="platinum">Platino</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="purity" className="text-sm font-medium text-gray-700">Pureza</label>
                  <select id="purity" value={purity} onChange={e => setPurity(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 bg-white focus:ring-2 focus:ring-[var(--color-primary)]">
                    <option value="">Selecciona pureza</option>
                    {purities.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="weight" className="text-sm font-medium text-gray-700">Peso (g)</label>
                  <input type="number" id="weight" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Introduce el peso en gramos" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label htmlFor="bullionSku" className="text-sm font-medium text-gray-700">Producto Bullion</label>
                  <select id="bullionSku" value={bullionSkuId} onChange={e => setBullionSkuId(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 bg-white focus:ring-2 focus:ring-[var(--color-primary)]">
                    <option value="">Selecciona un producto</option>
                    {bullionSkus.map(sku => <option key={sku.id} value={sku.id}>{sku.product_name}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-700">Cantidad</label>
                  <input type="number" id="quantity" value={weight} onChange={e => setWeight(e.target.value)} placeholder="Introduce la cantidad" className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" />
                </div>
              </>
            )}
          </div>

          <div className="mt-6">
            <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center rounded-lg px-4 py-2 bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] disabled:opacity-50 font-semibold">
              {loading ? 'Buscando...' : 'Calcular'}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-8 max-w-2xl mx-auto">
        {error && <p className="text-red-500 text-center">Error: {error}</p>}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold font-display">Resultados en tu ciudad</h2>
            {results.map(shop => (
              <Link href={`/shop/${shop.shop_id}`} key={shop.shop_id} className="block">
                <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-4">
                    <img src={shop.logo_url || 'https://via.placeholder.com/40'} alt="logo" className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-semibold">{shop.shop_name}</p>
                      <p className="text-sm text-gray-500">Actualizado: {new Date(shop.last_price_update_at).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">{shop.estimated_payout_eur.toFixed(2)} €</p>
                    <p className="text-xs text-gray-500">Estimación</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
