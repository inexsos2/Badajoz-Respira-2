
import React, { useEffect, useRef } from 'react';
// @ts-ignore
import L from 'leaflet';
import { Category } from '../types';

interface LocationPickerProps {
  lat: number | undefined;
  lng: number | undefined;
  onLocationSelect: (lat: number, lng: number) => void;
  category?: Category | string;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ lat, lng, onLocationSelect, category }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  
  // Use ref to keep track of the latest callback without re-binding map events
  const onLocationSelectRef = useRef(onLocationSelect);

  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  const getCategoryStyles = (cat?: string) => {
    switch (cat) {
        case Category.Salud: return { color: 'bg-red-500', icon: '❤️' };
        case Category.Deporte: return { color: 'bg-blue-500', icon: '🏃' };
        case Category.Naturaleza: return { color: 'bg-green-500', icon: '🌳' };
        case Category.Cultura: return { color: 'bg-purple-500', icon: '🎭' };
        case Category.Sostenibilidad: return { color: 'bg-yellow-500', icon: '♻️' };
        default: return { color: 'bg-emerald-500', icon: '📍' };
    }
  };

  const createCustomIcon = (cat?: string) => {
    const style = getCategoryStyles(cat);
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="relative group">
            <div class="w-8 h-8 ${style.color} rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-lg transform transition-transform group-hover:scale-110">
              ${style.icon}
            </div>
            <div class="w-2 h-2 ${style.color.replace('500', '700')} rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2 opacity-50 shadow-sm"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
  };

  // Initialize Map
  useEffect(() => {
    if (mapContainerRef.current && !mapInstanceRef.current) {
      // Default center Badajoz
      const defaultLat = 38.8794;
      const defaultLng = -6.9707;
      
      const map = L.map(mapContainerRef.current).setView([lat || defaultLat, lng || defaultLng], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add Click Listener using the Ref
      map.on('click', (e: any) => {
        if (onLocationSelectRef.current) {
            onLocationSelectRef.current(e.latlng.lat, e.latlng.lng);
        }
      });

      mapInstanceRef.current = map;
    }
  }, []); // Only run once on mount

  // Update Marker when coordinates or category change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // If marker exists, remove it
    if (markerRef.current) {
      markerRef.current.remove();
      markerRef.current = null;
    }

    // Add marker if lat/lng are present and valid
    if (lat !== undefined && lng !== undefined) {
      markerRef.current = L.marker([lat, lng], {
        icon: createCustomIcon(category as string)
      }).addTo(map);
      
      // Auto-center map if coordinates change externally (e.g. from Geocoding search)
      map.setView([lat, lng], 16, { animate: true });
    }
  }, [lat, lng, category]);

  // Invalidate size to fix rendering issues
  useEffect(() => {
      setTimeout(() => {
          mapInstanceRef.current?.invalidateSize();
      }, 100);
  }, [lat, lng]);

  return (
    <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-inner border-2 border-dashed border-gray-300 group hover:border-emerald-400 transition-colors">
       <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }} />
       {(lat === undefined || lng === undefined) && (
           <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-black/5 text-gray-500 font-medium text-xs z-10">
               Haz clic en el mapa para marcar la ubicación exacta
           </div>
       )}
    </div>
  );
};

export default LocationPicker;
