import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import SidebarComponent from '../components/SidebarComponent';
import { useExcelData } from '../hooks/useExcelData';
import { formattedDate } from '../services/formattedDate';

const FeeBased = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [comparisonData, setComparisonData] = useState([]);
    const [fileInfo, setFileInfo] = useState(null);

    const {
        mainData,
        isLoadingMain,
        mainError,
        refetchMain
    } = useExcelData();

    useEffect(() => {
        if (mainData?.data) {
            const { data, file_info } = mainData;

            // Set file info
            setFileInfo(file_info);

            // Mengolah data fee based per kanwil
            const colors = ['#58a832', '#219EBC', '#FFB703', '#FB8500', '#8ECAE6'];

            // Filter hanya data kanwil (exclude konsolidasi)
            const processedData = Object.entries(data)
                .filter(([key]) => key.startsWith('kanwil'))
                .map(([key, value], index) => {
                    // Jika target null atau 0, set ke 1 untuk menghindari division by zero
                    const target = value?.target?.fee_based_total || 1;
                    const realisasi = value?.realisasi?.fee_based_total || 0;
                    const achievement = ((realisasi / target) * 100).toFixed(1);

                    return {
                        name: key.replace('kanwil', 'Kanwil ').toUpperCase(),
                        total: realisasi,
                        target: target,
                        achievement: `${achievement}%`,
                        growth: achievement >= 100 ? `+${achievement}%` : `-${(100 - achievement).toFixed(1)}%`,
                        color: colors[index % colors.length],
                        // Data detail untuk setiap jenis fee based
                        details: [
                            {
                                name: 'Admin Kartu ATM',
                                target: value?.target?.fee_based_admin_kartu_atm || 1, // Set ke 1 jika null
                                realisasi: value?.realisasi?.fee_based_admin_kartu_atm || 0
                            },
                            {
                                name: 'ATM',
                                target: value?.target?.fee_based_atm || 1,
                                realisasi: value?.realisasi?.fee_based_atm || 0
                            },
                            {
                                name: 'DIGI & QRIS',
                                target: value?.target?.['fee_based_digi_&_qris'] || 1,
                                realisasi: value?.realisasi?.['fee_based_digi_&_qris'] || 0
                            },
                            {
                                name: 'Laku Pandai',
                                target: value?.target?.fee_based_laku_pandai || 1,
                                realisasi: value?.realisasi?.fee_based_laku_pandai || 0
                            },
                            {
                                name: 'EDC',
                                target: value?.target?.fee_based_edc || 1,
                                realisasi: value?.realisasi?.fee_based_edc || 0
                            },
                            {
                                name: 'Digital Lainnya',
                                target: value?.target?.fee_based_digital_lainnya || 1,
                                realisasi: value?.realisasi?.fee_based_digital_lainnya || 0
                            }
                        ]
                    };
                });

            setComparisonData(processedData);
        }
    }, [mainData]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border">
                    <p className="font-medium text-gray-800">{label}</p>
                    <div className="text-blue-600">
                        {`Total: Rp. ${data.total.toLocaleString('id-ID')} Juta`}
                    </div>
                    <div className={`text-sm ${data.growth.includes('-') ? 'text-red-500' : 'text-green-500'}`}>
                        {`${data.growth} dari Rp. ${(data.target).toLocaleString('id-ID')} Juta`}
                    </div>
                </div>
            );
        }
        return null;
    };

    const StatCard = ({ title, value, target }) => {
        // Hitung YTD (Year to Date) achievement
        const achievement = ((value / target) * 100).toFixed(1);
        const ytd = achievement >= 100
            ? `+${achievement}%`
            : `-${(100 - achievement).toFixed(1)}%`;

        return (
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:bg-yellow-50 transition-all">
                <div className='flex flex-row mb-2 justify-between'>
                    <h3 className="text-gray-600 font-medium">{title}</h3>
                    <p className='justify-self-end text-xs text-blue-500'>Dalam juta rupiah</p>
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                    {`Rp. ${(value).toLocaleString('id-ID')}`}
                </div>
                <div className={`text-sm font-medium ${ytd.includes('-') ? 'text-red-600' : 'text-green-600'}`}>
                    {`${ytd} dari target Rp. ${(target).toLocaleString('id-ID')}`}
                </div>
            </div>
        );
    };

    const DetailCard = ({ item, color }) => {
        const achievement = ((item.realisasi / item.target) * 100);
        const isGood = achievement >= 100;

        return (
            <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg hover:bg-yellow-50 transition-shadow">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1 pr-4">
                        <h4 className="text-gray-600 font-medium mb-1">
                            {item.name}
                        </h4>
                    </div>
                    <div className={`px-3 py-1 rounded-lg text-sm font-medium ${isGood ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {achievement.toFixed(1)}%
                    </div>
                </div>

                <div className="mb-4">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full transition-all duration-500 rounded-full"
                            style={{
                                width: `${Math.min(achievement, 100)}%`,
                                transition: 'width 1s ease-in-out',
                                backgroundColor: color
                            }}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Target</div>
                        <div className="font-semibold text-gray-800">
                            {item.target.toLocaleString('id-ID')}
                        </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Realisasi</div>
                        <div className="font-semibold" style={{ color }}>
                            {item.realisasi.toLocaleString('id-ID')}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const LoadingCard = () => (
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
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

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <SidebarComponent
                onCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)}
                activeItem="Fee Based Income"
            />

            <main className={`flex-1 overflow-x-hidden transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
                <div className="px-4 md:px-6 py-6 w-full">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Fee Based Income
                            </h1>
                            <p className="text-gray-500">
                                {`Data per ${formattedDate(fileInfo?.date)} (Diupload oleh ${fileInfo?.uploaded_by || '-'})`}
                            </p>
                        </div>
                        <img src="/images/Bank_BJB_logo.svg" alt="Bank BJB Logo" className="h-8 md:h-10" />
                    </div>

                    {/* Fee Based Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 md:mb-8">
                        {isLoadingMain ? (
                            <>
                                <LoadingCard />
                                <LoadingCard />
                                <LoadingCard />
                            </>
                        ) : (
                            comparisonData.map((item) => (
                                <StatCard
                                    key={item.name}
                                    title={item.name}
                                    value={item.total}
                                    target={item.target}
                                />
                            ))
                        )}
                    </div>

                    {/* Chart Section */}
                    {isLoadingMain ? (
                        <ChartLoading />
                    ) : (
                        <div className="bg-white p-4 md:p-6 rounded-xl shadow mb-6 md:mb-8 hover:shadow-lg">
                            <h2 className="text-lg md:text-xl font-semibold mb-4 text-gray-800">
                                Perbandingan Fee Based Income
                            </h2>
                            <div className="h-72 md:h-96">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={comparisonData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                        <XAxis dataKey="name" tick={{ fill: '#4B5563' }} />
                                        <YAxis tick={{ fill: '#4B5563' }} />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Legend />
                                        <Bar
                                            dataKey="total"
                                            name="Total Fee Based"
                                            radius={[4, 4, 0, 0]}
                                        >
                                            {comparisonData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={entry.color}
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {/* Detail Sections */}
                    {!isLoadingMain && comparisonData?.map((kanwil) => (
                        <div key={kanwil.name} className="mb-6 md:mb-8">
                            <div className="flex justify-center items-center mb-4 bg-white p-4 md:p-6 rounded-xl shadow-sm hover:bg-blue-50">
                                <h2 className="text-lg md:text-xl font-bold text-gray-800">
                                    {kanwil.name}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {kanwil.details?.map((item, idx) => (
                                    <DetailCard
                                        key={idx}
                                        item={item}
                                        color={kanwil.color}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default FeeBased;