import { useState, useMemo } from 'react';
import {
  Plus,
  Trash2,
  Download,
  CheckCircle2,
  Briefcase,
  CreditCard,
  FileText,
  TrendingUp,
  ShieldCheck,
  Percent,
  Loader2
} from 'lucide-react';

const App = () => {
  const [step, setStep] = useState(1);
  const [currency, setCurrency] = useState('INR');
  const [showCommission, setShowCommission] = useState(false);
  const [commissionRate, setCommissionRate] = useState(15);
  const [gstRate, setGstRate] = useState(18);
  const [isDownloading, setIsDownloading] = useState(false);

  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `SX-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    sender: {
      name: 'SocialXspark Agency',
      email: 'billing@socialxspark.com',
      address: 'Mumbai, India',
      gst: '27AAAAA0000A1Z5'
    },
    client: { name: '', address: '' },
    items: [{ id: 1, description: 'Brand Collaboration', quantity: 1, rate: 0 }],
    bank: { name: '', account: '', ifsc: '' },
    notes: 'SocialXspark never asks for social media passwords.'
  });

  const currencySymbol = currency === 'INR' ? '₹' : '$';

  const calculations = useMemo(() => {
    const subtotal = invoiceData.items.reduce(
      (sum, i) => sum + i.quantity * i.rate,
      0
    );
    const agencyFee = showCommission ? (subtotal * commissionRate) / 100 : 0;
    const gstAmount = ((subtotal + agencyFee) * gstRate) / 100;
    const total = subtotal + agencyFee + gstAmount;
    return { subtotal, agencyFee, gstAmount, total };
  }, [invoiceData.items, showCommission, commissionRate, gstRate]);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => {
      window.print();
      setIsDownloading(false);
    }, 500);
  };

  const handleItemChange = (id, field, value) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.map(i =>
        i.id === id ? { ...i, [field]: value } : i
      )
    });
  };

  const addItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        { id: Date.now(), description: '', quantity: 1, rate: 0 }
      ]
    });
  };

  const removeItem = id => {
    if (invoiceData.items.length > 1) {
      setInvoiceData({
        ...invoiceData,
        items: invoiceData.items.filter(i => i.id !== id)
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <h1 className="text-3xl font-black text-orange-600 mb-6">
        SocialXspark Invoice Generator
      </h1>

      {/* ITEMS */}
      {invoiceData.items.map(item => (
        <div key={item.id} className="bg-white p-4 rounded-xl mb-4 shadow">
          <input
            className="w-full mb-2 border-b"
            placeholder="Description"
            value={item.description}
            onChange={e =>
              handleItemChange(item.id, 'description', e.target.value)
            }
          />
          <div className="flex gap-4">
            <input
              type="number"
              className="flex-1 border-b"
              value={item.quantity}
              onChange={e =>
                handleItemChange(
                  item.id,
                  'quantity',
                  Number(e.target.value)
                )
              }
            />
            <input
              type="number"
              className="flex-1 border-b"
              value={item.rate}
              onChange={e =>
                handleItemChange(item.id, 'rate', Number(e.target.value))
              }
            />
            <button onClick={() => removeItem(item.id)}>
              <Trash2 />
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={addItem}
        className="bg-orange-600 text-white px-4 py-2 rounded-lg mb-6"
      >
        <Plus size={16} /> Add Item
      </button>

      {/* TOTAL */}
      <div className="bg-white p-6 rounded-xl shadow">
        <p>Subtotal: {currencySymbol}{calculations.subtotal}</p>
        {showCommission && (
          <p>Commission: {currencySymbol}{calculations.agencyFee}</p>
        )}
        <p>GST: {currencySymbol}{calculations.gstAmount}</p>
        <h2 className="text-xl font-black text-orange-600">
          Total: {currencySymbol}{calculations.total}
        </h2>
      </div>

      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="mt-6 bg-slate-900 text-white px-6 py-3 rounded-xl"
      >
        {isDownloading ? <Loader2 className="animate-spin" /> : <Download />}
        Download PDF
      </button>
    </div>
  );
};

export default App;
