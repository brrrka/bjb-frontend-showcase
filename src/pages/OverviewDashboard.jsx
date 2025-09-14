// src/pages/OverviewDashboard.jsx
import { useEffect, useState } from 'react';
import SidebarComponent from '../components/SidebarComponent';
import { HiTrendingUp, HiUsers, HiCreditCard, HiCash, HiClock } from 'react-icons/hi';
import dummyApi from '../services/dummyApi';
import { useExcelData } from '../hooks/useExcelData';
import { formattedDate } from '../services/formattedDate';


const OverviewDashboard = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [overviewStats, setOverviewStats] = useState([]);
    const [updateHistory, setUpdateHistory] = useState([]);
    const [regions, setRegions] = useState([]);
    const [fileInfo, setFileInfo] = useState(null);

    const {
        mainData,
        isLoadingMain,
        mainError,
        refetchMain,
    } = useExcelData();

    useEffect(() => {
        const fetchUpdateHistory = async () => {
            try {
                const response = await dummyApi.get('/files/recent');
                setUpdateHistory(response.data);
            } catch (error) {
                console.error('Failed to fetch update history:', error);
            }
        };

        fetchUpdateHistory();
    }, []);

    // Mengolah data dari qrisMerchantData
    useEffect(() => {
        if (mainData) {
            const { data, file_info } = mainData;
            const activeData = data.konsolidasi;

            setFileInfo(file_info);

            // Set statistik utama
            setOverviewStats([
                {
                    title: "Total Pengguna Digi Mobile",
                    value: activeData.summary?.user_digi_mobile.toLocaleString('id-ID') || 'N/A',
                    // change: "+12.5%",
                    icon: HiUsers,
                    color: "bg-blue-100 text-blue-600",
                },
                {
                    title: "Target Fee Based Income",
                    subtitle: "Dalam juta rupiah",
                    value: `Rp. ${Math.round(activeData.target?.fee_based_total).toLocaleString('id-ID')}`,
                    change: (() => {
                        const target = activeData.target?.fee_based_total || 0;
                        const realisasi = activeData.realisasi?.fee_based_total || 0;
                        const percentageShortfall = target > 0
                            ? ((realisasi - target) / target) * 100
                            : 0;

                        return `${percentageShortfall.toFixed(2)}%`;
                    })(),
                    changeColor: (() => {
                        const target = activeData.target?.fee_based_total || 0;
                        const realisasi = activeData.realisasi?.fee_based_total || 0;
                        const percentageShortfall = target > 0
                            ? ((realisasi - target) / target) * 100
                            : 0;

                        return percentageShortfall < 0 ? 'text-red-500' : 'text-green-500';
                    })(),
                    icon: HiTrendingUp,
                    color: "bg-green-100 text-green-600",
                },
                {
                    title: "Realisasi Fee Based Income",
                    subtitle: "Dalam Juta Rupiah",
                    value: `Rp. ${Math.round(activeData.realisasi?.fee_based_total).toLocaleString('id-ID')}`,
                    // change: "+15.3%",
                    icon: HiCash,
                    color: "bg-yellow-100 text-yellow-600",
                },
                {
                    title: "Total Transaksi Merchant Qris",
                    value: Math.round(activeData.summary?.utilisasi_merchant_qris).toLocaleString('id-ID') || 'N/A',
                    // change: "+20.1%",
                    icon: HiCreditCard,
                    color: "bg-purple-100 text-purple-600",
                },
            ]);

            // Set performa regional
            const kanwilData = Object.entries(data)
                .filter(([key]) => key.startsWith('kanwil'))
                .map(([key, value]) => {
                    const target = value.target?.fee_based_total || 1;  // default ke 1 jika null
                    const realisasi = value.realisasi?.fee_based_total || 0;
                    const performance = ((realisasi / target) * 100).toFixed(1);

                    return {
                        name: `Kanwil ${key.replace('kanwil', '')}`,
                        performance: performance
                    };
                });
            setRegions(kanwilData);
        }
    }, [mainData]);

    if (mainError) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center text-red-600">
                    <p>Error: {mainError}</p>
                    <button
                        onClick={refetchMain}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const StatsLoading = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="animate-pulse">
                        <div className="flex items-center justify-between mb-4">
                            <div className="bg-gray-200 rounded-full p-3 h-12 w-12"></div>
                            <div className="bg-gray-200 h-4 w-16 rounded"></div>
                        </div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-32"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <SidebarComponent
                onCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)}
                activeItem="Overview"
            />

            <main className={`flex-1 overflow-x-hidden will-change-transform transform-gpu transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
                <div className="px-4 md:px-6 py-6 w-full">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 md:mb-8 bg-white p-4 md:p-6 rounded-xl shadow-sm">
                        <div>
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Ringkasan</h1>
                            <p className="text-gray-500">
                                {`Data per ${formattedDate(fileInfo?.date)} (Diupload oleh ${fileInfo?.uploaded_by || '-'})`}
                            </p>
                        </div>
                        <img src="/images/Bank_BJB_logo.svg" alt="Bank BJB Logo" className="h-8 md:h-10" />
                    </div>

                    {/* Stats Grid */}
                    {isLoadingMain ? (
                        <StatsLoading />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                            {overviewStats.map((stat, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-4 md:p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-full ${stat.color}`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <span className={`text-sm font-medium ${stat.changeColor || 'text-green-500'}`}>{stat.change}</span>
                                    </div>
                                    <h3 className="text-gray-600 text-sm font-medium">{stat.title}</h3>

                                    <p className="text-xl md:text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
                                    {stat.subtitle && <p className="text-xs text-blue-500 justify-self-end">{stat.subtitle}</p>}
                                </div>
                            ))}

                        </div>
                    )}

                    {/* Regional Performance */}
                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm mb-6 md:mb-8">
                        <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-gray-800">Performa Total Fee Based Regional <i className='text-xs'>(Perbandingan Realisasi vs Target)</i></h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {regions.map((region, index) => (
                                <div
                                    key={index}
                                    className="p-4 rounded-lg bg-gray-50 hover:bg-yellow-50 transition-colors cursor-pointer"
                                >
                                    <h3 className="text-base md:text-lg font-medium text-gray-800 mb-2">{region.name}</h3>
                                    <div className="flex items-end justify-between">
                                        <span className="text-xl md:text-2xl font-bold text-blue-600">{region.performance}%</span>
                                        <span className="text-xs md:text-sm text-gray-500">Performance</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div className="grid grid-cols-1">
                        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <HiClock className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                                <h2 className="text-lg md:text-xl font-semibold text-gray-800">
                                    Histori Update
                                </h2>
                            </div>
                            <div className="space-y-3 overflow-y-auto custom-scrollbar" style={{ maxHeight: '300px' }}>
                                {updateHistory.map((update, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium text-gray-800">
                                                {update.file_path.split('/').pop()}
                                            </h3>
                                            <p className="text-xs text-gray-500">
                                                Diunggah oleh {update.user?.name || 'Unknown'}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(update.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <span className='px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 whitespace-nowrap ml-2'>
                                            Berhasil
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OverviewDashboard;