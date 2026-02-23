import React, { useState } from 'react';
import { EyeOff, PawPrint, Mail, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setIsLoading(true);

    try {
      if (isLogin) {
        // Login logic via Supabase
        if (!identifier || !password) {
          setMessage({ type: 'error', text: '请输入邮箱和密码' });
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signInWithPassword({
          email: identifier,
          password: password,
        });

        if (error) throw error;

        if (data.user) {
          localStorage.setItem('isLoggedIn', 'true');
          navigate('/');
        }
      } else {
        // Register logic via Supabase
        if (!identifier || !password || !confirmPassword) {
          setMessage({ type: 'error', text: '请填写完整注册信息' });
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setMessage({ type: 'error', text: '两次输入的密码不一致' });
          setIsLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.signUp({
          email: identifier,
          password: password,
        });

        if (error) throw error;

        setMessage({ type: 'success', text: '注册成功！请登录验证您的邮箱。' });

        // Clear form and switch to login
        setTimeout(() => {
          setIsLogin(true);
          setPassword('');
          setConfirmPassword('');
          setCode('');
          setMessage({ type: '', text: '' });
        }, 2000);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setMessage({ type: 'error', text: err.message || '操作失败，请重试' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col w-full max-w-md mx-auto h-screen overflow-hidden bg-white dark:bg-[#221a10] shadow-2xl text-[#1b160d] dark:text-gray-100">
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none bg-[#fdf5ea] dark:bg-[#221a10]" style={{
        maskImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M20 10c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-6 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm12 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-8.5 4.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm5 0c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z\' fill=\'%23ee9d2b\' fill-opacity=\'0.1\'/%3E%3C/svg%3E")'
      }}></div>

      <div className="relative z-10 flex justify-center pt-16 pb-4">
        <div className="w-20 h-20 bg-[#fdf5ea] dark:bg-[#352b1f] rounded-full flex items-center justify-center shadow-[0_4px_20px_-2px_rgba(238,157,43,0.1)]">
          <PawPrint className="w-10 h-10 text-[#ee9d2b]" />
        </div>
      </div>

      <div className="relative z-20 flex-1 flex flex-col justify-center px-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-[#1b160d] dark:text-white mb-2">
            {isLogin ? '欢迎回来' : '加入宠遇'}
          </h1>
          <p className="text-sm font-medium text-[#9a794c]">
            {isLogin ? '快速开启您的宠物之旅' : '注册账号，发现更多可爱毛孩'}
          </p>
        </header>

        {message.text && (
          <div className={`mb-4 p-3 rounded-xl text-sm font-bold text-center ${message.type === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'}`}>
            {message.text}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-8 mb-2">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setMessage({ type: '', text: '' }); }}
              className={`text-lg font-bold pb-1 px-1 transition-colors ${isLogin ? 'text-[#ee9d2b] border-b-[3px] border-[#ee9d2b]' : 'text-[#9a794c]/50 hover:text-[#ee9d2b]'}`}
            >
              登录
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setMessage({ type: '', text: '' }); }}
              className={`text-lg font-bold pb-1 px-1 transition-colors ${!isLogin ? 'text-[#ee9d2b] border-b-[3px] border-[#ee9d2b]' : 'text-[#9a794c]/50 hover:text-[#ee9d2b]'}`}
            >
              注册
            </button>
          </div>

          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Mail className="w-5 h-5 text-[#9a794c]/50" />
              </div>
              <input
                type="email"
                placeholder="邮箱地址"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full h-14 pl-12 pr-4 bg-[#f8f7f6] dark:bg-[#352b1f] border-none focus:ring-2 focus:ring-[#ee9d2b]/40 rounded-2xl text-[#1b160d] dark:text-gray-100 placeholder-[#9a794c]/40 text-base font-bold transition-all shadow-sm outline-none"
              />
            </div>

            {/* Removes manual verification code block as Supabase uses email verification links usually */}

            <div className="relative group">
              <input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 pl-6 pr-12 bg-[#f8f7f6] dark:bg-[#352b1f] border-none focus:ring-2 focus:ring-[#ee9d2b]/40 rounded-2xl text-[#1b160d] dark:text-gray-100 placeholder-[#9a794c]/40 text-base font-bold transition-all shadow-sm outline-none"
              />
              <button type="button" className="absolute right-5 top-1/2 -translate-y-1/2 text-[#9a794c]/40 hover:text-[#9a794c] transition-colors">
                <EyeOff className="w-5 h-5" />
              </button>
            </div>

            {!isLogin && (
              <div className="relative group">
                <input
                  type="password"
                  placeholder="确认密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-14 pl-6 pr-12 bg-[#f8f7f6] dark:bg-[#352b1f] border-none focus:ring-2 focus:ring-[#ee9d2b]/40 rounded-2xl text-[#1b160d] dark:text-gray-100 placeholder-[#9a794c]/40 text-base font-bold transition-all shadow-sm outline-none"
                />
                <button type="button" className="absolute right-5 top-1/2 -translate-y-1/2 text-[#9a794c]/40 hover:text-[#9a794c] transition-colors">
                  <EyeOff className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {isLogin && (
            <div className="flex justify-end pt-1">
              <a href="#" className="text-xs font-bold text-[#9a794c] hover:text-[#ee9d2b] transition-colors">忘记密码?</a>
            </div>
          )}

          <div className="pt-4">
            <button disabled={isLoading} type="submit" className="w-full h-14 bg-[#ee9d2b] hover:bg-[#d98a20] disabled:opacity-50 active:scale-[0.98] rounded-2xl shadow-xl shadow-[#ee9d2b]/25 flex items-center justify-center text-white text-lg font-extrabold tracking-wide transition-all">
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <span>{isLogin ? '立即登录' : '注册账号'}</span>}
            </button>
          </div>

          <div className="mt-4 flex justify-center gap-2 items-center">
            <input
              type="checkbox"
              id="terms"
              required
              className="w-4 h-4 text-[#ee9d2b] bg-[#f8f7f6] border-[#e7ddcf] rounded focus:ring-[#ee9d2b] focus:ring-offset-0 transition-colors cursor-pointer"
            />
            <label htmlFor="terms" className="text-xs font-medium text-[#9a794c]/60 leading-relaxed cursor-pointer select-none">
              同意 <a href="#" className="underline hover:text-[#ee9d2b]">用户协议</a> 与 <a href="#" className="underline hover:text-[#ee9d2b]">隐私政策</a>
            </label>
          </div>
        </form>
      </div>

      {isLogin && (
        <div className="relative z-20 mt-auto pb-8 flex flex-col items-center">
          <div className="flex items-center w-full px-16 mb-6">
            <div className="flex-1 h-[1px] bg-[#e7ddcf]/30"></div>
            <span className="px-4 text-[10px] uppercase tracking-widest text-[#9a794c]/40 font-extrabold">快速登录</span>
            <div className="flex-1 h-[1px] bg-[#e7ddcf]/30"></div>
          </div>
          <div className="flex gap-6">
            <button className="w-12 h-12 rounded-full border border-[#e7ddcf]/40 flex items-center justify-center hover:bg-[#f8f7f6] dark:hover:bg-[#352b1f] hover:border-[#e7ddcf] transition-all active:scale-95">
              <svg className="w-6 h-6 text-[#07C160]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.4 12.3c0-2.9-2.6-5.2-5.9-5.2-3.2 0-5.9 2.3-5.9 5.2 0 2.9 2.6 5.2 5.9 5.2.7 0 1.4-.1 2-.3l1.5.8-.4-1.4c1.8-1 2.8-2.6 2.8-4.3zM8.3 10.6c-.4 0-.7-.3-.7-.7s.3-.7.7-.7.7.3.7.7-.3.7-.7.7zm4.8 0c-.4 0-.7-.3-.7-.7s.3-.7.7-.7c.4 0 .7.3.7.7s-.4.7-.7.7zM7.5 7.9c0-2.3 2.1-4.2 4.7-4.2 2.6 0 4.7 1.9 4.7 4.2 0 2.3-2.1 4.2-4.7 4.2-.4 0-.8 0-1.2-.1l-2.2 1.2.6-1.9c-1.2-.9-1.9-2.1-1.9-3.4zM4.7 6.4c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5zm3.2 0c.3 0 .5.2.5.5s-.2.5-.5.5-.5-.2-.5-.5.2-.5.5-.5z"></path>
              </svg>
            </button>
            <button className="w-12 h-12 rounded-full border border-[#e7ddcf]/40 flex items-center justify-center hover:bg-[#f8f7f6] dark:hover:bg-[#352b1f] hover:border-[#e7ddcf] transition-all active:scale-95">
              <svg className="w-5 h-5 text-black dark:text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.05 13.778c.03 2.628 2.296 3.498 2.324 3.51-.013.06-.353 1.226-1.18 2.422-.716 1.04-1.465 2.074-2.627 2.095-1.147.02-1.527-.678-2.858-.678-1.322 0-1.748.658-2.86.698-1.14.04-2.022-1.137-2.756-2.193-1.512-2.176-2.653-6.142-1.096-8.868.784-1.353 2.176-2.222 3.692-2.247 1.157-.02 2.247.778 2.955.778.71 0 2.028-.962 3.41-.818.577.025 2.21.236 3.25 1.765-.084.05-1.936 1.134-1.96 3.535M14.996 4.9c.626-.76 1.046-1.812.93-2.863-.9.037-1.99.603-2.64 1.36-.582.666-1.09 1.73-0.954 2.766 1.004.078 2.036-.503 2.664-1.264"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
