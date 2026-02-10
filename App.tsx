
import React, { useState, useEffect } from 'react';
import { Proposal, ProposalStatus } from './types';
import { MOCK_EVENTS, MOCK_RESOURCES, MOCK_BLOG, MOCK_PROPOSALS } from './constants.tsx';
import Navigation from './components/Navigation';
import ProposalCard from './components/ProposalCard';
import { checkHealthyEnvironment } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleVote = (id: string) => {
    setProposals(prev => prev.map(p => p.id === id ? { ...p, votes: p.votes + 1 } : p));
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setIsChatLoading(true);
    const res = await checkHealthyEnvironment(chatInput);
    setChatResponse(res);
    setIsChatLoading(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <div className="space-y-12 animate-fadeIn">
            <section className="relative h-[400px] rounded-3xl overflow-hidden shadow-xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center px-12 text-white">
              <div className="relative z-10 max-w-2xl space-y-6">
                <h1 className="text-5xl font-extrabold leading-tight">Badajoz Respira: Tu Ciudad, Tu Salud</h1>
                <p className="text-lg text-emerald-50">Iniciativa de Farmamundi para transformar Badajoz en un entorno urbano más saludable, sostenible y participativo.</p>
                <div className="flex gap-4">
                  <button onClick={() => setActiveTab('propuestas')} className="bg-white text-emerald-700 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-emerald-50 transition-colors">Participar Ahora</button>
                  <button onClick={() => setActiveTab('mapa')} className="border border-white/40 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full font-bold hover:bg-white/20 transition-colors">Explorar Recursos</button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-20 pointer-events-none">
                 <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full scale-150">
                    <path fill="#FFFFFF" d="M47.5,-51.2C60.3,-41.1,68.4,-24.1,70.1,-6.6C71.8,11,67,29,56.5,42.7C46,56.4,29.9,65.8,12.1,70.2C-5.6,74.5,-25,73.8,-41.8,65.2C-58.5,56.5,-72.5,40,-76.4,21.5C-80.4,3.1,-74.3,-17.3,-62.7,-32.1C-51.1,-46.9,-33.9,-56.1,-17.5,-61.2C-1,-66.4,14.6,-67.5,30.3,-64.1C45.9,-60.7,61.6,-52.9,47.5,-51.2Z" transform="translate(100 100)" />
                 </svg>
              </div>
            </section>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <span className="text-emerald-500">📰</span> Últimas Noticias
                </h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {MOCK_BLOG.map(post => (
                    <div key={post.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer">
                      <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform" />
                      <div className="p-5 space-y-2">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{post.category}</span>
                        <h3 className="font-bold text-lg leading-tight group-hover:text-emerald-600 transition-colors">{post.title}</h3>
                        <p className="text-gray-500 text-sm">{post.excerpt}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-900 rounded-3xl p-8 text-white h-fit sticky top-24">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>🍃</span> Consulta Saludable
                </h3>
                <p className="text-emerald-200 text-sm mb-6">Pregúntale a nuestra IA sobre cómo mejorar tu entorno en Badajoz.</p>
                <form onSubmit={handleChatSubmit} className="space-y-4">
                  <textarea 
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ej: ¿Dónde hay zonas de baja emisión?"
                    className="w-full bg-emerald-800/50 border border-emerald-700 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none placeholder-emerald-500/50"
                    rows={3}
                  />
                  <button 
                    disabled={isChatLoading}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 py-3 rounded-xl font-bold transition-colors flex justify-center items-center"
                  >
                    {isChatLoading ? 'Procesando...' : 'Consultar'}
                  </button>
                </form>
                {chatResponse && (
                  <div className="mt-6 p-4 bg-emerald-800/80 rounded-xl text-xs leading-relaxed border-l-4 border-emerald-400">
                    {chatResponse}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'agenda':
        return (
          <div className="space-y-8 animate-fadeIn">
            <header className="text-center max-w-2xl mx-auto space-y-4">
              <h1 className="text-4xl font-extrabold text-gray-900">Agenda Ciudadana</h1>
              <p className="text-gray-500">Eventos gratuitos para fomentar una vida activa y saludable en Badajoz.</p>
            </header>
            <div className="grid gap-6">
              {MOCK_EVENTS.map(event => (
                <div key={event.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 hover:border-emerald-200 transition-colors">
                  <div className="bg-emerald-50 rounded-xl p-6 flex flex-col items-center justify-center min-w-[120px]">
                    <span className="text-emerald-700 font-bold text-2xl">{new Date(event.date).getDate()}</span>
                    <span className="text-emerald-600 uppercase text-xs font-semibold">{new Date(event.date).toLocaleDateString('es-ES', { month: 'short' })}</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 uppercase">
                      <span>{event.category}</span>
                      <span>•</span>
                      <span>{event.time}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">{event.title}</h3>
                    <p className="text-gray-600">{event.description}</p>
                    <div className="flex items-center gap-4 pt-2">
                      <span className="text-sm text-gray-400 flex items-center gap-1">📍 {event.location}</span>
                      <span className="text-sm text-gray-400 flex items-center gap-1">👤 {event.organizer}</span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button className="w-full md:w-auto bg-gray-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-600 transition-colors">Apuntarse</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'mapa':
        return (
          <div className="space-y-8 animate-fadeIn h-full">
            <header className="flex flex-col md:flex-row justify-between items-end gap-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold text-gray-900">Mapa de Salud</h1>
                <p className="text-gray-500">Localiza parques, puntos de reciclaje, farmacias y más.</p>
              </div>
              <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium">Todos</button>
                <button className="px-4 py-2 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">Zonas Verdes</button>
                <button className="px-4 py-2 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50">Salud</button>
              </div>
            </header>
            <div className="grid lg:grid-cols-4 gap-6 h-[600px]">
              <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto p-4 space-y-4">
                {MOCK_RESOURCES.map(res => (
                  <div key={res.id} className="p-4 rounded-xl hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all cursor-pointer">
                    <h4 className="font-bold text-gray-800">{res.name}</h4>
                    <p className="text-xs text-gray-500 mb-2">{res.type}</p>
                    <div className="flex flex-wrap gap-1">
                      {res.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-[10px] px-2 py-0.5 rounded-full text-gray-600">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="lg:col-span-3 bg-gray-200 rounded-2xl relative overflow-hidden flex items-center justify-center border-4 border-white shadow-inner">
                {/* Simulación de Mapa con Imagen */}
                <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/mapbadajoz/1200/800')] bg-cover opacity-80" />
                <div className="relative z-10 p-8 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white text-center max-w-sm">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-xl">📍</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Interactúa con el Mapa</h3>
                  <p className="text-sm text-gray-500">Haz clic en los marcadores para ver detalles específicos sobre los recursos de Badajoz.</p>
                </div>
                {/* Marcadores ficticios */}
                <div className="absolute top-1/4 left-1/3 w-6 h-6 bg-red-500 border-2 border-white rounded-full animate-bounce shadow-lg cursor-pointer"></div>
                <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full animate-bounce shadow-lg cursor-pointer delay-150"></div>
                <div className="absolute top-1/2 right-1/2 w-6 h-6 bg-blue-500 border-2 border-white rounded-full animate-bounce shadow-lg cursor-pointer delay-300"></div>
              </div>
            </div>
          </div>
        );

      case 'propuestas':
        return (
          <div className="space-y-12 animate-fadeIn">
             <header className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold text-gray-900">Validación Ciudadana</h1>
                <p className="text-gray-500 text-lg">Tus ideas para un Badajoz mejor pasan por un proceso de validación y apoyo comunitario.</p>
              </div>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-emerald-200 transition-all transform hover:-translate-y-1">
                + Nueva Propuesta
              </button>
            </header>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                <button className="text-emerald-600 border-b-2 border-emerald-600 pb-1">Más Votadas</button>
                <button className="hover:text-gray-600 transition-colors">Recientes</button>
                <button className="hover:text-gray-600 transition-colors">Ya Validadas</button>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
                {proposals.map(p => (
                  <ProposalCard key={p.id} proposal={p} onVote={handleVote} />
                ))}
              </div>
            </div>

            <div className="bg-amber-50 rounded-3xl p-8 border border-amber-100 flex flex-col md:flex-row items-center gap-8">
               <div className="text-5xl">💡</div>
               <div className="space-y-2">
                 <h3 className="text-xl font-bold text-amber-900">¿Cómo funciona la validación?</h3>
                 <p className="text-amber-800 text-sm">Las propuestas que alcancen 100 apoyos son revisadas por el comité técnico de Badajoz Respira y Farmamundi para su viabilidad y posterior ejecución.</p>
               </div>
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="space-y-12 animate-fadeIn">
            <header className="space-y-4">
              <h1 className="text-4xl font-extrabold text-gray-900">Noticias y Blog</h1>
              <p className="text-gray-500">Mantente al día con las últimas novedades de salud y medio ambiente en nuestra ciudad.</p>
            </header>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {MOCK_BLOG.map(post => (
                <article key={post.id} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-xl transition-all group">
                  <div className="relative h-56 overflow-hidden">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute top-4 left-4 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{post.category}</div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-medium uppercase tracking-widest">
                      <span>{post.author}</span>
                      <span>{post.date}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors">{post.title}</h2>
                    <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">{post.excerpt}</p>
                    <button className="mt-auto pt-4 text-emerald-600 font-bold text-sm hover:translate-x-1 transition-transform flex items-center gap-1">
                      Leer más <span>→</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pb-24 md:pb-0 md:pt-16">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8">
        {renderContent()}
      </main>

      <footer className="hidden md:block py-12 border-t border-gray-200 bg-white mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold">B</div>
              <span className="font-bold text-xl text-emerald-700">Badajoz Respira</span>
            </div>
            <p className="text-gray-400 text-xs">© 2024 Farmamundi. Por una salud global en entornos locales.</p>
          </div>
          <div className="flex gap-6 text-gray-400 text-sm">
            <a href="#" className="hover:text-emerald-600">Privacidad</a>
            <a href="#" className="hover:text-emerald-600">Contacto</a>
            <a href="#" className="hover:text-emerald-600">Farmamundi</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
