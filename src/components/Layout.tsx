import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto relative shadow-2xl overflow-hidden bg-white dark:bg-[#1f1a14]">
      <Outlet />
      <BottomNav />
    </div>
  );
}

export function NoNavLayout() {
  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto relative shadow-2xl overflow-hidden bg-white dark:bg-[#1f1a14]">
      <Outlet />
    </div>
  );
}
