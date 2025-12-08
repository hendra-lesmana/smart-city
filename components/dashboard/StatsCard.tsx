"use client";

import { TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber } from "@/lib/utils";
import { cn } from "@/lib/cn";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    unit?: string;
}

export default function StatsCard({ title, value, icon, trend, unit }: StatsCardProps) {
    const displayValue = typeof value === "number" ? formatNumber(value) : value;

    return (
        <div className="stats-card">
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-600 mb-1">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">
                        {displayValue}
                        {unit && <span className="text-sm text-gray-500 ml-1">{unit}</span>}
                    </p>

                    {trend && (
                        <div className="flex items-center gap-1 mt-2">
                            {trend.isPositive ? (
                                <TrendingUp className="w-4 h-4 text-success" />
                            ) : (
                                <TrendingDown className="w-4 h-4 text-danger" />
                            )}
                            <span className={cn(
                                "text-sm font-medium",
                                trend.isPositive ? "text-success" : "text-danger"
                            )}>
                                {Math.abs(trend.value)}%
                            </span>
                            <span className="text-sm text-gray-500">vs last year</span>
                        </div>
                    )}
                </div>

                {icon && (
                    <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600">
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
