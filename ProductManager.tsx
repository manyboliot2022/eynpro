
import React, { useState, useEffect } from 'react';
import { Search, Package, Zap, Barcode, TrendingUp, DollarSign, Plus, Edit2, Trash2, Smartphone } from 'lucide-react';
import { Product, PRE_DETECTED_PRODUCTS } from '../types';

const ProductManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'STOCK' | 'IMPORT' | 'BATCH'>('STOCK');
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('eyn_products');
    if (saved) setProducts(JSON.parse(saved));
  }, []);

  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
  const stockValue = products.reduce((sum, p) => sum + (p.costPrice * p.stock), 0);
  const withoutBarcode = products.filter(p => !p.barcode).length;

  const importPresets = () => {
    const newProds: Product[] = PRE_DETECTED_PRODUCTS.map(p => ({
      id: Math.random().toString(36).substr(2, 9),
      name: p.name,
      category: p.category,
      barcode: '',
      costPrice: 0,
      sellPrice: 0,
      stock: 0
    }));
    const updated = [...products, ...newProds];
    setProducts(updated);
    localStorage.setItem('eyn_products', JSON.stringify(updated));
    alert("📦 40+ Produits importés dans le catalogue !");
    setActiveTab('STOCK');
  };

  const deleteProduct = (id: string) => {
    if (confirm("Supprimer ce produit ?")) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('eyn_products', JSON.stringify(updated));
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Navigation */}
      <div className="flex bg-slate-200 p-1 rounded-2xl gap-1">
        <button onClick={() => setActiveTab('STOCK')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'STOCK' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>📦 Catalogue</button>
        <button onClick={() => setActiveTab('IMPORT')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'IMPORT' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>📥 Import</button>
        <button onClick={() => setActiveTab('BATCH')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'BATCH' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>⚡ Batch</button>
      </div>

      {activeTab === 'STOCK' && (
        <>
          {/* Stats Section */}
          <div className="grid grid-cols-2 gap-3">
             <div className="bg-slate-900 text-white p-4 rounded-3xl shadow-lg">
                <p className="text-[8px] font-black uppercase opacity-40">Total Stock</p>
                <p className="text-xl font-black text-yellow-500">{totalStock}</p>
                <div className="flex items-center gap-1 mt-1 text-[8px] font-bold text-slate-400">
                  <Package className="w-3 h-3" /> {products.length} types
                </div>
             </div>
             <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
                <p className="text-[8px] font-black uppercase text-slate-400">Valeur Stock</p>
                <p className="text-xl font-black text-slate-900">{stockValue.toLocaleString()} FG</p>
                <div className="flex items-center gap-1 mt-1 text-[8px] font-bold text-red-500">
                  <Barcode className="w-3 h-3" /> {withoutBarcode} sans code
                </div>
             </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input type="text" placeholder="Rechercher un produit..." className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold shadow-sm" value={search} onChange={e => setSearch(e.target.value)} />
          </div>

          <div className="space-y-2">
            {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => (
              <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-50 flex justify-between items-center shadow-sm">
                <div>
                  <h4 className="text-sm font-black text-slate-900">{p.name}</h4>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[8px] font-black bg-slate-100 px-2 py-0.5 rounded-full text-slate-400 uppercase">{p.category}</span>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>Stock: {p.stock}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button className="p-2 text-slate-300 active:text-slate-900"><Edit2 className="w-4 h-4" /></button>
                   <button onClick={() => deleteProduct(p.id)} className="p-2 text-red-200 active:text-red-500"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'IMPORT' && (
        <div className="space-y-6 text-center py-10">
           <div className="bg-slate-900 p-8 rounded-[3rem] text-white">
              <Package className="w-16 h-16 text-yellow-500 mx-auto mb-6 animate-bounce" />
              <h3 className="text-xl font-black mb-2 uppercase tracking-widest">Base de données EYN</h3>
              <p className="text-xs text-white/50 font-medium mb-8 leading-relaxed">Nous avons pré-détecté 40+ produits cosmétiques populaires pour vous faire gagner du temps.</p>
              <button onClick={importPresets} className="w-full bg-yellow-500 text-slate-900 font-black py-5 rounded-3xl uppercase tracking-widest text-xs shadow-[0_10px_30px_rgba(234,179,8,0.4)]">
                 Importer 40+ Produits
              </button>
           </div>
           <div className="bg-white border-2 border-dashed border-slate-200 p-8 rounded-[3rem]">
              <Smartphone className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Ajouter depuis image (IA)</p>
              <p className="text-[10px] text-slate-300 mt-2 italic font-bold">Prochainement disponible</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProductManager;
