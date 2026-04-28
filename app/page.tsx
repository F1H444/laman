'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <div className="overflow-x-hidden relative bg-white dark:bg-black text-black dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-500 ease-in-out">

      {/* 1. HERO — Full screen, centered */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center text-center px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex flex-col items-center pt-20">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] mb-8 text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" /> LAMAN.AI
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-7xl lg:text-[6.5rem] font-bold tracking-tighter leading-[1] md:leading-[0.95] mb-8 max-w-7xl mx-auto flex flex-col items-center text-center w-full"
          >
            <span className="md:whitespace-nowrap text-black dark:text-white">Landing page keren.</span>
            <span className="text-[#64748b] dark:text-[#64748b] md:whitespace-nowrap mt-2 md:mt-0">Dalam hitungan detik.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-3xl leading-relaxed mb-12 mx-auto transition-colors duration-500 font-light"
          >
            Generator landing page berkelas. Masukkan detail produkmu dan dapatkan halaman penjualan yang terstruktur, persuasif, dan elegan tanpa perlu nulis kode sama sekali.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <Link 
              href="/generator" 
              className="w-full sm:w-auto px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold text-sm hover:scale-105 transition-transform flex items-center justify-center gap-2 rounded-lg"
            >
              Mulai Sekarang <ArrowRight size={16} />
            </Link>
            <Link 
              href="/about" 
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-black/20 dark:border-white/20 text-black dark:text-white font-bold text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors flex items-center justify-center gap-2 rounded-lg"
            >
              Cari Tahu Lebih Lanjut
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 2. CORE PILLARS — konten pas, tidak perlu full screen */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32">
        <div className="grid md:grid-cols-3 gap-16 md:gap-12">
          <div>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Copywriting yang Memikat.</h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-500">
              Ditulis oleh AI yang dilatih dengan teknik jualan tingkat tinggi. Dirancang khusus buat naikin konversi.
            </p>
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Desain Clean & Modern.</h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-500">
              Nggak pakai template yang kaku. Setiap halaman dibuat dengan gaya minimalis dan tipografi yang enak dibaca.
            </p>
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Langsung Export ke Code.</h3>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed transition-colors duration-500">
              Cukup satu klik buat dapetin file HTML dan Tailwind CSS yang siap pakai. Tinggal copy-paste ke project kamu.
            </p>
          </div>
        </div>
      </section>

      {/* 3. THE WORKFLOW — banyak konten, full screen */}
      <section className="w-full min-h-screen flex flex-col justify-center py-32 bg-white dark:bg-black transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-24 text-center">Gimana Cara Kerjanya?</h2>
          
          <div className="grid gap-6 md:gap-8">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group relative bg-gray-50 dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 overflow-hidden transition-all duration-500 hover:border-black/20 dark:hover:border-white/20"
            >
              <div className="absolute -right-8 -top-16 text-[15rem] md:text-[20rem] font-black text-black/5 dark:text-white/5 select-none group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700 pointer-events-none">1</div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-2xl md:text-3xl font-bold shrink-0 z-10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                1
              </div>
              <div className="z-10 text-center md:text-left pt-2">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Masukkan Info Produk</h3>
                <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl">
                  Ceritain apa yang lagi kamu jual. Tentukan siapa target pasarnya, berapa harganya, dan apa keunggulan uniknya.
                </p>
              </div>
            </motion.div>
            
            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative bg-gray-50 dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 overflow-hidden transition-all duration-500 hover:border-black/20 dark:hover:border-white/20"
            >
              <div className="absolute -right-8 -top-16 text-[15rem] md:text-[20rem] font-black text-black/5 dark:text-white/5 select-none group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700 pointer-events-none">2</div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-2xl md:text-3xl font-bold shrink-0 z-10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                2
              </div>
              <div className="z-10 text-center md:text-left pt-2">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">AI Langsung Bekerja</h3>
                <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl">
                  Sistem kami bakal nulis semua copywriting-nya dan otomatis nyusun desain layout yang elegan biar enak dibaca.
                </p>
              </div>
            </motion.div>
            
            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative bg-gray-50 dark:bg-[#0a0a0a] border border-black/5 dark:border-white/5 rounded-[2.5rem] p-10 md:p-16 flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 overflow-hidden transition-all duration-500 hover:border-black/20 dark:hover:border-white/20"
            >
              <div className="absolute -right-8 -top-16 text-[15rem] md:text-[20rem] font-black text-black/5 dark:text-white/5 select-none group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-700 pointer-events-none">3</div>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-2xl md:text-3xl font-bold shrink-0 z-10 shadow-xl group-hover:scale-110 transition-transform duration-500">
                3
              </div>
              <div className="z-10 text-center md:text-left pt-2">
                <h3 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Preview & Export</h3>
                <p className="text-xl text-gray-500 dark:text-gray-400 leading-relaxed max-w-3xl">
                  Lihat hasil preview-nya, revisi bagian yang kurang pas, lalu export halamannya jadi file HTML siap pakai.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. FAQ — konten pas, tidak perlu full screen */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-16 text-center">Pertanyaan yang Sering Diajukan.</h2>
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-12">
          <div>
            <h3 className="text-xl font-bold mb-3">Hasil export-nya pakai teknologi apa?</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              HTML murni dengan utility class Tailwind CSS. Bisa langsung dipakai di project Next.js, React, atau web HTML biasa.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3">Kodenya beneran bisa langsung dipakai?</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Tentu. Kodenya sangat bersih dan pakai semantic HTML. Nggak ada script tambahan atau library aneh yang bikin loading web kamu jadi berat.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3">Bisa diedit lagi nggak desainnya nanti?</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Pasti bisa. Karena pakai class Tailwind standar, web developer mana pun bisa langsung menyesuaikan styling-nya di source code.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-3">Ini gratis nggak sih?</h3>
            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
              Generator ini gratis buat diuji coba. Kalau mau fitur export lengkap atau mau bikin landing page tanpa batas, baru deh langganan.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
