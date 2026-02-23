import { ArrowLeft, FileText, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

export default function Applications() {
  const navigate = useNavigate();
  const { user, authLoading } = useAppContext();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user?.id) {
      navigate('/login');
      return;
    }
    fetchApplications();
  }, [user, authLoading]);

  const fetchApplications = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .select('*, pets(name, image_url), applicant:profiles!applications_applicant_id_fkey(name, phone, avatar_url)')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setApplications(data);
    }
    setLoading(false);
  };

  const updateStatus = async (appId: string, newStatus: 'approved' | 'rejected') => {
    if (!window.confirm(`确定要${newStatus === 'approved' ? '批准' : '拒绝'}吗？`)) return;

    const { error } = await supabase.from('applications').update({ status: newStatus }).eq('id', appId);
    if (!error) {
      setApplications(applications.map(app => app.id === appId ? { ...app, status: newStatus } : app));
    } else {
      alert('更新失败: ' + error.message);
    }
  };

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="text-xs font-medium text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 已通过</span>;
      case 'rejected':
        return <span className="text-xs font-medium text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3" /> 已拒绝</span>;
      default:
        return <span className="text-xs font-medium text-blue-500 flex items-center gap-1"><Clock className="w-3 h-3" /> 待处理</span>;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8f7f6] dark:bg-[#221a10] min-h-screen text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-10 bg-[#f8f7f6]/90 dark:bg-[#221a10]/90 backdrop-blur-md px-4 pt-12 pb-4 flex items-center border-b border-slate-200 dark:border-slate-800">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold ml-2">申请记录</h1>
      </header>

      <main className="p-4 space-y-4 pb-24">
        {loading || authLoading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-[#ee9d2b]" /></div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">暂无收到的领养申请</div>
        ) : (
          applications.map(app => (
            <div key={app.id} className={`bg-white dark:bg-[#2d261e] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 ${app.status === 'rejected' ? 'opacity-70' : ''}`}>
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-sm font-bold flex items-center gap-2">
                  <FileText className={`w-4 h-4 ${app.status === 'rejected' ? 'text-slate-400' : 'text-[#ee9d2b]'}`} />
                  领养申请：{app.pets?.name || '未知宠物'}
                </span>
                {getStatusDisplay(app.status)}
              </div>

              <div className="flex items-center gap-3 mb-3">
                <img src={app.applicant?.avatar_url || 'https://api.dicebear.com/7.x/notionists/svg?seed=user'} alt="Applicant" className="w-10 h-10 rounded-full" />
                <div>
                  <p className="text-sm font-bold">{app.applicant?.name || '未知申请人'}</p>
                  <p className="text-xs text-slate-500">{new Date(app.created_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2 mb-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                <p><span className="text-slate-400">联系电话：</span>{app.contact_info || app.applicant?.phone || '未填写'}</p>
                <div className="flex gap-4">
                  <p><span className="text-slate-400">养宠经验：</span>{app.has_experience ? '有' : '无'}</p>
                  <p><span className="text-slate-400">已封窗：</span>{app.has_closed_balcony ? '是' : '否'}</p>
                </div>
                {app.message && <p><span className="text-slate-400">留言：</span>{app.message}</p>}
              </div>

              {app.status === 'pending' && (
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                  <button onClick={() => updateStatus(app.id, 'rejected')} className="text-sm px-4 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    拒绝
                  </button>
                  <button onClick={() => updateStatus(app.id, 'approved')} className="text-sm px-4 py-1.5 rounded-full bg-[#ee9d2b] text-white hover:bg-amber-600 transition-colors">
                    批准领养
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
}
