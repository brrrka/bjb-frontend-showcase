import { HiDownload, HiInformationCircle } from 'react-icons/hi';

const FileGuideSection = () => {
    const downloadTemplate = async (fileType) => {
        try {
            const templatePath = `/templates/template_${fileType}.xlsx`;
            const response = await fetch(templatePath);
            const blob = await response.blob();

            const filename = fileType === 'main' ? 'template_main.xlsx' : 'template_qris.xlsx';

            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading template:', error);
            // Handle error appropriately
        }
    };

    return (
        <div className="space-y-6 mb-8">
            {/* Main Files Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <HiInformationCircle className="w-5 h-5 mr-2 text-blue-500" />
                        Panduan File Main (Pencapaian dan Konsolidasi)
                    </h2>
                </div>

                <div className="p-4">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Format File yang Didukung:</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                <li>Excel (.xlsx, .xls)</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Struktur File:</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">File harus memenuhi kriteria berikut:</p>
                                <ul className="list-disc list-inside space-y-1 mt-2 text-gray-600">
                                    <li>Menggunakan template yang sama persis dengan yang telah disediakan (unduh dibawah)</li>
                                    <li>Sheet yang berisi data konsolidasi harus diberi nama &apos;KONSOL&apos;</li>
                                    <li>Sheet yang berisi data pencapaian kanwil harus diberi nama &apos;KANWIL&apos;</li>
                                    <li>Urutan sheet tidak diperhitungkan, pencarian sheet dilakukan dengan nama sheet</li>
                                    <li>Penamaan File excel tidak berpengaruh pada pembacaan data</li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Cara Menggunakan Template:</h3>
                            <ol className="list-decimal list-inside space-y-2 text-gray-600">
                                <li>Download template Excel di bawah ini</li>
                                <li>Isi data sesuai format yang tersedia</li>
                                <li>Simpan file</li>
                                <li>Upload file melalui section di &apos;Files&apos;</li>
                            </ol>
                            <button
                                onClick={() => downloadTemplate('main')}
                                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <HiDownload className="w-5 h-5 mr-2" />
                                Download Template Main
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* QRIS Merchant Files Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                        <HiInformationCircle className="w-5 h-5 mr-2 text-blue-500" />
                        Panduan File QRIS Merchant
                    </h2>
                </div>

                <div className="p-4">
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold mb-2">Format File yang Didukung:</h3>
                            <ul className="list-disc list-inside space-y-1 text-gray-600">
                                <li>Excel (.xlsx, .xls)</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Struktur File:</h3>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-600">File harus memenuhi kriteria berikut:</p>
                                <ul className="list-disc list-inside space-y-1 mt-2 text-gray-600">
                                    <li>Menggunakan template yang sama persis dengan yang telah disediakan (unduh dibawah)</li>
                                    <li>Tidak boleh ada sheet lain pada file Qris Merchant</li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-2">Cara Menggunakan Template:</h3>
                            <ol className="list-decimal list-inside space-y-2 text-gray-600">
                                <li>Download template Excel di bawah ini</li>
                                <li>Isi data sesuai format yang tersedia</li>
                                <li>Simpan file</li>
                                <li>Upload file melalui section di &apos;Files&apos;</li>
                            </ol>
                            <button
                                onClick={() => downloadTemplate('qris')}
                                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <HiDownload className="w-5 h-5 mr-2" />
                                Download Template QRIS
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileGuideSection;