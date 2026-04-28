import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-black/10 dark:border-white/10 bg-white dark:bg-black text-black dark:text-white py-16 px-6 transition-colors duration-500 ease-in-out">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center text-white dark:text-black font-serif font-black italic mb-6">
            L
          </div>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed mb-6">
            Laman.ai adalah generator landing page masa depan dengan AI. Kami mengubah deskripsi produk jadi halaman penjualan profesional yang langsung siap pakai.
          </p>
          <div className="text-sm font-semibold tracking-wider uppercase text-black dark:text-white">
            © 2026 Laman.ai. Hak cipta dilindungi.
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-6 tracking-tight">Produk</h4>
          <ul className="space-y-4 text-gray-500 dark:text-gray-400">
            <li><Link href="/generator" className="hover:text-black dark:hover:text-white transition-colors">Generator</Link></li>
            <li><Link href="/about" className="hover:text-black dark:hover:text-white transition-colors">Tentang Kami</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
