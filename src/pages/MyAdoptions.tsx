import { ArrowLeft, Clock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyAdoptions() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8f7f6] dark:bg-[#221a10] min-h-screen text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-10 bg-[#f8f7f6]/90 dark:bg-[#221a10]/90 backdrop-blur-md px-4 pt-12 pb-4 flex items-center border-b border-slate-200 dark:border-slate-800">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold ml-2">我的领养</h1>
      </header>

      <main className="p-4 space-y-4">
        <div className="bg-white dark:bg-[#2d261e] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold">领养申请：豆豆</span>
            <span className="text-xs font-medium text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" /> 审核中
            </span>
          </div>
          <div className="flex gap-4">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuASyRHkHadXPJRsuTnyBoWk1e9S7XnbaLtBx6KxEkVGs_8_Tl3ogrywsh0goVWDMf_24Q09h48rzMmoVVz1IBPf6PH7DGSuj-l8ktNA3GMG5pK6UopCmky6tCrc7A8a-7rTtXRILIWqZ6KALbA4Y3EOW9deDAEDbCOEdF0n-wVn9hkGPEE2XIK3Kn2QjxQHH6pmPRfBA7gakkPRXTwcNGLosL7Nz_cpSdQqjZa-MG1CMFPbzTPchooAC0pi27YAqE6mxJP0EuM4nqSS" alt="Pet" className="w-20 h-20 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">申请时间：2023-10-25</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">救助人：上海流浪动物救助站</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2d261e] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold">领养申请：橘子</span>
            <span className="text-xs font-medium text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 已通过
            </span>
          </div>
          <div className="flex gap-4">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQg4v9rCvFpceNI_n5LCeuR72wh78mPFf4t1ggkVXYrPOEHu5oOAH88wqMNaUXEc5YUOZncWc_Y6_J0dR-WadJsScHapNw5sy5EClsLtusWMZ4qU8P8TbWzZoOQDZu-kCiAYINmOd2tepUwuglPFg4ccw0AEGkQc3plAlSuB91XdA-aV-Yjx-Cb4e0N9qy2B5MF1x6KUhI3b9t37o-w2ggj5gytByJnpVdUdiJ9MEFvozvT4cnJUgZUyKrpAIJjVnsqGuLWe4qpf06" alt="Pet" className="w-20 h-20 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">申请时间：2023-09-12</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">救助人：个人救助者李女士</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
