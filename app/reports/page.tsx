"use client";

import { useState } from "react";
import { MessageSquare, MapPin, Camera, Send, Filter } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import MapContainer from "@/components/map/MapContainer";
import MapFlyToHandler from "@/components/map/MapFlyToHandler";
import ReportMarkers from "@/components/map/ReportMarkers";
import { useFilteredReports, useReportFilter } from "@/store/hooks";
import { Report, ReportCategory, ReportStatus } from "@/types";
import { getReportStatusColor, formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/cn";

const categories: { value: ReportCategory; label: string }[] = [
    { value: "infrastructure", label: "Infrastructure" },
    { value: "flood", label: "Flood" },
    { value: "crime", label: "Crime" },
    { value: "waste", label: "Waste" },
    { value: "traffic", label: "Traffic" },
    { value: "other", label: "Other" },
];

const statuses: { value: ReportStatus | "all"; label: string }[] = [
    { value: "all", label: "All Reports" },
    { value: "submitted", label: "Submitted" },
    { value: "verified", label: "Verified" },
    { value: "in_progress", label: "In Progress" },
    { value: "resolved", label: "Resolved" },
    { value: "rejected", label: "Rejected" },
];

export default function ReportsPage() {
    const reports = useFilteredReports();
    const [filter, setFilter] = useReportFilter();
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "infrastructure" as ReportCategory,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO: Submit report
        console.log("Submit report:", formData);
        setShowForm(false);
        setFormData({ title: "", description: "", category: "infrastructure" });
    };

    const handleReportClick = (report: Report) => {
        setSelectedReport(report);
    };

    return (
        <MainLayout title="Citizen Reports" subtitle="Submit and track community reports">
            <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
                    {/* Submit Button */}
                    <div className="p-4 border-b border-gray-200">
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Send className="w-5 h-5" />
                            Submit New Report
                        </button>
                    </div>

                    {/* Submission Form */}
                    {showForm && (
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        placeholder="Brief description of the issue"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as ReportCategory })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        rows={3}
                                        placeholder="Detailed description of the issue"
                                        required
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Filter */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-semibold text-gray-700">Filter by Status</span>
                        </div>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {statuses.map(status => (
                                <option key={status.value} value={status.value}>{status.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Reports List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {reports.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p>No reports found</p>
                            </div>
                        ) : (
                            reports.map(report => {
                                const statusColor = getReportStatusColor(report.status);
                                return (
                                    <div
                                        key={report.id}
                                        onClick={() => handleReportClick(report)}
                                        className={`p-4 rounded-lg transition-colors cursor-pointer ${selectedReport?.id === report.id
                                                ? "bg-primary-50 border border-primary-200"
                                                : "bg-gray-50 hover:bg-gray-100"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-semibold text-gray-900 text-sm flex-1">
                                                {report.title}
                                            </h4>
                                            <span
                                                className="text-xs font-medium px-2 py-1 rounded"
                                                style={{
                                                    backgroundColor: statusColor + "20",
                                                    color: statusColor,
                                                }}
                                            >
                                                {report.status.replace("_", " ")}
                                            </span>
                                        </div>

                                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                                            {report.description}
                                        </p>

                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                <span>{report.address}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                                            <span>{report.reporterName}</span>
                                            <span>{formatRelativeTime(report.createdAt)}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Map Area */}
                <div className="flex-1 relative">
                    <MapContainer center={{ lat: -6.2088, lng: 106.8456 }} zoom={11}>
                        <ReportMarkers
                            reports={reports}
                            onReportClick={handleReportClick}
                        />
                        <MapFlyToHandler
                            coordinates={selectedReport?.coordinates ?? null}
                            zoom={16}
                        />
                    </MapContainer>
                </div>
            </div>
        </MainLayout>
    );
}

