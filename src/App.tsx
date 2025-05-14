import React from 'react';
import { ShieldCheck } from 'lucide-react';
import BarcodeGenerator from './components/BarcodeGenerator';

function App() {
  return (
    <div className="min-h-screen bg-[#2A2A2A] text-white">
      <header className="bg-black/30 backdrop-blur-md border-b border-white/10 shadow-lg">
        <div className="container mx-auto flex items-center p-4">
          <ShieldCheck className="mr-2 text-blue-400" size={24} />
          <h1 className="text-xl font-bold">AAMVA PDF417 Generator</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto glass-panel p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">AAMVA-Compliant Barcode Generator</h2>
          <p className="text-white/80 mb-4">
            Generate PDF417 barcodes that strictly follow AAMVA (American Association of Motor Vehicle Administrators) 
            standards for driver's licenses and ID cards. This tool formats data according to AAMVA Version 8.1 
            specifications with proper header codes, compliance indicators, and checksums.
          </p>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="bg-blue-500/20 text-blue-300 px-3 py-1.5 rounded-full border border-blue-500/20">AAMVA 8.1+</span>
            <span className="bg-green-500/20 text-green-300 px-3 py-1.5 rounded-full border border-green-500/20">Error Correction L5</span>
            <span className="bg-purple-500/20 text-purple-300 px-3 py-1.5 rounded-full border border-purple-500/20">3:1 Aspect Ratio</span>
            <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1.5 rounded-full border border-yellow-500/20">Machine-Readable</span>
          </div>
        </div>
        
        <BarcodeGenerator />
      </main>
      
      <footer className="border-t border-white/10 mt-12 py-4">
        <div className="container mx-auto px-4 text-center text-white/60 text-sm">
          <p>AAMVA PDF417 Generator &copy; 2025 | This tool follows AAMVA Version 8.1+ specifications</p>
        </div>
      </footer>
    </div>
  );
}

export default App;