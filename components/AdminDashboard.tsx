
import React, { useState, useRef } from 'react';
import { AgendaEvent, Resource, BlogPost, Category, User, Role, Attachment } from '../types';

interface AdminDashboardProps {
  currentUser: User | null;
  onLogout: () => void;
  events: AgendaEvent[];
  resources: Resource[];
  blogPosts: BlogPost[];
  users: User[];
  onAddEvent: (e: AgendaEvent) => void;
  onUpdateEvent: (e: AgendaEvent) => void;
  onDeleteEvent: (id: string) => void;
  onAddResource: (r: Resource) => void;
  onUpdateResource: (r: Resource) => void;
  onDeleteResource: (id: string) => void;
  onAddBlogPost: (b: BlogPost) => void;
  onUpdateBlogPost: (b: BlogPost) => void;
  onDeleteBlogPost: (id: string) => void;
  onAddUser: (u: User) => void;
  onDeleteUser: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser, onLogout,
  events, resources, blogPosts, users,
  onAddEvent, onUpdateEvent, onDeleteEvent,
  onAddResource, onUpdateResource, onDeleteResource,
  onAddBlogPost, onUpdateBlogPost, onDeleteBlogPost,
  onAddUser, onDeleteUser
}) => {
  const [activeSection, setActiveSection] = useState<'articulos' | 'agenda' | 'recursos' | 'usuarios'>('articulos');
  
  // Forms State
  const [editingId, setEditingId] = useState<string | null>(null);

  const [postForm, setPostForm] = useState<Partial<BlogPost>>({ category: 'General', attachments: [] });
  const [eventForm, setEventForm] = useState<Partial<AgendaEvent>>({ category: Category.Salud });
  const [resourceForm, setResourceForm] = useState<Partial<Resource>>({ type: 'General' });
  const [userForm, setUserForm] = useState<Partial<User>>({ role: Role.Editor });

  // Refs for Editor
  const contentTextAreaRef = useRef<HTMLTextAreaElement>(null);

  // -- Handlers for Edit Setup --
  const handleEditPost = (post: BlogPost) => {
    setPostForm(post);
    setEditingId(post.id);
  };
  
  const handleEditEvent = (event: AgendaEvent) => {
    setEventForm(event);
    setEditingId(event.id);
  };

  const handleEditResource = (resource: Resource) => {
    setResourceForm(resource);
    setEditingId(resource.id);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setPostForm({ category: 'General', attachments: [] });
    setEventForm({ category: Category.Salud });
    setResourceForm({ type: 'General' });
  };

  // -- Editor Logic (Markdown insertion) --
  const insertText = (before: string, after: string = '') => {
    const textarea = contentTextAreaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const previousValue = textarea.value;
    const selectedText = previousValue.substring(start, end);

    const newValue = previousValue.substring(0, start) + before + selectedText + after + previousValue.substring(end);
    
    setPostForm({ ...postForm, content: newValue });
    
    // Restore focus and cursor
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      const type = file.type.startsWith('image/') ? 'image' : 'file';
      
      const newAttachment: Attachment = {
        name: file.name,
        url: objectUrl,
        type: type
      };

      setPostForm(prev => ({
        ...prev,
        attachments: [...(prev.attachments || []), newAttachment]
      }));

      // If it's the first image and no main image is set, set it as main
      if (type === 'image' && !postForm.imageUrl) {
        setPostForm(prev => ({ ...prev, imageUrl: objectUrl }));
      }
    }
  };

  const removeAttachment = (index: number) => {
    setPostForm(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index)
    }));
  };

  // -- Submit Handlers --
  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (postForm.title && postForm.excerpt) {
      const postData: BlogPost = {
          id: editingId || Date.now().toString(),
          title: postForm.title || '',
          excerpt: postForm.excerpt || '',
          content: postForm.content || '',
          author: postForm.author || currentUser?.name || 'Admin',
          date: postForm.date || new Date().toISOString().split('T')[0],
          imageUrl: postForm.imageUrl || 'https://picsum.photos/800/400',
          category: postForm.category || 'General',
          attachments: postForm.attachments || []
      };

      if (editingId) {
        onUpdateBlogPost(postData);
      } else {
        onAddBlogPost(postData);
      }
      cancelEdit();
    }
  };

  const handleSubmitEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (eventForm.title && eventForm.date) {
      if (editingId) {
        onUpdateEvent({ ...eventForm, id: editingId } as AgendaEvent);
      } else {
        onAddEvent({
          id: Date.now().toString(),
          title: eventForm.title,
          date: eventForm.date,
          time: eventForm.time || '10:00',
          location: eventForm.location || 'Badajoz',
          description: eventForm.description || '',
          category: eventForm.category as Category,
          organizer: eventForm.organizer || 'Farmamundi'
        });
      }
      cancelEdit();
    }
  };

  const handleSubmitResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (resourceForm.name && resourceForm.lat && resourceForm.lng) {
      if (editingId) {
         onUpdateResource({ ...resourceForm, id: editingId } as Resource);
      } else {
         onAddResource({
            id: Date.now().toString(),
            name: resourceForm.name,
            type: resourceForm.type || 'General',
            address: resourceForm.address || '',
            description: resourceForm.description || '',
            lat: Number(resourceForm.lat),
            lng: Number(resourceForm.lng),
            tags: resourceForm.tags || []
        });
      }
      cancelEdit();
    }
  };

  const handleSubmitUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (userForm.email && userForm.name) {
        onAddUser({
            id: Date.now().toString(),
            name: userForm.name,
            email: userForm.email,
            role: userForm.role || Role.Editor
        });
        setUserForm({ role: Role.Editor });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
            <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Panel de Administración</h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full uppercase">{currentUser?.role}</span>
            </div>
            <p className="text-gray-500 mt-2">Bienvenido, {currentUser?.name}. Gestiona los contenidos de la plataforma.</p>
        </div>
        <div className="flex flex-col items-end gap-4">
             <button 
                onClick={onLogout}
                className="text-red-500 font-bold text-sm hover:text-red-700 flex items-center gap-1"
             >
                Cerrar Sesión <span>🚪</span>
             </button>
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex overflow-x-auto max-w-full">
                {(['articulos', 'agenda', 'recursos', 'usuarios'] as const).map(section => (
                    <button
                        key={section}
                        onClick={() => { setActiveSection(section); cancelEdit(); }}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold capitalize transition-all whitespace-nowrap ${
                            activeSection === section 
                            ? 'bg-gray-900 text-white shadow-lg' 
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                        {section}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-24">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-xl">
                        {editingId ? '✏️ Editando' : '➕ Crear Nuevo'}
                    </h3>
                    {editingId && (
                        <button onClick={cancelEdit} className="text-xs text-red-500 font-bold hover:underline">Cancelar</button>
                    )}
                </div>

                {activeSection === 'articulos' && (
                    <form onSubmit={handleSubmitPost} className="space-y-4">
                        {/* Title & Category */}
                        <div className="space-y-3">
                            <input 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-gray-800" 
                                placeholder="Título del Artículo" 
                                value={postForm.title || ''} 
                                onChange={e => setPostForm({...postForm, title: e.target.value})} 
                            />
                             <div className="flex gap-2">
                                <input 
                                    className="w-1/2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs" 
                                    placeholder="Categoría (Ej: Salud)" 
                                    value={postForm.category || ''} 
                                    onChange={e => setPostForm({...postForm, category: e.target.value})} 
                                />
                                <input 
                                    className="w-1/2 bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs" 
                                    placeholder="URL Imagen Portada" 
                                    value={postForm.imageUrl || ''} 
                                    onChange={e => setPostForm({...postForm, imageUrl: e.target.value})} 
                                />
                             </div>
                             <textarea 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs resize-none" 
                                placeholder="Breve extracto para la tarjeta..." 
                                rows={2} 
                                value={postForm.excerpt || ''} 
                                onChange={e => setPostForm({...postForm, excerpt: e.target.value})} 
                            />
                        </div>

                        {/* Rich Text Toolbar */}
                        <div className="border border-gray-200 rounded-xl overflow-hidden">
                            <div className="bg-gray-100 p-2 flex gap-1 border-b border-gray-200 overflow-x-auto">
                                <button type="button" onClick={() => insertText('**', '**')} className="p-1.5 hover:bg-gray-200 rounded font-bold text-gray-700 min-w-[28px]" title="Negrita">B</button>
                                <button type="button" onClick={() => insertText('*', '*')} className="p-1.5 hover:bg-gray-200 rounded italic text-gray-700 min-w-[28px]" title="Cursiva">I</button>
                                <div className="w-px bg-gray-300 mx-1"></div>
                                <button type="button" onClick={() => insertText('## ')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700 text-xs font-bold" title="Título 2">H2</button>
                                <button type="button" onClick={() => insertText('### ')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700 text-xs font-bold" title="Título 3">H3</button>
                                <div className="w-px bg-gray-300 mx-1"></div>
                                <button type="button" onClick={() => insertText('- ')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700" title="Lista">List</button>
                                <button type="button" onClick={() => insertText('[', '](url)')} className="p-1.5 hover:bg-gray-200 rounded text-gray-700 text-xs" title="Enlace">Link</button>
                            </div>
                            <textarea 
                                ref={contentTextAreaRef}
                                className="w-full bg-white p-3 text-sm h-40 focus:outline-none font-mono text-gray-700"
                                placeholder="Escribe aquí el contenido del artículo (soporta Markdown)..." 
                                value={postForm.content || ''} 
                                onChange={e => setPostForm({...postForm, content: e.target.value})} 
                            />
                        </div>

                        {/* File Attachments */}
                        <div className="border border-dashed border-gray-300 rounded-xl p-4 text-center bg-gray-50">
                             <input type="file" id="fileUpload" className="hidden" onChange={handleFileUpload} />
                             <label htmlFor="fileUpload" className="cursor-pointer flex flex-col items-center gap-2">
                                <span className="text-2xl text-gray-400">📎</span>
                                <span className="text-xs text-gray-500 font-medium">Click para adjuntar imágenes o archivos</span>
                             </label>

                             {postForm.attachments && postForm.attachments.length > 0 && (
                                <div className="grid grid-cols-2 gap-2 mt-4 text-left">
                                    {postForm.attachments.map((file, idx) => (
                                        <div key={idx} className="relative group bg-white p-2 rounded-lg border border-gray-200 flex items-center gap-2 shadow-sm">
                                            {file.type === 'image' ? (
                                                <img src={file.url} className="w-8 h-8 object-cover rounded" alt="preview" />
                                            ) : (
                                                <span className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-xs">📄</span>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[10px] truncate font-medium text-gray-700">{file.name}</p>
                                            </div>
                                            <button 
                                                type="button" 
                                                onClick={() => removeAttachment(idx)}
                                                className="text-red-400 hover:text-red-600 px-1"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                             )}
                        </div>

                        <button className={`w-full text-white font-bold py-3 rounded-xl transition-colors shadow-lg ${editingId ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'}`}>
                            {editingId ? 'Actualizar Artículo' : 'Publicar Artículo'}
                        </button>
                    </form>
                )}

                {activeSection === 'agenda' && (
                    <form onSubmit={handleSubmitEvent} className="space-y-4">
                        <input className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" placeholder="Título Evento" value={eventForm.title || ''} onChange={e => setEventForm({...eventForm, title: e.target.value})} />
                        <div className="grid grid-cols-2 gap-2">
                             <input type="date" className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" value={eventForm.date || ''} onChange={e => setEventForm({...eventForm, date: e.target.value})} />
                             <input type="time" className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" value={eventForm.time || ''} onChange={e => setEventForm({...eventForm, time: e.target.value})} />
                        </div>
                        <input className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" placeholder="Ubicación" value={eventForm.location || ''} onChange={e => setEventForm({...eventForm, location: e.target.value})} />
                        <textarea className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" placeholder="Descripción" rows={3} value={eventForm.description || ''} onChange={e => setEventForm({...eventForm, description: e.target.value})} />
                        <select className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" value={eventForm.category} onChange={e => setEventForm({...eventForm, category: e.target.value as Category})}>
                            {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button className={`w-full text-white font-bold py-3 rounded-xl transition-colors ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                            {editingId ? 'Actualizar Evento' : 'Agendar Evento'}
                        </button>
                    </form>
                )}

                {activeSection === 'recursos' && (
                    <form onSubmit={handleSubmitResource} className="space-y-4">
                        <input className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" placeholder="Nombre del Lugar" value={resourceForm.name || ''} onChange={e => setResourceForm({...resourceForm, name: e.target.value})} />
                        <input className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" placeholder="Tipo (Ej: Parque, Farmacia)" value={resourceForm.type || ''} onChange={e => setResourceForm({...resourceForm, type: e.target.value})} />
                        <input className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" placeholder="Dirección" value={resourceForm.address || ''} onChange={e => setResourceForm({...resourceForm, address: e.target.value})} />
                        <div className="grid grid-cols-2 gap-2">
                             <input type="number" step="any" className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" placeholder="Latitud" value={resourceForm.lat || ''} onChange={e => setResourceForm({...resourceForm, lat: parseFloat(e.target.value)})} />
                             <input type="number" step="any" className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" placeholder="Longitud" value={resourceForm.lng || ''} onChange={e => setResourceForm({...resourceForm, lng: parseFloat(e.target.value)})} />
                        </div>
                        <textarea className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" placeholder="Descripción" rows={3} value={resourceForm.description || ''} onChange={e => setResourceForm({...resourceForm, description: e.target.value})} />
                        <button className={`w-full text-white font-bold py-3 rounded-xl transition-colors ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                            {editingId ? 'Actualizar Recurso' : 'Añadir al Mapa'}
                        </button>
                    </form>
                )}

                {activeSection === 'usuarios' && (
                    <form onSubmit={handleSubmitUser} className="space-y-4">
                        <p className="text-xs text-gray-500 mb-2">Añadir nuevo miembro al equipo.</p>
                        <input className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" placeholder="Nombre Completo" value={userForm.name || ''} onChange={e => setUserForm({...userForm, name: e.target.value})} />
                        <input className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" type="email" placeholder="Email Corporativo" value={userForm.email || ''} onChange={e => setUserForm({...userForm, email: e.target.value})} />
                        <select className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value as Role})}>
                            {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors">
                            Registrar Usuario
                        </button>
                    </form>
                )}
            </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-4">
             {activeSection === 'articulos' && blogPosts.map(post => (
                 <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center group">
                    <div className="flex gap-4">
                        <img src={post.imageUrl} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                        <div>
                            <h4 className="font-bold text-gray-900">{post.title}</h4>
                            <p className="text-xs text-gray-400 mt-1">{post.date} • {post.author}</p>
                            {post.attachments && post.attachments.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                    {post.attachments.map((att, i) => (
                                        <span key={i} className="text-[9px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">📎 {att.name}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleEditPost(post)} className="text-blue-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">✏️</button>
                        <button onClick={() => onDeleteBlogPost(post.id)} className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors">🗑️</button>
                    </div>
                 </div>
             ))}

             {activeSection === 'agenda' && events.map(event => (
                 <div key={event.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{event.category}</span>
                            <span className="text-xs text-gray-400">{event.date} - {event.time}</span>
                        </div>
                        <h4 className="font-bold text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleEditEvent(event)} className="text-blue-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">✏️</button>
                        <button onClick={() => onDeleteEvent(event.id)} className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors">🗑️</button>
                    </div>
                 </div>
             ))}

             {activeSection === 'recursos' && resources.map(res => (
                 <div key={res.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-gray-900">{res.name}</h4>
                        <p className="text-xs text-emerald-600 font-bold uppercase tracking-wider mt-1">{res.type}</p>
                        <p className="text-sm text-gray-400 mt-1">{res.address}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleEditResource(res)} className="text-blue-400 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors">✏️</button>
                        <button onClick={() => onDeleteResource(res.id)} className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors">🗑️</button>
                    </div>
                 </div>
             ))}

             {activeSection === 'usuarios' && users.map(user => (
                 <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-gray-900">{user.name}</h4>
                        <p className="text-xs text-gray-400 mt-1">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${user.role === Role.Admin ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                            {user.role}
                        </span>
                        {user.id !== currentUser?.id && (
                             <button onClick={() => onDeleteUser(user.id)} className="text-red-400 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors">🗑️</button>
                        )}
                    </div>
                 </div>
             ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
