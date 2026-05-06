import Link from 'next/link';
import { ArrowRight, Activity, MapPin, ShieldCheck, HeartPulse, Mountain } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#DC143C] selection:text-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b-4 border-[#003893]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-8 w-8 text-[#DC143C]" />
            <span className="font-extrabold text-2xl tracking-tight text-[#003893]">
              Nepal<span className="text-[#DC143C]">Med</span>
            </span>
          </div>
          <nav className="hidden md:flex gap-8 font-semibold">
            <a href="#features" className="text-[#003893] hover:text-[#DC143C] transition-colors">Features</a>
            <a href="#hospitals" className="text-[#003893] hover:text-[#DC143C] transition-colors">Find Hospital</a>
            <a href="#about" className="text-[#003893] hover:text-[#DC143C] transition-colors">About Us</a>
          </nav>
          <div className="flex gap-4">
            <Link href="/login" className="px-4 py-2 font-bold text-[#003893] hover:text-[#DC143C] transition-colors">
              Log in
            </Link>
            <Link href="/register" className="px-5 py-2 font-bold bg-[#DC143C] text-white rounded-lg hover:bg-[#b01030] transition-colors shadow-md shadow-[#DC143C]/20 border-b-4 border-[#b01030] active:border-b-0 active:translate-y-1">
              Sign up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 relative overflow-hidden">
        
        {/* Decorative Background Elements */}
        <div className="absolute top-20 right-0 opacity-5 pointer-events-none">
          <Mountain className="h-96 w-96 text-[#003893]" />
        </div>
        
        <div className="flex-1 space-y-8 text-center md:text-left relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border-2 border-[#003893] bg-[#003893]/5 text-[#003893] font-bold text-sm tracking-wide shadow-sm">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC143C] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#DC143C]"></span>
            </span>
            National Health Grid Active
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-[#003893]">
            Healthcare <span className="text-[#DC143C]">Unified.</span><br/>
            For all of Nepal.
          </h1>
          <p className="text-xl text-slate-700 max-w-2xl mx-auto md:mx-0 font-medium leading-relaxed">
            Real-time bed tracking, seamless digital appointments, and a unified health record system bringing world-class healthcare accessibility to every citizen from the Himalayas to the Terai.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Link href="/hospitals" className="flex items-center justify-center gap-2 px-8 py-4 bg-[#003893] text-white font-bold rounded-xl hover:bg-[#002870] transition-all shadow-lg shadow-[#003893]/30 text-lg border-b-4 border-[#001850] active:border-b-0 active:translate-y-1">
              <MapPin className="h-5 w-5" /> Find Nearest Hospital
            </Link>
            <Link href="/register" className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#003893] font-bold rounded-xl border-2 border-[#003893] hover:bg-[#003893]/5 transition-all text-lg shadow-sm">
              Patient Registration <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
        
        <div className="flex-1 relative z-10 w-full max-w-md mx-auto">
          {/* Flag-inspired decorative backdrop */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#003893]/10 to-[#DC143C]/10 rounded-3xl blur-2xl transform rotate-3 scale-105"></div>
          
          <div className="relative bg-white p-8 rounded-3xl shadow-2xl border-2 border-[#003893]/10 grid gap-6">
            <div className="flex items-center gap-4 border-b-2 border-slate-100 pb-6">
              <div className="h-14 w-14 rounded-2xl bg-[#DC143C]/10 flex items-center justify-center border border-[#DC143C]/20 shadow-inner">
                <Activity className="h-7 w-7 text-[#DC143C]" />
              </div>
              <div>
                <h3 className="font-bold text-xl text-[#003893]">Live Occupancy</h3>
                <p className="text-sm font-medium text-slate-500">Kathmandu Valley Network</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">ICU Beds</p>
                <p className="text-4xl font-black text-[#003893]">42 <span className="text-sm font-bold text-[#DC143C]">left</span></p>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-wider">General Ward</p>
                <p className="text-4xl font-black text-[#003893]">156 <span className="text-sm font-bold text-green-600">left</span></p>
              </div>
            </div>
            <div className="pt-4 text-center">
              <Link href="/government" className="inline-flex items-center gap-2 text-[#003893] font-bold hover:text-[#DC143C] transition-colors py-2 px-4 rounded-lg hover:bg-[#003893]/5">
                Ministry Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white border-t-4 border-[#DC143C]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-6 text-[#003893]">Empowering the Healthcare Ecosystem</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto font-medium">A unified, secure platform built for patients, doctors, hospitals, and the Government of Nepal.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border-2 border-slate-100 hover:border-[#DC143C]/30 hover:shadow-xl hover:shadow-[#DC143C]/5 transition-all group">
              <div className="h-16 w-16 bg-white shadow-md border border-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-8 w-8 text-[#DC143C]" />
              </div>
              <h3 className="text-2xl font-black mb-3 text-[#003893]">Strict KYC</h3>
              <p className="text-slate-600 font-medium leading-relaxed">Ensuring highest quality of care. All doctors and hospitals undergo strict verification with the Nepal Medical Council (NMC).</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border-2 border-slate-100 hover:border-[#003893]/30 hover:shadow-xl hover:shadow-[#003893]/5 transition-all group">
              <div className="h-16 w-16 bg-white shadow-md border border-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Activity className="h-8 w-8 text-[#003893]" />
              </div>
              <h3 className="text-2xl font-black mb-3 text-[#003893]">Live Analytics</h3>
              <p className="text-slate-600 font-medium leading-relaxed">Real-time statistics engine for the MoHP to monitor admission trends, resource allocation, and public health metrics instantly.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border-2 border-slate-100 hover:border-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/5 transition-all group">
              <div className="h-16 w-16 bg-white shadow-md border border-slate-100 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <MapPin className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-black mb-3 text-[#003893]">Geolocation</h3>
              <p className="text-slate-600 font-medium leading-relaxed">One-click 'Nearest Hospital' locator instantly connects emergency patients to facilities with available specific resources.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
