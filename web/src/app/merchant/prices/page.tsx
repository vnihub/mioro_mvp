'use client';

import { useState, useEffect, useMemo } from 'react';
import Toast from '@/components/Toast';

// --- Type Definitions ---
interface Price {
  id: number | string;
  metal: string;
  metal_code?: string;
  purity?: string;
  sku?: string;
  context: 'scrap' | 'bullion';
  side: 'buy' | 'sell';
  price_eur: number;
  bullion_sku_id?: number;
  is_new?: boolean;
  is_deleted?: boolean;
}

interface BullionSku {
  id: number;
  product_name: string;
  metal_code: string;
}

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

// --- Helper Components ---
const AddBullionControl = ({ onAdd, existingSkuIds }: { onAdd: (sku: BullionSku) => void, existingSkuIds: number[] }) => {
  const [allSkus, setAllSkus] = useState<BullionSku[]>([]);
  const [selectedSkuId, setSelectedSkuId] = useState('');

  useEffect(() => {
    fetch('/api/bullion-skus').then(res => res.json()).then(setAllSkus);
  }, []);

  const availableSkus = useMemo(() => allSkus.filter(s => !existingSkuIds.includes(s.id)), [allSkus, existingSkuIds]);

  const handleAdd = () => {
    const skuToAdd = allSkus.find(s => s.id === parseInt(selectedSkuId));
    if (skuToAdd) {
      onAdd(skuToAdd);
      setSelectedSkuId('');
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-b-lg border-t">
      <select value={selectedSkuId} onChange={e => setSelectedSkuId(e.target.value)} className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 bg-white focus:ring-2 focus:ring-[var(--color-primary)]">
        <option value="">Seleccionar producto...</option>
        {availableSkus.map(sku => <option key={sku.id} value={sku.id}>{sku.product_name}</option>)}
      </select>
      <button onClick={handleAdd} disabled={!selectedSkuId} className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 font-semibold text-sm whitespace-nowrap">Añadir Producto</button>
    </div>
  );
};

// --- Main Page Component ---
export default function MerchantPricesPage() {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/merchant/prices');
      if (!res.ok) throw new Error('Error al cargar los precios');
      const data = await res.json();
      setPrices(data);
    } catch (err: any) { 
      setToast({ message: err.message, type: 'error' });
    } finally { 
      setLoading(false); 
    }
  };

  const scrapPrices = useMemo(() => prices.filter(p => p.context === 'scrap'), [prices]);
  const bullionPriceGroups = useMemo(() => {
      const visiblePrices = prices.filter(p => p.context === 'bullion' && !p.is_deleted);
      const groups: { [key: number]: { sku?: string, buy?: Price, sell?: Price } } = {};
      for (const price of visiblePrices) {
          if (!price.bullion_sku_id) continue;
          if (!groups[price.bullion_sku_id]) groups[price.bullion_sku_id] = { sku: price.sku };
          if (price.side === 'buy') groups[price.bullion_sku_id].buy = price;
          if (price.side === 'sell') groups[price.bullion_sku_id].sell = price;
      }
      return Object.entries(groups);
  }, [prices]);

  const handlePriceChange = (id: number | string, newPrice: string, side: 'buy' | 'sell') => {
    setPrices(currentPrices =>
      currentPrices.map(p =>
        p.id === id && p.side === side ? { ...p, price_eur: parseFloat(newPrice) || 0 } : p
      )
    );
  };

  const handleAddBullion = (sku: BullionSku) => {
    const newBuyPrice: Price = { id: `new-${sku.id}-buy`, metal: '', context: 'bullion', side: 'buy', price_eur: 0, bullion_sku_id: sku.id, metal_code: sku.metal_code, is_new: true, sku: sku.product_name };
    const newSellPrice: Price = { id: `new-${sku.id}-sell`, metal: '', context: 'bullion', side: 'sell', price_eur: 0, bullion_sku_id: sku.id, metal_code: sku.metal_code, is_new: true, sku: sku.product_name };
    setPrices(current => [...current, newBuyPrice, newSellPrice]);
  };

  const handleRemoveBullion = (skuId: number) => {
    setPrices(current => current.map(p => p.bullion_sku_id === skuId ? {...p, is_deleted: true} : p));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setToast(null);
    try {
      const res = await fetch('/api/merchant/prices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prices),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al guardar los cambios');
      }
      setToast({ message: '¡Precios actualizados con éxito!', type: 'success' });
      fetchPrices();
    } catch (err: any) {
      setToast({ message: err.message || 'No se pudieron guardar los cambios. Inténtalo de nuevo.', type: 'error' });
    } finally { setIsSaving(false); }
  };

  if (loading) return <p className="text-center p-8">Cargando precios...</p>;

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold font-display">Tus Precios</h1>
          <button onClick={handleSaveChanges} disabled={isSaving || prices.length === 0} className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-dark)] font-semibold disabled:opacity-50">
            {isSaving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

        {prices.length === 0 ? (
          <div className="text-center bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-2">Bienvenido a tu panel de precios</h2>
            <p className="text-gray-600">Aún no has añadido ningún precio.</p>
            <p className="text-gray-600 mt-1">Empieza por añadir productos de bullion para que los clientes puedan ver tus tarifas.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Chatarra</h2>
              <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full">
                  <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Metal</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pureza</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compra €/g</th></tr></thead>
                  <tbody className="divide-y divide-gray-200">
                    {scrapPrices.map(item => (<tr key={item.id}><td className="px-4 py-3 text-sm font-medium text-gray-900">{item.metal}</td><td className="px-4 py-3 text-sm text-gray-500">{item.purity}</td><td className="px-4 py-3"><input type="number" value={item.price_eur} onChange={e => handlePriceChange(item.id, e.target.value, 'buy')} className="w-28 rounded-lg border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" /></td></tr>))}
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Bullion y Monedas</h2>
              <div className="overflow-x-auto bg-white rounded-t-lg shadow">
                <table className="min-w-full">
                  <thead className="bg-gray-50"><tr><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Compra €/ud</th><th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venta €/ud</th><th className="w-12 px-4 py-3"></th></tr></thead>
                  <tbody className="divide-y divide-gray-200">
                    {bullionPriceGroups.map(([skuId, group]) => (
                      <tr key={skuId}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{group.sku}</td>
                        <td className="px-4 py-3"><input type="number" value={group.buy?.price_eur ?? ''} onChange={e => handlePriceChange(group.buy!.id, e.target.value, 'buy')} className="w-28 rounded-lg border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" /></td>
                        <td className="px-4 py-3"><input type="number" value={group.sell?.price_eur ?? ''} onChange={e => handlePriceChange(group.sell!.id, e.target.value, 'sell')} className="w-28 rounded-lg border border-gray-300 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]" /></td>
                        <td className="px-4 py-3"><button onClick={() => handleRemoveBullion(parseInt(skuId))} className="text-red-500 hover:text-red-700 font-bold">X</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <AddBullionControl onAdd={handleAddBullion} existingSkuIds={bullionPriceGroups.map(([skuId, _]) => parseInt(skuId))} />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
