"use client";

import { useState } from "react";
import {
    Activity, Search, Filter, MapPin, Clock, Wifi, WifiOff,
    Droplets, CloudRain, Thermometer, Wind, AlertTriangle
} from "lucide-react";
import MainLayout from "@/components/layout/MainLayout";
import { useAtom } from "jotai";
import { sensorsAtom } from "@/store/atoms";
import { Sensor, SensorType, SensorStatus } from "@/types";
import { getSensorColor } from "@/lib/utils";

const sensorTypeIcons: Record<SensorType, any> = {
    water_level: Droplets,
    rainfall: CloudRain,
    temperature: Thermometer,
    air_quality: Wind,
};

const sensorTypeLabels: Record<SensorType, string> = {
    water_level: "Water Level",
    rainfall: "Rainfall",
    temperature: "Temperature",
    air_quality: "Air Quality",
};

const sensorTypeUnits: Record<SensorType, string> = {
    water_level: "cm",
    rainfall: "mm/h",
    temperature: "°C",
    air_quality: "AQI",
};

const statusLabels: Record<SensorStatus, string> = {
    online: "Normal",
    warning: "Warning",
    danger: "Danger",
    offline: "Offline",
};

const types: SensorType[] = ["water_level", "rainfall", "temperature", "air_quality"];
const statuses: SensorStatus[] = ["online", "warning", "danger", "offline"];

export default function AdminSensorsPage() {
    const [sensors, setSensors] = useAtom(sensorsAtom);
    const [searchQuery, setSearchQuery] = useState("");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

    // Filter sensors
    const filteredSensors = sensors.filter(sensor => {
        const matchesSearch = sensor.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = typeFilter === "all" || sensor.type === typeFilter;
        const matchesStatus = statusFilter === "all" || sensor.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
    });

    // Stats
    const onlineCount = sensors.filter(s => s.isOnline).length;
    const warningCount = sensors.filter(s => s.status === "warning").length;
    const dangerCount = sensors.filter(s => s.status === "danger").length;
    const offlineCount = sensors.filter(s => !s.isOnline).length;

    // Group by type
    const typeCounts = types.reduce((acc, type) => {
        acc[type] = sensors.filter(s => s.type === type).length;
        return acc;
    }, {} as Record<SensorType, number>);

    const formatLastUpdate = (date: Date): string => {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${Math.floor(diffHours / 24)}d ago`;
    };

    return (
        <MainLayout title="Sensor Monitoring" subtitle="Monitor and manage IoT sensors">
            <div className="flex h-full bg-gray-50">
                {/* Main Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                    {/* Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div
                            onClick={() => setStatusFilter(statusFilter === "online" ? "all" : "online")}
                            className={`bg-white rounded-lg p-4 shadow-card cursor-pointer transition-all ${statusFilter === "online" ? "ring-2 ring-success" : "hover:shadow-lg"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-success">{onlineCount}</div>
                                    <div className="text-sm text-gray-500">Online</div>
                                </div>
                                <Wifi className="w-8 h-8 text-success opacity-50" />
                            </div>
                        </div>
                        <div
                            onClick={() => setStatusFilter(statusFilter === "warning" ? "all" : "warning")}
                            className={`bg-white rounded-lg p-4 shadow-card cursor-pointer transition-all ${statusFilter === "warning" ? "ring-2 ring-warning" : "hover:shadow-lg"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-warning">{warningCount}</div>
                                    <div className="text-sm text-gray-500">Warning</div>
                                </div>
                                <AlertTriangle className="w-8 h-8 text-warning opacity-50" />
                            </div>
                        </div>
                        <div
                            onClick={() => setStatusFilter(statusFilter === "danger" ? "all" : "danger")}
                            className={`bg-white rounded-lg p-4 shadow-card cursor-pointer transition-all ${statusFilter === "danger" ? "ring-2 ring-danger" : "hover:shadow-lg"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-danger">{dangerCount}</div>
                                    <div className="text-sm text-gray-500">Danger</div>
                                </div>
                                <AlertTriangle className="w-8 h-8 text-danger opacity-50" />
                            </div>
                        </div>
                        <div
                            onClick={() => setStatusFilter(statusFilter === "offline" ? "all" : "offline")}
                            className={`bg-white rounded-lg p-4 shadow-card cursor-pointer transition-all ${statusFilter === "offline" ? "ring-2 ring-gray-400" : "hover:shadow-lg"
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-2xl font-bold text-gray-500">{offlineCount}</div>
                                    <div className="text-sm text-gray-500">Offline</div>
                                </div>
                                <WifiOff className="w-8 h-8 text-gray-400 opacity-50" />
                            </div>
                        </div>
                    </div>

                    {/* Type Filter Pills */}
                    <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                        <button
                            onClick={() => setTypeFilter("all")}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${typeFilter === "all"
                                    ? "bg-primary-600 text-white"
                                    : "bg-white text-gray-600 hover:bg-gray-100"
                                }`}
                        >
                            All Types ({sensors.length})
                        </button>
                        {types.map(type => {
                            const Icon = sensorTypeIcons[type];
                            return (
                                <button
                                    key={type}
                                    onClick={() => setTypeFilter(typeFilter === type ? "all" : type)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${typeFilter === type
                                            ? "bg-primary-600 text-white"
                                            : "bg-white text-gray-600 hover:bg-gray-100"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {sensorTypeLabels[type]} ({typeCounts[type]})
                                </button>
                            );
                        })}
                    </div>

                    {/* Search Bar */}
                    <div className="bg-white rounded-lg shadow-card p-4 mb-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search sensors..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    {/* Sensors Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredSensors.length === 0 ? (
                            <div className="col-span-full bg-white rounded-lg p-12 text-center">
                                <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p className="text-gray-500">No sensors found</p>
                            </div>
                        ) : (
                            filteredSensors.map(sensor => {
                                const Icon = sensorTypeIcons[sensor.type];
                                const statusColor = getSensorColor(sensor.status);
                                return (
                                    <div
                                        key={sensor.id}
                                        onClick={() => setSelectedSensor(sensor)}
                                        className={`bg-white rounded-lg shadow-card overflow-hidden cursor-pointer hover:shadow-lg transition-all ${selectedSensor?.id === sensor.id ? "ring-2 ring-primary-500" : ""
                                            }`}
                                    >
                                        {/* Header */}
                                        <div
                                            className="p-4 border-l-4"
                                            style={{ borderLeftColor: statusColor }}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                                        style={{ backgroundColor: statusColor + "20" }}
                                                    >
                                                        <Icon className="w-5 h-5" style={{ color: statusColor }} />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900 text-sm">{sensor.name}</h3>
                                                        <p className="text-xs text-gray-500">{sensorTypeLabels[sensor.type]}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    {sensor.isOnline ? (
                                                        <Wifi className="w-4 h-4 text-success" />
                                                    ) : (
                                                        <WifiOff className="w-4 h-4 text-gray-400" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Reading */}
                                        <div className="px-4 pb-4">
                                            <div className="flex items-baseline gap-2">
                                                <span
                                                    className="text-3xl font-bold"
                                                    style={{ color: statusColor }}
                                                >
                                                    {sensor.currentReading.value}
                                                </span>
                                                <span className="text-gray-500">{sensor.currentReading.unit}</span>
                                            </div>

                                            {/* Thresholds */}
                                            <div className="flex gap-4 mt-2 text-xs">
                                                <div className="text-warning">
                                                    ⚠ {sensor.threshold.warning} {sensor.currentReading.unit}
                                                </div>
                                                <div className="text-danger">
                                                    ⛔ {sensor.threshold.danger} {sensor.currentReading.unit}
                                                </div>
                                            </div>

                                            {/* Footer */}
                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                                    <Clock className="w-3 h-3" />
                                                    {formatLastUpdate(sensor.lastUpdate)}
                                                </div>
                                                <span
                                                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                                                    style={{
                                                        backgroundColor: statusColor + "20",
                                                        color: statusColor
                                                    }}
                                                >
                                                    {statusLabels[sensor.status]}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer */}
                    <div className="mt-6 text-center text-sm text-gray-500">
                        Showing {filteredSensors.length} of {sensors.length} sensors
                    </div>
                </div>

                {/* Detail Panel */}
                {selectedSensor && (
                    <div className="w-96 bg-white border-l border-gray-200 p-6 overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-lg text-gray-900">Sensor Details</h2>
                            <button
                                onClick={() => setSelectedSensor(null)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
                            >
                                ✕
                            </button>
                        </div>

                        {(() => {
                            const Icon = sensorTypeIcons[selectedSensor.type];
                            const statusColor = getSensorColor(selectedSensor.status);
                            return (
                                <div className="space-y-6">
                                    {/* Header */}
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="w-14 h-14 rounded-xl flex items-center justify-center"
                                            style={{ backgroundColor: statusColor + "20" }}
                                        >
                                            <Icon className="w-7 h-7" style={{ color: statusColor }} />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{selectedSensor.name}</h3>
                                            <p className="text-sm text-gray-500">{sensorTypeLabels[selectedSensor.type]}</p>
                                        </div>
                                    </div>

                                    {/* Current Reading */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <div className="text-sm text-gray-500 mb-1">Current Reading</div>
                                        <div className="flex items-baseline gap-2">
                                            <span
                                                className="text-4xl font-bold"
                                                style={{ color: statusColor }}
                                            >
                                                {selectedSensor.currentReading.value}
                                            </span>
                                            <span className="text-gray-500 text-lg">{selectedSensor.currentReading.unit}</span>
                                        </div>
                                        <div
                                            className="inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium"
                                            style={{
                                                backgroundColor: statusColor + "20",
                                                color: statusColor
                                            }}
                                        >
                                            {statusLabels[selectedSensor.status]}
                                        </div>
                                    </div>

                                    {/* Thresholds */}
                                    <div>
                                        <div className="text-sm font-medium text-gray-700 mb-2">Thresholds</div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-warning bg-opacity-10 rounded-lg p-3">
                                                <div className="text-xs text-warning font-medium">Warning</div>
                                                <div className="text-lg font-bold text-warning">
                                                    {selectedSensor.threshold.warning} {selectedSensor.currentReading.unit}
                                                </div>
                                            </div>
                                            <div className="bg-danger bg-opacity-10 rounded-lg p-3">
                                                <div className="text-xs text-danger font-medium">Danger</div>
                                                <div className="text-lg font-bold text-danger">
                                                    {selectedSensor.threshold.danger} {selectedSensor.currentReading.unit}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <div className="text-sm font-medium text-gray-700 mb-2">Location</div>
                                        <div className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                                                <MapPin className="w-4 h-4" />
                                                Region: {selectedSensor.regionId}
                                            </div>
                                            <div className="text-xs text-gray-500 font-mono">
                                                {selectedSensor.coordinates.lat.toFixed(6)}, {selectedSensor.coordinates.lng.toFixed(6)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Connection Status */}
                                    <div>
                                        <div className="text-sm font-medium text-gray-700 mb-2">Connection</div>
                                        <div className={`flex items-center gap-2 p-3 rounded-lg ${selectedSensor.isOnline ? "bg-success bg-opacity-10" : "bg-gray-100"
                                            }`}>
                                            {selectedSensor.isOnline ? (
                                                <>
                                                    <Wifi className="w-5 h-5 text-success" />
                                                    <span className="text-success font-medium">Online</span>
                                                </>
                                            ) : (
                                                <>
                                                    <WifiOff className="w-5 h-5 text-gray-400" />
                                                    <span className="text-gray-500 font-medium">Offline</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Last Update */}
                                    <div>
                                        <div className="text-sm font-medium text-gray-700 mb-2">Last Update</div>
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Clock className="w-4 h-4" />
                                            {selectedSensor.lastUpdate.toLocaleString('id-ID')}
                                        </div>
                                    </div>

                                    {/* Sensor ID */}
                                    <div>
                                        <div className="text-sm font-medium text-gray-700 mb-2">Sensor ID</div>
                                        <div className="text-gray-600 font-mono text-sm bg-gray-50 p-2 rounded">
                                            {selectedSensor.id}
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
