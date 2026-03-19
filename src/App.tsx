/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Minus, 
  X, 
  Check,
  ChevronDown, 
  ChevronUp,
  Package,
  Truck,
  ArrowRightLeft,
  CheckCircle2,
  Clock,
  Scan
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Html5QrcodeScanner } from 'html5-qrcode';

// --- Types ---

interface Product {
  name: string;
  price: number;
  color: string;
  size: string;
  sku: string;
  image: string;
}

interface TransferItem extends Product {
  quantity: number;
}

interface Transfer {
  id: string;
  location: string;
  date: string;
  status: 'En attente d\'approbation' | 'Annulé' | 'Approuvé' | 'Expédié';
  items: TransferItem[];
  parcels: number;
  trackingNumber: string;
}

// --- Data ---

const PRODUCTS: Product[] = [
  { name: 'E25DUNE.V', price: 25.00, color: 'Blanc', size: '38', sku: '1562020', image: 'https://medias.graindemalice.fr/products/MKP/mp_853008_7120_1.jpg' },
  { name: 'H25HELLO.T', price: 10.00, color: 'Marine', size: 'S', sku: '2051702', image: 'https://medias.graindemalice.fr/products/MKP/mp_854856_7271_1.jpg' },
  { name: 'E24BRAZIL.D', price: 12.00, color: 'Light stone', size: '36', sku: '1411220', image: 'https://medias.graindemalice.fr/products/MKP/mp_850447_6987_1.jpg' },
  { name: 'E26TOKYO.D', price: 34.19, color: 'Dark grey', size: '46', sku: '2448242', image: 'https://medias.graindemalice.fr/products/MKP/mp_855020_7391_1.jpg' },
  { name: 'E26CANNES.G', price: 59.99, color: 'Kaki', size: '48', sku: '2501608', image: 'https://medias.graindemalice.fr/products/MKP/mp_855505_7353_1.jpg' },
  { name: 'E26BRESIL.V', price: 39.99, color: 'Stone', size: '48', sku: '2393993', image: 'https://medias.graindemalice.fr/products/MKP/mp_855155_7384_1.jpg' },
  { name: 'E26BRESIL.V', price: 35.99, color: 'Black washed', size: '50', sku: '2394002', image: 'https://medias.graindemalice.fr/products/MKP/mp_855155_7389_1.jpg' },
  { name: 'E26DANCING.C', price: 31.49, color: 'Jaune', size: '48', sku: '2466305', image: 'https://medias.graindemalice.fr/products/MKP/mp_855455_7350_1.jpg' },
  { name: 'H25HAPPY.T', price: 6.00, color: 'Pivoine', size: 'M', sku: '1897420', image: 'https://medias.graindemalice.fr/products/MKP/mp_854685_7233_1.jpg' },
  { name: 'E26CLELIA.R', price: 35.99, color: 'Ecru', size: '44', sku: '2506411', image: 'https://medias.graindemalice.fr/products/MKP/mp_855543_7322_1.jpg' },
  { name: 'E26COOLGIRLD', price: 31.99, color: 'Dark stone', size: '42', sku: '2501683', image: 'https://medias.graindemalice.fr/products/MKP/mp_855506_7382_1.jpg' },
  { name: 'E26POMPON.D', price: 35.99, color: 'Black', size: '40', sku: '2402487', image: 'https://medias.graindemalice.fr/products/MKP/mp_855084_7383_1.jpg' },
  { name: 'E26COOL.P', price: 28.79, color: 'Blanc cassé', size: '40', sku: '2370204', image: 'https://medias.graindemalice.fr/products/MKP/mp_855101_7321_1.jpg' },
  { name: 'H25KLEO.T', price: 23.99, color: 'Marron', size: 'L', sku: '2049002', image: 'https://medias.graindemalice.fr/products/MKP/mp_854826_7265_1.jpg' },
  { name: 'E26CLOUD.C', price: 29.60, color: 'Noir', size: '42', sku: '2791628', image: 'https://medias.graindemalice.fr/products/MKP/mp_855968_7360_1.jpg' },
];

const LOCATIONS = [
  '1 | GDM-AVESNES LE COMTE',
  '974 | HAGUENAU - GDM',
  '10279 | SOISSONS - GDM',
  '87 | CLERMONT FERRAND JAUDE',
  '10228 | SELESTAT - GDM',
  '10284 | CHALLANS - GDM',
  '88 | AMIENS',
  '121 | WASQUEHAL CC - GDM',
  '10939 | DURY - GDM',
  '10378 | FONTENAY LE COMTE - GDM',
  '12166 | ST DIZIER - GDM',
  '10402 | HEYRIEUX - GDM',
  '26 | TOURS LES ATLANTES - GDM',
];

// --- Components ---

const Card = ({ children, title, className = "" }: { children: React.ReactNode; title?: string; className?: string }) => (
  <div className={`bg-white border border-gray-200 rounded-sm shadow-sm mb-4 ${className}`}>
    {title && (
      <div className="p-4 border-bottom border-gray-100">
        <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      </div>
    )}
    <div className="p-4">
      {children}
    </div>
  </div>
);

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = "",
  disabled = false
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  className?: string;
  disabled?: boolean;
}) => {
  const variants = {
    primary: "bg-[#28B0A4] text-white hover:bg-[#239B90]",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    outline: "bg-transparent text-[#28B0A4] border border-[#28B0A4] hover:bg-[#28B0A4]/10",
    danger: "bg-red-500 text-white hover:bg-red-600",
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [transfers, setTransfers] = useState<Transfer[]>([
    {
      id: '999796',
      location: '87 | CLERMONT FERRAND JAUDE',
      date: '17/03/2026',
      status: 'Annulé',
      items: [
        { ...PRODUCTS[4], quantity: 3 }
      ],
      parcels: 1,
      trackingNumber: 'TRACK-345678'
    },
    {
      id: '999795',
      location: '10279 | SOISSONS - GDM',
      date: '16/03/2026',
      status: 'En attente d\'approbation',
      items: [
        { ...PRODUCTS[2], quantity: 10 },
        { ...PRODUCTS[3], quantity: 1 }
      ],
      parcels: 1,
      trackingNumber: 'TRACK-789012'
    },
    {
      id: '999794',
      location: '974 | HAGUENAU - GDM',
      date: '15/03/2026',
      status: 'Approuvé',
      items: [
        { ...PRODUCTS[0], quantity: 5 },
        { ...PRODUCTS[1], quantity: 2 }
      ],
      parcels: 2,
      trackingNumber: 'TRACK-123456'
    }
  ]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Form State
  const [selectedLocation, setSelectedLocation] = useState(LOCATIONS[0]);
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(0);
  const [addedItems, setAddedItems] = useState<TransferItem[]>([]);
  const [parcels, setParcels] = useState(0);
  const [trackingNumber, setTrackingNumber] = useState('');

  const filteredLocations = useMemo(() => {
    if (!locationSearchQuery) return LOCATIONS;
    return LOCATIONS.filter(loc => 
      loc.toLowerCase().includes(locationSearchQuery.toLowerCase())
    );
  }, [locationSearchQuery]);

  const filteredProducts = useMemo(() => {
    if (!searchQuery) return [];
    return PRODUCTS.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      p.sku.includes(searchQuery)
    );
  }, [searchQuery]);

  const handleCreateTransfer = () => {
    const newTransfer: Transfer = {
      id: Math.floor(100000 + Math.random() * 900000).toString(),
      location: selectedLocation,
      date: new Date().toLocaleDateString('fr-FR'),
      status: 'En attente d\'approbation',
      items: [...addedItems],
      parcels,
      trackingNumber,
    };
    setTransfers([newTransfer, ...transfers]);
    resetForm();
    setView('list');
  };

  const resetForm = () => {
    setSelectedLocation(LOCATIONS[0]);
    setSearchQuery('');
    setSelectedProduct(null);
    setQuantity(0);
    setAddedItems([]);
    setParcels(0);
    setTrackingNumber('');
  };

  const [isScannerOpen, setIsScannerOpen] = useState(false);

  // --- Scanner Effect ---
  React.useEffect(() => {
    if (isScannerOpen) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );

      scanner.render(
        (decodedText) => {
          // Success callback
          const scannedProduct = PRODUCTS.find(p => p.sku === decodedText);
          if (scannedProduct) {
            handleAddItem(scannedProduct, 1);
            scanner.clear();
            setIsScannerOpen(false);
          } else {
            alert(`Produit non trouvé: ${decodedText}`);
          }
        },
        (error) => {
          // Error callback (usually just "no QR code found in frame")
        }
      );

      return () => {
        scanner.clear().catch(err => console.error("Failed to clear scanner", err));
      };
    }
  }, [isScannerOpen]);

  const handleAddItem = (product: Product, qty: number) => {
    setAddedItems(prev => {
      const existing = prev.find(item => item.sku === product.sku);
      if (existing) {
        return prev.map(item => 
          item.sku === product.sku 
            ? { ...item, quantity: item.quantity + qty } 
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const addItem = () => {
    if (selectedProduct && quantity > 0) {
      handleAddItem(selectedProduct, quantity);
      setSelectedProduct(null);
      setSearchQuery('');
      setQuantity(0);
    }
  };

  const removeItem = (sku: string) => {
    setAddedItems(addedItems.filter(item => item.sku !== sku));
  };

  const cancelTransfer = (id: string) => {
    setTransfers(transfers.map(t => t.id === id ? { ...t, status: 'Annulé' } : t));
  };

  const shipTransfer = (id: string) => {
    setTransfers(transfers.map(t => t.id === id ? { ...t, status: 'Expédié' } : t));
  };

  const handleItemKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const scannedProduct = PRODUCTS.find(p => p.sku === searchQuery);
      if (scannedProduct) {
        handleAddItem(scannedProduct, quantity > 0 ? quantity : 1);
        setSearchQuery('');
        setSelectedProduct(null);
        setQuantity(0);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#E0E0E0] font-sans text-gray-900">
      {view === 'list' ? (
        <>
          <main className="p-4 max-w-2xl mx-auto">
            <Card className="!p-2">
              <Button 
                onClick={() => setView('create')}
                className="w-full rounded-sm py-2"
              >
                <Plus size={20} /> Créer un transfert de stock
              </Button>
            </Card>

            <div className="space-y-4">
              {transfers.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Aucun transfert de stock pour le moment.</p>
                </div>
              ) : (
                transfers.map((transfer) => (
                  <motion.div 
                    key={transfer.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden ${transfer.status === 'Annulé' ? 'bg-red-50' : ''}`}
                  >
                    <div className="p-4 flex items-start justify-between">
                      <div className="flex-1" onClick={() => setExpandedId(expandedId === transfer.id ? null : transfer.id)}>
                        <h3 className="font-bold text-gray-800">Transfert de stock {transfer.id}</h3>
                        <p className="text-sm text-gray-600">Vers {transfer.location.split('|')[1].trim()}</p>
                        <p className="text-xs text-gray-400">{transfer.date}</p>
                        
                        <div className="mt-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            transfer.status === 'En attente d\'approbation' 
                              ? 'bg-blue-100 text-blue-600' 
                              : transfer.status === 'Approuvé'
                                ? 'bg-green-100 text-green-600'
                                : transfer.status === 'Expédié'
                                  ? 'bg-indigo-100 text-indigo-600'
                                  : 'bg-red-100 text-red-600'
                          }`}>
                            {transfer.status === 'En attente d\'approbation' && <Clock size={10} />}
                            {transfer.status === 'Approuvé' && <Check size={10} />}
                            {transfer.status === 'Expédié' && <Truck size={10} />}
                            {transfer.status === 'Annulé' && <X size={10} />}
                            {transfer.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        {transfer.status === 'En attente d\'approbation' && (
                          <button 
                            onClick={() => cancelTransfer(transfer.id)}
                            className="px-4 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                          >
                            Annuler
                          </button>
                        )}
                        {transfer.status === 'Approuvé' && (
                          <div className="flex flex-col gap-2">
                            <button 
                              onClick={() => shipTransfer(transfer.id)}
                              className="px-4 py-1.5 bg-[#28B0A4] text-white rounded-md text-sm font-medium hover:bg-[#239B90]"
                            >
                              Expédié
                            </button>
                            <button 
                              onClick={() => cancelTransfer(transfer.id)}
                              className="px-4 py-1.5 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                            >
                              Annuler
                            </button>
                          </div>
                        )}
                        <button 
                          onClick={() => setExpandedId(expandedId === transfer.id ? null : transfer.id)}
                          className="p-1 text-gray-400"
                        >
                          {expandedId === transfer.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                      </div>
                    </div>

                    <AnimatePresence>
                      {expandedId === transfer.id && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="border-t border-gray-100"
                        >
                          <div className="p-4 space-y-4">
                            {transfer.items.map((item) => (
                              <div key={item.sku} className="flex gap-4 items-center">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-16 h-20 object-cover rounded-sm border border-gray-100"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="flex-1">
                                  <h4 className="font-bold text-gray-800 leading-tight">{item.name}</h4>
                                  <p className="text-sm text-gray-600">€{item.price.toFixed(2).replace('.', ',')} | {item.size}</p>
                                  <p className="text-xs text-gray-400">{item.sku}</p>
                                </div>
                                <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-bold text-gray-600">
                                  {item.quantity}
                                </div>
                              </div>
                            ))}
                            
                            <div className="pt-4 border-t border-gray-50 flex justify-between items-center text-sm">
                              <div className="flex items-center gap-2 text-gray-500">
                                <Truck size={16} />
                                <span>{transfer.parcels} colis</span>
                              </div>
                              <div className="text-gray-400 font-mono">
                                {transfer.trackingNumber}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
            </div>
          </main>
        </>
      ) : (
        <>
          <main className="p-4 max-w-2xl mx-auto pb-32">
            <div className="mb-6 flex items-center gap-4">
              <button 
                onClick={() => setView('list')}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Créer un transfert de stock</h1>
            </div>
            
            {/* Location Section */}
            <Card title="Lieu de réception">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Réception</label>
              <div className="relative">
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Rechercher un emplacement..."
                    value={isLocationDropdownOpen ? locationSearchQuery : selectedLocation}
                    onFocus={() => {
                      setIsLocationDropdownOpen(true);
                      setLocationSearchQuery('');
                    }}
                    onChange={(e) => setLocationSearchQuery(e.target.value)}
                    onBlur={() => {
                      // Small delay to allow clicking on the dropdown items
                      setTimeout(() => setIsLocationDropdownOpen(false), 200);
                    }}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#28B0A4] focus:border-transparent outline-none pr-10"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                </div>
                
                {isLocationDropdownOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {filteredLocations.map(loc => (
                      <button
                        key={loc}
                        onMouseDown={(e) => {
                          // Use onMouseDown instead of onClick to fire before onBlur
                          e.preventDefault();
                          setSelectedLocation(loc);
                          setIsLocationDropdownOpen(false);
                          setLocationSearchQuery('');
                        }}
                        className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-50 last:border-0 text-sm"
                      >
                        {loc}
                      </button>
                    ))}
                    {filteredLocations.length === 0 && (
                      <div className="p-3 text-sm text-gray-500 text-center">Aucun emplacement trouvé</div>
                    )}
                  </div>
                )}
              </div>
            </Card>

            {/* Products Section */}
            <Card title="Produits">
              <div className="flex gap-2 items-end mb-4">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Article</label>
                  <div className="relative flex gap-2">
                    <div className="relative flex-1">
                      <input 
                        type="text"
                        placeholder="Rechercher par nom ou SKU..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setSelectedProduct(null);
                        }}
                        onKeyDown={handleItemKeyDown}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#28B0A4] focus:border-transparent outline-none"
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                    <button 
                      onClick={() => setIsScannerOpen(true)}
                      className="p-3 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors border border-gray-300"
                      title="Scanner un code-barres"
                    >
                      <Scan size={20} />
                    </button>
                    
                    {/* Search Results Dropdown */}
                    {filteredProducts.length > 0 && !selectedProduct && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredProducts.map(p => (
                          <button
                            key={p.sku}
                            onClick={() => {
                              setSelectedProduct(p);
                              setSearchQuery(p.name);
                            }}
                            className="w-full p-3 text-left hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0"
                          >
                            <img src={p.image} alt="" className="w-10 h-10 object-cover rounded-sm" referrerPolicy="no-referrer" />
                            <div>
                              <div className="font-bold text-sm">{p.name}</div>
                              <div className="text-xs text-gray-500">{p.sku} • {p.color} • {p.size}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-24">
                  <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Qté</label>
                  <input 
                    type="number"
                    value={quantity || ''}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#28B0A4] focus:border-transparent outline-none text-center"
                  />
                </div>
                <button 
                  onClick={addItem}
                  disabled={!selectedProduct || quantity <= 0}
                  className="bg-[#28B0A4] text-white p-3 rounded-md hover:bg-[#239B90] disabled:opacity-50 flex items-center gap-2 font-bold"
                >
                  <Plus size={20} /> Ajouter
                </button>
              </div>

              {/* Added Items List */}
              <div className="space-y-4 mt-6">
                {addedItems.map((item) => (
                  <div key={item.sku} className="flex gap-4 items-center animate-in fade-in slide-in-from-top-2">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-20 object-cover rounded-sm border border-gray-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 leading-tight">{item.name}</h4>
                      <p className="text-sm text-gray-600">€{item.price.toFixed(2).replace('.', ',')} | {item.size}</p>
                      <p className="text-xs text-gray-400">{item.sku}</p>
                    </div>
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm font-bold text-gray-600">
                      {item.quantity}
                    </div>
                    <button 
                      onClick={() => removeItem(item.sku)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Shipment Section */}
            <Card title="Informations d'expédition">
              <div className="mb-6">
                <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Nombre de colis</label>
                <div className="flex items-center border border-gray-300 rounded-md w-fit overflow-hidden">
                  <button 
                    onClick={() => setParcels(Math.max(0, parcels - 1))}
                    className="p-3 bg-gray-50 hover:bg-gray-100 border-r border-gray-300"
                  >
                    <Minus size={18} />
                  </button>
                  <div className="px-8 font-bold text-lg min-w-[60px] text-center">
                    {parcels}
                  </div>
                  <button 
                    onClick={() => setParcels(parcels + 1)}
                    className="p-3 bg-gray-50 hover:bg-gray-100 border-l border-gray-300"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Numéro de suivi</label>
                <input 
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#28B0A4] focus:border-transparent outline-none"
                />
              </div>
            </Card>

            {/* Footer Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-gray-200 flex gap-4 justify-center z-50">
              <Button 
                variant="secondary" 
                onClick={() => {
                  resetForm();
                  setView('list');
                }}
                className="flex-1 max-w-[200px]"
              >
                Annuler
              </Button>
              <Button 
                variant="primary" 
                onClick={handleCreateTransfer}
                disabled={addedItems.length === 0}
                className="flex-[2] max-w-[300px]"
              >
                Soumettre pour approbation
              </Button>
            </div>
          </main>
        </>
      )}
      {/* Scanner Modal */}
      <AnimatePresence>
        {isScannerOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-white rounded-lg overflow-hidden relative">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="font-bold">Scanner un article</h3>
                <button onClick={() => setIsScannerOpen(false)} className="p-1 text-gray-400 hover:text-gray-600">
                  <X size={24} />
                </button>
              </div>
              <div id="reader" className="w-full"></div>
              <div className="p-4 text-center text-sm text-gray-500">
                Placez le code-barres de l'article dans le cadre pour le scanner.
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
