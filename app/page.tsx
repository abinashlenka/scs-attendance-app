'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Trash2, FileText, ChevronLeft, Download, RotateCcw } from 'lucide-react';
import { exportToExcel } from '@/utils/excelExport';

type Step = 'splash' | 'upload' | 'review' | 'analyzing' | 'results';

export default function AttendanceApp() {
  const [step, setStep] = useState<Step>('splash');
  const [images, setImages] = useState<string[]>([]);
  const [data, setData] = useState<any>(null);

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
      const response = await fetch(images[0]);
      const blob = await response.blob();
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64 = reader.result;
        const res = await fetch('/api/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });
        const result = await res.json();
        setData(result);
        setStep('results');
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      alert("AI failed. Check Internet/API Key!");
      setStep('review');
    }
  };

  return (
    <main className="relative min-h-screen text-white bg-[#120505]">
      
      {/* --- REPLICA BACKGROUND (IMAGE + GRADIENT) --- */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/bg-gate.jpg" 
          alt="SCS" 
          className="w-full h-full object-cover opacity-50 scale-105" 
        />
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, 
              rgba(153, 80, 72, 0.4) 0%, 
              rgba(118, 30, 20, 0.6) 50%, 
              rgba(62, 23, 34, 0.8) 100%
            )`
          }}
        />
      </div>

      <AnimatePresence mode="wait">
        
        {/* 1. SPLASH SCREEN */}
        {step === 'splash' && (
          <motion.div key="splash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 flex flex-col items-center justify-center h-screen p-6 text-center">
            <div className="mb-14">
               <h2 className="text-2xl tracking-[0.25em] font-bold">S.C.S(A) COLLEGE</h2>
               <p className="text-[10px] uppercase opacity-70 tracking-[0.4em] mt-3 font-bold text-white/80">Attendance Scanner</p>
            </div>
            <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center mb-14 shadow-2xl border-8 border-white/5">
               <img src="/logo.png" alt="Logo" className="w-52 h-52 object-contain" />
            </div>
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4">Chemistry<br/>Department</h1>
            <div className="absolute bottom-16">
              <p className="text-[10px] uppercase opacity-40 font-bold mb-1">Designed & Developed By</p>
              <p className="text-lg font-bold italic tracking-wide">Abinash Lenka</p>
            </div>
          </motion.div>
        )}

        {/* 2. UPLOAD SCREEN */}
        {step === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 p-8 flex flex-col h-screen">
            <h2 className="text-3xl font-black mt-16 text-center leading-tight">Scan Register<br/>Images</h2>
            <div className="flex-1 my-12 bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/20 rounded-[3rem] flex flex-col items-center justify-center">
              <Camera size={48} className="opacity-20 mb-4 text-white" />
              <p className="text-[10px] font-bold opacity-30 uppercase tracking-[0.2em]">Ready for scan</p>
            </div>
            <div className="flex flex-col gap-5 mb-10">
              <label className="bg-white text-[#761E14] py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest shadow-2xl active:scale-95 transition-all cursor-pointer">
                <Camera size={20} /> Open Camera
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleUpload} />
              </label>
              <label className="bg-white/10 border border-white/20 py-5 rounded-2xl flex items-center justify-center gap-3 font-bold uppercase text-xs tracking-widest active:scale-95 transition-all cursor-pointer">
                <Upload size={18} /> From Device
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
              </label>
            </div>
          </motion.div>
        )}

        {/* 3. REVIEW SCREEN */}
        {step === 'review' && (
          <motion.div key="review" className="relative z-10 p-6 flex flex-col h-screen">
            <h2 className="text-2xl font-bold mt-14 text-center">Verify Pages</h2>
            <div className="grid grid-cols-2 gap-4 flex-1 overflow-auto py-8">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
                  <img src={img} className="w-full h-full object-cover" />
                  <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 bg-red-600 p-2 rounded-xl"><Trash2 size={16}/></button>
                </div>
              ))}
            </div>
            <div className="fixed bottom-0 left-0 w-full p-8 flex gap-4 bg-gradient-to-t from-[#3E1722] to-transparent pt-20">
              <button onClick={() => setStep('upload')} className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest">Add More</button>
              <button onClick={startAnalysis} className="flex-1 bg-white text-[#3E1722] py-5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl">Analyze</button>
            </div>
          </motion.div>
        )}

        {/* 4. ANALYZING SCREEN */}
        {step === 'analyzing' && (
          <motion.div key="analyzing" className="relative z-10 h-screen flex flex-col items-center justify-center p-10 text-center">
            <div className="w-44 h-56 glass-panel rounded-[3rem] flex items-center justify-center mb-10">
              <FileText size={80} className="text-white/10" />
            </div>
            <h2 className="text-3xl font-black mb-4">Reading Marks..</h2>
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }} className="w-16 h-16 border-[6px] border-white border-t-transparent rounded-full shadow-2xl" />
          </motion.div>
        )}

        {/* 5. RESULTS TABLE */}
        {step === 'results' && (
          <motion.div key="results" initial={{ y: '100%' }} animate={{ y: 0 }} className="relative z-10 h-screen flex flex-col bg-[#3E1722]">
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <button onClick={() => setStep('upload')} className="bg-white/10 p-3 rounded-2xl"><ChevronLeft size={20}/></button>
              <h3 className="font-black text-xs uppercase tracking-widest">Attendance Report</h3>
              <button onClick={() => {setImages([]); setStep('upload');}} className="p-2 opacity-30"><RotateCcw size={18}/></button>
            </div>
            <div className="flex-1 overflow-auto no-scrollbar">
              <table className="w-full text-[11px] border-collapse">
                <thead className="sticky top-0 bg-white text-[#3E1722] z-20">
                  <tr>
                    <th className="p-4 text-center font-black">ROLL</th>
                    <th className="p-4 text-left font-black uppercase tracking-widest">STUDENT NAME</th>
                    <th className="p-4 text-center font-black">%</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.students.map((s: any, i: number) => {
                    const perc = (s.attended / (data.totalClasses || 14)) * 100;
                    const isDefaulter = perc < 75;
                    return (
                      <tr key={i} className={`border-b border-white/5 ${isDefaulter ? "bg-red-500/15" : ""}`}>
                        <td className="p-4 text-center opacity-60 font-mono font-bold">{s.rollNo}</td>
                        <td className="p-4 font-bold tracking-tight text-[12px]">{s.name}</td>
                        <td className={`p-4 text-center font-black text-[13px] ${isDefaulter ? "text-red-400" : "text-green-400"}`}>{perc.toFixed(0)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="p-8 grid grid-cols-2 gap-4 bg-[#3E1722] border-t border-white/10 shadow-2xl">
              <button className="bg-white/5 border border-white/20 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest">PDF</button>
              <button onClick={() => exportToExcel(data)} className="bg-white text-[#3E1722] py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl active:scale-95 transition-all">Excel</button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}