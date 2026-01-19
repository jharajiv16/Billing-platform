import React from 'react';
import { motion } from 'framer-motion';

const StepNavigation = ({ steps, currentStep, setCurrentStep }) => {
  return (
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
  );
};

export default StepNavigation;
