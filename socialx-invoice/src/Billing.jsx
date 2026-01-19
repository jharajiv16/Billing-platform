import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronRight,
  ChevronLeft,
  LayoutTemplate,
  Sparkles,
  CreditCard,
  Building
} from 'lucide-react';
import { useInvoice } from './hooks/useInvoice';
import { generatePDF } from './services/api';
import StepNavigation from './components/invoice/StepNavigation';
import DetailsStep from './components/invoice/steps/DetailsStep';
import ItemsStep from './components/invoice/steps/ItemsStep';
import AgencyStep from './components/invoice/steps/AgencyStep';
import PaymentStep from './components/invoice/steps/PaymentStep';
import ReviewStep from './components/invoice/steps/ReviewStep';

/**
 * Main Billing Component
 * Handles the multi-step invoice generation process.
 * Refactored to use sub-components and custom hooks.
 */
const Billing = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [currency] = useState('INR');
  const [showCommission] = useState(false);
  const [commissionRate] = useState(15);
  const [gstRate, setGstRate] = useState(18); // Kept local as it might be transient, or could be moved to invoiceData
  const [isDownloading, setIsDownloading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [validationError, setValidationError] = useState(null);

  // Initial Data for the hook
  const initialData = {
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
  };

  // Use Custom Hook for Data Management
  const { data: invoiceData, updateData, save, loading: isSaving, error: saveError } = useInvoice(initialData);

  const currencySymbol = currency === 'INR' ? '₹' : '$';

  // Combined error state
  const error = saveError || validationError;

  const validateInvoice = () => {
    if (!invoiceData.client.name.trim()) {
      return 'Client Name is required in Details step.';
    }
    if (invoiceData.items.length === 0) {
      return 'At least one item is required.';
    }
    if (invoiceData.items.some(i => !i.description.trim())) {
      return 'All items must have a description.';
    }
    return null;
  };

  const handleDownload = async () => {
    const vError = validateInvoice();
    if (vError) {
      setValidationError(vError);
      setTimeout(() => setValidationError(null), 3000);
      return;
    }

    setIsDownloading(true);
    setValidationError(null);
    try {
      // Pass gstRate as it's used in calculation but might not be in data
      const pdfData = { ...invoiceData, gstRate, taxRate: gstRate }; 
      const blob = await generatePDF(pdfData);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${invoiceData.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      setValidationError('Failed to generate PDF. Is the backend running?');
      setTimeout(() => setValidationError(null), 5000);
    } finally {
      setIsDownloading(false);
    }
  };

  const saveInvoice = async () => {
    const vError = validateInvoice();
    if (vError) {
      setValidationError(vError);
      setTimeout(() => setValidationError(null), 3000);
      return;
    }

    try {
      await save();
      setSuccessMessage('Invoice saved successfully!');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      // Error handled by hook's error state, but we ensure it clears
      setTimeout(() => setValidationError(null), 5000);
    }
  };

  const steps = [
    { name: 'Details', icon: <LayoutTemplate size={20} />, activeColor: 'text-violet-600', activeBg: 'bg-violet-100', borderColor: 'border-violet-600' },
    { name: 'Items', icon: <Sparkles size={20} />, activeColor: 'text-pink-600', activeBg: 'bg-pink-100', borderColor: 'border-pink-600' },
    { name: 'Agency', icon: <Building size={20} />, activeColor: 'text-orange-600', activeBg: 'bg-orange-100', borderColor: 'border-orange-600' },
    { name: 'Payment', icon: <CreditCard size={20} />, activeColor: 'text-blue-600', activeBg: 'bg-blue-100', borderColor: 'border-blue-600' },
    { name: 'Review', icon: <CheckCircle2 size={20} />, activeColor: 'text-emerald-600', activeBg: 'bg-emerald-100', borderColor: 'border-emerald-600' }
  ];

  const renderStep = () => {
    const commonProps = {
      invoiceData,
      onUpdate: updateData,
      showCommission,
      commissionRate,
      gstRate,
      setGstRate,
      currencySymbol
    };

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
            case 0: return <DetailsStep {...commonProps} />;
            case 1: return <ItemsStep {...commonProps} />;
            case 2: return <AgencyStep {...commonProps} />;
            case 3: return <PaymentStep {...commonProps} />;
            case 4: return <ReviewStep {...commonProps} />;
            default: return null;
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
          <StepNavigation steps={steps} currentStep={currentStep} setCurrentStep={setCurrentStep} />
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
                        {isDownloading ? 'Downloading...' : 'Download PDF'}
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
