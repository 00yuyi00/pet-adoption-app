import React, { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, Edit, CheckCircle, XCircle, Users, PawPrint, FileText, ArrowLeft, Loader2, Ban, Unlock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

export default function Admin() {
    const navigate = useNavigate();
    const { user, authLoading } = useAppContext();

    const [activeTab, setActiveTab] = useState<'users' | 'pets' | 'apps'>('users');
    const [isLoading, setIsLoading] = useState(true);

    // Data States
    const [usersList, setUsersList] = useState<any[]>([]);
    const [petsList, setPetsList] = useState<any[]>([]);
    const [appsList, setAppsList] = useState<any[]>([]);

    useEffect(() => {
        if (authLoading) return;
        if (!user.isAdmin) {
            alert('无管理员权限！');
            navigate('/');
            return;
        }
        fetchData();
    }, [activeTab, user, authLoading]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            if (activeTab === 'users') {
                const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
                setUsersList(data || []);
            } else if (activeTab === 'pets') {
                const { data } = await supabase.from('pets').select('*, profiles(name)').order('created_at', { ascending: false });
                setPetsList(data || []);
            } else if (activeTab === 'apps') {
                const { data } = await supabase.from('applications')
                    .select('*, pets(name, image_url), applicant:profiles!applications_applicant_id_fkey(name, phone)')
                    .order('created_at', { ascending: false });
                setAppsList(data || []);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    // User Actions
    const toggleUserBan = async (userId: string, currentStatus: string) => {
        const newStatus = currentStatus === 'banned' ? 'active' : 'banned';
        if (!window.confirm(`确定要${newStatus === 'banned' ? '封禁' : '解封'}该用户吗？`)) return;

        await supabase.from('profiles').update({ status: newStatus }).eq('id', userId);
        fetchData();
    };

    // Pet Actions
    const deletePet = async (petId: string) => {
        if (!window.confirm('确定强制删除这条发布吗？')) return;
        await supabase.from('pets').delete().eq('id', petId);
        fetchData();
    };

    // App Actions
    const updateAppStatus = async (appId: string, newStatus: 'approved' | 'rejected') => {
        if (!window.confirm(`确定要${newStatus === 'approved' ? '批准' : '拒绝'}这条申请吗？`)) return;
        await supabase.from('applications').update({ status: newStatus }).eq('id', appId);
        fetchData();
    };

    if (authLoading || (!user.isAdmin && !isLoading)) {
        return <div className="min-h-screen flex items-center justify-center bg-[#f8f7f6] dark:bg-[#221a10]"><Loader2 className="w-8 h-8 animate-spin text-[#ee9d2b]" /></div>;
    }

    return (
        <div className="flex flex-col min-h-screen bg-[#f8f7f6] dark:bg-[#221a10] text-slate-900 dark:text-slate-100">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-slate-900 text-white px-4 pt-12 pb-4 flex items-center gap-4 shadow-md">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-800 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex items-center gap-2">
                    <ShieldAlert className="w-6 h-6 text-[#ee9d2b]" />
                    <h1 className="text-xl font-bold tracking-tight">超级管理后台</h1>
                </div>
            </header>

            {/* Tabs */}
            <div className="flex px-4 py-4 gap-2 overflow-x-auto no-scrollbar border-b border-slate-200 dark:border-slate-800">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`shrink-0 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 transition-all ${activeTab === 'users' ? 'bg-[#ee9d2b] text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                    <Users className="w-4 h-4" /> 用户管理
                </button>
                <button
                    onClick={() => setActiveTab('pets')}
                    className={`shrink-0 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 transition-all ${activeTab === 'pets' ? 'bg-[#ee9d2b] text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                    <PawPrint className="w-4 h-4" /> 宠物审查
                </button>
                <button
                    onClick={() => setActiveTab('apps')}
                    className={`shrink-0 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 transition-all ${activeTab === 'apps' ? 'bg-[#ee9d2b] text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                    <FileText className="w-4 h-4" /> 领养审批
                </button>
            </div>

            <div className="flex-1 p-4 pb-24 overflow-y-auto">
                {isLoading ? (
                    <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-[#ee9d2b]" /></div>
                ) : (
                    <div className="space-y-4">

                        {/* USERS TAB */}
                        {activeTab === 'users' && usersList.map((u) => (
                            <div key={u.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border-l-4 border-[#ee9d2b]">
                                <div className="flex items-center gap-3">
                                    <img src={u.avatar_url} alt="avatar" className="w-12 h-12 rounded-full object-cover bg-slate-100" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm truncate">{u.name} {u.is_admin && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded ml-1">Admin</span>}</p>
                                        <p className="text-xs text-slate-500 truncate">ID: {u.id.split('-')[0]}...</p>
                                        <p className="text-xs font-medium mt-0.5">状态: <span className={u.status === 'banned' ? 'text-red-500' : 'text-green-500'}>{u.status === 'banned' ? '已封禁' : '正常'}</span></p>
                                    </div>
                                    {!u.is_admin && (
                                        <button
                                            onClick={() => toggleUserBan(u.id, u.status)}
                                            className={`p-2 rounded-xl text-sm font-bold flex flex-col items-center gap-1 ${u.status === 'banned' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}
                                        >
                                            {u.status === 'banned' ? <Unlock className="w-5 h-5" /> : <Ban className="w-5 h-5" />}
                                            <span className="text-[10px]">{u.status === 'banned' ? '解封' : '封禁'}</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* PETS TAB */}
                        {activeTab === 'pets' && petsList.map((p) => (
                            <div key={p.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm flex gap-3">
                                <img src={p.image_url} alt="pet" className="w-20 h-20 rounded-xl object-cover bg-slate-100 shrink-0" />
                                <div className="flex-1 min-w-0 flex flex-col justify-between">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-bold text-sm truncate">{p.name || '未命名'}</h3>
                                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">{p.post_type}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-slate-400">发布人: {p.profiles?.name || '未知'}</span>
                                        <div className="flex gap-2">
                                            <button className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200">
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => deletePet(p.id)} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* APPS TAB */}
                        {activeTab === 'apps' && appsList.map((a) => (
                            <div key={a.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm space-y-3">
                                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                                    <span className="text-xs font-bold text-slate-500">申请单号: {a.id.split('-')[0]}</span>
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${a.status === 'approved' ? 'bg-green-100 text-green-600' : a.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                                        {a.status === 'approved' ? '已批准' : a.status === 'rejected' ? '已驳回' : '待审核'}
                                    </span>
                                </div>

                                <div className="flex gap-3 items-center">
                                    <img src={a.pets?.image_url} className="w-12 h-12 rounded-lg object-cover" alt="pet" />
                                    <div className="flex-1">
                                        <p className="text-sm font-bold">申请领养: {a.pets?.name}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">申请人: {a.applicant?.name} (联系: {a.contact_info})</p>
                                    </div>
                                </div>

                                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl">
                                    <p className="text-xs italic text-slate-600 dark:text-slate-400">"{a.message || '该用户未填写留言'}"</p>
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {a.has_experience && <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded">有经验</span>}
                                        {a.has_closed_balcony && <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded">已封窗</span>}
                                        {a.accept_visit && <span className="text-[10px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded">接受回访</span>}
                                    </div>
                                </div>

                                {a.status === 'pending' && (
                                    <div className="flex gap-2 pt-2">
                                        <button onClick={() => updateAppStatus(a.id, 'rejected')} className="flex-1 flex justify-center items-center gap-1 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 text-sm font-bold rounded-xl hover:bg-red-100">
                                            <XCircle className="w-4 h-4" /> 拒绝
                                        </button>
                                        <button onClick={() => updateAppStatus(a.id, 'approved')} className="flex-1 flex justify-center items-center gap-1 py-2 bg-green-50 dark:bg-green-900/20 text-green-600 text-sm font-bold rounded-xl hover:bg-green-100">
                                            <CheckCircle className="w-4 h-4" /> 批准
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Empty States */}
                        {((activeTab === 'users' && usersList.length === 0) ||
                            (activeTab === 'pets' && petsList.length === 0) ||
                            (activeTab === 'apps' && appsList.length === 0)) && !isLoading && (
                                <div className="text-center py-12 text-slate-400 text-sm">暂无数据</div>
                            )}

                    </div>
                )}
            </div>
        </div>
    );
}
