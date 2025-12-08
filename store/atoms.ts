import { atom } from "jotai";
import type {
    Region,
    Sensor,
    Facility,
    UMKM,
    Report,
    User,
    MapLayer,
    Alert,
} from "@/types";
import { mockData } from "@/data/mockData";

// Map state atoms
export const mapLayersAtom = atom<MapLayer[]>([
    { id: "boundaries", name: "Administrative Boundaries", type: "boundary", visible: true },
    { id: "sensors", name: "IoT Sensors", type: "marker", visible: true },
    { id: "facilities", name: "Public Facilities", type: "marker", visible: true },
    { id: "umkm", name: "UMKM Businesses", type: "marker", visible: false },
    { id: "reports", name: "Citizen Reports", type: "marker", visible: false },
]);

export const selectedRegionAtom = atom<Region | null>(null);

// Data atoms
export const regionsAtom = atom<Region[]>(mockData.regions);
export const sensorsAtom = atom<Sensor[]>(mockData.sensors);
export const facilitiesAtom = atom<Facility[]>(mockData.facilities);
export const umkmAtom = atom<UMKM[]>(mockData.umkm);
export const reportsAtom = atom<Report[]>(mockData.reports);
export const usersAtom = atom<User[]>(mockData.users);

// Current user atom (simulated authentication)
export const currentUserAtom = atom<User | null>(mockData.users[2]); // Default to admin

// Alerts atom
export const alertsAtom = atom<Alert[]>([
    {
        id: "alert-001",
        type: "danger",
        title: "High Water Level Alert",
        message: "Kali Pesanggrahan water level has reached danger threshold",
        sensorId: "sensor-003",
        regionId: "jk-south",
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        isRead: false,
    },
    {
        id: "alert-002",
        type: "warning",
        title: "Water Level Warning",
        message: "Kali Sunter water level approaching warning threshold",
        sensorId: "sensor-002",
        regionId: "jk-north",
        createdAt: new Date(Date.now() - 60 * 60 * 1000),
        isRead: false,
    },
]);

// Filter atoms
export const facilityFilterAtom = atom<string>("all");
export const umkmFilterAtom = atom<string>("all");
export const reportFilterAtom = atom<string>("all");

// Derived atoms
export const activeSensorsAtom = atom((get) => {
    const sensors = get(sensorsAtom);
    return sensors.filter((s) => s.isOnline);
});

export const criticalAlertsAtom = atom((get) => {
    const alerts = get(alertsAtom);
    return alerts.filter((a) => a.type === "danger" && !a.isRead);
});

export const filteredFacilitiesAtom = atom((get) => {
    const facilities = get(facilitiesAtom);
    const filter = get(facilityFilterAtom);

    if (filter === "all") return facilities;
    return facilities.filter((f) => f.category === filter);
});

export const filteredUMKMAtom = atom((get) => {
    const umkm = get(umkmAtom);
    const filter = get(umkmFilterAtom);

    if (filter === "all") return umkm;
    return umkm.filter((u) => u.category === filter);
});

export const filteredReportsAtom = atom((get) => {
    const reports = get(reportsAtom);
    const filter = get(reportFilterAtom);

    if (filter === "all") return reports;
    return reports.filter((r) => r.status === filter);
});
