import { Search, Filter, ChevronDown, Loader2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Categories() {
  const [searchParams] = useSearchParams();
  const initialTab = (searchParams.get('tab') as 'adopt' | 'lost') || 'adopt';
  const [activeTab, setActiveTab] = useState<'adopt' | 'lost'>(initialTab);
  const [activeCategory, setActiveCategory] = useState('all');
  const [pets, setPets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const tab = searchParams.get('tab') as 'adopt' | 'lost';
    if (tab && (tab === 'adopt' || tab === 'lost')) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchPets() {
      setLoading(true);
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setPets(data);
      }
      setLoading(false);
    }
    fetchPets();
  }, []);

  const filteredPets = useMemo(() => {
    return pets.filter(pet => {
      if (pet.post_type !== activeTab && pet.type !== activeTab) return false;
      if (activeCategory !== 'all' && pet.category !== activeCategory) return false;
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = pet.name?.toLowerCase().includes(query);
        const matchesBreed = (pet.breed || '').toLowerCase().includes(query);
        const matchesDesc = (pet.description || pet.desc || '').toLowerCase().includes(query);
        if (!matchesName && !matchesBreed && !matchesDesc) return false;
      }
      return true;
    });
  }, [pets, activeTab, activeCategory, searchQuery]);

  const categories = [
    { id: 'all', name: '全部', icon: '🐾' },
    { id: 'dog', name: '狗狗', icon: '🐕' },
    { id: 'cat', name: '猫咪', icon: '🐈' },
    { id: 'other', name: '其他', icon: '🐰' },
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-24 no-scrollbar bg-[#fcfaf8] dark:bg-[#1f1a14] min-h-screen text-[#1b160d] dark:text-[#f3eee7]">
      <header className="sticky top-0 z-20 bg-[#fcfaf8]/95 dark:bg-[#1f1a14]/95 backdrop-blur-md border-b border-[#ee9d2b]/10 px-4 pt-12 pb-4">
        <h1 className="text-xl font-bold text-center mb-4">分类</h1>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-[#9a794c] dark:text-[#bca380]" />
            </div>
            <input
              type="text"
              placeholder="搜索品种、城市..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-[#2d261e] border-none rounded-xl py-2.5 pl-10 pr-4 text-sm shadow-sm focus:ring-2 focus:ring-[#ee9d2b]/50 placeholder:text-[#9a794c]/70 dark:placeholder:text-[#bca380]/70 transition-all outline-none"
            />
          </div>
          <button className="flex items-center justify-center w-10 h-10 bg-white dark:bg-[#2d261e] rounded-xl shadow-sm text-[#1b160d] dark:text-[#f3eee7]">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="px-4 py-4">
        <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setActiveTab('adopt')}
            className={`pb-2 text-base font-bold transition-colors relative ${activeTab === 'adopt' ? 'text-[#ee9d2b]' : 'text-[#9a794c] dark:text-[#bca380]'}`}
          >
            领养中心
            {activeTab === 'adopt' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ee9d2b] rounded-t-full"></div>}
          </button>
          <button
            onClick={() => setActiveTab('lost')}
            className={`pb-2 text-base font-bold transition-colors relative ${activeTab === 'lost' ? 'text-[#ee9d2b]' : 'text-[#9a794c] dark:text-[#bca380]'}`}
          >
            寻宠启事
            {activeTab === 'lost' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ee9d2b] rounded-t-full"></div>}
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar mb-6 pb-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${activeCategory === cat.id
                  ? 'bg-[#ee9d2b] text-white shadow-md shadow-[#ee9d2b]/20'
                  : 'bg-white dark:bg-[#2d261e] text-[#1b160d] dark:text-[#f3eee7] border border-gray-100 dark:border-gray-800'
                }`}
            >
              <span className="text-base">{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-sm text-[#9a794c] dark:text-[#bca380]">
            <span>默认排序</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="text-xs text-gray-400">共 {filteredPets.length} 个结果</div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-2 flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#ee9d2b]" /></div>
          ) : filteredPets.length === 0 ? (
            <div className="col-span-2 text-center text-sm text-gray-500 py-12">暂无相关宠物</div>
          ) : (
            filteredPets.map((pet) => (
              <Link to={activeTab === 'adopt' ? `/pet/${pet.id}` : `/lost/${pet.id}`} key={pet.id} className="bg-white dark:bg-[#2d261e] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-800 group cursor-pointer block">
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={pet.image_url || pet.image || `https://picsum.photos/seed/${activeTab}${pet.id}/400/400`}
                    alt={pet.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/60 backdrop-blur-sm p-1 rounded-full shadow-sm">
                    <span className={pet.gender === 'male' ? "text-blue-500 text-xs font-bold block" : "text-pink-500 text-xs font-bold block"}>
                      {pet.gender === 'male' ? '♂' : '♀'}
                    </span>
                  </div>
                </div>
                <div className="p-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-[#1b160d] dark:text-[#f3eee7] truncate flex-1">{pet.name}</h3>
                    {activeTab === 'adopt' ? (
                      pet.status && <span className="text-[10px] bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded whitespace-nowrap">{pet.status}</span>
                    ) : (
                      pet.reward && <span className="text-[10px] text-[#ee9d2b] font-bold whitespace-nowrap">{pet.reward}</span>
                    )}
                  </div>
                  <p className="text-xs text-[#9a794c] dark:text-[#bca380] mb-2 truncate">{pet.age} • {pet.breed || (pet.category === 'cat' ? '猫咪' : '狗狗')}</p>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <span className="truncate">{pet.location || '同城'}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
