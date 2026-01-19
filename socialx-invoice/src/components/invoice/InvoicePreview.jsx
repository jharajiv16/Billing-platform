import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles } from 'lucide-react';

const InvoicePreview = ({ invoiceData, showCommission, commissionRate, gstRate, currencySymbol }) => {
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

export default InvoicePreview;
