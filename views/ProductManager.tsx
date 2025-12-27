
import React, { useState, useEffect } from 'react';
import { Search, Barcode, Image as ImageIcon, Plus, Edit2, Trash2, Zap, Package, Users, Truck, MapPin, Phone } from 'lucide-react';
import { Product, Supplier, Client, PRE_DETECTED_PRODUCTS } from '../types';

const ProductManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'SUPPLIERS' | 'CLIENTS' | 'BATCH'>('PRODUCTS');
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem('eyn_products') || '[]'));
    setSuppliers(JSON.parse(localStorage.getItem('eyn_suppliers') || '[]'));
    setClients(JSON.parse(localStorage.getItem('eyn_clients') || '[]'));
  }, []);

  const saveProducts = (newProds: Product[]) => {
    setProducts(newProds);
    localStorage.setItem('eyn_products', JSON.stringify(newProds));
  };

  const addSupplier = () => {
    const name = prompt("Nom du Fournisseur ?");
    if (!name) return;
    const newSuppliers = [...suppliers, { id: Date.now().toString(), name, address: prompt("Adresse ?") || "", phone: prompt("Téléphone ?") || "", email: "" }];
    setSuppliers(newSuppliers);
    localStorage.setItem('eyn_suppliers', JSON.stringify(newSuppliers));
  };

  const addClient = () => {
    const name = prompt("Nom du Client ?");
    if (!name) return;
    const newClients = [...clients, { id: Date.now().toString(), name, address: prompt("Adresse ?") || "", phone: prompt("Téléphone ?") || "", balance: 0 }];
    setClients(newClients);
    localStorage.setItem('eyn_clients', JSON.stringify(newClients));
  };

  const importAll = () => {
    const newProds: Product[] = PRE_DETECTED_PRODUCTS.map(p => ({
      id: Math.random().toString(36).substr(2, 9),
      name: p.name,
      category: p.category,
      barcode: '',
      costPrice: 0,
      sellPrice: 0,
      stock: 0
    }));
    saveProducts([...products, ...newProds]);
    alert("Produits importés !");
    setActiveTab('PRODUCTS');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      <div className="flex bg-slate-200 p-1 rounded-2xl gap-1 overflow-x-auto hide-scrollbar">
        {[
          { id: 'PRODUCTS', label: 'Produits', icon: Package },
          { id: 'SUPPLIERS', label: 'Fournisseurs', icon: Truck },
          { id: 'CLIENTS', label: 'Clients', icon: Users },
          { id: 'BATCH', label: 'Batch', icon: Zap }
        ].map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex-shrink-0 flex items-center px-4 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === tab.id ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>
            <tab.icon className="w-3.5 h-3.5 mr-1.5" /> {tab.label}
          </button>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder={`Chercher dans ${activeTab}...`} className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-yellow-500 transition-colors shadow-sm" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>

      {activeTab === 'PRODUCTS' && (
        <div className="space-y-2">
          {products.length === 0 && <button onClick={importAll} className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl mb-4 text-xs uppercase">Initialiser Catalogue (40+)</button>}
          {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(p => (
            <div key={p.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center group">
              <div>
                <h4 className="font-black text-slate-800 text-sm">{p.name}</h4>
                <div className="flex gap-2 mt-1">
                  <span className="text-[9px] font-black bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 uppercase">{p.category}</span>
                  <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${p.stock > 2 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>Stock: {p.stock}</span>
                </div>
              </div>
              <button className="p-2 text-slate-300 hover:text-slate-900"><Edit2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'SUPPLIERS' && (
        <div className="space-y-2">
          <button onClick={addSupplier} className="w-full bg-slate-900 text-yellow-500 font-black py-4 rounded-2xl mb-4 flex items-center justify-center gap-2 text-xs uppercase"><Plus className="w-4 h-4" /> Nouveau Fournisseur</button>
          {suppliers.map(s => (
            <div key={s.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
              <h4 className="font-black text-slate-900 text-sm mb-1">{s.name}</h4>
              <p className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase mb-1"><MapPin className="w-3 h-3" /> {s.address}</p>
              <p className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase"><Phone className="w-3 h-3" /> {s.phone}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'CLIENTS' && (
        <div className="space-y-2">
          <button onClick={addClient} className="w-full bg-slate-900 text-yellow-500 font-black py-4 rounded-2xl mb-4 flex items-center justify-center gap-2 text-xs uppercase"><Plus className="w-4 h-4" /> Nouveau Client</button>
          {clients.map(c => (
            <div key={c.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
              <div>
                <h4 className="font-black text-slate-900 text-sm mb-1">{c.name}</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase">{c.address}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-black uppercase mb-1">Dette</p>
                <p className={`text-xs font-black ${c.balance > 0 ? 'text-red-500' : 'text-green-500'}`}>{c.balance.toLocaleString()} FG</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Fix: Added missing default export
export default ProductManager;
