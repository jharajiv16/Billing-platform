import React from 'react';
import { motion } from 'framer-motion';
import { Building, Percent } from 'lucide-react';
import InvoicePreview from '../InvoicePreview';

const PaymentStep = ({ invoiceData, onUpdate, gstRate, setGstRate, showCommission, commissionRate, currencySymbol }) => {
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
              onChange={e => onUpdate({ bank: { ...invoiceData.bank, name: e.target.value } })}
            />
          </motion.div>
          <motion.div whileFocus={{ scale: 1.01 }} className="grid grid-cols-2 gap-4">
            <input
              placeholder="Account Number"
              className="w-full bg-white border border-transparent shadow-sm rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono"
              value={invoiceData.bank.account}
              onChange={e => onUpdate({ bank: { ...invoiceData.bank, account: e.target.value } })}
            />
            <input
              placeholder="IFSC Code"
              className="w-full bg-white border border-transparent shadow-sm rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-mono uppercase"
              value={invoiceData.bank.ifsc}
              onChange={e => onUpdate({ bank: { ...invoiceData.bank, ifsc: e.target.value } })}
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

export default PaymentStep;
