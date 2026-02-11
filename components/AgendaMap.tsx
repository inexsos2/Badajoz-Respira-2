
import React, { useEffect, useRef } from 'react';
// @ts-ignore
import L from 'leaflet';
import { AgendaEvent, Category } from '../types';

interface AgendaMapProps {
  events: AgendaEvent[];
}

const AgendaMap: React.FC<AgendaMapProps> = ({ events }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Initialize Map
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      // Center on Badajoz approx initially
      const map = L.map(mapContainerRef.current).setView([38.8794, -6.9707], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapInstanceRef.current = map;
    }
    
    // Invalidate size on mount/updates to ensure proper rendering inside flex/grid containers
    setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
    }, 200);

  }, []);

  // Update Markers when events change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Category Colors Helper
    const getCategoryColor = (cat: Category) => {
        switch (cat) {
            case Category.Salud: return 'bg-red-500';
            case Category.Deporte: return 'bg-blue-500';
            case Category.Naturaleza: return 'bg-emerald-500';
            case Category.Cultura: return 'bg-purple-600';
            case Category.Sostenibilidad: return 'bg-amber-500';
            default: return 'bg-gray-500';
        }
    };

    const getCategoryIcon = (cat: Category) => {
        switch (cat) {
            case Category.Salud: return '❤️';
            case Category.Deporte: return '🏃';
            case Category.Naturaleza: return '🌳';
            case Category.Cultura: return '🎭';
            case Category.Sostenibilidad: return '♻️';
            default: return '📅';
        }
    };

    // Create custom icon for Events
    const createCustomIcon = (category: Category) => {
        const colorClass = getCategoryColor(category);
        const iconChar = getCategoryIcon(category);
        
        return L.divIcon({
          className: 'custom-marker',
          html: `
            <div class="relative group">
                <div class="w-8 h-8 ${colorClass} rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-sm transform transition-transform group-hover:scale-110">
                  ${iconChar}
                </div>
                <div class="w-2 h-2 bg-gray-900 rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-30 shadow-sm"></div>
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32]
        });
    };

    const latLngs: [number, number][] = [];

    // Add new markers
    events.forEach(event => {
      // Only map events with coordinates
      if (event.lat !== undefined && event.lng !== undefined) {
          const marker = L.marker([event.lat, event.lng], {
            icon: createCustomIcon(event.category)
          }).addTo(map);

          const popupContent = `
            <div class="p-1 font-sans min-w-[200px]">
                <div class="flex items-center gap-2 mb-2">
                    <span class="${getCategoryColor(event.category)} text-white text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">${event.category}</span>
                </div>
                <h3 class="font-bold text-base text-gray-900 leading-tight mb-1">${event.title}</h3>
                <div class="text-xs text-gray-500 mb-2 flex flex-col gap-1">
                    <span>🗓 ${event.date}</span>
                    <span>⏰ ${event.startTime} - ${event.endTime || '?'}</span>
                    <span>📍 ${event.location}</span>
                </div>
            </div>
          `;

          marker.bindPopup(popupContent);
          markersRef.current.push(marker);
          latLngs.push([event.lat, event.lng]);
      }
    });

    // Auto Zoom to bounds if there are markers
    if (latLngs.length > 0) {
        const bounds = L.latLngBounds(latLngs);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }

  }, [events]);

  return (
    <div className="relative w-full h-full min-h-full rounded-[30px] overflow-hidden shadow-inner border border-gray-200 z-0">
       <div ref={mapContainerRef} className="w-full h-full z-0" style={{ zIndex: 0 }} />
    </div>
  );
};

export default AgendaMap;
