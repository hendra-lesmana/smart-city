// Geographic types
export interface Coordinates {
    lat: number;
    lng: number;
}

export interface GeoJSONFeature {
    type: "Feature";
    properties: Record<string, any>;
    geometry: {
        type: string;
        coordinates: any;
    };
}

export interface GeoJSONFeatureCollection {
    type: "FeatureCollection";
    features: GeoJSONFeature[];
}

// Region types
export interface Region {
    id: string;
    name: string;
    type: "province" | "city" | "kecamatan" | "kelurahan";
    parentId?: string;
    population: number;
    area: number; // in km²
    density: number; // people per km²
    coordinates: Coordinates;
    boundary?: GeoJSONFeature;
    demographics?: {
        malePopulation: number;
        femalePopulation: number;
        ageGroups: {
            "0-14": number;
            "15-64": number;
            "65+": number;
        };
    };
}

// IoT Sensor types
export type SensorType = "water_level" | "rainfall" | "temperature" | "air_quality";
export type SensorStatus = "online" | "warning" | "danger" | "offline";

export interface SensorReading {
    timestamp: Date;
    value: number;
    unit: string;
}

export interface Sensor {
    id: string;
    name: string;
    type: SensorType;
    status: SensorStatus;
    coordinates: Coordinates;
    regionId: string;
    currentReading: SensorReading;
    threshold: {
        warning: number;
        danger: number;
    };
    readings: SensorReading[];
    lastUpdate: Date;
    isOnline: boolean;
}

// Facility types
export type FacilityCategory =
    | "education"
    | "health"
    | "worship"
    | "government"
    | "sports"
    | "park"
    | "other";

export interface Facility {
    id: string;
    name: string;
    category: FacilityCategory;
    coordinates: Coordinates;
    address: string;
    regionId: string;
    description?: string;
    phone?: string;
    email?: string;
    website?: string;
    openingHours?: string;
    photos?: string[];
    capacity?: number;
    createdAt: Date;
    updatedAt: Date;
}

// UMKM (Small Business) types
export type UMKMCategory =
    | "food"
    | "retail"
    | "services"
    | "crafts"
    | "technology"
    | "other";

export interface UMKM {
    id: string;
    name: string;
    category: UMKMCategory;
    coordinates: Coordinates;
    address: string;
    regionId: string;
    description: string;
    owner: string;
    phone: string;
    email?: string;
    website?: string;
    socialMedia?: {
        instagram?: string;
        facebook?: string;
        whatsapp?: string;
    };
    openingHours: string;
    photos: string[];
    rating?: number;
    reviewCount?: number;
    isVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Citizen Report types
export type ReportCategory =
    | "infrastructure"
    | "flood"
    | "crime"
    | "waste"
    | "traffic"
    | "other";

export type ReportStatus =
    | "submitted"
    | "verified"
    | "in_progress"
    | "resolved"
    | "rejected";

export interface ReportComment {
    id: string;
    userId: string;
    userName: string;
    comment: string;
    createdAt: Date;
}

export interface Report {
    id: string;
    title: string;
    description: string;
    category: ReportCategory;
    status: ReportStatus;
    priority: "low" | "medium" | "high";
    coordinates: Coordinates;
    address: string;
    regionId: string;
    photos: string[];
    reporterId: string;
    reporterName: string;
    reporterPhone?: string;
    assignedTo?: string;
    comments: ReportComment[];
    createdAt: Date;
    updatedAt: Date;
    resolvedAt?: Date;
}

// User types
export type UserRole = "admin" | "staff" | "citizen";

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: UserRole;
    regionId?: string;
    avatar?: string;
    createdAt: Date;
}

// Map Layer types
export interface MapLayer {
    id: string;
    name: string;
    type: "boundary" | "marker" | "heatmap" | "polygon";
    visible: boolean;
    data?: any;
    style?: any;
}

// Chart Data types
export interface ChartDataset {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
    fill?: boolean;
}

export interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
}

// Alert types
export interface Alert {
    id: string;
    type: "info" | "warning" | "danger" | "success";
    title: string;
    message: string;
    sensorId?: string;
    regionId?: string;
    createdAt: Date;
    isRead: boolean;
}

// Statistics types
export interface RegionStatistics {
    regionId: string;
    population: number;
    populationGrowth: number; // percentage
    gdpPerCapita: number;
    gdpGrowth: number; // percentage
    agingIndex: number;
    activeSensors: number;
    totalFacilities: number;
    totalUMKM: number;
    openReports: number;
}
