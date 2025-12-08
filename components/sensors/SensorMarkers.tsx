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

            const el = document.createElement("div");
            el.className = "sensor-marker";
            el.style.cssText = `
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        background-color: ${color};
        ${sensor.status === 'danger' ? 'animation: pulse 1s infinite;' : ''}
      `;

            el.addEventListener("click", () => {
                if (onSensorClick) {
                    onSensorClick(sensor);
                }
            });

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([sensor.coordinates.lng, sensor.coordinates.lat])
                .setPopup(
                    new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px;">
              <h3 style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${sensor.name}</h3>
              <p style="font-size: 12px; color: #666;">${sensor.type}</p>
              <p style="font-size: 14px; font-weight: 600; margin-top: 8px;">
                ${sensor.currentReading.value} ${sensor.currentReading.unit}
              </p>
              <p style="font-size: 12px; color: ${color}; margin-top: 4px; text-transform: capitalize;">
                Status: ${sensor.status}
              </p>
            </div>
          `)
                )
                .addTo(map);

            markersRef.current.push(marker);
        });

        return () => {
            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];
        };
    }, [sensors, map, onSensorClick]);

    return null;
}
