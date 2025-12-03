import React, { useState } from 'react';
import { ExtractedDataset, ViewOption } from '../types';
import { Copy, Check, Download, FileJson, AlignLeft } from 'lucide-react';

interface ResultsViewProps {
  data: ExtractedDataset;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<ViewOption>('json');
  const [copied, setCopied] = useState<string | null>(null);

  const getFormattedJson = () => JSON.stringify(data, null, 2);
  
  const getRawText = () => {
    return data.pages.map(p => `--- PAGE ${p.page_number} ---\n\n${p.text_content}\n`).join('\n');
  };

  const activeContent = activeTab === 'json' ? getFormattedJson() : getRawText();

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(activeTab);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = () => {
    const filename = `dataset_${data.metadata.title.replace(/\s+/g, '_').toLowerCase()}.json`;
    const blob = new Blob([getFormattedJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col h-[850px] animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Tabs Control */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex p-1 bg-slate-200/60 rounded-xl backdrop-blur-sm">
          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200
              ${activeTab === 'json'
                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
          >
            <FileJson className="w-4 h-4" />
            JSON Dataset
          </button>
          <button
            onClick={() => setActiveTab('raw_text')}
            className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200
              ${activeTab === 'raw_text'
                ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
          >
            <AlignLeft className="w-4 h-4" />
            Raw Text (Page-wise)
          </button>
        </div>

        <div className="flex items-center gap-2">
           <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm"
           >
             {copied === activeTab ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
             {copied === activeTab ? 'Copied' : 'Copy'}
           </button>
           <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
           >
             <Download className="w-4 h-4" />
             Download Dataset
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden bg-white rounded-2xl shadow-xl border border-slate-200/60 flex flex-col">
        {/* Header Strip */}
        <div className="h-8 bg-slate-100 border-b border-slate-200/80 flex items-center px-4 space-x-2 justify-between">
           <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              <div className="w-3 h-3 rounded-full bg-slate-300"></div>
              <div className="w-3 h-3 rounded-full bg-slate-300"></div>
           </div>
           <div className="text-xs text-slate-500 font-mono">
             {data.pages.length} Pages Extracted
           </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar relative code-bg">
          <div className="min-h-full text-slate-200 p-6 font-mono text-sm leading-relaxed overflow-auto">
             <pre><code className={activeTab === 'json' ? 'text-[#a5b4fc]' : 'text-slate-300'}>{activeContent}</code></pre>
          </div>
        </div>
      </div>
    </div>
  );
};
