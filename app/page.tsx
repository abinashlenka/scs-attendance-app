'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Trash2, FileText, ChevronLeft, Download, RotateCcw } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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

  // --- EXCEL EXPORT LOGIC ---
  const handleExportExcel = async () => {
    if (!data) return;
    
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance');

    worksheet.columns = [
      { header: 'Roll No', key: 'roll', width: 15 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Attended', key: 'att', width: 10 },
      { header: 'Percentage', key: 'perc', width: 12 },
    ];

    data.students.forEach((s: any) => {
      const perc = (s.attended / (data.totalClasses || 14)) * 100;
      worksheet.addRow({
        roll: s.rollNo,
        name: s.name,
        att: s.attended,
        perc: `${perc.toFixed(0)}%`
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `SCS_Attendance_${new Date().toLocaleDateString()}.xlsx`);
  };

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
    // Simulate AI Scan
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
    <main className="relative min-h-screen text-white overflow-hidden bg-[#120505]">
      
      {/* --- BACKGROUND WITH TINTED GLASS EFFECT --- */}
      <div className="fixed inset-0 z-0">
        <img 
          src="/bg-gate.jpg" 
          alt="SCS Gate" 
          className="w-full h-full object-cover opacity-50 scale-110" 
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
        {step === 'splash' && (
          <motion.div key="splash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="relative z-10 flex flex-col items-center justify-center h-screen p-6 text-center">
             <div className="mb-14">
               <h2 className="text-2xl tracking-[0.2em] font-bold">S.C.S(A) COLLEGE</h2>
               <p className="text-[10px] uppercase opacity-60 tracking-[0.4em] mt-2">Chemistry Department</p>
            </div>
            <div className="w-60 h-60 bg-white rounded-full flex items-center justify-center mb-12 shadow-2xl border-8 border-white/5">
               <img src="/logo.png" alt="Logo" className="w-44 h-44 object-contain" />
            </div>
            <h1 className="text-3xl font-black uppercase">Attendance<br/>Scanner</h1>
            <div className="absolute bottom-12 text-center">
              <p className="text-[10px] opacity-40 uppercase tracking-widest">Developed By</p>
              <p className="text-lg font-bold italic">Abinash Lenka</p>
            </div>
          </motion.div>
        )}

        {step === 'upload' && (
          <motion.div key="upload" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 p-8 flex flex-col h-screen">
            <h2 className="text-3xl font-bold mt-16 text-center">Scan Register</h2>
            <div className="flex-1 my-10 bg-white/5 backdrop-blur-md border-2 border-dashed border-white/20 rounded-[3rem] flex flex-col items-center justify-center">
              <Camera size={48} className="opacity-20 mb-4" />
            </div>
            <div className="flex flex-col gap-4 mb-10">
              <label className="bg-white text-[#761E14] py-5 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest cursor-pointer active:scale-95 transition-all">
                <Camera size={20} /> Open Camera
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleUpload} />
              </label>
              <label className="bg-white/10 border border-white/20 py-5 rounded-2xl flex items-center justify-center gap-3 font-bold uppercase tracking-widest cursor-pointer active:scale-95 transition-all">
                <Upload size={18} /> From Gallery
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
              </label>
            </div>
          </motion.div>
        )}

        {step === 'results' && (
          <motion.div key="results" initial={{ y: '100%' }} animate={{ y: 0 }} className="relative z-10 h-screen flex flex-col bg-[#3E1722]">
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <button onClick={() => setStep('upload')} className="bg-white/10 p-3 rounded-2xl"><ChevronLeft size={20}/></button>
              <h3 className="font-black text-xs uppercase tracking-widest">Attendance Report</h3>
              <div className="w-10" /> 
            </div>
            
            <div className="flex-1 overflow-auto no-scrollbar">
              <table className="w-full text-[11px]">
                <thead className="sticky top-0 bg-white text-[#3E1722] z-20">
                  <tr>
                    <th className="p-4 text-center font-black">ROLL</th>
                    <th className="p-4 text-left font-black">NAME</th>
                    <th className="p-4 text-center font-black">%</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.students.map((s: any, i: number) => {
                    const perc = (s.attended / 14) * 100;
                    return (
                      <tr key={i} className={`border-b border-white/5 ${perc < 75 ? "bg-red-500/10" : ""}`}>
                        <td className="p-4 text-center font-mono">{s.rollNo}</td>
                        <td className="p-4 font-bold">{s.name}</td>
                        <td className={`p-4 text-center font-black ${perc < 75 ? "text-red-400" : "text-green-400"}`}>{perc.toFixed(0)}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-8 grid grid-cols-2 gap-4 bg-[#3E1722] border-t border-white/10">
              <button className="bg-white/5 border border-white/20 py-5 rounded-2xl text-[10px] font-black uppercase">PDF</button>
              <button 
                onClick={handleExportExcel}
                className="bg-white text-[#3E1722] py-5 rounded-2xl text-[10px] font-black uppercase shadow-2xl active:scale-95 transition-all"
              >
                Excel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}