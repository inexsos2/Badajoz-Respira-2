
import React, { useEffect, useRef } from 'react';
// @ts-ignore
import L from 'leaflet';
import { Resource } from '../types';

interface ResourceMapProps {
  resources: Resource[];
}

const ResourceMap: React.FC<ResourceMapProps> = ({ resources }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Initialize Map
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      // Center on Badajoz approx
      const map = L.map(mapContainerRef.current).setView([38.8794, -6.9707], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }
  }, []);

  // Update Markers when resources change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Create custom icon
    const createCustomIcon = (type: string) => {
        return L.divIcon({
          className: 'custom-marker',
          html: `
            <div class="relative group">
                <div class="w-8 h-8 bg-emerald-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-lg transform transition-transform group-hover:scale-110">
                  📍
                </div>
                <div class="w-2 h-2 bg-emerald-700 rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-50 shadow-sm"></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        });
    };

    // Add new markers
    resources.forEach(resource => {
      const marker = L.marker([resource.lat, resource.lng], {
        icon: createCustomIcon(resource.category)
      }).addTo(map);

      const popupContent = `
        <div class="p-1 font-sans">
            <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">${resource.category}</span>
            <h3 class="font-bold text-base text-gray-900 leading-tight mb-1">${resource.name}</h3>
            <p class="text-xs text-gray-500 mb-2">${resource.address}</p>
            <p class="text-sm text-gray-700 mb-3">${resource.description}</p>
            <div class="flex flex-wrap gap-1">
                ${resource.tags.map(tag => 
                    `<span class="bg-gray-100 text-gray-600 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">${tag}</span>`
                ).join('')}
            </div>
        </div>
      `;

      marker.bindPopup(popupContent);
      markersRef.current.push(marker);
    });

  }, [resources]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-[30px] overflow-hidden shadow-inner border border-gray-200 z-0">
       <div ref={mapContainerRef} className="w-full h-full z-0" style={{ zIndex: 0 }} />
    </div>
  );
};

export default ResourceMap;
