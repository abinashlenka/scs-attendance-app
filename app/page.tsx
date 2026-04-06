'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Trash2, FileText, ChevronLeft, Download, RotateCcw } from 'lucide-react';

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
    setTimeout(() => {
      setData({
        college: "S.C.S. (A) College",
        totalClasses: 14,
        students: [
          { rollNo: "061", name: "DEVI JENA", attended: 11 },
          { rollNo: "067", name: "SUBHAM KUMAR SAHOO", attended: 3 },
          { rollNo: "071", name: "SNEHANJALI BARIK", attended: 1 },
          { rollNo: "074", name: "SHRADHANJALI BEHERA", attended: 11 },
          { rollNo: "217", name: "RIYA RONALIKA BEHERA", attended: 9 },
        ]
      });
      setStep('results');
    }, 4000);
  };

  return (
    <main className="relative min-h-screen text-white bg-[#120505]">
      
      {/* --- REPLICA BACKGROUND (STABLE VERSION) --- */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/bg-gate.jpg" 
          alt="SCS" 
          className="w-full h-full object-cover opacity-40 scale-110" 
        />
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, 
              rgba(153, 80, 72, 0.45) 0%, 
              rgba(118, 30, 20, 0.70) 50%, 
              rgba(62, 23, 34, 0.90) 100%
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
               <p className="text-[10px] uppercase opacity-60 tracking-[0.4em] mt-3">Chemistry Department</p>
            </div>
            <div className="w-60 h-60 bg-white rounded-full flex items-center justify-center mb-14 shadow-2xl border-8 border-white/5">
               <img src="/logo.png" alt="SCS Logo" className="w-48 h-48 object-contain" />
            </div>
            <h1 className="text-3xl font-black uppercase leading-none">Attendance<br/>Scanner</h1>
            <div className="absolute bottom-16">
              <p className="text-[10px] uppercase opacity-40 mb-2">Developed By</p>
              <p className="text-lg font-bold italic">Abinash Lenka</p>
            </div>
          </motion.div>
        )}

        {/* 2. UPLOAD SCREEN */}
        {step === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 p-8 flex flex-col h-screen">
            <h2 className="text-3xl font-bold mt-16 text-center">Scan Register</h2>
            <p className="text-center text-sm opacity-50 mb-10">Capture your attendance page</p>
            <div className="flex-1 bg-white/5 backdrop-blur-xl border-2 border-dashed border-white/20 rounded-[3rem] flex items-center justify-center mb-12">
              <Camera size={48} className="opacity-30" />
            </div>
            <div className="flex flex-col gap-4 mb-10">
              <label className="bg-white text-[#761E14] py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest cursor-pointer shadow-2xl">
                <Camera size={20} /> Open Camera
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleUpload} />
              </label>
              <label className="bg-white/10 border border-white/20 py-5 rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest cursor-pointer">
                <Upload size={18} /> From Gallery
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
              </label>
            </div>
          </motion.div>
        )}

        {/* 3. ANALYZING SCREEN */}
        {step === 'analyzing' && (
          <motion.div key="analyzing" className="relative z-10 h-screen flex flex-col items-center justify-center p-10 text-center">
            <div className="w-44 h-56 glass-panel rounded-[3rem] flex items-center justify-center mb-10">
              <FileText size={64} className="opacity-20" />
            </div>
            <h2 className="text-3xl font-black mb-4">AI Analyzing..</h2>
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}

        {/* 4. RESULTS TABLE */}
        {step === 'results' && (
          <motion.div key="results" initial={{ y: '100%' }} animate={{ y: 0 }} className="relative z-10 h-screen flex flex-col bg-[#3E1722]">
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <button onClick={() => setStep('upload')} className="bg-white/10 p-3 rounded-2xl"><ChevronLeft size={20}/></button>
              <h3 className="font-black text-xs uppercase tracking-widest tracking-[0.2em]">Attendance Report</h3>
              <button onClick={() => setStep('upload')} className="p-2 opacity-30"><RotateCcw size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-auto no-scrollbar">
              <table className="w-full text-[11px] border-collapse">
                <thead className="sticky top-0 bg-white text-[#3E1722] z-20 shadow-xl">
                  <tr>
                    <th className="p-4 text-center font-black">ROLL</th>
                    <th className="p-4 text-left font-black uppercase tracking-widest">STUDENT NAME</th>
                    <th className="p-4 text-center font-black">%</th>
                  </tr>
                </thead>
                <tbody className="bg-[#3E1722]">
                  {data?.students.map((s: any, i: number) => {
                    const perc = (s.attended / 14) * 100;
                    return (
                      <tr key={i} className={`border-b border-white/5 ${perc < 75 ? "bg-red-500/10" : ""}`}>
                        <td className="p-4 text-center font-mono opacity-70">{s.rollNo}</td>
                        <td className="p-4 font-bold">{s.name}</td>
                        <td className={`p-4 text-center font-black ${perc < 75 ? "text-red-400" : "text-green-400"}`}>{perc.toFixed(0)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-8 grid grid-cols-2 gap-4 bg-[#3E1722] border-t border-white/10">
              <button className="bg-white/5 border border-white/20 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest">PDF</button>
              <button className="bg-white text-[#3E1722] py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl">Excel</button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}