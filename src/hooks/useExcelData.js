// hooks/useExcelData.js
import dummyApi from '../services/dummyApi';
import useDataStore from '../data/dataStore';

export const useExcelData = () => {
    const {
        mainData,
        isLoadingMain,
        mainError,
        mainActiveFile,
        setMainData,
        setLoadingMain,
        setMainError,

        qrisMerchantData,
        isLoadingQrisMerchant,
        qrisMerchantError,
        qrisMerchantActiveFile,
        setQrisMerchantData,
        setLoadingQrisMerchant,
        setQrisMerchantError,
    } = useDataStore();

    const fetchData = async (content) => {
        const setLoading = content === 'main' ? setLoadingMain : setLoadingQrisMerchant;
        const setError = content === 'main' ? setMainError : setQrisMerchantError;
        const setData = content === 'main' ? setMainData : setQrisMerchantData;

        setLoading(true);
        try {
            const response = await dummyApi.get(`/excel-data/${content}`);
            setData(response.data);
            setError(null);
        } catch (error) {
            console.error(`Error fetching ${content} data:`, error);
            setError(error.response?.data?.message || `Failed to fetch ${content} data`);
        } finally {
            setLoading(false);
        }
    };

    return {
        mainData,
        isLoadingMain,
        mainError,
        mainActiveFile,

        qrisMerchantData,
        isLoadingQrisMerchant,
        qrisMerchantError,
        qrisMerchantActiveFile,

        fetchData,
    };
};