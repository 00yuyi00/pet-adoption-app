import { Search, Bell, MoreHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Messages() {
  const messages = [
    {
      id: 1,
      name: '系统通知',
      avatar: 'https://ui-avatars.com/api/?name=Sys&background=ee9d2b&color=fff',
      lastMessage: '您的领养申请已通过审核！',
      time: '10:42',
      unread: 1,
      isSystem: true
    },
    {
      id: 2,
      name: '李阿姨 (送养人)',
      avatar: 'https://picsum.photos/seed/user1/100/100',
      lastMessage: '好的，那我们周末下午见。',
      time: '昨天',
      unread: 0,
      isSystem: false
    },
    {
      id: 3,
      name: '王先生',
      avatar: 'https://picsum.photos/seed/user2/100/100',
      lastMessage: '请问狗狗还在吗？',
      time: '星期二',
      unread: 2,
      isSystem: false
    },
    {
      id: 4,
      name: '宠物救助站',
      avatar: 'https://picsum.photos/seed/user3/100/100',
      lastMessage: '感谢您的关注，目前这只猫咪已经被预定了。',
      time: '10月24日',
      unread: 0,
      isSystem: false
    }
  ];

  return (
    <div className="flex-1 overflow-y-auto pb-24 no-scrollbar bg-[#fcfaf8] dark:bg-[#1f1a14] min-h-screen text-[#1b160d] dark:text-[#f3eee7]">
      <header className="sticky top-0 z-20 bg-[#fcfaf8]/95 dark:bg-[#1f1a14]/95 backdrop-blur-md px-4 pt-12 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">消息</h1>
          <div className="flex gap-3">
            <button className="text-[#1b160d] dark:text-[#f3eee7]">
              <Search className="w-6 h-6" />
            </button>
            <button className="text-[#1b160d] dark:text-[#f3eee7]">
              <MoreHorizontal className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 relative">
              <Bell className="w-6 h-6" />
              <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-[#fcfaf8] dark:border-[#1f1a14]"></div>
            </div>
            <span className="text-xs font-medium text-[#9a794c] dark:text-[#bca380]">互动消息</span>
          </div>
        </div>
      </header>

      <main className="px-4 py-2">
        <div className="space-y-1">
          {messages.map((msg) => (
            <Link to={`/chat/${msg.id}`} key={msg.id} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white dark:hover:bg-[#2d261e] transition-colors cursor-pointer active:scale-[0.98] block">
              <div className="relative shrink-0">
                <img src={msg.avatar} alt={msg.name} className="w-12 h-12 rounded-full object-cover" />
                {msg.unread > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#fcfaf8] dark:border-[#1f1a14]">
                    {msg.unread}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-base truncate pr-2">{msg.name}</h3>
                  <span className="text-xs text-gray-400 shrink-0">{msg.time}</span>
                </div>
                <p className="text-sm text-[#9a794c] dark:text-[#bca380] truncate">{msg.lastMessage}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
