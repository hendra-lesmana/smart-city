"use client";

import { useEffect, useRef } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Sensor } from "@/types";
import { format } from "date-fns";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface SensorChartProps {
    sensor: Sensor;
    height?: number;
}

// Get color based on sensor status
function getChartColors(status: string): { line: string; fill: string; point: string } {
    switch (status) {
        case "danger":
            return { line: "#ef4444", fill: "rgba(239, 68, 68, 0.1)", point: "#dc2626" };
        case "warning":
            return { line: "#f59e0b", fill: "rgba(245, 158, 11, 0.1)", point: "#d97706" };
        case "offline":
            return { line: "#6b7280", fill: "rgba(107, 114, 128, 0.1)", point: "#4b5563" };
        default:
            return { line: "#22c55e", fill: "rgba(34, 197, 94, 0.1)", point: "#16a34a" };
    }
}

export default function SensorChart({ sensor, height = 200 }: SensorChartProps) {
    const chartRef = useRef<ChartJS<"line">>(null);
    const colors = getChartColors(sensor.status);

    // Prepare chart data from sensor readings
    const labels = sensor.readings.map((reading) =>
        format(new Date(reading.timestamp), "HH:mm")
    );

    const values = sensor.readings.map((reading) => reading.value);

    const data = {
        labels,
        datasets: [
            {
                label: `${sensor.name} (${sensor.currentReading.unit})`,
                data: values,
                borderColor: colors.line,
                backgroundColor: colors.fill,
                pointBackgroundColor: colors.point,
                pointBorderColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                fill: true,
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                titleColor: "#fff",
                bodyColor: "#fff",
                padding: 12,
                cornerRadius: 8,
                displayColors: false,
                callbacks: {
                    label: function (context: any) {
                        return `${context.parsed.y} ${sensor.currentReading.unit}`;
                    },
                },
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: "#9ca3af",
                    font: { size: 10 },
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 8,
                },
            },
            y: {
                grid: {
                    color: "rgba(156, 163, 175, 0.2)",
                },
                ticks: {
                    color: "#9ca3af",
                    font: { size: 10 },
                },
                suggestedMin: Math.min(...values) * 0.9,
                suggestedMax: Math.max(...values) * 1.1,
            },
        },
        interaction: {
            intersect: false,
            mode: "index" as const,
        },
    };

    // Draw threshold lines
    useEffect(() => {
        const chart = chartRef.current;
        if (!chart) return;

        const warningPlugin = {
            id: "thresholdLines",
            afterDraw: (chart: ChartJS) => {
                const ctx = chart.ctx;
                const yAxis = chart.scales.y;
                const xAxis = chart.scales.x;

                // Warning threshold line
                const warningY = yAxis.getPixelForValue(sensor.threshold.warning);
                ctx.save();
                ctx.strokeStyle = "#f59e0b";
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(xAxis.left, warningY);
                ctx.lineTo(xAxis.right, warningY);
                ctx.stroke();
                ctx.restore();

                // Danger threshold line
                const dangerY = yAxis.getPixelForValue(sensor.threshold.danger);
                ctx.save();
                ctx.strokeStyle = "#ef4444";
                ctx.lineWidth = 1;
                ctx.setLineDash([5, 5]);
                ctx.beginPath();
                ctx.moveTo(xAxis.left, dangerY);
                ctx.lineTo(xAxis.right, dangerY);
                ctx.stroke();
                ctx.restore();
            },
        };

        ChartJS.register(warningPlugin);

        return () => {
            ChartJS.unregister(warningPlugin);
        };
    }, [sensor.threshold]);

    if (sensor.readings.length === 0) {
        return (
            <div
                className="flex items-center justify-center bg-gray-50 rounded-lg"
                style={{ height }}
            >
                <p className="text-gray-500 text-sm">No reading data available</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-semibold text-gray-900">
                    24-Hour History
                </h4>
                <div className="flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-1">
                        <span className="w-4 h-0.5 bg-warning" style={{ borderStyle: "dashed" }}></span>
                        <span className="text-gray-500">Warning: {sensor.threshold.warning}{sensor.currentReading.unit}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className="w-4 h-0.5 bg-danger" style={{ borderStyle: "dashed" }}></span>
                        <span className="text-gray-500">Danger: {sensor.threshold.danger}{sensor.currentReading.unit}</span>
                    </div>
                </div>
            </div>
            <div style={{ height }}>
                <Line ref={chartRef} data={data} options={options} />
            </div>
        </div>
    );
}
