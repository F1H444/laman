'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LivePreview from '@/components/preview/LivePreview';
import { createClient } from '@/lib/supabase/client';
import { ArrowLeft, Download, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function ViewSavedPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      const supabase = createClient();
      const { data: page, error } = await supabase
        .from('saved_pages')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !page) {
        router.push('/saved');
        return;
      }
      setData(page);
      setIsLoading(false);
    };

    if (id) fetchPage();
  }, [id, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-black/10 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Top Floating bar */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-4">
        <div className="bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-black/5 dark:border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-4">
            <Link href="/saved" className="p-2 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <div className="hidden sm:block">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{data.product_name}</p>
              <h1 className="text-xs font-bold truncate max-w-[150px]">{data.title}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
             <button 
               onClick={() => {
                 const container = document.getElementById('export-container');
                 if (!container) return;
                 const clone = container.cloneNode(true) as HTMLElement;
                 clone.querySelectorAll('.export-ignore').forEach(el => el.remove());
                 clone.querySelectorAll('input').forEach(el => el.remove());
                 clone.querySelectorAll('button').forEach(el => el.remove());
                 clone.querySelectorAll('.upload-placeholder-text').forEach(el => el.remove());
                 clone.querySelectorAll('.cursor-pointer').forEach(el => el.classList.remove('cursor-pointer'));
                 clone.querySelectorAll('.cursor-text').forEach(el => el.classList.remove('cursor-text'));
                 clone.querySelectorAll('[contenteditable]').forEach(el => {
                   el.removeAttribute('contenteditable');
                   el.removeAttribute('suppresscontenteditablewarning');
                 });
                 
                 const htmlContent = `<!DOCTYPE html>
<html lang="id" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <script src="https://cdn.tailwindcss.com?plugins=container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <style>
      input, button.export-ignore, .export-ignore { display: none !important; }
      [contenteditable] { pointer-events: none !important; cursor: default !important; }
      body { margin: 0; padding: 0; overflow-x: hidden; font-family: 'Plus Jakarta Sans', 'Inter', sans-serif; }
    </style>
    <script>
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
                 a.download = `${data.title.toLowerCase().replace(/\s+/g, '-')}.html`;
                 a.click();
                 URL.revokeObjectURL(url);
               }}
               className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
             >
                <Download size={14} /> Export HTML
             </button>
          </div>
        </div>
      </div>

      {/* The Page Content */}
      <div className="pt-24">
        <LivePreview 
          data={data.generated_data} 
          onRegenerateSection={() => {}} // Disabled in view mode
          productName={data.product_name}
        />
      </div>
    </div>
  );
}
