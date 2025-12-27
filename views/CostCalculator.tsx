
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Info, TrendingUp, History, Calculator as CalcIcon, CheckCircle2, ArrowRight } from 'lucide-react';
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
    const newItem: OrderItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      buyPrice: 0,
      quantity: 1
    };
    setItems([...items, newItem]);
  };

  const updateItem = (id: string, field: keyof OrderItem, value: any) => {
    setItems(items.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  const deleteItem = (id: string) => {
    setItems(items.filter(i => i.id !== id));
  };

  const applyToCatalog = () => {
    if (items.length === 0) return;
    const savedProducts = localStorage.getItem('eyn_products');
    let products: Product[] = savedProducts ? JSON.parse(savedProducts) : [];

    items.forEach(item => {
      const costBasis = item.buyPrice + gpPerArticle + chargePerArticle;
      const existingProduct = products.find(p => p.name.toLowerCase() === item.name.toLowerCase());
      
      if (existingProduct) {
        existingProduct.costPrice = costBasis;
        existingProduct.sellPrice = Math.round(costBasis * 1.3);
        existingProduct.stock += item.quantity;
      } else {
        products.push({
          id: Math.random().toString(36).substr(2, 9),
          name: item.name || 'Produit sans nom',
          category: 'A classer',
          barcode: '',
          costPrice: costBasis,
          sellPrice: Math.round(costBasis * 1.3),
          stock: item.quantity
        });
      }
    });

    localStorage.setItem('eyn_products', JSON.stringify(products));
    alert("🚀 Stock et prix envoyés au Manager !");
  };

  const saveOrder = () => {
    if (items.length === 0) return;
    const order: Order = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      items: [...items],
      gpTotal,
      chargesTotal: monthlyCharges,
      totalArticles,
      totalCost: totalBuyPrice + gpTotal + (chargePerArticle * totalArticles)
    };
    const newHistory = [order, ...history];
    setHistory(newHistory);
    localStorage.setItem('eyn_order_history', JSON.stringify(newHistory));
    alert("📁 Historique mis à jour.");
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex bg-slate-200 p-1 rounded-[1.5rem] gap-1 shadow-inner">
        <button onClick={() => setActiveTab('NEW')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === 'NEW' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}>Saisie</button>
        <button onClick={() => setActiveTab('ANALYSIS')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === 'ANALYSIS' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}>Analyse</button>
        <button onClick={() => setActiveTab('HISTORY')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${activeTab === 'HISTORY' ? 'bg-white shadow-md text-slate-900' : 'text-slate-500'}`}>Historique</button>
      </div>

      {activeTab === 'NEW' && (
        <div className="space-y-4 animate-in slide-in-from-bottom-4">
          <section className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest">1. Nouveaux Articles</h3>
              <button onClick={addItem} className="bg-slate-900 text-yellow-500 p-3 rounded-2xl shadow-lg active:scale-90 transition-transform"><Plus className="w-5 h-5" /></button>
            </div>
            
            <div className="space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-10 opacity-30 italic text-sm">Appuyez sur + pour commencer</div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-50 rounded-[2rem] relative border border-slate-100 shadow-inner">
                    <button onClick={() => deleteItem(item.id)} className="absolute -top-2 -right-2 bg-white text-red-500 p-2 rounded-full shadow-md border"><Trash2 className="w-4 h-4" /></button>
                    <input type="text" placeholder="Nom du produit" className="w-full bg-transparent border-b border-slate-200 py-1 text-sm font-black mb-4 focus:outline-none focus:border-yellow-500" value={item.name} onChange={(e) => updateItem(item.id, 'name', e.target.value)} />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase">Prix Achat</label>
                        <input type="number" placeholder="0" className="w-full bg-transparent border-b border-slate-200 py-1 text-xs font-bold" value={item.buyPrice || ''} onChange={(e) => updateItem(item.id, 'buyPrice', parseFloat(e.target.value))} />
                      </div>
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase">Quantité</label>
                        <input type="number" placeholder="0" className="w-full bg-transparent border-b border-slate-200 py-1 text-xs font-bold" value={item.quantity || ''} onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value))} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="bg-slate-900 text-white rounded-[2.5rem] p-6 shadow-xl space-y-6">
            <h3 className="font-black text-yellow-500 text-xs uppercase tracking-widest">2. Paramètres Colis</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase opacity-40">Frais GP Colis</label>
                <div className="flex items-center gap-2">
                  <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold text-yellow-500" value={gpTotal} onChange={(e) => setGpTotal(parseFloat(e.target.value))} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase opacity-40">Charges Mensuelles</label>
                <input type="number" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm font-bold text-yellow-500" value={monthlyCharges} onChange={(e) => setMonthlyCharges(parseFloat(e.target.value))} />
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-3">
             <button onClick={applyToCatalog} className="w-full bg-yellow-500 text-slate-900 font-black py-5 rounded-[2rem] shadow-[0_10px_30px_rgba(234,179,8,0.3)] flex items-center justify-center gap-3 active:scale-95 transition-transform uppercase tracking-widest text-xs">
              <ArrowRight className="w-5 h-5" /> Envoyer vers Stock & Vente
            </button>
            <button onClick={saveOrder} className="w-full bg-white border-2 border-slate-100 text-slate-400 font-black py-4 rounded-[2rem] text-[10px] uppercase tracking-widest active:bg-slate-50 transition-colors">
              Sauvegarder l'historique
            </button>
          </div>
        </div>
      )}

      {activeTab === 'ANALYSIS' && (
        <div className="space-y-4 animate-in slide-in-from-right-4">
          {items.length === 0 ? (
            <div className="bg-white rounded-[2rem] p-10 text-center text-slate-300 italic">Veuillez d'abord saisir des articles</div>
          ) : (
            items.map(item => {
              const costBasis = item.buyPrice + gpPerArticle + chargePerArticle;
              return (
                <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100">
                  <div className="bg-slate-900 p-5 flex justify-between items-center">
                    <span className="font-black text-white text-sm uppercase tracking-wider">{item.name || 'Produit'}</span>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-yellow-500 uppercase">Coût Final Unitaire</p>
                      <p className="text-lg font-black text-white">{costBasis.toLocaleString()} FG</p>
                    </div>
                  </div>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 mb-4">
                       <TrendingUp className="w-4 h-4 text-green-500" />
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Simulations de Vente</span>
                    </div>
                    {[
                      { m: 0.2, l: 'Petit', c: 'text-slate-500 bg-slate-100' },
                      { m: 0.3, l: 'RECOMMANDÉ ✅', c: 'text-green-700 bg-green-100' },
                      { m: 0.5, l: 'Confort', c: 'text-blue-700 bg-blue-100' },
                      { m: 1.0, l: 'Double', c: 'text-purple-700 bg-purple-100' }
                    ].map(opt => (
                      <div key={opt.m} className="flex justify-between items-center p-4 rounded-2xl border border-slate-50 bg-slate-50/50">
                        <div>
                          <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-tighter ${opt.c}`}>{opt.l}</span>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">Marge: {opt.m * 100}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-base font-black text-slate-900">{Math.round(costBasis * (1 + opt.m)).toLocaleString()} FG</p>
                          <p className="text-[9px] font-bold text-green-500">+ {Math.round(costBasis * opt.m).toLocaleString()} profit</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === 'HISTORY' && (
        <div className="space-y-4 animate-in slide-in-from-left-4">
          <div className="bg-white p-6 rounded-[2rem] border border-dashed border-slate-200 text-center py-20">
             <History className="w-12 h-12 text-slate-200 mx-auto mb-4" />
             <p className="text-slate-400 text-sm font-medium">L'historique des commandes apparaîtra ici.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CostCalculator;
