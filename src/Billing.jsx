import { useState, useMemo, useCallback } from 'react';
import {
  Plus,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronRight,
  ChevronLeft
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
    invoiceNumber: `SX-${Math.floor(1000 + 9000 * 0.5)}`,
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
    { name: 'DETAILS', icon: '📋' },
    { name: 'ITEMS', icon: '📦' },
    { name: 'AGENCY', icon: '💼' },
    { name: 'PAYMENT', icon: '💳' },
    { name: 'REVIEW', icon: '✓' }
  ];

  const InvoicePreview = () => {
    // Calculate totals for preview
    const previewSubtotal = invoiceData.items.reduce((sum, i) => sum + i.quantity * i.rate, 0);
    const previewAgencyFee = showCommission ? (previewSubtotal * commissionRate) / 100 : 0;
    const previewGstAmount = ((previewSubtotal + previewAgencyFee) * gstRate) / 100;
    const previewTotal = previewSubtotal + previewAgencyFee + previewGstAmount;

    return (
      <div className="mt-8 pt-8 border-t-2 border-gray-200">
        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">👁️ Live Invoice Preview</h3>
        <div className="bg-white border-2 border-orange-300 rounded-xl overflow-hidden shadow-lg max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="w-6 h-6 bg-white rounded flex items-center justify-center text-orange-600 font-black text-xs">S</div>
                  <p className="font-black text-sm">SocialXspark</p>
                </div>
                <p className="text-xs text-orange-100">Growth Billing</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-orange-100 uppercase tracking-wide">Invoice</p>
                <p className="font-black text-lg">{invoiceData.invoiceNumber}</p>
              </div>
            </div>
            <div className="border-t border-orange-400 pt-2 grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-orange-100 text-xs font-bold">Date</p>
                <p className="font-bold">{invoiceData.date}</p>
              </div>
              <div className="text-center">
                <p className="text-orange-100 text-xs font-bold">Total</p>
                <p className="font-bold text-sm">{currencySymbol}{previewTotal.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-orange-100 text-xs font-bold">Items</p>
                <p className="font-bold">{invoiceData.items.length}</p>
              </div>
            </div>
          </div>

          {/* Client & Sender Info */}
          <div className="grid grid-cols-2 gap-2 p-3 border-b border-orange-200 text-xs">
            <div className="bg-orange-50 p-2 rounded border-l-3 border-orange-600">
              <p className="font-bold text-orange-700 mb-1">📤 FROM</p>
              <p className="font-semibold text-gray-800 text-xs">{invoiceData.sender.name}</p>
              <p className="text-gray-600 text-xs">{invoiceData.sender.email}</p>
            </div>
            <div className="bg-blue-50 p-2 rounded border-l-3 border-blue-600">
              <p className="font-bold text-blue-700 mb-1">📥 TO</p>
              <p className="font-semibold text-gray-800 text-xs">{invoiceData.client.name || 'Client Name'}</p>
              <p className="text-gray-600 text-xs">{invoiceData.client.address || 'Client Address'}</p>
            </div>
          </div>

          {/* Items Table */}
          {invoiceData.items.length > 0 ? (
            <div className="p-2">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gradient-to-r from-orange-200 to-orange-100">
                    <th className="text-left py-1.5 px-2 font-bold text-gray-800">Item</th>
                    <th className="text-center py-1.5 px-1 font-bold text-gray-800 w-8">Qty</th>
                    <th className="text-right py-1.5 px-2 font-bold text-gray-800 w-12">Rate</th>
                    <th className="text-right py-1.5 px-2 font-bold text-orange-700 w-12">Amt</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.items.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="py-1 px-2 text-gray-800 font-medium text-xs">{item.description || '—'}</td>
                      <td className="text-center py-1 px-1 text-gray-800 font-semibold">{item.quantity}</td>
                      <td className="text-right py-1 px-2 text-gray-700 text-xs">{currencySymbol}{item.rate}</td>
                      <td className="text-right py-1 px-2 font-bold text-orange-600">{currencySymbol}{(item.quantity * item.rate).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-4 text-center text-gray-400 text-xs">📦 No items added yet</div>
          )}

          {/* Totals & Payment Info */}
          <div className="grid grid-cols-2 gap-2 p-3 border-t border-orange-200">
            {/* Totals */}
            <div className="bg-gradient-to-br from-orange-50 to-white p-2 rounded border border-orange-200">
              <p className="text-xs font-bold text-orange-700 mb-1">💰 Totals</p>
              <div className="space-y-0.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">{currencySymbol}{previewSubtotal.toLocaleString()}</span>
                </div>
                {showCommission && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commission</span>
                    <span className="font-semibold">{currencySymbol}{previewAgencyFee.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between pb-1 border-b border-gray-300">
                  <span className="text-gray-600">GST ({gstRate}%)</span>
                  <span className="font-semibold">{currencySymbol}{previewGstAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between bg-orange-600 text-white p-1.5 rounded font-bold text-xs mt-1">
                  <span>TOTAL</span>
                  <span>{currencySymbol}{previewTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Payment & Notes */}
            <div className="space-y-2">
              {(invoiceData.bank.name || invoiceData.bank.account) && (
                <div className="bg-gradient-to-br from-blue-50 to-white p-2 rounded border border-blue-200">
                  <p className="text-xs font-bold text-blue-700 mb-1">💳 Payment</p>
                  <div className="text-xs text-gray-700 space-y-0.5">
                    {invoiceData.bank.name && <p><span className="font-semibold">Bank:</span> {invoiceData.bank.name}</p>}
                    {invoiceData.bank.account && <p><span className="font-semibold">A/c:</span> {invoiceData.bank.account}</p>}
                    {invoiceData.bank.ifsc && <p><span className="font-semibold">IFSC:</span> {invoiceData.bank.ifsc}</p>}
                  </div>
                </div>
              )}
              {invoiceData.notes && (
                <div className="bg-gradient-to-br from-yellow-50 to-white p-2 rounded border border-yellow-200">
                  <p className="text-xs font-bold text-yellow-700 mb-1">📌 Notes</p>
                  <p className="text-xs text-gray-700 leading-snug">{invoiceData.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-2 text-xs text-center border-t border-gray-700">
            <p className="text-gray-300">✓ Preview • Single Page • Ready to Print</p>
          </div>
        </div>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // DETAILS
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">INVOICE #</label>
                <input
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 font-semibold"
                  value={invoiceData.invoiceNumber}
                  onChange={e => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-2">ISSUE DATE</label>
                <input
                  type="date"
                  className="w-full border border-gray-200 rounded-lg px-4 py-3"
                  value={invoiceData.date}
                  onChange={e => setInvoiceData({ ...invoiceData, date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">CLIENT NAME</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-3 placeholder-gray-400"
                placeholder="e.g. Nike India"
                value={invoiceData.client.name}
                onChange={e => setInvoiceData({ ...invoiceData, client: { ...invoiceData.client, name: e.target.value } })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">CLIENT ADDRESS</label>
              <textarea
                rows="4"
                className="w-full border border-gray-200 rounded-lg px-4 py-3"
                value={invoiceData.client.address}
                onChange={e => setInvoiceData({ ...invoiceData, client: { ...invoiceData.client, address: e.target.value } })}
              />
            </div>
            <InvoicePreview />
          </div>
        );

      case 1: // ITEMS
        return (
          <div className="space-y-4">
            <div className="space-y-4">
              {invoiceData.items.map(item => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <input
                    className="w-full mb-3 border-b border-gray-200 pb-2 font-semibold placeholder-gray-400"
                    placeholder="Item Description"
                    value={item.description}
                    onChange={e =>
                      handleItemChange(item.id, 'description', e.target.value)
                    }
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs text-gray-500">QUANTITY</label>
                      <input
                        type="number"
                        className="w-full border border-gray-200 rounded px-3 py-2"
                        value={item.quantity}
                        onChange={e =>
                          handleItemChange(item.id, 'quantity', Number(e.target.value))
                        }
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500">RATE ({currencySymbol})</label>
                      <input
                        type="number"
                        className="w-full border border-gray-200 rounded px-3 py-2"
                        value={item.rate}
                        onChange={e =>
                          handleItemChange(item.id, 'rate', Number(e.target.value))
                        }
                      />
                    </div>
                    <div className="flex items-end">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-full bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded flex items-center justify-center gap-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-right text-sm font-semibold text-gray-700">
                    Amount: {currencySymbol}{(item.quantity * item.rate).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addItem}
              className="w-full bg-orange-50 hover:bg-orange-100 text-orange-600 px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Plus size={18} /> Add Item
            </button>
            <InvoicePreview />
          </div>
        );

      case 2: // AGENCY
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">AGENCY NAME</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-3"
                value={invoiceData.sender.name}
                onChange={e => setInvoiceData({ ...invoiceData, sender: { ...invoiceData.sender, name: e.target.value } })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">EMAIL</label>
              <input
                type="email"
                className="w-full border border-gray-200 rounded-lg px-4 py-3"
                value={invoiceData.sender.email}
                onChange={e => setInvoiceData({ ...invoiceData, sender: { ...invoiceData.sender, email: e.target.value } })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">ADDRESS</label>
              <textarea
                rows="3"
                className="w-full border border-gray-200 rounded-lg px-4 py-3"
                value={invoiceData.sender.address}
                onChange={e => setInvoiceData({ ...invoiceData, sender: { ...invoiceData.sender, address: e.target.value } })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">GST NUMBER</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-3"
                value={invoiceData.sender.gst}
                onChange={e => setInvoiceData({ ...invoiceData, sender: { ...invoiceData.sender, gst: e.target.value } })}
              />
            </div>
            <InvoicePreview />
          </div>
        );

      case 3: // PAYMENT
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">BANK NAME</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-3"
                value={invoiceData.bank.name}
                onChange={e => setInvoiceData({ ...invoiceData, bank: { ...invoiceData.bank, name: e.target.value } })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">ACCOUNT NUMBER</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-3"
                value={invoiceData.bank.account}
                onChange={e => setInvoiceData({ ...invoiceData, bank: { ...invoiceData.bank, account: e.target.value } })}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">IFSC CODE</label>
              <input
                className="w-full border border-gray-200 rounded-lg px-4 py-3"
                value={invoiceData.bank.ifsc}
                onChange={e => setInvoiceData({ ...invoiceData, bank: { ...invoiceData.bank, ifsc: e.target.value } })}
              />
            </div>

            <div className="border-t-2 border-gray-200 pt-6">
              <h3 className="text-sm font-bold text-gray-700 mb-4">⚙️ TAX SETTINGS</h3>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-700 mb-2">GST PERCENTAGE (%)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="0"
                      max="28"
                      step="1"
                      value={gstRate}
                      onChange={e => setGstRate(Number(e.target.value))}
                      className="flex-1 h-2 bg-blue-300 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-blue-300 min-w-24">
                      <span className="text-2xl font-black text-blue-600">{gstRate}</span>
                      <span className="text-xs font-bold text-gray-600">%</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">Common GST rates: 0%, 5%, 12%, 18%, 28%</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-600 mb-2">NOTES</label>
              <textarea
                rows="3"
                className="w-full border border-gray-200 rounded-lg px-4 py-3"
                value={invoiceData.notes}
                onChange={e => setInvoiceData({ ...invoiceData, notes: e.target.value })}
              />
            </div>
            <InvoicePreview />
          </div>
        );

      case 4: // REVIEW
        return (
          <div className="space-y-6">
            {/* Invoice Preview for Print */}
            <div id="invoice-template" className="bg-white rounded-xl overflow-hidden shadow-2xl border-2 border-orange-500">
              {/* Top Accent Bar */}
              <div className="h-2 bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500"></div>

              {/* Header with Branding */}
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 text-white p-4 relative">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-orange-600 font-black text-sm flex-shrink-0">S</div>
                      <h1 className="text-xl font-black leading-tight">SocialXspark</h1>
                    </div>
                    <p className="text-xs text-orange-100">Professional Growth Billing Suite</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-orange-100 uppercase tracking-wider">Invoice</p>
                    <p className="text-xl font-black">{invoiceData.invoiceNumber}</p>
                  </div>
                </div>

                <div className="border-t border-orange-400 pt-2 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-orange-100 uppercase text-xs font-bold">Date</p>
                    <p className="font-bold text-sm">{invoiceData.date}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-orange-100 uppercase text-xs font-bold">Currency</p>
                    <p className="font-bold text-sm">{currencySymbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-100 uppercase text-xs font-bold">Status</p>
                    <p className="font-bold text-sm">✓ Active</p>
                  </div>
                </div>
              </div>

              {/* Company & Client Info */}
              <div className="grid grid-cols-2 gap-4 p-4 border-b-2 border-orange-200">
                <div className="bg-gradient-to-br from-orange-50 to-white p-3 rounded-lg border-l-4 border-orange-600">
                  <p className="text-xs font-bold text-orange-600 mb-1 uppercase tracking-wider">From</p>
                  <p className="font-bold text-sm text-gray-900">{invoiceData.sender.name}</p>
                  <p className="text-xs text-gray-600 mt-1">{invoiceData.sender.email}</p>
                  <p className="text-xs text-gray-600">{invoiceData.sender.address}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-white p-3 rounded-lg border-l-4 border-blue-600">
                  <p className="text-xs font-bold text-blue-600 mb-1 uppercase tracking-wider">Bill To</p>
                  <p className="font-bold text-sm text-gray-900">{invoiceData.client.name || 'Client Name'}</p>
                  <p className="text-xs text-gray-600 mt-1">{invoiceData.client.address || 'Client Address'}</p>
                </div>
              </div>

              {/* Items Table - Enhanced */}
              <div className="p-3 border-b-2 border-orange-200">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gradient-to-r from-orange-200 to-orange-100 text-gray-900">
                      <th className="text-left py-2 px-2 font-bold">📄 Description</th>
                      <th className="text-center py-2 px-2 font-bold w-14">Qty</th>
                      <th className="text-right py-2 px-2 font-bold w-16">Rate</th>
                      <th className="text-right py-2 px-2 font-bold w-16">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoiceData.items.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-gradient-to-r from-gray-50 to-white' : 'bg-white'}>
                        <td className="py-2 px-2 text-gray-800 font-medium">{item.description}</td>
                        <td className="text-center py-2 px-2 text-gray-800 font-semibold">{item.quantity}</td>
                        <td className="text-right py-2 px-2 text-gray-800">{item.rate.toLocaleString()}</td>
                        <td className="text-right py-2 px-2 font-bold text-orange-600">{currencySymbol}{(item.quantity * item.rate).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Totals Section - Enhanced */}
              <div className="p-3 bg-gradient-to-br from-gray-50 to-white border-b-2 border-orange-200">
                <div className="space-y-1 text-xs ml-auto w-2/3">
                  <div className="flex justify-between items-center pb-1 border-b-2 border-gray-200">
                    <span className="text-gray-600 font-semibold">Subtotal</span>
                    <span className="text-gray-800 font-bold">{currencySymbol}{calculations.subtotal.toLocaleString()}</span>
                  </div>
                  {showCommission && (
                    <div className="flex justify-between items-center pb-1 border-b-2 border-gray-200">
                      <span className="text-gray-600 font-semibold">Commission ({commissionRate}%)</span>
                      <span className="text-gray-800 font-bold">{currencySymbol}{calculations.agencyFee.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pb-1 border-b-2 border-gray-200">
                    <span className="text-gray-600 font-semibold">GST ({gstRate}%)</span>
                    <span className="text-gray-800 font-bold">{currencySymbol}{calculations.gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 bg-gradient-to-r from-orange-100 to-orange-50 p-2 rounded-lg mt-2">
                    <span className="font-bold text-gray-900 uppercase text-xs">Total Amount</span>
                    <span className="text-xl font-black text-orange-600">{currencySymbol}{calculations.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Payment & Notes - Compact & Enhanced */}
              <div className="grid grid-cols-2 gap-2 p-3 text-xs">
                {(invoiceData.bank.name || invoiceData.bank.account) && (
                  <div className="bg-gradient-to-br from-blue-100 to-blue-50 border-l-4 border-blue-600 p-2 rounded">
                    <p className="font-bold text-blue-700 mb-1 flex items-center gap-1">💳 Payment</p>
                    {invoiceData.bank.name && <p className="text-gray-700"><span className="font-bold">Bank:</span> {invoiceData.bank.name}</p>}
                    {invoiceData.bank.account && <p className="text-gray-700"><span className="font-bold">A/c:</span> {invoiceData.bank.account}</p>}
                    {invoiceData.bank.ifsc && <p className="text-gray-700"><span className="font-bold">IFSC:</span> {invoiceData.bank.ifsc}</p>}
                  </div>
                )}
                {invoiceData.notes && (
                  <div className="bg-gradient-to-br from-yellow-100 to-yellow-50 border-l-4 border-yellow-600 p-2 rounded">
                    <p className="font-bold text-yellow-700 mb-1 flex items-center gap-1">📌 Notes</p>
                    <p className="text-gray-700 text-xs leading-snug">{invoiceData.notes}</p>
                  </div>
                )}
              </div>

              {/* Footer with Divider */}
              <div className="border-t-2 border-orange-200 bg-gradient-to-r from-gray-900 to-gray-800 text-white p-3 text-xs">
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-gray-400 text-xs">Email</p>
                    <p className="font-semibold text-xs truncate">{invoiceData.sender.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">GST</p>
                    <p className="font-semibold text-xs truncate">{invoiceData.sender.gst}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Invoice#</p>
                    <p className="font-semibold text-xs">{invoiceData.invoiceNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs">Date</p>
                    <p className="font-semibold text-xs">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="border-t border-gray-700 mt-2 pt-2 text-center text-xs text-gray-400">
                  Thank you for choosing SocialXspark! 🙏
                </div>
              </div>
            </div>

            {/* Summary Box */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-600 rounded-lg p-4 shadow-md print:hidden">
              <p className="text-green-800 font-bold flex items-center gap-2">✅ Invoice Ready to Print</p>
              <p className="text-green-700 text-sm mt-1">✓ Single page | ✓ Professional design | ✓ Click "Print / PDF" below</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 print:bg-white print:p-0">
      <div className="max-w-2xl mx-auto">
        {/* Header - Hidden on Print */}
        <div className="mb-8 print:hidden">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-black">S</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-gray-900">SocialXspark</h1>
              <p className="text-sm text-gray-500">Professional Growth Billing Suite</p>
            </div>
          </div>
        </div>

        {/* Error Alert - Hidden on Print */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex gap-3 print:hidden">
            <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
            <div>
              <p className="font-semibold text-red-900">Error</p>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Success Alert - Hidden on Print */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex gap-3 print:hidden">
            <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
            <div>
              <p className="text-green-800 font-semibold">{successMessage}</p>
              {invoiceId && <p className="text-green-700 text-sm">Invoice ID: {invoiceId}</p>}
            </div>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden print:shadow-none print:rounded-none">
          {/* Tab Navigation - Hidden on Print */}
          <div className="flex border-b print:hidden">
            {steps.map((step, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`flex-1 py-4 px-4 text-center font-semibold text-xs transition-all ${
                  currentStep === index
                    ? 'bg-gradient-to-r from-orange-50 to-orange-50 text-orange-600 border-b-2 border-orange-600'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="text-lg mb-1">{step.icon}</div>
                {step.name}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-8">
            {renderStep()}
          </div>

          {/* Navigation - Hidden on Print */}
          <div className="border-t bg-gray-50 p-6 flex gap-4 print:hidden">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <ChevronLeft size={20} /> Back
            </button>

            {currentStep === steps.length - 1 ? (
              <>
                <button
                  onClick={saveInvoice}
                  disabled={isSaving}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                  {isSaving ? 'Saving...' : 'Save Invoice'}
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                >
                  {isDownloading ? <Loader2 className="animate-spin" size={20} /> : <Download size={20} />}
                  {isDownloading ? 'Downloading...' : 'Print / PDF'}
                </button>
              </>
            ) : (
              <button
                onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
              >
                Next Step <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Footer Status - Hidden on Print */}
        <div className="mt-8 flex justify-between items-center print:hidden">
          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {steps.length}
          </div>
          {invoiceId && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 size={16} />
              <span className="font-semibold text-xs">READY TO PRINT</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
