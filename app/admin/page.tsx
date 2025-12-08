"use client";

import { LayoutDashboard, Building2, Store, MessageSquare, Activity, Users } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import StatsCard from "@/components/dashboard/StatsCard";
import { useAtomValue } from "jotai";
import { regionsAtom, sensorsAtom, facilitiesAtom, umkmAtom, reportsAtom } from "@/store/atoms";

export default function AdminPage() {
    const regions = useAtomValue(regionsAtom);
    const sensors = useAtomValue(sensorsAtom);
    const facilities = useAtomValue(facilitiesAtom);
    const umkm = useAtomValue(umkmAtom);
    const reports = useAtomValue(reportsAtom);

    const activeSensors = sensors.filter(s => s.isOnline).length;
    const pendingReports = reports.filter(r => r.status === "submitted" || r.status === "verified").length;
    const totalPopulation = regions.reduce((sum, r) => sum + r.population, 0);

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
                    />
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-card p-6 mb-8">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                            <Building2 className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-700">Manage Facilities</span>
                        </button>
                        <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                            <Store className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-700">Manage UMKM</span>
                        </button>
                        <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                            <MessageSquare className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-700">Review Reports</span>
                        </button>
                        <button className="p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all">
                            <Activity className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                            <span className="text-sm font-medium text-gray-700">Monitor Sensors</span>
                        </button>
                    </div>
                </div>

                {/* Recent Reports */}
                <div className="bg-white rounded-lg shadow-card p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-900">Recent Reports</h2>
                        <span className="text-sm text-primary-600 font-medium cursor-pointer hover:underline">
                            View All
                        </span>
                    </div>
                    <div className="space-y-3">
                        {reports.slice(0, 5).map(report => (
                            <div
                                key={report.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex-1">
                                    <h4 className="font-semibold text-sm text-gray-900">{report.title}</h4>
                                    <p className="text-xs text-gray-600 mt-1">{report.reporterName} • {report.address}</p>
                                </div>
                                <span className={`text-xs font-medium px-3 py-1 rounded ${report.status === "resolved" ? "bg-success text-white" :
                                        report.status === "in_progress" ? "bg-warning text-white" :
                                            "bg-primary-100 text-primary-700"
                                    }`}>
                                    {report.status.replace("_", " ")}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
