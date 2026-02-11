
import React from 'react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="w-full">
      {/* Sección Mantente al día (CTA Blog) */}
      <div className="bg-emerald-50 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-4 max-w-2xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">Mantente al día</h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              Lee las últimas noticias sobre el proyecto, artículos sobre salud urbana y novedades de Farmamundi.
            </p>
          </div>
          <button 
            onClick={() => setActiveTab('blog')}
            className="border-2 border-emerald-600 text-emerald-700 font-bold px-10 py-4 rounded-full hover:bg-emerald-600 hover:text-white transition-all transform hover:scale-105 whitespace-nowrap bg-white shadow-sm"
          >
            Visitar el Blog
          </button>
        </div>
      </div>

      {/* Sección Principal Oscura */}
      <div className="bg-[#0f172a] text-white pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 mb-20 border-b border-gray-800 pb-16">
          
          {/* Columna 1: Logo y Descripción */}
          <div className="md:col-span-5 space-y-6">
            <div className="flex items-center gap-0 mb-6 -ml-4">
                <img 
                    src="https://image2url.com/r2/default/images/1770738689474-b034d35a-a99a-45db-a3e5-e8a9182845b8.png" 
                    alt="Logo Badajoz Respira" 
                    className="h-16 w-auto object-contain relative z-10 brightness-0 invert"
                />
                <div className="flex flex-col relative z-20">
                    <span className="font-bold text-2xl tracking-tight text-white flex items-center gap-1">
                        Badajoz <span className="text-emerald-500">Respira</span>
                    </span>
                </div>
            </div>
            <p className="text-gray-400 leading-relaxed text-sm max-w-md">
              Un proyecto de Farmamundi para transformar Badajoz en una ciudad más resiliente, saludable y conectada socialmente.
            </p>
          </div>

          {/* Columna 2: Proyecto */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-8">PROYECTO</h3>
            <ul className="space-y-4 text-gray-400 text-sm font-medium">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Sobre Farmamundi</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Nuestros Objetivos</a></li>
              <li><a href="#" onClick={() => setActiveTab('propuestas')} className="hover:text-emerald-400 transition-colors">Cómo Participar</a></li>
            </ul>
          </div>

          {/* Columna 3: Contacto */}
          <div className="md:col-span-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-8">CONTACTO</h3>
            <ul className="space-y-6 text-gray-400 text-sm">
              <li className="flex items-start gap-4">
                <span className="text-red-500 text-lg">📍</span>
                <span>Calle Padre Tomás, 2. 06011 Badajoz</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-blue-400 text-lg">✉️</span>
                <span>extremadura@farmamundi.org</span>
              </li>
              <li className="flex items-start gap-4">
                <span className="text-emerald-500 text-lg">📞</span>
                <span>924 207 591</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Logos Financiación e Implementación */}
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center md:items-start">
            
            {/* Implementa */}
            <div className="flex flex-col items-center md:items-start gap-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">IMPLEMENTA</span>
                <img 
                    src="https://activando-ods.saludglocal.org/wp-content/themes/saludglocal/assets/images/farmamundi-footer-color.png" 
                    alt="Farmamundi" 
                    className="h-10 md:h-12 opacity-80 hover:opacity-100 transition-opacity"
                />
            </div>

            {/* Financia */}
            <div className="flex flex-col items-center md:items-start gap-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">FINANCIA</span>
                <div className="flex gap-4">
                    <img 
                        src="https://image2url.com/r2/default/images/1770817371811-71e50b79-b3d1-47b3-b066-9202c137bcd9.jpeg"
                        alt="Ministerio de Derechos Sociales y Agenda 2030" 
                        className="h-10 md:h-12 w-auto object-contain rounded-sm bg-white pr-4"
                    />
                </div>
            </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
