import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import InvoicePreview from '../InvoicePreview';

const ReviewStep = ({ invoiceData, showCommission, commissionRate, gstRate, currencySymbol }) => {
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

export default ReviewStep;
