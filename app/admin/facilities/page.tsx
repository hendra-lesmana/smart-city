"use client";

import { useState } from "react";
import {
    Building2, Search, Plus, Edit2, Trash2, MapPin, Phone,
    School, Heart, Church, Dumbbell, TreePine, Filter, X, Check
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { useAtom } from "jotai";
import { facilitiesAtom } from "@/store/atoms";
import { Facility, FacilityCategory } from "@/types";

const categoryIcons: Record<FacilityCategory, any> = {
    education: School,
    health: Heart,
    worship: Church,
    government: Building2,
    sports: Dumbbell,
    park: TreePine,
    other: Building2,
};

const categoryColors: Record<FacilityCategory, string> = {
    education: "bg-blue-100 text-blue-700",
    health: "bg-red-100 text-red-700",
    worship: "bg-purple-100 text-purple-700",
    government: "bg-amber-100 text-amber-700",
    sports: "bg-emerald-100 text-emerald-700",
    park: "bg-green-100 text-green-700",
    other: "bg-gray-100 text-gray-700",
};

const categories: FacilityCategory[] = ["education", "health", "worship", "government", "sports", "park", "other"];

export default function AdminFacilitiesPage() {
    const [facilities, setFacilities] = useAtom(facilitiesAtom);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Filter facilities
    const filteredFacilities = facilities.filter(facility => {
        const matchesSearch = facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            facility.address.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || facility.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    // Stats
    const stats = categories.map(cat => ({
        category: cat,
        count: facilities.filter(f => f.category === cat).length
    }));

    const handleDelete = (id: string) => {
        setFacilities(prev => prev.filter(f => f.id !== id));
        setDeleteConfirm(null);
    };

    return (
        <MainLayout title="Manage Facilities" subtitle="Add, edit, and manage public facilities">
            <div className="p-6 overflow-y-auto h-full bg-gray-50">
                {/* Header Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
                    {stats.map(stat => {
                        const Icon = categoryIcons[stat.category];
                        return (
                            <div
                                key={stat.category}
                                onClick={() => setCategoryFilter(categoryFilter === stat.category ? "all" : stat.category)}
                                className={`p-4 rounded-lg cursor-pointer transition-all ${categoryFilter === stat.category
                                        ? "bg-primary-100 border-2 border-primary-500"
                                        : "bg-white border-2 border-transparent hover:border-gray-200"
                                    }`}
                            >
                                <Icon className={`w-6 h-6 mb-2 ${categoryFilter === stat.category ? "text-primary-600" : "text-gray-500"}`} />
                                <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
                                <div className="text-xs text-gray-500 capitalize">{stat.category}</div>
                            </div>
                        );
                    })}
                </div>

                {/* Actions Bar */}
                <div className="bg-white rounded-lg shadow-card p-4 mb-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="flex-1 flex gap-4 w-full md:w-auto">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search facilities..."
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
                                        <option key={cat} value={cat} className="capitalize">{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            Add Facility
                        </button>
                    </div>
                </div>

                {/* Facilities Table */}
                <div className="bg-white rounded-lg shadow-card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Facility</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Address</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Coordinates</th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredFacilities.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                            <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                            <p>No facilities found</p>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredFacilities.map(facility => {
                                        const Icon = categoryIcons[facility.category];
                                        return (
                                            <tr key={facility.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColors[facility.category]}`}>
                                                            <Icon className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900">{facility.name}</div>
                                                            <div className="text-xs text-gray-500">{facility.id}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${categoryColors[facility.category]}`}>
                                                        {facility.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-start gap-2 text-sm text-gray-600">
                                                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                        <span className="line-clamp-2">{facility.address}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {facility.phone ? (
                                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                                            <Phone className="w-4 h-4" />
                                                            {facility.phone}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">-</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-xs text-gray-500 font-mono">
                                                        {facility.coordinates.lat.toFixed(4)}, {facility.coordinates.lng.toFixed(4)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setEditingFacility(facility)}
                                                            className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 className="w-4 h-4" />
                                                        </button>
                                                        {deleteConfirm === facility.id ? (
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => handleDelete(facility.id)}
                                                                    className="p-2 text-white bg-danger rounded-lg hover:bg-red-600 transition-colors"
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteConfirm(null)}
                                                                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                                                                >
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setDeleteConfirm(facility.id)}
                                                                className="p-2 text-gray-500 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                            Showing {filteredFacilities.length} of {facilities.length} facilities
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
