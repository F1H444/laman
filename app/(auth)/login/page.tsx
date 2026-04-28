'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError(error.message);
      setIsLoading(false);
    }
    // If no error, browser redirects to Google automatically
  };

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message === 'Invalid login credentials') {
        setError('Akun belum terdaftar!!');
      } else {
        setError(error.message);
      }
      setIsLoading(false);
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black px-6 transition-colors duration-500">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-black/5 dark:bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl relative z-10 transition-colors duration-500"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-black dark:bg-white text-white dark:text-black font-serif font-black italic text-lg mb-6 hover:scale-105 transition-transform">
            L
          </Link>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Selamat datang</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Masuk ke akun Laman.ai kamu buat lanjutin.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Google */}
        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors mb-8 disabled:opacity-60"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          )}
          {isLoading ? 'Meneruskan...' : 'Lanjut pakai Google'}
        </button>

        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/10 dark:border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white dark:bg-black px-4 text-gray-400 transition-colors duration-500">atau masuk pakai email</span>
          </div>
        </div>

        <form className="space-y-4 mb-8" onSubmit={handleEmailLogin}>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Alamat Email</label>
            <input 
              name="email"
              type="email"
              required
              className="w-full bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-black/50 dark:focus:border-white/50 transition-colors"
              placeholder="anda@contoh.com"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">Password</label>
            <input 
              name="password"
              type="password"
              required
              className="w-full bg-gray-50 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl p-4 text-sm focus:outline-none focus:border-black/50 dark:focus:border-white/50 transition-colors"
              placeholder="••••••••"
            />
          </div>
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold mt-2 hover:bg-gray-900 dark:hover:bg-gray-200 transition-colors disabled:opacity-60"
          >
            {isLoading ? 'Tunggu bentar...' : 'Masuk'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Belum punya akun?{' '}
          <Link href="/signup" className="text-black dark:text-white font-semibold hover:underline">
            Daftar sekarang
          </Link>
        </p>

      </motion.div>
    </div>
  );
}
