import { useState } from 'react';
import { Sparkles, Github, ArrowUpRight, Database, FileSpreadsheet, ScanLine, Bot, Zap, BrainCircuit } from 'lucide-react';
import { FileUpload } from './components/FileUpload';
import { ResultsView } from './components/ResultsView';
import { LoadingState } from './components/LoadingState';
import { analyzePdf } from './services/geminiService';
import { AppStatus, ExtractedDataset, ModelOption } from './types';

function App() {
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [result, setResult] = useState<ExtractedDataset | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<ModelOption>('gemini-2.5-flash');

  const handleFileSelect = async (base64: string) => {
    setStatus(AppStatus.PROCESSING);
    setError(null);
    setResult(null);

    try {
      const data = await analyzePdf(base64, selectedModel);
      setResult(data);
      setStatus(AppStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while analyzing the PDF.");
      setStatus(AppStatus.ERROR);
    }
  };

  const resetApp = () => {
    setStatus(AppStatus.IDLE);
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden text-slate-900">
      
      {/* Background Gradient */}
      <div 
        className="fixed top-0 left-0 w-full h-full -z-10"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(124, 58, 237, 0.1), transparent), radial-gradient(ellipse 80% 50% at 50% 120%, rgba(124, 58, 237, 0.1), transparent)"
        }}
      ></div>

      {/* Navigation */}
      <header className="fixed w-full top-0 z-50 glass border-b border-white/20 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={resetApp}
          >
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2 rounded-xl shadow-lg group-hover:shadow-indigo-500/30 transition-shadow">
              <Database className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
              ScholarParse <span className="font-light text-slate-500">Dataset</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4">
             {/* Model Selector */}
             <div className="hidden md:flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                <button
                  onClick={() => setSelectedModel('gemini-2.5-flash')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    selectedModel === 'gemini-2.5-flash' 
                    ? 'bg-white text-amber-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  Gemini Flash (Fast)
                </button>
                <button
                  onClick={() => setSelectedModel('gemini-3-pro-preview')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                    selectedModel === 'gemini-3-pro-preview' 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <BrainCircuit className="w-3.5 h-3.5" />
                  Gemini Pro (Deep)
                </button>
             </div>

             <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200/60 shadow-sm backdrop-blur-sm">
               <Sparkles className={`w-4 h-4 ${selectedModel === 'gemini-3-pro-preview' ? 'text-indigo-500' : 'text-amber-500'}`} />
               <span className="text-xs font-semibold text-slate-600 tracking-wide uppercase">
                 {selectedModel === 'gemini-3-pro-preview' ? 'High Precision' : 'High Speed'}
               </span>
             </div>

             <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors transform hover:scale-110">
               <Github className="w-6 h-6" />
             </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative z-10 flex flex-col items-center">
        
        {/* Header Text */}
        {status === AppStatus.IDLE && (
          <div className="text-center mb-16 max-w-4xl mx-auto animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tighter leading-tight">
              Build AI Datasets from <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
                Research Papers
              </span>
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Upload PDF. Get raw, page-by-page JSON extraction. <br/> No hallucinations. No summaries. Perfect for fine-tuning other AI models.
            </p>
          </div>
        )}

        {/* Upload Section */}
        {status === AppStatus.IDLE && (
          <div className="w-full max-w-3xl animate-fade-in-up [animation-delay:200ms]">
            <FileUpload onFileSelect={(base64) => handleFileSelect(base64)} disabled={false} />
            
            {/* Capability Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left">
              {[
                { 
                  icon: <ScanLine className="w-6 h-6 text-emerald-500" />, 
                  title: "Page-by-Page", 
                  desc: "Strict extraction mapped to page numbers. Preserves document structure." 
                },
                { 
                  icon: <FileSpreadsheet className="w-6 h-6 text-sky-500" />, 
                  title: "Raw Data Only", 
                  desc: "Tables, figures, and text extracted exactly as is. No summarization." 
                },
                { 
                  icon: <Database className="w-6 h-6 text-amber-500" />, 
                  title: "Training Ready", 
                  desc: "Exports clean JSON perfectly formatted for AI model instruction/training." 
                },
              ].map((feature, i) => (
                <div key={i} className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all">
                  <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center shadow-sm border border-slate-100 mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-slate-900 mb-1">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading Section */}
        {status === AppStatus.PROCESSING && (
           <div className="w-full max-w-2xl mt-8">
             <LoadingState />
           </div>
        )}

        {/* Error Display */}
        {status === AppStatus.ERROR && (
          <div className="max-w-xl w-full mx-auto mt-8 p-8 bg-white border border-red-100 rounded-3xl shadow-xl text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bot className="w-8 h-8"/>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Extraction Failed</h3>
            <p className="text-slate-500 mb-8 leading-relaxed">{error}</p>
            <button 
              onClick={resetApp}
              className="px-8 py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10 hover:shadow-xl hover:shadow-slate-900/20 transform hover:-translate-y-0.5"
            >
              Upload Another File
            </button>
          </div>
        )}

        {/* Results Section */}
        {status === AppStatus.SUCCESS && result && (
          <div className="w-full">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-8 animate-in slide-in-from-bottom-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-2 inline-block">
                  Extraction Complete
                </span>
                <h2 className="text-3xl font-bold text-slate-900">Dataset Generated</h2>
                <p className="text-slate-500 mt-1">
                  {result.pages.length} pages processed. Ready for export.
                </p>
              </div>
              <button 
                onClick={resetApp}
                className="mt-4 md:mt-0 flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                Extract New Dataset
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
            <ResultsView data={result} />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/80 bg-white/50 backdrop-blur-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 font-medium">
            &copy; {new Date().getFullYear()} ScholarParse AI. All rights reserved.
          </p>
          <p className="text-sm text-slate-400">
            Professional Dataset Extraction Tool.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;