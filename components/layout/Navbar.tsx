'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setMounted(true);
    const supabase = createClient();

    // Get initial session
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : 'auto';
  }, [mobileMenuOpen]);

  const handleThemeToggle = () => {
    const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    if (!document.startViewTransition) { setTheme(nextTheme); return; }
    document.startViewTransition(() => { flushSync(() => { setTheme(nextTheme); }); });
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setMobileMenuOpen(false);
    router.push('/');
  };

  // Public links — always visible
  const publicLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Tentang', href: '/about' },
    { name: 'Generator', href: '/generator' },
  ];

  // Protected links — only when logged in
  const protectedLinks = user
    ? [{ name: 'Halaman Saya', href: '/saved' }]
    : [];

  const allLinks = [...publicLinks, ...protectedLinks];

  return (
    <>
      <div className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto w-full max-w-3xl rounded-full bg-white/70 dark:bg-black/70 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.08)] dark:shadow-[0_8px_32px_rgba(255,255,255,0.05)] px-4 md:px-6 py-2.5 md:py-3 flex justify-between items-center transition-all duration-300">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-serif font-black italic transition-colors duration-500 text-sm md:text-base">
              L
            </div>
            <span className="font-bold tracking-tight text-black dark:text-white text-base md:text-lg transition-colors duration-500">Laman.ai</span>
          </Link>

          {/* DESKTOP NAV */}
          <div className="hidden md:flex items-center space-x-1">
            {allLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isActive 
                      ? 'bg-black/5 dark:bg-white/10 text-black dark:text-white' 
                      : 'text-gray-500 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* ACTIONS */}
          <div className="hidden md:flex items-center gap-3">
            {mounted && (
              <button
                onClick={handleThemeToggle}
                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            
            {user ? (
              <button
                onClick={handleSignOut}
                className="px-5 py-2 rounded-full border border-black/10 dark:border-white/10 text-black dark:text-white text-sm font-semibold hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Keluar
              </button>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 rounded-full bg-black dark:bg-white text-white dark:text-black text-sm font-semibold hover:scale-105 transition-transform"
              >
                Masuk
              </Link>
            )}
          </div>

          {/* MOBILE TOGGLE */}
          <div className="md:hidden flex items-center gap-3">
            {mounted && (
              <button onClick={handleThemeToggle} className="p-2 text-gray-500">
                {resolvedTheme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-black dark:text-white"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center space-y-8"
          >
            {allLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-4xl font-bold text-black dark:text-white hover:text-gray-500 dark:hover:text-gray-400 transition-colors"
              >
                {link.name}
              </Link>
            ))}
            
            {user ? (
              <button
                onClick={handleSignOut}
                className="mt-4 px-8 py-4 rounded-full border-2 border-black dark:border-white text-black dark:text-white text-xl font-bold"
              >
                Keluar
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="mt-4 px-8 py-4 rounded-full bg-black dark:bg-white text-white dark:text-black text-xl font-bold"
              >
                Masuk
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
