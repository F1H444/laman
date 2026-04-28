'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Trash2, Eye, Plus, Search, Calendar, FileText } from 'lucide-react';

interface SavedPage {
  id: string;
  title: string;
  product_name: string;
  created_at: string;
  generated_data: any;
}

export default function SavedPagesPage() {
  const [pages, setPages] = useState<SavedPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/saved-pages', { cache: 'no-store' })
      .then(r => r.json())
      .then(json => {
        if (json.success) setPages(json.data || []);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin mau hapus halaman ini secara permanen?')) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/saved-pages?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) setPages(prev => prev.filter(p => p.id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPages = pages.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 md:p-12 max-w-7xl mx-auto bg-white dark:bg-black min-h-full transition-colors duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Halaman Saya.</h1>
          <p className="text-gray-500 font-medium">Kumpulan landing page keren yang udah kamu buat.</p>
        </div>
        <Link 
          href="/generator" 
          className="flex items-center gap-2 px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/10"
        >
          <Plus size={16} /> Buat Baru
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-4 mb-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Cari proyek..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-5 py-4 bg-white dark:bg-white/5 border border-black/15 dark:border-white/10 rounded-2xl text-sm focus:outline-none focus:border-black dark:focus:border-white transition-colors"
          />
        </div>
      </div>

      {/* Grid Content */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => (
            <div key={i} className="h-72 bg-black/5 dark:bg-white/5 rounded-[2.5rem] animate-pulse" />
          ))}
        </div>
      ) : filteredPages.length === 0 ? (
        <div className="py-32 text-center bg-white dark:bg-white/5 rounded-[3rem] border border-dashed border-black/15">
          <FileText className="mx-auto text-gray-300 dark:text-gray-700 mb-6" size={60} />
          <h3 className="text-xl font-bold mb-2">Belum ada halaman nih.</h3>
          <p className="text-gray-500 text-sm mb-8">Mulai buat project pertamamu biar muncul di sini.</p>
          <Link href="/generator" className="text-sm font-bold text-black dark:text-white underline underline-offset-8 decoration-2">Buka Generator</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredPages.map((page, i) => (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white dark:bg-[#050505] border border-black/15 dark:border-white/10 rounded-[2.5rem] overflow-hidden hover:border-black dark:hover:border-white transition-all hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)]"
              >
                <div className="p-10">
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Dipublikasikan</span>
                  </div>
                  
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{page.product_name}</p>
                  <h3 className="text-2xl font-bold tracking-tight mb-8 line-clamp-2 leading-tight">
                    {page.title}
                  </h3>

                  <div className="flex items-center gap-4 pt-8 border-t border-black/15 dark:border-white/10">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      <Calendar size={12} />
                      {new Date(page.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                </div>

                  <div className="flex border-t border-black/15 dark:border-white/10">
                    <Link 
                      href={`/generator?id=${page.id}`}
                      className="flex-1 flex items-center justify-center gap-2 py-5 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
                    >
                      <Eye size={14} /> Edit & Lihat
                    </Link>
                  <button 
                    onClick={() => handleDelete(page.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-5 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all border-l border-black/15 dark:border-white/10"
                  >
                    <Trash2 size={14} /> {deletingId === page.id ? '...' : 'Hapus'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
