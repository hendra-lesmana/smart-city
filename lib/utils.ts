import type { GeoJSONFeature, GeoJSONFeatureCollection, Coordinates } from "@/types";

// Calculate bounds from GeoJSON
export function calculateBounds(geojson: GeoJSONFeatureCollection): [[number, number], [number, number]] {
    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLng = Infinity;
    let maxLng = -Infinity;

    geojson.features.forEach((feature) => {
        if (feature.geometry.type === "Polygon") {
            feature.geometry.coordinates[0].forEach((coord: [number, number]) => {
                const [lng, lat] = coord;
                minLat = Math.min(minLat, lat);
                maxLat = Math.max(maxLat, lat);
                minLng = Math.min(minLng, lng);
                maxLng = Math.max(maxLng, lng);
            });
        } else if (feature.geometry.type === "MultiPolygon") {
            feature.geometry.coordinates.forEach((polygon: any) => {
                polygon[0].forEach((coord: [number, number]) => {
                    const [lng, lat] = coord;
                    minLat = Math.min(minLat, lat);
                    maxLat = Math.max(maxLat, lat);
                    minLng = Math.min(minLng, lng);
                    maxLng = Math.max(maxLng, lng);
                });
            });
        }
    });

    return [
        [minLng, minLat],
        [maxLng, maxLat],
    ];
}

// Calculate center from coordinates
export function calculateCenter(coordinates: Coordinates[]): Coordinates {
    const sum = coordinates.reduce(
        (acc, coord) => ({
            lat: acc.lat + coord.lat,
            lng: acc.lng + coord.lng,
        }),
        { lat: 0, lng: 0 }
    );

    return {
        lat: sum.lat / coordinates.length,
        lng: sum.lng / coordinates.length,
    };
}

// Format coordinates for display
export function formatCoordinates(coord: Coordinates): string {
    return `${coord.lat.toFixed(6)}, ${coord.lng.toFixed(6)}`;
}

// Calculate distance between two coordinates (Haversine formula)
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371; // Earth's radius in km
    const dLat = toRad(coord2.lat - coord1.lat);
    const dLng = toRad(coord2.lng - coord1.lng);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(coord1.lat)) *
        Math.cos(toRad(coord2.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(degrees: number): number {
    return (degrees * Math.PI) / 180;
}

// Get color for sensor status
export function getSensorColor(status: string): string {
    switch (status) {
        case "online":
            return "#10b981"; // success green
        case "warning":
            return "#f59e0b"; // warning orange
        case "danger":
            return "#ef4444"; // danger red
        case "offline":
            return "#6b7280"; // gray
        default:
            return "#6b7280";
    }
}

// Get icon for facility category
export function getFacilityIcon(category: string): string {
    switch (category) {
        case "education":
            return "🏫";
        case "health":
            return "🏥";
        case "worship":
            return "🕌";
        case "government":
            return "🏛️";
        case "sports":
            return "⚽";
        case "park":
            return "🌳";
        default:
            return "📍";
    }
}

// Get icon for UMKM category
export function getUMKMIcon(category: string): string {
    switch (category) {
        case "food":
            return "🍽️";
        case "retail":
            return "🏪";
        case "services":
            return "🔧";
        case "crafts":
            return "🎨";
        case "technology":
            return "💻";
        default:
            return "🏢";
    }
}

// Get color for report status
export function getReportStatusColor(status: string): string {
    switch (status) {
        case "submitted":
            return "#3b82f6"; // blue
        case "verified":
            return "#8b5cf6"; // purple
        case "in_progress":
            return "#f59e0b"; // orange
        case "resolved":
            return "#10b981"; // green
        case "rejected":
            return "#ef4444"; // red
        default:
            return "#6b7280"; // gray
    }
}

// Format date for display
export function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
    }).format(date);
}

// Format date and time for display
export function formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return formatDate(date);
}

// Format number with thousand separators
export function formatNumber(num: number): string {
    return new Intl.NumberFormat("id-ID").format(num);
}

// Format percentage
export function formatPercentage(num: number, decimals: number = 1): string {
    return `${num.toFixed(decimals)}%`;
}
