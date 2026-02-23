import { ArrowLeft, MoreHorizontal, Image, Mic, Send, Camera } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Chat() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user } = useAppContext();

    const [inputText, setInputText] = useState('');

    // Example starting messages
    const [messages, setMessages] = useState([
        { id: 1, text: '你好，刚才看到你发布的领养信息。', sender: 'other', time: '10:40' },
        { id: 2, text: '请问狗狗还在吗？', sender: 'other', time: '10:41' },
        { id: 3, text: '还在的，你可以随时来看', sender: 'me', time: '10:42' }
    ]);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendText = () => {
        if (!inputText.trim()) return;
        const newMsg = {
            id: Date.now(),
            text: inputText.trim(),
            sender: 'me',
            time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMsg]);
        setInputText('');
    };

    const handleMockVoice = () => {
        const newMsg = {
            id: Date.now(),
            text: '🎵 [语音消息]',
            sender: 'me',
            time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMsg]);
    };

    const handleMockPicture = () => {
        const newMsg = {
            id: Date.now(),
            text: '🖼️ [图片]',
            sender: 'me',
            time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, newMsg]);
    };

    return (
        <div className="relative mx-auto flex h-full min-h-screen w-full max-w-md flex-col bg-[#fcfaf8] dark:bg-[#1f1a14] shadow-2xl overflow-hidden text-[#1b160d] dark:text-[#f3eee7]">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-white/95 dark:bg-[#2d261e]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 shadow-sm">
                <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-center">
                    <h1 className="text-base font-bold">李阿姨</h1>
                    <span className="text-[10px] text-green-500">在线</span>
                </div>
                <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <MoreHorizontal className="w-6 h-6" />
                </button>
            </header>

            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-24">
                {messages.map((msg) => {
                    const isMe = msg.sender === 'me';
                    return (
                        <div key={msg.id} className={`flex w-full mt-2 space-x-3 max-w-xs ${isMe ? 'ml-auto justify-end' : ''}`}>
                            {!isMe && (
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
                                    <img src="https://picsum.photos/seed/user1/100/100" alt="avatar" className="h-10 w-10 rounded-full object-cover" />
                                </div>
                            )}

                            <div className={`p-3 rounded-2xl ${isMe ? 'bg-[#ee9d2b] text-white rounded-tr-sm' : 'bg-white dark:bg-[#2d261e] border border-gray-100 dark:border-gray-800 rounded-tl-sm shadow-sm'}`}>
                                <p className="text-sm">{msg.text}</p>
                                <span className={`text-[10px] mt-1 block ${isMe ? 'text-white/70 text-right' : 'text-gray-400'}`}>{msg.time}</span>
                            </div>

                            {isMe && (
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-300">
                                    <img src={user.avatar} alt="my avatar" className="h-10 w-10 rounded-full object-cover" />
                                </div>
                            )}
                        </div>
                    );
                })}
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
