
import React from 'react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'inicio', label: 'Inicio', icon: '🏠' },
    { id: 'agenda', label: 'Agenda', icon: '📅' },
    { id: 'mapa', label: 'Mapa de Recursos', icon: '📍' },
    { id: 'blog', label: 'Noticias', icon: '📰' },
    { id: 'propuestas', label: 'Propuestas', icon: '💡' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:top-0 md:bottom-auto md:sticky">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-around md:justify-between items-center py-3">
          <div className="hidden md:flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">B</div>
            <span className="font-bold text-xl text-emerald-700">Badajoz Respira</span>
          </div>
          <ul className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col md:flex-row items-center gap-1 md:gap-2 px-2 py-1 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'text-emerald-600 font-semibold md:bg-emerald-50'
                      : 'text-gray-500 hover:text-emerald-500'
                  }`}
                >
                  <span className="text-xl md:text-lg">{tab.icon}</span>
                  <span className="text-[10px] md:text-sm uppercase tracking-wider">{tab.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
