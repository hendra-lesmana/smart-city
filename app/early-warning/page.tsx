"use client";

import { useState } from "react";
import { AlertTriangle, Filter, X } from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import MapContainer from "@/components/map/MapContainer";
import MapFlyToHandler from "@/components/map/MapFlyToHandler";
import SensorCard from "@/components/sensors/SensorCard";
import SensorMarkers from "@/components/sensors/SensorMarkers";
import SensorDetailModal from "@/components/sensors/SensorDetailModal";
import { useSensors } from "@/store/hooks";
import { Sensor } from "@/types";

export default function EarlyWarningPage() {
    const [sensors] = useSensors();
    const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
    const [modalSensor, setModalSensor] = useState<Sensor | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [isBannerVisible, setIsBannerVisible] = useState(true);

    const filteredSensors = sensors.filter(sensor => {
        if (statusFilter === "all") return true;
        return sensor.status === statusFilter;
    });

    const dangerSensors = sensors.filter(s => s.status === "danger");
    const warningSensors = sensors.filter(s => s.status === "warning");
    const onlineSensors = sensors.filter(s => s.status === "online");

    const handleSensorClick = (sensor: Sensor) => {
        setSelectedSensor(sensor);
    };

    const handleCloseBanner = () => {
        setIsBannerVisible(false);
    };

    const handleOpenModal = (sensor: Sensor) => {
        setModalSensor(sensor);
    };

    const handleCloseModal = () => {
        setModalSensor(null);
    };

    return (
        <MainLayout
            title="Early Warning System"
            subtitle="Real-time IoT Sensor Monitoring"
        >
            <div className="flex h-full">
                {/* Map Area */}
                <div className="flex-1 relative">
                    <MapContainer center={{ lat: -6.2088, lng: 106.8456 }} zoom={11}>
                        <SensorMarkers
                            sensors={filteredSensors}
                            onSensorClick={handleSensorClick}
                        />
                        <MapFlyToHandler
                            coordinates={selectedSensor?.coordinates ?? null}
                            zoom={15}
                        />
                    </MapContainer>

                    {/* Alert Banner */}
                    {dangerSensors.length > 0 && isBannerVisible && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-danger text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-10 animate-fadeIn">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="font-semibold">
                                {dangerSensors.length} Danger Sensor{dangerSensors.length > 1 ? "s" : ""} Detected
                            </span>
                            <button
                                onClick={handleCloseBanner}
                                className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                                title="Close alert"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Sensor Panel */}
                <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Sensor Status</h2>

                        {/* Status Summary */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className="text-center p-2 bg-danger bg-opacity-10 rounded">
                                <div className="text-2xl font-bold text-danger">{dangerSensors.length}</div>
                                <div className="text-xs text-gray-600">Danger</div>
                            </div>
                            <div className="text-center p-2 bg-warning bg-opacity-10 rounded">
                                <div className="text-2xl font-bold text-warning">{warningSensors.length}</div>
                                <div className="text-xs text-gray-600">Warning</div>
                            </div>
                            <div className="text-center p-2 bg-success bg-opacity-10 rounded">
                                <div className="text-2xl font-bold text-success">{onlineSensors.length}</div>
                                <div className="text-xs text-gray-600">Normal</div>
                            </div>
                        </div>

                        {/* Filter */}
                        <div className="flex items-center gap-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="all">All Sensors ({sensors.length})</option>
                                <option value="danger">Danger ({dangerSensors.length})</option>
                                <option value="warning">Warning ({warningSensors.length})</option>
                                <option value="online">Normal ({onlineSensors.length})</option>
                            </select>
                        </div>
                    </div>

                    {/* Sensor List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {filteredSensors.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <AlertTriangle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                <p>No sensors found</p>
                            </div>
                        ) : (
                            filteredSensors.map(sensor => (
                                <SensorCard
                                    key={sensor.id}
                                    sensor={sensor}
                                    onClick={() => handleSensorClick(sensor)}
                                    onViewDetails={() => handleOpenModal(sensor)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Sensor Detail Modal */}
            {modalSensor && (
                <SensorDetailModal
                    sensor={modalSensor}
                    isOpen={!!modalSensor}
                    onClose={handleCloseModal}
                />
            )}
        </MainLayout>
    );
}
