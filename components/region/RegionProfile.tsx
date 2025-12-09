"use client";

import { Users, MapPin, TrendingUp, Home, Building2 } from "lucide-react";
import { Region } from "@/types";

interface RegionProfileProps {
    region: Region;
    stats?: {
        activeSensors?: number;
        totalFacilities?: number;
        totalUMKM?: number;
        openReports?: number;
    };
}

export default function RegionProfile({ region, stats }: RegionProfileProps) {
    const demographics = region.demographics;

    // Calculate age group percentages
    const totalByAge = demographics
        ? demographics.ageGroups["0-14"] + demographics.ageGroups["15-64"] + demographics.ageGroups["65+"]
        : 0;

    const agePercentages = demographics ? {
        young: ((demographics.ageGroups["0-14"] / totalByAge) * 100).toFixed(1),
        adult: ((demographics.ageGroups["15-64"] / totalByAge) * 100).toFixed(1),
        senior: ((demographics.ageGroups["65+"] / totalByAge) * 100).toFixed(1),
    } : null;

    const genderRatio = demographics
        ? (demographics.malePopulation / demographics.femalePopulation).toFixed(2)
        : null;

    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{region.name}</h2>
                        <p className="text-sm text-white/80 capitalize">{region.type}</p>
                    </div>
                </div>
            </div>

            {/* Population Stats */}
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                    Population Overview
                </h3>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                            {(region.population / 1000000).toFixed(2)}M
                        </div>
                        <div className="text-xs text-gray-500">Total Population</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                            {region.area.toFixed(1)} km²
                        </div>
                        <div className="text-xs text-gray-500">Area</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                            {region.density.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">Per km²</div>
                    </div>
                </div>
            </div>

            {/* Demographics */}
            {demographics && (
                <div className="p-6 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                        Demographics
                    </h3>

                    {/* Gender Distribution */}
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Gender Distribution</span>
                            <span className="text-xs text-gray-500">Ratio: {genderRatio}</span>
                        </div>
                        <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
                            <div
                                className="bg-blue-500"
                                style={{
                                    width: `${(demographics.malePopulation / region.population) * 100}%`
                                }}
                            />
                            <div
                                className="bg-pink-500"
                                style={{
                                    width: `${(demographics.femalePopulation / region.population) * 100}%`
                                }}
                            />
                        </div>
                        <div className="flex justify-between mt-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded" />
                                <span className="text-xs text-gray-600">
                                    Male: {(demographics.malePopulation / 1000000).toFixed(2)}M
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-pink-500 rounded" />
                                <span className="text-xs text-gray-600">
                                    Female: {(demographics.femalePopulation / 1000000).toFixed(2)}M
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Age Groups */}
                    <div>
                        <div className="text-sm text-gray-600 mb-3">Age Distribution</div>
                        <div className="space-y-3">
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-xs text-gray-600">0-14 years (Children)</span>
                                    <span className="text-xs font-medium text-gray-900">{agePercentages?.young}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full"
                                        style={{ width: `${agePercentages?.young}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-xs text-gray-600">15-64 years (Working Age)</span>
                                    <span className="text-xs font-medium text-gray-900">{agePercentages?.adult}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${agePercentages?.adult}%` }}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-xs text-gray-600">65+ years (Senior)</span>
                                    <span className="text-xs font-medium text-gray-900">{agePercentages?.senior}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-purple-500 rounded-full"
                                        style={{ width: `${agePercentages?.senior}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick Stats */}
            {stats && (
                <div className="p-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                        Quick Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                        {stats.activeSensors !== undefined && (
                            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-gray-900">{stats.activeSensors}</div>
                                    <div className="text-xs text-gray-500">Active Sensors</div>
                                </div>
                            </div>
                        )}
                        {stats.totalFacilities !== undefined && (
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Building2 className="w-4 h-4 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-gray-900">{stats.totalFacilities}</div>
                                    <div className="text-xs text-gray-500">Facilities</div>
                                </div>
                            </div>
                        )}
                        {stats.totalUMKM !== undefined && (
                            <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <Home className="w-4 h-4 text-orange-600" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-gray-900">{stats.totalUMKM}</div>
                                    <div className="text-xs text-gray-500">UMKM</div>
                                </div>
                            </div>
                        )}
                        {stats.openReports !== undefined && (
                            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                    <Users className="w-4 h-4 text-red-600" />
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-gray-900">{stats.openReports}</div>
                                    <div className="text-xs text-gray-500">Open Reports</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Location */}
            <div className="px-6 pb-6">
                <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Coordinates</div>
                    <div className="text-sm font-mono text-gray-700">
                        {region.coordinates.lat.toFixed(6)}, {region.coordinates.lng.toFixed(6)}
                    </div>
                </div>
            </div>
        </div>
    );
}
