import { ArrowLeft, Heart, MapPin, Loader2 } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

export default function Favorites() {
    const navigate = useNavigate();
    const { user, favorites, toggleFavorite } = useAppContext();
    const [favoritePets, setFavoritePets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadFavorites() {
            if (!user?.id) {
                setIsLoading(false);
                return;
            }

            if (favorites.length === 0) {
                setFavoritePets([]);
                setIsLoading(false);
                return;
            }

            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('pets')
                    .select('*')
                    .in('id', favorites)
                    .order('created_at', { ascending: false });

                if (error) throw error;
                setFavoritePets(data || []);
            } catch (err) {
                console.error("Error loading favorite pets:", err);
            } finally {
                setIsLoading(false);
            }
        }

        loadFavorites();
    }, [user?.id, favorites]);

    return (
        <div className="flex-1 overflow-y-auto pb-24 no-scrollbar bg-[#f8f7f6] dark:bg-[#221a10] min-h-screen text-[#1b160d] dark:text-[#f3eee7]">
            <header className="sticky top-0 z-20 bg-[#f8f7f6]/95 dark:bg-[#221a10]/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 px-4 pt-12 pb-4 flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold tracking-tight flex-1">我的关注/收藏</h1>
            </header>

            <main className="p-4">
                {isLoading ? (
                    <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#ee9d2b]" /></div>
                ) : favoritePets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center opacity-60">
                        <Heart className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-gray-500 font-medium">暂无收藏的宠物</p>
                        <Link to="/categories" className="mt-4 px-6 py-2 bg-[#ee9d2b] text-white rounded-full font-bold text-sm">
                            去随便逛逛
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4">
                        {favoritePets.map(pet => (
                            <div key={pet.id} className="bg-white dark:bg-[#2d261e] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800 group relative flex flex-col cursor-pointer block">
                                <Link to={pet.post_type === 'lost' ? `/lost/${pet.id}` : `/pet/${pet.id}`} className="block flex-1">
                                    <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
                                        <img
                                            src={pet.image_url || pet.image || 'https://picsum.photos/400'}
                                            alt={pet.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/60 backdrop-blur-sm p-1 rounded-full shadow-sm">
                                            <span className={pet.gender === 'male' ? "text-blue-500 text-xs font-bold block" : "text-pink-500 text-xs font-bold block"}>
                                                {pet.gender === 'male' ? '♂' : '♀'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="font-bold text-[#1b160d] dark:text-[#f3eee7] truncate flex-1">{pet.name || '宝宝'}</h3>
                                            <span className={`text-[10px] whitespace-nowrap px-1.5 py-0.5 rounded ml-2 ${pet.post_type === 'adopt' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                                                }`}>
                                                {pet.post_type === 'adopt' ? '待领养' : '寻宠'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[#9a794c] dark:text-[#bca380] mb-2">{pet.category} • {pet.age}</p>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                            <MapPin className="w-3 h-3" />
                                            <span className="truncate">{pet.location || '未知'}</span>
                                        </div>
                                    </div>
                                </Link>
                                {/* Favorite Button Overlay */}
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(pet.id); }}
                                    className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-black/60 backdrop-blur-sm shadow-sm rounded-full hover:bg-white dark:hover:bg-black transition-colors"
                                >
                                    <Heart className={`w-4 h-4 ${favorites.includes(pet.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
