import { AlertTriangle } from 'lucide-react';

const DummyDataBanner = () => {
    return (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 shadow-sm">
            <div className="flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-800 font-medium">
                    ⚠️ Data yang ditampilkan dalam dashboard ini hanya data dummy untuk keperluan showcase portfolio
                </p>
            </div>
        </div>
    );
};

export default DummyDataBanner;