
import React, { useState, useEffect, useMemo } from 'react';
import { Proposal, ProposalStatus, AgendaEvent, Resource, BlogPost, User, Role } from './types';
import { MOCK_EVENTS, MOCK_RESOURCES, MOCK_BLOG, MOCK_PROPOSALS, MOCK_USERS } from './constants.tsx';
import Navigation from './components/Navigation';
import ProposalCard from './components/ProposalCard';
import ResourceMap from './components/ResourceMap';
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
  const handleAddEvent = (event: AgendaEvent) => setEvents([...events, event]);
  const handleDeleteEvent = (id: string) => setEvents(events.filter(e => e.id !== id));

  const handleUpdateResource = (updatedResource: Resource) => {
    setResources(resources.map(r => r.id === updatedResource.id ? updatedResource : r));
  };
  const handleAddResource = (resource: Resource) => setResources([...resources, resource]);
  const handleDeleteResource = (id: string) => setResources(resources.filter(r => r.id !== id));

  const handleUpdateBlogPost = (updatedPost: BlogPost) => {
    setBlogPosts(blogPosts.map(b => b.id === updatedPost.id ? updatedPost : b));
  };
  const handleAddBlogPost = (post: BlogPost) => setBlogPosts([...blogPosts, post]);
  const handleDeleteBlogPost = (id: string) => setBlogPosts(blogPosts.filter(b => b.id !== id));

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

  // Render Post View Logic
  const handlePostClick = (post: BlogPost) => {
      setSelectedPost(post);
      window.scrollTo(0, 0);
  };

  const renderContent = () => {
    if (activeTab === 'inicio') {
        return (
          <div className="animate-fadeIn -mx-4 md:-mx-0">
            {/* Portada / Hero Section matching the image */}
            <section className="relative min-h-[600px] flex items-center justify-center text-center px-4 overflow-hidden shadow-2xl">
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 z-0">
                <img 
                  src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop" 
                  alt="Background" 
                  className="w-full h-full object-cover brightness-90"
                />
                <div className="absolute inset-0 bg-black/30"></div>
              </div>

              <div className="relative z-10 max-w-5xl space-y-8 flex flex-col items-center">
                <div className="flex flex-col items-center w-full">
                    <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white leading-none">
                    Badajoz <span className="text-emerald-400 italic">Respira</span>
                    </h1>
                    <h2 className="w-full text-center text-[10px] md:text-sm font-bold tracking-[0.4em] text-white uppercase opacity-95 mt-1 md:mt-0 leading-tight">
                    Sembrando bienestar para una ciudad saludable
                    </h2>
                </div>
                <p className="text-lg md:text-2xl text-white font-light max-w-3xl mx-auto leading-relaxed mt-4">
                  Construyendo una ciudad más saludable, verde y comunitaria a través de la participación ciudadana.
                </p>
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
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

            {/* Nueva Sección: ¿Qué es Badajoz Respira? */}
            <section className="max-w-6xl mx-auto px-6 py-20">
              <div className="text-center mb-16 space-y-4">
                 <h2 className="text-4xl font-black text-gray-900">¿Qué es Badajoz Respira?</h2>
                 <div className="w-16 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
                 <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed pt-4">
                    Una iniciativa intergeneracional de promoción para la salud y el envejecimiento activo, potenciando espacios para los cuidados y el intercambio social en las zonas verdes de la ciudad.
                 </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                 {/* Agenda Colaborativa */}
                 <div 
                    onClick={() => setActiveTab('agenda')}
                    className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-start cursor-pointer hover:border-emerald-200"
                 >
                     <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:bg-emerald-50 transition-colors">
                        📅
                     </div>
                     <h3 className="font-bold text-xl text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors">Agenda Colaborativa</h3>
                     <p className="text-gray-500 leading-relaxed mb-6 flex-1">
                        Actividades de ocio saludable, talleres y encuentros organizados por y para la comunidad.
                     </p>
                     <span className="text-emerald-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all text-sm uppercase tracking-wide">
                        Saber más <span>›</span>
                     </span>
                 </div>

                 {/* Mapa de Bienestar */}
                 <div 
                    onClick={() => setActiveTab('mapa')}
                    className="bg-white p-10 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-start relative overflow-hidden cursor-pointer hover:border-emerald-300"
                 >
                     <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner relative z-10 group-hover:bg-emerald-200 transition-colors">
                        📍
                     </div>
                     <h3 className="font-bold text-xl text-emerald-900 mb-4 relative z-10">Mapa de Bienestar</h3>
                     <p className="text-gray-500 leading-relaxed mb-6 flex-1 relative z-10">
                        Encuentra espacios verdes, centros culturales y asociaciones que fomentan el bienestar.
                     </p>
                     <span className="text-emerald-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all text-sm uppercase tracking-wide relative z-10">
                        Saber más <span>›</span>
                     </span>
                 </div>

                 {/* Participación Comunitaria */}
                 <div 
                    onClick={() => setActiveTab('propuestas')}
                    className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col items-start cursor-pointer hover:border-emerald-200"
                 >
                     <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:bg-emerald-50 transition-colors">
                        📝
                     </div>
                     <h3 className="font-bold text-xl text-gray-900 mb-4 group-hover:text-emerald-700 transition-colors">Participación Comunitaria</h3>
                     <p className="text-gray-500 leading-relaxed mb-6 flex-1">
                        Propón tus propias actividades o recursos. Validamos y compartimos lo mejor de Badajoz.
                     </p>
                     <span className="text-emerald-600 font-bold flex items-center gap-1 group-hover:gap-2 transition-all text-sm uppercase tracking-wide">
                        Saber más <span>›</span>
                     </span>
                 </div>
              </div>
            </section>

            {/* Nueva Sección: Objetivos */}
            <section className="max-w-6xl mx-auto px-6 pb-20">
              <div className="text-center mb-16 space-y-4">
                 <h2 className="text-4xl font-black text-gray-900">¿Qué objetivos perseguimos?</h2>
                 <div className="w-16 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                 {/* Objetivo 1 */}
                 <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col">
                    <div className="h-64 overflow-hidden relative">
                         <img src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop" alt="Comunidad" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-10 flex-1 flex items-center justify-center">
                        <p className="text-gray-600 text-lg leading-relaxed text-center">
                            Identificar y <span className="font-bold text-emerald-600">vincular iniciativas locales</span> que impulsen la promoción de la salud comunitaria y activen el uso de nuestros espacios verdes.
                        </p>
                    </div>
                 </div>

                 {/* Objetivo 2 */}
                 <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col">
                    <div className="h-64 overflow-hidden relative">
                         <img src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800&auto=format&fit=crop" alt="Naturaleza" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-10 flex-1 flex items-center justify-center">
                        <p className="text-gray-600 text-lg leading-relaxed text-center">
                            Impulsar actividades de <span className="font-bold text-emerald-600">educación ambiental y salud</span> que involucren a la población en el cuidado y disfrute de la naturaleza urbana.
                        </p>
                    </div>
                 </div>

                 {/* Objetivo 3 */}
                 <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col">
                    <div className="h-64 overflow-hidden relative bg-blue-50">
                         {/* Imagen de bocadillos de diálogo (Diálogos) */}
                         <img src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=800&auto=format&fit=crop" alt="Diálogo" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-10 flex-1 flex items-center justify-center">
                        <p className="text-gray-600 text-lg leading-relaxed text-center">
                            Generar <span className="font-bold text-emerald-600">diálogos comunitarios</span> para encontrar soluciones colectivas a necesidades de salud y mejorar nuestros entornos naturales.
                        </p>
                    </div>
                 </div>

                 {/* Objetivo 4 */}
                 <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all flex flex-col">
                    <div className="h-64 overflow-hidden relative">
                         {/* Imagen de manos unidas (Participación/Campaña) */}
                         <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=800&auto=format&fit=crop" alt="Participación" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                    <div className="p-10 flex-1 flex items-center justify-center">
                        <p className="text-gray-600 text-lg leading-relaxed text-center">
                            Desarrollar <span className="font-bold text-emerald-600">campañas de comunicación</span> que promuevan estilos de vida saludables y la participación intergeneracional activa.
                        </p>
                    </div>
                 </div>
              </div>
            </section>

            {/* Additional content below hero */}
            <div className="max-w-6xl mx-auto px-4 space-y-20 pb-20">
              <div className="grid md:grid-cols-3 gap-12">
                <div className="md:col-span-2 space-y-10">
                  <h2 className="text-3xl font-bold flex items-center gap-3">
                    <span className="text-emerald-500">📰</span> Últimas Noticias
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-8">
                    {blogPosts.map(post => (
                      <div 
                        key={post.id} 
                        onClick={() => { setActiveTab('blog'); handlePostClick(post); }}
                        className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer"
                      >
                        <div className="h-56 overflow-hidden">
                          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
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
    }

    if (activeTab === 'admin') {
         if (!currentUser) {
             setActiveTab('inicio');
             return null; 
         }
         return (
             <AdminDashboard 
                currentUser={currentUser}
                onLogout={handleLogout}
                events={events}
                resources={resources}
                blogPosts={blogPosts}
                users={users}
                onAddEvent={handleAddEvent}
                onUpdateEvent={handleUpdateEvent}
                onDeleteEvent={handleDeleteEvent}
                onAddResource={handleAddResource}
                onUpdateResource={handleUpdateResource}
                onDeleteResource={handleDeleteResource}
                onAddBlogPost={handleAddBlogPost}
                onUpdateBlogPost={handleUpdateBlogPost}
                onDeleteBlogPost={handleDeleteBlogPost}
                onAddUser={handleAddUser}
                onDeleteUser={handleDeleteUser}
             />
         );
    }

    if (activeTab === 'agenda') {
        return (
            <div className="max-w-6xl mx-auto px-4 py-10 animate-fadeIn">
                 <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <span className="text-emerald-500">📅</span> Agenda Saludable
                 </h2>
                 <div className="grid md:grid-cols-2 gap-6">
                    {events.map(event => (
                        <div key={event.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">{event.category}</div>
                                <div className="text-right">
                                    <span className="block text-2xl font-black text-gray-900 leading-none">{event.date.split('-')[2]}</span>
                                    <span className="block text-xs text-gray-500 uppercase font-bold">Mayo</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <span>📍 {event.location}</span>
                                <span>⏰ {event.time}</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                            <div className="text-xs text-emerald-600 font-bold">Organiza: {event.organizer}</div>
                        </div>
                    ))}
                 </div>
            </div>
        );
    }

    if (activeTab === 'mapa') {
        return (
            <div className="max-w-7xl mx-auto px-4 py-6 h-[calc(100vh-100px)] flex flex-col animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                     <h2 className="text-2xl font-black text-gray-900">Mapa de Recursos</h2>
                     <select 
                        className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm"
                        value={selectedTag || ''}
                        onChange={(e) => setSelectedTag(e.target.value || null)}
                     >
                        <option value="">Todos los recursos</option>
                        {allTags.map(tag => (
                            <option key={tag} value={tag}>{tag}</option>
                        ))}
                     </select>
                </div>
                <div className="flex-1 rounded-3xl overflow-hidden border border-gray-200 shadow-lg">
                    <ResourceMap resources={filteredResources} />
                </div>
            </div>
        );
    }

    if (activeTab === 'blog') {
        if (selectedPost) {
            return (
                <div className="max-w-4xl mx-auto px-4 py-10 animate-fadeIn">
                    <button onClick={() => setSelectedPost(null)} className="text-emerald-600 font-bold text-sm mb-6 flex items-center gap-1 hover:underline">
                        ← Volver al blog
                    </button>
                    <img src={selectedPost.imageUrl} alt={selectedPost.title} className="w-full h-80 object-cover rounded-3xl mb-8 shadow-lg" />
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full uppercase">{selectedPost.category}</span>
                        <span className="text-gray-400 text-sm">{selectedPost.date}</span>
                    </div>
                    <h1 className="text-4xl font-black text-gray-900 mb-6">{selectedPost.title}</h1>
                    <div className="prose prose-lg prose-emerald max-w-none text-gray-600">
                        {selectedPost.blocks.map(block => {
                            if (block.type === 'header') return <h2 key={block.id} className="font-bold text-2xl text-gray-900 mt-8 mb-4">{block.content}</h2>;
                            if (block.type === 'image') return <img key={block.id} src={block.content} alt="" className="w-full rounded-xl my-6" style={{ width: block.settings?.width || '100%' }} />;
                            if (block.type === 'quote') return <blockquote key={block.id} className="border-l-4 border-emerald-500 pl-4 italic text-xl text-emerald-800 my-6 bg-emerald-50 p-4 rounded-r-lg" dangerouslySetInnerHTML={{ __html: block.content }} />;
                            return <div key={block.id} dangerouslySetInnerHTML={{ __html: block.content }} className="mb-4" />;
                        })}
                    </div>
                </div>
            );
        }
        return (
            <div className="max-w-6xl mx-auto px-4 py-10 animate-fadeIn">
                <h2 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
                    <span className="text-emerald-500">📰</span> Blog y Noticias
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map(post => (
                      <div 
                        key={post.id} 
                        onClick={() => handlePostClick(post)}
                        className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer flex flex-col"
                      >
                        <div className="h-48 overflow-hidden">
                          <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="p-6 flex-1 flex flex-col">
                          <div className="mb-2 flex items-center justify-between">
                              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{post.category}</span>
                              <span className="text-xs text-gray-400">{post.date}</span>
                          </div>
                          <h3 className="font-bold text-lg leading-tight group-hover:text-emerald-600 transition-colors mb-2">{post.title}</h3>
                          <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
                          <div className="flex items-center gap-2 mt-auto">
                              {post.tags.slice(0, 3).map(tag => (
                                  <span key={tag} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">#{tag}</span>
                              ))}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
            </div>
        );
    }

    if (activeTab === 'propuestas') {
        return (
            <div className="max-w-4xl mx-auto px-4 py-10 animate-fadeIn">
                 <div className="text-center mb-10">
                    <h2 className="text-3xl font-black text-gray-900 mb-2">Participación Ciudadana</h2>
                    <p className="text-gray-500">Propón ideas para mejorar Badajoz y vota las de tus vecinos.</p>
                 </div>
                 
                 <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl mb-10 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-emerald-800 text-lg">¿Tienes una idea?</h3>
                        <p className="text-emerald-600 text-sm">Tu propuesta será revisada y publicada para votación.</p>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-xl transition-colors">
                        Nueva Propuesta
                    </button>
                 </div>

                 <div className="space-y-6">
                    {proposals.map(proposal => (
                        <ProposalCard key={proposal.id} proposal={proposal} onVote={handleVote} />
                    ))}
                 </div>
            </div>
        );
    }

    // Default or Fallback
    return null;
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans text-gray-900 pb-20 md:pb-0 flex flex-col">
      <Navigation 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLoginClick={() => setIsLoginModalOpen(true)}
        isAdmin={isAdmin}
      />
      
      <main className="flex-grow">
        {renderContent()}
      </main>

      <Footer setActiveTab={setActiveTab} />

      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
        onLogin={handleLogin}
      />
    </div>
  );
};

export default App;
