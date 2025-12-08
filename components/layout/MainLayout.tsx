"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";

interface MainLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

export default function MainLayout({ children, title, subtitle }: MainLayoutProps) {
    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 ml-20">
                <Header title={title} subtitle={subtitle} />
                <main className="h-[calc(100vh-4rem)]">{children}</main>
            </div>
        </div>
    );
}
