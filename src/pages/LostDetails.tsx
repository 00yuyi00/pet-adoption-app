import { ArrowLeft, Share2, MapPin, Calendar, PawPrint, Info, MessageSquare, Phone, UserPlus, UserCheck, ShieldCheck, Loader2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

export default function LostDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAppContext();

  const [pet, setPet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        const { data: petData, error } = await supabase
          .from('pets')
          .select('*, profiles!pets_user_id_fkey(id, name, avatar_url)')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPet(petData);

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
        console.error("Error loading lost details:", err);
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
        await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', pet.user_id);
        setIsFollowing(false);
      } else {
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
    return <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f7f6] dark:bg-[#221a10] text-slate-500">走失信息未找到 <button onClick={() => navigate(-1)} className="mt-4 text-[#ee9d2b]">返回</button></div>;
  }

  return (
    <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col bg-[#f8f7f6] dark:bg-[#221a10] shadow-2xl overflow-hidden text-[#1b160d] dark:text-white">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-[#f8f7f6]/80 dark:bg-[#221a10]/80 px-4 py-3 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full text-[#1b160d] dark:text-white hover:bg-black/5 active:scale-95 transition-all">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">丢失详情</h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#1b160d] dark:text-white hover:bg-black/5 active:scale-95 transition-all">
          <Share2 className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        <div className="relative w-full aspect-[4/3] bg-gray-200">
          <img
            src={pet.image_url || 'https://picsum.photos/400/300'}
            alt="Pet"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 dark:bg-[#2d2418]/90 px-3 py-1.5 shadow-lg backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ee9d2b] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ee9d2b]"></span>
            </span>
            <span className="text-xs font-bold text-[#ee9d2b]">寻找中 (Searching)</span>
          </div>
        </div>

        <div className="px-5 pt-6 pb-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">{pet.name || '走失宝贝'}</h2>
              <p className="mt-1 text-base text-[#9a794c] dark:text-gray-400 font-medium">{pet.category || '宠物'} • {pet.age || '未知年龄'} • {pet.gender === 'male' ? '公' : pet.gender === 'female' ? '母' : '未知'}</p>
            </div>
            {pet.reward && (
              <div className="flex flex-col items-end">
                <span className="text-xs text-gray-400 mb-1">悬赏金额</span>
                <span className="text-xl font-bold text-[#ee9d2b]">{pet.reward}</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {pet.status && (
              <span className="inline-flex items-center rounded-lg bg-stone-100 dark:bg-stone-800 px-2.5 py-1 text-xs font-medium text-stone-600 dark:text-stone-400 ring-1 ring-inset ring-stone-500/10">
                {pet.status}
              </span>
            )}
          </div>
        </div>

        <div className="mt-6 px-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#ee9d2b]" />
              最后出现地点
            </h3>
          </div>
          <div className="relative h-48 w-full overflow-hidden rounded-xl shadow-sm border border-black/5 dark:border-white/5 bg-gray-100">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAACS7sU3LsJBq57N859ToaJji4OquqtSKjHfgSzwkMzEHQmYEX7cyLEpxvmGTYUxvOmi5-Wjinj9M6OmNTU4sJn4Oe85AkodXfC9GwmsXGcxVa-0v2WPuM81Xn8B5K9ZoY5Qqr1a0SUA2abaER4T-vSUoOLcWK7iqaCT_2I5JtKGy1K5deHhPCoXDCRDEKCgpQlY4oFLwh1AUyM5cHVHC3QpA9ffmv3rJVRay9oVmg6G6J9eh1WXO6U7AnWpjKpEFhBrmDLLxbp98R"
              alt="Map"
              className="h-full w-full object-cover opacity-90"
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full transform flex flex-col items-center">
              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#ee9d2b] shadow-lg ring-4 ring-white dark:ring-[#2d2418]">
                <img
                  src={pet.image_url || "https://picsum.photos/400"}
                  alt="Avatar"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="h-3 w-0.5 bg-[#ee9d2b]"></div>
              <div className="h-1.5 w-4 rounded-[100%] bg-black/20 blur-[1px]"></div>
            </div>
            <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-white/95 dark:bg-[#2d2418]/95 p-3 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold truncate">{pet.location || '未知确切地址'}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 px-5">
          <h3 className="text-lg font-bold mb-4">详细信息</h3>
          <div className="space-y-4 rounded-xl bg-white dark:bg-[#2d2418] p-4 shadow-sm border border-black/5 dark:border-white/5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-900/20 text-[#ee9d2b]">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm font-medium text-[#9a794c] dark:text-gray-400">发布/丢失时间</p>
                <p className="text-base font-semibold">{pet.time || new Date(pet.created_at).toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-900/20 text-[#ee9d2b]">
                <PawPrint className="w-5 h-5" />
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm font-medium text-[#9a794c] dark:text-gray-400">特征描述</p>
                <p className="mt-1 text-sm leading-relaxed whitespace-pre-wrap">
                  {pet.description || '未提供详细描述'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* User Card with Follow functionality */}
        <div className="mt-6 px-5 mb-8">
          <h3 className="text-lg font-bold mb-3">发布人信息</h3>
          <div className="flex items-center gap-3 p-4 bg-white dark:bg-[#2d2418] rounded-xl shadow-sm border border-black/5 dark:border-white/5 flex-wrap">
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
        <div className="flex gap-3">
          <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#ee9d2b] text-base font-bold text-white shadow-md shadow-orange-200 dark:shadow-none hover:bg-orange-500 active:scale-[0.98] transition-all">
            <MessageSquare className="w-5 h-5" /> 留言提供线索
          </button>
          <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 text-base font-bold text-white shadow-md shadow-orange-900/20 hover:bg-orange-700 active:scale-[0.98] transition-all">
            <Phone className="w-5 h-5" />
            拨打联系电话
          </button>
        </div>
      </div>
    </div>
  );
}
