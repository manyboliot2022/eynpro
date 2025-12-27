
export interface Product {
  id: string;
  name: string;
  category: string;
  barcode: string;
  costPrice: number;
  sellPrice: number;
  stock: number;
}

export interface Supplier {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
}

export interface Client {
  id: string;
  name: string;
  address: string;
  phone: string;
  balance: number;
}

export type PaymentMethod = 'OM' | 'MTN' | 'CASH_GNF' | 'USD' | 'EUR' | 'CFA';

export interface Transaction {
  id: string;
  date: string;
  type: 'IN' | 'OUT'; // IN = Encaissement, OUT = Décaissement
  amount: number;
  method: PaymentMethod;
  description: string;
  category: string;
  clientId?: string;
  supplierId?: string;
  isReservation?: boolean;
  deliveryDate?: string;
}

export interface OrderItem {
  id: string;
  productId?: string;
  name: string;
  buyPrice: number;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  gpTotal: number;
  chargesTotal: number;
  totalArticles: number;
  totalCost: number;
}

export enum AppMode {
  CALCULATOR = 'CALCULATOR',
  MANAGER = 'MANAGER',
  POS = 'POS',
  FINANCE = 'FINANCE'
}

export interface CompanySettings {
  name: string;
  tagline: string;
  phoneGn: string;
  phoneSn: string;
  whatsapp: string;
  socials: string;
  mapAddress: string;
  logoUrl: string;
}

export const DEFAULT_BRAND_INFO: CompanySettings = {
  name: "Everything you need",
  tagline: "Your skin's new best friend",
  phoneGn: "+224 625245350",
  phoneSn: "+221 775889948",
  whatsapp: "+224 625245350",
  socials: "fmoriba2 et Everythinguned",
  mapAddress: "Conakry, Guinée",
  logoUrl: "https://raw.githubusercontent.com/shadcn-ui/ui/main/apps/www/public/og.png"
};

export const PRE_DETECTED_PRODUCTS = [
  { name: 'Vaseline Intensive Care', category: 'Crèmes & Hydratants' },
  { name: 'Vaseline Healing Jelly', category: 'Crèmes & Hydratants' },
  { name: 'Vaseline Aloe Vera', category: 'Crèmes & Hydratants' },
  { name: 'Nivea Cream', category: 'Crèmes & Hydratants' },
  { name: 'Nivea Soft', category: 'Crèmes & Hydratants' },
  { name: 'Cerave Lotion/Cream', category: 'Crèmes & Hydratants' },
  { name: 'Ponds Gold Radiance', category: 'Crèmes & Hydratants' },
  { name: 'Ponds Cold Cream', category: 'Crèmes & Hydratants' },
  { name: 'Jergens Original/Ultra', category: 'Crèmes & Hydratants' },
  { name: 'Sérum Vitamine C', category: 'Sérums & Essences' },
  { name: 'Sérum Hydratant', category: 'Sérums & Essences' },
  { name: 'Sérum Anti-Rides', category: 'Sérums & Essences' },
  { name: 'Essence Hydratante', category: 'Sérums & Essences' },
  { name: 'Savon Noir Dudu Osun', category: 'Nettoyants' },
  { name: 'Gel Nettoyant Doux', category: 'Nettoyants' },
  { name: 'Nettoyant Facial', category: 'Nettoyants' },
  { name: 'Défrisant Cheveux', category: 'Soins Cheveux' },
  { name: 'Gel Coiffant', category: 'Soins Cheveux' },
  { name: 'Huile Argan', category: 'Soins Cheveux' },
  { name: 'Huile Coco', category: 'Soins Cheveux' }
];
