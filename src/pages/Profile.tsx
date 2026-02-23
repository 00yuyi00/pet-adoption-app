import { Bell, Edit2, ShieldCheck, PawPrint, Megaphone, Heart, FileText, HelpCircle, Settings, ChevronRight, LogOut, X, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateUser } = useAppContext();

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAvatar, setEditAvatar] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const handleEditOpen = () => {
    setEditName(user.name);
    setEditAvatar(user.avatar);
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    setIsSubmitting(true);
    await updateUser({ name: editName, avatar: editAvatar });
    setIsSubmitting(false);
    setIsEditing(false);
  };

  return (
    <div className="flex-1 overflow-y-auto pb-24 no-scrollbar bg-[#f8f7f6] dark:bg-[#221a10] min-h-screen text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-10 bg-[#f8f7f6]/90 dark:bg-[#221a10]/90 backdrop-blur-md px-4 pt-12 pb-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <h1 className="text-xl font-bold tracking-tight">个人中心</h1>
        <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <Bell className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </button>
      </header>

      <main className="flex-1 px-4 py-6 flex flex-col gap-6 overflow-y-auto no-scrollbar pb-24">
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-[#ee9d2b]/10 rounded-full blur-2xl"></div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-[#ee9d2b] to-amber-200">
                <img
                  src={user.avatar}
                  alt="User profile"
                  className="w-full h-full object-cover rounded-full border-2 border-white dark:border-slate-900"
                />
              </div>
              <button onClick={handleEditOpen} className="absolute bottom-0 right-0 p-1.5 bg-slate-900 text-white rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md hover:bg-slate-800 transition-colors">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900 dark:text-white">{user.name}</h2>
            <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#ee9d2b]/10 text-[#ee9d2b] text-xs font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>加入于 2023年</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-4 divide-x divide-slate-100 dark:divide-slate-800">
            <div className="flex flex-col items-center text-center">
              <span className="text-lg font-bold text-slate-900 dark:text-white">2</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">关注</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-lg font-bold text-slate-900 dark:text-white">5</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">粉丝</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <span className="text-lg font-bold text-slate-900 dark:text-white">12</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">获赞</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Link to="/my-adoptions" className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500 flex items-center justify-center">
              <PawPrint className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">我的领养</span>
          </Link>
          <Link to="/my-posts" className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20 text-orange-500 flex items-center justify-center">
              <Megaphone className="w-6 h-6" />
            </div>
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300">我的发布</span>
          </Link>
        </div>

        <div className="flex flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
          <Link to="/applications" className="group flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-[#ee9d2b]/20 group-hover:text-[#ee9d2b] transition-colors">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">申请记录</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Link>
          <Link to="#" className="group flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border-b border-slate-100 dark:border-slate-800 last:border-0">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-[#ee9d2b]/20 group-hover:text-[#ee9d2b] transition-colors">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">帮助中心</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Link>
          <Link to="#" className="group flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors last:border-0">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:bg-[#ee9d2b]/20 group-hover:text-[#ee9d2b] transition-colors">
              <Settings className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">设置</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </Link>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#ee9d2b] to-orange-400 p-4 text-white shadow-lg">
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #fff 10%, transparent 10%)', backgroundSize: '10px 10px' }}></div>
          <div className="relative z-10 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">会员专享</p>
              <p className="text-lg font-bold">升级 VIP 解锁更多功能</p>
            </div>
            <button className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-[#ee9d2b] shadow-sm">
              查看详情
            </button>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 flex items-center justify-center gap-2 w-full py-4 bg-white dark:bg-slate-900 rounded-2xl text-red-500 font-bold shadow-sm border border-slate-100 dark:border-slate-800"
        >
          <LogOut className="w-5 h-5" />
          退出登录
        </button>
      </main>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-lg">修改个人资料</h3>
              <button onClick={() => setIsEditing(false)} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">昵称</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#ee9d2b]/50 outline-none"
                  placeholder="请输入您的昵称"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">头像链接 (URL)</label>
                <input
                  type="text"
                  value={editAvatar}
                  onChange={(e) => setEditAvatar(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#ee9d2b]/50 outline-none"
                  placeholder="请输入图片外链URL..."
                />
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 flex gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 py-3 font-bold rounded-xl text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50"
              >
                取消
              </button>
              <button
                disabled={isSubmitting}
                onClick={handleSaveProfile}
                className="flex-1 py-3 font-bold rounded-xl text-white bg-[#ee9d2b] shadow-md shadow-[#ee9d2b]/20 hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : '保存修改'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
