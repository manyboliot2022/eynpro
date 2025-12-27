
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, TrendingUp, History, ArrowRight, Calculator as CalcIcon, ShoppingCart, DollarSign, Package } from 'lucide-react';
import { Order, OrderItem, Product } from '../types';

const CostCalculator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'NEW' | 'ANALYSIS' | 'HISTORY'>('NEW');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [gpTotal, setGpTotal] = useState<number>(50000);
  const [monthlyCharges, setMonthlyCharges] = useState<number>(200000);
  const [estimatedMonthlyVolume, setEstimatedMonthlyVolume] = useState<number>(1000);
  const [history, setHistory] = useState<Order[]>([]);

  const totalBuyPrice = items.reduce((sum, i) => sum + (i.buyPrice * i.quantity), 0);
  const totalArticles = items.reduce((sum, i) => sum + i.quantity, 0);
  
  const gpPerArticle = totalArticles > 0 ? gpTotal / totalArticles : 0;
  const chargePerArticle = estimatedMonthlyVolume > 0 ? monthlyCharges / estimatedMonthlyVolume : 0;

  const addItem = () => {
    setItems([...items, { id: Math.random().toString(36).substr(2, 9), name: '', buyPrice: 0, quantity: 1 }]);
  };

  const updateItem = (id: string, field: keyof OrderItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const deleteItem = (id: string) => setItems(items.filter(i => i.id !== id));

  const saveToCatalog = () => {
    if (items.length === 0) return;
    const products: Product[] = JSON.parse(localStorage.getItem('eyn_products') || '[]');

    items.forEach(item => {
      const costBasis = item.buyPrice + gpPerArticle + chargePerArticle;
      const existing = products.find(p => p.name.toLowerCase() === item.name.toLowerCase());
      
      if (existing) {
        existing.costPrice = costBasis;
        existing.sellPrice = Math.round(costBasis * 1.3);
        existing.stock += item.quantity;
      } else {
        products.push({
          id: Math.random().toString(36).substr(2, 9),
          name: item.name || 'Nouveau Produit',
          category: 'A classer',
          barcode: '',
          costPrice: costBasis,
          sellPrice: Math.round(costBasis * 1.3),
          stock: item.quantity
        });
      }
    });

    localStorage.setItem('eyn_products', JSON.stringify(products));
    alert("🚀 Stock et Coûts envoyés au Manager avec succès !");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Navigation Tabs */}
      <div className="flex bg-slate-200 p-1 rounded-2xl gap-1">
        <button onClick={() => setActiveTab('NEW')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'NEW' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>📋 Commande</button>
        <button onClick={() => setActiveTab('ANALYSIS')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'ANALYSIS' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>📊 Analyse</button>
        <button onClick={() => setActiveTab('HISTORY')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'HISTORY' ? 'bg-white shadow text-slate-900' : 'text-slate-500'}`}>📜 Historique</button>
      </div>

      {activeTab === 'NEW' && (
        <div className="space-y-4">
          {/* Real-time Stats Header */}
          <div className="bg-slate-900 text-white rounded-3xl p-5 flex justify-between items-center shadow-lg">
            <div className="text-center">
              <p className="text-[8px] font-black uppercase opacity-40">Sous-Total</p>
              <p className="text-sm font-black">{totalBuyPrice.toLocaleString()} FG</p>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <p className="text-[8px] font-black uppercase opacity-40">Articles</p>
              <p className="text-sm font-black text-yellow-500">{totalArticles}</p>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="text-center">
              <p className="text-[8px] font-black uppercase opacity-40">Coût Final</p>
              <p className="text-sm font-black">{(totalBuyPrice + gpTotal).toLocaleString()} FG</p>
            </div>
          </div>

          <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest flex items-center gap-2">
                <Plus className="w-4 h-4 text-yellow-500" /> Étape 1: Articles
              </h3>
              <button onClick={addItem} className="bg-slate-900 text-white p-2 rounded-xl active:scale-90 transition-transform"><Plus className="w-4 h-4" /></button>
            </div>
            
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-2xl relative border border-slate-100">
                  <button onClick={() => deleteItem(item.id)} className="absolute -top-2 -right-2 bg-white text-red-500 p-1.5 rounded-full shadow-md border"><Trash2 className="w-3.5 h-3.5" /></button>
                  <input type="text" placeholder="Nom produit" className="w-full bg-transparent border-b border-slate-200 py-1 text-sm font-black mb-3 focus:outline-none" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-2 rounded-xl">
                      <label className="text-[8px] font-black text-slate-400 uppercase">Prix Unitaire</label>
                      <input type="number" className="w-full text-xs font-bold" value={item.buyPrice || ''} onChange={(e) => updateItem(item.id, 'buyPrice', parseFloat(e.target.value))} />
                    </div>
                    <div className="bg-white p-2 rounded-xl">
                      <label className="text-[8px] font-black text-slate-400 uppercase">Quantité</label>
                      <input type="number" className="w-full text-xs font-bold" value={item.quantity || ''} onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value))} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest flex items-center gap-2">
              <CalcIcon className="w-4 h-4 text-yellow-500" /> Étape 2 & 3: Frais
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-2xl">
                <label className="text-[8px] font-black text-slate-400 uppercase">GP Colis Total</label>
                <input type="number" className="w-full bg-transparent text-xs font-black text-slate-900" value={gpTotal} onChange={(e) => setGpTotal(parseFloat(e.target.value))} />
                <p className="text-[7px] font-bold text-yellow-600 mt-1">~ {gpPerArticle.toFixed(0)} FG/Art</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl">
                <label className="text-[8px] font-black text-slate-400 uppercase">Charges Mensuelles</label>
                <input type="number" className="w-full bg-transparent text-xs font-black text-slate-900" value={monthlyCharges} onChange={(e) => setMonthlyCharges(parseFloat(e.target.value))} />
                <p className="text-[7px] font-bold text-yellow-600 mt-1">~ {chargePerArticle.toFixed(0)} FG/Art</p>
              </div>
            </div>
          </section>

          <button onClick={saveToCatalog} className="w-full bg-yellow-500 text-slate-900 font-black py-5 rounded-3xl flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all uppercase tracking-widest text-xs">
            <ArrowRight className="w-5 h-5" /> Envoyer vers Stock & Manager
          </button>
        </div>
      )}

      {activeTab === 'ANALYSIS' && (
        <div className="space-y-4">
          {items.map(item => {
            const unitCost = item.buyPrice + gpPerArticle + chargePerArticle;
            return (
              <div key={item.id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-right duration-300">
                <div className="bg-slate-900 p-5 flex justify-between items-center">
                   <h4 className="text-white font-black text-sm uppercase">{item.name || 'Produit'}</h4>
                   <div className="text-right">
                     <p className="text-[8px] text-yellow-500 font-black uppercase">Coût de Revient</p>
                     <p className="text-lg font-black text-white">{unitCost.toLocaleString()} FG</p>
                   </div>
                </div>
                <div className="p-6 space-y-3">
                   <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-400 mb-2">
                     <div className="flex justify-between bg-slate-50 p-2 rounded-lg"><span>Achat:</span> <span className="text-slate-900">{item.buyPrice}</span></div>
                     <div className="flex justify-between bg-slate-50 p-2 rounded-lg"><span>GP:</span> <span className="text-slate-900">{gpPerArticle.toFixed(0)}</span></div>
                   </div>
                   
                   {[
                     { m: 0, l: 'Prix Coûtant', c: 'border-red-500 text-red-500 bg-red-50', note: 'PERTE' },
                     { m: 0.2, l: 'Petit Profit', c: 'border-slate-200 text-slate-700 bg-slate-50', note: 'RISQUÉ' },
                     { m: 0.3, l: 'Recommandé', c: 'border-green-500 text-green-700 bg-green-50', note: 'BON ✅' },
                     { m: 0.5, l: 'Bon Profit', c: 'border-blue-500 text-blue-700 bg-blue-50', note: 'TOP ✅' },
                     { m: 1.0, l: 'Double', c: 'border-purple-500 text-purple-700 bg-purple-50', note: 'MAX ✅' }
                   ].map(opt => (
                     <div key={opt.m} className={`flex justify-between items-center p-4 rounded-2xl border-2 ${opt.c}`}>
                       <div>
                         <span className="text-[10px] font-black uppercase">{opt.l} ({opt.m * 100}%)</span>
                         <p className="text-[8px] font-bold opacity-60 mt-1">{opt.note}</p>
                       </div>
                       <div className="text-right">
                         <p className="text-lg font-black">{Math.round(unitCost * (1 + opt.m)).toLocaleString()} FG</p>
                         <p className="text-[9px] font-bold">+ {Math.round(unitCost * opt.m).toLocaleString()} /unité</p>
                       </div>
                     </div>
                   ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CostCalculator;
