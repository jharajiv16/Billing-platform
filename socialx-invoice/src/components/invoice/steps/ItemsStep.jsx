import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus } from 'lucide-react';
import InvoicePreview from '../InvoicePreview';

const ItemsStep = ({ invoiceData, onUpdate, showCommission, commissionRate, gstRate, currencySymbol }) => {
  const handleItemChange = (id, field, value) => {
    onUpdate({
      items: invoiceData.items.map(i =>
        i.id === id ? { ...i, [field]: value } : i
      )
    });
  };

  const addItem = () => {
    onUpdate({
      items: [
        ...invoiceData.items,
        { id: Date.now(), description: '', quantity: 1, rate: 0 }
      ]
    });
  };

  const removeItem = id => {
    if (invoiceData.items.length > 1) {
      onUpdate({
        items: invoiceData.items.filter(i => i.id !== id)
      });
    }
  };

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

export default ItemsStep;
