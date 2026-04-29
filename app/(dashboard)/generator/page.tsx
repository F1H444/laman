'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductForm from '@/components/form/ProductForm';
import LivePreview from '@/components/preview/LivePreview';
import { 
  Monitor, 
  Smartphone, 
  Tablet,
  ChevronRight, 
  ChevronLeft,
  Check,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageData {
  headline: string;
  subheadline: string;
  description?: string;
  benefits: string[];
  featureBreakdown: { title: string; description: string }[];
  socialProofPlaceholder: string;
  pricing: string;
  cta: string;
  styleHint?: string;
  layoutTemplate?: 'SaaS' | 'Editorial' | 'Boutique' | 'Corporate' | 'SplitHero' | 'MinimalLead' | 'ProductShowcase';
  uploadedImages?: Record<string, string>;
  whatsappNumber?: string;
}

export default function GeneratorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GeneratorContent />
    </Suspense>
  );
}

function GeneratorContent() {
  const searchParams = useSearchParams();
  const [activePageId, setActivePageId] = useState<string | null>(searchParams.get('id'));

  useEffect(() => {
    setActivePageId(searchParams.get('id'));
  }, [searchParams]);

  const [generatedData, setGeneratedData] = useState<PageData | null>(null);
  const [formSnapshot, setFormSnapshot] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [scale, setScale] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Refs to track latest state for saving (avoiding race conditions)
  const dataRef = useRef<PageData | null>(null);
  const formRef = useRef<any>(null);

  useEffect(() => { dataRef.current = generatedData; }, [generatedData]);
  useEffect(() => { formRef.current = formSnapshot; }, [formSnapshot]);

  useEffect(() => {
    if (activePageId) {
      setIsLoading(true);
      fetch(`/api/saved-pages?id=${activePageId}`, { cache: 'no-store' })
        .then(r => r.json())
        .then(json => {
          if (json.success && json.data) {
            setGeneratedData(json.data.generated_data);
            setFormSnapshot(json.data.form_snapshot || {
              productName: json.data.product_name,
              description: '', // Fallback
              targetAudience: '',
              price: ''
            });
          }
        })
        .finally(() => setIsLoading(false));
    }
  }, [activePageId]);

  const targetWidths = { desktop: 1440, tablet: 960, mobile: 400 };

  useEffect(() => {
    if (!canvasRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Use clientWidth/Height for more accuracy
        const availableWidth = entry.target.clientWidth - 100; // 100px safety margin
        const availableHeight = entry.target.clientHeight - 100;
        
        const targetWidth = targetWidths[viewMode];
        const targetHeight = viewMode === 'desktop' ? 900 : viewMode === 'tablet' ? 1024 : 844;
        
        const scaleX = availableWidth / targetWidth;
        const scaleY = availableHeight / targetHeight;
        
        // Take the smaller scale to ensure it fits both ways
        const newScale = Math.min(scaleX, scaleY, 0.9); 
        setScale(newScale);
      }
    });

    observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, [viewMode, isPanelOpen]);

  const handleGenerated = (data: PageData, formData: any) => {
    setGeneratedData(data);
    setFormSnapshot(formData);
    setSaveSuccess(false);
  };

  const handleRegenerateAll = async () => {
    if (!formSnapshot) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: formSnapshot.productName,
          description: formSnapshot.description,
          targetAudience: formSnapshot.targetAudience,
          price: formSnapshot.pricePoint || formSnapshot.price,
          features: formSnapshot.features,
          usps: formSnapshot.usps,
          forceSeed: Math.random().toString(36).substring(2, 9), // Force new seed every time
        }),
      });
      const json = await res.json();
      if (json.success) {
        setGeneratedData(json.data);
        setSaveSuccess(false);
      } else {
        alert("Gagal generate: " + json.error);
      }
    } catch (e: any) {
      alert("Error jaringan: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };


  const handleRegenerateSection = async (section: string, feedback?: string) => {
    if (!formSnapshot || !generatedData) return;
    setIsLoading(true);
    
    // Prepare current section data to send to AI
    let currentSectionData = {};
    if (section === 'hero') {
      currentSectionData = { 
        headline: generatedData.headline, 
        subheadline: generatedData.subheadline,
        cta: generatedData.cta 
      };
    } else if (section === 'benefits') {
      currentSectionData = { benefits: generatedData.benefits };
    } else if (section === 'features') {
      currentSectionData = { featureBreakdown: generatedData.featureBreakdown };
    } else if (section === 'testimonial') {
      currentSectionData = { socialProofPlaceholder: generatedData.socialProofPlaceholder };
    } else if (section === 'pricing') {
      currentSectionData = { pricing: generatedData.pricing, cta: generatedData.cta };
    }

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ...formSnapshot, 
          regenerateSection: section, 
          feedback,
          currentData: currentSectionData 
        }),
      });
      const json = await res.json();
      if (json.success) {
        setGeneratedData((prev: any) => {
          if (!prev) return null;
          if (section === 'hero') {
            return { ...prev, headline: json.data.headline, subheadline: json.data.subheadline, cta: json.data.cta };
          }
          if (section === 'benefits') {
            return { ...prev, benefits: json.data.benefits };
          }
          if (section === 'features') {
            return { ...prev, featureBreakdown: json.data.featureBreakdown };
          }
          if (section === 'testimonial') {
            return { ...prev, socialProofPlaceholder: json.data.socialProofPlaceholder };
          }
          if (section === 'pricing') {
            return { ...prev, pricing: json.data.pricing, cta: json.data.cta };
          }
          return { ...prev, [section]: json.data[section], cta: json.data.cta || prev.cta };
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    const currentData = dataRef.current;
    const currentForm = formRef.current;
    if (!currentData) return;

    // Fallback product name and title
    const productName = currentForm?.productName || currentData.headline || 'Project';
    const pageTitle = currentData.headline || productName;

    setIsSaving(true);
    const method = activePageId ? 'PATCH' : 'POST';
    try {
      const res = await fetch('/api/saved-pages', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activePageId,
          title: pageTitle,
          product_name: productName,
          generated_data: currentData,
          form_snapshot: currentForm || { productName },
        }),
      });
      const json = await res.json();
      if (json.success) {
        setSaveSuccess(true);
        if (!activePageId && json.data?.id) {
          setActivePageId(json.data.id);
          window.history.replaceState(null, '', `/generator?id=${json.data.id}`);
        }
      } else {
        alert("Gagal menyimpan ke database: " + json.error);
      }
    } catch (e: any) {
      alert("Error jaringan/server: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportHTML = () => {
    if (!generatedData) return;
    
    const container = document.getElementById('export-container');
    if (!container) {
      alert("Gagal menemukan container untuk di-export.");
      return;
    }
    
    // Clone the ENTIRE container (preserving its classes: bg, text, font, container-type)
    const clone = container.cloneNode(true) as HTMLElement;
    
    // Remove UI-only elements (floating panel, feedback buttons, etc.)
    clone.querySelectorAll('.export-ignore').forEach(el => el.remove());
    
    // Remove contentEditable attributes and editor hover effects
    clone.querySelectorAll('[contenteditable]').forEach(el => {
      el.removeAttribute('contenteditable');
      el.removeAttribute('suppresscontenteditablewarning');
      el.classList.remove('cursor-text', 'hover:ring-2', 'hover:ring-indigo-500', 'hover:ring-white', 'outline-none');
    });

    // Remove all inputs, buttons, and specific UI elements
    clone.querySelectorAll('input').forEach(el => el.remove());
    clone.querySelectorAll('button').forEach(el => el.remove());
    clone.querySelectorAll('.export-ignore').forEach(el => el.remove());
    clone.querySelectorAll('.upload-placeholder-text').forEach(el => el.remove());
    
    // Remove pointer events and cursor classes from placeholders
    clone.querySelectorAll('.cursor-pointer').forEach(el => el.classList.remove('cursor-pointer'));
    clone.querySelectorAll('.cursor-text').forEach(el => el.classList.remove('cursor-text'));

    // FIX: Force all elements to be visible by removing Framer Motion inline styles.
    // whileInView sets opacity:0 and transform on elements that haven't been scrolled into view yet.
    clone.querySelectorAll('*').forEach(el => {
      const htmlEl = el as HTMLElement;
      if (htmlEl.style) {
        htmlEl.style.opacity = '';
        htmlEl.style.transform = '';
        htmlEl.style.willChange = '';
      }
    });

    // Remove the id so it doesn't conflict if embedded
    clone.removeAttribute('id');

    // The clone already has [container-type:inline-size] from LivePreview's root div,
    // so container queries (@[1024px]:, @[768px]:, etc.) will work correctly.
    // We just need to output clone.outerHTML to keep ALL its classes intact.

    const htmlContent = `<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${generatedData.headline}</title>
    <script src="https://cdn.tailwindcss.com?plugins=container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <script>
      tailwind.config = {
        theme: {
          extend: {
            fontFamily: {
              sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
            }
          }
        }
      }
    </script>
    <style>
      * { box-sizing: border-box; }
      body { 
        margin: 0; 
        padding: 0; 
        overflow-x: hidden;
        font-family: 'Plus Jakarta Sans', 'Inter', sans-serif;
      }
      /* Ensure no inputs or hidden UI elements appear */
      input, button.export-ignore, .export-ignore { display: none !important; }
      [contenteditable] { pointer-events: none !important; cursor: default !important; }
    </style>
    <script>
      // Extra layer of protection: remove editor elements on load
      document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('input, button, .export-ignore, .upload-placeholder-text').forEach(el => el.remove());
        document.querySelectorAll('[contenteditable]').forEach(el => {
          el.removeAttribute('contenteditable');
          el.style.pointerEvents = 'none';
          el.style.cursor = 'default';
        });
      });
    </script>
</head>
<body>
    ${clone.outerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedData.headline.toLowerCase().replace(/\s+/g, '-')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };



  return (
    <div className="h-full flex flex-col lg:flex-row bg-white dark:bg-black overflow-hidden relative transition-colors duration-500">
      <title>Generator | Laman.ai</title>
      
      {/* Overlay for mobile/tablet when panel is open */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPanelOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* 1. CONFIG PANEL - Now a Drawer on Tablet/Mobile */}
      <AnimatePresence initial={false}>
        {isPanelOpen && (
          <motion.div 
            initial={{ x: -400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -400, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed lg:relative top-0 left-0 h-full w-[85vw] md:w-[400px] border-r border-black/25 dark:border-white/10 flex flex-col bg-white dark:bg-black shrink-0 z-50 transition-colors duration-500 shadow-2xl lg:shadow-none"
          >
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-black/25 dark:border-white/10 transition-colors duration-500">
              <h2 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400">Pengaturan</h2>
              <button onClick={() => setIsPanelOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-all duration-500 text-gray-400">
                <ChevronLeft size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
              <ProductForm 
                onGenerated={handleGenerated} 
                isLoading={isLoading} 
                setIsLoading={setIsLoading} 
                hasResult={!!generatedData} 
                initialData={formSnapshot}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. CANVAS AREA */}
      <div className="flex-1 h-full flex flex-col relative bg-[#F8F8F8] dark:bg-[#0A0A0A] transition-colors duration-500 min-w-0">
        
        {/* Workspace Header */}
        <div className="h-14 md:h-16 px-3 md:px-6 border-b border-black/25 dark:border-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-xl flex items-center justify-between z-10 transition-colors duration-500 sticky top-0 w-full overflow-hidden">
          <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
            {!isPanelOpen && (
              <button onClick={() => setIsPanelOpen(true)} className="p-2 hover:text-black dark:hover:text-white transition-all duration-500">
                <ChevronRight size={18} />
              </button>
            )}
            <div className="flex items-center gap-3 md:gap-6 bg-black/5 dark:bg-white/5 p-1 rounded-lg">
               <button onClick={() => setViewMode('desktop')} className={`p-1.5 rounded-md transition-all duration-300 ${viewMode === 'desktop' ? 'bg-white dark:bg-white/10 shadow-sm text-black dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}><Monitor size={16} /></button>
               <button onClick={() => setViewMode('tablet')} className={`p-1.5 rounded-md transition-all duration-300 ${viewMode === 'tablet' ? 'bg-white dark:bg-white/10 shadow-sm text-black dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}><Tablet size={16} /></button>
               <button onClick={() => setViewMode('mobile')} className={`p-1.5 rounded-md transition-all duration-300 ${viewMode === 'mobile' ? 'bg-white dark:bg-white/10 shadow-sm text-black dark:text-white' : 'text-gray-400 hover:text-gray-600'}`}><Smartphone size={16} /></button>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 ml-4">
              {generatedData && (
                 <>
                   {/* Buat Ulang button */}
                   <button 
                     onClick={handleRegenerateAll} 
                     disabled={isLoading}
                     className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-200 disabled:opacity-40"
                   >
                     {isLoading ? (
                       <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg>
                     ) : (
                       <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/></svg>
                     )}
                     <span className="hidden md:inline text-[11px] font-semibold tracking-wide">Buat Ulang</span>
                   </button>

                   <div className="hidden md:block w-px h-5 bg-black/10 dark:bg-white/10" />

                   {/* Export HTML button */}
                   <button 
                     onClick={handleExportHTML} 
                     className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-200 text-black/70 dark:text-white/70"
                   >
                     <Download size={13} strokeWidth={2.5} />
                     <span className="hidden md:inline text-[11px] font-semibold tracking-wide">Export</span>
                   </button>

                   {/* Simpan button */}
                   <button 
                     onClick={handleSave} 
                     disabled={isSaving || saveSuccess} 
                     className={`flex items-center gap-2 px-4 md:px-5 py-2 rounded-xl text-[11px] font-semibold tracking-wide transition-all duration-200 ${
                       saveSuccess 
                         ? 'bg-emerald-500 text-white border border-emerald-500' 
                         : 'bg-black dark:bg-white text-white dark:text-black hover:opacity-80 disabled:opacity-40'
                     }`}
                   >
                     {saveSuccess ? <Check size={13} strokeWidth={2.5} /> : isSaving ? <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : null}
                     <span className={saveSuccess || isSaving ? 'hidden md:inline' : ''}>{saveSuccess ? 'Tersimpan' : isSaving ? 'Menyimpan' : 'Simpan'}</span>
                   </button>
                 </>
              )}
          </div>
        </div>

        {/* Workspace - Fixed Device Frame (Scroll inside) */}
        <div ref={canvasRef} className="flex-1 flex items-center justify-center relative overflow-hidden">
           <div 
             className="relative origin-center transition-all duration-500 ease-in-out flex-shrink-0"
             style={{ 
               width: `${targetWidths[viewMode]}px`, 
               height: viewMode === 'desktop' ? '900px' : viewMode === 'tablet' ? '1024px' : '844px',
               transform: `scale(${scale})`,
             }}
           >
             {/* THE FRAME: Modern Device Frame Aesthetics */}
             <div className={`
               bg-white dark:bg-black 
               border-[12px] border-black dark:border-[#1A1A1A] 
               shadow-[0_80px_160px_-40px_rgba(0,0,0,0.3)] 
               flex flex-col h-full overflow-hidden transition-all duration-500
               ${viewMode === 'mobile' ? 'rounded-[3.5rem]' : viewMode === 'tablet' ? 'rounded-[2.5rem]' : 'rounded-[1.5rem]'}
             `}>
               {/* Optional: Mobile Notch/Dynamic Island */}
               {viewMode === 'mobile' && (
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-50 flex items-center justify-center">
                    <div className="w-1 h-1 rounded-full bg-white/20 ml-auto mr-4" />
                 </div>
               )}

               <div className="flex-1 overflow-y-auto custom-scrollbar scroll-smooth [container-type:inline-size]">
                 <LivePreview 
                   data={generatedData} 
                   onRegenerateSection={handleRegenerateSection} 
                   onUpdateData={(newData: any) => {
                     // Update refs immediately to ensure handleSave has the latest data
                     if (dataRef.current) {
                       dataRef.current = { ...dataRef.current, ...newData };
                     }
                     
                     // Specifically handle productName if it exists in newData (even if empty)
                     if ('productName' in newData) {
                       const updatedForm = formRef.current ? { ...formRef.current, productName: newData.productName } : { productName: newData.productName };
                       formRef.current = updatedForm;
                       setFormSnapshot({ ...updatedForm });
                     }
                     
                     setGeneratedData((prev: any) => (prev ? { ...prev, ...newData } : null));
                     setSaveSuccess(false);
                   }}
                   viewMode={viewMode}
                   productName={formSnapshot?.productName}
                 />
               </div>

               <AnimatePresence>
                {isLoading && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center gap-6">
                     <div className="w-12 h-12 border-4 border-black/10 border-t-black dark:border-t-white rounded-full animate-spin" />
                     <p className="font-black text-[10px] uppercase tracking-[0.3em] text-black dark:text-white">Sedang Membuat...</p>
                  </motion.div>
                )}
               </AnimatePresence>
             </div>
           </div>
        </div>

      </div>

    </div>
  );
}
