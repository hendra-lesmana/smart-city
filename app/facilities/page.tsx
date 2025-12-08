"use client";

import { useState } from "react";
import { Search, Building2, School, Heart, Church, TreePine, Dumbbell } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import MapContainer from "@/components/map/MapContainer";
import MapFlyToHandler from "@/components/map/MapFlyToHandler";
import FacilityMarkers from "@/components/map/FacilityMarkers";
import { useFilteredFacilities, useFacilityFilter } from "@/store/hooks";
import { Facility, FacilityCategory } from "@/types";
import { getFacilityIcon } from "@/lib/utils";

const categoryIcons: Record<FacilityCategory, any> = {
    education: School,
    health: Heart,
    worship: Church,
    government: Building2,
    sports: Dumbbell,
    park: TreePine,
    other: Building2,
};

const categories: { value: FacilityCategory | "all"; label: string }[] = [
    { value: "all", label: "All Facilities" },
    { value: "education", label: "Education" },
    { value: "health", label: "Health" },
    { value: "worship", label: "Worship" },
    { value: "government", label: "Government" },
    { value: "sports", label: "Sports" },
    { value: "park", label: "Parks" },
];

export default function FacilitiesPage() {
    const facilities = useFilteredFacilities();
    const [filter, setFilter] = useFacilityFilter();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

    const filteredBySearch = facilities.filter(facility =>
        facility.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        facility.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleFacilityClick = (facility: Facility) => {
        setSelectedFacility(facility);
    };

    return (
        <MainLayout title="Public Facilities" subtitle="Directory of public facilities in Jakarta">
            <div className="flex h-full">
                {/* Sidebar */}
                <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
                    {/* Search */}
                    <div className="p-4 border-b border-gray-200">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search facilities..."
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
                                const Icon = category.value !== "all" ? categoryIcons[category.value as FacilityCategory] : Building2;
                                const count = category.value === "all"
                                    ? facilities.length
                                    : facilities.filter(f => f.category === category.value).length;

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

                    {/* Facility List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {filteredBySearch.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Building2 className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p>No facilities found</p>
                            </div>
                        ) : (
                            filteredBySearch.map(facility => {
                                const Icon = categoryIcons[facility.category];
                                return (
                                    <div
                                        key={facility.id}
                                        onClick={() => handleFacilityClick(facility)}
                                        className={`p-3 rounded-lg transition-colors cursor-pointer ${selectedFacility?.id === facility.id
                                                ? "bg-primary-50 border border-primary-200"
                                                : "bg-gray-50 hover:bg-gray-100"
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <Icon className="w-5 h-5 text-primary-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 text-sm truncate">
                                                    {facility.name}
                                                </h4>
                                                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                    {facility.address}
                                                </p>
                                                {facility.phone && (
                                                    <p className="text-xs text-gray-500 mt-1">{facility.phone}</p>
                                                )}
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
                        <FacilityMarkers
                            facilities={filteredBySearch}
                            onFacilityClick={handleFacilityClick}
                        />
                        <MapFlyToHandler
                            coordinates={selectedFacility?.coordinates ?? null}
                            zoom={16}
                        />
                    </MapContainer>
                </div>
            </div>
        </MainLayout>
    );
}

