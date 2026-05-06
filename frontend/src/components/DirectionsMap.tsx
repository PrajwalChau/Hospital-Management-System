"use client";
import { useEffect, useRef } from 'react';

interface Hospital {
  name: string;
  lat: number;
  lng: number;
}

interface DirectionsMapProps {
  hospital: Hospital;
  userLat: number;
  userLng: number;
  onClose: () => void;
}

export default function DirectionsMap({ hospital, userLat, userLng, onClose }: DirectionsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically import leaflet to avoid SSR issues
    const initMap = async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');

      if (!mapRef.current || mapInstanceRef.current) return;

      // Fix default icon paths broken by webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      const map = L.map(mapRef.current).setView(
        [(userLat + hospital.lat) / 2, (userLng + hospital.lng) / 2],
        13
      );
      mapInstanceRef.current = map;

      // OpenStreetMap tiles - 100% free, no API key
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // User marker (blue)
      const userIcon = L.divIcon({
        html: `<div style="
          width:18px; height:18px; border-radius:50%;
          background:#003893; border:3px solid white;
          box-shadow:0 0 0 3px rgba(0,56,147,0.3);
        "></div>`,
        className: '',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      });

      // Hospital marker (red)
      const hospIcon = L.divIcon({
        html: `<div style="
          width:22px; height:22px; border-radius:50%;
          background:#DC143C; border:3px solid white;
          box-shadow:0 0 0 3px rgba(220,20,60,0.3);
          display:flex; align-items:center; justify-content:center;
        ">
          <svg viewBox="0 0 24 24" fill="white" width="12" height="12">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          </svg>
        </div>`,
        className: '',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });

      L.marker([userLat, userLng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<b>📍 Your Location</b>')
        .openPopup();

      L.marker([hospital.lat, hospital.lng], { icon: hospIcon })
        .addTo(map)
        .bindPopup(`<b>🏥 ${hospital.name}</b>`);

      // Fetch route from OSRM (free, no API key needed)
      try {
        const res = await fetch(
          `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${hospital.lng},${hospital.lat}?overview=full&geometries=geojson`
        );
        const data = await res.json();

        if (data.routes?.[0]) {
          const route = data.routes[0];
          const coords = route.geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);

          // Draw the route polyline
          L.polyline(coords, {
            color: '#003893',
            weight: 5,
            opacity: 0.8,
          }).addTo(map);

          // Fit map to route
          const bounds = L.latLngBounds(coords);
          map.fitBounds(bounds, { padding: [40, 40] });

          // Distance + duration info
          const distKm = (route.distance / 1000).toFixed(1);
          const durMin = Math.round(route.duration / 60);
          L.popup()
            .setLatLng([(userLat + hospital.lat) / 2, (userLng + hospital.lng) / 2])
            .setContent(`
              <div style="font-family:sans-serif; text-align:center; padding:4px">
                <b style="color:#003893">🛣 ${distKm} km</b> &nbsp;|&nbsp;
                <b style="color:#DC143C">⏱ ~${durMin} min</b>
              </div>`)
            .openOn(map);
        }
      } catch {
        // Fallback: draw straight line
        L.polyline([[userLat, userLng], [hospital.lat, hospital.lng]], {
          color: '#DC143C',
          weight: 3,
          dashArray: '6 6',
        }).addTo(map);
        map.fitBounds([[userLat, userLng], [hospital.lat, hospital.lng]], { padding: [40, 40] });
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [hospital, userLat, userLng]);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden border-2 border-slate-100">
        {/* Modal Header */}
        <div className="bg-[#003893] text-white px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="font-black text-lg">Directions to {hospital.name}</h2>
            <p className="text-blue-200 text-xs font-medium mt-0.5">
              Powered by OpenStreetMap + OSRM • 100% Free
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={`https://www.google.com/maps/dir/${userLat},${userLng}/${hospital.lat},${hospital.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-xs font-bold transition-colors"
            >
              Open in Google Maps ↗
            </a>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-[#DC143C] hover:bg-[#b01030] rounded-full flex items-center justify-center font-black transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="px-6 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-6 text-xs font-bold">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#003893] border-2 border-white shadow"></span> Your Location
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#DC143C] border-2 border-white shadow"></span> {hospital.name}
          </span>
          <span className="flex items-center gap-2">
            <span className="w-6 h-0.5 bg-[#003893] inline-block"></span> Route
          </span>
        </div>

        {/* Map */}
        <div ref={mapRef} style={{ height: '450px', width: '100%' }} />
      </div>
    </div>
  );
}
