import { Heart, BookOpen, Compass, ChevronRight, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export default function Discovery() {
    const { favorites } = useAppContext();
    const [favPets, setFavPets] = useState<any[]>([]);
    const [guides, setGuides] = useState<any[]>([]);

    useEffect(() => {
        async function fetchSavedPets() {
            if (favorites.length === 0) {
                setFavPets([]);
                return;
            }
            const { data } = await supabase
                .from('pets')
                .select('id, name, image_url, image')
                .in('id', favorites);

            if (data) setFavPets(data);
        }
        fetchSavedPets();
    }, [favorites]);

    useEffect(() => {
        async function fetchGuides() {
            const { data } = await supabase.from('guides').select('*');
            if (data) setGuides(data);
        }
        fetchGuides();
    }, []);

    const handleMoreClick = () => {
        // We could use a global toast system, but a standard alert works for a mock demo
        alert('开发小哥正在狂奔路上，功能待开发中...');
    };

    return (
        <div className="flex-1 overflow-y-auto pb-24 no-scrollbar bg-[#fcfaf8] dark:bg-[#1f1a14] min-h-screen text-[#1b160d] dark:text-[#f3eee7]">
            <header className="sticky top-0 z-20 bg-[#fcfaf8]/95 dark:bg-[#1f1a14]/95 backdrop-blur-md px-4 pt-12 pb-4 border-b border-[#ee9d2b]/10">
                <h1 className="text-xl font-bold tracking-tight">发现</h1>
            </header>

            <main className="px-4 py-8 space-y-8">
                {/* Module A: My Favorites Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                            我的收藏 ({favorites.length})
                        </h2>
                    </div>

                    {favorites.length === 0 ? (
                        <div className="bg-white dark:bg-[#2d261e] rounded-2xl p-8 text-center shadow-sm border border-gray-100 dark:border-gray-800">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Bookmark className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                            </div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">暂无收藏的毛孩子</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">去主页看看有没有合眼缘的吧~</p>
                        </div>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                            {favPets.map((pet) => (
                                <Link to={`/pet/${pet.id}`} key={pet.id} className="block flex-shrink-0 w-32 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden bg-white dark:bg-[#2d261e] shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-32 bg-gray-200 relative">
                                        <img
                                            src={pet.image_url || pet.image}
                                            alt={pet.name || "pet cover"}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute top-1 right-1 p-1 bg-white/80 dark:bg-black/60 backdrop-blur-sm rounded-full">
                                            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
                                        </div>
                                    </div>
                                    <div className="p-2">
                                        <p className="text-xs font-bold text-center truncate">{pet.name}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {/* Module B: Pet Guides */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-[#ee9d2b]" />
                            养宠指南
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/20 p-4 rounded-2xl relative overflow-hidden group cursor-pointer border border-orange-100 dark:border-orange-900/50">
                            <div className="relative z-10">
                                <span className="text-2xl mb-2 block">🐶</span>
                                <h3 className="font-bold text-orange-900 dark:text-orange-200 text-sm">狗狗养宠指南</h3>
                                <p className="text-[10px] text-orange-700/80 dark:text-orange-300/80 mt-1">新手接狗必看全攻略</p>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-orange-200/50 dark:bg-orange-800/30 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/20 p-4 rounded-2xl relative overflow-hidden group cursor-pointer border border-blue-100 dark:border-blue-900/50">
                            <div className="relative z-10">
                                <span className="text-2xl mb-2 block">🐱</span>
                                <h3 className="font-bold text-blue-900 dark:text-blue-200 text-sm">猫咪养宠指南</h3>
                                <p className="text-[10px] text-blue-700/80 dark:text-blue-300/80 mt-1">从零开始懂猫语</p>
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-blue-200/50 dark:bg-blue-800/30 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
                        </div>
                    </div>
                </section>

                {/* Module C: More */}
                <section>
                    <button
                        onClick={handleMoreClick}
                        className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#2d261e] rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-[#362e24] transition-colors active:scale-[0.98]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-500 flex items-center justify-center">
                                <Compass className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <h3 className="font-bold text-sm">探索更多</h3>
                                <p className="text-xs text-gray-400">线下活动、公益商店等</p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-300" />
                    </button>
                </section>

            </main>
        </div>
    );
}
