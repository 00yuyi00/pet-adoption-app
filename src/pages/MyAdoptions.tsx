import { ArrowLeft, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

export default function MyAdoptions() {
  const navigate = useNavigate();
  const { user, authLoading } = useAppContext();
  const [adoptions, setAdoptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) {
      navigate('/login');
      return;
    }
    fetchMyAdoptions();
  }, [user, authLoading]);

  const fetchMyAdoptions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('*, pets(name, image_url), owner:profiles!applications_owner_id_fkey(name)')
      .eq('applicant_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setAdoptions(data);
    }
    setLoading(false);
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 已通过</span>;
      case 'rejected':
        return <span className="text-xs font-medium text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-full flex items-center gap-1"><XCircle className="w-3 h-3" /> 已拒绝</span>;
      default:
        return <span className="text-xs font-medium text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> 审核中</span>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8f7f6] dark:bg-[#221a10] min-h-screen text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-10 bg-[#f8f7f6]/90 dark:bg-[#221a10]/90 backdrop-blur-md px-4 pt-12 pb-4 flex items-center border-b border-slate-200 dark:border-slate-800">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold ml-2">我的领养</h1>
      </header>

      <main className="p-4 space-y-4 pb-24">
        {loading || authLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-[#ee9d2b]" /></div>
        ) : adoptions.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">暂无领养申请记录</div>
        ) : (
          adoptions.map(item => (
            <div key={item.id} className="bg-white dark:bg-[#2d261e] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-bold">领养申请：{item.pets?.name || '未知宠物'}</span>
                {getStatusDisplay(item.status)}
              </div>
              <div className="flex gap-4">
                <img src={item.pets?.image_url || 'https://via.placeholder.com/150'} alt="Pet" className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">申请时间：{new Date(item.created_at).toLocaleDateString()}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">送养人：{item.owner?.name || '未知用户'}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </main>
    </div>
  );
}
