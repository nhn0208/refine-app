'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Album, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navItems: NavItem[] = [
  { name: 'Albums', href: '/albums', icon: Album },
  { name: 'Users', href: '/users', icon: Users },
];

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar = ({isOpen,setIsOpen} : SidebarProps) => {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-5 pt-22 h-full flex flex-col bg-white shadow-lg transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-14'
      }`}
    >
      {/* Navigation */}
      <nav className="flex-1 px-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center p-2 rounded-md mb-2 transition-colors ${
              pathname === item.href || pathname.startsWith(item.href)
                ? 'bg-blue-300 text-blue-800'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            <item.icon className="w-6 h-6 flex-shrink-0" />
            <span className={`ml-3 ${isOpen ? 'block' : 'hidden'}`}>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Toggle Button */}
      <div className={`p-2 ${isOpen ? 'px-4' : 'px-2'}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-2 rounded-md hover:bg-gray-200 transition-colors flex justify-center"
        >
          {isOpen ? (
            <ChevronLeft size={24} className="text-blue-500" />
          ) : (
            <ChevronRight size={24} className="text-blue-500" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;