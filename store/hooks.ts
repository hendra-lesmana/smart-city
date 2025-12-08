import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
    mapLayersAtom,
    selectedRegionAtom,
    sensorsAtom,
    facilitiesAtom,
    umkmAtom,
    reportsAtom,
    currentUserAtom,
    alertsAtom,
    facilityFilterAtom,
    umkmFilterAtom,
    reportFilterAtom,
    activeSensorsAtom,
    criticalAlertsAtom,
    filteredFacilitiesAtom,
    filteredUMKMAtom,
    filteredReportsAtom,
} from "./atoms";

// Map hooks
export const useMapLayers = () => useAtom(mapLayersAtom);
export const useSelectedRegion = () => useAtom(selectedRegionAtom);

// Data hooks
export const useSensors = () => useAtom(sensorsAtom);
export const useFacilities = () => useAtom(facilitiesAtom);
export const useUMKM = () => useAtom(umkmAtom);
export const useReports = () => useAtom(reportsAtom);

// User hooks
export const useCurrentUser = () => useAtom(currentUserAtom);

// Alert hooks
export const useAlerts = () => useAtom(alertsAtom);
export const useCriticalAlerts = () => useAtomValue(criticalAlertsAtom);

// Filter hooks
export const useFacilityFilter = () => useAtom(facilityFilterAtom);
export const useUMKMFilter = () => useAtom(umkmFilterAtom);
export const useReportFilter = () => useAtom(reportFilterAtom);

// Derived data hooks
export const useActiveSensors = () => useAtomValue(activeSensorsAtom);
export const useFilteredFacilities = () => useAtomValue(filteredFacilitiesAtom);
export const useFilteredUMKM = () => useAtomValue(filteredUMKMAtom);
export const useFilteredReports = () => useAtomValue(filteredReportsAtom);

// Toggle layer visibility
export const useToggleLayer = () => {
    const [layers, setLayers] = useMapLayers();

    return (layerId: string) => {
        setLayers(
            layers.map((layer) =>
                layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
            )
        );
    };
};

// Mark alert as read
export const useMarkAlertAsRead = () => {
    const [alerts, setAlerts] = useAlerts();

    return (alertId: string) => {
        setAlerts(
            alerts.map((alert) =>
                alert.id === alertId ? { ...alert, isRead: true } : alert
            )
        );
    };
};
