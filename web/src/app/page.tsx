'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Region { id: number; name: string; }
interface Purity { id: number; label: string; }
interface City {
  id: number;
  name: string;
  is_capital: boolean;
}
interface BullionSku { id: number; product_name: string; metal_code: string; }
interface Price {
  metal_code: string;
  purity_id: number | null;
  bullion_sku_id: number | null;
  price_eur: number;
}
interface Shop {
  id: string;
  name: string;
  logo_url: string | null;
  last_price_update_at: string;
  prices: Price[];
}
interface SearchResult {
  shop_id: string;
  shop_name: string;
  logo_url: string | null;
  estimated_payout_eur: number;
  last_price_update_at: string;
}

export default function Home() {
  const [searchType, setSearchType] = useState<'scrap' | 'bullion'>('scrap');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [metal, setMetal] = useState('gold');
  const [purity, setPurity] = useState('4');
  const [bullionSkuId, setBullionSkuId] = useState('');
  const [weight, setWeight] = useState('10'); // Used for scrap weight and bullion quantity

  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [purities, setPurities] = useState<Purity[]>([]);
  const [bullionSkus, setBullionSkus] = useState<BullionSku[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch regions and bullion SKUs
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await fetch('/api/regions');
        if (!res.ok) throw new Error('Failed to fetch regions');
        const data = await res.json();
        setRegions(data);
      } catch (err: any) {
        console.error('Error fetching regions:', err);
      }
    };

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
    fetchRegions();
    fetchBullionSkus();
  }, []);

  // Fetch cities when region changes
  useEffect(() => {
    if (region) {
      const fetchCities = async () => {
        try {
          const res = await fetch(`/api/regions/${region}/cities`);
          if (!res.ok) throw new Error('Failed to fetch cities');
          const data: City[] = await res.json();
          setCities(data);
          const capital = data.find(c => c.is_capital);
          if (capital) {
            setCity(capital.id.toString());
          } else {
            setCity(''); // Reset city selection
          }
        } catch (err: any) {
          console.error('Error fetching cities:', err);
        }
      };
      fetchCities();
    } else {
      setCities([]);
      setCity('');
    }
  }, [region]);

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

    if (!city) {
      setError('Por favor, selecciona una ciudad.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/cities/${city}/shops`);
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Error al cargar los resultados');
      }
      const shops: Shop[] = await response.json();

      const calculatedResults = shops.map(shop => {
        let estimated_payout_eur = 0;
        if (searchType === 'scrap') {
          const price = shop.prices.find(p => p.metal_code === metal && p.purity_id === parseInt(purity));
          if (price) {
            estimated_payout_eur = price.price_eur * parseFloat(weight);
          }
        } else {
          const price = shop.prices.find(p => p.bullion_sku_id === parseInt(bullionSkuId));
          if (price) {
            estimated_payout_eur = price.price_eur * parseFloat(weight);
          }
        }
        return {
          shop_id: shop.id,
          shop_name: shop.name,
          logo_url: shop.logo_url,
          last_price_update_at: shop.last_price_update_at,
          estimated_payout_eur,
        };
      }).filter(r => r.estimated_payout_eur > 0)
        .sort((a, b) => b.estimated_payout_eur - a.estimated_payout_eur);

      setResults(calculatedResults);
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
              <label htmlFor="region" className="text-sm font-medium text-gray-700">Región</label>
              <select id="region" value={region} onChange={e => setRegion(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 bg-white focus:ring-2 focus:ring-[var(--color-primary)]">
                <option value="">Selecciona una región</option>
                {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="city" className="text-sm font-medium text-gray-700">Ciudad</label>
              <select id="city" value={city} onChange={e => setCity(e.target.value)} className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 bg-white focus:ring-2 focus:ring-[var(--color-primary)]" disabled={!region}>
                <option value="">Selecciona una ciudad</option>
                {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {searchType === 'scrap' ? (
              <>
                <div>
                  <label className="text-sm font-medium text-gray-700">Metal</label>
                  <div className="mt-1 grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setMetal('gold')}
                      className={`px-4 py-2 rounded-lg font-semibold text-center ${metal === 'gold' ? 'bg-yellow-400 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      Oro
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetal('silver')}
                      className={`px-4 py-2 rounded-lg font-semibold text-center ${metal === 'silver' ? 'bg-gray-400 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      Plata
                    </button>
                    <button
                      type="button"
                      onClick={() => setMetal('platinum')}
                      className={`px-4 py-2 rounded-lg font-semibold text-center ${metal === 'platinum' ? 'bg-gray-500 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      Platino
                    </button>
                  </div>
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
