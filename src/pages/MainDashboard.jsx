import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';
import SidebarComponent from '../components/SidebarComponent';
import useDataStore from '../data/dataStore';
import { HiCreditCard, HiDesktopComputer, HiDeviceMobile, HiQrcode, HiUser, HiUsers } from 'react-icons/hi';
import { formattedDate } from '../services/formattedDate';

const MainDashboard = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { region } = useParams();
    const navigate = useNavigate();
    const [currentData, setCurrentData] = useState(null);
    const [fileInfo, setFileInfo] = useState(null);

    const {
        mainData,
        isLoadingMain,
        mainError,
        fetchExcelData
    } = useDataStore();

    // Fetch data on component mount
    useEffect(() => {
        fetchExcelData('main');
    }, [fetchExcelData]);

    useEffect(() => {
        if (mainData?.data) {
            const { data, file_info } = mainData;

            setFileInfo(file_info);

            // Handle konsolidasi route (when region is undefined)
            const currentRegion = region || 'konsolidasi';
            const regionData = data[currentRegion];

            if (regionData) {
                const aktivasiDanAkuisisi = [
                    {
                        title: "Pengguna Digi Mobile",
                        value: regionData.summary?.user_digi_mobile.toLocaleString('id-ID') || 'N/A',
                        ytd: `${(regionData.summary?.ytd_user_digi_mobile * 100).toFixed(2)}%`,
                        asalYtd: regionData.summary?.asal_ytd_user_digi_mobile.toLocaleString('id-ID') || 'N/A',
                        icon: HiUser,
                        color: "bg-blue-100 text-blue-600"
                    },
                    {
                        title: "Merchant QRIS",
                        value: regionData.summary?.user_merchant_qris.toLocaleString('id-ID') || 'N/A',
                        ytd: `${(regionData.summary?.ytd_user_merchant_qris * 100).toFixed(2)}%`,
                        asalYtd: regionData.summary?.asal_ytd_user_merchant_qris.toLocaleString('id-ID') || 'N/A',
                        icon: HiCreditCard,
                        color: "bg-purple-100 text-purple-600"
                    },
                    {
                        title: "Agen BJB Bisa",
                        value: regionData.summary?.user_agen_bjb_bisa.toLocaleString('id-ID') || 'N/A',
                        ytd: `${(regionData.summary?.ytd_user_agen_bjb_bisa * 100).toFixed(2)}%`,
                        asalYtd: regionData.summary?.asal_ytd_user_agen_bjb_bisa.toLocaleString('id-ID') || 'N/A',
                        icon: HiUsers,
                        color: "bg-yellow-100 text-yellow-600"
                    }
                ];

                const utilisasiTransaksi = [
                    {
                        title: "Utilisasi Digi Mobile",
                        value: regionData.summary?.utilisasi_digi_mobile.toLocaleString('id-ID') || 'N/A',
                        ytd: `${(regionData.summary?.ytd_utilisasi_digi_mobile * 100).toFixed(2)}%`,
                        asalYtd: regionData.summary?.asal_ytd_utilisasi_digi_mobile.toLocaleString('id-ID') || 'N/A',
                        icon: HiDeviceMobile,
                        color: "bg-teal-100 text-teal-600"
                    },
                    {
                        title: "Utilisasi QRIS",
                        value: regionData.summary?.utilisasi_merchant_qris.toLocaleString('id-ID') || 'N/A',
                        ytd: `${(regionData.summary?.ytd_utilisasi_merchant_qris * 100).toFixed(2)}%`,
                        asalYtd: regionData.summary?.asal_ytd_utilisasi_merchant_qris.toLocaleString('id-ID') || 'N/A',
                        icon: HiQrcode,
                        color: "bg-rose-100 text-rose-600"
                    },
                    {
                        title: "Utilisasi BJB Bisa",
                        value: regionData.summary?.utilisasi_agen_bjb_bisa.toLocaleString('id-ID') || 'N/A',
                        ytd: `${(regionData.summary?.ytd_utilisasi_agen_bjb_bisa * 100).toFixed(2)}%`,
                        asalYtd: regionData.summary?.asal_ytd_utilisasi_agen_bjb_bisa.toLocaleString('id-ID') || 'N/A',
                        icon: HiDesktopComputer,
                        color: "bg-orange-100 text-orange-600"
                    }
                ];

                const feeBasedData = [
                    {
                        name: "Admin Kartu ATM",
                        target: regionData.target?.fee_based_admin_kartu_atm || 0,
                        realisasi: regionData.realisasi?.fee_based_admin_kartu_atm || 0
                    },
                    {
                        name: "ATM",
                        target: regionData.target?.fee_based_atm || 0,
                        realisasi: regionData.realisasi?.fee_based_atm || 0
                    },
                    {
                        name: "DIGI & QRIS",
                        target: regionData.target?.['fee_based_digi_&_qris'] || 0,
                        realisasi: regionData.realisasi?.['fee_based_digi_&_qris'] || 0
                    },
                    {
                        name: "Laku Pandai",
                        target: regionData.target?.fee_based_laku_pandai || 0,
                        realisasi: regionData.realisasi?.fee_based_laku_pandai || 0
                    },
                    {
                        name: "EDC",
                        target: regionData.target?.fee_based_edc || 0,
                        realisasi: regionData.realisasi?.fee_based_edc || 0
                    },
                    {
                        name: "Digital Lainnya",
                        target: regionData.target?.fee_based_digital_lainnya || 0,
                        realisasi: regionData.realisasi?.fee_based_digital_lainnya || 0
                    }
                ];

                const jumlahTransactionData = Object.keys(regionData.jumlah_triwulanan.atm).map(quarter => ({
                    quarter,
                    atm: regionData.jumlah_triwulanan.atm[quarter],
                    digi: regionData.jumlah_triwulanan.digi[quarter]
                }));

                const nominalTransactionData = Object.keys(regionData.nominal_triwulanan.atm).map(quarter => ({
                    quarter,
                    atm: regionData.nominal_triwulanan.atm[quarter],
                    digi: regionData.nominal_triwulanan.digi[quarter]
                }));

                setCurrentData({
                    aktivasiDanAkuisisi,
                    utilisasiTransaksi,
                    feeBasedData,
                    jumlahTransactionData,
                    nominalTransactionData
                });
            } else {
                navigate('/dashboard/konsolidasi', { replace: true });
            }
        }
    }, [mainData, region, navigate]);

    const handleRegionChange = (newRegion) => {
        navigate(`/dashboard/${newRegion}`);
    };

    if (mainError) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center text-red-600">
                    <p>Error: {mainError}</p>
                    <button
                        onClick={() => fetchExcelData('main')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const StatCard = ({ title, value, ytd, asalYtd, icon, color }) => {
        const IconComponent = icon;
        const ytdValue = parseFloat(ytd);
        const isGrowthPositive = ytdValue > 0;
        const growthColor = isGrowthPositive ? 'text-green-600' : 'text-red-600';

        // Ekstrak warna utama dari class `color`
        const colorClass = color.split(" ")[0]; // Ambil "bg-blue-100"
        const mainColor = colorClass.replace("bg-", "").replace("-100", ""); // Ambil "blue"

        // Definisikan warna map untuk tailwind (untuk latar belakang bar)
        const colorMapping = {
            blue: "bg-blue-500",
            purple: "bg-purple-500",
            yellow: "bg-yellow-500",
            teal: "bg-teal-500",
            rose: "bg-rose-500",
            orange: "bg-orange-500",
            red: "bg-red-500",
            green: "bg-green-500",
        };

        // Gunakan warna yang sesuai
        const currentBarColor = colorMapping[mainColor] || "bg-gray-500"; // Default gray jika warna tidak dikenali

        // Convert values to numbers for comparison
        const currentValue = parseFloat(value.replace(/[^0-9.-]+/g, ""));
        const initialValue = parseFloat(asalYtd.replace(/[^0-9.-]+/g, ""));

        // Calculate max value for scaling
        const maxValue = title.includes('Utilisasi') ? 100 : Math.max(currentValue, initialValue);

        // Calculate width percentages
        const initialWidthPercent = (initialValue / maxValue) * 100;
        const currentWidthPercent = (currentValue / maxValue) * 100;

        return (
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:bg-blue-50">
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-full ${color} w-12`}>
                        {IconComponent ? <IconComponent className="w-6 h-6" /> : null}
                    </div>
                    <div className={`flex items-center ${growthColor} text-lg font-bold`}>
                        {isGrowthPositive ? '↑' : '↓'} {ytd}
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-gray-600 font-medium">{title}</h3>
                    <div className="text-2xl font-bold text-gray-800">{value}</div>
                </div>

                {/* Horizontal Bar Chart */}
                <div className="mt-6">
                    <div className="space-y-4">
                        {/* Awal Tahun Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Awal Tahun</span>
                                <span className="font-medium text-gray-800">{asalYtd}</span>
                            </div>
                            <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                                <div
                                    className="absolute left-0 top-0 h-full bg-gray-300 rounded-lg transition-all duration-300"
                                    style={{ width: `${initialWidthPercent}%` }}
                                />
                            </div>
                        </div>

                        {/* Saat Ini Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Saat Ini</span>
                                <span className="font-medium text-gray-800">{value}</span>
                            </div>
                            <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                                <div
                                    className={`absolute left-0 top-0 h-full ${currentBarColor} rounded-lg transition-all duration-300`}
                                    style={{ width: `${currentWidthPercent}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-3">
                        <span className={`text-sm ${growthColor} font-medium`}>
                            {isGrowthPositive ? '+' : ''}{ytd} dari awal tahun
                        </span>
                    </div>
                </div>
            </div>
        );
    };

    // Loading components
    const StatLoading = () => (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
        </div>
    );

    const ChartLoading = () => (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
                <div className="h-96 bg-gray-100 rounded flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </div>
        </div>
    );

    const {
        aktivasiDanAkuisisi = [],
        utilisasiTransaksi = [],
        feeBasedData = [],
        jumlahTransactionData = [],
        nominalTransactionData = []
    } = currentData || {};

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <SidebarComponent
                onCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)}
                activeRegion={region || 'konsolidasi'}
                onRegionChange={handleRegionChange}
            />

            <main className={`flex-1 overflow-x-hidden will-change-transform transform-gpu transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
                <div className="px-4 md:px-6 py-6 w-full">
                    {/* Header */}
                    <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                {(region || 'konsolidasi') === 'konsolidasi' ? 'Dashboard Konsolidasi' : `Dashboard Kanwil ${region.slice(-1)}`}
                            </h1>
                            <p className="text-gray-500">
                                {`Data per ${formattedDate(fileInfo?.date)} (Diupload oleh ${fileInfo?.uploaded_by || '-'})`}
                            </p>
                        </div>
                        <img src="/images/Bank_BJB_logo.svg" alt="Bank BJB Logo" className="h-8 md:h-10" />
                    </div>

                    <div className='py-4 md:py-8'>
                        {/* Aktivasi dan Akuisisi Section */}
                        <div className='flex justify-center items-center mb-4 bg-white p-4 md:p-6 rounded-xl shadow-sm hover:bg-blue-50'>
                            <div>
                                <h2 className='text-lg md:text-xl font-bold text-gray-800'>
                                    Aktivasi dan Akuisisi
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:mb-8">
                            {isLoadingMain ? (
                                <>
                                    <StatLoading />
                                    <StatLoading />
                                    <StatLoading />
                                </>
                            ) : (
                                aktivasiDanAkuisisi.map((stat, index) => (
                                    <StatCard
                                        key={index}
                                        title={stat.title}
                                        value={stat.value}
                                        ytd={stat.ytd}
                                        asalYtd={stat.asalYtd}
                                        icon={stat.icon}
                                        color={stat.color}
                                    />
                                ))
                            )}
                        </div>

                        {/* Utilisasi Transaksi Section */}
                        <div className='flex justify-center items-center mb-4 bg-white p-4 md:p-6 rounded-xl shadow-sm hover:bg-blue-50'>
                            <div>
                                <h2 className='text-lg md:text-xl font-bold text-gray-800'>
                                    Utilisasi Transaksi
                                </h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:mb-8">
                            {isLoadingMain ? (
                                <>
                                    <StatLoading />
                                    <StatLoading />
                                    <StatLoading />
                                </>
                            ) : (
                                utilisasiTransaksi.map((stat, index) => (
                                    <StatCard
                                        key={index}
                                        title={stat.title}
                                        value={stat.value}
                                        ytd={stat.ytd}
                                        asalYtd={stat.asalYtd}
                                        icon={stat.icon}
                                        color={stat.color}
                                    />
                                ))
                            )}
                        </div>

                        {/* Fee Based Chart */}
                        {isLoadingMain ? (
                            <ChartLoading />
                        ) : (
                            <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm mb-6 md:mb-8">
                                <h2 className="text-sm md:text-xl font-semibold mb-4 text-gray-800 flex justify-between">
                                    Fee Based E-Channel <i className='text-xs text-blue-500'>Dalam juta rupiah</i>
                                </h2>

                                <div className="h-72 md:h-96">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={feeBasedData} layout="vertical" margin={{ right: 30 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis
                                                dataKey="name"
                                                type="category"
                                                width={80}
                                                tick={{ fontSize: window.innerWidth < 768 ? 10 : 12 }}
                                            />

                                            <Tooltip formatter={(value) => value.toLocaleString('id-ID')} />
                                            <Legend />
                                            <Bar
                                                dataKey="target"
                                                fill="#FFB703"
                                                name="Target"
                                                label={({ x, y, width, value }) => (
                                                    <text
                                                        x={x + width + 5}
                                                        y={y + 17}
                                                        fill="#FFB703"
                                                        fontSize={12}
                                                        textAnchor="start"
                                                    >
                                                        {value.toLocaleString('id-ID')}
                                                    </text>
                                                )}
                                            />
                                            <Bar
                                                dataKey="realisasi"
                                                fill="#14507F"
                                                name="Realisasi"
                                                label={({ x, y, width, value }) => (
                                                    <text
                                                        x={x + width + 5}
                                                        y={y + 17}
                                                        fill="#14507F"
                                                        fontSize={12}
                                                        textAnchor="start"
                                                    >
                                                        {value.toLocaleString('id-ID')}
                                                    </text>
                                                )}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        )}

                        {/* Transaction Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                            {isLoadingMain ? (
                                <>
                                    <ChartLoading />
                                    <ChartLoading />
                                </>
                            ) : (
                                <>
                                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
                                        <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
                                            Jumlah Transaksi Triwulanan
                                        </h2>
                                        <div className="h-64 md:h-72">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={jumlahTransactionData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="quarter" />
                                                    <YAxis />
                                                    <Tooltip formatter={(value) => value.toLocaleString('id-ID')} />
                                                    <Legend />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="atm"
                                                        stroke="#14507F"
                                                        name="ATM"
                                                        strokeWidth={2}
                                                        label={({ x, y, value }) => (
                                                            <text
                                                                x={x}
                                                                y={y - 10}
                                                                fill="#14507F"
                                                                fontSize={12}
                                                                fontWeight="500"
                                                                textAnchor="middle"
                                                                dominantBaseline="middle"
                                                            >
                                                                {value?.toLocaleString('id-ID')}
                                                            </text>
                                                        )}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="digi"
                                                        stroke="#FFB703"
                                                        name="DIGI"
                                                        strokeWidth={2}
                                                        label={({ x, y, value }) => (
                                                            <text
                                                                x={x}
                                                                y={y - 10}
                                                                fill="#FFB703"
                                                                fontSize={12}
                                                                fontWeight="500"
                                                                textAnchor="middle"
                                                                dominantBaseline="middle"
                                                            >
                                                                {value?.toLocaleString('id-ID')}
                                                            </text>
                                                        )}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm">
                                        <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
                                            Nominal Transaksi Triwulanan
                                        </h2>
                                        <div className="h-64 md:h-72">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={nominalTransactionData} margin={{ top: 30, right: 30, left: 20, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="quarter" />
                                                    <YAxis />
                                                    <Tooltip formatter={(value) => `${value.toLocaleString('id-ID')}`} />
                                                    <Legend />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="atm"
                                                        stroke="#14507F"
                                                        name="ATM"
                                                        strokeWidth={2}
                                                        label={({ x, y, value }) => (
                                                            <text
                                                                x={x}
                                                                y={y - 10}
                                                                fill="#14507F"
                                                                fontSize={12}
                                                                fontWeight="500"
                                                                textAnchor="middle"
                                                                dominantBaseline="middle"
                                                            >
                                                                {`${value?.toLocaleString('id-ID')}`}
                                                            </text>
                                                        )}
                                                    />
                                                    <Line
                                                        type="monotone"
                                                        dataKey="digi"
                                                        stroke="#FFB703"
                                                        name="DIGI"
                                                        strokeWidth={2}
                                                        label={({ x, y, value }) => (
                                                            <text
                                                                x={x}
                                                                y={y - 10}
                                                                fill="#FFB703"
                                                                fontSize={12}
                                                                fontWeight="500"
                                                                textAnchor="middle"
                                                                dominantBaseline="middle"
                                                            >
                                                                {`${value?.toLocaleString('id-ID')}`}
                                                            </text>
                                                        )}
                                                    />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </main >
        </div >
    );
};

export default MainDashboard;
