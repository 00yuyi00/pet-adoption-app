import { ArrowLeft, FileText, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Applications() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto bg-[#f8f7f6] dark:bg-[#221a10] min-h-screen text-slate-900 dark:text-slate-100">
      <header className="sticky top-0 z-10 bg-[#f8f7f6]/90 dark:bg-[#221a10]/90 backdrop-blur-md px-4 pt-12 pb-4 flex items-center border-b border-slate-200 dark:border-slate-800">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold ml-2">申请记录</h1>
      </header>

      <main className="p-4 space-y-4">
        <div className="bg-white dark:bg-[#2d261e] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold flex items-center gap-2"><FileText className="w-4 h-4 text-[#ee9d2b]" /> 领养申请：豆豆</span>
            <span className="text-xs font-medium text-blue-500 flex items-center gap-1">
              <Clock className="w-3 h-3" /> 审核中
            </span>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
            <p>申请时间：2023-10-25 14:30</p>
            <p>联系电话：138****8888</p>
            <p>养宠经验：有</p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-right">
            <button className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">撤销申请</button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2d261e] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold flex items-center gap-2"><FileText className="w-4 h-4 text-[#ee9d2b]" /> 领养申请：橘子</span>
            <span className="text-xs font-medium text-green-500 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> 已通过
            </span>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
            <p>申请时间：2023-09-12 09:15</p>
            <p>联系电话：138****8888</p>
            <p>养宠经验：无</p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-right">
            <button className="text-sm text-[#ee9d2b] font-medium">查看详情</button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#2d261e] rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 opacity-70">
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold flex items-center gap-2"><FileText className="w-4 h-4 text-slate-400" /> 领养申请：阿福</span>
            <span className="text-xs font-medium text-red-500 flex items-center gap-1">
              <XCircle className="w-3 h-3" /> 已拒绝
            </span>
          </div>
          <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2">
            <p>申请时间：2023-08-05 16:20</p>
            <p>拒绝原因：不符合同城领养要求</p>
          </div>
        </div>
      </main>
    </div>
  );
}
