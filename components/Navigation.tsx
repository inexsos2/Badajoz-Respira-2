
import React from 'react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'mapa', label: 'Recursos' },
    { id: 'blog', label: 'Blog' },
  ];

  return (
    <nav className="sticky top-0 left-0 right-0 bg-white shadow-sm z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div 
          className="flex items-center gap-3 cursor-pointer" 
          onClick={() => setActiveTab('inicio')}
        >
          <div className="flex items-center">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C12 2 7 7 7 11C7 13.7614 9.23858 16 12 16C14.7614 16 17 13.7614 17 11C17 7 12 2 12 2Z" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 16V22" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M8 19H16" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 6C12 6 13 8 13 9" stroke="#10b981" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            <div className="ml-2 font-bold text-2xl tracking-tight">
              <span className="text-gray-900">Badajoz</span>
              <span className="text-emerald-500 ml-1">Respira</span>
            </div>
          </div>
        </div>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-10">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`relative py-1 text-sm font-semibold transition-colors ${
                    activeTab === item.id ? 'text-emerald-600' : 'text-gray-600 hover:text-emerald-500'
                  }`}
                >
                  {item.label}
                  {activeTab === item.id && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 rounded-full"></span>
                  )}
                </button>
              </li>
            ))}
          </ul>

          <button 
            onClick={() => setActiveTab('propuestas')}
            className="bg-emerald-600 text-white px-8 py-2.5 rounded-full font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
          >
            Proponer
          </button>
        </div>

        {/* Right Side Pill */}
        <div className="hidden lg:block">
          <button className="border border-gray-200 px-6 py-2 rounded-full text-xs font-bold text-gray-400 hover:bg-gray-50 transition-colors tracking-widest uppercase">
            Equipo
          </button>
        </div>

        {/* Mobile menu trigger could be added here if needed */}
      </div>
    </nav>
  );
};

export default Navigation;
