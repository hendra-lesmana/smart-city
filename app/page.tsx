"use client";

import { Users, TrendingUp, Building2, AlertTriangle } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import MapContainer from "@/components/map/MapContainer";
import LayerControl from "@/components/map/LayerControl";
import StatsCard from "@/components/dashboard/StatsCard";
import BoundaryLayer from "@/components/map/BoundaryLayer";
import SensorMarkers from "@/components/sensors/SensorMarkers";
import FacilityMarkers from "@/components/map/FacilityMarkers";
import UMKMMarkers from "@/components/map/UMKMMarkers";
import ReportMarkers from "@/components/map/ReportMarkers";
import { useAtomValue } from "jotai";
import { regionsAtom, sensorsAtom, facilitiesAtom, umkmAtom, reportsAtom, mapLayersAtom } from "@/store/atoms";

export default function Home() {
    const regions = useAtomValue(regionsAtom);
    const sensors = useAtomValue(sensorsAtom);
    const facilities = useAtomValue(facilitiesAtom);
    const umkm = useAtomValue(umkmAtom);
    const reports = useAtomValue(reportsAtom);
    const layers = useAtomValue(mapLayersAtom);

    // Calculate total population
    const totalPopulation = regions.reduce((sum, region) => sum + region.population, 0);

    // Count active sensors
    const activeSensors = sensors.filter(s => s.isOnline).length;

    // Get layer visibility
    const boundariesVisible = layers.find(l => l.id === "boundaries")?.visible ?? true;
    const sensorsVisible = layers.find(l => l.id === "sensors")?.visible ?? true;
    const facilitiesVisible = layers.find(l => l.id === "facilities")?.visible ?? true;
    const umkmVisible = layers.find(l => l.id === "umkm")?.visible ?? false;
    const reportsVisible = layers.find(l => l.id === "reports")?.visible ?? false;

    return (
        <MainLayout title="Smart City GIS - Jakarta" subtitle="Geographic Information System Dashboard">
            <div className="flex h-full">
                {/* Map Area */}
                <div className="flex-1 relative">
                    <MapContainer center={{ lat: -6.2088, lng: 106.8456 }} zoom={11}>
                        <BoundaryLayer visible={boundariesVisible} />
                        {sensorsVisible && <SensorMarkers sensors={sensors} />}
                        {facilitiesVisible && <FacilityMarkers facilities={facilities} />}
                        {umkmVisible && <UMKMMarkers businesses={umkm} />}
                        {reportsVisible && <ReportMarkers reports={reports} />}
                    </MapContainer>
                    <LayerControl />
                </div>

                {/* Statistics Panel */}
                <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">DKI Jakarta Statistics</h2>

                    <div className="space-y-4">
                        <StatsCard
                            title="Total Population"
                            value={totalPopulation}
                            icon={<Users className="w-6 h-6" />}
                            trend={{ value: 1.2, isPositive: true }}
                            unit="people"
                        />

                        <StatsCard
                            title="Active IoT Sensors"
                            value={activeSensors}
                            icon={<AlertTriangle className="w-6 h-6" />}
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
                            icon={<TrendingUp className="w-6 h-6" />}
                            trend={{ value: 15.3, isPositive: true }}
                        />
                    </div>

                    {/* Region List */}
                    <div className="mt-8">
                        <h3 className="text-md font-semibold text-gray-900 mb-4">Administrative Cities</h3>
                        <div className="space-y-2">
                            {regions.map((region) => (
                                <div
                                    key={region.id}
                                    className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-gray-900">{region.name}</span>
                                        <span className="text-sm text-gray-500">
                                            {(region.population / 1000000).toFixed(2)}M
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        Density: {region.density.toLocaleString()} people/km²
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
