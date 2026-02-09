import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Box, Factory, ClipboardList, Menu, X } from 'lucide-react';

const Layout: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/products', label: 'Products', icon: <Factory size={20} /> },
    { path: '/materials', label: 'Raw Materials', icon: <Box size={20} /> },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR DESKTOP */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col border-r border-slate-800">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ClipboardList className="text-blue-400" />
            Factory Manager
          </h2>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* MOBILE SIDEBAR (DRAWER) */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" 
          onClick={closeMenu}
        />
      )}
      
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-slate-900 text-white z-50 transition-transform duration-300 ease-in-out md:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ClipboardList className="text-blue-400" />
            Factory
          </h2>
          <button onClick={closeMenu} className="p-1 hover:bg-slate-800 rounded">
            <X size={24} />
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMenu}
              className={`flex items-center gap-3 p-4 rounded-xl transition-colors ${
                location.pathname === item.path 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-30 bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-2">
            <ClipboardList className="text-blue-400" size={24} />
            <h2 className="font-bold text-lg">Factory Manager</h2>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;