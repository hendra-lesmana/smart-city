"use client";

import { useState } from "react";
import {
    X, Droplets, CloudRain, Thermometer, Wind,
    MapPin, Clock, Wifi, WifiOff, TrendingUp, TrendingDown, Minus
} from "lucide-react";
import { Sensor } from "@/types";
import SensorChart from "./SensorChart";
import { getSensorColor } from "@/lib/utils";

interface SensorDetailModalProps {
    sensor: Sensor;
    isOpen: boolean;
    onClose: () => void;
}

// Get sensor type icon component
function getSensorTypeIcon(type: string) {
    switch (type) {
        case "water_level": return Droplets;
        case "rainfall": return CloudRain;
        case "temperature": return Thermometer;
        case "air_quality": return Wind;
        default: return Droplets;
    }
}

// Get sensor type display name
function getSensorTypeName(type: string): string {
    switch (type) {
        case "water_level": return "Water Level Sensor";
        case "rainfall": return "Rainfall Sensor";
        case "temperature": return "Temperature Sensor";
        case "air_quality": return "Air Quality Sensor";
        default: return "Sensor";
    }
}

// Get trend from readings
function getTrend(readings: { value: number }[]): { direction: "up" | "down" | "stable"; percentage: number } {
    if (readings.length < 2) return { direction: "stable", percentage: 0 };

    const recent = readings.slice(-6);
    const older = readings.slice(-12, -6);

    if (recent.length === 0 || older.length === 0) return { direction: "stable", percentage: 0 };

    const recentAvg = recent.reduce((sum, r) => sum + r.value, 0) / recent.length;
    const olderAvg = older.reduce((sum, r) => sum + r.value, 0) / older.length;

    const change = ((recentAvg - olderAvg) / olderAvg) * 100;

    if (Math.abs(change) < 2) return { direction: "stable", percentage: 0 };
    return {
        direction: change > 0 ? "up" : "down",
        percentage: Math.abs(change),
    };
}

// Format last update time
function formatLastUpdate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

export default function SensorDetailModal({ sensor, isOpen, onClose }: SensorDetailModalProps) {
    const [activeTab, setActiveTab] = useState<"overview" | "history">("overview");

    if (!isOpen) return null;

    const IconComponent = getSensorTypeIcon(sensor.type);
    const typeName = getSensorTypeName(sensor.type);
    const statusColor = getSensorColor(sensor.status);
    const trend = getTrend(sensor.readings);

    // Calculate statistics
    const values = sensor.readings.map(r => r.value);
    const minValue = values.length > 0 ? Math.min(...values) : 0;
    const maxValue = values.length > 0 ? Math.max(...values) : 0;
    const avgValue = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden m-4">
                {/* Header */}
                <div className="relative p-6 border-b border-gray-100">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>

                    <div className="flex items-start gap-4">
                        <div
                            className="w-14 h-14 rounded-xl flex items-center justify-center"
                            style={{ backgroundColor: `${statusColor}20` }}
                        >
                            <IconComponent
                                className="w-7 h-7"
                                style={{ color: statusColor }}
                            />
                        </div>
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900">{sensor.name}</h2>
                            <p className="text-sm text-gray-500">{typeName}</p>
                            <div className="flex items-center gap-3 mt-2">
                                <span
                                    className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                                    style={{
                                        backgroundColor: `${statusColor}15`,
                                        color: statusColor
                                    }}
                                >
                                    {sensor.status}
                                </span>
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                    {sensor.isOnline ? (
                                        <><Wifi className="w-3 h-3 text-green-500" /> Online</>
                                    ) : (
                                        <><WifiOff className="w-3 h-3 text-red-500" /> Offline</>
                                    )}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === "overview"
                                ? "text-primary-600 border-b-2 border-primary-600"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("history")}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === "history"
                                ? "text-primary-600 border-b-2 border-primary-600"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        History Chart
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-250px)]">
                    {activeTab === "overview" ? (
                        <div className="space-y-6">
                            {/* Current Reading */}
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5">
                                <div className="text-sm text-gray-500 mb-1">Current Reading</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-gray-900">
                                        {sensor.currentReading.value}
                                    </span>
                                    <span className="text-lg text-gray-500">
                                        {sensor.currentReading.unit}
                                    </span>
                                    <div className="ml-auto flex items-center gap-1">
                                        {trend.direction === "up" && (
                                            <TrendingUp className="w-4 h-4 text-red-500" />
                                        )}
                                        {trend.direction === "down" && (
                                            <TrendingDown className="w-4 h-4 text-green-500" />
                                        )}
                                        {trend.direction === "stable" && (
                                            <Minus className="w-4 h-4 text-gray-400" />
                                        )}
                                        <span className={`text-sm ${trend.direction === "up" ? "text-red-500" :
                                                trend.direction === "down" ? "text-green-500" : "text-gray-400"
                                            }`}>
                                            {trend.percentage > 0 ? `${trend.percentage.toFixed(1)}%` : "Stable"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Statistics Grid */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-blue-50 rounded-xl p-4 text-center">
                                    <div className="text-xs text-blue-600 font-medium mb-1">Minimum</div>
                                    <div className="text-xl font-bold text-blue-700">
                                        {minValue.toFixed(1)}
                                    </div>
                                    <div className="text-xs text-blue-500">{sensor.currentReading.unit}</div>
                                </div>
                                <div className="bg-purple-50 rounded-xl p-4 text-center">
                                    <div className="text-xs text-purple-600 font-medium mb-1">Average</div>
                                    <div className="text-xl font-bold text-purple-700">
                                        {avgValue.toFixed(1)}
                                    </div>
                                    <div className="text-xs text-purple-500">{sensor.currentReading.unit}</div>
                                </div>
                                <div className="bg-orange-50 rounded-xl p-4 text-center">
                                    <div className="text-xs text-orange-600 font-medium mb-1">Maximum</div>
                                    <div className="text-xl font-bold text-orange-700">
                                        {maxValue.toFixed(1)}
                                    </div>
                                    <div className="text-xs text-orange-500">{sensor.currentReading.unit}</div>
                                </div>
                            </div>

                            {/* Thresholds */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                                    <div className="text-xs text-amber-700 font-medium mb-1">Warning Threshold</div>
                                    <div className="text-2xl font-bold text-amber-600">
                                        {sensor.threshold.warning} {sensor.currentReading.unit}
                                    </div>
                                </div>
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                                    <div className="text-xs text-red-700 font-medium mb-1">Danger Threshold</div>
                                    <div className="text-2xl font-bold text-red-600">
                                        {sensor.threshold.danger} {sensor.currentReading.unit}
                                    </div>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="w-4 h-4 text-gray-400" />
                                    <span>
                                        {sensor.coordinates.lat.toFixed(6)}, {sensor.coordinates.lng.toFixed(6)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span>Last updated: {formatLastUpdate(sensor.lastUpdate)}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <SensorChart sensor={sensor} height={300} />
                    )}
                </div>
            </div>
        </div>
    );
}
