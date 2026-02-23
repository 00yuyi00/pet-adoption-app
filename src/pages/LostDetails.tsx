import { ArrowLeft, Share2, MapPin, Calendar, PawPrint, Info, MessageSquare, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LostDetails() {
  const navigate = useNavigate();

  return (
    <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col bg-[#f8f7f6] dark:bg-[#221a10] shadow-2xl overflow-hidden text-[#1b160d] dark:text-white">
      <header className="sticky top-0 z-50 flex items-center justify-between bg-[#f8f7f6]/80 dark:bg-[#221a10]/80 px-4 py-3 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="flex h-10 w-10 items-center justify-center rounded-full text-[#1b160d] dark:text-white hover:bg-black/5 active:scale-95 transition-all">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold">丢失详情</h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full text-[#1b160d] dark:text-white hover:bg-black/5 active:scale-95 transition-all">
          <Share2 className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto pb-24 no-scrollbar">
        <div className="relative w-full aspect-[4/3] bg-gray-200">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAb22S7KVzh9opSQ6qNUgS0-he2xVPoUtNA-nMMI-v7e9Owxltlo1HZFOGDY9vZeBtGCPtaDbTezkM-DPzCOhVf9CR91YPYPwcZdoUONJuoQI2s46Zb9KeaSpp6xFr8qZ1KACMqo3keqUjgpuHiqh_ULaZnxsec5cLKmJ2tP6BtlFxgetQZkt1I8itxrcppldlz8j1F08LLfrbhO-P1buUW_V_BTAH5zjY3ovA5WGKQCFrIrN1fwQsz7L1H0rqEzNusgjnsqVK3MDv"
            alt="Golden retriever"
            className="h-full w-full object-cover"
          />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 dark:bg-[#2d2418]/90 px-3 py-1.5 shadow-lg backdrop-blur-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ee9d2b] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ee9d2b]"></span>
            </span>
            <span className="text-xs font-bold text-[#ee9d2b]">寻找中 (Searching)</span>
          </div>
        </div>

        <div className="px-5 pt-6 pb-2">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">毛球 (Maoqiu)</h2>
              <p className="mt-1 text-base text-[#9a794c] dark:text-gray-400 font-medium">金毛寻回犬 • 2岁 • 公</p>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-xs text-gray-400 mb-1">悬赏金额</span>
              <span className="text-xl font-bold text-[#ee9d2b]">¥ 2,000</span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <span className="inline-flex items-center rounded-lg bg-orange-50 dark:bg-orange-900/20 px-2.5 py-1 text-xs font-medium text-orange-700 dark:text-orange-400 ring-1 ring-inset ring-orange-600/10">
              红色项圈
            </span>
            <span className="inline-flex items-center rounded-lg bg-stone-100 dark:bg-stone-800 px-2.5 py-1 text-xs font-medium text-stone-600 dark:text-stone-400 ring-1 ring-inset ring-stone-500/10">
              已绝育
            </span>
            <span className="inline-flex items-center rounded-lg bg-stone-100 dark:bg-stone-800 px-2.5 py-1 text-xs font-medium text-stone-600 dark:text-stone-400 ring-1 ring-inset ring-stone-500/10">
              性格温顺
            </span>
          </div>
        </div>

        <div className="mt-6 px-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#ee9d2b]" />
              最后出现地点
            </h3>
            <button className="text-xs font-medium text-[#ee9d2b] hover:text-orange-600">查看路线</button>
          </div>
          <div className="relative h-48 w-full overflow-hidden rounded-xl shadow-sm border border-black/5 dark:border-white/5 bg-gray-100">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAACS7sU3LsJBq57N859ToaJji4OquqtSKjHfgSzwkMzEHQmYEX7cyLEpxvmGTYUxvOmi5-Wjinj9M6OmNTU4sJn4Oe85AkodXfC9GwmsXGcxVa-0v2WPuM81Xn8B5K9ZoY5Qqr1a0SUA2abaER4T-vSUoOLcWK7iqaCT_2I5JtKGy1K5deHhPCoXDCRDEKCgpQlY4oFLwh1AUyM5cHVHC3QpA9ffmv3rJVRay9oVmg6G6J9eh1WXO6U7AnWpjKpEFhBrmDLLxbp98R"
              alt="Map"
              className="h-full w-full object-cover opacity-90"
            />
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full transform flex flex-col items-center">
              <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#ee9d2b] shadow-lg ring-4 ring-white dark:ring-[#2d2418]">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB44mTxahWB5RcKMm8HW5ipbuud3RMxMRoYZM1eZ6udBZDSnQCbbQwv_r4mXptl3oi1-ClltKflGCRxpVGpBqjl9xYN8FCvHvtxo8IVRaMvoaE4la0sLs97GQ3Lxs7RfWtPYkSPpIS3-oNxIt-LMLLyJYqFVH_0MnibwQAAbqkUJTwgxdrT1vFO1tbLFI3ToCaSWy6jLCZnUpCJe0OyBENuD8GOeaQgO9XH61gVjaeOFj2KCx8M2SrH1vL5zWzU39hROk5YJtA3nSM3"
                  alt="Avatar"
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="h-3 w-0.5 bg-[#ee9d2b]"></div>
              <div className="h-1.5 w-4 rounded-[100%] bg-black/20 blur-[1px]"></div>
            </div>
            <div className="absolute bottom-3 left-3 right-3 rounded-lg bg-white/95 dark:bg-[#2d2418]/95 p-3 shadow-sm backdrop-blur">
              <p className="text-sm font-semibold">朝阳公园南门附近</p>
              <p className="text-xs text-[#9a794c] dark:text-gray-400">北京市朝阳区朝阳公园南路1号</p>
            </div>
          </div>
        </div>

        <div className="mt-8 px-5">
          <h3 className="text-lg font-bold mb-4">详细信息</h3>
          <div className="space-y-4 rounded-xl bg-white dark:bg-[#2d2418] p-4 shadow-sm border border-black/5 dark:border-white/5">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-900/20 text-[#ee9d2b]">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm font-medium text-[#9a794c] dark:text-gray-400">丢失时间</p>
                <p className="text-base font-semibold">2023年10月24日 下午 4:30</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-orange-50 dark:bg-orange-900/20 text-[#ee9d2b]">
                <PawPrint className="w-5 h-5" />
              </div>
              <div className="flex-1 pt-1">
                <p className="text-sm font-medium text-[#9a794c] dark:text-gray-400">特征描述</p>
                <p className="mt-1 text-sm leading-relaxed">
                  毛球性格非常温顺，当时脖子上戴着一个红色的皮质项圈。它很怕鞭炮声，可能会躲在车底或角落里。如果看到请不要追赶，可以尝试用食物引诱。
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 px-5 mb-8">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/10 p-4 border border-blue-100 dark:border-blue-900/20">
            <div className="flex gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
              <p className="text-xs leading-5 text-blue-800 dark:text-blue-200">
                如果您有任何线索，请立即联系主人。您的帮助对这只宠物来说至关重要。
              </p>
            </div>
          </div>
        </div>
      </main>

      <div className="absolute bottom-0 left-0 right-0 border-t border-black/5 dark:border-white/5 bg-white dark:bg-[#2d2418] p-4 pb-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3">
          <button className="flex aspect-square h-12 w-12 items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent text-[#1b160d] dark:text-white active:bg-gray-50 dark:active:bg-gray-800">
            <MessageSquare className="w-6 h-6" />
          </button>
          <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-[#ee9d2b] text-base font-bold text-white shadow-md shadow-orange-200 dark:shadow-none hover:bg-orange-500 active:scale-[0.98] transition-all">
            <Phone className="w-5 h-5" />
            联系主人
          </button>
        </div>
      </div>
    </div>
  );
}
