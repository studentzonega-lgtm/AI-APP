import React, { useEffect, useState } from 'react';
import { Loader2, BrainCircuit, FileText, Database } from 'lucide-react';

export const LoadingState: React.FC = () => {
  const [step, setStep] = useState(0);
  const steps = [
    "Reading document structure...",
    "Extracting key methodologies...",
    "Converting equations to LaTeX...",
    "Formatting JSON database...",
    "Finalizing summary..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-700">
      
      {/* Animation Container */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
        <div className="relative w-24 h-24 bg-white rounded-3xl shadow-xl flex items-center justify-center border border-indigo-100">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
        
        {/* Floating Icons */}
        <div className="absolute -top-4 -right-4 bg-white p-2 rounded-xl shadow-lg border border-slate-100 animate-bounce [animation-delay:-0.3s]">
          <FileText className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="absolute -bottom-2 -left-4 bg-white p-2 rounded-xl shadow-lg border border-slate-100 animate-bounce [animation-delay:-0.15s]">
          <BrainCircuit className="w-5 h-5 text-purple-500" />
        </div>
        <div className="absolute bottom-6 -right-8 bg-white p-2 rounded-xl shadow-lg border border-slate-100 animate-bounce">
          <Database className="w-5 h-5 text-amber-500" />
        </div>
      </div>

      <h3 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Paper</h3>
      
      {/* Text Carousel */}
      <div className="h-8 relative w-full max-w-md text-center overflow-hidden">
        {steps.map((text, index) => (
          <div
            key={text}
            className={`absolute inset-0 transition-all duration-500 transform
              ${index === step ? 'translate-y-0 opacity-100' : 
                index < step ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0'}
            `}
          >
            <p className="text-indigo-600 font-medium">{text}</p>
          </div>
        ))}
      </div>
      
      <p className="mt-4 text-slate-400 text-sm max-w-xs text-center mx-auto">
        Deep reading in progress. This may take up to a minute.
      </p>
    </div>
  );
};