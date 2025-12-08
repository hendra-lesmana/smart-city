"use client";

import { Layers } from "lucide-react";
import { useMapLayers, useToggleLayer } from "@/store/hooks";
import { cn } from "@/lib/cn";

export default function LayerControl() {
    const [layers] = useMapLayers();
    const toggleLayer = useToggleLayer();

    return (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-panel p-4 w-64 z-10">
            <div className="flex items-center gap-2 mb-3">
                <Layers className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Map Layers</h3>
            </div>

            <div className="space-y-2">
                {layers.map((layer) => (
                    <label
                        key={layer.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                    >
                        <input
                            type="checkbox"
                            checked={layer.visible}
                            onChange={() => toggleLayer(layer.id)}
                            className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                        />
                        <span className={cn(
                            "text-sm",
                            layer.visible ? "text-gray-900 font-medium" : "text-gray-500"
                        )}>
                            {layer.name}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}
