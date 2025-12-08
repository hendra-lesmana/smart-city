// GeoJSON data URLs for Jakarta administrative boundaries
export const GEOJSON_URLS = {
    jakartaWest: "https://raw.githubusercontent.com/thetrisatria/geojson-indonesia/master/city-regency/id-jk-jakbar.geojson",
    jakartaEast: "https://raw.githubusercontent.com/thetrisatria/geojson-indonesia/master/city-regency/id-jk-jaktim.geojson",
    jakartaCentral: "https://raw.githubusercontent.com/thetrisatria/geojson-indonesia/master/city-regency/id-jk-jakpus.geojson",
    jakartaSouth: "https://raw.githubusercontent.com/thetrisatria/geojson-indonesia/master/city-regency/id-jk-jaksel.geojson",
    jakartaNorth: "https://raw.githubusercontent.com/thetrisatria/geojson-indonesia/master/city-regency/id-jk-jakut.geojson",
};

// Helper function to load GeoJSON data
export async function loadGeoJSON(url: string) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to load GeoJSON: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error loading GeoJSON:", error);
        return null;
    }
}

// Load all Jakarta city boundaries
export async function loadJakartaBoundaries() {
    const boundaries = await Promise.all([
        loadGeoJSON(GEOJSON_URLS.jakartaWest),
        loadGeoJSON(GEOJSON_URLS.jakartaEast),
        loadGeoJSON(GEOJSON_URLS.jakartaCentral),
        loadGeoJSON(GEOJSON_URLS.jakartaSouth),
        loadGeoJSON(GEOJSON_URLS.jakartaNorth),
    ]);

    return {
        west: boundaries[0],
        east: boundaries[1],
        central: boundaries[2],
        south: boundaries[3],
        north: boundaries[4],
    };
}
