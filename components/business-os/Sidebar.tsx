'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Target,
  DollarSign,
  Package,
  Calendar,
  Users,
  Brain,
  Heart,
  Shield,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { name: 'Dashboard', href: '/business-os', icon: LayoutDashboard },
  { name: 'SEEDS Funnel 🌱', href: '/business-os/seeds', icon: Sparkles },
  { name: '90-Day Sprint', href: '/business-os/sprint', icon: Target },
  { name: 'Revenue (PAIDS)', href: '/business-os/revenue', icon: DollarSign },
  { name: 'Product Roadmap', href: '/business-os/products', icon: Package },
  { name: 'Content Calendar', href: '/business-os/content', icon: Calendar },
  { name: 'Student Pipeline', href: '/business-os/students', icon: Users },
  { name: 'Decision Framework', href: '/business-os/decisions', icon: Brain },
  { name: 'Faith Integration', href: '/business-os/faith', icon: Heart },
  { name: 'Risk Mitigation', href: '/business-os/risks', icon: Shield },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white
          w-64 transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">NOCHILL</h1>
          <p className="text-sm text-gray-400">Business OS</p>
          <p className="text-xs text-gray-500 mt-1 italic">For children's children</p>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-6 py-3 transition-colors
                  ${isActive
                    ? 'bg-blue-600 text-white border-r-4 border-blue-400'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }
                `}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center italic">
            "You understand? Because you understand."
          </p>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
