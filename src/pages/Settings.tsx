import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Shield, Mail, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

export default function Settings() {
    const navigate = useNavigate();
    const { user, updateUser } = useAppContext();

    const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile');
    const [currentUserEmail, setCurrentUserEmail] = useState<string>('');

    // Profile State
    const [name, setName] = useState(user.name);
    const [avatarPreview, setAvatarPreview] = useState(user.avatar);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isProfileSaving, setIsProfileSaving] = useState(false);

    // Password State
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordSaving, setIsPasswordSaving] = useState(false);

    useEffect(() => {
        // Fetch email on load
        const getUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user?.email) {
                setCurrentUserEmail(user.email);
            }
        };
        getUserData();
    }, []);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSaveProfile = async () => {
        setIsProfileSaving(true);
        try {
            let finalAvatarUrl = user.avatar;

            // Upload new avatar if selected
            if (avatarFile) {
                const fileExt = avatarFile.name.split('.').pop();
                const fileName = `${user.id}-${Math.random()}.${fileExt}`;
                const filePath = `public/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(filePath, avatarFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(filePath);

                finalAvatarUrl = publicUrl;
            }

            // Update Context & Supabase DB
            await updateUser({ name, avatar: finalAvatarUrl });
            alert('资料更新成功');
        } catch (err: any) {
            alert('更新失败: ' + err.message);
        } finally {
            setIsProfileSaving(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            alert('密码需至少 6 位');
            return;
        }

        setIsPasswordSaving(true);
        try {
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });
            if (error) throw error;

            alert('密码修改成功，下次请使用新密码登录');
            setNewPassword('');
        } catch (err: any) {
            alert('密码修改失败: ' + err.message);
        } finally {
            setIsPasswordSaving(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f8f7f6] dark:bg-[#221a10] text-slate-900 dark:text-slate-100">
            <header className="sticky top-0 z-10 bg-[#f8f7f6]/90 dark:bg-[#221a10]/90 backdrop-blur-md px-4 pt-12 pb-4 flex items-center gap-4 border-b border-slate-200 dark:border-slate-800">
                <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold tracking-tight">系统设置</h1>
            </header>

            <div className="flex-1 p-4 mb-8">
                {/* Tabs */}
                <div className="flex gap-2 p-1 bg-slate-200 dark:bg-slate-800/50 rounded-xl mb-6">
                    <button
                        onClick={() => setActiveTab('profile')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'profile' ? 'bg-white dark:bg-slate-700 text-[#ee9d2b] shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        资料修改
                    </button>
                    <button
                        onClick={() => setActiveTab('account')}
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${activeTab === 'account' ? 'bg-white dark:bg-slate-700 text-[#ee9d2b] shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        账号安全
                    </button>
                </div>

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-6">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col items-center">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full p-1 border-2 border-[#ee9d2b]/20">
                                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                                </div>
                                <label className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full border-2 border-white dark:border-slate-800 shadow-md hover:bg-slate-800 transition-colors cursor-pointer">
                                    <Camera className="w-4 h-4" />
                                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                                </label>
                            </div>
                            <p className="text-xs text-slate-400 mt-3 font-medium">点击相机图标更换头像</p>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                                    账号昵称
                                </label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[#ee9d2b]/50 outline-none transition-all"
                                    placeholder="请输入您的昵称"
                                />
                            </div>
                        </div>

                        <button
                            disabled={isProfileSaving || (name === user.name && !avatarFile)}
                            onClick={handleSaveProfile}
                            className="w-full py-4 rounded-xl bg-[#ee9d2b] text-white font-bold text-lg shadow-lg shadow-[#ee9d2b]/20 hover:bg-[#ee9d2b]/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                        >
                            {isProfileSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : '保存资料'}
                        </button>
                    </div>
                )}

                {/* Account Tab */}
                {activeTab === 'account' && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="p-4 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800">
                                <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-slate-500" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs text-slate-500 font-medium">绑定邮箱</p>
                                    <p className="text-sm font-bold mt-0.5">{currentUserEmail || '加载中...'}</p>
                                </div>
                                <span className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-md">已验证</span>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Shield className="w-5 h-5 text-[#ee9d2b]" />
                                <h3 className="font-bold">修改登录密码</h3>
                            </div>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="输入新密码 (最少6位)"
                                    className="w-full pl-11 pr-12 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#ee9d2b]/50 outline-none"
                                />
                                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                                >
                                    <span className="text-xs font-bold uppercase">{showPassword ? 'Hide' : 'Show'}</span>
                                </button>
                            </div>

                            <button
                                disabled={isPasswordSaving || !newPassword}
                                onClick={handleUpdatePassword}
                                className="w-full py-3.5 mt-2 rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-bold hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isPasswordSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : '确认更新密码'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
