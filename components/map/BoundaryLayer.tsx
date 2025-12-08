"use client";

import { useEffect, useState } from "react";
import { loadJakartaBoundaries } from "@/data/geojson/loader";
import { useMapInstance } from "./MapContainer";

interface BoundaryLayerProps {
    visible: boolean;
}

export default function BoundaryLayer({ visible }: BoundaryLayerProps) {
    const map = useMapInstance();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (!map) return;

        const addBoundaries = async () => {
            try {
                // Load Jakarta boundaries
                const boundaries = await loadJakartaBoundaries();

                if (!map.getStyle()) return;

                // Add sources for each city
                const cities = ['west', 'east', 'central', 'south', 'north'] as const;

                for (const city of cities) {
                    const sourceId = `jakarta-${city}`;
                    const layerId = `jakarta-${city}-fill`;
                    const lineLayerId = `jakarta-${city}-line`;

                    if (boundaries[city]) {
                        // Add source if it doesn't exist
                        if (!map.getSource(sourceId)) {
                            map.addSource(sourceId, {
                                type: 'geojson',
                                data: boundaries[city]
                            });
                        }

                        // Add fill layer
                        if (!map.getLayer(layerId)) {
                            map.addLayer({
                                id: layerId,
                                type: 'fill',
                                source: sourceId,
                                paint: {
                                    'fill-color': '#2563eb',
                                    'fill-opacity': 0.1
                                }
                            });
                        }

                        // Add line layer
                        if (!map.getLayer(lineLayerId)) {
                            map.addLayer({
                                id: lineLayerId,
                                type: 'line',
                                source: sourceId,
                                paint: {
                                    'line-color': '#2563eb',
                                    'line-width': 2,
                                    'line-opacity': 0.7
                                }
                            });
                        }
                    }
                }

                setIsLoaded(true);
            } catch (error) {
                console.error('Error loading boundaries:', error);
            }
        };

        addBoundaries();

        return () => {
            if (map && map.getStyle()) {
                const cities = ['west', 'east', 'central', 'south', 'north'];
                cities.forEach(city => {
                    const layerId = `jakarta-${city}-fill`;
                    const lineLayerId = `jakarta-${city}-line`;

                    try {
                        if (map.getLayer(layerId)) {
                            map.removeLayer(layerId);
                        }
                        if (map.getLayer(lineLayerId)) {
                            map.removeLayer(lineLayerId);
                        }
                    } catch (e) {
                        // Ignore errors during cleanup
                    }
                });
            }
        };
    }, [map]);

    // Toggle visibility
    useEffect(() => {
        if (!map || !isLoaded) return;

        const cities = ['west', 'east', 'central', 'south', 'north'];

        cities.forEach(city => {
            const layerId = `jakarta-${city}-fill`;
            const lineLayerId = `jakarta-${city}-line`;

            try {
                if (map.getLayer(layerId)) {
                    map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none');
                }
                if (map.getLayer(lineLayerId)) {
                    map.setLayoutProperty(lineLayerId, 'visibility', visible ? 'visible' : 'none');
                }
            } catch (e) {
                // Ignore errors
            }
        });
    }, [map, visible, isLoaded]);

    return null;
}
