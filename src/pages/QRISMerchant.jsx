import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import SidebarComponent from '../components/SidebarComponent';
import { HiOfficeBuilding, HiUsers, HiCreditCard } from 'react-icons/hi';
import useDataStore from '../data/dataStore';
import { formattedDate } from '../services/formattedDate';

const QRISMerchant = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const {
        qrisMerchantData,
        isLoadingQrisMerchant,
        qrisMerchantError,
        fetchExcelData
    } = useDataStore();

    // Fetch data on component mount
    useEffect(() => {
        fetchExcelData('qris_merchant');
    }, [fetchExcelData]);

    const [merchantStats, setMerchantStats] = useState([]);
    const [merchantData, setMerchantData] = useState([]);
    const [utilisasiData, setUtilisasiData] = useState([]);
    const [fileInfo, setFileInfo] = useState(null);

    useEffect(() => {
        if (qrisMerchantData) {
            const { data, file_info } = qrisMerchantData;
            const qrisData = data.qris_merchant;
            const total = qrisData.total;

            setFileInfo(file_info);

            setMerchantStats([
                {
                    title: "Total Merchant",
                    value: total.merchant_list.toLocaleString('id-ID'),
                    icon: HiCreditCard,
                    color: "bg-blue-100 text-blue-600"
                },
                {
                    title: "Total Merchant Aktif",
                    value: total.jumlah_merchant.toLocaleString('id-ID'),
                    icon: HiUsers,
                    color: "bg-yellow-100 text-yellow-600"
                },
                {
                    title: "Total Transaksi",
                    value: total.jumlah_transaksi.toLocaleString('id-ID'),
                    icon: HiOfficeBuilding,
                    color: "bg-green-100 text-green-600"
                },
                {
                    title: "Total Nominal",
                    subtitle: "Dalam juta rupiah",
                    value: `Rp ${(total.nominal_transaksi / 1000000).toLocaleString('id-ID')}`,
                    icon: HiOfficeBuilding,
                    color: "bg-purple-100 text-purple-600"
                }
            ]);

            const colors = ['#58a832', '#219EBC', '#FFB703', '#FB8500', '#8ECAE6'];
            const kanwilData = Object.entries(qrisData)
                .filter(([key]) => key.startsWith('kanwil'))
                .map(([key, value], index) => ({
                    name: `Kanwil ${key.replace('kanwil', '')}`,
                    merchant: value.merchant_list,
                    merchantAktif: value.jumlah_merchant,
                    transaksi: value.jumlah_transaksi,
                    nominal: value.nominal_transaksi / 1000000,
                    color: colors[index % colors.length]
                }));
            setMerchantData(kanwilData);

            setUtilisasiData(kanwilData);
        }
    }, [qrisMerchantData]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border">
                    <p className="font-medium text-gray-800">{label}</p>
                    <div className="text-sm">
                        <p className="text-blue-600">
                            {`${payload[0].name}: ${payload[0].value.toLocaleString()}`}
                        </p>
                    </div>
                </div>
            );
        }
        return null;
    };

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

    // const ChartLoading = () => (
    //     <div className="bg-white p-6 rounded-xl shadow-sm">
    //         <div className="animate-pulse">
    //             <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
    //             <div className="h-80 bg-gray-100 rounded flex items-center justify-center">
    //                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    //             </div>
    //         </div>
    //     </div>
    // );

    if (qrisMerchantError) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-center text-red-600">
                    <p>Error: {qrisMerchantError}</p>
                    <button
                        onClick={() => fetchExcelData('qris_merchant')}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <SidebarComponent
                onCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)}
                activeItem="QRIS Merchant"
            />

            <main className={`flex-1 overflow-x-hidden will-change-transform transform-gpu transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
                <div className="px-4 md:px-6 py-6 w-full">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                QRIS Merchant
                            </h1>
                            <p className="text-gray-500">
                                {`Data per ${formattedDate(fileInfo?.date)} (Diupload oleh ${fileInfo?.uploaded_by || '-'})`}
                            </p>
                        </div>
                        <img src="/images/Bank_BJB_logo.svg" alt="Bank BJB Logo" className="h-8 md:h-10" />
                    </div>

                    {/* Stats Grid */}
                    {isLoadingQrisMerchant ? (
                        <StatsLoading />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                            {merchantStats.map((stat, index) => (
                                <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-full ${stat.color}`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                    </div>
                                    <div className="flex flex-row justify-between">
                                        <h3 className="text-gray-600 text-sm font-medium">
                                            {stat.title}
                                        </h3>
                                        {stat.subtitle && <p className="text-blue-500 text-xs justify-self-end">{stat.subtitle}</p>}
                                    </div>
                                    <p className="text-2xl font-bold text-gray-800 mt-1">
                                        {stat.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Merchant Distribution Section */}
                    {!isLoadingQrisMerchant && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
                            {/* Merchant Distribution Chart */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Distribusi Merchant</h2>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={merchantData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Bar dataKey="merchant" name="Jumlah Merchant">
                                                {merchantData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Active Merchant Distribution Chart */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Distribusi Merchant Aktif</h2>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={merchantData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend />
                                            <Bar dataKey="merchantAktif" name="Merchant Aktif">
                                                {merchantData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Pie Charts Section */}


                    {/* Transaction Charts Section */}
                    {!isLoadingQrisMerchant && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
                            {/* Transaction Count Chart */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Jumlah Transaksi per Kanwil</h2>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart layout="vertical" data={utilisasiData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis type="category" dataKey="name" />
                                            <Tooltip formatter={(value) => value.toLocaleString()} />
                                            <Legend />
                                            <Bar dataKey="transaksi" name="Jumlah Transaksi">
                                                {utilisasiData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Transaction Amount Chart */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Nominal Transaksi per Kanwil</h2>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart layout="vertical" data={utilisasiData}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" />
                                            <YAxis type="category" dataKey="name" />
                                            <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} />
                                            <Legend />
                                            <Bar dataKey="nominal" name="Nominal Transaksi">
                                                {utilisasiData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    {!isLoadingQrisMerchant && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
                            {/* Merchant Proportion Pie Chart */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Proporsi Merchant</h2>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={merchantData}
                                                dataKey="merchant"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {merchantData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => value.toLocaleString()} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Active Merchant Proportion Pie Chart */}
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Proporsi Merchant Aktif</h2>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={merchantData}
                                                dataKey="merchantAktif"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {merchantData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => value.toLocaleString()} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-4 md:mt-8 bg-white p-4 md:p-6 rounded-xl shadow-sm">
                        <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-gray-800">
                            Detail per Kanwil
                        </h2>
                        {isLoadingQrisMerchant ?
                            (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                    {[1, 2, 3, 4, 5].map((index) => (
                                        <div key={index} className="p-4 rounded-lg bg-gray-50">
                                            <div className="animate-pulse">
                                                <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                                                <div className="space-y-3">
                                                    {[1, 2, 3].map((i) => (
                                                        <div key={i}>
                                                            <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                                                            <div className="h-6 bg-gray-200 rounded w-32"></div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                    {merchantData.map((kanwil, index) => (
                                        <div
                                            key={index}
                                            className="p-4 rounded-lg bg-gray-50 hover:bg-yellow-50 transition-colors"
                                        >
                                            <h3 className="text-lg font-medium text-gray-800 mb-2">
                                                {kanwil.name}
                                            </h3>
                                            <div className="space-y-3">
                                                <div>
                                                    <p className="text-sm text-gray-600">Jumlah Merchant</p>
                                                    <p className="text-xl font-bold text-gray-800">
                                                        {kanwil.merchant.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-600">Merchant Aktif</p>
                                                    <p className="text-xl font-bold text-yellow-600">
                                                        {utilisasiData[index].merchantAktif.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </div>

                    {/* Transaction Details Section */}
                    <div className="mt-4 md:mt-8 bg-white p-4 md:p-6 rounded-xl shadow-sm">
                        <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-gray-800">
                            Detail Nominal Transaksi per Kanwil <i className='text-xs text-blue-500 ml-4'>(Dalam Juta rupiah)</i>
                        </h2>
                        {isLoadingQrisMerchant ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                {[1, 2, 3, 4, 5].map((index) => (
                                    <div key={index} className="p-4 rounded-lg bg-gray-50">
                                        <div className="animate-pulse">
                                            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
                                            <div className="space-y-3">
                                                {[1, 2].map((i) => (
                                                    <div key={i}>
                                                        <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                                                        <div className="h-6 bg-gray-200 rounded w-32"></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                {merchantData.map((kanwil, index) => (
                                    <div
                                        key={index}
                                        className="p-4 rounded-lg bg-gray-50 hover:bg-yellow-50 transition-colors"
                                    >
                                        <h3 className="text-lg font-medium text-gray-800 mb-2">
                                            {kanwil.name}
                                        </h3>
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-600">Nominal Transaksi</p>
                                                <p className="text-xl font-bold text-gray-800">
                                                    Rp {kanwil.nominal.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-600">Jumlah Transaksi</p>
                                                <p className="text-xl font-bold text-blue-600">
                                                    {kanwil.transaksi.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default QRISMerchant;