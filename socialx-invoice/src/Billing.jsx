import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Zap,
  LayoutTemplate,
  CreditCard,
  Building,
  Percent
} from 'lucide-react';
import { createInvoice, updateInvoice } from './services/api';

const Billing = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currency] = useState('INR');
  const [showCommission] = useState(false);
  const [commissionRate] = useState(15);
  const [gstRate, setGstRate] = useState(18);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [invoiceId, setInvoiceId] = useState(null);

  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `SX-${Math.floor(1000 + 9000 * Math.random()).toFixed(0)}`,
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
    }, 800);
  };

  const saveInvoice = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      let response;
      if (invoiceId) {
        response = await updateInvoice(invoiceId, invoiceData);
        setSuccessMessage('Invoice updated successfully!');
      } else {
        response = await createInvoice(invoiceData);
        setInvoiceId(response.id);
        setSuccessMessage('Invoice created successfully!');
      }
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save invoice');
      setTimeout(() => setError(null), 5000);
    } finally {
      setIsSaving(false);
    }
  }, [invoiceData, invoiceId]);

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

  const steps = [
    { name: 'Details', icon: <LayoutTemplate size={20} />, activeColor: 'text-violet-600', activeBg: 'bg-violet-100', borderColor: 'border-violet-600' },
    { name: 'Items', icon: <Sparkles size={20} />, activeColor: 'text-pink-600', activeBg: 'bg-pink-100', borderColor: 'border-pink-600' },
    { name: 'Agency', icon: <Building size={20} />, activeColor: 'text-orange-600', activeBg: 'bg-orange-100', borderColor: 'border-orange-600' },
    { name: 'Payment', icon: <CreditCard size={20} />, activeColor: 'text-blue-600', activeBg: 'bg-blue-100', borderColor: 'border-blue-600' },
    { name: 'Review', icon: <CheckCircle2 size={20} />, activeColor: 'text-emerald-600', activeBg: 'bg-emerald-100', borderColor: 'border-emerald-600' }
  ];

  const InvoicePreview = () => {
    const previewSubtotal = invoiceData.items.reduce((sum, i) => sum + i.quantity * i.rate, 0);
    const previewAgencyFee = showCommission ? (previewSubtotal * commissionRate) / 100 : 0;
    const previewGstAmount = ((previewSubtotal + previewAgencyFee) * gstRate) / 100;
    const previewTotal = previewSubtotal + previewAgencyFee + previewGstAmount;

    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 pt-8 border-t-2 border-gray-100/50 backdrop-blur-sm print:mt-0 print:pt-0 print:border-none"
      >
        <div className="flex items-center gap-2 mb-4 print:hidden">
          <div className="p-1.5 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg shadow-lg shadow-orange-500/20">
            <Zap size={14} className="text-white" />
          </div>
          <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
            Live Preview
          </h3>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden shadow-2xl shadow-slate-200/50 hover:shadow-orange-100/50 transition-shadow duration-300 print:shadow-none print:border-none print:rounded-none">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="flex justify-between items-start relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg">S</div>
                  <p className="font-bold text-lg tracking-tight">SocialXspark</p>
                </div>
                <p className="text-xs text-slate-400 font-medium tracking-wide">Growth Billing</p>
              </div>
              <div className="text-right">
                <div className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/10 mb-2 inline-block">
                  <p className="text-[10px] text-orange-200 font-bold uppercase tracking-widest">Invoice</p>
                </div>
                <p className="font-mono text-xl font-bold text-white tracking-widest">{invoiceData.invoiceNumber}</p>
              </div>
            </div>
          </div>

          {/* Client Info */}
          <div className="grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-100">
            <div className="p-4 bg-gradient-to-b from-orange-50/50 to-transparent">
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> From
              </p>
              <p className="font-bold text-slate-800 text-sm">{invoiceData.sender.name}</p>
              <p className="text-slate-500 text-xs mt-0.5">{invoiceData.sender.email}</p>
            </div>
            <div className="p-4 bg-gradient-to-b from-blue-50/50 to-transparent">
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> To
              </p>
              <p className="font-bold text-slate-800 text-sm">{invoiceData.client.name || 'Client Name'}</p>
              <p className="text-slate-500 text-xs mt-0.5">{invoiceData.client.address || 'Client Address'}</p>
            </div>
          </div>

          {/* Items */}
          <div className="bg-slate-50/50 p-4 min-h-[100px]">
            {invoiceData.items.length > 0 ? (
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-200/60">
                    <th className="text-left py-2 font-medium pl-2">Item Description</th>
                    <th className="text-center py-2 font-medium">Qty</th>
                    <th className="text-right py-2 font-medium">Rate</th>
                    <th className="text-right py-2 font-medium pr-2">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoiceData.items.map((item) => (
                    <tr key={item.id} className="text-slate-700">
                      <td className="py-2.5 pl-2 font-medium">{item.description || '—'}</td>
                      <td className="text-center py-2.5 text-slate-500">{item.quantity}</td>
                      <td className="text-right py-2.5 text-slate-500">{currencySymbol}{item.rate}</td>
                      <td className="text-right py-2.5 font-bold text-slate-800 pr-2">{currencySymbol}{(item.quantity * item.rate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center h-24 text-slate-400">
                <Sparkles size={24} className="mb-2 opacity-50" />
                <p className="text-xs">Add items to see them here</p>
              </div>
            )}
          </div>

          {/* Footer - Totals */}
          <div className="bg-white p-4 border-t border-slate-100">
            <div className="flex justify-end">
              <div className="w-1/2 min-w-[200px] space-y-1">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-700">{currencySymbol}{previewSubtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>GST ({gstRate}%)</span>
                  <span className="font-medium text-slate-700">{currencySymbol}{previewGstAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-800 uppercase">Total Amount</span>
                  <span className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-pink-600">
                    {currencySymbol}{previewTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderStep = () => {
    return (
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20, filter: 'blur(10px)' }}
        animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="min-h-[400px]"
      >
        {(() => {
          switch (currentStep) {
            case 0:
              return (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <motion.div whileFocus={{ scale: 1.02 }} className="group">
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide group-focus-within:text-violet-600 transition-colors">Invoice Number</label>
                      <input
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-mono"
                        value={invoiceData.invoiceNumber}
                        onChange={e => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                      />
                    </motion.div>
                    <motion.div whileFocus={{ scale: 1.02 }} className="group">
                      <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide group-focus-within:text-violet-600 transition-colors">Issue Date</label>
                      <input
                        type="date"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                        value={invoiceData.date}
                        onChange={e => setInvoiceData({ ...invoiceData, date: e.target.value })}
                      />
                    </motion.div>
                  </div>

                  <motion.div whileFocus={{ scale: 1.01 }} className="group">
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide group-focus-within:text-violet-600 transition-colors">Client Name</label>
                    <input
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
                      placeholder="e.g. Nike India"
                      value={invoiceData.client.name}
                      onChange={e => setInvoiceData({ ...invoiceData, client: { ...invoiceData.client, name: e.target.value } })}
                    />
                  </motion.div>

                  <motion.div whileFocus={{ scale: 1.01 }} className="group">
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide group-focus-within:text-violet-600 transition-colors">Client Address</label>
                    <textarea
                      rows="3"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all resize-none"
                      value={invoiceData.client.address}
                      onChange={e => setInvoiceData({ ...invoiceData, client: { ...invoiceData.client, address: e.target.value } })}
                    />
                  </motion.div>
                  <InvoicePreview />
                </div>
              );
            case 1:
              return (
                <div className="space-y-4">
                  <AnimatePresence>
                    {invoiceData.items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
                      >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-pink-500 to-violet-500"></div>
                        <input
                          className="w-full mb-3 bg-transparent border-b border-dashed border-slate-200 pb-2 font-semibold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-pink-500 transition-colors"
                          placeholder="Item Description"
                          value={item.description}
                          onChange={e => handleItemChange(item.id, 'description', e.target.value)}
                        />
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 block">Qty</label>
                            <input
                              type="number"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                              value={item.quantity}
                              onChange={e => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1 block">Rate</label>
                            <input
                              type="number"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all"
                              value={item.rate}
                              onChange={e => handleItemChange(item.id, 'rate', Number(e.target.value))}
                            />
                          </div>
                          <div className="flex items-end">
                            <motion.button
                              whileHover={{ scale: 1.05, backgroundColor: '#fee2e2' }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => removeItem(item.id)}
                              className="w-full bg-slate-50 text-slate-400 hover:text-red-500 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={addItem}
                    className="w-full bg-gradient-to-r from-pink-500 to-violet-500 text-white px-4 py-3 rounded-xl font-bold text-sm shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 hover:shadow-xl hover:shadow-pink-500/30 transition-all"
                  >
                    <Plus size={18} /> Add New Item
                  </motion.button>
                  <InvoicePreview />
                </div>
              );
            case 2:
              return (
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                    <motion.div whileFocus={{ scale: 1.01 }} className="group col-span-2">
                       <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide group-focus-within:text-orange-600 transition-colors">Agency Name</label>
                      <input
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                         value={invoiceData.sender.name}
                        onChange={e => setInvoiceData({ ...invoiceData, sender: { ...invoiceData.sender, name: e.target.value } })}
                      />
                    </motion.div>
                     <motion.div whileFocus={{ scale: 1.01 }} className="group">
                       <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide group-focus-within:text-orange-600 transition-colors">Email</label>
                      <input
                        type="email"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                         value={invoiceData.sender.email}
                        onChange={e => setInvoiceData({ ...invoiceData, sender: { ...invoiceData.sender, email: e.target.value } })}
                      />
                    </motion.div>
                    <motion.div whileFocus={{ scale: 1.01 }} className="group">
                       <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide group-focus-within:text-orange-600 transition-colors">GST Number</label>
                      <input
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                         value={invoiceData.sender.gst}
                        onChange={e => setInvoiceData({ ...invoiceData, sender: { ...invoiceData.sender, gst: e.target.value } })}
                      />
                    </motion.div>
                    <motion.div whileFocus={{ scale: 1.01 }} className="group col-span-2">
                       <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide group-focus-within:text-orange-600 transition-colors">Address</label>
                      <textarea
                        rows="2"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                         value={invoiceData.sender.address}
                        onChange={e => setInvoiceData({ ...invoiceData, sender: { ...invoiceData.sender, address: e.target.value } })}
                      />
                    </motion.div>
                   </div>
                  <InvoicePreview />
                </div>
              );
            case 3:
              return (
                 <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-6">
                           <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><Building size={20}/></div>
                           <h3 className="font-bold text-blue-900">Bank Details</h3>
                        </div>
                        <div className="space-y-4">
                           <motion.div whileFocus={{ scale: 1.01 }}>
                               <input
                                placeholder="Bank Name"
                                className="w-full bg-white border border-transparent shadow-sm rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                value={invoiceData.bank.name}
                                onChange={e => setInvoiceData({ ...invoiceData, bank: { ...invoiceData.bank, name: e.target.value } })}
                               />
                           </motion.div>
                           <motion.div whileFocus={{ scale: 1.01 }} className="grid grid-cols-2 gap-4">
                                <input
                                 placeholder="Account Number"
                                 className="w-full bg-white border border-transparent shadow-sm rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
                                 value={invoiceData.bank.account}
                                 onChange={e => setInvoiceData({ ...invoiceData, bank: { ...invoiceData.bank, account: e.target.value } })}
                                />
                                <input
                                 placeholder="IFSC Code"
                                 className="w-full bg-white border border-transparent shadow-sm rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono uppercase"
                                 value={invoiceData.bank.ifsc}
                                 onChange={e => setInvoiceData({ ...invoiceData, bank: { ...invoiceData.bank, ifsc: e.target.value } })}
                                />
                           </motion.div>
                        </div>
                    </div>

                    <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="p-2 bg-slate-100 rounded-lg text-slate-600"><Percent size={20}/></div>
                           <h3 className="font-bold text-slate-800">Tax Configuration</h3>
                        </div>
                        <div>
                           <div className="flex justify-between mb-2">
                             <label className="text-sm font-medium text-slate-600">GST Rate</label>
                             <span className="text-sm font-bold text-blue-600">{gstRate}%</span>
                           </div>
                           <input
                            type="range"
                            min="0"
                            max="28"
                            step="1"
                            value={gstRate}
                            onChange={e => setGstRate(Number(e.target.value))}
                            className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                           />
                           <div className="flex justify-between mt-2 text-xs text-slate-400 font-mono">
                              <span>0%</span>
                              <span>28%</span>
                           </div>
                        </div>
                    </div>
                  <InvoicePreview />
                </div>
              );
             case 4: 
                return (
                   <div className="text-center py-10">
                      <motion.div
                       initial={{ scale: 0 }}
                       animate={{ scale: 1 }}
                       transition={{ type: "spring", stiffness: 260, damping: 20 }}
                       className="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-green-500 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-green-500/30 mb-6 print:hidden"
                      >
                         <CheckCircle2 className="text-white w-12 h-12" />
                      </motion.div>
                      <h2 className="text-2xl font-black text-slate-800 mb-2 print:hidden">All Set!</h2>
                      <p className="text-slate-500 mb-8 max-w-xs mx-auto print:hidden">Your invoice is ready to be saved and generated. Review the preview below one last time.</p>
                      <InvoicePreview />
                   </div>
                );
            default:
              return null;
          }
        })()}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-900 selection:bg-pink-100 selection:text-pink-600">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="lg:col-span-3 space-y-4 print:hidden">
             <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-white/20 sticky top-8">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 text-white font-black text-xl">S</div>
                   <h1 className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 text-lg tracking-tight">SocialXspark</h1>
                </div>

                <nav className="space-y-2">
                   {steps.map((step, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentStep(index)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                           currentStep === index 
                           ? `${step.activeBg} ${step.activeColor} font-bold shadow-sm` 
                           : 'text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                         <div className={`transition-transform duration-300 ${currentStep === index ? 'scale-110' : 'group-hover:scale-105 opacity-70'}`}>
                            {step.icon}
                         </div>
                         <span className="text-sm">{step.name}</span>
                         {currentStep === index && (
                            <motion.div layoutId="active-pill" className={`ml-auto w-1.5 h-1.5 rounded-full ${step.activeBg.replace('bg-', 'bg-current')}`} />
                         )}
                      </button>
                   ))}
                </nav>
             </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6">
            {/* Top Bar */}
            <div className="flex items-center justify-between bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/20 print:hidden">
               <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-xs">Step {currentStep + 1}/{steps.length}</span>
                  <span>{steps[currentStep].name}</span>
               </div>
               
               <div className="flex gap-2">
                   <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed text-slate-600 transition-colors"
                   >
                      <ChevronLeft size={20} />
                   </button>
                   <button
                     onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                     disabled={currentStep === steps.length - 1}
                     className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 disabled:bg-slate-200 disabled:cursor-not-allowed text-white transition-colors"
                   >
                      <ChevronRight size={20} />
                   </button>
               </div>
            </div>

            {/* Error/Success Messages */}
            <AnimatePresence>
               {error && (
                  <motion.div
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0 }}
                   className="bg-red-50 text-red-600 px-4 py-3 rounded-xl border border-red-100 flex items-center gap-3 print:hidden"
                  >
                     <AlertCircle size={20} /> <span className="font-medium text-sm">{error}</span>
                  </motion.div>
               )}
               {successMessage && (
                  <motion.div
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0 }}
                   className="bg-emerald-50 text-emerald-600 px-4 py-3 rounded-xl border border-emerald-100 flex items-center gap-3 print:hidden"
                  >
                     <CheckCircle2 size={20} /> <span className="font-medium text-sm">{successMessage}</span>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* Step Content */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-white/20 min-h-[600px] relative print:shadow-none print:border-none print:p-0 print:min-h-0 print:bg-white">
               {renderStep()}
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-4 sticky bottom-8 z-20 print:hidden">
               {currentStep === steps.length - 1 && (
                  <>
                     <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={saveInvoice}
                        disabled={isSaving}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:shadow-xl hover:shadow-emerald-500/30 flex items-center justify-center gap-2 transition-all"
                     >
                        {isSaving ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                        {isSaving ? 'Saving...' : 'Save Invoice'}
                     </motion.button>
                     <motion.button
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex-1 bg-slate-900 text-white px-6 py-4 rounded-2xl font-bold shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 flex items-center justify-center gap-2 transition-all"
                     >
                        {isDownloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                        {isDownloading ? 'Generating...' : 'Download PDF'}
                     </motion.button>
                  </>
               )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
