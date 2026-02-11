
import React from 'react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLoginClick: () => void;
  isAdmin: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab, onLoginClick, isAdmin }) => {
  const navItems = [
    { id: 'inicio', label: 'Inicio' },
    { id: 'agenda', label: 'Agenda' },
    { id: 'mapa', label: 'Recursos' },
    { id: 'blog', label: 'Blog' },
  ];

  return (
    <>
      {/* --- DESKTOP / TABLET HEADER (Sticky Top) --- */}
      <nav className="sticky top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2">
          <div className="flex items-center justify-between">
            {/* Logo Section */}
            <div 
              className="group flex items-center gap-0 cursor-pointer z-50 relative shrink-0" 
              onClick={() => setActiveTab('inicio')}
            >
              <img 
                src="https://image2url.com/r2/default/images/1770738689474-b034d35a-a99a-45db-a3e5-e8a9182845b8.png" 
                alt="Logo Badajoz Respira" 
                className="h-12 md:h-16 w-auto object-contain -mr-4 relative z-10"
              />
              <div className="font-bold text-xl md:text-2xl tracking-tight hidden sm:flex items-center gap-1 relative z-20">
                <span className="text-gray-900 transition-colors duration-300 group-hover:text-emerald-600">Badajoz</span>
                <span className="text-emerald-600">Respira</span>
              </div>
            </div>

            {/* Desktop Menu - Integrated Proponer Button */}
            <div className="hidden md:flex items-center gap-6">
              <ul className="flex items-center gap-6">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`text-sm transition-colors duration-200 ${
                        activeTab === item.id 
                          ? 'font-bold text-emerald-600' 
                          : 'font-medium text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
                {/* Proponer Button Integrated in Menu */}
                <li>
                   <button 
                    onClick={() => setActiveTab('propuestas')}
                    className={`px-5 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                        activeTab === 'propuestas'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    Proponer
                  </button>
                </li>
              </ul>
            </div>

            {/* Admin / Team Access - Visible on all screens */}
            <div className="flex items-center gap-4 shrink-0">
               {isAdmin ? (
                 <button 
                    onClick={() => setActiveTab('admin')}
                    className="flex items-center gap-2 text-xs font-bold text-white bg-gray-900 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors uppercase tracking-widest"
                 >
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                    <span className="hidden sm:inline">Panel</span> Admin
                 </button>
               ) : (
                 <button 
                    onClick={onLoginClick}
                    className="text-xs font-bold text-gray-400 hover:text-emerald-600 uppercase tracking-widest whitespace-nowrap"
                 >
                    Equipo
                 </button>
               )}
            </div>
          </div>
        </div>
      </nav>

      {/* --- MOBILE BOTTOM NAVIGATION (Fixed Bottom) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[9999] shadow-2xl safe-area-bottom">
        <div className="flex justify-around items-end px-2 pb-2 pt-3 relative">
            
            {/* Inicio */}
            <button 
            onClick={() => setActiveTab('inicio')}
            className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'inicio' ? 'text-emerald-600' : 'text-gray-400'}`}
            >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === 'inicio' ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span className="text-[10px] font-bold">Inicio</span>
            </button>

            {/* Agenda */}
            <button 
            onClick={() => setActiveTab('agenda')}
            className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'agenda' ? 'text-emerald-600' : 'text-gray-400'}`}
            >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === 'agenda' ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span className="text-[10px] font-bold">Agenda</span>
            </button>

            {/* Floating Action Button Container */}
            <div className="relative -top-8 mx-2">
            <button 
                onClick={() => setActiveTab('propuestas')}
                className={`w-14 h-14 rounded-full flex items-center justify-center shadow-none border-4 border-white transform transition-transform active:scale-95 ${
                activeTab === 'propuestas' 
                    ? 'bg-emerald-700 text-white' 
                    : 'bg-emerald-600 text-white'
                }`}
            >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
            </button>
            <span className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold whitespace-nowrap ${activeTab === 'propuestas' ? 'text-gray-900' : 'text-gray-400'}`}>
                Proponer
            </span>
            </div>

            {/* Mapa */}
            <button 
            onClick={() => setActiveTab('mapa')}
            className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'mapa' ? 'text-emerald-600' : 'text-gray-400'}`}
            >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === 'mapa' ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
            </svg>
            <span className="text-[10px] font-bold">Mapa</span>
            </button>

            {/* Blog */}
            <button 
            onClick={() => setActiveTab('blog')}
            className={`flex flex-col items-center gap-1 w-16 transition-colors ${activeTab === 'blog' ? 'text-emerald-600' : 'text-gray-400'}`}
            >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={activeTab === 'blog' ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <span className="text-[10px] font-bold">Blog</span>
            </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;
