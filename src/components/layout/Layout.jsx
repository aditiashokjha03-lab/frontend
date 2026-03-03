import React from 'react';
import Navbar from './Navbar';
import { useOffline } from '../../context/OfflineContext';

const Layout = ({ children }) => {
    const { isOnline } = useOffline();

    return (
        <div className="min-h-screen bg-transparent text-foreground flex flex-col md:flex-row">
            <Navbar />

            <main className="flex-1 md:ml-64 pb-8 md:pb-0 min-h-screen overflow-x-hidden relative">
                {!isOnline && (
                    <div className="w-full bg-red-500 text-white text-xs font-semibold py-1.5 px-4 text-center sticky top-0 z-30 shadow-md flex justify-center items-center gap-2">
                        No internet connection. Changes saved locally.
                    </div>
                )}
                <div className="p-4 md:p-8 animate-in fade-in zoom-in-95 duration-200">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
