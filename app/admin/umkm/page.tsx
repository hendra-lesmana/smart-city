"use client";

import { useState } from "react";
import {
    Store, Search, Plus, Edit2, Trash2, MapPin,
    UtensilsCrossed, ShoppingBag, Wrench, Palette, Laptop,
    Filter, X, Check, Star, BadgeCheck
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { useAtom } from "jotai";
import { umkmAtom } from "@/store/atoms";
import { UMKM, UMKMCategory } from "@/types";

const categoryIcons: Record<UMKMCategory, any> = {
    food: UtensilsCrossed,
    retail: ShoppingBag,
    services: Wrench,
    crafts: Palette,
    technology: Laptop,
    other: Store,
};

const categoryColors: Record<UMKMCategory, string> = {
    food: "bg-amber-100 text-amber-700",
    retail: "bg-blue-100 text-blue-700",
    services: "bg-purple-100 text-purple-700",
    crafts: "bg-pink-100 text-pink-700",
    technology: "bg-emerald-100 text-emerald-700",
    other: "bg-gray-100 text-gray-700",
};

const categories: UMKMCategory[] = ["food", "retail", "services", "crafts", "technology", "other"];

export default function AdminUMKMPage() {
    const [businesses, setBusinesses] = useAtom(umkmAtom);
    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [verifiedFilter, setVerifiedFilter] = useState<string>("all");
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Filter businesses
    const filteredBusinesses = businesses.filter(business => {
        const matchesSearch = business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            business.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = categoryFilter === "all" || business.category === categoryFilter;
        const matchesVerified = verifiedFilter === "all" ||
            (verifiedFilter === "verified" && business.isVerified) ||
            (verifiedFilter === "unverified" && !business.isVerified);
        return matchesSearch && matchesCategory && matchesVerified;
    });

    // Stats
    const totalBusinesses = businesses.length;
    const verifiedCount = businesses.filter(b => b.isVerified).length;
    const avgRating = businesses.reduce((sum, b) => sum + (b.rating || 0), 0) / businesses.length;

    const handleDelete = (id: string) => {
        setBusinesses(prev => prev.filter(b => b.id !== id));
        setDeleteConfirm(null);
    };

    const handleToggleVerify = (id: string) => {
        setBusinesses(prev => prev.map(b =>
            b.id === id ? { ...b, isVerified: !b.isVerified } : b
        ));
    };

    return (
        <MainLayout title="Manage UMKM" subtitle="Add, edit, and verify small businesses">
            <div className="p-6 overflow-y-auto h-full bg-gray-50">
                {/* Header Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 shadow-card">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <Store className="w-6 h-6 text-primary-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{totalBusinesses}</div>
                                <div className="text-sm text-gray-500">Total Businesses</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-card">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-success bg-opacity-10 rounded-lg flex items-center justify-center">
                                <BadgeCheck className="w-6 h-6 text-success" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{verifiedCount}</div>
                                <div className="text-sm text-gray-500">Verified</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-card">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-warning bg-opacity-10 rounded-lg flex items-center justify-center">
                                <Star className="w-6 h-6 text-warning" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</div>
                                <div className="text-sm text-gray-500">Avg Rating</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-card">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                                <UtensilsCrossed className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {businesses.filter(b => b.category === "food").length}
                                </div>
                                <div className="text-sm text-gray-500">Food & Beverage</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <button
                        onClick={() => setCategoryFilter("all")}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${categoryFilter === "all"
                                ? "bg-primary-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100"
                            }`}
                    >
                        All ({totalBusinesses})
                    </button>
                    {categories.map(cat => {
                        const count = businesses.filter(b => b.category === cat).length;
                        const Icon = categoryIcons[cat];
                        return (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(categoryFilter === cat ? "all" : cat)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${categoryFilter === cat
                                        ? "bg-primary-600 text-white"
                                        : "bg-white text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="capitalize">{cat}</span>
                                <span className="opacity-70">({count})</span>
                            </button>
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
                                    placeholder="Search businesses..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            {/* Verified Filter */}
                            <select
                                value={verifiedFilter}
                                onChange={(e) => setVerifiedFilter(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                            >
                                <option value="all">All Status</option>
                                <option value="verified">Verified Only</option>
                                <option value="unverified">Unverified</option>
                            </select>
                        </div>

                        {/* Add Button */}
                        <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                            <Plus className="w-5 h-5" />
                            Add Business
                        </button>
                    </div>
                </div>

                {/* Business Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBusinesses.length === 0 ? (
                        <div className="col-span-full bg-white rounded-lg p-12 text-center">
                            <Store className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                            <p className="text-gray-500">No businesses found</p>
                        </div>
                    ) : (
                        filteredBusinesses.map(business => {
                            const Icon = categoryIcons[business.category];
                            return (
                                <div key={business.id} className="bg-white rounded-lg shadow-card overflow-hidden hover:shadow-lg transition-shadow">
                                    {/* Header */}
                                    <div className={`p-4 ${categoryColors[business.category]} bg-opacity-30`}>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${categoryColors[business.category]}`}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-semibold text-gray-900">{business.name}</h3>
                                                        {business.isVerified && (
                                                            <BadgeCheck className="w-4 h-4 text-success" />
                                                        )}
                                                    </div>
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[business.category]}`}>
                                                        {business.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{business.description}</p>

                                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                            <MapPin className="w-4 h-4" />
                                            <span className="line-clamp-1">{business.address}</span>
                                        </div>

                                        {business.rating && (
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-warning fill-warning" />
                                                    <span className="font-semibold text-gray-900">{business.rating.toFixed(1)}</span>
                                                </div>
                                                <span className="text-sm text-gray-500">({business.reviewCount} reviews)</span>
                                            </div>
                                        )}

                                        <div className="text-xs text-gray-500 mb-4">
                                            Hours: {business.openingHours}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                                        <button
                                            onClick={() => handleToggleVerify(business.id)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${business.isVerified
                                                    ? "bg-success bg-opacity-10 text-success hover:bg-opacity-20"
                                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                }`}
                                        >
                                            {business.isVerified ? "✓ Verified" : "Mark Verified"}
                                        </button>
                                        <div className="flex items-center gap-1">
                                            <button className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            {deleteConfirm === business.id ? (
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => handleDelete(business.id)}
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
                                                    onClick={() => setDeleteConfirm(business.id)}
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

                {/* Footer Stats */}
                <div className="mt-6 text-center text-sm text-gray-500">
                    Showing {filteredBusinesses.length} of {businesses.length} businesses
                </div>
            </div>
        </MainLayout>
    );
}
