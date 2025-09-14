// data/dataStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import dummyApi from '../services/dummyApi';

const useDataStore = create(
    persist(
        (set) => ({
            mainData: null,
            isLoadingMain: false,
            mainError: null,
            mainActiveFile: null,

            qrisMerchantData: null,
            isLoadingQrisMerchant: false,
            qrisMerchantError: null,
            qrisMerchantActiveFile: null,

            setMainData: (data) => set({ mainData: data }),
            setLoadingMain: (loading) => set({ isLoadingMain: loading }),
            setMainError: (error) => set({ mainError: error }),
            setMainActiveFile: (file) => set({ mainActiveFile: file }),

            setQrisMerchantData: (data) => set({ qrisMerchantData: data }),
            setLoadingQrisMerchant: (loading) => set({ isLoadingQrisMerchant: loading }),
            setQrisMerchantError: (error) => set({ qrisMerchantError: error }),
            setQrisMerchantActiveFile: (file) => set({ qrisMerchantActiveFile: file }),

            clearMainData: () => set({ mainData: null, mainError: null }),
            clearQrisMerchantData: () => set({ qrisMerchantData: null, qrisMerchantError: null }),

            fetchExcelData: async (content) => {
                if (content === 'main') {
                    set({ isLoadingMain: true });
                } else {
                    set({ isLoadingQrisMerchant: true });
                }

                try {
                    const response = await dummyApi.get(`/excel-data/${content}`);
                    if (content === 'main') {
                        set({
                            mainData: response.data,
                            mainError: null
                        });
                    } else {
                        set({
                            qrisMerchantData: response.data,
                            qrisMerchantError: null
                        });
                    }
                } catch (error) {
                    console.error(`Error fetching ${content} data:`, error);
                    if (content === 'main') {
                        set({
                            mainError: error.response?.data?.message || `Failed to fetch ${content} data`
                        });
                    } else {
                        set({
                            qrisMerchantError: error.response?.data?.message || `Failed to fetch ${content} data`
                        });
                    }
                } finally {
                    if (content === 'main') {
                        set({ isLoadingMain: false });
                    } else {
                        set({ isLoadingQrisMerchant: false });
                    }
                }
            }
        }),
        {
            name: 'excel-data-storage',
        }
    )
);

export default useDataStore;