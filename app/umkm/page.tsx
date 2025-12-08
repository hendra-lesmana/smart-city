"use client";

import { useState } from "react";
import { Search, Store, UtensilsCrossed, ShoppingBag, Wrench, Palette, Laptop } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import MapContainer from "@/components/map/MapContainer";
import MapFlyToHandler from "@/components/map/MapFlyToHandler";
import UMKMMarkers from "@/components/map/UMKMMarkers";
import { useFilteredUMKM, useUMKMFilter } from "@/store/hooks";
import { UMKM, UMKMCategory } from "@/types";

const categoryIcons: Record<UMKMCategory, any> = {
    food: UtensilsCrossed,
    retail: ShoppingBag,
    services: Wrench,
    crafts: Palette,
    technology: Laptop,
    other: Store,
};

const categories: { value: UMKMCategory | "all"; label: string }[] = [
    { value: "all", label: "All Businesses" },
    { value: "food", label: "Food & Beverage" },
    { value: "retail", label: "Retail" },
    { value: "services", label: "Services" },
    { value: "crafts", label: "Crafts" },
    { value: "technology", label: "Technology" },
];

export default function UMKMPage() {
    const umkm = useFilteredUMKM();
    const [filter, setFilter] = useUMKMFilter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedBusiness, setSelectedBusiness] = useState<UMKM | null>(null);

    const filteredBySearch = umkm.filter(business =>
        business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleBusinessClick = (business: UMKM) => {
        setSelectedBusiness(business);
    };

    return (
        <MainLayout title="UMKM Directory" subtitle="Small and Medium Enterprises in Jakarta">
            <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
                    {/* Search */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search businesses..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="p-4 border-b border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Categories</h3>
                        <div className="space-y-1">
                            {categories.map(category => {
                                const Icon = category.value !== "all" ? categoryIcons[category.value as UMKMCategory] : Store;
                                const count = category.value === "all"
                                    ? umkm.length
                                    : umkm.filter(b => b.category === category.value).length;

                                return (
                                    <button
                                        key={category.value}
                                        onClick={() => setFilter(category.value as string)}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${filter === category.value
                                            ? "bg-primary-50 text-primary-700"
                                            : "hover:bg-gray-50 text-gray-700"
                                            }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-4 h-4" />
                                            <span className="text-sm font-medium">{category.label}</span>
                                        </div>
                                        <span className="text-xs text-gray-500">{count}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Business List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {filteredBySearch.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Store className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p>No businesses found</p>
                            </div>
                        ) : (
                            filteredBySearch.map(business => {
                                const Icon = categoryIcons[business.category];
                                return (
                                    <div
                                        key={business.id}
                                        onClick={() => handleBusinessClick(business)}
                                        className={`p-3 rounded-lg transition-colors cursor-pointer ${selectedBusiness?.id === business.id
                                                ? "bg-primary-50 border border-primary-200"
                                                : "bg-gray-50 hover:bg-gray-100"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-5 h-5 text-primary-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-semibold text-gray-900 text-sm truncate">
                                                        {business.name}
                                                    </h4>
                                                    {business.isVerified && (
                                                        <span className="text-xs bg-success text-white px-2 py-0.5 rounded">
                                                            ✓
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                    {business.description}
                                                </p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    {business.rating && (
                                                        <div className="flex items-center gap-1">
                                                            <span className="text-xs text-warning">★</span>
                                                            <span className="text-xs font-medium text-gray-700">
                                                                {business.rating.toFixed(1)}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                ({business.reviewCount})
                                                            </span>
                                                        </div>
                                                    )}
                                                    <span className="text-xs text-gray-500">{business.openingHours}</span>
                                                </div>
                                            </div>
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
                        <UMKMMarkers
                            businesses={filteredBySearch}
                            onBusinessClick={handleBusinessClick}
                        />
                        <MapFlyToHandler
                            coordinates={selectedBusiness?.coordinates ?? null}
                            zoom={16}
                        />
                    </MapContainer>
                </div>
            </div>
        </MainLayout>
    );
}

