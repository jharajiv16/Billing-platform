import React from 'react';
import { motion } from 'framer-motion';
import InvoicePreview from '../InvoicePreview';

const DetailsStep = ({ invoiceData, onUpdate, showCommission, commissionRate, gstRate, currencySymbol }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <motion.div whileFocus={{ scale: 1.02 }} className="group">
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide group-focus-within:text-violet-600 transition-colors">Invoice Number</label>
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all font-mono"
            value={invoiceData.invoiceNumber}
            onChange={e => onUpdate({ invoiceNumber: e.target.value })}
          />
        </motion.div>
        <motion.div whileFocus={{ scale: 1.02 }} className="group">
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide group-focus-within:text-violet-600 transition-colors">Issue Date</label>
          <input
            type="date"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
            value={invoiceData.date}
            onChange={e => onUpdate({ date: e.target.value })}
          />
        </motion.div>
      </div>

      <motion.div whileFocus={{ scale: 1.01 }} className="group">
        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide group-focus-within:text-violet-600 transition-colors">Client Name</label>
        <input
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all"
          placeholder="e.g. Nike India"
          value={invoiceData.client.name}
          onChange={e => onUpdate({ client: { ...invoiceData.client, name: e.target.value } })}
        />
      </motion.div>

      <motion.div whileFocus={{ scale: 1.01 }} className="group">
        <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide group-focus-within:text-violet-600 transition-colors">Client Address</label>
        <textarea
          rows="3"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all resize-none"
          value={invoiceData.client.address}
          onChange={e => onUpdate({ client: { ...invoiceData.client, address: e.target.value } })}
        />
      </motion.div>
      <InvoicePreview 
        invoiceData={invoiceData} 
        showCommission={showCommission} 
        commissionRate={commissionRate} 
        gstRate={gstRate}
        currencySymbol={currencySymbol}
      />
    </div>
  );
};

export default DetailsStep;
