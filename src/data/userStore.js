import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

const useUserStore = create(
    persist(
        (set) => ({
            userData: null,
            setUserData: (data) => set({ userData: data }),
            fetchUserData: async () => {
                try {
                    const response = await api.get('/user');
                    set({ userData: response.data });
                } catch (error) {
                    console.error('Failed to fetch user data:', error);
                }
            },
            clearUserData: () => set({ userData: null }),
        }),
        { name: 'user-storage' }
    )
);

export default useUserStore;
