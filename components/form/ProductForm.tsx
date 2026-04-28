'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FormData {
  productName: string;
  description: string;
  targetAudience: string;
  pricePoint: string;
  features: string[];
  usps: string[];
}

interface ProductFormProps {
  onGenerated: (data: any, formData: FormData) => void;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
  hasResult: boolean;
  initialData?: FormData;
}

export default function ProductForm({ onGenerated, isLoading, setIsLoading, hasResult, initialData }: ProductFormProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormData>({
    productName: '',
    description: '',
    targetAudience: '',
    pricePoint: '',
    features: [''],
    usps: [''],
  });
  
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  // Validation Logic
  const isStepValid = () => {
    if (step === 1) return formData.productName.trim() !== '' && formData.description.trim() !== '';
    if (step === 2) return formData.targetAudience.trim() !== '' && formData.pricePoint.trim() !== '';
    if (step === 3) return formData.usps.some(u => u.trim() !== '');
    return true;
  };

  const handleNext = () => { if (isStepValid()) { setDirection(1); setStep((prev) => Math.min(prev + 1, 3)); } };
  const handlePrev = () => { setDirection(-1); setStep((prev) => Math.max(prev - 1, 1)); };
  
  const updateField = (field: keyof FormData, value: any) => setFormData((prev) => ({ ...prev, [field]: value }));

  const updateArrayField = (field: 'features' | 'usps', index: number, value: string) => {
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray[index] = value;
      return { ...prev, [field]: newArray };
    });
  };

  const addArrayItem = (field: 'features' | 'usps') => setFormData((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  const removeArrayItem = (field: 'features' | 'usps', index: number) => {
    if (formData[field].length === 1) return;
    setFormData((prev) => {
      const newArray = [...prev[field]];
      newArray.splice(index, 1);
      return { ...prev, [field]: newArray };
    });
  };

  const callAPI = useCallback(async (regenerateSection?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: formData.productName,
          description: formData.description,
          features: formData.features.filter(Boolean),
          targetAudience: formData.targetAudience,
          pricePoint: formData.pricePoint,
          usps: formData.usps.filter(Boolean),
          regenerateSection,
        }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || 'Generation failed');
      onGenerated(json.data, formData);
    } catch (err: any) {
      setError(err.message || 'Ups, ada error nih. Coba lagi ya.');
    } finally {
      setIsLoading(false);
    }
  }, [formData, onGenerated, setIsLoading]);

  const handleSubmit = () => callAPI();

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-3">
      {children}
    </label>
  );

  const inputCls = "w-full bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl p-4 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder:text-gray-300";

  return (
    <div className="flex flex-col h-full min-h-[600px] bg-white dark:bg-black">
      {/* PROGRESS */}
      <div className="flex gap-2 mb-10 shrink-0">
        {[1, 2, 3].map((num) => (
          <div
            key={num}
            className={`h-1 flex-1 rounded-full transition-all duration-500 ${step >= num ? 'bg-black dark:bg-white' : 'bg-gray-100 dark:bg-white/5'}`}
          />
        ))}
      </div>

      <div className="relative flex-1">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 absolute inset-0">
              <div>
                <h2 className="text-xl font-bold tracking-tight mb-2 text-black dark:text-white">Identitas Utama</h2>
                <p className="text-sm text-gray-400 leading-relaxed">Dasar dari produk yang mau kamu buat.</p>
              </div>
              <div>
                <Label>Nama Produk</Label>
                <input type="text" className={inputCls} value={formData.productName} onChange={(e) => updateField('productName', e.target.value)} placeholder="Contoh: Sepatu Super Lari" />
              </div>
              <div>
                <Label>Deskripsi Produk</Label>
                <textarea rows={5} className={inputCls} value={formData.description} onChange={(e) => updateField('description', e.target.value)} placeholder="Jelasin secara detail apa sih manfaat dari produk ini." />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 absolute inset-0">
              <div>
                <h2 className="text-xl font-bold tracking-tight mb-2 text-black dark:text-white">Target Pasar</h2>
                <p className="text-sm text-gray-400 leading-relaxed">Tentukan siapa yang bakal beli dan berapa harganya.</p>
              </div>
              <div>
                <Label>Target Audiens</Label>
                <input type="text" className={inputCls} value={formData.targetAudience} onChange={(e) => updateField('targetAudience', e.target.value)} placeholder="Contoh: Anak kuliahan, Pekerja kantoran" />
              </div>
              <div>
                <Label>Harga</Label>
                <input type="text" className={inputCls} value={formData.pricePoint} onChange={(e) => updateField('pricePoint', e.target.value)} placeholder="Contoh: Rp 150.000 atau Gratis" />
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 absolute inset-0">
              <div>
                <h2 className="text-xl font-bold tracking-tight mb-2 text-black dark:text-white">Keunggulan Utama</h2>
                <p className="text-sm text-gray-400 leading-relaxed">Apa sih yang bikin produkmu beda dari yang lain?</p>
              </div>
              <div>
                <Label>Keunikan Produk (USP)</Label>
                <div className="space-y-3 mb-3">
                  {formData.usps.map((usp, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" className={inputCls} value={usp} onChange={(e) => updateArrayField('usps', i, e.target.value)} placeholder="Contoh: Bahannya awet dan anti air" />
                      <button onClick={() => removeArrayItem('usps', i)} className="text-gray-300 hover:text-black dark:hover:text-white transition-colors">✕</button>
                    </div>
                  ))}
                </div>
                <button onClick={() => addArrayItem('usps')} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-black dark:hover:text-white transition-colors">+ Tambah Keunggulan</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* NAVIGATION */}
      <div className="mt-auto pt-8 border-t border-black/5 dark:border-white/10 flex justify-between items-center bg-white dark:bg-black sticky bottom-0">
        {step > 1 ? (
          <button onClick={handlePrev} className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black dark:hover:text-white transition-colors">Kembali</button>
        ) : <div />}

        <div className="flex gap-2 items-center">
          {step < 3 ? (
            <button 
              onClick={handleNext} 
              disabled={!isStepValid()}
              className={`px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-[10px] font-semibold tracking-wider rounded-xl transition-all duration-200 ${!isStepValid() ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-80'}`}
            >
              Selanjutnya →
            </button>
          ) : (
            <button 
              onClick={handleSubmit} 
              disabled={isLoading || !isStepValid()} 
              className={`px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-[10px] font-semibold tracking-wider rounded-xl transition-all duration-200 flex items-center gap-2 ${isLoading || !isStepValid() ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-80'}`}
            >
              {isLoading ? (
                <><svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Menggenerate...</>
              ) : hasResult ? (
                <><svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/></svg> Buat Ulang</>
              ) : 'Buat Halaman →'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
