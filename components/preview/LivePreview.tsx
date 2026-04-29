import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Image as ImageIcon, Zap, Quote, CheckCircle2, SlidersHorizontal, LayoutTemplate, Palette, Menu, X } from 'lucide-react';

interface Feature {
  title: string;
  description: string;
}

interface PageData {
  headline: string;
  subheadline: string;
  benefits: string[];
  featureBreakdown: Feature[];
  socialProofPlaceholder: string;
  pricing: string;
  cta: string;
  styleHint?: string;
  layoutTemplate?: 'SaaS' | 'Editorial' | 'Boutique' | 'Corporate' | 'SplitHero' | 'MinimalLead' | 'ProductShowcase';
  uploadedImages?: Record<string, string>;
  whatsappNumber?: string;
}

interface LivePreviewProps {
  data: PageData | null;
  onRegenerateSection: (section: string, feedback?: string) => void;
  onUpdateData?: (newData: Partial<PageData> & { productName?: string }) => void;
  viewMode?: 'desktop' | 'tablet' | 'mobile';
  productName?: string;
}

const STYLES = {
  Minimalist: { bg: 'bg-white', text: 'text-black', accent: 'bg-black text-white', border: 'border-gray-200', card: 'bg-gray-50', muted: 'text-gray-500' },
  DarkTech: { bg: 'bg-[#0a0a0a]', text: 'text-white', accent: 'bg-indigo-600 text-white', border: 'border-white/10', card: 'bg-[#111]', muted: 'text-gray-400' },
  NeoBrutal: { bg: 'bg-yellow-400', text: 'text-black', accent: 'bg-black text-white', border: 'border-black shadow-[4px_4px_0_0_#000]', card: 'bg-white border-black shadow-[4px_4px_0_0_#000]', muted: 'text-black/70' },
  Luxury: { bg: 'bg-stone-950', text: 'text-amber-50', accent: 'bg-amber-600 text-stone-900', border: 'border-amber-900/30', card: 'bg-stone-900', muted: 'text-amber-200/50' },
  Midnight: { bg: 'bg-slate-950', text: 'text-slate-100', accent: 'bg-emerald-500 text-slate-950', border: 'border-emerald-500/20', card: 'bg-slate-900', muted: 'text-slate-400' },
  Oceanic: { bg: 'bg-cyan-950', text: 'text-cyan-50', accent: 'bg-cyan-400 text-cyan-950', border: 'border-cyan-400/20', card: 'bg-cyan-900', muted: 'text-cyan-300/50' },
  Cyber: { bg: 'bg-black', text: 'text-fuchsia-500', accent: 'bg-fuchsia-500 text-black', border: 'border-fuchsia-500/50 shadow-[0_0_10px_rgba(217,70,239,0.3)]', card: 'bg-neutral-950', muted: 'text-fuchsia-900' },
  Modern: { bg: 'bg-slate-50', text: 'text-slate-900', accent: 'bg-blue-600 text-white', border: 'border-blue-100', card: 'bg-white', muted: 'text-slate-500' },
  Glassmorphism: { bg: 'bg-gradient-to-br from-indigo-50 to-white', text: 'text-indigo-950', accent: 'bg-indigo-600/10 backdrop-blur-md border border-indigo-600/20 text-indigo-600', border: 'border-indigo-100', card: 'bg-white/40 backdrop-blur-xl border border-white/60', muted: 'text-indigo-900/60' },
  RetroPop: { bg: 'bg-[#FF6B6B]', text: 'text-[#2D3436]', accent: 'bg-[#4ECDC4] text-white border-4 border-[#2D3436] shadow-[8px_8px_0_0_#2D3436]', border: 'border-[#2D3436] border-4', card: 'bg-white border-4 border-[#2D3436] shadow-[8px_8px_0_0_#2D3436]', muted: 'text-[#2D3436]/60' },
  MinimalDark: { bg: 'bg-[#000000]', text: 'text-[#EDEDED]', accent: 'bg-white text-black', border: 'border-[#222222]', card: 'bg-[#111111]', muted: 'text-white/40' },
  VibrantGradient: { bg: 'bg-gradient-to-tr from-[#FF0080] to-[#7928CA]', text: 'text-white', accent: 'bg-white text-[#7928CA]', border: 'border-white/20', card: 'bg-black/20 backdrop-blur-lg border border-white/30', muted: 'text-white/60' }
};

const TEMPLATES = ['SaaS', 'Editorial', 'Boutique', 'Corporate', 'SplitHero', 'MinimalLead', 'ProductShowcase'] as const;

export default function LivePreview({ data, onRegenerateSection, onUpdateData, viewMode = 'desktop', productName }: LivePreviewProps) {
  const activeStyle = (data?.styleHint && STYLES[data.styleHint as keyof typeof STYLES]) ? (data.styleHint as keyof typeof STYLES) : 'Minimalist';
  const activeTemplate = data?.layoutTemplate || 'SaaS';
  const uploadedImages = data?.uploadedImages || {};
  
  const isMobile = viewMode === 'mobile';
  const isTablet = viewMode === 'tablet';
  const isDesktop = viewMode === 'desktop';
  
  
  // Mobile Menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dropdown state
  const [isStyleDropdownOpen, setIsStyleDropdownOpen] = useState(false);

  // Local state for WA number to avoid re-renders on every keystroke
  const [localWA, setLocalWA] = useState(data?.whatsappNumber || '');
  
  // Sync local WA when global data changes (e.g. after save or clear)
  useEffect(() => {
    setLocalWA(data?.whatsappNumber || '');
  }, [data?.whatsappNumber]);

  const handleWAUpdate = () => {
    if (onUpdateData && localWA !== data?.whatsappNumber) {
      onUpdateData({ whatsappNumber: localWA });
    }
  };

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] w-full bg-white text-center p-6">
        <div className="w-16 h-16 rounded-2xl bg-black flex items-center justify-center mb-8 shadow-xl animate-pulse"><span className="text-white font-black italic text-2xl">L</span></div>
        <h2 className="text-xl font-bold uppercase tracking-widest mb-2">Memproses Desain...</h2>
        <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Menunggu info produk dari kamu...</p>
      </div>
    );
  }

  const currentStyle = STYLES[activeStyle];

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        const newImages = { ...uploadedImages, [id]: url };
        if (onUpdateData) onUpdateData({ uploadedImages: newImages });
      };
      reader.readAsDataURL(file);
    }
  };


  const ImagePlaceholder = ({ id, className = "", hideText = false }: { id: string, className?: string, hideText?: boolean }) => (
    <div className={`relative overflow-hidden flex items-center justify-center bg-black/5 dark:bg-white/5 border-2 border-dashed ${currentStyle.border} ${className}`}>
      {uploadedImages[id] ? (
        <img src={uploadedImages[id]} alt="Uploaded" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="text-center p-2 flex flex-col items-center opacity-50">
          <ImageIcon size={hideText ? 20 : 32} className={`${!hideText ? 'mb-4' : ''} ${currentStyle.muted}`} />
          {!hideText && <span className={`text-xs font-bold uppercase tracking-widest upload-placeholder-text ${currentStyle.muted}`}>Unggah Gambar</span>}
        </div>
      )}
      <input type="file" accept="image/*" onChange={(e) => handleImageUpload(id, e)} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
    </div>
  );

  const SectionWrapper = ({ children, title, sectionId, className = "" }: { children: React.ReactNode, title: string, sectionId: string, className?: string }) => (
    <div id={sectionId} className={`relative group/section @container ${className}`}>
      {children}
    </div>
  );

  return (
    <div id="export-container" className={`w-full min-h-full ${currentStyle.bg} ${currentStyle.text} transition-colors duration-500 font-sans relative [container-type:inline-size]`}>
      
      {/* FLOATING CONTROL PANEL */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 export-ignore">
        <div className="bg-black/90 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl p-2 flex items-center gap-2">
          <div className="flex items-center gap-2 px-2 border-r border-white/10">
            <span className="text-white/50 text-[10px] font-bold uppercase">WA:</span>
            <input 
              type="text" 
              placeholder="628123..." 
              value={localWA}
              onChange={(e) => setLocalWA(e.target.value)}
              onBlur={handleWAUpdate}
              onKeyDown={(e) => e.key === 'Enter' && handleWAUpdate()}
              className="bg-white/10 text-white text-[10px] px-2 py-1.5 rounded outline-none w-24 border border-white/10 focus:border-white/30 transition-colors placeholder:text-white/20"
            />
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsStyleDropdownOpen(!isStyleDropdownOpen)}
              className="flex items-center gap-3 px-4 py-2 hover:bg-white/5 rounded-xl transition-all group"
            >
              <div className={`w-4 h-4 rounded-full ${STYLES[activeStyle].accent.split(' ')[0]} border border-white/20`} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70 group-hover:text-white transition-colors">
                Style: {activeStyle}
              </span>
              <SlidersHorizontal size={12} className="text-white/30 group-hover:text-white transition-colors" />
            </button>

            <AnimatePresence>
              {isStyleDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute bottom-full mb-4 left-0 w-48 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-[60]"
                >
                  <div className="p-2 grid grid-cols-1 gap-1">
                    {Object.keys(STYLES).map((styleName) => (
                      <button
                        key={styleName}
                        onClick={() => {
                          setIsStyleDropdownOpen(false);
                          if (onUpdateData) onUpdateData({ styleHint: styleName });
                        }}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeStyle === styleName ? 'bg-white/10 text-white' : 'text-white/40 hover:bg-white/5 hover:text-white'}`}
                      >
                        <div className={`w-3 h-3 rounded-full ${STYLES[styleName as keyof typeof STYLES].accent.split(' ')[0]}`} />
                        <span className="text-[10px] font-black uppercase tracking-wider">{styleName}</span>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className={`sticky top-0 z-40 w-full px-[4cqw] py-3 @[768px]:py-4 backdrop-blur-xl border-b ${currentStyle.border} flex justify-between items-center`}>
        <div className="flex items-center gap-[2cqw] @[768px]:gap-3">
          <div className="w-[8cqw] @[768px]:w-10 h-[8cqw] @[768px]:h-10 flex-shrink-0">
            <ImagePlaceholder id="logo" hideText className="w-full h-full rounded-xl !p-0" />
          </div>
          <div 
            contentEditable 
            suppressContentEditableWarning 
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
            onBlur={(e) => {
              const val = e.currentTarget.textContent || '';
              if (val !== productName) onUpdateData?.({ productName: val });
            }}
            className="font-black italic text-[clamp(1.25rem,4cqw,2rem)] tracking-tighter outline-none cursor-text hover:ring-2 hover:ring-indigo-500 rounded px-2"
          >
            {productName || 'Brand.'}
          </div>
        </div>
        
        {/* Desktop Menu */}
        <div className="hidden @[768px]:flex items-center gap-[3cqw] @[1024px]:gap-8 text-[clamp(0.6rem,1cqw,0.8rem)] font-bold uppercase tracking-widest">
           <a href="#features" className="hover:opacity-60 transition-opacity">Keunggulan</a>
           <a href="#benefits" className="hover:opacity-60 transition-opacity">Manfaat</a>
           <a href="#testimonial" className="hover:opacity-60 transition-opacity">Testimoni</a>
           <a href="#pricing" className="hover:opacity-60 transition-opacity">Harga</a>
        </div>

        <div className="flex items-center gap-4">
          <a href={data.whatsappNumber ? `https://wa.me/${data.whatsappNumber.replace(/[^0-9]/g, '')}` : '#pricing'} target="_blank" onClick={(e) => { if (!data.whatsappNumber) e.preventDefault(); }} className={`hidden @[400px]:block text-[clamp(0.6rem,1cqw,0.8rem)] font-black uppercase tracking-widest px-[4cqw] py-[1.5cqw] @[1024px]:px-6 @[1024px]:py-3 ${currentStyle.accent} rounded-full transition-all hover:scale-105 cursor-text outline-none hover:ring-2 hover:ring-indigo-500`}>
            <div contentEditable suppressContentEditableWarning onBlur={(e) => onUpdateData?.({ cta: e.currentTarget.textContent || '' })} className="outline-none pointer-events-auto" onClick={(e) => e.preventDefault()}>{data.cta}</div>
          </a>
          
          {/* Mobile Hamburger Toggle */}
          <button 
            className="@[768px]:hidden p-2 export-ignore"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="@[768px]:hidden absolute top-full left-[4cqw] right-[4cqw] mt-4 bg-white/90 dark:bg-black/90 backdrop-blur-3xl border border-black/10 dark:border-white/10 rounded-[3cqw] p-[6cqw] shadow-2xl z-50 flex flex-col gap-[4cqw]"
          >
            <div className="flex flex-col gap-[2cqw] text-[4cqw] font-bold tracking-tight">
              {[{l: 'Keunggulan', id: 'features'}, {l: 'Manfaat', id: 'benefits'}, {l: 'Testimoni', id: 'testimonial'}, {l: 'Harga', id: 'pricing'}].map((item, i) => (
                <motion.a 
                  key={item.id}
                  href={`#${item.id}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${currentStyle.text}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.l}
                </motion.a>
              ))}
              <motion.a 
                href={data.whatsappNumber ? `https://wa.me/${data.whatsappNumber.replace(/[^0-9]/g, '')}` : '#pricing'} target="_blank" onClick={(e) => { if (!data.whatsappNumber) e.preventDefault(); }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`mt-2 w-full text-[min(4cqw,1rem)] text-center font-black uppercase tracking-widest px-4 py-4 ${currentStyle.accent} rounded-xl truncate cursor-text outline-none hover:ring-2 hover:ring-indigo-500 shadow-xl`}
              >
                <div contentEditable suppressContentEditableWarning onBlur={(e) => onUpdateData?.({ cta: e.currentTarget.textContent || '' })} className="outline-none pointer-events-auto" onClick={(e) => e.preventDefault()}>{data.cta}</div>
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <SectionWrapper title="Hero" sectionId="hero" className={`px-[5cqw] py-16 @[768px]:py-20 @[1024px]:py-28 min-h-[min(80vh,800px)] flex items-center overflow-hidden`}>
        <div className="max-w-7xl mx-auto w-full">
          {activeTemplate === 'SplitHero' ? (
            <div className="flex flex-col @[1024px]:flex-row items-stretch min-h-[60vh] gap-0 rounded-[3rem] overflow-hidden border border-black/10 dark:border-white/10 shadow-2xl">
              <div className="@[1024px]:w-1/2 p-[8cqw] flex flex-col justify-center bg-white dark:bg-[#0A0A0A]">
                {data.headline && (
                    <motion.h1 
                      initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
                      contentEditable suppressContentEditableWarning 
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
                      onBlur={(e) => onUpdateData?.({ headline: e.currentTarget.textContent || '' })}
                      className="text-3xl @[768px]:text-4xl @[1024px]:text-5xl font-black tracking-tighter leading-tight mb-6 outline-none hover:bg-black/5 dark:hover:bg-white/5 rounded-xl px-2 transition-all cursor-text">
                      {data.headline}
                    </motion.h1>
                )}
                {data.subheadline && (
                  <motion.p 
                    initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
                    contentEditable suppressContentEditableWarning onBlur={(e) => onUpdateData?.({ subheadline: e.currentTarget.textContent || '' })}
                    className={`text-[min(4cqw,1.2rem)] ${currentStyle.muted} mb-10 leading-relaxed outline-none hover:bg-black/5 dark:hover:bg-white/5 rounded-xl px-2 transition-all cursor-text`}>
                    {data.subheadline}
                  </motion.p>
                )}
                {data.cta && (
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <a href={data.whatsappNumber ? `https://wa.me/${data.whatsappNumber.replace(/[^0-9]/g, '')}` : '#pricing'} target="_blank" onClick={(e) => { if (!data.whatsappNumber) e.preventDefault(); }} className={`inline-block px-8 py-4 @[1024px]:px-10 @[1024px]:py-5 ${currentStyle.accent} text-sm @[1024px]:text-base font-bold rounded-2xl hover:opacity-90 transition-all shadow-lg text-center cursor-text outline-none`}>
                      <div contentEditable suppressContentEditableWarning onBlur={(e) => onUpdateData?.({ cta: e.currentTarget.textContent || '' })} className="outline-none pointer-events-auto" onClick={(e) => e.preventDefault()}>{data.cta}</div>
                    </a>
                  </motion.div>
                )}
              </div>
              <div className="@[1024px]:w-1/2 relative bg-black/5 dark:bg-white/5">
                <ImagePlaceholder id="hero-img" className="w-full h-full min-h-[40vh] !rounded-none !border-0" />
              </div>
            </div>
          ) : activeTemplate === 'MinimalLead' ? (
            <div className="text-center py-20 max-w-4xl mx-auto">
              {data.headline && (
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  contentEditable suppressContentEditableWarning onBlur={(e) => onUpdateData?.({ headline: e.currentTarget.textContent || '' })}
                  className="text-4xl @[768px]:text-5xl @[1024px]:text-7xl font-black tracking-[ -0.04em] leading-[1.05] mb-8 outline-none hover:bg-black/5 dark:hover:bg-white/5 rounded-3xl px-4 transition-all cursor-text">
                  {data.headline}
                </motion.h1>
              )}
              {data.subheadline && (
                <motion.p 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  contentEditable suppressContentEditableWarning onBlur={(e) => onUpdateData?.({ subheadline: e.currentTarget.textContent || '' })}
                  className={`text-[min(5cqw,1.5rem)] ${currentStyle.muted} mb-12 max-w-2xl mx-auto leading-relaxed outline-none hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl px-4 transition-all cursor-text`}>
                  {data.subheadline}
                </motion.p>
              )}
              {data.cta && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex justify-center">
                  <a href={data.whatsappNumber ? `https://wa.me/${data.whatsappNumber.replace(/[^0-9]/g, '')}` : '#pricing'} target="_blank" onClick={(e) => { if (!data.whatsappNumber) e.preventDefault(); }} className={`px-10 py-5 @[1024px]:px-12 @[1024px]:py-6 ${currentStyle.accent} text-base @[1024px]:text-lg font-black rounded-[2rem] hover:scale-105 transition-all shadow-2xl cursor-text outline-none`}>
                    <div contentEditable suppressContentEditableWarning onBlur={(e) => onUpdateData?.({ cta: e.currentTarget.textContent || '' })} className="outline-none pointer-events-auto" onClick={(e) => e.preventDefault()}>{data.cta}</div>
                  </a>
                </motion.div>
              )}
            </div>
          ) : activeTemplate === 'ProductShowcase' ? (
            <div className="flex flex-col gap-12">
              <div className="text-center max-w-3xl mx-auto">
                <motion.h1 
                  initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                  contentEditable suppressContentEditableWarning onBlur={(e) => onUpdateData?.({ headline: e.currentTarget.textContent || '' })}
                  className="text-3xl @[768px]:text-4xl @[1024px]:text-6xl font-black tracking-tighter mb-4 outline-none hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl px-4 transition-all cursor-text">
                  {data.headline}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                  contentEditable suppressContentEditableWarning onBlur={(e) => onUpdateData?.({ subheadline: e.currentTarget.textContent || '' })}
                  className={`text-lg ${currentStyle.muted} outline-none hover:bg-black/5 dark:hover:bg-white/5 rounded-xl px-4 transition-all cursor-text`}>
                  {data.subheadline}
                </motion.p>
              </div>
              <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="relative group">
                <ImagePlaceholder id="hero-img" className="w-full aspect-[21/9] rounded-[3rem] shadow-2xl transition-transform duration-700 group-hover:scale-[1.01]" />
                {data.cta && (
                  <div className="absolute inset-x-0 bottom-8 @[1024px]:bottom-12 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <a href={data.whatsappNumber ? `https://wa.me/${data.whatsappNumber.replace(/[^0-9]/g, '')}` : '#pricing'} target="_blank" onClick={(e) => { if (!data.whatsappNumber) e.preventDefault(); }} className={`px-8 py-4 @[1024px]:px-12 @[1024px]:py-5 ${currentStyle.accent} text-sm @[1024px]:text-base font-bold rounded-2xl shadow-2xl cursor-text outline-none`}>
                      <div contentEditable suppressContentEditableWarning onBlur={(e) => onUpdateData?.({ cta: e.currentTarget.textContent || '' })} className="outline-none pointer-events-auto" onClick={(e) => e.preventDefault()}>{data.cta}</div>
                    </a>
                  </div>
                )}
              </motion.div>
            </div>
          ) : (
            <div className={`flex flex-col @[1024px]:flex-row ${activeTemplate === 'Boutique' ? '@[1024px]:flex-row-reverse' : ''} items-center gap-[8cqw] @[1024px]:gap-20 ${activeTemplate === 'SaaS' || activeTemplate === 'Corporate' ? 'text-center flex-col' : 'text-left'}`}>
              <div className={`${(activeTemplate === 'Editorial' || activeTemplate === 'Boutique') ? '@[1024px]:w-3/5' : 'w-full'}`}>
                <motion.h1 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  contentEditable suppressContentEditableWarning onBlur={(e) => onUpdateData?.({ headline: e.currentTarget.textContent || '' })}
                  className="text-3xl @[768px]:text-5xl @[1024px]:text-7xl font-black tracking-tighter leading-[0.95] mb-8 outline-none hover:bg-black/5 dark:hover:bg-white/5 rounded-[2rem] px-4 transition-all cursor-text">
                  {data.headline}
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  contentEditable suppressContentEditableWarning onBlur={(e) => onUpdateData?.({ subheadline: e.currentTarget.textContent || '' })}
                  className={`text-[min(5cqw,1.5rem)] @[1024px]:text-2xl ${currentStyle.muted} max-w-2xl leading-relaxed mb-10 ${activeTemplate === 'SaaS' || activeTemplate === 'Corporate' ? 'mx-auto' : ''} outline-none hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl px-4 transition-all cursor-text`}>
                  {data.subheadline}
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className={`flex flex-col @[640px]:flex-row items-center gap-6 ${activeTemplate === 'SaaS' || activeTemplate === 'Corporate' ? 'justify-center' : ''}`}>
                  <a href={data.whatsappNumber ? `https://wa.me/${data.whatsappNumber.replace(/[^0-9]/g, '')}` : '#pricing'} target="_blank" onClick={(e) => { if (!data.whatsappNumber) e.preventDefault(); }} className={`w-full @[640px]:w-auto px-8 py-4 @[1024px]:px-12 @[1024px]:py-6 ${currentStyle.accent} text-base @[1024px]:text-lg font-black rounded-3xl hover:opacity-90 transition-all shadow-xl text-center cursor-text outline-none`}>
                    <div contentEditable suppressContentEditableWarning onBlur={(e) => onUpdateData?.({ cta: e.currentTarget.textContent || '' })} className="outline-none pointer-events-auto" onClick={(e) => e.preventDefault()}>{data.cta}</div>
                  </a>
                </motion.div>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                className={`${(activeTemplate === 'Editorial' || activeTemplate === 'Boutique') ? '@[1024px]:w-2/5 w-full' : 'w-full max-w-5xl mt-12'}`}>
                <ImagePlaceholder id="hero-img" className="w-full aspect-[4/3] @[1024px]:aspect-square rounded-[4rem] shadow-2xl" />
              </motion.div>
            </div>
          )}
        </div>
      </SectionWrapper>

      {/* BENEFITS SECTION */}
      <SectionWrapper title="Manfaat" sectionId="benefits" className={`py-24 @[1024px]:py-40 overflow-hidden`}>
        <div className="max-w-7xl mx-auto px-6 @[1024px]:px-12">
          <div className="flex flex-col @[1024px]:flex-row gap-16 @[1024px]:gap-24 items-start">
            <div className="@[1024px]:w-1/3 sticky top-32">
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                <h2 className="text-4xl @[1024px]:text-5xl font-black tracking-tighter leading-none mb-6">Kenapa Harus Kami?</h2>
                <p className={`text-lg ${currentStyle.muted} mb-8`}>Kami memberikan kualitas terbaik yang dirancang khusus untuk memenuhi kebutuhan Anda.</p>
                <div className={`w-20 h-1.5 ${currentStyle.accent} rounded-full`} />
              </motion.div>
            </div>
            
            <div className="@[1024px]:w-2/3 space-y-6 @[1024px]:space-y-12">
              {data.benefits.map((benefit, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 30 }} 
                  whileInView={{ opacity: 1, y: 0 }} 
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`group p-6 @[640px]:p-8 @[1024px]:p-12 border ${currentStyle.border} rounded-[2rem] @[1024px]:rounded-[3rem] ${currentStyle.card} hover:scale-[1.02] transition-all duration-500 flex flex-col @[640px]:flex-row items-start gap-6 @[640px]:gap-8 shadow-sm hover:shadow-2xl`}
                >
                  <div className={`w-12 h-12 @[640px]:w-16 @[640px]:h-16 shrink-0 ${currentStyle.accent} flex items-center justify-center font-black text-xl @[640px]:text-2xl rounded-2xl rotate-3 group-hover:rotate-0 transition-transform duration-500`}>
                    0{i+1}
                  </div>
                  <div className="w-full">
                    <h3 
                      contentEditable suppressContentEditableWarning 
                      onBlur={(e) => {
                        const newBenefits = [...data.benefits];
                        newBenefits[i] = e.currentTarget.textContent || '';
                        onUpdateData?.({ benefits: newBenefits });
                      }}
                      className="text-xl @[640px]:text-2xl @[1024px]:text-3xl font-black tracking-tight mb-4 outline-none hover:bg-black/5 dark:hover:bg-white/5 rounded-xl px-2 transition-all cursor-text leading-tight">
                      {benefit}
                    </h3>
                    <div className={`h-1 w-0 group-hover:w-full transition-all duration-700 ${currentStyle.accent} opacity-20 rounded-full`} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* FEATURES SECTION */}
      <SectionWrapper title="Fitur" sectionId="features" className="py-24 @[1024px]:py-40">
        <div className="max-w-7xl mx-auto px-6 @[1024px]:px-12">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="text-4xl @[1024px]:text-7xl font-black tracking-tight mb-6">Keunggulan Produk</motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className={`text-lg @[1024px]:text-2xl ${currentStyle.muted}`}>Kualitas dan detail terbaik yang kami hadirkan khusus untuk Anda.</motion.p>
          </div>
          
          <div className="space-y-32">
            {data.featureBreakdown.map((feature, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className={`flex flex-col ${i % 2 === 1 ? '@[1024px]:flex-row-reverse' : '@[1024px]:flex-row'} items-center gap-16 @[1024px]:gap-24`}
              >
                <div className="@[1024px]:w-1/2 w-full">
                  <div className="relative group">
                    <div className={`absolute -inset-4 ${currentStyle.accent} opacity-5 rounded-[4rem] blur-2xl group-hover:opacity-10 transition-opacity duration-700`} />
                    <ImagePlaceholder id={`feat-${i}`} className="w-full aspect-[16/10] rounded-[3rem] shadow-2xl relative z-10" />
                  </div>
                </div>
                <div className="@[1024px]:w-1/2 w-full">
                  <div className={`inline-block px-6 py-2 rounded-full ${currentStyle.accent} opacity-10 text-[10px] font-black uppercase tracking-widest mb-6`}>Keunggulan 0{i+1}</div>
                  <h4 
                    contentEditable suppressContentEditableWarning 
                    onBlur={(e) => {
                      const newFeatures = [...data.featureBreakdown];
                      newFeatures[i].title = e.currentTarget.textContent || '';
                      onUpdateData?.({ featureBreakdown: newFeatures });
                    }}
                    className="text-3xl @[1024px]:text-5xl font-black tracking-tighter mb-6 outline-none hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl px-2 transition-all cursor-text">
                    {feature.title}
                  </h4>
                  <p 
                    contentEditable suppressContentEditableWarning 
                    onBlur={(e) => {
                      const newFeatures = [...data.featureBreakdown];
                      newFeatures[i].description = e.currentTarget.textContent || '';
                      onUpdateData?.({ featureBreakdown: newFeatures });
                    }}
                    className={`text-lg @[1024px]:text-xl ${currentStyle.muted} leading-relaxed outline-none hover:bg-black/5 dark:hover:bg-white/5 rounded-2xl px-2 transition-all cursor-text`}>
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* TESTIMONIAL SECTION */}
      <SectionWrapper title="Testimoni" sectionId="testimonial" className={`py-32 @[1024px]:py-48 px-6 @[1024px]:px-12 text-center overflow-hidden relative`}>
        <div className={`absolute inset-0 ${currentStyle.bg} opacity-50`} />
        <div className="max-w-5xl mx-auto relative z-10">
          <Quote size={48} className={`mx-auto mb-12 ${currentStyle.muted} opacity-20`} />
          <motion.h2 
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            contentEditable suppressContentEditableWarning onBlur={(e) => onUpdateData?.({ socialProofPlaceholder: e.currentTarget.textContent || '' })}
            className="text-3xl @[1024px]:text-5xl font-black tracking-tighter italic leading-tight mb-16 outline-none hover:bg-black/5 dark:hover:bg-white/5 rounded-3xl px-6 transition-all cursor-text">
            "{data.socialProofPlaceholder}"
          </motion.h2>
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className={`absolute -inset-2 ${currentStyle.accent} opacity-20 rounded-full blur-md`} />
              <ImagePlaceholder id="avatar" className="w-24 h-24 rounded-full !p-0 relative z-10 border-4 border-white dark:border-black" />
            </div>
            <p className="text-sm font-black uppercase tracking-[0.4em]">Happy User</p>
            <div className="flex gap-1 mt-2">
              {[1,2,3,4,5].map(s => <Sparkles key={s} size={12} className="text-yellow-400 fill-yellow-400" />)}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* PRICING & CTA SECTION */}
      <SectionWrapper title="Harga" sectionId="pricing" className={`py-32 @[1024px]:py-48 px-6 @[1024px]:px-12`}>
        <div className="max-w-5xl mx-auto">
           <motion.div 
             initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
             className={`p-12 @[1024px]:p-32 rounded-[3rem] @[1024px]:rounded-[5rem] ${currentStyle.card} border ${currentStyle.border} text-center shadow-2xl relative overflow-hidden`}
           >
              <div className={`absolute top-0 right-0 w-64 h-64 ${currentStyle.accent} opacity-5 blur-[100px] -mr-32 -mt-32`} />
              <div className={`absolute bottom-0 left-0 w-64 h-64 ${currentStyle.accent} opacity-5 blur-[100px] -ml-32 -mb-32`} />
              
              <div className="relative z-10">
                <p className={`text-[10px] @[1024px]:text-sm font-black uppercase tracking-[0.6em] ${currentStyle.muted} mb-10`}>Investasi Terbaik Anda</p>
                <h3 
                  contentEditable suppressContentEditableWarning onBlur={(e) => onUpdateData?.({ pricing: e.currentTarget.textContent || '' })}
                  className="text-4xl @[768px]:text-6xl @[1024px]:text-7xl font-black tracking-tighter mb-12 outline-none hover:bg-black/5 dark:hover:bg-white/5 rounded-3xl px-6 transition-all cursor-text leading-none">
                  {data.pricing}
                </h3>
                <div className="grid grid-cols-1 @[640px]:grid-cols-3 gap-8 mb-16 max-w-3xl mx-auto">
                  {['Kualitas Premium', 'Terpercaya', 'Layanan Terbaik'].map((t, idx) => (
                    <motion.div 
                      key={t} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 + (idx * 0.1) }}
                      className="flex flex-col items-center gap-4"
                    >
                      <div className={`w-10 h-10 rounded-full ${currentStyle.accent} opacity-10 flex items-center justify-center`}>
                        <CheckCircle2 size={18} className="opacity-50" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest">{t}</span>
                    </motion.div>
                  ))}
                </div>
                <a href={data.whatsappNumber ? `https://wa.me/${data.whatsappNumber.replace(/[^0-9]/g, '')}` : '#pricing'} target="_blank" onClick={(e) => { if (!data.whatsappNumber) e.preventDefault(); }} className={`inline-block w-full @[640px]:w-auto px-8 py-4 @[1024px]:px-16 @[1024px]:py-8 ${currentStyle.accent} text-base @[1024px]:text-xl font-black rounded-2xl @[1024px]:rounded-[2.5rem] shadow-2xl hover:scale-[1.03] transition-all cursor-text outline-none`}>
                  <div contentEditable suppressContentEditableWarning onBlur={(e) => onUpdateData?.({ cta: e.currentTarget.textContent || '' })} className="outline-none pointer-events-auto" onClick={(e) => e.preventDefault()}>{data.cta}</div>
                </a>
              </div>
           </motion.div>
        </div>
      </SectionWrapper>

      {/* FOOTER */}
      <footer className={`py-16 px-6 @[1024px]:px-12 border-t ${currentStyle.border} text-center @[1024px]:text-left`}>
        <div className="max-w-7xl mx-auto flex flex-col @[1024px]:flex-row justify-between items-center gap-10 @[1024px]:gap-20">
          <div className="flex flex-col items-center @[1024px]:items-start gap-4">
            <div className="flex items-center justify-center @[1024px]:justify-start gap-3">
              <div className="w-10 h-10 flex-shrink-0">
                <ImagePlaceholder id="logo" hideText className="w-full h-full rounded-xl !p-0" />
              </div>
              <div 
                contentEditable 
                suppressContentEditableWarning 
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
                onBlur={(e) => {
                  const val = e.currentTarget.textContent || '';
                  if (val !== productName) onUpdateData?.({ productName: val });
                }}
                className="font-black italic text-3xl tracking-tighter outline-none cursor-text hover:ring-2 hover:ring-indigo-500 rounded px-2"
              >
                {productName || 'Brand.'}
              </div>
            </div>
          </div>
          <div className="flex flex-col @[640px]:flex-row flex-wrap justify-center gap-6 @[1024px]:gap-12 text-[10px] @[640px]:text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:opacity-50 transition-opacity">Kebijakan Privasi</a>
            <a href="#" className="hover:opacity-50 transition-opacity">Syarat & Ketentuan</a>
            <a href="#" className="hover:opacity-50 transition-opacity">Hubungi Kami</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
