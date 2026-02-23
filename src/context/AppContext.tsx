import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface UserProfile {
    id?: string;
    name: string;
    avatar: string;
    isAdmin?: boolean;
}

interface AppContextType {
    user: UserProfile;
    updateUser: (profile: Partial<UserProfile>) => Promise<void>;
    favorites: string[];
    toggleFavorite: (petId: string) => Promise<void>;
    unreadCount: number;
    setUnreadCount: React.Dispatch<React.SetStateAction<number>>;
    authLoading: boolean;
}

const defaultUser: UserProfile = {
    name: '张伟',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDKGIRhh0isDoW3cwrkoKvdMkb7qZhtjePrIXg3U_lGG_XWaaJNGjZVLW-zZfUvpa_Tt6SE920N7uOsSs5cKX1716z1ufpkpSA-P6KuTrqSkBZFouzhTYD4eqM0PPGSgQAcMmQwK-RaKOt5GH4mhFyY7A5qiCuWozB7Gn6dfYP0t0catm15Zn0Ty3MheT-MLjw7Qu9kkwaS6VbRZqvkp-I1O2x-ora3RHzXrRnqm8UIx_21M5U3ul687vofGe9xVQbRDadp6qSA8Zy_'
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile>(defaultUser);
    const [favorites, setFavorites] = useState<string[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function getInitialSession() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user && mounted) {
                await fetchProfileAndFavorites(session.user.id);
            }
            if (mounted) setAuthLoading(false);
        }

        getInitialSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user && mounted) {
                await fetchProfileAndFavorites(session.user.id);
            } else if (mounted) {
                setUser(defaultUser);
                setFavorites([]);
                setUnreadCount(0);
            }
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    // Set up realtime listener for messages
    useEffect(() => {
        if (!user.id) return;

        const messageSubscription = supabase
            .channel('public:messages')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `receiver_id=eq.${user.id}` },
                (payload) => {
                    // Only increment if we are not currently reading this chat 
                    // (Actual robust implementation would check current path, for simplicity we increment unless marked read)
                    setUnreadCount(prev => prev + 1);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(messageSubscription);
        };
    }, [user.id]);

    const fetchProfileAndFavorites = async (userId: string) => {
        // Fetch Profile
        const { data: profileData } = await supabase
            .from('profiles')
            .select('name, avatar_url, is_admin')
            .eq('id', userId)
            .single();

        if (profileData) {
            setUser({
                id: userId,
                name: profileData.name || '微信用户',
                avatar: profileData.avatar_url || defaultUser.avatar,
                isAdmin: !!profileData.is_admin
            });
        }

        // Fetch Favorites
        const { data: favData } = await supabase
            .from('favorites')
            .select('pet_id')
            .eq('user_id', userId);

        if (favData) {
            setFavorites(favData.map((f: any) => f.pet_id));
        }

        // Fetch Unread Messages Count
        const { count } = await supabase
            .from('messages')
            .select('*', { count: 'exact', head: true })
            .eq('receiver_id', userId)
            .eq('is_read', false);

        setUnreadCount(count || 0);
    };

    const updateUser = async (profileUpdate: Partial<UserProfile>) => {
        // Optistic UI update
        setUser(prev => ({ ...prev, ...profileUpdate }));

        // Remote update
        if (user.id) {
            await supabase
                .from('profiles')
                .update({
                    name: profileUpdate.name !== undefined ? profileUpdate.name : user.name,
                    avatar_url: profileUpdate.avatar !== undefined ? profileUpdate.avatar : user.avatar
                })
                .eq('id', user.id);
        }
    };

    const toggleFavorite = async (petId: string) => {
        if (!user.id) return; // Prevent if not logged into supabase

        const isFav = favorites.includes(petId);

        // Optimistic UI update
        setFavorites(prev => isFav ? prev.filter(id => id !== petId) : [...prev, petId]);

        // Remote sync
        if (isFav) {
            await supabase.from('favorites').delete().match({ user_id: user.id, pet_id: petId });
        } else {
            await supabase.from('favorites').insert({ user_id: user.id, pet_id: petId });
        }
    };

    return (
        <AppContext.Provider value={{ user, updateUser, favorites, toggleFavorite, unreadCount, setUnreadCount, authLoading }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
