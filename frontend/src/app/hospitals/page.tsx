"use client";
import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { HeartPulse, MapPin, Search, Navigation, Bed, Phone, Star, ExternalLink } from 'lucide-react';

// Dynamically import map component to avoid SSR errors with Leaflet
const DirectionsMap = dynamic(() => import('@/components/DirectionsMap'), { ssr: false });

const MOCK_HOSPITALS = [
  { id: 1, name: 'Bir Hospital',            city: 'Kathmandu', lat: 27.7041, lng: 85.3145, total_beds: 500, occupied_beds: 420, dist: 1.2, phone: '01-4221119', rating: 4.5 },
  { id: 2, name: 'Tribhuvan University TH', city: 'Kathmandu', lat: 27.7330, lng: 85.3286, total_beds: 650, occupied_beds: 510, dist: 2.8, phone: '01-4412303', rating: 4.7 },
  { id: 3, name: 'Patan Hospital',           city: 'Lalitpur',  lat: 27.6710, lng: 85.3240, total_beds: 300, occupied_beds: 190, dist: 4.1, phone: '01-5522266', rating: 4.6 },
  { id: 4, name: 'Grande International',     city: 'Kathmandu', lat: 27.7388, lng: 85.3560, total_beds: 200, occupied_beds: 140, dist: 5.3, phone: '01-5159266', rating: 4.8 },
  { id: 5, name: 'Norvic International',     city: 'Kathmandu', lat: 27.6934, lng: 85.3179, total_beds: 180, occupied_beds: 90,  dist: 6.0, phone: '01-5970032', rating: 4.4 },
  { id: 6, name: 'Manipal Teaching Hosp',   city: 'Pokhara',   lat: 28.2096, lng: 83.9856, total_beds: 750, occupied_beds: 600, dist: 200, phone: '061-526416', rating: 4.6 },
];

type Hospital = typeof MOCK_HOSPITALS[number];

export default function HospitalsPage() {
  const [search, setSearch]         = useState('');
  const [locating, setLocating]     = useState(false);
  const [located, setLocated]       = useState(false);
  const [sorted, setSorted]         = useState(MOCK_HOSPITALS);
  const [userPos, setUserPos]       = useState<{ lat: number; lng: number } | null>(null);
  const [activeMap, setActiveMap]   = useState<Hospital | null>(null);
  const [gettingDir, setGettingDir] = useState<number | null>(null);

  // Sort by distance
  const handleLocate = () => {
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserPos({ lat, lng });
        // Sort by real Haversine distance from user
        const withDist = MOCK_HOSPITALS.map(h => {
          const R = 6371;
          const dLat = ((h.lat - lat) * Math.PI) / 180;
          const dLng = ((h.lng - lng) * Math.PI) / 180;
          const a = Math.sin(dLat/2)**2 + Math.cos((lat*Math.PI)/180) * Math.cos((h.lat*Math.PI)/180) * Math.sin(dLng/2)**2;
          const dist = parseFloat((R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))).toFixed(1));
          return { ...h, dist };
        }).sort((a, b) => a.dist - b.dist);
        setSorted(withDist);
        setLocated(true);
        setLocating(false);
      },
      () => {
        // Fallback if user denies geolocation
        setUserPos({ lat: 27.7172, lng: 85.3240 }); // Kathmandu center
        setSorted([...MOCK_HOSPITALS].sort((a, b) => a.dist - b.dist));
        setLocated(true);
        setLocating(false);
      }
    );
  };

  // Get directions for a hospital
  const handleGetDirections = useCallback((h: Hospital) => {
    setGettingDir(h.id);
    if (userPos) {
      setActiveMap(h);
      setGettingDir(null);
      return;
    }
    navigator.geolocation?.getCurrentPosition(
      (pos) => {
        setUserPos({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setActiveMap(h);
        setGettingDir(null);
      },
      () => {
        setUserPos({ lat: 27.7172, lng: 85.3240 }); // Kathmandu center fallback
        setActiveMap(h);
        setGettingDir(null);
      }
    );
  }, [userPos]);

  const filtered = sorted.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.city.toLowerCase().includes(search.toLowerCase())
  );

  const getOccupancyColor = (pct: number) => {
    if (pct >= 90) return 'bg-[#DC143C]';
    if (pct >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="h-1.5 w-full bg-gradient-to-r from-[#003893] via-[#DC143C] to-[#003893]"></div>

      <header className="bg-[#003893] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <HeartPulse className="h-7 w-7 text-[#DC143C]" />
            <span className="font-black text-xl">Nepal<span className="text-[#DC143C]">Med</span></span>
          </Link>
          <Link href="/patient" className="text-sm font-bold text-blue-200 hover:text-white transition-colors">
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-[#003893] text-white pb-16 pt-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-3">Find a Hospital Near You</h1>
          <p className="text-blue-200 font-medium text-lg mb-8">
            Real-time bed availability • Free turn-by-turn directions
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search by hospital name or city..."
                className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#DC143C]" />
            </div>
            <button onClick={handleLocate} disabled={locating}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-[#DC143C] text-white font-black rounded-xl hover:bg-[#b01030] transition-all shadow-lg border-b-4 border-[#b01030] active:border-b-0 active:translate-y-1 disabled:opacity-70 whitespace-nowrap">
              <Navigation className={`h-5 w-5 ${locating ? 'animate-spin' : ''}`} />
              {locating ? 'Locating...' : 'Nearest First'}
            </button>
          </div>
          {located && (
            <p className="mt-4 text-sm font-bold text-emerald-300 flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Location found! Sorted by distance from you.
            </p>
          )}
        </div>
      </div>

      {/* Hospital Cards */}
      <main className="max-w-7xl mx-auto px-4 -mt-6 pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((h, i) => {
            const pct = Math.round((h.occupied_beds / h.total_beds) * 100);
            const avail = h.total_beds - h.occupied_beds;
            const isNearest = i === 0 && located;
            const isGettingDir = gettingDir === h.id;

            return (
              <div key={h.id} className={`bg-white rounded-2xl border-2 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden ${isNearest ? 'border-[#DC143C]/40 ring-2 ring-[#DC143C]/20' : 'border-slate-100'}`}>

                {/* Nearest badge */}
                {isNearest && (
                  <div className="bg-[#DC143C] text-white text-center text-xs font-black py-1.5 uppercase tracking-widest flex items-center justify-center gap-2">
                    <Navigation className="h-3 w-3" /> Nearest to You
                  </div>
                )}

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-black text-[#003893] text-lg leading-tight">{h.name}</h3>
                      <p className="text-sm text-slate-500 font-medium flex items-center gap-1 mt-1">
                        <MapPin className="h-3.5 w-3.5" /> {h.city}
                        {located && <span className="text-[#DC143C] font-bold ml-1">• {h.dist} km</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                      <span className="text-sm font-black text-slate-700">{h.rating}</span>
                    </div>
                  </div>

                  {/* Occupancy */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bed Occupancy</span>
                      <span className={`text-xs font-black px-2 py-0.5 rounded-full ${pct >= 90 ? 'bg-red-100 text-[#DC143C]' : pct >= 70 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>{pct}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${getOccupancyColor(pct)} transition-all`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  {/* Bed counts */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                      <p className="text-2xl font-black text-[#003893]">{avail}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase">Available</p>
                    </div>
                    <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                      <p className="text-2xl font-black text-slate-700">{h.total_beds}</p>
                      <p className="text-xs font-bold text-slate-400 uppercase">Total</p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2 mb-2">
                    <a href={`tel:${h.phone}`}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border-2 border-[#003893]/20 text-[#003893] rounded-xl text-sm font-bold hover:bg-[#003893]/5 transition-colors">
                      <Phone className="h-4 w-4" /> Call
                    </a>
                    <button
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#003893] text-white rounded-xl text-sm font-bold hover:bg-[#002870] transition-colors">
                      <Bed className="h-4 w-4" /> Book Bed
                    </button>
                  </div>

                  {/* Get Directions button */}
                  <button
                    onClick={() => handleGetDirections(h)}
                    disabled={isGettingDir}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#DC143C] text-white rounded-xl text-sm font-black hover:bg-[#b01030] transition-all border-b-2 border-[#b01030] active:border-b-0 active:translate-y-0.5 disabled:opacity-70"
                  >
                    {isGettingDir ? (
                      <><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Getting Location...</>
                    ) : (
                      <><ExternalLink className="h-4 w-4" /> Get Directions</>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-400 font-medium mt-8">
          Map data © <a href="https://www.openstreetmap.org/copyright" className="underline hover:text-slate-600" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors • Routing by OSRM • 100% free, no API key required
        </p>
      </main>

      {/* Directions Map Modal */}
      {activeMap && userPos && (
        <DirectionsMap
          hospital={{ name: activeMap.name, lat: activeMap.lat, lng: activeMap.lng }}
          userLat={userPos.lat}
          userLng={userPos.lng}
          onClose={() => setActiveMap(null)}
        />
      )}
    </div>
  );
}
