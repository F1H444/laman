'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden bg-white dark:bg-black text-black dark:text-white transition-colors duration-500 ease-in-out selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      <title>Tentang | Laman.ai</title>
      
      {/* 1. HERO — Left-aligned editorial, full screen */}
      <section className="w-full min-h-screen flex flex-col justify-center max-w-7xl mx-auto px-6 lg:px-8">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-8"
        >
          Tentang
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-[0.9] max-w-5xl"
        >
          Apa itu <br /> 
          <span className="text-gray-300 dark:text-gray-800 transition-colors duration-500">Laman.ai?</span>
        </motion.h1>
      </section>

      {/* 2. THE PROBLEM — banyak konten, full screen */}
      <section className="w-full min-h-screen bg-white dark:bg-black py-32 flex items-center transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row gap-12 md:gap-24">
            <div className="md:w-1/3">
              <div className="sticky top-32">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Ribetnya Bikin Landing Page.</h2>
                <div className="w-12 h-1 bg-black dark:bg-white transition-colors duration-500" />
              </div>
            </div>
            <div className="md:w-2/3 space-y-12">
              <p className="text-2xl md:text-4xl text-gray-600 dark:text-gray-400 leading-snug font-medium transition-colors duration-500">
                Dulu, bikin landing page selalu ngasih dua pilihan yang bikin pusing.
              </p>
              <div className="grid md:grid-cols-2 gap-8 pt-8">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Pilihan A</h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Sewa jasa profesional. Kamu harus keluar uang banyak dan nunggu lama banget cuma buat lihat hasilnya.
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Pilihan B</h3>
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed">
                    Bikin sendiri pakai template biasa. Harus mikirin kata-kata sendiri, dan seringkali desainnya kelihatan murahan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE PHILOSOPHY (Bento) — banyak konten, tidak dipaksa full */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 py-24 md:py-32">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-16 text-center">Filosofi Kami</h2>
        
        <div className="grid md:grid-cols-12 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-8 bg-white dark:bg-black border border-black/10 dark:border-white/10 p-10 md:p-16 rounded-3xl transition-colors duration-500"
          >
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 block">01 / Misi Utama</span>
            <h3 className="text-3xl md:text-4xl font-bold mb-6">Kerja Cepat Tanpa Drama.</h3>
            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed max-w-xl transition-colors duration-500">
              Laman.ai dibikin buat bantu kreator kayak kamu. Dapetin landing page keren cuma dalam beberapa detik. Kamu tinggal fokus jualan, urusan web serahin ke AI.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-4 bg-black dark:bg-white text-white dark:text-black p-10 md:p-16 rounded-3xl flex flex-col justify-between transition-colors duration-500"
          >
            <div>
              <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4 block">02 / Desain & Estetika</span>
              <h3 className="text-3xl font-bold mb-6">Simpel & Menarik.</h3>
            </div>
            <p className="text-gray-300 dark:text-gray-700 leading-relaxed transition-colors duration-500">
              Desain modern yang bersih, rapi, dan enak dilihat. Fokus langsung ke pesan produk yang pengen kamu sampaikan.
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-12 bg-white dark:bg-black border border-black/10 dark:border-white/10 p-10 md:p-16 rounded-3xl flex flex-col md:flex-row items-center gap-12 transition-colors duration-500"
          >
            <div className="md:w-1/2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 block">03 / Mesin di Balik Layar</span>
              <h3 className="text-3xl md:text-5xl font-bold mb-6">Strategi Penjualan Jitu.</h3>
              <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed transition-colors duration-500">
                AI kami tahu cara nulis kata-kata yang bikin orang pengen beli. Mulai dari judul utama yang nyita perhatian sampai ke tombol "Beli Sekarang".
              </p>
            </div>
            <div className="md:w-1/2 w-full h-64 md:h-80 bg-gray-100 dark:bg-[#111] rounded-2xl flex items-center justify-center transition-colors duration-500 relative overflow-hidden border border-black/5 dark:border-white/5">
              <Image 
                src="/images/ai_sales_strategy.png"
                alt="Ilustrasi Strategi AI Laman.ai"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </section>



      {/* 5. CTA — konten sedikit, tidak perlu full screen */}
      <section className="max-w-5xl mx-auto px-6 py-24 md:py-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="rounded-[2rem] bg-white dark:bg-black border border-black/10 dark:border-white/10 p-12 md:p-24 text-center shadow-2xl transition-colors duration-500"
        >
          <h3 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Gak Usah Pusing Nulis. Langsung Jualan.</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-12 text-lg">
            Ayo ikut ribuan orang lain yang udah nikmatin mudahnya bikin landing page dengan AI.
          </p>
          <Link 
            href="/generator" 
            className="inline-flex items-center gap-2 px-10 py-5 bg-black dark:bg-white text-white dark:text-black rounded-full text-lg font-bold hover:scale-105 transition-transform"
          >
            Buat Halamanmu <ArrowRight size={20} />
          </Link>
        </motion.div>
      </section>
      
      <Footer />
    </div>
  );
}
