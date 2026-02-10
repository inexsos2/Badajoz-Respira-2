
import React, { useState, useEffect, useMemo } from 'react';
import { Proposal, ProposalStatus, AgendaEvent, Resource, BlogPost, User, Role } from './types';
import { MOCK_EVENTS, MOCK_RESOURCES, MOCK_BLOG, MOCK_PROPOSALS, MOCK_USERS } from './constants.tsx';
import Navigation from './components/Navigation';
import ProposalCard from './components/ProposalCard';
import ResourceMap from './components/ResourceMap';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import { checkHealthyEnvironment } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  
  // Data State
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [events, setEvents] = useState<AgendaEvent[]>(MOCK_EVENTS);
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(MOCK_BLOG);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Admin / Auth State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const isAdmin = !!currentUser;

  const handleLogin = (email: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      setCurrentUser(user);
      setIsLoginModalOpen(false);
      setActiveTab('admin');
    } else {
      alert('Acceso denegado: Email no encontrado.');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('inicio');
  };

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

  // CRUD Handlers
  const handleUpdateEvent = (updatedEvent: AgendaEvent) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const handleUpdateResource = (updatedResource: Resource) => {
    setResources(resources.map(r => r.id === updatedResource.id ? updatedResource : r));
  };

  const handleUpdateBlogPost = (updatedPost: BlogPost) => {
    setBlogPosts(blogPosts.map(b => b.id === updatedPost.id ? updatedPost : b));
  };

  const handleAddUser = (user: User) => setUsers([...users, user]);
  const handleDeleteUser = (id: string) => setUsers(users.filter(u => u.id !== id));


  // Extract unique tags for the filter
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    resources.forEach(r => r.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [resources]);

  // Filter resources based on selection
  const filteredResources = useMemo(() => {
    if (!selectedTag) return resources;
    return resources.filter(r => r.tags.includes(selectedTag));
  }, [selectedTag, resources]);

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return (
          <div className="animate-fadeIn -mx-4 md:-mx-0">
            {/* Portada / Hero Section matching the image */}
            <section className="relative min-h-[600px] flex items-center justify-center text-center px-4 overflow-hidden rounded-b-[40px] md:rounded-3xl shadow-2xl">
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop" 
                  alt="Background" 
                  className="w-full h-full object-cover grayscale brightness-50"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>
              </div>

              <div className="relative z-10 max-w-4xl space-y-8">
                <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white">
                  Badajoz <span className="text-emerald-400">Respira</span>
                </h1>
                <h2 className="text-sm md:text-lg font-bold tracking-[0.2em] text-white uppercase opacity-90">
                  Sembrando bienestar para una ciudad saludable
                </h2>
                <p className="text-lg md:text-2xl text-white/90 font-light max-w-3xl mx-auto leading-relaxed">
                  Construyendo juntos una ciudad más saludable, verde y comunitaria a través de la participación ciudadana.
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
                  <button 
                    onClick={() => setActiveTab('agenda')}
                    className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-full font-bold shadow-xl transition-all transform hover:scale-105"
                  >
                    Explorar Agenda
                  </button>
                  <button 
                    onClick={() => setActiveTab('mapa')}
                    className="w-full md:w-auto border-2 border-white/40 hover:border-white text-white bg-white/10 backdrop-blur-sm px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105"
                  >
                    Mapa de Recursos
                  </button>
                </div>
              </div>
            </section>

            {/* Additional content below hero */}
            <div className="max-w-6xl mx-auto mt-20 px-4 space-y-20">
              <div className="grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-10">
                  <h2 className="text-3xl font-bold flex items-center gap-3">
                    <span className="text-emerald-500">📰</span> Últimas Noticias
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-8">
                    {blogPosts.map(post => (
                      <div key={post.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer">
                        <div className="h-56 overflow-hidden">
                          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-8 space-y-3">
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{post.category}</span>
                          <h3 className="font-bold text-xl leading-tight group-hover:text-emerald-600 transition-colors">{post.title}</h3>
                          <p className="text-gray-500 text-sm leading-relaxed">{post.excerpt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-900 rounded-[40px] p-10 text-white h-fit sticky top-24 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                    <span className="text-emerald-400">🍃</span> Consulta Saludable
                  </h3>
                  <p className="text-emerald-200/80 text-sm mb-8 leading-relaxed">Pregúntale a nuestra IA sobre cómo mejorar tu entorno en Badajoz.</p>
                  <form onSubmit={handleChatSubmit} className="space-y-6">
                    <textarea 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ej: ¿Dónde hay zonas de baja emisión?"
                      className="w-full bg-emerald-800/40 border border-emerald-700/50 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder-emerald-500/30 transition-all"
                      rows={4}
                    />
                    <button 
                      disabled={isChatLoading}
                      className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-2xl font-bold transition-all transform active:scale-95 flex justify-center items-center shadow-lg shadow-black/20"
                    >
                      {isChatLoading ? 'Procesando...' : 'Consultar'}
                    </button>
                  </form>
                  {chatResponse && (
                    <div className="mt-8 p-5 bg-white/5 backdrop-blur-md rounded-2xl text-sm leading-relaxed border border-white/10 text-emerald-50">
                      <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold uppercase text-[10px] tracking-widest">
                        <span>Respuesta</span>
                      </div>
                      {chatResponse}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'agenda':
        return (
          <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-fadeIn">
            <header className="text-center max-w-3xl mx-auto space-y-4">
              <h1 className="text-5xl font-black text-gray-900 tracking-tight">Agenda Ciudadana</h1>
              <p className="text-gray-500 text-lg">Eventos gratuitos para fomentar una vida activa y saludable en Badajoz.</p>
            </header>
            <div className="grid gap-8">
              {events.map(event => (
                <div key={event.id} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-8 hover:shadow-xl transition-all border-l-8 border-l-emerald-500">
                  <div className="bg-emerald-50 rounded-2xl p-8 flex flex-col items-center justify-center min-w-[140px] text-center">
                    <span className="text-emerald-700 font-black text-4xl leading-none">{new Date(event.date).getDate()}</span>
                    <span className="text-emerald-600 uppercase text-xs font-bold tracking-widest mt-1">{new Date(event.date).toLocaleDateString('es-ES', { month: 'short' })}</span>
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">
                      <span>{event.category}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-200"></span>
                      <span>{event.time}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{event.description}</p>
                    <div className="flex flex-wrap items-center gap-6 pt-2">
                      <span className="text-sm text-gray-400 flex items-center gap-2">📍 <span className="font-medium text-gray-600">{event.location}</span></span>
                      <span className="text-sm text-gray-400 flex items-center gap-2">👤 <span className="font-medium text-gray-600">{event.organizer}</span></span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button className="w-full md:w-auto bg-gray-900 text-white px-8 py-3 rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-black/5">Apuntarse</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'mapa':
        return (
          <div className="max-w-6xl mx-auto px-4 py-12 space-y-12 animate-fadeIn h-full">
            <header className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="space-y-2">
                <h1 className="text-5xl font-black text-gray-900 tracking-tight">Mapa de Salud</h1>
                <p className="text-gray-500 text-lg">Localiza parques, puntos de reciclaje, farmacias y más en Badajoz.</p>
              </div>
              <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto max-w-full">
                <button 
                  onClick={() => setSelectedTag(null)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                    selectedTag === null 
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Todos
                </button>
                {allTags.map(tag => (
                  <button 
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                      selectedTag === tag 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-100' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </header>
            <div className="grid lg:grid-cols-4 gap-8 h-[700px]">
              <div className="lg:col-span-1 bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-y-auto p-6 space-y-6">
                <h3 className="font-black text-gray-900 uppercase text-xs tracking-[0.2em] mb-4 text-center lg:text-left">Listado de Recursos</h3>
                {filteredResources.map(res => (
                  <div key={res.id} className="p-6 rounded-3xl bg-gray-50 hover:bg-emerald-50 border border-transparent hover:border-emerald-100 transition-all cursor-pointer group">
                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors leading-tight">{res.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">{res.type}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {res.tags.map(tag => (
                        <span key={tag} className="bg-white text-[9px] px-2 py-1 rounded-full text-gray-500 border border-gray-100 font-bold uppercase tracking-wider">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
                {filteredResources.length === 0 && (
                   <div className="text-center py-10 text-gray-400">
                      No se encontraron recursos con este filtro.
                   </div>
                )}
              </div>
              <div className="lg:col-span-3 bg-white rounded-[40px] overflow-hidden border-8 border-white shadow-2xl relative">
                <ResourceMap resources={filteredResources} />
              </div>
            </div>
          </div>
        );

      case 'propuestas':
        return (
          <div className="max-w-6xl mx-auto px-4 py-12 space-y-16 animate-fadeIn">
             <header className="flex flex-col md:flex-row justify-between items-center gap-10">
              <div className="space-y-4 text-center md:text-left">
                <h1 className="text-5xl font-black text-gray-900 tracking-tight">Validación Ciudadana</h1>
                <p className="text-gray-500 text-xl max-w-2xl">Comparte y apoya ideas para transformar Badajoz en una ciudad más verde y humana.</p>
              </div>
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-5 rounded-[25px] font-black text-lg shadow-2xl shadow-emerald-200 transition-all transform hover:-translate-y-1 active:scale-95">
                + Nueva Propuesta
              </button>
            </header>

            <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-10">
              <div className="flex items-center gap-10 text-xs font-black text-gray-400 uppercase tracking-[0.2em] border-b border-gray-50 pb-6 overflow-x-auto no-scrollbar">
                <button className="text-emerald-600 border-b-2 border-emerald-600 pb-1 whitespace-nowrap">Más Votadas</button>
                <button className="hover:text-gray-900 transition-colors whitespace-nowrap">Recientes</button>
                <button className="hover:text-gray-900 transition-colors whitespace-nowrap">Ya Validadas</button>
              </div>
              <div className="grid md:grid-cols-2 gap-10">
                {proposals.map(p => (
                  <ProposalCard key={p.id} proposal={p} onVote={handleVote} />
                ))}
              </div>
            </div>

            <div className="bg-gray-900 rounded-[40px] p-12 text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
               <div className="text-7xl drop-shadow-lg relative z-10">💡</div>
               <div className="space-y-4 relative z-10">
                 <h3 className="text-3xl font-black tracking-tight">¿Cómo funciona la validación?</h3>
                 <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">Las propuestas que alcanzan un consenso comunitario son analizadas por expertos. Priorizamos la salud urbana, la sostenibilidad y el impacto positivo en el bienestar social de Badajoz.</p>
               </div>
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="max-w-6xl mx-auto px-4 py-12 space-y-16 animate-fadeIn">
            <header className="space-y-4 text-center">
              <h1 className="text-5xl font-black text-gray-900 tracking-tight">Noticias y Blog</h1>
              <p className="text-gray-500 text-xl max-w-3xl mx-auto">Información de calidad sobre salud global, medio ambiente y el proyecto Badajoz Respira.</p>
            </header>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {blogPosts.map(post => (
                <article key={post.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 flex flex-col hover:shadow-2xl transition-all group">
                  <div className="relative h-64 overflow-hidden">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-6 left-6 bg-emerald-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg">{post.category}</div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col gap-4">
                    <div className="flex items-center justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                      <span>{post.author}</span>
                      <span>{post.date}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors">{post.title}</h2>
                    <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed">{post.excerpt}</p>
                    <button className="mt-auto pt-6 text-emerald-600 font-black text-sm hover:translate-x-2 transition-transform flex items-center gap-2 group-hover:text-emerald-700">
                      Continuar leyendo <span className="text-xl">→</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        );

      case 'admin':
         return (
            <AdminDashboard 
                currentUser={currentUser}
                onLogout={handleLogout}
                events={events}
                resources={resources}
                blogPosts={blogPosts}
                users={users}
                onAddEvent={(e) => setEvents([...events, e])}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={(id) => setEvents(events.filter(e => e.id !== id))}
                onAddResource={(r) => setResources([...resources, r])}
                onUpdateResource={handleUpdateResource}
                onDeleteResource={(id) => setResources(resources.filter(r => r.id !== id))}
                onAddBlogPost={(b) => setBlogPosts([...blogPosts, b])}
                onUpdateBlogPost={handleUpdateBlogPost}
                onDeleteBlogPost={(id) => setBlogPosts(blogPosts.filter(b => b.id !== id))}
                onAddUser={handleAddUser}
                onDeleteUser={handleDeleteUser}
            />
         );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLoginClick={() => setIsLoginModalOpen(true)}
        isAdmin={isAdmin}
      />
      
      <main className="flex-1 w-full pb-24 md:pb-0">
        {renderContent()}
      </main>

      <footer className="py-20 border-t border-gray-100 bg-gray-50 mt-20">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-6">
            <div className="group flex items-center gap-0">
              <img 
                src="https://image2url.com/r2/default/images/1770738689474-b034d35a-a99a-45db-a3e5-e8a9182845b8.png" 
                alt="Logo Badajoz Respira" 
                className="h-20 md:h-24 w-auto object-contain -mr-5 relative z-10"
              />
              <div className="font-black text-2xl tracking-tight flex items-center gap-1 relative z-20">
                <span className="text-gray-900 transition-colors duration-300 group-hover:text-emerald-600">Badajoz</span>
                <span className="text-emerald-600">Respira</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm max-w-sm leading-relaxed">Una iniciativa participativa impulsada por Farmamundi para mejorar la salud de los habitantes de Badajoz mediante la transformación del entorno urbano.</p>
            <p className="text-gray-300 text-xs pt-4 font-bold uppercase tracking-widest">© 2024 Farmamundi • Badajoz, España</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-gray-900 uppercase text-xs tracking-[0.2em]">Mapa del Sitio</h4>
            <ul className="space-y-2 text-sm text-gray-500 font-medium">
              <li><button onClick={() => setActiveTab('inicio')} className="hover:text-emerald-600">Inicio</button></li>
              <li><button onClick={() => setActiveTab('agenda')} className="hover:text-emerald-600">Agenda</button></li>
              <li><button onClick={() => setActiveTab('mapa')} className="hover:text-emerald-600">Mapa de Salud</button></li>
              <li><button onClick={() => setActiveTab('blog')} className="hover:text-emerald-600">Blog</button></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="font-black text-gray-900 uppercase text-xs tracking-[0.2em]">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-500 font-medium">
              <li><a href="#" className="hover:text-emerald-600">Aviso Legal</a></li>
              <li><a href="#" className="hover:text-emerald-600">Política de Privacidad</a></li>
              <li><a href="#" className="hover:text-emerald-600">Cookies</a></li>
              <li><a href="#" className="hover:text-emerald-600">Farmamundi</a></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLogin} 
      />
    </div>
  );
};

export default App;
