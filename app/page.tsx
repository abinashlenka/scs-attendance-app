'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Trash2, FileText, ChevronLeft, Download, RotateCcw } from 'lucide-react';

// --- Junior Dev Note: Transparency Tuned for Visibility ---
// Top: 40% opacity | Middle: 60% opacity | Bottom: 85% opacity
// This allows bg-gate.jpg to show through while keeping the Figma colors.

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
      // Convert files to local URLs for previewing
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      setImages((prev) => [...prev, ...newImages]);
      setStep('review');
    }
  };

  const startAnalysis = async () => {
    setStep('analyzing');
    try {
      // We convert the first image to base64 for the Gemini API
      const response = await fetch(images[0]);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64data = reader.result;
        
        const res = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64data }),
        });
        
        const result = await res.json();
        setData(result);
        setStep('results');
      };
      reader.readAsDataURL(blob);

    } catch (err) {
      console.error(err);
      alert("AI Scan failed. Please check your internet and API key.");
      setStep('review');
    }
  };

  return (
    <main className="relative min-h-screen text-white overflow-hidden font-sans bg-[#120505]">
      
      {/* --- BACKGROUND LAYER (The Gate Image) --- */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center scale-110"
        style={{ backgroundImage: "url('/bg-gate.jpg')" }} 
      >
        {/* --- FIGMA GRADIENT OVERLAY (Adjusted for Transparency) --- */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, 
              rgba(153, 80, 72, 0.40) 0%, 
              rgba(118, 30, 20, 0.60) 50%, 
              rgba(62, 23, 34, 0.85) 100%
            )`
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        
        {/* 1. SPLASH SCREEN */}
        {step === 'splash' && (
          <motion.div 
            key="splash"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="relative z-10 flex flex-col items-center justify-center h-screen p-6 text-center"
          >
            <div className="mb-14">
               <h2 className="text-[24px] tracking-[0.25em] font-bold text-white drop-shadow-2xl">S.C.S(A) COLLEGE</h2>
               <p className="text-[10px] uppercase opacity-70 tracking-[0.35em] mt-3 font-semibold">Attendance Report Generator</p>
            </div>
            
            <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center mb-14 shadow-[0_0_50px_rgba(255,255,255,0.15)] border-8 border-white/5">
               <img src="/logo.png" alt="SCS Logo" className="w-48 h-48 object-contain" />
            </div>

            <h1 className="text-3xl font-black tracking-tighter uppercase mb-4 leading-none">Chemistry<br />Department</h1>
            
            <div className="absolute bottom-16">
              <p className="text-[10px] uppercase opacity-50 tracking-[0.3em] mb-2 font-bold">Designed & Developed By</p>
              <p className="text-xl font-bold tracking-wide italic">Abinash Lenka</p>
            </div>
          </motion.div>
        )}

        {/* 2. UPLOAD SCREEN */}
        {step === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 p-8 flex flex-col h-screen">
            <h2 className="text-3xl font-bold mt-16 text-center leading-tight">Upload Register<br/>Images</h2>
            <p className="text-center text-sm opacity-60 mb-12 mt-2">Take a photo of your attendance page</p>
            
            <div className="flex-1 bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/20 rounded-[3rem] flex flex-col items-center justify-center mb-12 shadow-2xl">
              <Camera size={48} className="opacity-20 mb-4" />
              <div className="w-12 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="flex flex-col gap-5 mb-12">
              <label className="bg-white text-[#761E14] py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest shadow-2xl active:scale-95 transition-all cursor-pointer">
                <Camera size={20} /> Click To Capture
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleUpload} />
              </label>
              
              <div className="flex items-center gap-4">
                <div className="flex-1 h-[1px] bg-white/20" />
                <span className="text-[10px] font-bold uppercase opacity-30">Or</span>
                <div className="flex-1 h-[1px] bg-white/20" />
              </div>

              <label className="bg-white/10 backdrop-blur-md border border-white/20 py-5 rounded-2xl flex items-center justify-center gap-3 font-bold text-sm uppercase tracking-widest active:scale-95 transition-all cursor-pointer">
                <Upload size={18} /> From Gallery
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
              </label>
            </div>
          </motion.div>
        )}

        {/* 3. REVIEW SCREEN */}
        {step === 'review' && (
          <motion.div key="review" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10 p-6 flex flex-col h-screen">
            <h2 className="text-2xl font-bold mt-14 text-center">Confirm Images</h2>
            <p className="text-center text-sm opacity-60 mb-8">Ensure the handwriting is clearly visible</p>
            
            <div className="grid grid-cols-2 gap-4 flex-1 overflow-auto pb-40 px-2">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl bg-black/20">
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

            <div className="fixed bottom-0 left-0 w-full p-8 flex gap-4 bg-gradient-to-t from-[#3E1722] to-transparent pt-20">
              <label className="flex-1 bg-white/10 backdrop-blur-lg border border-white/20 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer">
                <Upload size={16} /> Add More
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
              </label>
              <button 
                onClick={startAnalysis}
                className="flex-1 bg-white text-[#3E1722] py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl active:scale-95 transition-all"
              >
                Analyze
              </button>
            </div>
          </motion.div>
        )}

        {/* 4. ANALYZING SCREEN */}
        {step === 'analyzing' && (
          <motion.div key="analyzing" className="relative z-10 h-screen flex flex-col items-center justify-center p-10 text-center">
            <div className="relative mb-14">
              <div className="w-44 h-56 bg-white/5 backdrop-blur-2xl rounded-[3rem] flex items-center justify-center border border-white/10 shadow-inner">
                <FileText size={80} className="text-white/10" />
              </div>
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
                className="absolute -bottom-6 -right-6 w-20 h-20 border-[6px] border-white border-t-transparent rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              />
            </div>
            <h2 className="text-3xl font-black mb-4 tracking-tighter">AI is Reading..</h2>
            <p className="opacity-50 text-[11px] uppercase tracking-[0.3em] max-w-[250px] mx-auto leading-relaxed">Extracting student data and calculating attendance</p>
          </motion.div>
        )}

        {/* 5. RESULTS TABLE */}
        {step === 'results' && (
          <motion.div key="results" initial={{ y: '100%' }} animate={{ y: 0 }} className="relative z-10 h-screen flex flex-col bg-[#3E1722]">
            <div className="p-6 flex items-center justify-between border-b border-white/5 bg-white/[0.03] backdrop-blur-xl">
              <div className="flex items-center gap-4">
                <button onClick={() => setStep('review')} className="bg-white/10 p-3 rounded-2xl"><ChevronLeft size={20}/></button>
                <div>
                   <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-white/90">Chemistry Dept</h3>
                   <p className="text-[10px] opacity-40 uppercase font-bold mt-1">Attendance Report</p>
                </div>
              </div>
              <button onClick={() => {setImages([]); setStep('upload');}} className="p-2 opacity-30"><RotateCcw size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-auto">
              <table className="w-full text-[11px] border-collapse">
                <thead className="sticky top-0 bg-white text-[#3E1722] z-20 shadow-xl">
                  <tr>
                    <th className="p-4 text-center w-20 font-black uppercase">Roll No</th>
                    <th className="p-4 text-left font-black uppercase tracking-widest">Student Name</th>
                    <th className="p-4 text-center w-12 font-black">TOT</th>
                    <th className="p-4 text-center w-12 font-black">%</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.students.map((s: any, i: number) => {
                    const perc = ((s.attended / (data.totalClasses || 14)) * 100);
                    const isDefaulter = perc < 75;
                    return (
                      <tr key={i} className={`border-b border-white/5 ${isDefaulter ? "bg-red-500/20" : "bg-transparent"}`}>
                        <td className="p-4 text-center opacity-70 font-mono font-bold">{s.rollNo}</td>
                        <td className="p-4 font-bold tracking-tight text-[12px]">{s.name}</td>
                        <td className="p-4 text-center opacity-70">{s.attended}</td>
                        <td className={`p-4 text-center font-black text-[13px] ${isDefaulter ? "text-red-400" : "text-green-400"}`}>
                          {perc.toFixed(0)}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-8 grid grid-cols-2 gap-4 bg-[#3E1722] border-t border-white/10 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
              <button className="bg-white/5 border border-white/20 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2">
                <Download size={16} /> PDF
              </button>
              <button className="bg-white text-[#3E1722] py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition-all">
                <Download size={16} /> Excel
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}