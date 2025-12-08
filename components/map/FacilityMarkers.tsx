"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { Facility } from "@/types";
import { useMapInstance } from "./MapContainer";

interface FacilityMarkersProps {
    facilities: Facility[];
    onFacilityClick?: (facility: Facility) => void;
}

const categoryColors: Record<string, string> = {
    education: "#3b82f6",
    health: "#ef4444",
    worship: "#8b5cf6",
    government: "#f59e0b",
    sports: "#10b981",
    park: "#22c55e",
    other: "#6b7280",
};

export default function FacilityMarkers({ facilities, onFacilityClick }: FacilityMarkersProps) {
    const map = useMapInstance();
    const markersRef = useRef<maplibregl.Marker[]>([]);

    useEffect(() => {
        if (!map) return;

        // Remove existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add new markers
        facilities.forEach(facility => {
            const el = document.createElement("div");
            el.className = "facility-marker";
            el.style.cssText = `
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: 12px;
        background-color: ${categoryColors[facility.category] || categoryColors.other};
      `;
            el.textContent = facility.name.charAt(0);

            el.addEventListener("click", () => {
                if (onFacilityClick) {
                    onFacilityClick(facility);
                }
            });

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([facility.coordinates.lng, facility.coordinates.lat])
                .setPopup(
                    new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px;">
              <h3 style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${facility.name}</h3>
              <p style="font-size: 12px; color: #666;">${facility.category}</p>
              <p style="font-size: 12px; color: #888; margin-top: 4px;">${facility.address}</p>
              ${facility.phone ? `<p style="font-size: 12px; color: #888; margin-top: 4px;">${facility.phone}</p>` : ''}
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
    }, [facilities, map, onFacilityClick]);

    return null;
}
