import { useState, useEffect, useRef } from 'react';
import { HiUpload, HiCheck, HiX, HiChevronLeft, HiChevronRight, HiTrash, HiExclamation, HiDownload } from 'react-icons/hi';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import useDataStore from '../data/dataStore';
import dummyApi from '../services/dummyApi';
import SidebarComponent from '../components/SidebarComponent';
import { id } from 'date-fns/locale';

const File = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [files, setFiles] = useState({
        main: {
            data: [],
            current_page: 1,
            last_page: 1,
            per_page: 5,
            total: 0
        },
        qris_merchant: {
            data: [],
            current_page: 1,
            last_page: 1,
            per_page: 5,
            total: 0
        }
    });
    const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        fileId: null,
        fileName: '',
        content: null
    });
    const [isDataFetched, setIsDataFetched] = useState(true);

    const mainData = useDataStore((state) => state.mainData);
    const qrisMerchantData = useDataStore((state) => state.qrisMerchantData);

    const fetchFiles = async (content = 'main', page = 1) => {
        try {
            setLoading(true);
            const response = await dummyApi.get(`/files/content/${content}`, {
                params: {
                    page,
                    per_page: files[content].per_page
                }
            });

            setFiles(prev => ({
                ...prev,
                [content]: {
                    data: response.data.data,
                    current_page: response.data.current_page,
                    last_page: response.data.last_page,
                    per_page: response.data.per_page,
                    total: response.data.total
                }
            }));
        } catch (error) {
            console.error('Error fetching files:', error);
            toast.error('Gagal mengambil data files', {
                autoClose: 2000
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOneTimeFetch = async () => {
        try {
            setLoading(true);

            // Fetch both data types and update store
            await useDataStore.getState().fetchExcelData('main');
            await useDataStore.getState().fetchExcelData('qris_merchant');

            // Update UI state
            setIsDataFetched(true);
            toast.success('Data berhasil diambil!', { autoClose: 2000 });

            // Update file list display
            await fetchFiles('main');
            await fetchFiles('qris_merchant');
        } catch (error) {
            console.error('Error fetching initial data:', error);
            toast.error('Gagal mengambil data awal!', { autoClose: 2000 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const checkDataInStore = () => {
            // Check if both mainData and qrisMerchantData exist in store
            if (!mainData && !qrisMerchantData) {
                setIsDataFetched(false);
            } else {
                setIsDataFetched(true);
            }
        };

        checkDataInStore();
    }, [mainData, qrisMerchantData]);

    const fetchButton = (isDataFetched) => {
        if (isDataFetched) {
            return null;
        }

        return (
            <div className="mb-8 flex justify-end">
                <button
                    onClick={handleOneTimeFetch}
                    className="px-3 py-2 rounded-lg bg-yellow-500 text-white flex w-full justify-center hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    disabled={loading}
                >
                    <HiDownload className='w-6 h-6 mr-2' />
                    Ambil Data Awal
                </button>
            </div>
        );
    };

    useEffect(() => {
        fetchFiles('main');
        fetchFiles('qris_merchant');
    }, []);

    const handlePageChange = async (content, page) => {
        await fetchFiles(content, page);
    };

    const handleSetActive = async (id, content) => {
        try {
            await dummyApi.post(`/files/${id}/activate`);


            await useDataStore.getState().fetchExcelData(content);

            if (content === 'main') {
                useDataStore.getState().setMainActiveFile(id);
            } else {
                useDataStore.getState().setQrisMerchantActiveFile(id);
            }

            toast.success('File berhasil diaktifkan', {
                autoClose: 2000
            });
            await fetchFiles(content);
        } catch (error) {
            console.error('Activation error:', error);
            toast.error('Gagal mengaktifkan file', {
                autoClose: 2000
            });
        }
    };

    const handleDelete = async () => {
        try {
            await dummyApi.delete(`/files/${deleteModal.fileId}`);
            toast.success('File berhasil dihapus', {
                autoClose: 2000
            });
            await fetchFiles(deleteModal.content);
            setDeleteModal({ isOpen: false, fileId: null, fileName: '', content: null });
        } catch (error) {
            console.error('Delete error:', error);
            toast.error(error.response?.data?.message || 'Gagal menghapus file', {
                autoClose: 2000
            });
        }
    };

    const formattedDate = (date) => {
        return format(new Date(date), 'EEEE, dd MMMM yyyy', { locale: id })
    }

    // const Pagination = ({ content, currentPage, lastPage, total }) => (
    //     <div className="px-16 py-3 flex items-center justify-between border-t border-gray-200">
    //         <div className="flex-1 flex justify-between items-center">
    //             <div className="text-sm text-gray-700">
    //                 Showing{' '}
    //                 <span className="font-medium">
    //                     {((currentPage || 1) - 1) * (files[content]?.per_page || 10) + 1}
    //                 </span>{' '}
    //                 to{' '}
    //                 <span className="font-medium">
    //                     {Math.min((currentPage || 1) * (files[content]?.per_page || 10), total || 0)}
    //                 </span>{' '}
    //                 of <span className="font-medium">{total || 0}</span> results
    //             </div>
    //             <div className="flex space-x-2">
    //                 <button
    //                     onClick={() => handlePageChange(content, (currentPage || 1) - 1)}
    //                     disabled={currentPage === 1}
    //                     className={`px-3 py-1 rounded-md ${currentPage === 1
    //                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
    //                         : 'bg-white text-gray-700 hover:bg-gray-50 border'
    //                         }`}
    //                 >
    //                     <HiChevronLeft className="w-5 h-5" />
    //                 </button>
    //                 {[...Array(lastPage || 0)].map((_, index) => {
    //                     const page = index + 1;
    //                     return (
    //                         <button
    //                             key={page}
    //                             onClick={() => handlePageChange(content, page)}
    //                             className={`px-3 py-1 rounded-md ${currentPage === page
    //                                 ? 'bg-blue-500 text-white'
    //                                 : 'bg-white text-gray-700 hover:bg-gray-50 border'
    //                                 }`}
    //                         >
    //                             {page}
    //                         </button>
    //                     );
    //                 })}
    //                 <button
    //                     onClick={() => handlePageChange(content, (currentPage || 1) + 1)}
    //                     disabled={currentPage === lastPage}
    //                     className={`px-3 py-1 rounded-md ${currentPage === lastPage
    //                         ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
    //                         : 'bg-white text-gray-700 hover:bg-gray-50 border'
    //                         }`}
    //                 >
    //                     <HiChevronRight className="w-5 h-5" />
    //                 </button>
    //             </div>
    //         </div>
    //     </div>
    // );

    const FileSection = ({ title, content, files, loading }) => {
        const [dateError, setDateError] = useState('');
        const fileInputRef = useRef(null);

        const handleUploadClick = () => {
            if (!selectedDate) {
                setDateError('Silakan pilih tanggal terlebih dahulu');
                return;
            }
            fileInputRef.current?.click();
        };

        const handleDateChange = (e) => {
            setSelectedDate(e.target.value);
            setDateError('');
        };

        const localHandleFileUpload = async (content, file) => {
            if (!selectedDate) {
                setDateError('Silakan pilih tanggal terlebih dahulu');
                return;
            }

            if (!file) {
                toast.error('Silakan pilih file terlebih dahulu', {
                    autoClose: 2000
                });
                return;
            }

            // Validasi tipe file
            const allowedTypes = [
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'application/vnd.ms-excel'
            ];

            if (!allowedTypes.includes(file.type)) {
                toast.error('Format file tidak didukung. Gunakan file Excel (.xlsx atau .xls)', {
                    autoClose: 2000
                });
                return;
            }

            setUploading(true);
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('content', content);
                formData.append('date', format(new Date(selectedDate), 'yyyy-MM-dd'));

                const response = await dummyApi.post('/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });

                await useDataStore.getState().fetchExcelData(content);

                if (content === 'main') {
                    useDataStore.getState().setMainActiveFile(response.data.id);
                } else {
                    useDataStore.getState().setQrisMerchantActiveFile(response.data.id);
                }

                toast.success('File berhasil diupload', {
                    autoClose: 2000
                });
                await fetchFiles(content);

                // Reset form
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } catch (error) {
                console.error('Upload error:', error);
                toast.error(error.response?.data?.message || 'Gagal upload file', {
                    autoClose: 2000
                });
            } finally {
                setUploading(false);
            }
        };

        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                </div>

                <div className="p-4">
                    <div className="mb-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-700 mb-3">Upload File Baru</h3>

                            <div className="space-y-4">
                                {/* Date Input */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pilih Tanggal Report
                                    </label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={handleDateChange}
                                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${dateError ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                    {dateError && (
                                        <p className="mt-1 text-sm text-red-500">{dateError}</p>
                                    )}
                                </div>

                                {/* Upload Section */}
                                <div className="flex items-center space-x-4">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept=".xlsx,.xls"
                                        onChange={(e) => localHandleFileUpload(content, e.target.files?.[0])}
                                        disabled={uploading || !selectedDate}
                                    />
                                    <button
                                        onClick={handleUploadClick}
                                        disabled={uploading || !selectedDate}
                                        className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${!selectedDate
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-500 text-white hover:bg-blue-600'
                                            }`}
                                    >
                                        <HiUpload className="w-5 h-5 mr-2" />
                                        {uploading ? 'Uploading...' : 'Upload File'}
                                    </button>
                                    {selectedDate && (
                                        <span className="text-sm text-gray-600">
                                            Report untuk tanggal: {format(new Date(selectedDate), 'dd MMMM yyyy', { locale: id })}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto -mx-4 md:mx-0">
                        <div className="inline-block min-w-full align-middle">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filename</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploader</th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        [...Array(3)].map((_, index) => (
                                            <tr key={index} className="animate-pulse">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center">
                                                        <div className="w-5 h-5 bg-gray-200 rounded mr-2"></div>
                                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center">
                                                        <div className="w-6 h-6 bg-gray-200 rounded-full mr-2"></div>
                                                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : files[content]?.data?.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-8 text-center">
                                                <div className="flex flex-col items-center justify-center text-gray-500">
                                                    <svg
                                                        className="w-12 h-12 mb-4 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                        />
                                                    </svg>
                                                    <p>Belum ada file yang diupload</p>
                                                    <p className="text-sm mt-2">Silahkan upload file baru menggunakan tombol di atas</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        files[content]?.data?.map((file) => (
                                            <tr key={file.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900">
                                                    <div className="flex items-center">
                                                        <svg
                                                            className="w-5 h-5 mr-2 text-gray-400"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                        {file.file_name}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-500">{formattedDate(file.date)}</td>
                                                <td className="px-4 py-3 text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                                            {file.uploaded_by.charAt(0).toUpperCase()}
                                                        </div>
                                                        {file.uploaded_by}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    {file.is_active ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <HiCheck className="w-4 h-4 mr-1" /> Active
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            <HiX className="w-4 h-4 mr-1" /> Inactive
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex justify-center">
                                                        {!file?.is_active ? (
                                                            <div className="flex space-x-2">
                                                                <button
                                                                    onClick={() => handleSetActive(file?.id, content)}
                                                                    className="inline-flex items-center px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-200"
                                                                >
                                                                    Set Active
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteModal({
                                                                        isOpen: true,
                                                                        fileId: file?.id,
                                                                        fileName: file?.file_name,
                                                                        content: content
                                                                    })}
                                                                    className="inline-flex items-center px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-200"
                                                                >
                                                                    <HiTrash className="w-4 h-4 mr-1" />
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                className="inline-flex items-center px-3 py-1 text-sm bg-gray-300 text-gray-500 rounded cursor-not-allowed"
                                                                disabled
                                                                title="File aktif tidak dapat dihapus"
                                                            >
                                                                <HiTrash className="w-4 h-4 mr-1" />
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>

                            </table>
                        </div>
                    </div>
                </div>
                {!loading && files[content]?.data?.length > 0 && (
                    <div className="px-4 md:px-16 py-3 flex flex-col md:flex-row items-center justify-between border-t border-gray-200">
                        <div className="text-sm text-gray-700 mb-4 md:mb-0">
                            Showing {((files[content].current_page - 1) * files[content].per_page) + 1} to{' '}
                            {Math.min(files[content].current_page * files[content].per_page, files[content].total)} of{' '}
                            {files[content].total} results
                        </div>
                        <div className="flex flex-wrap justify-center gap-2">
                            <button
                                onClick={() => handlePageChange(content, files[content].current_page - 1)}
                                disabled={files[content].current_page === 1}
                                className={`px-3 py-1 rounded-md ${files[content].current_page === 1
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}
                            >
                                <HiChevronLeft className="w-5 h-5" />
                            </button>
                            {[...Array(files[content].last_page)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handlePageChange(content, index + 1)}
                                    className={`px-3 py-1 rounded-md ${files[content].current_page === index + 1
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(content, files[content].current_page + 1)}
                                disabled={files[content].current_page === files[content].last_page}
                                className={`px-3 py-1 rounded-md ${files[content].current_page === files[content].last_page
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 border'}`}
                            >
                                <HiChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    const DeleteConfirmationModal = () => {
        if (!deleteModal.isOpen) return null;

        return (
            <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="fixed inset-0 bg-black opacity-30"></div>

                <div className="flex items-center justify-center min-h-screen">
                    <div className="relative bg-white w-full max-w-md p-6 mx-4 rounded-lg shadow-xl">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
                            <HiExclamation className="w-6 h-6 text-red-600" />
                        </div>

                        <h3 className="mt-3 text-lg font-medium text-center text-gray-900">
                            Konfirmasi Hapus File
                        </h3>

                        <p className="mt-2 text-sm text-center text-gray-500">
                            Apakah Anda yakin ingin menghapus file <span className="font-medium">{deleteModal.fileName}</span>?
                            <br />Aksi ini tidak dapat dibatalkan.
                        </p>

                        <div className="mt-4 flex justify-end space-x-3">
                            <button
                                type="button"
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                                onClick={() => setDeleteModal({ isOpen: false, fileId: null, fileName: '', content: null })}
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                                onClick={handleDelete}
                            >
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <SidebarComponent
                onCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)}
            />

            <main className={`flex-1 overflow-x-hidden transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'}`}>
                <div className="px-4 md:px-6 py-6 w-full">
                    {/* Header */}
                    <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">File Management</h1>
                                <p className="text-gray-500">Upload dan manage data yang akan direpresentasikan</p>
                            </div>
                            <img src="/images/Bank_BJB_logo.svg" alt="Bank BJB Logo" className="h-8 md:h-10 self-center md:self-auto" />
                        </div>
                    </div>

                    {/* One-time fetch button */}
                    <div>
                        {fetchButton(isDataFetched)}
                    </div>

                    {/* Content */}
                    <FileSection
                        title="Main (Pencapaian dan Konsolidasi) Files"
                        content="main"
                        files={files}
                        loading={loading}
                    />

                    <FileSection
                        title="QRIS Merchant Files"
                        content="qris_merchant"
                        files={files}
                        loading={loading}
                    />

                </div>
                <DeleteConfirmationModal />
            </main>
        </div>
    );
};

export default File;