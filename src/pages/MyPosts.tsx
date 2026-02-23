import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyPosts() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8f7f6] dark:bg-[#221a10] min-h-screen text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-10 bg-[#f8f7f6]/90 dark:bg-[#221a10]/90 backdrop-blur-md px-4 pt-12 pb-4 flex items-center border-b border-slate-200 dark:border-slate-800">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold ml-2">我的发布</h1>
      </header>

      <main className="p-4 space-y-4">
        <div className="bg-white dark:bg-[#2d261e] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-start mb-3">
            <div className="flex gap-3">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRC1MHKHdr87MQpqUf8K71xeGPoST1h8C7alM75XTdTEEwR0L9zXriQfGwtDhFxbXVzSokdFPo6ieTaEta5pmReARYz9y_HyYqM-07APb75nLxbShQo2d0SZ33vLy_YKg4qkB7AFGdHcQgm2u5OpM_g5EjCORZOw5s48kdAJPyaivReR2NWx4qGvMzHGa3LMA6UpgfVGxmEWd4qdvxd3BoknifgA0Lz91hPvNMOYfCZ_aWCrhl2WB-4iitvPo10GDa2Ox8ZeOAZcI3" alt="Lost pet" className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <h3 className="font-bold">寻找：小白</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">寻宠启事 • 2小时前发布</p>
                <span className="inline-block mt-1 text-[10px] bg-orange-100 dark:bg-orange-900/30 text-orange-600 px-2 py-0.5 rounded">寻找中</span>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700">
              <Edit className="w-4 h-4" /> 编辑
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-red-200 dark:border-red-900/30">
              <Trash2 className="w-4 h-4" /> 删除
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
