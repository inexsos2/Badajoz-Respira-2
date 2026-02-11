
import React, { useState, useEffect, useMemo } from 'react';
import { Proposal, ProposalStatus, AgendaEvent, Resource, BlogPost, User, Role, Category } from './types';
import { MOCK_EVENTS, MOCK_RESOURCES, MOCK_BLOG, MOCK_PROPOSALS, MOCK_USERS } from './constants.tsx';
import Navigation from './components/Navigation';
import ProposalCard from './components/ProposalCard';
import ResourceMap from './components/ResourceMap';
import AgendaMap from './components/AgendaMap';
import EventCalendar from './components/EventCalendar';
import LocationPicker from './components/LocationPicker';
import LoginModal from './components/LoginModal';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';
import { checkHealthyEnvironment } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('inicio');
  
  // Data State
  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [events, setEvents] = useState<AgendaEvent[]>(MOCK_EVENTS);
  const [resources, setResources] = useState<Resource[]>(MOCK_RESOURCES);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(MOCK_BLOG);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  // Pagination State for Agenda & View States
  const [visibleEvents, setVisibleEvents] = useState(9);
  const [selectedEvent, setSelectedEvent] = useState<AgendaEvent | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null); // New Resource Modal State

  // Proposal Form State
  const [proposalMode, setProposalMode] = useState<'none' | 'event' | 'resource'>('none');
  const [isGeocoding, setIsGeocoding] = useState(false);
  
  // Use separate state objects for clarity and to prevent cross-contamination
  const [eventProposal, setEventProposal] = useState<Partial<AgendaEvent>>({ 
    category: Category.Salud,
    title: '', description: '', location: '', organizer: '', startTime: '', endTime: '', date: '', email: '', phone: ''
  });
  
  const [resourceProposal, setResourceProposal] = useState<Partial<Resource>>({ 
    category: Category.Salud,
    name: '', description: '', address: '', email: '', phone: ''
  });

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [chatResponse, setChatResponse] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Admin / Auth State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // View State
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'event' | 'resource') => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          const url = URL.createObjectURL(file);
          if (type === 'event') {
              setEventProposal(prev => ({ ...prev, image: url }));
          } else {
              setResourceProposal(prev => ({ ...prev, image: url }));
          }
      }
  };

  // --- Geocoding Service ---
  const handleSearchAddress = async (type: 'event' | 'resource') => {
      const address = type === 'event' ? eventProposal.location : resourceProposal.address;
      
      if (!address || address.length < 3) {
          alert("Por favor, escribe una dirección más específica para buscar.");
          return;
      }

      setIsGeocoding(true);
      try {
          // Add context "Badajoz, España" to improve accuracy
          const query = `${address}, Badajoz, España`;
          const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`);
          const data = await response.json();

          if (data && data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lng = parseFloat(data[0].lon);
              
              if (type === 'event') {
                  setEventProposal(prev => ({ ...prev, lat, lng }));
              } else {
                  setResourceProposal(prev => ({ ...prev, lat, lng }));
              }
          } else {
              alert("No se pudo encontrar la ubicación exacta. Por favor, marca el punto en el mapa manualmente.");
          }
      } catch (error) {
          console.error("Geocoding error", error);
          alert("Error al conectar con el servicio de mapas.");
      } finally {
          setIsGeocoding(false);
      }
  };

  // --- Proposal Submission Handlers ---

  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();

    // Strict Validation
    if (!eventProposal.title?.trim()) return alert("Por favor, escribe un título para el evento.");
    if (!eventProposal.date) return alert("Por favor, selecciona una fecha.");
    if (!eventProposal.startTime) return alert("Por favor, indica la hora de inicio.");
    if (!eventProposal.description?.trim()) return alert("Por favor, añade una descripción.");
    if (eventProposal.lat === undefined || eventProposal.lng === undefined) {
        return alert("Es necesario marcar la ubicación exacta en el mapa (puedes usar el botón 'Ubicar' o hacer clic en el mapa).");
    }

    const newProposal: Proposal = {
        id: `p-evt-${Date.now()}`,
        type: 'event',
        author: eventProposal.organizer || 'Ciudadano',
        title: `[Actividad] ${eventProposal.title}`,
        description: eventProposal.description,
        votes: 0,
        status: ProposalStatus.Pending,
        date: new Date().toISOString().split('T')[0],
        details: { ...eventProposal } // Clone object to avoid ref issues
    };

    setProposals(prev => [newProposal, ...prev]);
    
    // Reset Form
    setEventProposal({ category: Category.Salud, title: '', description: '', location: '', organizer: '', startTime: '', endTime: '', date: '', email: '', phone: '' });
    setProposalMode('none');
    
    alert("¡Propuesta de actividad registrada correctamente!");
  };

  const handleSubmitResource = (e: React.FormEvent) => {
    e.preventDefault();

    // Strict Validation
    if (!resourceProposal.name?.trim()) return alert("Por favor, escribe el nombre del recurso.");
    if (!resourceProposal.description?.trim()) return alert("Por favor, añade una descripción.");
    if (!resourceProposal.address?.trim()) return alert("Por favor, escribe la dirección.");
    if (resourceProposal.lat === undefined || resourceProposal.lng === undefined) {
        return alert("Es necesario marcar la ubicación exacta en el mapa (puedes usar el botón 'Ubicar' o hacer clic en el mapa).");
    }

    const newProposal: Proposal = {
        id: `p-res-${Date.now()}`,
        type: 'resource',
        author: 'Ciudadano',
        title: `[Recurso] ${resourceProposal.name}`,
        description: resourceProposal.description,
        votes: 0,
        status: ProposalStatus.Pending,
        date: new Date().toISOString().split('T')[0],
        details: { ...resourceProposal } // Clone object
    };

    setProposals(prev => [newProposal, ...prev]);
    
    // Reset Form
    setResourceProposal({ category: Category.Salud, name: '', description: '', address: '', email: '', phone: '' });
    setProposalMode('none');
    
    alert("¡Propuesta de recurso registrada correctamente!");
  };

  // Chat Logic
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setIsChatLoading(true);
    const res = await checkHealthyEnvironment(chatInput);
    setChatResponse(res);
    setIsChatLoading(false);
  };

  // CRUD Handlers (Admin)
  const handleUpdateEvent = (updatedEvent: AgendaEvent) => setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  const handleAddEvent = (event: AgendaEvent) => setEvents([...events, event]);
  const handleDeleteEvent = (id: string) => setEvents(events.filter(e => e.id !== id));

  const handleUpdateResource = (updatedResource: Resource) => setResources(resources.map(r => r.id === updatedResource.id ? updatedResource : r));
  const handleAddResource = (resource: Resource) => setResources([...resources, resource]);
  const handleDeleteResource = (id: string) => setResources(resources.filter(r => r.id !== id));

  const handleUpdateBlogPost = (updatedPost: BlogPost) => setBlogPosts(blogPosts.map(b => b.id === updatedPost.id ? updatedPost : b));
  const handleAddBlogPost = (post: BlogPost) => setBlogPosts([...blogPosts, post]);
  const handleDeleteBlogPost = (id: string) => setBlogPosts(blogPosts.filter(b => b.id !== id));

  const handleAddUser = (user: User) => setUsers([...users, user]);
  const handleDeleteUser = (id: string) => setUsers(users.filter(u => u.id !== id));

  const handleUpdateProposal = (proposal: Proposal) => setProposals(proposals.map(p => p.id === proposal.id ? proposal : p));

  // Filters
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    resources.forEach(r => r.tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [resources]);

  const filteredResources = useMemo(() => {
    if (!selectedTag) return resources;
    return resources.filter(r => r.tags.includes(selectedTag));
  }, [selectedTag, resources]);

  const handlePostClick = (post: BlogPost) => {
      setSelectedPost(post);
      window.scrollTo(0, 0);
  };

  const renderContent = () => {
    if (activeTab === 'inicio') {
        return (
          <div className="animate-fadeIn -mx-4 md:-mx-0">
            {/* Portada / Hero Section */}
            <section className="relative min-h-[600px] flex items-center justify-center text-center px-4 overflow-hidden shadow-2xl">
              <div className="absolute inset-0 z-0">
                <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop" alt="Background" className="w-full h-full object-cover brightness-90"/>
                <div className="absolute inset-0 bg-black/30"></div>
              </div>
              <div className="relative z-10 max-w-5xl space-y-8 flex flex-col items-center">
                <div className="flex flex-col items-center w-full">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-none">
                    Badajoz <span className="text-emerald-400 italic">Respira</span>
                    </h1>
                    <h2 className="w-full text-center text-[10px] md:text-sm font-bold tracking-[0.4em] text-white uppercase opacity-95 mt-1 md:mt-0 leading-tight">Sembrando bienestar para una ciudad saludable</h2>
                </div>
                <p className="text-lg md:text-2xl text-white font-light max-w-3xl mx-auto leading-relaxed mt-4">Construyendo una ciudad más saludable, verde y comunitaria a través de la participación ciudadana.</p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
                  <button onClick={() => setActiveTab('agenda')} className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-full font-bold shadow-xl transition-all transform hover:scale-105">Explorar Agenda</button>
                  <button onClick={() => setActiveTab('mapa')} className="w-full md:w-auto border-2 border-white/40 hover:border-white text-white bg-white/10 backdrop-blur-sm px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105">Mapa de Recursos</button>
                </div>
              </div>
            </section>

            {/* Accesos Directos */}
            <section className="max-w-6xl mx-auto px-6 py-20">
              <div className="text-center mb-16 space-y-4">
                 <h2 className="text-4xl font-black text-gray-900">¿Qué es Badajoz Respira?</h2>
                 <div className="w-16 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
                 <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed pt-4">Una iniciativa intergeneracional de promoción para la salud y el envejecimiento activo.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                 <div onClick={() => setActiveTab('agenda')} className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-start cursor-pointer hover:border-emerald-200">
                     <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:bg-emerald-50 transition-colors">📅</div>
                     <h3 className="font-bold text-xl text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors">Agenda Colaborativa</h3>
                     <p className="text-gray-500 leading-relaxed mb-6 flex-1">Actividades de ocio saludable, talleres y encuentros organizados por y para la comunidad.</p>
                     <span className="text-emerald-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all text-sm uppercase tracking-wide">Saber más <span>›</span></span>
                 </div>
                 <div onClick={() => setActiveTab('mapa')} className="bg-white p-10 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-start relative overflow-hidden cursor-pointer hover:border-emerald-300">
                     <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner relative z-10 group-hover:bg-emerald-200 transition-colors">📍</div>
                     <h3 className="font-bold text-xl text-emerald-900 mb-4 relative z-10">Mapa de Bienestar</h3>
                     <p className="text-gray-500 leading-relaxed mb-6 flex-1 relative z-10">Encuentra espacios verdes, centros culturales y asociaciones que fomentan el bienestar.</p>
                     <span className="text-emerald-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all text-sm uppercase tracking-wide relative z-10">Saber más <span>›</span></span>
                 </div>
                 <div onClick={() => setActiveTab('propuestas')} className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-start cursor-pointer hover:border-emerald-200">
                     <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:bg-emerald-50 transition-colors">📝</div>
                     <h3 className="font-bold text-xl text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors">Participación Comunitaria</h3>
                     <p className="text-gray-500 leading-relaxed mb-6 flex-1">Propón tus propias actividades o recursos. Validamos y compartimos lo mejor de Badajoz.</p>
                     <span className="text-emerald-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all text-sm uppercase tracking-wide">Saber más <span>›</span></span>
                 </div>
              </div>
            </section>

            {/* Noticias y Chat */}
            <div className="max-w-6xl mx-auto px-4 space-y-20 pb-20">
              <div className="grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-10">
                  <h2 className="text-3xl font-bold flex items-center gap-3"><span className="text-emerald-500">📰</span> Últimas Noticias</h2>
                  <div className="grid sm:grid-cols-2 gap-8">
                    {blogPosts.slice(0, 4).map(post => (
                      <div key={post.id} onClick={() => { setActiveTab('blog'); handlePostClick(post); }} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer">
                        <div className="h-56 overflow-hidden"><img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div>
                        <div className="p-8 space-y-3">
                          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{post.category}</span>
                          <h3 className="font-bold text-xl leading-tight group-hover:text-emerald-600 transition-colors">{post.title}</h3>
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-emerald-900 rounded-[40px] p-10 text-white h-fit sticky top-24 shadow-2xl">
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3"><span className="text-emerald-400">🍃</span> Consulta Saludable</h3>
                  <p className="text-emerald-200/80 text-sm mb-8 leading-relaxed">Pregúntale a nuestra IA sobre cómo mejorar tu entorno en Badajoz.</p>
                  <form onSubmit={handleChatSubmit} className="space-y-6">
                    <textarea value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ej: ¿Dónde hay zonas de baja emisión?" className="w-full bg-emerald-800/40 border border-emerald-700/50 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder-emerald-500/30 transition-all" rows={4} />
                    <button disabled={isChatLoading} className="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-2xl font-bold transition-all transform active:scale-95 flex justify-center items-center shadow-lg shadow-black/20">{isChatLoading ? 'Procesando...' : 'Consultar'}</button>
                  </form>
                  {chatResponse && (
                    <div className="mt-8 p-5 bg-white/5 backdrop-blur-md rounded-2xl text-sm leading-relaxed border border-white/10 text-emerald-50">
                      <div className="flex items-center gap-2 mb-2 text-emerald-400 font-bold uppercase text-[10px] tracking-widest"><span>Respuesta</span></div>
                      {chatResponse}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
    }

    if (activeTab === 'admin') {
         if (!currentUser) { setActiveTab('inicio'); return null; }
         return (
             <AdminDashboard currentUser={currentUser} onLogout={handleLogout} events={events} resources={resources} blogPosts={blogPosts} users={users} proposals={proposals} onAddEvent={handleAddEvent} onUpdateEvent={handleUpdateEvent} onDeleteEvent={handleDeleteEvent} onAddResource={handleAddResource} onUpdateResource={handleUpdateResource} onDeleteResource={handleDeleteResource} onAddBlogPost={handleAddBlogPost} onUpdateBlogPost={handleUpdateBlogPost} onDeleteBlogPost={handleDeleteBlogPost} onAddUser={handleAddUser} onDeleteUser={handleDeleteUser} onUpdateProposal={handleUpdateProposal} />
         );
    }

    if (activeTab === 'agenda') {
        const eventsToShow = events.slice(0, visibleEvents);
        
        return (
            <div className="max-w-7xl mx-auto px-4 py-10 animate-fadeIn relative">
                 <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                     <div>
                        <h2 className="text-4xl font-black text-gray-900 mb-2 flex items-center gap-3"><span className="text-emerald-500">📅</span> Agenda Saludable</h2>
                        <p className="text-gray-500 text-lg">Actividades y eventos comunitarios en Badajoz.</p>
                     </div>
                 </div>

                 {/* Events Grid (3x3) - Compact Cards - SHOWN FIRST */}
                 <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {eventsToShow.map(event => (
                        <div 
                            key={event.id} 
                            onClick={() => setSelectedEvent(event)}
                            className="group bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all overflow-hidden flex flex-col h-full cursor-pointer transform hover:-translate-y-1"
                        >
                            {/* Card Image */}
                            <div className="h-32 w-full relative overflow-hidden">
                                {event.image && typeof event.image === 'string' ? (
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                        <span className="text-3xl">📅</span>
                                    </div>
                                )}
                                <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg shadow-lg text-center min-w-[50px]">
                                    <span className="block text-lg font-black text-gray-900 leading-none">{event.date.split('-')[2]}</span>
                                    <span className="block text-[9px] text-gray-500 uppercase font-bold tracking-wider">
                                        {new Date(event.date).toLocaleString('es-ES', { month: 'short' }).replace('.','')}
                                    </span>
                                </div>
                            </div>

                            {/* Card Content */}
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="mb-2">
                                    <span className="bg-purple-100 text-purple-700 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest inline-block">{event.category}</span>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 mb-1 leading-tight group-hover:text-purple-600 transition-colors">{event.title}</h3>
                                <div className="flex flex-col gap-0.5 text-xs text-gray-500 mb-2">
                                    <div className="flex items-center gap-1">
                                        <span>📍</span> <span className="truncate">{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span>⏰</span> <span>{event.startTime} - {event.endTime || '?'}</span>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-xs mb-0 line-clamp-2 flex-1">{event.description}</p>
                            </div>
                        </div>
                    ))}
                 </div>

                 {/* Load More Button */}
                 {visibleEvents < events.length && (
                     <div className="flex justify-center pb-12 border-b border-gray-100 mb-12">
                         <button 
                            onClick={() => setVisibleEvents(prev => prev + 9)}
                            className="bg-white border-2 border-purple-100 hover:border-purple-300 text-purple-700 font-bold py-3 px-8 rounded-full shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1"
                         >
                            Ver más actividades ({events.length - visibleEvents} restantes)
                         </button>
                     </div>
                 )}

                 {/* SPLIT VIEW: Map (Left) & Calendar (Right) - RESPONSIVE */}
                 <div className="grid lg:grid-cols-2 gap-8 mb-12">
                     {/* Map Column (Left on Desktop) - Needs defined height on Mobile */}
                     <div className="bg-white rounded-[30px] border border-gray-200 shadow-lg overflow-hidden relative z-0 h-[400px] lg:h-[600px]">
                         <AgendaMap events={events} />
                     </div>

                     {/* Calendar Column (Right on Desktop) */}
                     <div className="bg-white rounded-[30px] p-6 shadow-lg border border-gray-100 overflow-hidden flex flex-col h-auto min-h-[400px] lg:h-[600px]">
                         <EventCalendar events={events} />
                     </div>
                 </div>

                 {/* Event Detail Modal */}
                 {selectedEvent && (
                     <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedEvent(null)}></div>
                        <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[90vh]">
                            
                            <div className="h-48 md:h-64 relative shrink-0">
                                {selectedEvent.image && typeof selectedEvent.image === 'string' ? (
                                    <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                        <span className="text-6xl">📅</span>
                                    </div>
                                )}
                                <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-md transition-colors">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                                <div className="absolute bottom-4 left-4">
                                     <span className="bg-white/90 text-purple-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">{selectedEvent.category}</span>
                                </div>
                            </div>

                            <div className="p-8 overflow-y-auto">
                                <h2 className="text-3xl font-black text-gray-900 mb-4 leading-tight">{selectedEvent.title}</h2>
                                <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase">Fecha</p>
                                        <p className="font-medium text-gray-900">{new Date(selectedEvent.date).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase">Horario</p>
                                        <p className="font-medium text-gray-900">{selectedEvent.startTime} - {selectedEvent.endTime || '...'}</p>
                                    </div>
                                    <div className="col-span-2 space-y-1 border-t border-gray-200 pt-3 mt-1">
                                        <p className="text-xs font-bold text-gray-400 uppercase">Ubicación</p>
                                        <p className="font-medium text-gray-900 flex items-center gap-2">📍 {selectedEvent.location}</p>
                                    </div>
                                </div>
                                <div className="prose prose-sm max-w-none text-gray-600 mb-8"><p>{selectedEvent.description}</p></div>
                                <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                                    <h4 className="text-purple-900 font-bold mb-3 flex items-center gap-2">ℹ️ Contacto e Información</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><span className="font-bold text-purple-800">Organiza:</span> {selectedEvent.organizer}</p>
                                        {(selectedEvent.email || selectedEvent.phone) && (
                                            <div className="flex flex-col sm:flex-row gap-4 pt-2">
                                                {selectedEvent.email && <p className="flex items-center gap-2"><span className="text-purple-600">✉️</span> <a href={`mailto:${selectedEvent.email}`} className="hover:underline">{selectedEvent.email}</a></p>}
                                                {selectedEvent.phone && <p className="flex items-center gap-2"><span className="text-purple-600">📞</span> <a href={`tel:${selectedEvent.phone}`} className="hover:underline">{selectedEvent.phone}</a></p>}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                     </div>
                 )}
            </div>
        );
    }

    if (activeTab === 'mapa') {
        return (
            <div className="max-w-7xl mx-auto px-4 py-6 h-[calc(100vh-100px)] flex flex-col animate-fadeIn relative">
                <div className="flex justify-between items-center mb-4">
                     <h2 className="text-2xl font-black text-gray-900">Mapa de Recursos</h2>
                     <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm" value={selectedTag || ''} onChange={(e) => setSelectedTag(e.target.value || null)}>
                        <option value="">Todos los recursos</option>
                        {allTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
                     </select>
                </div>

                <div className="flex-1 rounded-3xl overflow-hidden border border-gray-200 shadow-lg relative">
                    <ResourceMap resources={filteredResources} />
                    
                    {/* List overlay for desktops */}
                    <div className="hidden md:block absolute top-4 right-4 bottom-4 w-80 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl overflow-y-auto p-4 z-[9999] border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 sticky top-0 bg-white/95 backdrop-blur-md py-2 border-b">Listado ({filteredResources.length})</h3>
                        <div className="space-y-4">
                            {filteredResources.map(res => (
                                <div key={res.id} onClick={() => setSelectedResource(res)} className="p-3 rounded-xl border border-gray-100 bg-white hover:border-emerald-300 cursor-pointer transition-all shadow-sm hover:shadow-md">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest">{res.category}</span>
                                    </div>
                                    <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1">{res.name}</h4>
                                    <p className="text-xs text-gray-500 truncate">{res.address}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Resource Detail Modal */}
                 {selectedResource && (
                     <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setSelectedResource(null)}></div>
                        <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden animate-fadeIn flex flex-col max-h-[90vh]">
                            
                            <div className="h-48 md:h-64 relative shrink-0">
                                {selectedResource.image && typeof selectedResource.image === 'string' ? (
                                    <img src={selectedResource.image} alt={selectedResource.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                        <span className="text-6xl">📍</span>
                                    </div>
                                )}
                                <button onClick={() => setSelectedResource(null)} className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white rounded-full p-2 backdrop-blur-md transition-colors">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>
                                <div className="absolute bottom-4 left-4">
                                     <span className="bg-white/90 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">{selectedResource.category}</span>
                                </div>
                            </div>

                            <div className="p-8 overflow-y-auto">
                                <h2 className="text-3xl font-black text-gray-900 mb-4 leading-tight">{selectedResource.name}</h2>
                                
                                <div className="flex items-start gap-2 text-gray-500 mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <span className="text-xl">📍</span>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">{selectedResource.address}</p>
                                        <p className="text-xs mt-1">Coordenadas: {selectedResource.lat}, {selectedResource.lng}</p>
                                    </div>
                                </div>

                                <div className="prose prose-sm max-w-none text-gray-600 mb-8"><p>{selectedResource.description}</p></div>

                                <div className="flex flex-wrap gap-2 mb-8">
                                    {selectedResource.tags.map(tag => (
                                        <span key={tag} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm border border-emerald-100">#{tag}</span>
                                    ))}
                                </div>

                                {(selectedResource.email || selectedResource.phone) && (
                                <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
                                    <h4 className="text-emerald-900 font-bold mb-3 flex items-center gap-2">📞 Contacto</h4>
                                    <div className="space-y-2 text-sm">
                                        {selectedResource.email && <p className="flex items-center gap-2"><span className="text-emerald-600">✉️</span> <a href={`mailto:${selectedResource.email}`} className="hover:underline">{selectedResource.email}</a></p>}
                                        {selectedResource.phone && <p className="flex items-center gap-2"><span className="text-emerald-600">📞</span> <a href={`tel:${selectedResource.phone}`} className="hover:underline">{selectedResource.phone}</a></p>}
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                     </div>
                 )}
            </div>
        );
    }

    return null;
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans text-gray-900 pb-20 md:pb-0 flex flex-col">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} onLoginClick={() => setIsLoginModalOpen(true)} isAdmin={isAdmin} />
      <main className="flex-grow">{renderContent()}</main>
      <Footer setActiveTab={setActiveTab} />
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} onLogin={handleLogin} />
    </div>
  );
};

export default App;
