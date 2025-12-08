"use client";

import Link from "next/link";
import {
    LayoutDashboard, Building2, Store, MessageSquare, Activity, Users,
    AlertTriangle, CheckCircle, Clock, TrendingUp, ChevronRight
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import { useAtomValue } from "jotai";
import { regionsAtom, sensorsAtom, facilitiesAtom, umkmAtom, reportsAtom } from "@/store/atoms";
import { getReportStatusColor } from "@/lib/utils";

export default function AdminPage() {
    const regions = useAtomValue(regionsAtom);
    const sensors = useAtomValue(sensorsAtom);
    const facilities = useAtomValue(facilitiesAtom);
    const umkm = useAtomValue(umkmAtom);
    const reports = useAtomValue(reportsAtom);

    const activeSensors = sensors.filter(s => s.isOnline).length;
    const warningSensors = sensors.filter(s => s.status === "warning").length;
    const dangerSensors = sensors.filter(s => s.status === "danger").length;
    const pendingReports = reports.filter(r => r.status === "submitted" || r.status === "verified").length;
    const inProgressReports = reports.filter(r => r.status === "in_progress").length;
    const resolvedReports = reports.filter(r => r.status === "resolved").length;
    const totalPopulation = regions.reduce((sum, r) => sum + r.population, 0);
    const verifiedUmkm = umkm.filter(u => u.isVerified).length;

    const quickActions = [
        {
            icon: Building2,
            label: "Manage Facilities",
            href: "/admin/facilities",
            count: facilities.length,
            color: "text-blue-600 bg-blue-100"
        },
        {
            icon: Store,
            label: "Manage UMKM",
            href: "/admin/umkm",
            count: umkm.length,
            color: "text-amber-600 bg-amber-100"
        },
        {
            icon: MessageSquare,
            label: "Review Reports",
            href: "/admin/reports",
            count: pendingReports,
            badge: pendingReports > 0 ? "Pending" : undefined,
            color: "text-purple-600 bg-purple-100"
        },
        {
            icon: Activity,
            label: "Monitor Sensors",
            href: "/admin/sensors",
            count: sensors.length,
            badge: dangerSensors > 0 ? `${dangerSensors} Alert` : undefined,
            badgeColor: "bg-danger",
            color: "text-emerald-600 bg-emerald-100"
        },
    ];

    return (
        <MainLayout title="Admin Dashboard" subtitle="System management and analytics">
            <div className="p-6 overflow-y-auto h-full bg-gray-50">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatsCard
                        title="Total Population"
                        value={totalPopulation}
                        icon={<Users className="w-6 h-6" />}
                        unit="people"
                    />
                    <StatsCard
                        title="Active Sensors"
                        value={activeSensors}
                        icon={<Activity className="w-6 h-6" />}
                        unit={`of ${sensors.length}`}
                        trend={dangerSensors > 0 ? { value: dangerSensors, isPositive: false } : undefined}
                    />
                    <StatsCard
                        title="Public Facilities"
                        value={facilities.length}
                        icon={<Building2 className="w-6 h-6" />}
                    />
                    <StatsCard
                        title="UMKM Registered"
                        value={umkm.length}
                        icon={<Store className="w-6 h-6" />}
                        unit={`${verifiedUmkm} verified`}
                    />
                </div>

                {/* Alerts Section */}
                {(dangerSensors > 0 || warningSensors > 0) && (
                    <div className="bg-danger bg-opacity-10 border border-danger border-opacity-20 rounded-lg p-4 mb-8">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-6 h-6 text-danger" />
                            <div>
                                <h3 className="font-semibold text-danger">Sensor Alerts</h3>
                                <p className="text-sm text-gray-700">
                                    {dangerSensors > 0 && <span className="text-danger font-medium">{dangerSensors} danger</span>}
                                    {dangerSensors > 0 && warningSensors > 0 && " and "}
                                    {warningSensors > 0 && <span className="text-warning font-medium">{warningSensors} warning</span>}
                                    {" sensors require attention."}
                                </p>
                            </div>
                            <Link
                                href="/admin/sensors"
                                className="ml-auto px-4 py-2 bg-danger text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                            >
                                View Sensors
                            </Link>
                        </div>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-card p-6 mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map(action => (
                            <Link
                                key={action.href}
                                href={action.href}
                                className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all group relative"
                            >
                                {action.badge && (
                                    <span className={`absolute -top-2 -right-2 px-2 py-0.5 text-xs font-medium text-white rounded-full ${action.badgeColor || "bg-primary-500"}`}>
                                        {action.badge}
                                    </span>
                                )}
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3 ${action.color}`}>
                                    <action.icon className="w-6 h-6" />
                                </div>
                                <span className="text-sm font-medium text-gray-700 block text-center">{action.label}</span>
                                <span className="text-xs text-gray-500 block text-center mt-1">{action.count} items</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Reports */}
                    <div className="bg-white rounded-lg shadow-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Recent Reports</h2>
                            <Link
                                href="/admin/reports"
                                className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1"
                            >
                                View All
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Report Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <div className="bg-amber-50 rounded-lg p-3 text-center">
                                <div className="text-xl font-bold text-amber-600">{pendingReports}</div>
                                <div className="text-xs text-amber-700">Pending</div>
                            </div>
                            <div className="bg-blue-50 rounded-lg p-3 text-center">
                                <div className="text-xl font-bold text-blue-600">{inProgressReports}</div>
                                <div className="text-xs text-blue-700">In Progress</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3 text-center">
                                <div className="text-xl font-bold text-green-600">{resolvedReports}</div>
                                <div className="text-xs text-green-700">Resolved</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {reports.slice(0, 5).map(report => {
                                const statusColor = getReportStatusColor(report.status);
                                return (
                                    <div
                                        key={report.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-semibold text-sm text-gray-900 truncate">{report.title}</h4>
                                            <p className="text-xs text-gray-600 mt-1">{report.reporterName} • {report.address}</p>
                                        </div>
                                        <span
                                            className="text-xs font-medium px-3 py-1 rounded-full ml-3"
                                            style={{
                                                backgroundColor: statusColor + "20",
                                                color: statusColor
                                            }}
                                        >
                                            {report.status.replace("_", " ")}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sensor Overview */}
                    <div className="bg-white rounded-lg shadow-card p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-900">Sensor Overview</h2>
                            <Link
                                href="/admin/sensors"
                                className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1"
                            >
                                View All
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {/* Sensor Stats */}
                        <div className="grid grid-cols-4 gap-3 mb-4">
                            <div className="text-center">
                                <div className="text-xl font-bold text-success">{sensors.filter(s => s.status === "online").length}</div>
                                <div className="text-xs text-gray-500">Normal</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-warning">{warningSensors}</div>
                                <div className="text-xs text-gray-500">Warning</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-danger">{dangerSensors}</div>
                                <div className="text-xs text-gray-500">Danger</div>
                            </div>
                            <div className="text-center">
                                <div className="text-xl font-bold text-gray-400">{sensors.filter(s => !s.isOnline).length}</div>
                                <div className="text-xs text-gray-500">Offline</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {sensors
                                .filter(s => s.status === "danger" || s.status === "warning")
                                .slice(0, 5)
                                .map(sensor => {
                                    const statusColor = sensor.status === "danger" ? "#ef4444" : "#f59e0b";
                                    return (
                                        <div
                                            key={sensor.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: statusColor }}
                                                />
                                                <div>
                                                    <h4 className="font-semibold text-sm text-gray-900">{sensor.name}</h4>
                                                    <p className="text-xs text-gray-600">{sensor.type.replace("_", " ")}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold" style={{ color: statusColor }}>
                                                    {sensor.currentReading.value} {sensor.currentReading.unit}
                                                </div>
                                                <div className="text-xs text-gray-500 capitalize">{sensor.status}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            {sensors.filter(s => s.status === "danger" || s.status === "warning").length === 0 && (
                                <div className="text-center py-6 text-gray-500">
                                    <CheckCircle className="w-10 h-10 mx-auto mb-2 text-success" />
                                    <p className="text-sm">All sensors operating normally</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

