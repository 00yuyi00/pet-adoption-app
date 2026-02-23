import { ArrowLeft, Share2, Heart, MapPin, CheckCircle2, ShieldCheck, UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function PetDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { favorites, toggleFavorite, user } = useAppContext();

  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const isFav = id ? favorites.includes(id) : false;

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const { data: petData, error } = await supabase
          .from('pets')
          .select('*, profiles!pets_user_id_fkey(id, name, avatar_url, created_at)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPet(petData);

        // Check follow status if logged in
        if (user?.id && petData?.user_id) {
          const { data: followData } = await supabase
            .from('follows')
            .select('*')
            .eq('follower_id', user.id)
            .eq('following_id', petData.user_id)
            .single();
          setIsFollowing(!!followData);
        }
      } catch (err) {
        console.error("Error loading pet details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id, user?.id]);

  const toggleFollow = async () => {
    if (!user?.id) {
      alert('请先登录！');
      navigate('/login');
      return;
    }
    if (!pet?.user_id || user.id === pet.user_id) return;

    setIsFollowLoading(true);
    try {
      if (isFollowing) {
        // Unfollow
        await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', pet.user_id);
        setIsFollowing(false);
      } else {
        // Follow
        await supabase.from('follows').insert({ follower_id: user.id, following_id: pet.user_id });
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Error toggling follow:", err);
    } finally {
      setIsFollowLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#f8f7f6] dark:bg-[#221a10]"><Loader2 className="w-8 h-8 animate-spin text-[#ee9d2b]" /></div>;
  }

  if (!pet) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f7f6] dark:bg-[#221a10] text-slate-500">宠物信息未找到 <button onClick={() => navigate(-1)} className="mt-4 text-[#ee9d2b]">返回</button></div>;
  }

  return (
    <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col bg-[#f8f7f6] dark:bg-[#221a10] shadow-2xl overflow-hidden text-[#1b160d] dark:text-white">
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-all">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex gap-2">
          <button onClick={() => id && toggleFavorite(id)} className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-all">
            <Heart className={`w-6 h-6 ${isFav ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-md hover:bg-black/40 transition-all">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        <div className="relative w-full aspect-[4/5] bg-gray-200">
          <img
            src={pet.image_url || 'https://picsum.photos/400/500'}
            alt="Pet"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="px-5 pt-6 pb-4 bg-white dark:bg-[#2d2418] rounded-t-3xl -mt-6 relative z-10">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{pet.name || '未命名'}</h2>
              <p className="mt-1 text-sm text-[#9a794c] dark:text-gray-400 font-medium">
                {pet.breed || pet.category} • {pet.age || '未知年龄'} • {pet.gender === 'male' ? '男孩' : pet.gender === 'female' ? '女孩' : '未知'}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-3 py-1 rounded-full text-sm font-bold">
              {pet.post_type === 'adopt' ? '待领养' : pet.post_type === 'lost' ? '寻宠中' : '已寻获'}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
            <MapPin className="w-4 h-4" />
            <span>{pet.location || '位置未知'}</span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-[#f8f7f6] dark:bg-[#221a10] p-3 rounded-xl text-center">
              <div className="text-xs text-gray-500 mb-1">免疫情况</div>
              <div className="font-bold text-sm text-[#ee9d2b]">已接种</div>
            </div>
            <div className="bg-[#f8f7f6] dark:bg-[#221a10] p-3 rounded-xl text-center">
              <div className="text-xs text-gray-500 mb-1">驱虫情况</div>
              <div className="font-bold text-sm text-[#ee9d2b]">已驱虫</div>
            </div>
            <div className="bg-[#f8f7f6] dark:bg-[#221a10] p-3 rounded-xl text-center">
              <div className="text-xs text-gray-500 mb-1">绝育情况</div>
              <div className="font-bold text-sm text-[#ee9d2b]">已绝育</div>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-3">宠物故事</h3>
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300 mb-6 whitespace-pre-wrap">
            {pet.description || '主人很懒，什么都没写。'}
          </p>

          <h3 className="text-lg font-bold mb-3">领养要求</h3>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> 仅限上海同城领养
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> 有稳定的住所和收入
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> 接受定期视频回访
            </li>
            <li className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <CheckCircle2 className="w-4 h-4 text-green-500" /> 科学喂养，按时疫苗驱虫
            </li>
          </ul>

          <div className="flex items-center gap-3 p-4 bg-[#f8f7f6] dark:bg-[#221a10] rounded-xl flex-wrap">
            <img src={pet.profiles?.avatar_url || "https://picsum.photos/seed/user1/100/100"} alt="发布人" className="w-12 h-12 rounded-full object-cover bg-slate-200" />
            <div className="flex-1 min-w-[120px]">
              <div className="font-bold text-sm flex items-center gap-1">
                {pet.profiles?.name || '爱心用户'} <ShieldCheck className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-xs text-gray-500">已实名认证用户</div>
            </div>

            {user?.id !== pet.user_id && (
              <button
                onClick={toggleFollow}
                disabled={isFollowLoading}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-bold transition-colors ${isFollowing
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    : 'bg-[#ee9d2b]/10 text-[#ee9d2b] hover:bg-[#ee9d2b]/20'
                  }`}
              >
                {isFollowLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : isFollowing ? <><UserCheck className="w-4 h-4" /> 已关注</> : <><UserPlus className="w-4 h-4" /> 关注</>}
              </button>
            )}
          </div>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 right-0 border-t border-black/5 dark:border-white/5 bg-white dark:bg-[#2d2418] p-4 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-50">
        <Link to={`/adopt/${id}`} className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#ee9d2b] text-base font-bold text-white shadow-md shadow-orange-200 dark:shadow-none hover:bg-orange-500 active:scale-[0.98] transition-all">
          申请领养
        </Link>
      </div>
    </div>
  );
}
