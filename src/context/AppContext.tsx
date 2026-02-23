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
    name: '游客',
    avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=guest'
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
        try {
            // First, set the ID so the app knows we are authenticated
            setUser(prev => ({ ...prev, id: userId }));

            // Fetch Profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('name, avatar_url, is_admin')
                .eq('id', userId)
                .maybeSingle(); // maybeSingle doesn't throw 406 if missing

            if (profileData) {
                setUser({
                    id: userId,
                    name: profileData.name || '宠友',
                    avatar: profileData.avatar_url || defaultUser.avatar,
                    isAdmin: !!profileData.is_admin
                });
            } else {
                // Profile missing (likely table was recreated), auto-create it
                const newName = `新宠友_${userId.slice(0, 5)}`;
                const newAvatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${userId}`;

                await supabase.from('profiles').insert({
                    id: userId,
                    name: newName,
                    avatar_url: newAvatar
                });

                setUser({
                    id: userId,
                    name: newName,
                    avatar: newAvatar,
                    isAdmin: false
                });
            } if (profileError) {
                console.error('Error fetching profile:', profileError);
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
        } catch (err) {
            console.error('Data sync error:', err);
        }
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
