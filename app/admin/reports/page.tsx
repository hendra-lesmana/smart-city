"use client";

import { useState } from "react";
import {
    MessageSquare, Search, Filter, MapPin, Clock, User,
    CheckCircle, XCircle, AlertCircle, Loader2, Eye, Trash2, X, Check
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { useAtom } from "jotai";
import { reportsAtom } from "@/store/atoms";
import { Report, ReportStatus, ReportCategory } from "@/types";
import { formatRelativeTime, getReportStatusColor } from "@/lib/utils";

const statusIcons: Record<ReportStatus, any> = {
    submitted: AlertCircle,
    verified: CheckCircle,
    in_progress: Loader2,
    resolved: CheckCircle,
    rejected: XCircle,
};

const statusLabels: Record<ReportStatus, string> = {
    submitted: "Submitted",
    verified: "Verified",
    in_progress: "In Progress",
    resolved: "Resolved",
    rejected: "Rejected",
};

const categoryLabels: Record<ReportCategory, string> = {
    infrastructure: "Infrastructure",
    flood: "Flood",
    crime: "Crime",
    waste: "Waste",
    traffic: "Traffic",
    other: "Other",
};

const statuses: ReportStatus[] = ["submitted", "verified", "in_progress", "resolved", "rejected"];
const categories: ReportCategory[] = ["infrastructure", "flood", "crime", "waste", "traffic", "other"];

export default function AdminReportsPage() {
    const [reports, setReports] = useAtom(reportsAtom);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Filter reports
    const filteredReports = reports.filter(report => {
        const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            report.reporterName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || report.status === statusFilter;
        const matchesCategory = categoryFilter === "all" || report.category === categoryFilter;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    // Stats
    const statusCounts = statuses.reduce((acc, status) => {
        acc[status] = reports.filter(r => r.status === status).length;
        return acc;
    }, {} as Record<ReportStatus, number>);

    const handleStatusChange = (reportId: string, newStatus: ReportStatus) => {
        setReports(prev => prev.map(r =>
            r.id === reportId ? { ...r, status: newStatus } : r
        ));
    };

    const handleDelete = (id: string) => {
        setReports(prev => prev.filter(r => r.id !== id));
        setDeleteConfirm(null);
        if (selectedReport?.id === id) {
            setSelectedReport(null);
        }
    };

    return (
        <MainLayout title="Manage Reports" subtitle="Review and process citizen reports">
            <div className="flex h-full bg-gray-50">
                {/* Main Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {/* Status Tabs */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        <button
                            onClick={() => setStatusFilter("all")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${statusFilter === "all"
                                    ? "bg-primary-600 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            All ({reports.length})
                        </button>
                        {statuses.map(status => {
                            const color = getReportStatusColor(status);
                            const Icon = statusIcons[status];
                            return (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(statusFilter === status ? "all" : status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${statusFilter === status
                                            ? "text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-100"
                                        }`}
                                    style={statusFilter === status ? { backgroundColor: color } : {}}
                                >
                                    <Icon className="w-4 h-4" />
                                    {statusLabels[status]} ({statusCounts[status]})
                                </button>
                            );
                        })}
                    </div>

                    {/* Filters Bar */}
                    <div className="bg-white rounded-lg shadow-card p-4 mb-6">
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search reports..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            {/* Category Filter */}
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{categoryLabels[cat]}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Reports List */}
                    <div className="space-y-3">
                        {filteredReports.length === 0 ? (
                            <div className="bg-white rounded-lg p-12 text-center">
                                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p className="text-gray-500">No reports found</p>
                            </div>
                        ) : (
                            filteredReports.map(report => {
                                const statusColor = getReportStatusColor(report.status);
                                const StatusIcon = statusIcons[report.status];
                                return (
                                    <div
                                        key={report.id}
                                        className={`bg-white rounded-lg shadow-card overflow-hidden transition-all cursor-pointer hover:shadow-lg ${selectedReport?.id === report.id ? "ring-2 ring-primary-500" : ""
                                            }`}
                                        onClick={() => setSelectedReport(report)}
                                    >
                                        <div className="p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h3 className="font-semibold text-gray-900 truncate">{report.title}</h3>
                                                        <span
                                                            className="px-2 py-0.5 rounded-full text-xs font-medium"
                                                            style={{
                                                                backgroundColor: statusColor + "20",
                                                                color: statusColor
                                                            }}
                                                        >
                                                            {statusLabels[report.status]}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{report.description}</p>
                                                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                                                        <div className="flex items-center gap-1">
                                                            <User className="w-3 h-3" />
                                                            {report.reporterName}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" />
                                                            {report.address}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {formatRelativeTime(report.createdAt)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                                        {categoryLabels[report.category]}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">Change status:</span>
                                                <div className="flex gap-1">
                                                    {statuses.filter(s => s !== report.status).slice(0, 3).map(status => (
                                                        <button
                                                            key={status}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleStatusChange(report.id, status);
                                                            }}
                                                            className="px-2 py-1 text-xs rounded hover:opacity-80 transition-opacity"
                                                            style={{
                                                                backgroundColor: getReportStatusColor(status) + "20",
                                                                color: getReportStatusColor(status)
                                                            }}
                                                        >
                                                            {statusLabels[status]}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedReport(report);
                                                    }}
                                                    className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {deleteConfirm === report.id ? (
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDelete(report.id);
                                                            }}
                                                            className="p-2 text-white bg-danger rounded-lg hover:bg-red-600 transition-colors"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setDeleteConfirm(null);
                                                            }}
                                                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDeleteConfirm(report.id);
                                                        }}
                                                        className="p-2 text-gray-500 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center text-sm text-gray-500">
                        Showing {filteredReports.length} of {reports.length} reports
                    </div>
                </div>

                {/* Detail Panel */}
                {selectedReport && (
                    <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-lg text-gray-900">Report Details</h2>
                            <button
                                onClick={() => setSelectedReport(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Status */}
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">Status</label>
                                <div
                                    className="mt-1 px-3 py-2 rounded-lg text-sm font-medium inline-block"
                                    style={{
                                        backgroundColor: getReportStatusColor(selectedReport.status) + "20",
                                        color: getReportStatusColor(selectedReport.status)
                                    }}
                                >
                                    {statusLabels[selectedReport.status]}
                                </div>
                            </div>

                            {/* Title */}
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">Title</label>
                                <p className="mt-1 text-gray-900 font-semibold">{selectedReport.title}</p>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">Category</label>
                                <p className="mt-1 text-gray-700">{categoryLabels[selectedReport.category]}</p>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">Description</label>
                                <p className="mt-1 text-gray-700 text-sm">{selectedReport.description}</p>
                            </div>

                            {/* Location */}
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">Location</label>
                                <p className="mt-1 text-gray-700 text-sm">{selectedReport.address}</p>
                                <p className="text-xs text-gray-500 font-mono mt-1">
                                    {selectedReport.coordinates.lat.toFixed(6)}, {selectedReport.coordinates.lng.toFixed(6)}
                                </p>
                            </div>

                            {/* Reporter */}
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">Reporter</label>
                                <p className="mt-1 text-gray-700">{selectedReport.reporterName}</p>
                                <p className="text-xs text-gray-500">{selectedReport.reporterPhone}</p>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="text-xs font-medium text-gray-500 uppercase">Submitted</label>
                                <p className="mt-1 text-gray-700 text-sm">
                                    {selectedReport.createdAt.toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t border-gray-200">
                                <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">Update Status</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {statuses.map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusChange(selectedReport.id, status)}
                                            disabled={selectedReport.status === status}
                                            className={`px-3 py-2 text-xs rounded-lg font-medium transition-colors ${selectedReport.status === status
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "hover:opacity-80"
                                                }`}
                                            style={{
                                                backgroundColor: getReportStatusColor(status) + "20",
                                                color: getReportStatusColor(status)
                                            }}
                                        >
                                            {statusLabels[status]}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
