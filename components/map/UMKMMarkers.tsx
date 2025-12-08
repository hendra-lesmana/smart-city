"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { UMKM } from "@/types";
import { useMapInstance } from "./MapContainer";

interface UMKMMarkersProps {
    businesses: UMKM[];
    onBusinessClick?: (business: UMKM) => void;
}

const categoryColors: Record<string, string> = {
    food: "#f59e0b",
    retail: "#3b82f6",
    services: "#8b5cf6",
    crafts: "#ec4899",
    technology: "#10b981",
    other: "#6b7280",
};

export default function UMKMMarkers({ businesses, onBusinessClick }: UMKMMarkersProps) {
    const map = useMapInstance();
    const markersRef = useRef<maplibregl.Marker[]>([]);

    useEffect(() => {
        if (!map) return;

        // Remove existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add new markers
        businesses.forEach(business => {
            const el = document.createElement("div");
            el.className = "umkm-marker";
            el.style.cssText = `
        width: 32px;
        height: 32px;
        border-radius: 8px;
        border: 2px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        background-color: ${categoryColors[business.category] || categoryColors.other};
      `;
            el.textContent = "🏪";

            el.addEventListener("click", () => {
                if (onBusinessClick) {
                    onBusinessClick(business);
                }
            });

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([business.coordinates.lng, business.coordinates.lat])
                .setPopup(
                    new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px;">
              <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                <h3 style="font-weight: 600; font-size: 14px;">${business.name}</h3>
                ${business.isVerified ? '<span style="font-size: 10px; background: #22c55e; color: white; padding: 2px 6px; border-radius: 4px;">✓</span>' : ''}
              </div>
              <p style="font-size: 12px; color: #666;">${business.category}</p>
              <p style="font-size: 12px; color: #888; margin-top: 4px;">${business.description}</p>
              ${business.rating ? `<p style="font-size: 12px; color: #f59e0b; margin-top: 4px;">★ ${business.rating.toFixed(1)} (${business.reviewCount} reviews)</p>` : ''}
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
    }, [businesses, map, onBusinessClick]);

    return null;
}
