import { MapPin, ChevronDown, Bell, Search, ChevronRight, AlertTriangle, Heart, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export default function Home() {
  const [showLocation, setShowLocation] = useState(false);
  const [location, setLocation] = useState('上海市');
  const [currentTab, setCurrentTab] = useState<'adopt' | 'lost'>('adopt');
  const [currentCategory, setCurrentCategory] = useState<'all' | 'dog' | 'cat' | 'other'>('all');
  const [currentBanner, setCurrentBanner] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const { favorites, toggleFavorite } = useAppContext();
  const [pets, setPets] = useState<any[]>([]);
  const [loadingPets, setLoadingPets] = useState(true);

  useEffect(() => {
    async function fetchPets() {
      setLoadingPets(true);
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPets(data);
      }
      setLoadingPets(false);
    }
    fetchPets();
  }, []);

  const filteredPets = useMemo(() => {
    return pets.filter(pet => {
      // 1. Filter by Tab (post_type)
      if (pet.post_type !== currentTab && pet.type !== currentTab) return false;
      // 2. Filter by Category
      if (currentCategory !== 'all' && pet.category !== currentCategory) return false;
      // 3. Filter by Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = pet.name?.toLowerCase().includes(query);
        const matchesBreed = (pet.breed || '').toLowerCase().includes(query);
        const matchesDesc = (pet.description || pet.desc || '').toLowerCase().includes(query);
        if (!matchesName && !matchesBreed && !matchesDesc) return false;
      }
      return true;
    });
  }, [pets, currentTab, currentCategory, searchQuery]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev === 0 ? 1 : 0));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto pb-24 no-scrollbar bg-[#fcfaf8] dark:bg-[#1f1a14] min-h-screen text-[#1b160d] dark:text-[#f3eee7]">
      <header className="sticky top-0 z-20 bg-[#fcfaf8]/95 dark:bg-[#1f1a14]/95 backdrop-blur-md border-b border-[#ee9d2b]/10 px-4 pt-12 pb-2">
        <div className="flex items-center justify-between mb-4">
          <div className="relative">
            <div
              className="flex items-center gap-1 cursor-pointer group"
              onClick={() => setShowLocation(!showLocation)}
            >
              <MapPin className="w-5 h-5 text-[#ee9d2b] group-hover:scale-110 transition-transform" />
              <span className="font-bold text-lg">{location}</span>
              <ChevronDown className={`w-4 h-4 text-[#9a794c] dark:text-[#bca380] transition-transform ${showLocation ? 'rotate-180' : ''}`} />
            </div>

            {showLocation && (
              <div className="absolute top-full left-0 mt-2 w-32 bg-white dark:bg-[#2d261e] rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 py-2 z-50">
                {['北京市', '上海市', '广州市', '深圳市', '成都市'].map((city) => (
                  <button
                    key={city}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-[#fcfaf8] dark:hover:bg-[#1f1a14] transition-colors"
                    onClick={() => {
                      setLocation(city);
                      setShowLocation(false);
                    }}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="relative p-2 rounded-full hover:bg-[#ee9d2b]/10 transition-colors">
            <Bell className="w-6 h-6 text-[#1b160d] dark:text-[#f3eee7]" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#fcfaf8] dark:border-[#1f1a14]"></span>
          </button>
        </div>
        <div className="relative group mb-2">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-[#9a794c] dark:text-[#bca380]" />
          </div>
          <input
            type="text"
            placeholder="搜索猫猫狗狗、品种..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white dark:bg-[#2d261e] border-none rounded-xl py-3 pl-10 pr-4 text-sm shadow-sm focus:ring-2 focus:ring-[#ee9d2b]/50 placeholder:text-[#9a794c]/70 dark:placeholder:text-[#bca380]/70 transition-all outline-none"
          />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        <div className="px-4 py-4">
          <div className="bg-white dark:bg-[#2d261e] p-1 rounded-xl shadow-sm flex relative">
            <div
              className="absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-[#ee9d2b] rounded-lg shadow-md z-0 transition-all duration-300 ease-in-out"
              style={{ transform: currentTab === 'adopt' ? 'translateX(0)' : 'translateX(100%)' }}
            ></div>
            <button
              className={`flex-1 relative z-10 py-2.5 text-center text-sm font-bold transition-colors ${currentTab === 'adopt' ? 'text-white' : 'text-[#9a794c] dark:text-[#bca380] hover:text-[#ee9d2b]'}`}
              onClick={() => setCurrentTab('adopt')}
            >
              领养中心
            </button>
            <button
              className={`flex-1 relative z-10 py-2.5 text-center text-sm font-bold transition-colors ${currentTab === 'lost' ? 'text-white' : 'text-[#9a794c] dark:text-[#bca380] hover:text-[#ee9d2b]'}`}
              onClick={() => setCurrentTab('lost')}
            >
              寻宠启事
            </button>
          </div>
        </div>

        <div className="px-4 mb-6">
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            <button
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${currentCategory === 'all' ? 'bg-[#ee9d2b] text-white shadow-[0_4px_20px_-2px_rgba(238,157,43,0.1)]' : 'bg-white dark:bg-[#2d261e] border border-gray-100 dark:border-gray-800 text-[#1b160d] dark:text-[#f3eee7] hover:border-[#ee9d2b]/30 flex items-center gap-1'}`}
              onClick={() => setCurrentCategory('all')}
            >
              全部
            </button>
            <button
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${currentCategory === 'dog' ? 'bg-[#ee9d2b] text-white shadow-[0_4px_20px_-2px_rgba(238,157,43,0.1)] flex items-center gap-1' : 'bg-white dark:bg-[#2d261e] border border-gray-100 dark:border-gray-800 text-[#1b160d] dark:text-[#f3eee7] hover:border-[#ee9d2b]/30 flex items-center gap-1'}`}
              onClick={() => setCurrentCategory('dog')}
            >
              <span className="text-base">🐕</span> 狗狗
            </button>
            <button
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${currentCategory === 'cat' ? 'bg-[#ee9d2b] text-white shadow-[0_4px_20px_-2px_rgba(238,157,43,0.1)] flex items-center gap-1' : 'bg-white dark:bg-[#2d261e] border border-gray-100 dark:border-gray-800 text-[#1b160d] dark:text-[#f3eee7] hover:border-[#ee9d2b]/30 flex items-center gap-1'}`}
              onClick={() => setCurrentCategory('cat')}
            >
              <span className="text-base">🐈</span> 猫咪
            </button>
            <button
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${currentCategory === 'other' ? 'bg-[#ee9d2b] text-white shadow-[0_4px_20px_-2px_rgba(238,157,43,0.1)] flex items-center gap-1' : 'bg-white dark:bg-[#2d261e] border border-gray-100 dark:border-gray-800 text-[#1b160d] dark:text-[#f3eee7] hover:border-[#ee9d2b]/30 flex items-center gap-1'}`}
              onClick={() => setCurrentCategory('other')}
            >
              <span className="text-base">🐰</span> 其他宠物
            </button>
          </div>
        </div>

        <div className="px-4 mb-8">
          <div className="relative w-full h-40 rounded-2xl overflow-hidden shadow-lg group">
            <div
              className="flex transition-transform duration-500 ease-in-out h-full"
              style={{ transform: `translateX(-${currentBanner * 100}%)` }}
            >
              {/* Banner 1: Daily Recommendation */}
              <div className="w-full h-full flex-shrink-0 relative">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBs_1jypevPtwo2NnCBRIoLtvG_ALgc4Mngi7jXKqaZl7w2dpg5m9T3b5C5zUJvpvSmCxtL2ALaqTHjoq0xrIK0HgNWUOKqoMsuvEyzxBRjRARiDLhhVHCWGsfQNEUfkkORAWizsrKszeKQsQZ7ZI_KB-CO1WBxSwNieaeUv9zYE2iI9RoAJCaWpDab15Iz0IOnO5xvmlaZT9Efz3zCQy0KhlCAOiC3t8_EYX0AHIfgarnChSZj4rMutPI0bhuG8PFQeWUxwLTkfJoq"
                  alt="Happy dog running in a park"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-6">
                  <span className="bg-[#ee9d2b]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded w-fit mb-2 backdrop-blur-sm">每日推荐</span>
                  <h3 className="text-white text-xl font-bold leading-tight mb-1">给流浪的TA<br />一个温暖的家</h3>
                  <p className="text-white/80 text-xs">已有 1,203 只毛孩子找到家</p>
                </div>
              </div>

              {/* Banner 2: Emergency Lost Pet */}
              <Link to="/lost/1" className="w-full h-full flex-shrink-0 relative block">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRC1MHKHdr87MQpqUf8K71xeGPoST1h8C7alM75XTdTEEwR0L9zXriQfGwtDhFxbXVzSokdFPo6ieTaEta5pmReARYz9y_HyYqM-07APb75nLxbShQo2d0SZ33vLy_YKg4qkB7AFGdHcQgm2u5OpM_g5EjCORZOw5s48kdAJPyaivReR2NWx4qGvMzHGa3LMA6UpgfVGxmEWd4qdvxd3BoknifgA0Lz91hPvNMOYfCZ_aWCrhl2WB-4iitvPo10GDa2Ox8ZeOAZcI3"
                  alt="Lost cat"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/70 to-red-900/20 flex flex-col justify-center px-6">
                  <span className="bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded w-fit mb-2 backdrop-blur-sm flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> 紧急寻宠
                  </span>
                  <h3 className="text-white text-xl font-bold leading-tight mb-1">寻找：小白</h3>
                  <p className="text-white/90 text-sm font-bold text-[#ee9d2b] mb-1">¥2000 悬赏</p>
                  <p className="text-white/80 text-xs line-clamp-1">昨天下午在中山公园附近走失...</p>
                </div>
              </Link>
            </div>

            {/* Slider Indicators */}
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
              <div className={`h-1.5 rounded-full transition-all ${currentBanner === 0 ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}></div>
              <div className={`h-1.5 rounded-full transition-all ${currentBanner === 1 ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}></div>
            </div>
          </div>
        </div>

        <div className="px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-[#1b160d] dark:text-[#f3eee7]">{currentTab === 'adopt' ? '待领养' : '寻宠中'}</h2>
            <Link to={currentTab === 'adopt' ? "/categories" : "/categories?tab=lost"} className="text-xs text-[#ee9d2b] font-medium flex items-center">
              查看更多 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {currentTab === 'adopt' && (
              loadingPets ? (
                <div className="col-span-2 flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#ee9d2b]" /></div>
              ) : filteredPets.length === 0 ? (
                <div className="col-span-2 text-center text-sm text-gray-500 py-12">暂无相关宠物</div>
              ) : (
                filteredPets.map(pet => (
                  <div key={pet.id} className="bg-white dark:bg-[#2d261e] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800 group relative flex flex-col cursor-pointer block">
                    <Link to={`/pet/${pet.id}`} className="block flex-1">
                      <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
                        <img
                          src={pet.image_url || pet.image}
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
                          <h3 className="font-bold text-[#1b160d] dark:text-[#f3eee7]">{pet.name}</h3>
                          {pet.status && (
                            <span className={`text-[10px] ${pet.status === '已绝育' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300'} px-1.5 py-0.5 rounded`}>
                              {pet.status}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#9a794c] dark:text-[#bca380] mb-2">{pet.age} • {pet.breed}</p>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                          <MapPin className="w-3 h-3" />
                          <span>{pet.location}</span>
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
                ))))}

            {currentTab === 'lost' && (
              loadingPets ? (
                <div className="col-span-2 flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#ee9d2b]" /></div>
              ) : filteredPets.length === 0 ? (
                <div className="col-span-2 text-center text-sm text-gray-500 py-12">暂无相关宠物</div>
              ) : (
                filteredPets.map(pet => (
                  <Link key={pet.id} to={`/lost/${pet.id}`} className="col-span-2 block bg-white dark:bg-[#2d261e] rounded-xl p-4 shadow-sm border border-l-4 border-gray-100 border-l-[#ee9d2b] dark:border-gray-800 dark:border-l-[#ee9d2b]">
                    <div className="flex gap-4">
                      <img
                        src={pet.image_url || pet.image}
                        alt={pet.name}
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0 bg-gray-100 dark:bg-gray-800"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-[#1b160d] dark:text-[#f3eee7] truncate">{pet.name}</h3>
                          <span className="text-xs font-bold text-[#ee9d2b]">{pet.reward}</span>
                        </div>
                        <p className="text-xs text-[#9a794c] dark:text-[#bca380] mt-1 line-clamp-2">{pet.description || pet.desc}</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-[10px] text-gray-400">{pet.time || new Date(pet.created_at).toLocaleDateString()}</span>
                          <button className="bg-[#ee9d2b]/10 hover:bg-[#ee9d2b]/20 text-[#ee9d2b] text-xs font-medium px-3 py-1.5 rounded-full transition-colors">
                            帮忙寻找
                          </button>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
