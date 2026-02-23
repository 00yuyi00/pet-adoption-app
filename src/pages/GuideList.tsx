import { ArrowLeft, BookOpen, Clock, Loader2, Calendar } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function GuideList() {
    const navigate = useNavigate();
    const [guides, setGuides] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadGuides() {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('guides')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setGuides(data || []);
            } catch (err) {
                console.error("Error loading guides:", err);
            } finally {
                setIsLoading(false);
            }
        }

        loadGuides();
    }, []);

    return (
        <div className="flex-1 overflow-y-auto pb-24 no-scrollbar bg-[#fcfaf8] dark:bg-[#1f1a14] min-h-screen text-[#1b160d] dark:text-[#f3eee7]">
            <header className="sticky top-0 z-20 bg-[#fcfaf8]/95 dark:bg-[#1f1a14]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 pt-12 pb-4 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold tracking-tight flex-1">全部养宠指南</h1>
            </header>

            <main className="p-4">
                {isLoading ? (
                    <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#ee9d2b]" /></div>
                ) : guides.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                        <BookOpen className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-500 font-medium">暂无指南内容</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {guides.map(guide => (
                            <Link to={`/guide/${guide.id}`} key={guide.id} className="block bg-white dark:bg-[#2d261e] rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 group hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg group-hover:text-[#ee9d2b] transition-colors">{guide.title}</h3>
                                    <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-xs px-2 py-1 rounded font-medium ml-2 shrink-0">
                                        {guide.category === 'dog' ? '狗狗' : guide.category === 'cat' ? '猫咪' : '综合'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                                    {guide.content.replace(/[#*`_~]/g, '')}
                                </p>
                                <div className="flex items-center text-xs text-gray-400 gap-4">
                                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(guide.created_at).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {Math.max(1, Math.round(guide.content.length / 500))} 分钟阅读</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
