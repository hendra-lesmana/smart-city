"use client";

import { useEffect, useRef } from "react";
import maplibregl from "maplibre-gl";
import { Report } from "@/types";
import { getReportStatusColor } from "@/lib/utils";
import { useMapInstance } from "./MapContainer";

interface ReportMarkersProps {
    reports: Report[];
    onReportClick?: (report: Report) => void;
}

export default function ReportMarkers({ reports, onReportClick }: ReportMarkersProps) {
    const map = useMapInstance();
    const markersRef = useRef<maplibregl.Marker[]>([]);

    useEffect(() => {
        if (!map) return;

        // Remove existing markers
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];

        // Add new markers
        reports.forEach(report => {
            const statusColor = getReportStatusColor(report.status);

            const el = document.createElement("div");
            el.className = "report-marker";
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
        font-size: 14px;
        background-color: ${statusColor};
      `;
            el.textContent = "!";

            el.addEventListener("click", () => {
                if (onReportClick) {
                    onReportClick(report);
                }
            });

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([report.coordinates.lng, report.coordinates.lat])
                .setPopup(
                    new maplibregl.Popup({ offset: 25 }).setHTML(`
            <div style="padding: 8px;">
              <h3 style="font-weight: 600; font-size: 14px; margin-bottom: 4px;">${report.title}</h3>
              <p style="font-size: 12px; color: #666;">${report.category}</p>
              <p style="font-size: 12px; color: #888; margin-top: 4px;">${report.description.substring(0, 100)}...</p>
              <div style="margin-top: 8px;">
                <span style="font-size: 12px; font-weight: 500; padding: 4px 8px; border-radius: 4px; background-color: ${statusColor}20; color: ${statusColor}">
                  ${report.status.replace('_', ' ')}
                </span>
              </div>
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
    }, [reports, map, onReportClick]);

    return null;
}
