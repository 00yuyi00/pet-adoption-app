import React, { useState, useEffect } from 'react';
import { ShieldAlert, Trash2, Edit, CheckCircle, XCircle, Users, PawPrint, FileText, ArrowLeft, Loader2, Ban, Unlock, BookOpen, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

export default function Admin() {
    const navigate = useNavigate();
    const { user, authLoading } = useAppContext();

    const [activeTab, setActiveTab] = useState<'users' | 'pets' | 'apps' | 'guides'>('users');
    const [isLoading, setIsLoading] = useState(true);

    // Data States
    const [usersList, setUsersList] = useState<any[]>([]);
    const [petsList, setPetsList] = useState<any[]>([]);
    const [appsList, setAppsList] = useState<any[]>([]);
    const [guidesList, setGuidesList] = useState<any[]>([]);

    // Guide Modal State
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
    const [editingGuide, setEditingGuide] = useState<any>(null);
    const [guideForm, setGuideForm] = useState({ title: '', category: 'dog', content: '' });

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
                const { data, error } = await supabase.from('pets').select('*, profiles!pets_user_id_fkey(name)').order('created_at', { ascending: false });
                if (error) console.error("Pets Fetch Error:", error);
                setPetsList(data || []);
            } else if (activeTab === 'apps') {
                const { data } = await supabase.from('applications')
                    .select('*, pets(name, image_url), applicant:profiles!applications_applicant_id_fkey(name, phone)')
                    .order('created_at', { ascending: false });
                setAppsList(data || []);
            } else if (activeTab === 'guides') {
                const { data } = await supabase.from('guides').select('*').order('created_at', { ascending: false });
                setGuidesList(data || []);
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

    // Guide Actions
    const saveGuide = async () => {
        if (!guideForm.title || !guideForm.content) {
            alert('请填写标题和内容');
            return;
        }

        if (editingGuide) {
            await supabase.from('guides').update({
                title: guideForm.title,
                category: guideForm.category,
                content: guideForm.content
            }).eq('id', editingGuide.id);
        } else {
            await supabase.from('guides').insert({
                title: guideForm.title,
                category: guideForm.category,
                content: guideForm.content
            });
        }

        setIsGuideModalOpen(false);
        setEditingGuide(null);
        setGuideForm({ title: '', category: 'dog', content: '' });
        fetchData();
    };

    const deleteGuide = async (guideId: string) => {
        if (!window.confirm('确定要删除这篇指南吗？')) return;
        await supabase.from('guides').delete().eq('id', guideId);
        fetchData();
    };

    const openGuideModal = (guide?: any) => {
        if (guide) {
            setEditingGuide(guide);
            setGuideForm({ title: guide.title, category: guide.category, content: guide.content });
        } else {
            setEditingGuide(null);
            setGuideForm({ title: '', category: 'dog', content: '' });
        }
        setIsGuideModalOpen(true);
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
                <button
                    onClick={() => setActiveTab('guides')}
                    className={`shrink-0 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-1.5 transition-all ${activeTab === 'guides' ? 'bg-[#ee9d2b] text-white shadow-md' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                >
                    <BookOpen className="w-4 h-4" /> 养宠指南
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

                        {/* GUIDES TAB */}
                        {activeTab === 'guides' && (
                            <>
                                <button onClick={() => openGuideModal()} className="w-full py-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl flex items-center justify-center gap-2 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors mb-4">
                                    <Plus className="w-5 h-5" /> 新增指南
                                </button>
                                {guidesList.map((g) => (
                                    <div key={g.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex-1 mr-4">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">{g.category === 'dog' ? '狗狗' : g.category === 'cat' ? '猫咪' : '综合'}</span>
                                                    <h3 className="font-bold text-base line-clamp-1">{g.title}</h3>
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{g.content.replace(/[#*`_~]/g, '')}</p>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <button onClick={() => openGuideModal(g)} className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-200">
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => deleteGuide(g.id)} className="p-2 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-lg hover:bg-red-200">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* Empty States */}
                        {((activeTab === 'users' && usersList.length === 0) ||
                            (activeTab === 'pets' && petsList.length === 0) ||
                            (activeTab === 'apps' && appsList.length === 0) ||
                            (activeTab === 'guides' && guidesList.length === 0)) && !isLoading && (
                                <div className="text-center py-12 text-slate-400 text-sm">暂无数据</div>
                            )}

                    </div>
                )}
            </div>

            {/* Guide Edit Modal */}
            {isGuideModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                            <h3 className="font-bold text-lg">{editingGuide ? '编辑指南' : '新增指南'}</h3>
                            <button onClick={() => setIsGuideModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-600"><XCircle className="w-5 h-5" /></button>
                        </div>
                        <div className="p-4 overflow-y-auto flex-1 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1.5">标题</label>
                                <input
                                    type="text"
                                    placeholder="如：新手选狗指南"
                                    value={guideForm.title}
                                    onChange={e => setGuideForm({ ...guideForm, title: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-[#ee9d2b]/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5">分类</label>
                                <select
                                    value={guideForm.category}
                                    onChange={e => setGuideForm({ ...guideForm, category: e.target.value })}
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-[#ee9d2b]/50"
                                >
                                    <option value="dog">狗狗</option>
                                    <option value="cat">猫咪</option>
                                    <option value="general">综合/其他</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 flex justify-between">
                                    <span>内容 (Markdown格式)</span>
                                </label>
                                <textarea
                                    value={guideForm.content}
                                    onChange={e => setGuideForm({ ...guideForm, content: e.target.value })}
                                    rows={8}
                                    placeholder="# 大标题&#10;## 小标题&#10;正文内容..."
                                    className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-[#ee9d2b]/50 font-mono text-sm leading-relaxed"
                                />
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex gap-3">
                            <button onClick={() => setIsGuideModalOpen(false)} className="flex-1 py-2.5 rounded-xl font-bold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300">取消</button>
                            <button onClick={saveGuide} className="flex-1 py-2.5 rounded-xl font-bold bg-[#ee9d2b] text-white">保存并发布</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
