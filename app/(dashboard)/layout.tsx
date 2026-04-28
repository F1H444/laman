'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlusSquare, 
  FolderRoot, 
  LogOut, 
  Menu,
  X,
  User,
  ArrowLeft,
  Sun,
  Moon
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTheme } from 'next-themes';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push('/login');
      setUser(data.user);
    };
    fetchUser();
  }, [router]);

  const navLinks = [
    { name: 'Generator', href: '/generator', icon: PlusSquare },
    { name: 'Halaman Saya', href: '/saved', icon: FolderRoot },
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
  };

  const toggleTheme = () => {
    if (!document.startViewTransition) {
      setTheme(theme === 'dark' ? 'light' : 'dark');
      return;
    }
    document.startViewTransition(() => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    });
  };

  if (!mounted) return null;

  return (
    <div className="flex h-screen bg-white dark:bg-black transition-colors duration-500 overflow-hidden">
      
      {/* 1. DESKTOP SIDEBAR - Stronger Borders */}
      <aside className="hidden md:flex flex-col w-64 border-r border-black/25 dark:border-white/10 bg-white dark:bg-black z-30 transition-colors duration-500">
        <div className="p-8 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-black italic text-sm transition-colors duration-500">
              L
            </div>
            <span className="font-bold text-lg tracking-tight">Laman.ai</span>
          </Link>
          
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-all duration-500 text-gray-400"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${
                  isActive 
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg shadow-black/10 dark:shadow-white/5' 
                    : 'text-gray-500 hover:text-black dark:hover:text-white'
                }`}
              >
                <link.icon size={18} />
                <span className="font-bold text-sm">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-6">
          {/* Back to Site Link - NOW ABOVE THE LINE */}
          <Link 
            href="/"
            className="flex items-center gap-3 px-4 py-3 mb-2 text-gray-500 hover:text-black dark:hover:text-white transition-all duration-500 text-xs font-black uppercase tracking-widest"
          >
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>

          <div className="h-px bg-black/25 dark:bg-white/10 w-full mb-6 transition-colors duration-500" />

          <div className="flex items-center gap-3 mb-4 px-4">
            <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center transition-colors duration-500">
              <User size={14} className="text-gray-500" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Akun</p>
              <p className="text-xs font-bold truncate text-gray-600 dark:text-gray-400 transition-colors duration-500">{user?.email}</p>
            </div>
          </div>
          
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:text-red-600 transition-all duration-500 font-black text-xs uppercase tracking-widest text-left"
          >
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </aside>

      {/* 2. MOBILE HEADER - Stronger Borders */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 px-6 border-b border-black/25 dark:border-white/10 bg-white/80 dark:bg-black/80 backdrop-blur-xl z-40 flex items-center justify-between transition-colors duration-500">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-black italic text-sm transition-colors duration-500">L</div>
          <span className="font-bold text-sm tracking-tight">Laman.ai</span>
        </Link>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 mr-2 transition-all duration-500"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2">
            <Menu size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-50 bg-white dark:bg-black p-8 flex flex-col transition-colors duration-500"
          >
            <div className="flex justify-between items-center mb-12">
              <span className="font-bold text-xl uppercase tracking-widest">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2"><X size={24} /></button>
            </div>
            <nav className="flex-1 space-y-4">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 text-2xl font-bold">
                <ArrowLeft size={24} /> Kembali ke Beranda
              </Link>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 text-2xl font-bold"
                >
                  <link.icon size={24} /> {link.name}
                </Link>
              ))}
              <button
                onClick={handleSignOut}
                className="flex items-center gap-4 text-2xl font-bold text-red-500 pt-8"
              >
                <LogOut size={24} /> Keluar
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col relative overflow-y-auto md:overflow-hidden pt-16 md:pt-0 bg-white dark:bg-black transition-colors duration-500">
        <div className="flex-1 h-full bg-white dark:bg-black transition-colors duration-500">
          {children}
        </div>
      </main>
    </div>
  );
}
