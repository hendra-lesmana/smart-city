"use client";

import { useEffect } from "react";
import { useMapFlyTo } from "./MapContainer";
import type { Coordinates } from "@/types";

interface MapFlyToHandlerProps {
    coordinates: Coordinates | null;
    zoom?: number;
}

/**
 * Helper component that flies to coordinates when they change.
 * Must be used as a child of MapContainer.
 */
export default function MapFlyToHandler({ coordinates, zoom = 15 }: MapFlyToHandlerProps) {
    const flyTo = useMapFlyTo();

    useEffect(() => {
        if (coordinates) {
            flyTo(coordinates, zoom);
        }
    }, [coordinates, zoom, flyTo]);

    return null;
}
