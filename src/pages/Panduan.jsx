import { useState } from "react";
import FileGuideSection from "../components/FileGuideSection";
import SidebarComponent from "../components/SidebarComponent";

const Panduan = () => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            <SidebarComponent
                onCollapse={(collapsed) => setIsSidebarCollapsed(collapsed)}
            />

            <main className={`flex-1 overflow-x-hidden overflow-y-auto transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-64'
                }`}>
                <div className="px-4 md:px-6 py-6 w-full">
                    {/* Header */}
                    <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-0">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Panduan Penggunaan</h1>
                                <p className="text-gray-500">Panduan penggunaan aplikasi dan format file</p>
                            </div>
                            <img
                                src="/images/Bank_BJB_logo.svg"
                                alt="Bank BJB Logo"
                                className="h-8 md:h-10 self-center md:self-auto"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <FileGuideSection />
                </div>
            </main>
        </div>
    );
};

export default Panduan;