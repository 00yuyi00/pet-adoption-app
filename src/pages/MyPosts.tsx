import { ArrowLeft, Edit, Trash2, Loader2, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

export default function MyPosts() {
  const navigate = useNavigate();
  const { user, authLoading } = useAppContext();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) {
      navigate('/login');
      return;
    }
    fetchMyPosts();
  }, [user, authLoading]);

  const fetchMyPosts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setPosts(data);
    }
    setLoading(false);
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm('确定要删除这条发布吗？')) return;

    const { error } = await supabase.from('pets').delete().eq('id', postId);
    if (!error) {
      setPosts(posts.filter(p => p.id !== postId));
    } else {
      alert('删除失败: ' + error.message);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8f7f6] dark:bg-[#221a10] min-h-screen text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-10 bg-[#f8f7f6]/90 dark:bg-[#221a10]/90 backdrop-blur-md px-4 pt-12 pb-4 flex items-center border-b border-slate-200 dark:border-slate-800">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold ml-2">我的发布</h1>
      </header>

      <main className="p-4 space-y-4 pb-24">
        {loading || authLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-[#ee9d2b]" /></div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">暂无发布记录</div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="bg-white dark:bg-[#2d261e] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
              <div className="flex gap-3 mb-2">
                <img src={post.image_url || 'https://via.placeholder.com/150'} alt="pet" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold truncate text-sm">{post.name || '未命名'}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded ${post.post_type === 'lost' ? 'bg-red-100 text-red-600' : post.post_type === 'found' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                      {post.post_type === 'lost' ? '寻宠' : post.post_type === 'found' ? '捡到' : '送养'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{post.description}</p>
                  <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3" />{post.location}</p>
                </div>
              </div>

              {post.reward && (
                <div className="text-xs font-bold text-orange-500 mb-2">悬赏: {post.reward}</div>
              )}

              <div className="flex justify-between items-center mt-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400">{new Date(post.created_at).toLocaleDateString()}</span>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700">
                    <Edit className="w-3 h-3" /> 编辑
                  </button>
                  <button onClick={() => handleDelete(post.id)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-red-200 dark:border-red-900/30">
                    <Trash2 className="w-3 h-3" /> 删除
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
