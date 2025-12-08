"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { Sensor } from "@/types";
import { getSensorColor } from "@/lib/utils";
import { useMapInstance } from "../map/MapContainer";

interface SensorMarkersProps {
    sensors: Sensor[];
    onSensorClick?: (sensor: Sensor) => void;
}

// Get sensor type display name
function getSensorTypeName(type: string): string {
    switch (type) {
        case "water_level": return "Water Level";
        case "rainfall": return "Rainfall";
        case "temperature": return "Temperature";
        case "air_quality": return "Air Quality";
        default: return type;
    }
}

// Get sensor type icon
function getSensorTypeIcon(type: string): string {
    switch (type) {
        case "water_level": return "💧";
        case "rainfall": return "🌧️";
        case "temperature": return "🌡️";
        case "air_quality": return "💨";
        default: return "📊";
    }
}

// Format last update time
function formatLastUpdate(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export default function SensorMarkers({ sensors, onSensorClick }: SensorMarkersProps) {
    const map = useMapInstance();
    const markersRef = useRef<maplibregl.Marker[]>([]);

    useEffect(() => {
        if (!map) return;

        // Remove existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add new markers
        sensors.forEach(sensor => {
            const color = getSensorColor(sensor.status);
            const icon = getSensorTypeIcon(sensor.type);
            const typeName = getSensorTypeName(sensor.type);

            const el = document.createElement("div");
            el.className = "sensor-marker";
            el.style.cssText = `
                width: 28px;
                height: 28px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                cursor: pointer;
                background-color: ${color};
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                ${sensor.status === 'danger' ? 'animation: pulse 1.5s infinite;' : ''}
            `;
            el.textContent = icon;

            // Create popup with detailed information
            const popup = new maplibregl.Popup({
                offset: 20,
                closeButton: true,
                closeOnClick: false,
                maxWidth: '280px'
            }).setHTML(`
                <div style="padding: 12px; font-family: system-ui, -apple-system, sans-serif;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <span style="font-size: 20px;">${icon}</span>
                        <div>
                            <h3 style="font-weight: 600; font-size: 14px; margin: 0; color: #111;">${sensor.name}</h3>
                            <p style="font-size: 11px; color: #666; margin: 2px 0 0 0;">${typeName}</p>
                        </div>
                    </div>
                    
                    <div style="background: #f8f9fa; border-radius: 8px; padding: 10px; margin: 8px 0;">
                        <div style="display: flex; align-items: baseline; gap: 4px;">
                            <span style="font-size: 24px; font-weight: 700; color: #111;">${sensor.currentReading.value}</span>
                            <span style="font-size: 12px; color: #666;">${sensor.currentReading.unit}</span>
                        </div>
                        <div style="display: flex; align-items: center; gap: 6px; margin-top: 6px;">
                            <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${color};"></span>
                            <span style="font-size: 12px; font-weight: 500; color: ${color}; text-transform: capitalize;">${sensor.status}</span>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px;">
                        <div style="background: #fff7ed; padding: 6px 8px; border-radius: 6px;">
                            <div style="font-size: 10px; color: #9a3412; text-transform: uppercase;">Warning</div>
                            <div style="font-size: 13px; font-weight: 600; color: #c2410c;">${sensor.threshold.warning} ${sensor.currentReading.unit}</div>
                        </div>
                        <div style="background: #fef2f2; padding: 6px 8px; border-radius: 6px;">
                            <div style="font-size: 10px; color: #991b1b; text-transform: uppercase;">Danger</div>
                            <div style="font-size: 13px; font-weight: 600; color: #dc2626;">${sensor.threshold.danger} ${sensor.currentReading.unit}</div>
                        </div>
                    </div>
                    
                    <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid #e5e7eb;">
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="font-size: 11px; color: #6b7280;">Last updated</span>
                            <span style="font-size: 11px; color: #374151; font-weight: 500;">${formatLastUpdate(sensor.lastUpdate)}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                            <span style="font-size: 11px; color: #6b7280;">Connection</span>
                            <span style="font-size: 11px; font-weight: 500; color: ${sensor.isOnline ? '#22c55e' : '#ef4444'};">
                                ${sensor.isOnline ? '● Online' : '● Offline'}
                            </span>
                        </div>
                    </div>
                </div>
            `);

            const marker = new maplibregl.Marker({
                element: el,
                anchor: 'center'
            })
                .setLngLat([sensor.coordinates.lng, sensor.coordinates.lat])
                .setPopup(popup)
                .addTo(map);

            // Handle click - toggle popup and call callback
            el.addEventListener("click", (e) => {
                e.stopPropagation();

                // Toggle popup
                if (popup.isOpen()) {
                    popup.remove();
                } else {
                    popup.addTo(map);
                }

                // Call the callback for fly-to animation
                if (onSensorClick) {
                    onSensorClick(sensor);
                }
            });

            markersRef.current.push(marker);
        });

        return () => {
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
        };
    }, [sensors, map, onSensorClick]);

    return null;
}


