"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Stethoscope, Building2, ShieldCheck, Home, LogIn, MapPin } from 'lucide-react';

const PAGES = [
  { name: 'Home',      href: '/',           icon: Home },
  { name: 'Login',     href: '/login',      icon: LogIn },
  { name: 'Register',  href: '/register',   icon: ShieldCheck },
  { name: 'Patient',   href: '/patient',    icon: Users },
  { name: 'Doctor',    href: '/doctor',     icon: Stethoscope },
  { name: 'Admin',     href: '/admin',      icon: LayoutDashboard },
  { name: 'Gov',       href: '/government', icon: Building2 },
  { name: 'Hospitals', href: '/hospitals',  icon: MapPin },
];

export default function DevNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end gap-2 group">
      <div className="flex flex-col gap-2 scale-0 group-hover:scale-100 origin-bottom-right transition-all duration-300 pointer-events-none group-hover:pointer-events-auto">
        {PAGES.map(({ name, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link 
              key={href} 
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-black transition-all bg-white border-2 shadow-xl ${
                isActive 
                  ? 'border-[#DC143C] text-[#DC143C]' 
                  : 'border-[#003893]/10 text-[#003893] hover:border-[#003893]/40'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{name}</span>
            </Link>
          );
        })}
      </div>
      <div className="flex items-center gap-3 px-5 py-3 bg-[#003893] text-white rounded-2xl shadow-2xl cursor-pointer hover:bg-[#002870] transition-all border-b-4 border-[#001850] active:border-b-0 active:translate-y-1">
        <LayoutDashboard className="h-5 w-5" />
        <span className="font-black text-xs uppercase tracking-widest">Page Navigator</span>
      </div>
    </div>
  );
}
