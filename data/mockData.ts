import type {
    Region,
    Sensor,
    Facility,
    UMKM,
    Report,
    User,
    Coordinates,
} from "@/types";

// Jakarta City Regions
export const jakartaRegions: Region[] = [
    {
        id: "jk-west",
        name: "Jakarta Barat",
        type: "city",
        population: 2588363,
        area: 129.54,
        density: 19981,
        coordinates: { lat: -6.1668, lng: 106.7638 },
        demographics: {
            malePopulation: 1303456,
            femalePopulation: 1284907,
            ageGroups: {
                "0-14": 618809,
                "15-64": 1811753,
                "65+": 157801,
            },
        },
    },
    {
        id: "jk-east",
        name: "Jakarta Timur",
        type: "city",
        population: 2931390,
        area: 188.03,
        density: 15591,
        coordinates: { lat: -6.2250, lng: 106.9004 },
        demographics: {
            malePopulation: 1476633,
            femalePopulation: 1454757,
            ageGroups: {
                "0-14": 703534,
                "15-64": 2053534,
                "65+": 174322,
            },
        },
    },
    {
        id: "jk-central",
        name: "Jakarta Pusat",
        type: "city",
        population: 928274,
        area: 48.13,
        density: 19287,
        coordinates: { lat: -6.1862, lng: 106.8341 },
        demographics: {
            malePopulation: 467865,
            femalePopulation: 460409,
            ageGroups: {
                "0-14": 222787,
                "15-64": 650392,
                "65+": 55095,
            },
        },
    },
    {
        id: "jk-south",
        name: "Jakarta Selatan",
        type: "city",
        population: 2264070,
        area: 141.27,
        density: 16026,
        coordinates: { lat: -6.2615, lng: 106.8106 },
        demographics: {
            malePopulation: 1140275,
            femalePopulation: 1123795,
            ageGroups: {
                "0-14": 543377,
                "15-64": 1586850,
                "65+": 133843,
            },
        },
    },
    {
        id: "jk-north",
        name: "Jakarta Utara",
        type: "city",
        population: 1812510,
        area: 154.12,
        density: 11760,
        coordinates: { lat: -6.1380, lng: 106.8827 },
        demographics: {
            malePopulation: 913177,
            femalePopulation: 899333,
            ageGroups: {
                "0-14": 435002,
                "15-64": 1270357,
                "65+": 107151,
            },
        },
    },
];

// Helper function to get unit by sensor type
function getSensorUnit(type: string): string {
    switch (type) {
        case "water_level":
            return "cm";
        case "rainfall":
            return "mm/h";
        case "temperature":
            return "°C";
        case "air_quality":
            return "AQI";
        default:
            return "";
    }
}

// IoT Sensors with realistic Jakarta locations
export const mockSensors: Sensor[] = [
    // Water Level Sensors
    {
        id: "sensor-001",
        name: "Ciliwung River - Manggarai",
        type: "water_level",
        status: "online",
        coordinates: { lat: -6.2088, lng: 106.8456 },
        regionId: "jk-south",
        currentReading: {
            timestamp: new Date(),
            value: 245,
            unit: "cm",
        },
        threshold: {
            warning: 300,
            danger: 400,
        },
        readings: generateSensorReadings(245, 50, 24, "cm"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    {
        id: "sensor-002",
        name: "Kali Sunter - Kelapa Gading",
        type: "water_level",
        status: "warning",
        coordinates: { lat: -6.1571, lng: 106.9056 },
        regionId: "jk-north",
        currentReading: {
            timestamp: new Date(),
            value: 320,
            unit: "cm",
        },
        threshold: {
            warning: 300,
            danger: 400,
        },
        readings: generateSensorReadings(320, 60, 24, "cm"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    {
        id: "sensor-003",
        name: "Kali Pesanggrahan - Kebayoran Lama",
        type: "water_level",
        status: "danger",
        coordinates: { lat: -6.2443, lng: 106.7729 },
        regionId: "jk-south",
        currentReading: {
            timestamp: new Date(),
            value: 425,
            unit: "cm",
        },
        threshold: {
            warning: 300,
            danger: 400,
        },
        readings: generateSensorReadings(425, 70, 24, "cm"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    {
        id: "sensor-004",
        name: "Kali Angke - Cengkareng",
        type: "water_level",
        status: "online",
        coordinates: { lat: -6.1456, lng: 106.7409 },
        regionId: "jk-west",
        currentReading: {
            timestamp: new Date(),
            value: 180,
            unit: "cm",
        },
        threshold: {
            warning: 300,
            danger: 400,
        },
        readings: generateSensorReadings(180, 40, 24, "cm"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    {
        id: "sensor-005",
        name: "Kali Grogol - Grogol Petamburan",
        type: "water_level",
        status: "online",
        coordinates: { lat: -6.1668, lng: 106.7838 },
        regionId: "jk-west",
        currentReading: {
            timestamp: new Date(),
            value: 210,
            unit: "cm",
        },
        threshold: {
            warning: 300,
            danger: 400,
        },
        readings: generateSensorReadings(210, 45, 24, "cm"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    {
        id: "sensor-006",
        name: "Kali Ciliwung - Kampung Melayu",
        type: "water_level",
        status: "warning",
        coordinates: { lat: -6.2225, lng: 106.8650 },
        regionId: "jk-east",
        currentReading: {
            timestamp: new Date(),
            value: 315,
            unit: "cm",
        },
        threshold: {
            warning: 300,
            danger: 400,
        },
        readings: generateSensorReadings(315, 55, 24, "cm"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    {
        id: "sensor-007",
        name: "Kali Cipinang - Cipinang",
        type: "water_level",
        status: "online",
        coordinates: { lat: -6.2150, lng: 106.8900 },
        regionId: "jk-east",
        currentReading: {
            timestamp: new Date(),
            value: 195,
            unit: "cm",
        },
        threshold: {
            warning: 300,
            danger: 400,
        },
        readings: generateSensorReadings(195, 35, 24, "cm"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    // Rainfall Sensors
    {
        id: "sensor-008",
        name: "Rainfall Sensor - Kemayoran",
        type: "rainfall",
        status: "online",
        coordinates: { lat: -6.1701, lng: 106.8503 },
        regionId: "jk-central",
        currentReading: {
            timestamp: new Date(),
            value: 15.5,
            unit: "mm/h",
        },
        threshold: {
            warning: 20,
            danger: 50,
        },
        readings: generateSensorReadings(15.5, 10, 24, "mm/h"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    {
        id: "sensor-009",
        name: "Rainfall Sensor - Halim",
        type: "rainfall",
        status: "warning",
        coordinates: { lat: -6.2660, lng: 106.8900 },
        regionId: "jk-east",
        currentReading: {
            timestamp: new Date(),
            value: 28.3,
            unit: "mm/h",
        },
        threshold: {
            warning: 20,
            danger: 50,
        },
        readings: generateSensorReadings(28.3, 15, 24, "mm/h"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    {
        id: "sensor-010",
        name: "Rainfall Sensor - Tanjung Priok",
        type: "rainfall",
        status: "online",
        coordinates: { lat: -6.1020, lng: 106.8770 },
        regionId: "jk-north",
        currentReading: {
            timestamp: new Date(),
            value: 8.2,
            unit: "mm/h",
        },
        threshold: {
            warning: 20,
            danger: 50,
        },
        readings: generateSensorReadings(8.2, 8, 24, "mm/h"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    {
        id: "sensor-011",
        name: "Rainfall Sensor - Kebayoran",
        type: "rainfall",
        status: "danger",
        coordinates: { lat: -6.2410, lng: 106.7830 },
        regionId: "jk-south",
        currentReading: {
            timestamp: new Date(),
            value: 52.7,
            unit: "mm/h",
        },
        threshold: {
            warning: 20,
            danger: 50,
        },
        readings: generateSensorReadings(52.7, 20, 24, "mm/h"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    {
        id: "sensor-012",
        name: "Rainfall Sensor - Cengkareng",
        type: "rainfall",
        status: "online",
        coordinates: { lat: -6.1350, lng: 106.7150 },
        regionId: "jk-west",
        currentReading: {
            timestamp: new Date(),
            value: 12.1,
            unit: "mm/h",
        },
        threshold: {
            warning: 20,
            danger: 50,
        },
        readings: generateSensorReadings(12.1, 10, 24, "mm/h"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    // Temperature Sensors
    {
        id: "sensor-013",
        name: "Temperature Sensor - Monas",
        type: "temperature",
        status: "online",
        coordinates: { lat: -6.1754, lng: 106.8272 },
        regionId: "jk-central",
        currentReading: {
            timestamp: new Date(),
            value: 32.5,
            unit: "°C",
        },
        threshold: {
            warning: 35,
            danger: 40,
        },
        readings: generateSensorReadings(32.5, 3, 24, "°C"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    {
        id: "sensor-014",
        name: "Temperature Sensor - Ancol",
        type: "temperature",
        status: "warning",
        coordinates: { lat: -6.1250, lng: 106.8310 },
        regionId: "jk-north",
        currentReading: {
            timestamp: new Date(),
            value: 36.2,
            unit: "°C",
        },
        threshold: {
            warning: 35,
            danger: 40,
        },
        readings: generateSensorReadings(36.2, 4, 24, "°C"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    {
        id: "sensor-015",
        name: "Temperature Sensor - Senayan",
        type: "temperature",
        status: "online",
        coordinates: { lat: -6.2190, lng: 106.8020 },
        regionId: "jk-south",
        currentReading: {
            timestamp: new Date(),
            value: 31.8,
            unit: "°C",
        },
        threshold: {
            warning: 35,
            danger: 40,
        },
        readings: generateSensorReadings(31.8, 3, 24, "°C"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    {
        id: "sensor-016",
        name: "Temperature Sensor - Slipi",
        type: "temperature",
        status: "online",
        coordinates: { lat: -6.1890, lng: 106.7950 },
        regionId: "jk-west",
        currentReading: {
            timestamp: new Date(),
            value: 33.1,
            unit: "°C",
        },
        threshold: {
            warning: 35,
            danger: 40,
        },
        readings: generateSensorReadings(33.1, 3, 24, "°C"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    {
        id: "sensor-017",
        name: "Temperature Sensor - Cakung",
        type: "temperature",
        status: "danger",
        coordinates: { lat: -6.1850, lng: 106.9400 },
        regionId: "jk-east",
        currentReading: {
            timestamp: new Date(),
            value: 41.3,
            unit: "°C",
        },
        threshold: {
            warning: 35,
            danger: 40,
        },
        readings: generateSensorReadings(41.3, 5, 24, "°C"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    // Air Quality Sensors
    {
        id: "sensor-018",
        name: "Air Quality - Bundaran HI",
        type: "air_quality",
        status: "warning",
        coordinates: { lat: -6.1950, lng: 106.8230 },
        regionId: "jk-central",
        currentReading: {
            timestamp: new Date(),
            value: 125,
            unit: "AQI",
        },
        threshold: {
            warning: 100,
            danger: 150,
        },
        readings: generateSensorReadings(125, 30, 24, "AQI"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    {
        id: "sensor-019",
        name: "Air Quality - Pluit",
        type: "air_quality",
        status: "online",
        coordinates: { lat: -6.1180, lng: 106.7970 },
        regionId: "jk-north",
        currentReading: {
            timestamp: new Date(),
            value: 78,
            unit: "AQI",
        },
        threshold: {
            warning: 100,
            danger: 150,
        },
        readings: generateSensorReadings(78, 25, 24, "AQI"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    {
        id: "sensor-020",
        name: "Air Quality - Pondok Indah",
        type: "air_quality",
        status: "online",
        coordinates: { lat: -6.2720, lng: 106.7830 },
        regionId: "jk-south",
        currentReading: {
            timestamp: new Date(),
            value: 65,
            unit: "AQI",
        },
        threshold: {
            warning: 100,
            danger: 150,
        },
        readings: generateSensorReadings(65, 20, 24, "AQI"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    {
        id: "sensor-021",
        name: "Air Quality - Kebon Jeruk",
        type: "air_quality",
        status: "danger",
        coordinates: { lat: -6.1870, lng: 106.7660 },
        regionId: "jk-west",
        currentReading: {
            timestamp: new Date(),
            value: 168,
            unit: "AQI",
        },
        threshold: {
            warning: 100,
            danger: 150,
        },
        readings: generateSensorReadings(168, 40, 24, "AQI"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    {
        id: "sensor-022",
        name: "Air Quality - Pulogadung",
        type: "air_quality",
        status: "warning",
        coordinates: { lat: -6.1880, lng: 106.9050 },
        regionId: "jk-east",
        currentReading: {
            timestamp: new Date(),
            value: 132,
            unit: "AQI",
        },
        threshold: {
            warning: 100,
            danger: 150,
        },
        readings: generateSensorReadings(132, 35, 24, "AQI"),
        lastUpdate: new Date(),
        isOnline: true,
    },
    // Offline Sensors (for testing offline status display)
    {
        id: "sensor-023",
        name: "Water Level - Muara Baru",
        type: "water_level",
        status: "offline",
        coordinates: { lat: -6.1050, lng: 106.8050 },
        regionId: "jk-north",
        currentReading: {
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
            value: 0,
            unit: "cm",
        },
        threshold: {
            warning: 300,
            danger: 400,
        },
        readings: [],
        lastUpdate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        isOnline: false,
    },
    {
        id: "sensor-024",
        name: "Temperature Sensor - Kemang",
        type: "temperature",
        status: "offline",
        coordinates: { lat: -6.2650, lng: 106.8150 },
        regionId: "jk-south",
        currentReading: {
            timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
            value: 0,
            unit: "°C",
        },
        threshold: {
            warning: 35,
            danger: 40,
        },
        readings: [],
        lastUpdate: new Date(Date.now() - 12 * 60 * 60 * 1000),
        isOnline: false,
    },
];

// Public Facilities
export const mockFacilities: Facility[] = [
    {
        id: "fac-001",
        name: "RSUD Tarakan",
        category: "health",
        coordinates: { lat: -6.1765, lng: 106.8683 },
        address: "Jl. Letjen S. Parman, Tomang, Jakarta Barat",
        regionId: "jk-central",
        description: "Rumah Sakit Umum Daerah",
        phone: "021-5681234",
        openingHours: "24 hours",
        photos: [],
        capacity: 500,
        createdAt: new Date("2020-01-01"),
        updatedAt: new Date(),
    },
    {
        id: "fac-002",
        name: "SDN Menteng 01",
        category: "education",
        coordinates: { lat: -6.1944, lng: 106.8294 },
        address: "Jl. Cikini Raya, Menteng, Jakarta Pusat",
        regionId: "jk-central",
        description: "Sekolah Dasar Negeri",
        phone: "021-3901234",
        openingHours: "07:00 - 15:00",
        photos: [],
        capacity: 600,
        createdAt: new Date("2020-01-01"),
        updatedAt: new Date(),
    },
    {
        id: "fac-003",
        name: "Masjid Istiqlal",
        category: "worship",
        coordinates: { lat: -6.1702, lng: 106.8297 },
        address: "Jl. Taman Wijaya Kusuma, Pasar Baru, Jakarta Pusat",
        regionId: "jk-central",
        description: "Masjid terbesar di Asia Tenggara",
        phone: "021-3811708",
        openingHours: "Open 24 hours",
        photos: [],
        capacity: 200000,
        createdAt: new Date("2020-01-01"),
        updatedAt: new Date(),
    },
    {
        id: "fac-004",
        name: "Taman Suropati",
        category: "park",
        coordinates: { lat: -6.1980, lng: 106.8347 },
        address: "Menteng, Jakarta Pusat",
        regionId: "jk-central",
        description: "Taman kota bersejarah",
        openingHours: "05:00 - 21:00",
        photos: [],
        createdAt: new Date("2020-01-01"),
        updatedAt: new Date(),
    },
    {
        id: "fac-005",
        name: "GOR Soemantri Brodjonegoro",
        category: "sports",
        coordinates: { lat: -6.2297, lng: 106.8060 },
        address: "Jl. Asia Afrika, Gelora, Jakarta Pusat",
        regionId: "jk-central",
        description: "Gelanggang Olahraga",
        phone: "021-5734567",
        openingHours: "06:00 - 22:00",
        photos: [],
        capacity: 5000,
        createdAt: new Date("2020-01-01"),
        updatedAt: new Date(),
    },
];

// UMKM (Small Businesses)
export const mockUMKM: UMKM[] = [
    {
        id: "umkm-001",
        name: "Warung Nasi Padang Sederhana",
        category: "food",
        coordinates: { lat: -6.2088, lng: 106.8456 },
        address: "Jl. Manggarai Utara, Jakarta Selatan",
        regionId: "jk-south",
        description: "Warung nasi padang dengan menu lengkap dan harga terjangkau",
        owner: "Ibu Siti",
        phone: "081234567890",
        socialMedia: {
            instagram: "@nasipadangsederhana",
            whatsapp: "081234567890",
        },
        openingHours: "08:00 - 21:00",
        photos: [],
        rating: 4.5,
        reviewCount: 127,
        isVerified: true,
        createdAt: new Date("2021-03-15"),
        updatedAt: new Date(),
    },
    {
        id: "umkm-002",
        name: "Toko Kelontong Berkah",
        category: "retail",
        coordinates: { lat: -6.1571, lng: 106.9056 },
        address: "Jl. Kelapa Gading, Jakarta Utara",
        regionId: "jk-north",
        description: "Toko kelontong lengkap untuk kebutuhan sehari-hari",
        owner: "Bapak Ahmad",
        phone: "081298765432",
        openingHours: "06:00 - 22:00",
        photos: [],
        rating: 4.2,
        reviewCount: 89,
        isVerified: true,
        createdAt: new Date("2020-06-01"),
        updatedAt: new Date(),
    },
    {
        id: "umkm-003",
        name: "Bengkel Motor Jaya",
        category: "services",
        coordinates: { lat: -6.2443, lng: 106.7729 },
        address: "Jl. Kebayoran Lama, Jakarta Selatan",
        regionId: "jk-south",
        description: "Bengkel motor dengan mekanik berpengalaman",
        owner: "Bapak Budi",
        phone: "081345678901",
        socialMedia: {
            whatsapp: "081345678901",
        },
        openingHours: "08:00 - 18:00",
        photos: [],
        rating: 4.7,
        reviewCount: 203,
        isVerified: true,
        createdAt: new Date("2019-11-20"),
        updatedAt: new Date(),
    },
];

// Citizen Reports
export const mockReports: Report[] = [
    {
        id: "report-001",
        title: "Jalan Berlubang di Jl. Sudirman",
        description: "Terdapat lubang besar di jalan yang membahayakan pengendara",
        category: "infrastructure",
        status: "in_progress",
        priority: "high",
        coordinates: { lat: -6.2088, lng: 106.8229 },
        address: "Jl. Jend. Sudirman, Jakarta Selatan",
        regionId: "jk-south",
        photos: [],
        reporterId: "user-001",
        reporterName: "John Doe",
        reporterPhone: "081234567890",
        assignedTo: "staff-001",
        comments: [
            {
                id: "comment-001",
                userId: "staff-001",
                userName: "Admin Jakarta",
                comment: "Laporan sudah diterima, tim akan segera ditugaskan",
                createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            },
        ],
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
        id: "report-002",
        title: "Banjir di Kelapa Gading",
        description: "Banjir setinggi 50cm akibat hujan deras",
        category: "flood",
        status: "resolved",
        priority: "high",
        coordinates: { lat: -6.1571, lng: 106.9056 },
        address: "Jl. Kelapa Gading, Jakarta Utara",
        regionId: "jk-north",
        photos: [],
        reporterId: "user-002",
        reporterName: "Jane Smith",
        reporterPhone: "081298765432",
        assignedTo: "staff-002",
        comments: [
            {
                id: "comment-002",
                userId: "staff-002",
                userName: "Tim Banjir",
                comment: "Air sudah surut, drainase sudah dibersihkan",
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            },
        ],
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
];

// Users
export const mockUsers: User[] = [
    {
        id: "user-001",
        name: "John Doe",
        email: "john@example.com",
        phone: "081234567890",
        role: "citizen",
        regionId: "jk-south",
        createdAt: new Date("2023-01-15"),
    },
    {
        id: "user-002",
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "081298765432",
        role: "citizen",
        regionId: "jk-north",
        createdAt: new Date("2023-02-20"),
    },
    {
        id: "admin-001",
        name: "Admin Jakarta",
        email: "admin@jakarta.go.id",
        phone: "021-12345678",
        role: "admin",
        createdAt: new Date("2020-01-01"),
    },
];

// Helper function to generate sensor readings
function generateSensorReadings(
    currentValue: number,
    variance: number,
    hours: number,
    unit: string
): Array<{ timestamp: Date; value: number; unit: string }> {
    const readings = [];
    const now = new Date();

    for (let i = hours; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        const randomVariance = (Math.random() - 0.5) * variance;
        const value = Math.max(0, currentValue + randomVariance);

        readings.push({
            timestamp,
            value: Math.round(value * 10) / 10,
            unit,
        });
    }

    return readings;
}

// Export all mock data
export const mockData = {
    regions: jakartaRegions,
    sensors: mockSensors,
    facilities: mockFacilities,
    umkm: mockUMKM,
    reports: mockReports,
    users: mockUsers,
};
