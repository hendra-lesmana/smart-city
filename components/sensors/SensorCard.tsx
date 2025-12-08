"use client";

import { AlertTriangle, Droplets, CloudRain, Activity, Thermometer, Wind } from "lucide-react";
import { Sensor } from "@/types";
import { getSensorColor, formatDateTime, formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/cn";

interface SensorCardProps {
    sensor: Sensor;
    onClick?: () => void;
}

export default function SensorCard({ sensor, onClick }: SensorCardProps) {
    const statusColor = getSensorColor(sensor.status);

    const getIcon = () => {
        switch (sensor.type) {
            case "water_level":
                return <Droplets className="w-5 h-5" />;
            case "rainfall":
                return <CloudRain className="w-5 h-5" />;
            case "temperature":
                return <Thermometer className="w-5 h-5" />;
            case "air_quality":
                return <Wind className="w-5 h-5" />;
            default:
                return <Activity className="w-5 h-5" />;
        }
    };

    const getStatusText = () => {
        switch (sensor.status) {
            case "online":
                return "Normal";
            case "warning":
                return "Warning";
            case "danger":
                return "Danger";
            case "offline":
                return "Offline";
            default:
                return "Unknown";
        }
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                "bg-white rounded-lg shadow-card p-4 cursor-pointer transition-all hover:shadow-panel",
                sensor.status === "danger" && "border-l-4 border-danger",
                sensor.status === "warning" && "border-l-4 border-warning"
            )}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: statusColor + "20", color: statusColor }}
                    >
                        {getIcon()}
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900">{sensor.name}</h3>
                        <p className="text-xs text-gray-500">{formatRelativeTime(sensor.lastUpdate)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: statusColor }}
                    />
                    <span
                        className="text-xs font-medium"
                        style={{ color: statusColor }}
                    >
                        {getStatusText()}
                    </span>
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-gray-900">
                        {sensor.currentReading.value}
                    </span>
                    <span className="text-sm text-gray-500">{sensor.currentReading.unit}</span>
                </div>

                <div className="flex items-center gap-4 text-xs text-gray-600">
                    <div>
                        <span className="text-gray-500">Warning: </span>
                        <span className="font-medium">{sensor.threshold.warning} {sensor.currentReading.unit}</span>
                    </div>
                    <div>
                        <span className="text-gray-500">Danger: </span>
                        <span className="font-medium">{sensor.threshold.danger} {sensor.currentReading.unit}</span>
                    </div>
                </div>

                {sensor.status !== "online" && (
                    <div className="mt-2 p-2 bg-gray-50 rounded flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-warning" />
                        <span className="text-xs text-gray-700">
                            {sensor.status === "warning" && "Approaching warning threshold"}
                            {sensor.status === "danger" && "Critical level reached!"}
                            {sensor.status === "offline" && "Sensor offline"}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
