import React, { useState } from 'react';
import { ParsedResponse, TabOption } from '../types';
import { Copy, Check, Download, FileJson, FileText, Code, FileOutput } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ResultsViewProps {
  data: ParsedResponse;
}

export const ResultsView: React.FC<ResultsViewProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState<TabOption>('summary');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleDownload = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs: { id: TabOption; label: string; icon: React.ReactNode }[] = [
    { id: 'summary', label: 'Summary', icon: <FileText className="w-4 h-4" /> },
    { id: 'latex', label: 'LaTeX Source', icon: <Code className="w-4 h-4" /> },
    { id: 'json', label: 'Structured JSON', icon: <FileJson className="w-4 h-4" /> },
  ];

  const activeContent = activeTab === 'summary' ? data.summary :
                        activeTab === 'latex' ? data.latex :
                        JSON.stringify(data.database, null, 2);

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col h-[850px] animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Tabs Control */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex p-1 bg-slate-200/60 rounded-xl backdrop-blur-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200
                ${activeTab === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-black/5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
           <button
            onClick={() => handleCopy(activeContent, activeTab)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-indigo-600 transition-colors shadow-sm"
           >
             {copied === activeTab ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
             {copied === activeTab ? 'Copied' : 'Copy'}
           </button>
           <button
            onClick={() => {
                const ext = activeTab === 'summary' ? 'md' : activeTab === 'latex' ? 'tex' : 'json';
                const mime = activeTab === 'json' ? 'application/json' : 'text/plain';
                handleDownload(activeContent, `research_analysis.${ext}`, mime);
            }}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
           >
             <Download className="w-4 h-4" />
             Download
           </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden bg-white rounded-2xl shadow-xl border border-slate-200/60 flex flex-col">
        {/* Header Strip */}
        <div className="h-8 bg-slate-100 border-b border-slate-200/80 flex items-center px-4 space-x-2">
           <div className="w-3 h-3 rounded-full bg-slate-300"></div>
           <div className="w-3 h-3 rounded-full bg-slate-300"></div>
           <div className="w-3 h-3 rounded-full bg-slate-300"></div>
           <div className="ml-4 text-xs text-slate-500 font-mono">
             {activeTab === 'summary' ? 'preview.md' : activeTab === 'latex' ? 'source.tex' : 'database.json'}
           </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar relative">
          
          {activeTab === 'summary' && (
            <div className="p-8 md:p-12 max-w-4xl mx-auto">
              <article className="prose prose-slate prose-lg max-w-none 
                prose-headings:text-slate-900 prose-headings:font-bold prose-headings:tracking-tight
                prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
                prose-strong:text-slate-800
                prose-blockquote:border-l-4 prose-blockquote:border-indigo-200 prose-blockquote:bg-slate-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:text-slate-600 prose-blockquote:font-normal
                prose-code:text-indigo-600 prose-code:bg-indigo-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-slate-900 prose-pre:shadow-lg
                prose-li:marker:text-indigo-400
              ">
                <ReactMarkdown>{data.summary}</ReactMarkdown>
              </article>
            </div>
          )}

          {(activeTab === 'latex' || activeTab === 'json') && (
            <div className="min-h-full code-bg text-slate-200 p-6 font-mono text-sm leading-relaxed overflow-auto">
              <pre><code className={activeTab === 'json' ? 'text-[#a5b4fc]' : ''}>{activeContent}</code></pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};