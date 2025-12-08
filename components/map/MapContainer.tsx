"use client";

import { useRef, useEffect, useState, createContext, useContext, useCallback, useMemo } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Coordinates } from "@/types";

// Map controller interface for exposing map functions
interface MapController {
    map: maplibregl.Map | null;
    flyTo: (coordinates: Coordinates, zoom?: number) => void;
}

// Create context for map controller
const MapContext = createContext<MapController>({
    map: null,
    flyTo: () => { },
});

// Hook to access map instance from child components
export function useMapInstance() {
    return useContext(MapContext).map;
}

// Hook to access the flyTo function
export function useMapFlyTo() {
    return useContext(MapContext).flyTo;
}

// Hook to access full map controller
export function useMapController() {
    return useContext(MapContext);
}

interface MapContainerProps {
    center?: Coordinates;
    zoom?: number;
    children?: React.ReactNode;
    onMapReady?: (controller: MapController) => void;
}

export default function MapContainer({
    center = { lat: -6.2088, lng: 106.8456 }, // Jakarta center
    zoom = 11,
    children,
    onMapReady,
}: MapContainerProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const [mapInstance, setMapInstance] = useState<maplibregl.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);

    // Store initial values in refs to avoid re-initialization
    const initialCenterRef = useRef(center);
    const initialZoomRef = useRef(zoom);

    // FlyTo function that can be called externally
    const flyTo = useCallback((coordinates: Coordinates, flyZoom: number = 15) => {
        if (mapInstance) {
            mapInstance.flyTo({
                center: [coordinates.lng, coordinates.lat],
                zoom: flyZoom,
                duration: 1500,
                essential: true,
            });
        }
    }, [mapInstance]);

    // Create controller object with useMemo to prevent unnecessary re-renders
    const controller = useMemo<MapController>(() => ({
        map: mapInstance,
        flyTo,
    }), [mapInstance, flyTo]);

    useEffect(() => {
        // Skip if already initialized or no container
        if (mapRef.current || !mapContainer.current) return;

        const initialCenter = initialCenterRef.current;
        const initialZoom = initialZoomRef.current;

        // Initialize map
        const newMap = new maplibregl.Map({
            container: mapContainer.current,
            style: {
                version: 8,
                sources: {
                    osm: {
                        type: "raster",
                        tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
                        tileSize: 256,
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    },
                },
                layers: [
                    {
                        id: "osm",
                        type: "raster",
                        source: "osm",
                        minzoom: 0,
                        maxzoom: 19,
                    },
                ],
            },
            center: [initialCenter.lng, initialCenter.lat],
            zoom: initialZoom,
        });

        // Store in ref immediately to prevent re-initialization
        mapRef.current = newMap;

        // Add navigation controls
        newMap.addControl(new maplibregl.NavigationControl(), "top-right");

        // Add scale control
        newMap.addControl(new maplibregl.ScaleControl(), "bottom-left");

        newMap.on("load", () => {
            setMapLoaded(true);
        });

        setMapInstance(newMap);

        return () => {
            newMap.remove();
            mapRef.current = null;
            setMapInstance(null);
        };
    }, []); // Empty dependency array - only run once on mount

    // Notify parent when map is ready
    useEffect(() => {
        if (mapLoaded && mapInstance && onMapReady) {
            onMapReady(controller);
        }
    }, [mapLoaded, mapInstance, onMapReady, controller]);

    return (
        <div className="relative w-full h-full">
            <div ref={mapContainer} className="map-container" />
            {mapLoaded && mapInstance && (
                <MapContext.Provider value={controller}>
                    {children}
                </MapContext.Provider>
            )}
        </div>
    );
}



