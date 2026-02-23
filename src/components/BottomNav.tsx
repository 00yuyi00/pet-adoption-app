import { Home, Compass, Plus, MessageSquare, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';

export function BottomNav() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1f1a14] border-t border-gray-100 dark:border-gray-800 px-6 py-2 flex justify-between items-end z-30 max-w-md mx-auto">
      <Link to="/" className={cn("flex flex-col items-center gap-1 w-12 transition-colors", path === '/' ? "text-[#ee9d2b]" : "text-[#9a794c] dark:text-[#bca380] hover:text-[#ee9d2b]")}>
        <Home className="w-6 h-6" />
        <span className="text-[10px] font-medium">首页</span>
      </Link>
      <Link to="/discovery" className={cn("flex flex-col items-center gap-1 w-12 transition-colors", path === '/discovery' ? "text-[#ee9d2b]" : "text-[#9a794c] dark:text-[#bca380] hover:text-[#ee9d2b]")}>
        <Compass className="w-6 h-6" />
        <span className="text-[10px] font-medium">发现</span>
      </Link>
      <div className="relative -top-5">
        <Link to="/publish" className="flex items-center justify-center w-14 h-14 bg-[#ee9d2b] rounded-full shadow-lg shadow-[#ee9d2b]/40 hover:scale-105 transition-transform">
          <Plus className="w-8 h-8 text-white" />
        </Link>
      </div>
      <Link to="/messages" className={cn("flex flex-col items-center gap-1 w-12 transition-colors", path === '/messages' ? "text-[#ee9d2b]" : "text-[#9a794c] dark:text-[#bca380] hover:text-[#ee9d2b]")}>
        <MessageSquare className="w-6 h-6" />
        <span className="text-[10px] font-medium">消息</span>
      </Link>
      <Link to="/profile" className={cn("flex flex-col items-center gap-1 w-12 transition-colors", path === '/profile' ? "text-[#ee9d2b]" : "text-[#9a794c] dark:text-[#bca380] hover:text-[#ee9d2b]")}>
        <User className="w-6 h-6" />
        <span className="text-[10px] font-medium">我的</span>
      </Link>
    </nav>
  );
}
