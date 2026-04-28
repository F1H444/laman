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
             <button className="flex items-center gap-2 px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform">
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
        />
      </div>
    </div>
  );
}
