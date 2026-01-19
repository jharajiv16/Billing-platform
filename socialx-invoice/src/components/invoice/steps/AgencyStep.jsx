import React from 'react';
import { motion } from 'framer-motion';
import InvoicePreview from '../InvoicePreview';

const AgencyStep = ({ invoiceData, onUpdate, showCommission, commissionRate, gstRate, currencySymbol }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <motion.div whileFocus={{ scale: 1.01 }} className="group col-span-2">
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide group-focus-within:text-orange-600 transition-colors">Agency Name</label>
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            value={invoiceData.sender.name}
            onChange={e => onUpdate({ sender: { ...invoiceData.sender, name: e.target.value } })}
          />
        </motion.div>
        <motion.div whileFocus={{ scale: 1.01 }} className="group">
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide group-focus-within:text-orange-600 transition-colors">Email</label>
          <input
            type="email"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            value={invoiceData.sender.email}
            onChange={e => onUpdate({ sender: { ...invoiceData.sender, email: e.target.value } })}
          />
        </motion.div>
        <motion.div whileFocus={{ scale: 1.01 }} className="group">
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide group-focus-within:text-orange-600 transition-colors">GST Number</label>
          <input
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            value={invoiceData.sender.gst}
            onChange={e => onUpdate({ sender: { ...invoiceData.sender, gst: e.target.value } })}
          />
        </motion.div>
        <motion.div whileFocus={{ scale: 1.01 }} className="group col-span-2">
          <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide group-focus-within:text-orange-600 transition-colors">Address</label>
          <textarea
            rows="2"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
            value={invoiceData.sender.address}
            onChange={e => onUpdate({ sender: { ...invoiceData.sender, address: e.target.value } })}
          />
        </motion.div>
      </div>
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

export default AgencyStep;
