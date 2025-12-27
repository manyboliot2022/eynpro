
import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Bell, DollarSign, Download, Upload, Smartphone, Save, ShieldCheck, Settings, MapPin, Phone, MessageSquare } from 'lucide-react';
import { Transaction, CompanySettings, DEFAULT_BRAND_INFO } from '../types';

const Finance: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'STATS' | 'SETTINGS' | 'BRAND'>('STATS');
  const [brandInfo, setBrandInfo] = useState<CompanySettings>(DEFAULT_BRAND_INFO);

  useEffect(() => {
    setTransactions(JSON.parse(localStorage.getItem('eyn_transactions') || '[]'));
    const savedBrand = localStorage.getItem('eyn_brand_info');
    if (savedBrand) setBrandInfo(JSON.parse(savedBrand));
  }, []);

  const saveBrandInfo = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('eyn_brand_info', JSON.stringify(brandInfo));
    alert("✅ Paramètres de l'entreprise enregistrés !");
    window.location.reload(); // Recharger pour appliquer partout (watermark, etc)
  };

  const caTotal = transactions.filter(t => t.type === 'IN').reduce((s, t) => s + t.amount, 0);
  const outTotal = transactions.filter(t => t.type === 'OUT').reduce((s, t) => s + t.amount, 0);
  const profit = caTotal - outTotal;

  const addExpense = () => {
    const desc = prompt("Nature de la dépense ? (ex: Loyer, Electricité, Achat Stock)");
    if (!desc) return;
    const amount = parseFloat(prompt("Montant ?") || "0");
    if (!amount) return;

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: 'OUT',
      amount,
      method: 'CASH_GNF',
      description: desc,
      category: 'Dépense'
    };
    const newTrans = [newTransaction, ...transactions];
    setTransactions(newTrans);
    localStorage.setItem('eyn_transactions', JSON.stringify(newTrans));
  };

  const exportData = () => {
    const data = {
      products: localStorage.getItem('eyn_products'),
      transactions: localStorage.getItem('eyn_transactions'),
      clients: localStorage.getItem('eyn_clients'),
      suppliers: localStorage.getItem('eyn_suppliers'),
      history: localStorage.getItem('eyn_order_history'),
      brand: localStorage.getItem('eyn_brand_info'),
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EYN_PRO_SAVE_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.products) localStorage.setItem('eyn_products', data.products);
        if (data.transactions) localStorage.setItem('eyn_transactions', data.transactions);
        if (data.clients) localStorage.setItem('eyn_clients', data.clients);
        if (data.suppliers) localStorage.setItem('eyn_suppliers', data.suppliers);
        if (data.brand) localStorage.setItem('eyn_brand_info', data.brand);
        alert("✅ Données restaurées avec succès ! L'application va s'actualiser.");
        window.location.reload();
      } catch (err) {
        alert("❌ Fichier invalide.");
      }
    };
    reader.readAsText(file);
  };

  const reservations = transactions.filter(t => t.isReservation);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex bg-slate-200 p-1 rounded-2xl gap-1 overflow-x-auto hide-scrollbar">
        <button onClick={() => setActiveSubTab('STATS')} className={`flex-1 min-w-[100px] py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeSubTab === 'STATS' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Dashboard</button>
        <button onClick={() => setActiveSubTab('BRAND')} className={`flex-1 min-w-[100px] py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeSubTab === 'BRAND' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Entreprise</button>
        <button onClick={() => setActiveSubTab('SETTINGS')} className={`flex-1 min-w-[100px] py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeSubTab === 'SETTINGS' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>Backup</button>
      </div>

      {activeSubTab === 'STATS' && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900 p-5 rounded-[2rem] shadow-xl border border-white/5">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Chiffre d'Affaires</p>
              <p className="text-xl font-black text-yellow-500">{caTotal.toLocaleString()} FG</p>
              <div className="flex items-center gap-1 mt-2 text-green-400 text-[8px] font-black uppercase">
                 <TrendingUp className="w-3 h-3" /> +12% ce mois
              </div>
            </div>
            <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Profit Net Est.</p>
              <p className="text-xl font-black text-slate-900">{profit.toLocaleString()} FG</p>
              <p className="text-[8px] font-bold text-slate-300 uppercase mt-2">Après déductions</p>
            </div>
          </div>

          <div className="bg-yellow-500 p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
             <div className="absolute -right-4 -top-4 opacity-10 group-hover:rotate-12 transition-transform">
               <BarChart3 className="w-32 h-32" />
             </div>
             <h3 className="font-black text-slate-900 text-sm uppercase tracking-widest mb-4">Actions Financières</h3>
             <div className="grid grid-cols-2 gap-3 relative z-10">
               <button onClick={addExpense} className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                 <TrendingDown className="w-4 h-4 text-red-500" /> Sortie / Charge
               </button>
               <button className="bg-white text-slate-900 p-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                 <DollarSign className="w-4 h-4 text-green-600" /> Encaissement
               </button>
             </div>
          </div>

          <section className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-black text-slate-900 text-[11px] uppercase tracking-widest flex items-center gap-2">
                <Bell className="w-4 h-4 text-yellow-500" /> Alertes ({reservations.length})
              </h3>
            </div>
            {reservations.length === 0 ? (
              <div className="p-8 text-center bg-slate-100 rounded-[2rem] text-slate-300 italic text-xs">Aucune réservation en attente</div>
            ) : (
              <div className="space-y-2">
                {reservations.map(res => (
                  <div key={res.id} className="bg-white p-4 rounded-3xl border-2 border-yellow-100 shadow-sm flex justify-between items-center border-l-8 border-l-yellow-500">
                    <div>
                      <p className="text-sm font-black text-slate-900">{res.description}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{new Date(res.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-yellow-600">{res.amount.toLocaleString()} FG</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {activeSubTab === 'BRAND' && (
        <form onSubmit={saveBrandInfo} className="space-y-4 animate-in slide-in-from-bottom-4">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 space-y-4">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-2 flex items-center gap-2">
              <Settings className="w-4 h-4 text-yellow-500" /> Profil Entreprise
            </h3>
            
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Nom de l'entreprise</label>
              <input type="text" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 ring-yellow-500" value={brandInfo.name} onChange={e => setBrandInfo({...brandInfo, name: e.target.value})} required />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Slogan (Tagline)</label>
              <input type="text" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold focus:ring-2 ring-yellow-500" value={brandInfo.tagline} onChange={e => setBrandInfo({...brandInfo, tagline: e.target.value})} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Tél Guinée</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
                  <input type="text" className="w-full bg-slate-50 border-none rounded-2xl pl-8 pr-4 py-4 text-[11px] font-bold" value={brandInfo.phoneGn} onChange={e => setBrandInfo({...brandInfo, phoneGn: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Tél Sénégal</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-300" />
                  <input type="text" className="w-full bg-slate-50 border-none rounded-2xl pl-8 pr-4 py-4 text-[11px] font-bold" value={brandInfo.phoneSn} onChange={e => setBrandInfo({...brandInfo, phoneSn: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2">WhatsApp (International)</label>
              <div className="relative">
                <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                <input type="text" className="w-full bg-slate-50 border-none rounded-2xl pl-10 pr-4 py-4 text-sm font-bold" value={brandInfo.whatsapp} onChange={e => setBrandInfo({...brandInfo, whatsapp: e.target.value})} />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Snapchat / Réseaux</label>
              <input type="text" className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold" value={brandInfo.socials} onChange={e => setBrandInfo({...brandInfo, socials: e.target.value})} />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2">Lien Google Maps / Adresse</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-red-400" />
                <input type="text" placeholder="https://maps.google.com/..." className="w-full bg-slate-50 border-none rounded-2xl pl-10 pr-4 py-4 text-sm font-bold focus:ring-2 ring-yellow-500" value={brandInfo.mapAddress} onChange={e => setBrandInfo({...brandInfo, mapAddress: e.target.value})} />
              </div>
              <p className="text-[8px] text-slate-400 px-2 mt-1">Collez ici le lien "Partager" de Google Maps pour qu'il soit cliquable.</p>
            </div>
          </div>
          
          <button type="submit" className="w-full bg-slate-900 text-yellow-500 py-5 rounded-3xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all">
            <Save className="w-5 h-5" /> Enregistrer les infos
          </button>
        </form>
      )}

      {activeSubTab === 'SETTINGS' && (
        <div className="space-y-6 animate-in slide-in-from-right-4">
          <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-yellow-500" /> Installation Mobile
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Sur iPhone (Safari)</p>
                <p className="text-xs text-slate-600 font-medium">Bouton <span className="font-bold text-blue-500">Partager</span> > <span className="font-bold">Sur l'écran d'accueil</span></p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Sur Samsung (Chrome)</p>
                <p className="text-xs text-slate-600 font-medium">Menu <span className="font-bold">3 points</span> > <span className="font-bold">Installer l'application</span></p>
              </div>
            </div>
          </section>

          <section className="bg-slate-900 text-white p-6 rounded-[2.5rem] shadow-xl">
            <h3 className="font-black text-yellow-500 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> Sécurité & Backup
            </h3>
            <p className="text-[10px] text-white/40 font-bold uppercase mb-6 leading-relaxed">
              Toutes vos données sont locales. Exportez votre configuration pour pouvoir la restaurer plus tard.
            </p>
            <div className="grid grid-cols-1 gap-3">
              <button onClick={exportData} className="w-full bg-white/10 hover:bg-white/20 text-white py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all">
                <Download className="w-4 h-4 text-yellow-500" /> Exporter (.json)
              </button>
              <label className="w-full bg-white/5 border border-dashed border-white/20 hover:bg-white/10 text-white/60 py-4 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest cursor-pointer transition-all">
                <Upload className="w-4 h-4 text-slate-400" /> Restaurer
                <input type="file" accept=".json" onChange={importData} className="hidden" />
              </label>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Finance;
