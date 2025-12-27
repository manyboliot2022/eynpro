
import React, { useState, useEffect } from 'react';
import { Barcode, Search, ShoppingBag, Receipt, ArrowRight, X, UserPlus, Share2, Send, CreditCard, Phone, MessageCircle, MapPin } from 'lucide-react';
import { Product, Client, PaymentMethod, Transaction, DEFAULT_BRAND_INFO, CompanySettings } from '../types';

interface CartItem extends Product {
  quantity: number;
}

const POS: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CASH_GNF');
  const [search, setSearch] = useState('');
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [brand, setBrand] = useState<CompanySettings>(DEFAULT_BRAND_INFO);

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem('eyn_products') || '[]'));
    setClients(JSON.parse(localStorage.getItem('eyn_clients') || '[]'));
    const savedBrand = localStorage.getItem('eyn_brand_info');
    if (savedBrand) setBrand(JSON.parse(savedBrand));
  }, []);

  const addToCart = (product: Product) => {
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      setCart(cart.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id: string) => setCart(cart.filter(i => i.id !== id));
  
  const total = cart.reduce((sum, item) => sum + (item.sellPrice * item.quantity), 0);

  const handleShare = (type: 'WHATSAPP' | 'SMS', isQuote: boolean = false) => {
    const client = clients.find(c => c.id === selectedClientId);
    if (!client && !isQuote) { alert("Veuillez sélectionner un client !"); return; }
    
    // Construction du message dynamique
    let text = `✨ ${brand.name.toUpperCase()} ✨\n`;
    text += `"${brand.tagline}"\n\n`;
    text += `${isQuote ? '📜 DEVIS' : '🧾 FACTURE'}\n`;
    text += `--------------------------\n`;
    cart.forEach(i => text += `- ${i.name} x${i.quantity} : ${(i.sellPrice * i.quantity).toLocaleString()} FG\n`);
    text += `--------------------------\n`;
    text += `TOTAL : ${total.toLocaleString()} FG\n`;
    text += `Moyen : ${paymentMethod}\n\n`;
    
    // Inclusion dynamique de l'adresse et des contacts
    if (brand.mapAddress) {
      text += `📍 Notre Adresse / Maps :\n${brand.mapAddress}\n\n`;
    }
    
    text += `📞 Contacts: ${brand.phoneGn} / ${brand.phoneSn}\n`;
    text += `💬 WhatsApp: ${brand.whatsapp}\n`;
    if (brand.socials) text += `👻 Socials: ${brand.socials}\n`;
    text += `\nMerci de votre confiance !`;

    const encodedText = encodeURIComponent(text);
    
    if (type === 'WHATSAPP') {
      // Pour WhatsApp, on utilise le numéro du client s'il existe, sinon celui de l'entreprise (pour s'auto-envoyer le devis)
      const waNumber = client?.phone || brand.whatsapp;
      window.open(`https://wa.me/${waNumber.replace(/\s+/g, '')}?text=${encodedText}`);
    } else {
      // Pour SMS, on utilise l'encodage URI également pour préserver les retours à la ligne
      window.open(`sms:${client?.phone || ''}?body=${encodedText}`);
    }
  };

  const validateSale = (isReservation: boolean = false) => {
    const transaction: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      type: 'IN',
      amount: total,
      method: paymentMethod,
      description: isReservation ? "Réservation Client" : "Vente POS",
      category: isReservation ? "Réservation" : "Vente",
      clientId: selectedClientId,
      isReservation
    };
    
    const transactions = JSON.parse(localStorage.getItem('eyn_transactions') || '[]');
    localStorage.setItem('eyn_transactions', JSON.stringify([...transactions, transaction]));
    setIsReceiptOpen(true);
  };

  return (
    <div className="h-full flex flex-col space-y-4 relative">
      <div className="grid grid-cols-2 gap-2">
        <select 
          className="bg-white border-2 border-slate-100 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest focus:border-yellow-500 shadow-sm"
          value={selectedClientId}
          onChange={(e) => setSelectedClientId(e.target.value)}
        >
          <option value="">👤 Client Occasionnel</option>
          {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select 
          className="bg-slate-900 text-yellow-500 border-none rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-widest shadow-lg"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
        >
          <option value="CASH_GNF">💸 Cash GNF</option>
          <option value="OM">🟠 Orange Money</option>
          <option value="MTN">🟡 Moov/MTN</option>
          <option value="USD">💵 Dollar ($)</option>
          <option value="EUR">💶 Euro (€)</option>
          <option value="CFA">🌍 Franc CFA</option>
        </select>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input type="text" placeholder="Chercher produit..." className="w-full bg-white border-2 border-slate-100 rounded-2xl pl-10 pr-4 py-3 text-sm font-bold shadow-sm" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {search && (
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden divide-y z-[60] absolute top-32 left-4 right-4 max-h-[50%] overflow-y-auto">
          {products.filter(p => p.name.toLowerCase().includes(search.toLowerCase())).map(p => (
            <button key={p.id} onClick={() => {addToCart(p); setSearch('');}} className="w-full p-4 flex justify-between items-center active:bg-slate-50 transition-colors">
              <span className="text-sm font-bold text-slate-700">{p.name}</span>
              <span className="text-sm font-black text-slate-900">{p.sellPrice.toLocaleString()} FG</span>
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-2 pb-4 scroll-smooth">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
            <ShoppingBag className="w-16 h-16 mb-4" />
            <p className="font-black uppercase tracking-widest text-xs">Panier vide</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="bg-white/80 backdrop-blur-sm p-4 rounded-3xl border border-slate-50 flex items-center gap-4 shadow-sm animate-in slide-in-from-right duration-300">
              <div className="bg-slate-100 w-10 h-10 rounded-2xl flex items-center justify-center text-slate-400 font-black">{item.quantity}</div>
              <div className="flex-1">
                <p className="text-sm font-black text-slate-800 line-clamp-1">{item.name}</p>
                <p className="text-[10px] text-slate-400 font-bold">{(item.sellPrice * item.quantity).toLocaleString()} FG</p>
              </div>
              <button onClick={() => removeFromCart(item.id)} className="text-red-400 p-2 active:bg-red-50 rounded-full transition-colors"><X className="w-4 h-4" /></button>
            </div>
          ))
        )}
      </div>

      <div className="bg-slate-900 p-6 rounded-[3rem] shadow-2xl space-y-4">
        <div className="flex justify-between items-end border-b border-white/10 pb-4">
          <span className="text-xs font-black uppercase text-white/50 tracking-widest">Total Net</span>
          <span className="text-3xl font-black text-yellow-500">{total.toLocaleString()} FG</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => handleShare('WHATSAPP', true)}
            disabled={cart.length === 0}
            className="bg-white/10 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest disabled:opacity-20 transition-all"
          >
            <Share2 className="w-4 h-4" /> Devis WA
          </button>
          <button 
            onClick={() => validateSale(true)}
            disabled={cart.length === 0}
            className="bg-white/10 text-yellow-500 font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-[10px] uppercase tracking-widest disabled:opacity-20 transition-all"
          >
            <CreditCard className="w-4 h-4" /> Réservation
          </button>
        </div>
        <button 
          onClick={() => validateSale(false)}
          disabled={cart.length === 0}
          className="w-full bg-yellow-500 text-slate-900 py-5 rounded-3xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all active:scale-95 shadow-[0_15px_30px_rgba(234,179,8,0.4)] disabled:opacity-50"
        >
          Confirmer la Vente <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {isReceiptOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/95 flex items-center justify-center p-6 backdrop-blur-xl">
          <div className="bg-white w-full max-w-sm rounded-[3.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col">
            <div className="p-8 text-center bg-white relative">
               <button onClick={() => setIsReceiptOpen(false)} className="absolute top-6 right-6 p-2 text-slate-300 active:scale-90"><X className="w-6 h-6" /></button>
               
               {/* Brand Header on Receipt */}
               <div className="mb-6 pt-4">
                 <h2 className="text-xl font-black uppercase tracking-[0.2em] text-slate-900">{brand.name}</h2>
                 <p className="text-[10px] font-medium text-slate-400 italic mb-4">{brand.tagline}</p>
                 <div className="h-px w-20 bg-yellow-500 mx-auto"></div>
               </div>

               <div className="bg-green-50 text-green-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                 <Receipt className="w-8 h-8" />
               </div>
               <p className="text-2xl font-black text-slate-900">{total.toLocaleString()} FG</p>
               <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mt-1">Transaction Confirmée</p>
            </div>

            <div className="px-8 pb-8 space-y-4">
               <div className="p-4 bg-slate-50 rounded-2xl space-y-2">
                 <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-40">
                   <span>Date</span>
                   <span>{new Date().toLocaleDateString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-40">
                   <span>Paiement</span>
                   <span>{paymentMethod}</span>
                 </div>
               </div>

               <div className="flex flex-col gap-2">
                 <button onClick={() => handleShare('WHATSAPP')} className="w-full bg-green-500 text-white font-black py-4 rounded-[1.5rem] flex items-center justify-center gap-3 text-[10px] uppercase tracking-widest shadow-lg active:scale-95">
                   <MessageCircle className="w-4 h-4" /> Reçu WhatsApp
                 </button>
                 <button onClick={() => {setCart([]); setIsReceiptOpen(false);}} className="w-full bg-slate-900 text-white font-black py-4 rounded-[1.5rem] uppercase tracking-widest text-[10px] active:scale-95">
                   Fermer
                 </button>
               </div>

               {/* Receipt Footer Contacts */}
               <div className="text-center pt-2">
                 {brand.mapAddress && (
                   <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
                     <MapPin className="w-2.5 h-2.5" /> {brand.mapAddress}
                   </p>
                 )}
                 <div className="flex justify-center gap-4">
                    <div className="flex items-center gap-1">
                       <span className="text-[8px] font-black bg-slate-100 px-1 rounded text-slate-400">Gn</span>
                       <span className="text-[9px] font-bold text-slate-400">{brand.phoneGn}</span>
                    </div>
                    <div className="flex items-center gap-1">
                       <span className="text-[8px] font-black bg-slate-100 px-1 rounded text-slate-400">Sn</span>
                       <span className="text-[9px] font-bold text-slate-400">{brand.phoneSn}</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
