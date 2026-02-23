import { Search, Bell, MoreHorizontal, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAppContext } from '../context/AppContext';

export default function Messages() {
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }
      try {
        // Fetch all messages involving the user
        const { data: messages, error } = await supabase
          .from('messages')
          .select(`
                id, sender_id, receiver_id, content, created_at, is_read, type,
                sender:profiles!messages_sender_id_fkey(id, name, avatar_url),
                receiver:profiles!messages_receiver_id_fkey(id, name, avatar_url)
            `)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Group by contact (the "other" person)
        const chatMap = new Map<string, any>();

        (messages || []).forEach(msg => {
          const isMeSender = msg.sender_id === user.id;
          const contactId = isMeSender ? msg.receiver_id : msg.sender_id;
          const contactProfile = isMeSender ? msg.receiver : msg.sender;

          if (!chatMap.has(contactId)) {
            chatMap.set(contactId, {
              contactId,
              contactProfile,
              latestMessage: msg,
              unreadCount: (!isMeSender && !msg.is_read) ? 1 : 0
            });
          } else {
            if (!isMeSender && !msg.is_read) {
              chatMap.get(contactId).unreadCount += 1;
            }
          }
        });

        setConversations(Array.from(chatMap.values()));
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMessages();

    // Set up realtime listener to refresh
    if (user?.id) {
      const channel = supabase.channel('messages_refresh')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` }, fetchMessages)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'messages', filter: `sender_id=eq.${user.id}` }, fetchMessages)
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      }
    }
  }, [user?.id]);

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
        {isLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#ee9d2b]" /></div>
        ) : conversations.length === 0 ? (
          <div className="text-center py-20 opacity-60">
            <p className="text-gray-500 font-medium pb-2">暂无聊天记录</p>
            <div className="text-xs text-gray-400">去主页找到心仪的毛孩子，与主理人私信吧</div>
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((chat) => (
              <Link to={`/chat/${chat.contactId}`} key={chat.contactId} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-white dark:hover:bg-[#2d261e] transition-colors cursor-pointer active:scale-[0.98] block">
                <div className="relative shrink-0">
                  <img src={chat.contactProfile?.avatar_url || 'https://picsum.photos/100'} alt={chat.contactProfile?.name} className="w-12 h-12 rounded-full object-cover bg-slate-200" />
                  {chat.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[20px] h-5 rounded-full flex items-center justify-center border-2 border-[#fcfaf8] dark:border-[#1f1a14] px-1">
                      {chat.unreadCount > 99 ? '99+' : chat.unreadCount}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-base truncate pr-2">{chat.contactProfile?.name || '未知用户'}</h3>
                    <span className="text-xs text-gray-400 shrink-0">
                      {new Date(chat.latestMessage.created_at).toLocaleDateString() === new Date().toLocaleDateString()
                        ? new Date(chat.latestMessage.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        : new Date(chat.latestMessage.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-[#9a794c] dark:text-[#bca380] truncate">
                    {chat.latestMessage.type === 'image' ? '[图片]' : chat.latestMessage.type === 'audio' ? '[语音消息]' : chat.latestMessage.content}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
