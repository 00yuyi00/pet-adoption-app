import { ArrowLeft, Info, User, Phone, MapPin, Building2, Home as HomeIcon, Send, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function AdoptionApply() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [housingType, setHousingType] = useState<'apartment' | 'house'>('apartment');
  const [experience, setExperience] = useState<'yes' | 'no'>('yes');

  const handleNext = () => setStep(s => Math.min(s + 1, 3));
  const handlePrev = () => setStep(s => Math.max(s - 1, 1));
  const handleSubmit = () => setIsSubmitted(true);

  if (isSubmitted) {
    return (
      <div className="flex-1 w-full max-w-md mx-auto flex flex-col items-center justify-center bg-[#f6f7f8] dark:bg-[#111921] min-h-screen text-slate-900 dark:text-slate-100 p-6">
        <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
        <h2 className="text-2xl font-bold mb-2">提交成功</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-center text-sm leading-relaxed">您的领养申请已成功提交，请等待审核。我们将会尽快与您取得联系。</p>
        <button onClick={() => navigate('/')} className="w-full bg-[#308ce8] text-white font-bold py-3.5 px-6 rounded-xl text-base shadow-md shadow-blue-500/20 hover:bg-blue-600 active:scale-[0.98] transition-all">
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-md mx-auto flex flex-col pb-24 bg-[#f6f7f8] dark:bg-[#111921] min-h-screen text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-50 bg-white dark:bg-[#1a2633] shadow-sm">
        <div className="flex items-center px-4 h-16 justify-between">
          <button onClick={step === 1 ? () => navigate(-1) : handlePrev} className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">领养申请 ({step}/3)</h1>
          <div className="size-10 shrink-0"></div>
        </div>
        <div className="w-full h-1 bg-slate-100 dark:bg-slate-800">
          <div className="h-full bg-[#308ce8] transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto flex flex-col pb-24">
        <div className="bg-white dark:bg-[#1a2633] p-4 mb-4 border-b border-[#d0dbe7] dark:border-slate-700">
          <div className="bg-blue-50 dark:bg-slate-800 rounded-xl p-4 flex items-center gap-4 border border-blue-100 dark:border-slate-700 shadow-sm">
            <div className="relative shrink-0">
              <div
                className="bg-center bg-no-repeat bg-cover rounded-xl size-16 shadow-inner"
                style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCnq8NVOHkGunCHEzWsq7UawNpxvTlITtU2OIglE3oe8pVAyT9kScEWnJDJ5yu9FBIv4T-9GBGyiEEDMTpPkrTkfWuwkqkM5spAon8ghWiPX9P_LGnlJfdoxSHehR0YHQ3vo1wGRk210oBBS5QaBkC8MkMzl_TTG08f-i5bFpduwh_6gVKi7XnUhU07YLNfYsXgcoi6veqoCafB6gnwVF3uVAU80SojeGjiZX9gC8XQohw5crFuvpbeYCVRX1iCoJcvx4SvEQ9fnrhZ")' }}
              ></div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full p-0.5">
                <span className="text-white text-[12px] font-bold block">✓</span>
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-slate-900 dark:text-slate-100 text-lg font-bold truncate">豆豆</h3>
                <span className="bg-blue-100 dark:bg-blue-900 text-[#308ce8] dark:text-blue-300 text-xs font-semibold px-2 py-0.5 rounded-full">待领养</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm truncate">金毛寻回犬 · 3个月 · 疫苗齐全</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 text-center flex items-center justify-center gap-1">
            <Info className="w-4 h-4" />
            请如实填写真实信息，这将有助于提高审核通过率
          </p>
        </div>

        <form className="flex flex-col gap-6 px-4" onSubmit={(e) => e.preventDefault()}>
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 bg-[#308ce8] rounded-full"></div>
                <h2 className="text-slate-900 dark:text-slate-100 text-base font-bold">步骤1：基本信息</h2>
              </div>
              <div className="grid gap-4">
                <label className="block group">
                  <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">申请人姓名</span>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none group-focus-within:text-[#308ce8] transition-colors" />
                    <input
                      type="text"
                      placeholder="请输入您的真实姓名"
                      className="block w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2633] pl-10 pr-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#308ce8] focus:ring-1 focus:ring-[#308ce8] outline-none sm:text-sm shadow-sm transition-all"
                    />
                  </div>
                </label>
                <label className="block group">
                  <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">联系电话</span>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none group-focus-within:text-[#308ce8] transition-colors" />
                    <input
                      type="tel"
                      placeholder="请输入11位手机号码"
                      className="block w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2633] pl-10 pr-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#308ce8] focus:ring-1 focus:ring-[#308ce8] outline-none sm:text-sm shadow-sm transition-all"
                    />
                  </div>
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 bg-[#308ce8] rounded-full"></div>
                <h2 className="text-slate-900 dark:text-slate-100 text-base font-bold">步骤2：居住环境</h2>
              </div>
              <div className="grid gap-4">
                <label className="block group">
                  <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">家庭住址</span>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none group-focus-within:text-[#308ce8] transition-colors" />
                    <input
                      type="text"
                      placeholder="请输入省市区及详细地址"
                      className="block w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2633] pl-10 pr-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#308ce8] focus:ring-1 focus:ring-[#308ce8] outline-none sm:text-sm shadow-sm transition-all"
                    />
                  </div>
                </label>
                <div>
                  <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 ml-1">住房类型</span>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer relative">
                      <input
                        type="radio"
                        name="housing_type"
                        value="apartment"
                        checked={housingType === 'apartment'}
                        onChange={() => setHousingType('apartment')}
                        className="peer sr-only"
                      />
                      <div className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2633] peer-checked:border-[#308ce8] peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 peer-checked:text-[#308ce8] transition-all flex flex-col items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <Building2 className="w-6 h-6" />
                        <span className="text-sm font-medium">公寓/单元楼</span>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 text-[#308ce8] transition-opacity">
                        <div className="w-4 h-4 rounded-full bg-[#308ce8] flex items-center justify-center text-white text-[10px]">✓</div>
                      </div>
                    </label>
                    <label className="cursor-pointer relative">
                      <input
                        type="radio"
                        name="housing_type"
                        value="house"
                        checked={housingType === 'house'}
                        onChange={() => setHousingType('house')}
                        className="peer sr-only"
                      />
                      <div className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2633] peer-checked:border-[#308ce8] peer-checked:bg-blue-50 dark:peer-checked:bg-blue-900/20 peer-checked:text-[#308ce8] transition-all flex flex-col items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800">
                        <HomeIcon className="w-6 h-6" />
                        <span className="text-sm font-medium">独栋/别墅</span>
                      </div>
                      <div className="absolute top-2 right-2 opacity-0 peer-checked:opacity-100 text-[#308ce8] transition-opacity">
                        <div className="w-4 h-4 rounded-full bg-[#308ce8] flex items-center justify-center text-white text-[10px]">✓</div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 pt-2 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 bg-[#308ce8] rounded-full"></div>
                <h2 className="text-slate-900 dark:text-slate-100 text-base font-bold">步骤3：养宠经验</h2>
              </div>
              <div className="bg-white dark:bg-[#1a2633] p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">您是否有过养宠经验？</span>
                <div className="flex gap-4">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="experience"
                      value="yes"
                      checked={experience === 'yes'}
                      onChange={() => setExperience('yes')}
                      className="w-5 h-5 text-[#308ce8] border-slate-300 focus:ring-[#308ce8] dark:border-slate-600 dark:bg-slate-800"
                    />
                    <span className="ml-2 text-slate-900 dark:text-slate-100 group-hover:text-[#308ce8] transition-colors">有经验</span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="experience"
                      value="no"
                      checked={experience === 'no'}
                      onChange={() => setExperience('no')}
                      className="w-5 h-5 text-[#308ce8] border-slate-300 focus:ring-[#308ce8] dark:border-slate-600 dark:bg-slate-800"
                    />
                    <span className="ml-2 text-slate-900 dark:text-slate-100 group-hover:text-[#308ce8] transition-colors">无经验</span>
                  </label>
                </div>
              </div>
              <label className="block group pt-2">
                <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 ml-1">领养理由</span>
                <textarea
                  placeholder="请简述您的家庭情况以及想要领养的原因..."
                  className="block w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a2633] p-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-[#308ce8] focus:ring-1 focus:ring-[#308ce8] outline-none sm:text-sm shadow-sm transition-all resize-none h-32"
                ></textarea>
                <p className="text-xs text-slate-400 mt-1.5 text-right px-1">0/200 字</p>
              </label>
            </div>
          )}
        </form>
      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#1a2633] border-t border-slate-100 dark:border-slate-800 z-40 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90">
        <div className="max-w-md mx-auto w-full flex gap-3">
          {step < 3 ? (
            <button onClick={handleNext} className="w-full bg-[#308ce8] text-white font-bold py-3.5 px-6 rounded-xl text-base shadow-md shadow-blue-500/20 hover:bg-blue-600 active:scale-[0.98] transition-all">
              下一步
            </button>
          ) : (
            <button onClick={handleSubmit} className="w-full bg-[#308ce8] text-white font-bold py-3.5 px-6 rounded-xl text-base shadow-md shadow-blue-500/20 hover:bg-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <span>提交申请</span>
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
        <div className="h-4 w-full"></div>
      </div>
    </div>
  );
}
