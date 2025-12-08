"use client";

import { Bell, Search, User } from "lucide-react";
import { useCriticalAlerts } from "@/store/hooks";

interface HeaderProps {
    title: string;
    subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
    const criticalAlerts = useCriticalAlerts();

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            {/* Title */}
            <div>
                <h1 className="text-xl font-bold text-gray-900">{title}</h1>
                {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {/* Search */}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Search className="w-5 h-5 text-gray-600" />
                </button>

                {/* Notifications */}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    {criticalAlerts.length > 0 && (
                        <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full"></span>
                    )}
                </button>

                {/* User Profile */}
                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                </button>
            </div>
        </header>
    );
}
