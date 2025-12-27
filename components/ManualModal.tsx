
import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Calculator, Package, ShoppingCart, Zap, TrendingUp, Info } from 'lucide-react';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: "Bienvenue sur EYN PRO",
      icon: <div className="bg-yellow-100 p-6 rounded-full animate-bounce"><Info className="w-12 h-12 text-yellow-600" /></div>,
      description: "Votre système complet pour gérer votre boutique de cosmétiques comme un pro.",
      content: (
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="bg-slate-900 text-white p-2 rounded-xl"><Calculator className="w-5 h-5" /></div>
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Étape 1</p>
              <p className="text-sm font-bold text-slate-800">Calculez vos coûts réels</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="bg-slate-900 text-white p-2 rounded-xl"><Package className="w-5 h-5" /></div>
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Étape 2</p>
              <p className="text-sm font-bold text-slate-800">Gérez votre stock</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="bg-slate-900 text-white p-2 rounded-xl"><ShoppingCart className="w-5 h-5" /></div>
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400">Étape 3</p>
              <p className="text-sm font-bold text-slate-800">Vendez avec profit</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "1. Le Cerveau : Calculator",
      icon: <div className="bg-slate-900 p-6 rounded-full shadow-2xl"><Calculator className="w-12 h-12 text-yellow-500 animate-pulse" /></div>,
      description: "Ne perdez plus d'argent. Calculez le vrai coût de revient unitaire.",
      content: (
        <div className="bg-slate-900 text-white p-5 rounded-[2rem] space-y-3 shadow-xl">
           <div className="flex justify-between border-b border-white/10 pb-2">
             <span className="text-xs opacity-60">Achat</span>
             <span className="text-xs font-bold">5,000 FG</span>
           </div>
           <div className="flex justify-between border-b border-white/10 pb-2">
             <span className="text-xs opacity-60">+ GP (Groupage)</span>
             <span className="text-xs font-bold text-yellow-500">500 FG</span>
           </div>
           <div className="flex justify-between border-b border-white/10 pb-2">
             <span className="text-xs opacity-60">+ Charges (Loyer)</span>
             <span className="text-xs font-bold text-yellow-500">200 FG</span>
           </div>
           <div className="flex justify-between pt-2">
             <span className="text-sm font-black">COÛT RÉEL</span>
             <span className="text-sm font-black text-green-400">5,700 FG</span>
           </div>
        </div>
      )
    },
    {
      title: "2. Le Stock : Manager",
      icon: <div className="bg-slate-900 p-6 rounded-full shadow-2xl"><Package className="w-12 h-12 text-yellow-500 animate-pulse" /></div>,
      description: "Utilisez le 'Batch Scanner' pour associer vos codes-barres en un clin d'œil.",
      content: (
        <div className="space-y-3">
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-2xl flex items-start gap-3">
            <Zap className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-xs text-yellow-800 font-medium">Importez les 40+ produits cosmétiques détectés (Vaseline, Nivea, etc.) pour démarrer instantanément !</p>
          </div>
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl flex items-center justify-center gap-4">
             <div className="w-12 h-8 bg-slate-200 rounded animate-pulse"></div>
             <div className="w-20 h-4 bg-slate-200 rounded animate-pulse"></div>
          </div>
        </div>
      )
    },
    {
      title: "3. La Caisse : POS",
      icon: <div className="bg-slate-900 p-6 rounded-full shadow-2xl"><ShoppingCart className="w-12 h-12 text-yellow-500 animate-pulse" /></div>,
      description: "Rapide et sans erreur. Les marges sont déjà incluses dans vos prix.",
      content: (
        <div className="text-center space-y-4">
          <div className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest">
            Profit Garanti par Vente
          </div>
          <div className="flex justify-center -space-x-4">
            {[1,2,3].map(i => (
              <div key={i} className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center font-black text-slate-400">
                {i}
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase">Appuyez sur 'Terminer' pour démarrer l'aventure</p>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-md flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-sm rounded-[3rem] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-300">
        
        <div className="p-8 flex-1 flex flex-col items-center text-center">
          <div className="mb-6">{steps[step].icon}</div>
          <h2 className="text-xl font-black text-slate-900 mb-3">{steps[step].title}</h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-8">{steps[step].description}</p>
          
          <div className="w-full flex-1 flex flex-col justify-center">
            {steps[step].content}
          </div>
        </div>

        <div className="p-8 pt-0 flex flex-col gap-3">
          <div className="flex justify-center gap-2 mb-4">
            {steps.map((_, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-slate-900' : 'w-2 bg-slate-200'}`}></div>
            ))}
          </div>
          
          <div className="flex gap-2">
            {step > 0 && (
              <button 
                onClick={() => setStep(step - 1)}
                className="flex-1 bg-slate-100 text-slate-900 font-black py-4 rounded-2xl flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <button 
              onClick={() => step === steps.length - 1 ? onClose() : setStep(step + 1)}
              className="flex-[2] bg-yellow-500 text-slate-900 font-black py-4 rounded-2xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
            >
              {step === steps.length - 1 ? 'C\'est parti !' : 'Suivant'} <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualModal;
