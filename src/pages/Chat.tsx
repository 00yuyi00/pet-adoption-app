import { ArrowLeft, MoreHorizontal, Image, Mic, Send, Camera, Loader2, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { supabase } from '../lib/supabase';

export default function Chat() {
    const navigate = useNavigate();
    const { id } = useParams(); // Contact's user ID
    const { user } = useAppContext();

    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<any[]>([]);
    const [contactProfile, setContactProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!user?.id || !id) return;

        let mounted = true;

        async function fetchChatData() {
            try {
                // 1. Fetch Contact Info
                const { data: profile } = await supabase.from('profiles').select('name, avatar_url').eq('id', id).single();
                if (mounted && profile) setContactProfile(profile);

                // 2. Fetch Messages between me and contact
                const { data: msgData, error } = await supabase
                    .from('messages')
                    .select('*')
                    .or(`and(sender_id.eq.${user.id},receiver_id.eq.${id}),and(sender_id.eq.${id},receiver_id.eq.${user.id})`)
                    .order('created_at', { ascending: true });

                if (error) throw error;
                if (mounted) setMessages(msgData || []);

                // 3. Mark received messages as read
                const unreadIds = (msgData || []).filter(m => m.receiver_id === user.id && !m.is_read).map(m => m.id);
                if (unreadIds.length > 0) {
                    await supabase.from('messages').update({ is_read: true }).in('id', unreadIds);
                }

                setIsLoading(false);
                setTimeout(scrollToBottom, 100);
            } catch (err) {
                console.error("Chat loading error:", err);
                setIsLoading(false);
            }
        }

        fetchChatData();

        // 4. Realtime Subscription
        const channel = supabase.channel(`chat_${user.id}_${id}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` },
                async (payload) => {
                    const newMsg = payload.new as any;
                    if (newMsg.sender_id === id) {
                        setMessages(prev => [...prev, newMsg]);
                        // Auto-read
                        await supabase.from('messages').update({ is_read: true }).eq('id', newMsg.id);
                        setTimeout(scrollToBottom, 100);
                    }
                }
            )
            .subscribe();

        return () => {
            mounted = false;
            supabase.removeChannel(channel);
        };
    }, [user?.id, id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (content: string, type: 'text' | 'image' | 'audio' = 'text') => {
        if (!user?.id || !id) return;

        const newMsg = {
            sender_id: user.id,
            receiver_id: id,
            content,
            type,
            is_read: false
        };

        try {
            // Optimistic rendering
            const optimisticMsg = { ...newMsg, id: `temp-${Date.now()}`, created_at: new Date().toISOString() };
            setMessages(prev => [...prev, optimisticMsg]);
            setInputText('');
            setTimeout(scrollToBottom, 50);

            await supabase.from('messages').insert(newMsg);
        } catch (err) {
            console.error("Error sending message:", err);
            // Optionally remove optimistic message here if failed
        }
    };

    const handleSendText = () => {
        if (!inputText.trim()) return;
        sendMessage(inputText.trim(), 'text');
    };

    const handleMockVoice = () => {
        sendMessage('🎵 [模拟语音功能未接入实际录音API]', 'audio');
    };

    const handleMockPicture = () => {
        sendMessage('https://picsum.photos/400/300', 'image');
    };

    const deleteMessage = async (msgId: string) => {
        if (!window.confirm('确定要撤回/删除这条消息吗？')) return;
        try {
            await supabase.from('messages').delete().eq('id', msgId);
            setMessages(prev => prev.filter(m => m.id !== msgId));
        } catch (e) {
            console.error(e);
        }
    }

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#fcfaf8] dark:bg-[#1f1a14]"><Loader2 className="w-8 h-8 animate-spin text-[#ee9d2b]" /></div>;
    }

    return (
        <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col bg-[#fcfaf8] dark:bg-[#1f1a14] shadow-2xl overflow-hidden text-[#1b160d] dark:text-[#f3eee7]">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-white/95 dark:bg-[#2d261e]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 shadow-sm">
                <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="text-base font-bold">{contactProfile?.name || '聊天'}</h1>
                    <span className="text-[10px] text-green-500">在线</span>
                </div>
                <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <MoreHorizontal className="w-6 h-6" />
                </button>
            </header>

            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-24">
                {messages.length === 0 ? (
                    <div className="text-center py-10 opacity-50 text-sm">暂无聊天记录，发个打招呼吧！</div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === user.id;
                        const timeStr = new Date(msg.created_at).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

                        return (
                            <div key={msg.id} className="group relative flex flex-col w-full mt-2">
                                <div className={`flex w-full space-x-3 max-w-[85%] ${isMe ? 'ml-auto justify-end' : ''}`}>
                                    {!isMe && (
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-200">
                                            <img src={contactProfile?.avatar_url || "https://picsum.photos/100"} alt="avatar" className="h-10 w-10 rounded-full object-cover" />
                                        </div>
                                    )}

                                    <div className={`p-3 rounded-2xl ${isMe ? 'bg-[#ee9d2b] text-white rounded-tr-sm' : 'bg-white dark:bg-[#2d261e] border border-gray-100 dark:border-gray-800 rounded-tl-sm shadow-sm'}`}>
                                        {msg.type === 'image' ? (
                                            <img src={msg.content} className="max-w-[200px] rounded-lg" alt="chat" />
                                        ) : (
                                            <p className="text-sm whitespace-pre-wrap word-break-all">{msg.content}</p>
                                        )}
                                        <div className={`flex justify-end items-center gap-1 mt-1 font-mono text-[9px] ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                                            {timeStr}
                                            {isMe && <span className="ml-1">{msg.is_read ? '已读' : '未读'}</span>}
                                        </div>
                                    </div>

                                    {isMe && (
                                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-slate-200">
                                            <img src={user.avatar} alt="my avatar" className="h-10 w-10 rounded-full object-cover" />
                                        </div>
                                    )}
                                </div>
                                {isMe && (
                                    <button onClick={() => deleteMessage(msg.id)} className="absolute top-1/2 -translate-y-1/2 left-0 md:left-4 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-500 hover:bg-red-50 rounded-full">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </main>

            {/* Input Area */}
            <footer className="absolute bottom-0 w-full bg-white dark:bg-[#2d261e] border-t border-gray-100 dark:border-gray-800 p-3 pt-2">
                <div className="flex items-center gap-2 mb-2">
                    <button onClick={handleMockVoice} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex flex-col items-center">
                        <Mic className="w-5 h-5" />
                    </button>
                    <button onClick={handleMockPicture} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex flex-col items-center">
                        <Image className="w-5 h-5" />
                    </button>
                    <button onClick={handleMockPicture} className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors flex flex-col items-center">
                        <Camera className="w-5 h-5" />
                    </button>
                </div>
                <div className="flex items-end gap-2">
                    <textarea
                        className="flex-1 bg-gray-50 dark:bg-[#1f1a14] border-none rounded-2xl py-2 px-4 resize-none outline-none focus:ring-2 focus:ring-[#ee9d2b]/50 text-sm max-h-24"
                        rows={1}
                        placeholder="发消息..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendText();
                            }
                        }}
                    />
                    <button
                        onClick={handleSendText}
                        className={`p-3 rounded-full flex-shrink-0 transition-colors ${inputText.trim() ? 'bg-[#ee9d2b] text-white' : 'bg-gray-200 dark:bg-gray-800 text-gray-400'}`}
                    >
                        <Send className="w-5 h-5 ml-0.5" />
                    </button>
                </div>
            </footer>
        </div>
    );
}
