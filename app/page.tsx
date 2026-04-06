'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Trash2, FileText, ChevronLeft, Download, RotateCcw, Loader2 } from 'lucide-react';

type Step = 'splash' | 'upload' | 'review' | 'analyzing' | 'results';

export default function AttendanceApp() {
  const [step, setStep] = useState<Step>('splash');
  const [images, setImages] = useState<string[]>([]);
  const [data, setData] = useState<any>(null);

  // 3-second Splash Screen timer
  useEffect(() => {
    if (step === 'splash') {
      const timer = setTimeout(() => setStep('upload'), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImages]);
      setStep('review');
    }
  };

  const startAnalysis = async () => {
    setStep('analyzing');
    try {
      // In a real app, you'd convert the image to base64 here
      // For this "Live Demo" version, we simulate the AI logic
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: images[0] }),
      });
      const result = await res.json();
      setData(result);
      setStep('results');
    } catch (err) {
      console.error(err);
      setStep('review');
      alert("AI Analysis failed. Check your API key in .env.local");
    }
  };

  return (
    <main className="relative min-h-screen text-white overflow-hidden font-sans selection:bg-red-500">
      
      {/* --- BACKGROUND LAYER --- */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center scale-105"
        style={{ backgroundImage: "url('/bg-gate.jpg')" }} 
      >
        {/* Figma Gradient Overlay (High Transparency: 0.4 - 0.7) */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, 
              rgba(153, 80, 72, 0.4) 0%, 
              rgba(118, 30, 20, 0.55) 50%, 
              rgba(62, 23, 34, 0.75) 100%
            )`
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        
        {/* --- 1. SPLASH SCREEN --- */}
        {step === 'splash' && (
          <motion.div 
            key="splash"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col items-center justify-center h-screen p-6 text-center"
          >
            <div className="mb-12">
               <h2 className="text-2xl tracking-[0.25em] font-bold text-white drop-shadow-xl">S.C.S(A) COLLEGE</h2>
               <p className="text-[10px] uppercase opacity-80 tracking-[0.4em] mt-2 font-medium">Attendance Report Generator</p>
            </div>
            
            <div className="w-60 h-60 bg-white rounded-full flex items-center justify-center mb-12 shadow-[0_0_60px_rgba(255,255,255,0.2)] border-8 border-white/10">
               <img src="/logo.png" alt="Logo" className="w-48 h-48 object-contain" />
            </div>

            <h1 className="text-3xl font-black tracking-tighter uppercase mb-2">Chemistry Department</h1>
            
            <div className="absolute bottom-12">
              <p className="text-[9px] uppercase opacity-60 tracking-[0.3em] mb-2">Designed & Developed By</p>
              <p className="text-lg font-bold tracking-wide italic">Abinash Lenka</p>
            </div>
          </motion.div>
        )}

        {/* --- 2. UPLOAD SCREEN --- */}
        {step === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 p-8 flex flex-col h-screen">
            <h2 className="text-3xl font-bold mt-16 text-center leading-tight">Upload Register<br/>Images</h2>
            <p className="text-center text-sm opacity-70 mb-12 mt-2 font-medium">Capture or upload your attendance pages</p>
            
            <div className="flex-1 bg-white/10 backdrop-blur-md border-2 border-dashed border-white/20 rounded-[2.5rem] flex flex-col items-center justify-center mb-12">
              <Camera size={48} className="opacity-20 mb-4" />
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">Ready for input</p>
            </div>

            <div className="flex flex-col gap-4 mb-10">
              <label className="bg-white text-[#761E14] py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all cursor-pointer">
                <Camera size={20} /> Click To Capture
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleUpload} />
              </label>
              
              <label className="bg-white/10 backdrop-blur-md border border-white/20 py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm uppercase tracking-widest active:scale-95 transition-all cursor-pointer">
                <Upload size={18} /> From Device
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
              </label>
            </div>
          </motion.div>
        )}

        {/* --- 3. REVIEW SCREEN --- */}
        {step === 'review' && (
          <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 p-6 flex flex-col h-screen">
            <h2 className="text-2xl font-bold mt-12 text-center">Review Pages</h2>
            <p className="text-center text-sm opacity-60 mb-8 font-medium">Verify your images before analysis</p>
            
            <div className="grid grid-cols-2 gap-4 flex-1 overflow-auto pb-40 px-2">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-black/20">
                  <img src={img} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                    className="absolute top-2 right-2 bg-red-600 p-2 rounded-xl"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="fixed bottom-0 left-0 w-full p-8 flex gap-4 bg-gradient-to-t from-[#3E1722] to-transparent">
              <button onClick={() => setStep('upload')} className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest">
                Add More
              </button>
              <button 
                onClick={startAnalysis}
                className="flex-1 bg-white text-[#3E1722] py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
              >
                Analyze AI
              </button>
            </div>
          </motion.div>
        )}

        {/* --- 4. ANALYZING SCREEN --- */}
        {step === 'analyzing' && (
          <motion.div key="analyzing" className="relative z-10 h-screen flex flex-col items-center justify-center p-10 text-center">
            <div className="relative mb-12">
              <div className="w-44 h-56 bg-white/5 backdrop-blur-2xl rounded-[3rem] flex items-center justify-center border border-white/10">
                <FileText size={80} className="text-white/20" />
              </div>
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="absolute -bottom-6 -right-6 w-20 h-20 border-[6px] border-white border-t-transparent rounded-full shadow-2xl"
              />
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tight">AI is Reading..</h2>
            <p className="opacity-60 text-xs uppercase tracking-[0.2em] max-w-[250px] mx-auto leading-relaxed">Processing marks and roll numbers from your register</p>
          </motion.div>
        )}

        {/* --- 5. RESULTS SCREEN --- */}
        {step === 'results' && (
          <motion.div key="results" initial={{ y: '100%' }} animate={{ y: 0 }} className="relative z-10 h-screen flex flex-col bg-[#3E1722]">
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-4">
                <button onClick={() => setStep('review')} className="bg-white/10 p-3 rounded-2xl"><ChevronLeft size={20}/></button>
                <div>
                   <h3 className="font-black text-xs uppercase tracking-widest">Attendance Table</h3>
                   <p className="text-[10px] opacity-40 uppercase font-bold mt-1">Chemistry Department</p>
                </div>
              </div>
              <button onClick={() => {setImages([]); setStep('upload');}} className="p-2 opacity-30"><RotateCcw size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead className="sticky top-0 bg-white text-[#3E1722] z-20">
                  <tr>
                    <th className="p-4 text-center w-20 font-black">ROLL</th>
                    <th className="p-4 text-left font-black uppercase tracking-widest">STUDENT NAME</th>
                    <th className="p-4 text-center w-12 font-black">ATT</th>
                    <th className="p-4 text-center w-12 font-black">%</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.students.map((s: any, i: number) => {
                    const perc = ((s.attended / (data.totalClasses || 14)) * 100);
                    const isDefaulter = perc < 75;
                    return (
                      <tr key={i} className={`border-b border-white/5 ${isDefaulter ? "bg-red-500/10" : "bg-transparent"}`}>
                        <td className="p-4 text-center opacity-60 font-mono font-bold text-white/80">{s.rollNo}</td>
                        <td className="p-4 font-bold tracking-tight text-white">{s.name}</td>
                        <td className="p-4 text-center opacity-60 text-white/80">{s.attended}</td>
                        <td className={`p-4 text-center font-black ${isDefaulter ? "text-red-400" : "text-green-400"}`}>
                          {perc.toFixed(0)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-8 grid grid-cols-2 gap-4 bg-[#3E1722] border-t border-white/10 shadow-2xl">
              <button className="bg-white/5 border border-white/20 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <Download size={16} /> Export PDF
              </button>
              <button className="bg-white text-[#3E1722] py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-xl">
                <Download size={16} /> Export Excel
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}