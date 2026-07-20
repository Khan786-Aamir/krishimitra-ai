import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Camera, Scan, CheckCircle, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';

export const AIDiseasePreview = () => {
  const [scanState, setScanState] = useState('idle'); // 'idle' | 'scanning' | 'complete'
  const [selectedSample, setSelectedSample] = useState(null);

  const samples = [
    { id: 1, name: 'Paddy Rice Blast', emoji: '🌾', crop: 'Rice', diagnosis: 'Magnaporthe oryzae (Blast)', confidence: 97, severity: 'Critical', recommendation: 'Apply Tricyclazole 75% WP at 0.6g/L and clear surrounding field drains immediately.' },
    { id: 2, name: 'Wheat Leaf Rust', emoji: '🌱', crop: 'Wheat', diagnosis: 'Puccinia triticina (Rust)', confidence: 92, severity: 'Warning', recommendation: 'Spray Propiconazole 25% EC at 1ml/L and consult crop advisory for rust-resistant cultivars.' },
    { id: 3, name: 'Cotton Blight', emoji: '☁️', crop: 'Cotton', diagnosis: 'Xanthomonas citri (Blight)', confidence: 95, severity: 'Critical', recommendation: 'Streptocycline 100 ppm spray and select disease-free certified sowing seeds.' }
  ];

  const handleStartScan = (sample) => {
    setSelectedSample(sample);
    setScanState('scanning');
    setTimeout(() => {
      setScanState('complete');
    }, 2000);
  };

  const resetScan = () => {
    setScanState('idle');
    setSelectedSample(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 border border-primary/20 text-primary rounded-full">
            Coming in Module 11
          </span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight font-display mt-2">AI Disease Detection</h1>
        <p className="text-xs text-text/40 font-semibold mt-1">
          Gemini-powered plant pathology engine. Scan leaf symptoms for instant formulations.
        </p>
      </div>

      {/* Simulator Lab Box */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-glass-lg relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
        
        <div className="p-6 border-b border-border/50 flex justify-between items-center bg-surface/30">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-xs font-bold text-text uppercase tracking-wider">AI Diagnostic Laboratory</span>
          </div>
          {scanState !== 'idle' && (
            <button
              onClick={resetScan}
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Scanner
            </button>
          )}
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {scanState === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center space-y-6 max-w-md mx-auto"
              >
                <div className="w-20 h-20 bg-surface border border-border flex items-center justify-center rounded-2xl mx-auto shadow-inner text-4xl">
                  📸
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-text">Choose a leaf sample to simulate scan</h3>
                  <p className="text-xs text-text/40 leading-relaxed font-semibold">
                    Simulate camera picture upload to test our Gemini Vision diagnostics and formulation recommendations.
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  {samples.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleStartScan(sample)}
                      className="px-4 py-4 bg-surface hover:bg-border/60 border border-border rounded-2xl flex flex-col items-center gap-1.5 transition-all text-xs font-bold w-28 active:scale-95 cursor-pointer shadow-premium"
                    >
                      <span className="text-3xl">{sample.emoji}</span>
                      <span className="text-text/80">{sample.crop} Sample</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {scanState === 'scanning' && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 space-y-6 max-w-sm mx-auto"
              >
                <div className="relative w-20 h-20 mx-auto">
                  <Scan className="w-20 h-20 text-primary animate-pulse" />
                  <motion.div
                    className="absolute inset-x-0 h-0.5 bg-primary shadow-glow-primary"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-text animate-pulse">Running crop diagnostic neural nets...</p>
                  <p className="text-xs text-text/40 font-semibold">Verifying leaf chlorophyll structure and pathogen matrices</p>
                </div>
              </motion.div>
            )}

            {scanState === 'complete' && selectedSample && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 max-w-xl mx-auto"
              >
                <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
                  <CheckCircle className="w-6 h-6 text-primary shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-text">Pathology Diagnostic Completed</h4>
                    <p className="text-[10px] text-text/40 font-semibold mt-0.5">Scanned Leaf Match Index: {selectedSample.confidence}%</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3.5 bg-surface/50 border border-border/40 rounded-xl space-y-0.5">
                    <span className="block text-[9px] uppercase font-bold text-text/40 tracking-wider">Detected Pathogen</span>
                    <span className="block text-sm font-extrabold text-red-400 mt-1 flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4 shrink-0" />
                      {selectedSample.diagnosis}
                    </span>
                  </div>
                  <div className="p-3.5 bg-surface/50 border border-border/40 rounded-xl space-y-0.5">
                    <span className="block text-[9px] uppercase font-bold text-text/40 tracking-wider">Severity Level</span>
                    <span className="block text-sm font-extrabold text-amber-400 mt-1 uppercase tracking-wider">
                      {selectedSample.severity}
                    </span>
                  </div>
                </div>

                <div className="p-4.5 bg-surface border border-border rounded-xl space-y-2">
                  <span className="block text-[9px] uppercase font-bold text-text/40 tracking-wider">Recommended Treatment Plan</span>
                  <p className="text-xs text-text/80 leading-relaxed font-semibold">
                    {selectedSample.recommendation}
                  </p>
                </div>

                <button
                  onClick={resetScan}
                  className="w-full py-2.5 bg-primary text-white text-xs font-bold rounded-xl hover:bg-primary-dark transition-all cursor-pointer shadow-lg shadow-primary/10"
                >
                  Scan New Sample
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AIDiseasePreview;
