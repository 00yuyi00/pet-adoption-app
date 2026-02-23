import { ArrowLeft, Clock, Share2, Loader2, Calendar } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { supabase } from '../lib/supabase';

export default function GuideDetail() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [guide, setGuide] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadGuide() {
            if (!id) return;
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('guides')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (error) throw error;
                setGuide(data);
            } catch (err) {
                console.error("Error loading guide:", err);
            } finally {
                setIsLoading(false);
            }
        }

        loadGuide();
    }, [id]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#fcfaf8] dark:bg-[#1f1a14]"><Loader2 className="w-8 h-8 animate-spin text-[#ee9d2b]" /></div>;
    }

    if (!guide) {
        return <div className="min-h-screen flex flex-col items-center justify-center bg-[#fcfaf8] dark:bg-[#1f1a14] text-slate-500">指南找不到了 <button onClick={() => navigate(-1)} className="mt-4 text-[#ee9d2b]">返回</button></div>;
    }

    return (
        <div className="flex-1 overflow-y-auto pb-24 no-scrollbar bg-[#fcfaf8] dark:bg-[#1f1a14] min-h-screen text-[#1b160d] dark:text-[#f3eee7]">
            <header className="sticky top-0 z-20 bg-[#fcfaf8]/95 dark:bg-[#1f1a14]/95 backdrop-blur-md px-4 pt-12 pb-4 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <button className="p-2 -mr-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <Share2 className="w-6 h-6" />
                </button>
            </header>

            <main className="px-5 py-2">
                <div className="mb-6">
                    <span className="inline-block bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs px-2.5 py-1 rounded-full font-bold mb-3">
                        {guide.category === 'dog' ? '狗狗指南' : guide.category === 'cat' ? '猫咪指南' : '综合指南'}
                    </span>
                    <h1 className="text-2xl font-bold tracking-tight mb-4 leading-snug">{guide.title}</h1>

                    <div className="flex items-center text-sm text-gray-400 dark:text-gray-500 gap-4 mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
                        <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {new Date(guide.created_at).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 预计阅读 {Math.max(1, Math.round(guide.content.length / 500))} 分钟</span>
                    </div>
                </div>

                {/* Markdown Content */}
                <div className="prose prose-stone dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-[#ee9d2b] prose-img:rounded-2xl pb-10">
                    <ReactMarkdown>{guide.content}</ReactMarkdown>
                </div>
            </main>
        </div>
    );
}
