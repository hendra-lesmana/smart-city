"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    AlertTriangle,
    Building2,
    Store,
    MessageSquare,
    Settings,
} from "lucide-react";
import { cn } from "@/lib/cn";

const navigation = [
    { name: "Home", href: "/", icon: Home },
    { name: "Early Warning", href: "/early-warning", icon: AlertTriangle },
    { name: "Facilities", href: "/facilities", icon: Building2 },
    { name: "UMKM", href: "/umkm", icon: Store },
    { name: "Reports", href: "/reports", icon: MessageSquare },
    { name: "Admin", href: "/admin", icon: Settings },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-20 bg-sidebar flex flex-col items-center py-6 z-50">
            {/* Logo */}
            <div className="mb-8">
                <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    GIS
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-2 w-full">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "sidebar-nav-item",
                                isActive && "active"
                            )}
                            title={item.name}
                        >
                            <Icon className="w-6 h-6" />
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
