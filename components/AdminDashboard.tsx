
import React, { useState, useRef, useEffect } from 'react';
import { AgendaEvent, Resource, BlogPost, Category, User, Role, ContentBlock, BlockType, BlockSettings, Proposal, ProposalStatus } from '../types';

interface AdminDashboardProps {
  currentUser: User | null;
  onLogout: () => void;
  events: AgendaEvent[];
  resources: Resource[];
  blogPosts: BlogPost[];
  users: User[];
  proposals: Proposal[]; 
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
  onUpdateProposal: (p: Proposal) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser, onLogout,
  events, resources, blogPosts, users, proposals,
  onAddEvent, onUpdateEvent, onDeleteEvent,
  onAddResource, onUpdateResource, onDeleteResource,
  onAddBlogPost, onUpdateBlogPost, onDeleteBlogPost,
  onAddUser, onDeleteUser, onUpdateProposal
}) => {
  const [activeSection, setActiveSection] = useState<'solicitudes' | 'articulos' | 'agenda' | 'recursos' | 'usuarios'>('solicitudes');
  
  // Forms State
  const [editingId, setEditingId] = useState<string | null>(null);

  const defaultBlocks: ContentBlock[] = [
    { id: 'def-1', type: 'header', content: 'Título de sección', settings: { textAlign: 'left' } },
    { id: 'def-2', type: 'paragraph', content: 'Escribe aquí el contenido...', settings: { textAlign: 'left' } }
  ];

  const [postForm, setPostForm] = useState<Partial<BlogPost>>({ 
      category: 'General', 
      tags: [], 
      blocks: defaultBlocks,
      date: new Date().toISOString().split('T')[0] 
  });
  
  const [eventForm, setEventForm] = useState<Partial<AgendaEvent>>({ category: Category.Salud });
  const [resourceForm, setResourceForm] = useState<Partial<Resource>>({ category: Category.Salud });
  const [userForm, setUserForm] = useState<Partial<User>>({ role: Role.Editor });
  const [tagInput, setTagInput] = useState('');

  // -- Edit Handlers --
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
    setPostForm({ 
        category: 'General', 
        tags: [], 
        blocks: [
          { id: Date.now().toString() + '1', type: 'header', content: '', settings: { textAlign: 'left' } },
          { id: Date.now().toString() + '2', type: 'paragraph', content: '', settings: { textAlign: 'left' } }
        ], 
        date: new Date().toISOString().split('T')[0] 
    });
    setEventForm({ category: Category.Salud });
    setResourceForm({ category: Category.Salud });
    setTagInput('');
  };

  // -- Validation Logic for Proposals --
  const handleValidateProposal = (proposal: Proposal) => {
    // 1. Validate Event
    if (proposal.type === 'event' && proposal.details) {
        const d = proposal.details;
        const newEvent: AgendaEvent = {
            id: `evt-${Date.now()}`,
            title: d.title || proposal.title,
            date: d.date || new Date().toISOString().split('T')[0],
            startTime: d.startTime || '10:00',
            endTime: d.endTime,
            location: d.location || 'Badajoz',
            description: d.description || proposal.description,
            category: d.category || Category.Salud,
            organizer: d.organizer || proposal.author,
            email: d.email,
            phone: d.phone,
            image: d.image,
            lat: d.lat,
            lng: d.lng
        };
        onAddEvent(newEvent);
        onUpdateProposal({ ...proposal, status: ProposalStatus.Validated });
        alert('Evento creado en la Agenda y propuesta validada.');
    } 
    // 2. Validate Resource
    else if (proposal.type === 'resource' && proposal.details) {
        const d = proposal.details;
        const newResource: Resource = {
            id: `res-${Date.now()}`,
            name: d.name || proposal.title,
            category: d.category || Category.Salud,
            address: d.address || '',
            description: d.description || proposal.description,
            lat: d.lat || 38.8794,
            lng: d.lng || -6.9707,
            tags: [d.category || 'General'],
            email: d.email,
            phone: d.phone,
            image: d.image
        };
        onAddResource(newResource);
        onUpdateProposal({ ...proposal, status: ProposalStatus.Validated });
        alert('Recurso añadido al Mapa y propuesta validada.');
    } 
    // 3. Fallback / General
    else {
        onUpdateProposal({ ...proposal, status: ProposalStatus.Validated });
        alert('Propuesta validada (sin crear elementos asociados).');
    }
  };

  const handleRejectProposal = (proposal: Proposal) => {
      onUpdateProposal({ ...proposal, status: ProposalStatus.Rejected });
  };

  // -- BLOCK EDITOR LOGIC --

  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
        id: Date.now().toString(),
        type,
        content: '',
        settings: { textAlign: 'left', width: type === 'image' ? '100%' : undefined, filter: 'none' }
    };
    setPostForm(prev => ({ ...prev, blocks: [...(prev.blocks || []), newBlock] }));
  };

  const updateBlock = (id: string, content: string) => {
    setPostForm(prev => ({ ...prev, blocks: prev.blocks?.map(b => b.id === id ? { ...b, content } : b) }));
  };

  const updateBlockSettings = (id: string, newSettings: Partial<BlockSettings>) => {
    setPostForm(prev => ({ ...prev, blocks: prev.blocks?.map(b => b.id === id ? { ...b, settings: { ...b.settings, ...newSettings } } : b) }));
  };

  const handleBlockImageUpload = (id: string, file: File) => {
    const url = URL.createObjectURL(file);
    setPostForm(prev => ({ ...prev, blocks: prev.blocks?.map(b => b.id === id ? { ...b, content: url, file } : b) }));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    if (!postForm.blocks) return;
    const newBlocks = [...postForm.blocks];
    if (direction === 'up' && index > 0) {
        [newBlocks[index], newBlocks[index - 1]] = [newBlocks[index - 1], newBlocks[index]];
    } else if (direction === 'down' && index < newBlocks.length - 1) {
        [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
    }
    setPostForm(prev => ({ ...prev, blocks: newBlocks }));
  };

  const deleteBlock = (index: number) => {
    setPostForm(prev => ({ ...prev, blocks: prev.blocks?.filter((_, i) => i !== index) }));
  };

  // Basic "Rich Text" injection
  const insertTag = (id: string, tag: 'b' | 'i') => {
      // Simple approximation for a custom editor without contentEditable complexity
      // In a real app, use a library or proper selection range handling
      const block = postForm.blocks?.find(b => b.id === id);
      if(block) {
          const tagStart = tag === 'b' ? '<b>' : '<i>';
          const tagEnd = tag === 'b' ? '</b>' : '</i>';
          updateBlock(id, block.content + `${tagStart}texto${tagEnd}`);
      }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
        e.preventDefault();
        if (!postForm.tags?.includes(tagInput.trim())) {
            setPostForm(prev => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
        }
        setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setPostForm(prev => ({ ...prev, tags: prev.tags?.filter(t => t !== tagToRemove) }));
  };

  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        setPostForm(prev => ({ ...prev, imageUrl: url }));
    }
  };

  // SUBMIT HANDLERS
  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (postForm.title) {
      let finalExcerpt = postForm.excerpt;
      if (!finalExcerpt && postForm.blocks) {
          const firstPara = postForm.blocks.find(b => b.type === 'paragraph');
          if (firstPara) {
              const tempDiv = document.createElement('div');
              tempDiv.innerHTML = firstPara.content;
              finalExcerpt = (tempDiv.textContent || tempDiv.innerText || '').substring(0, 100) + '...';
          }
      }
      const postData: BlogPost = {
          id: editingId || Date.now().toString(),
          title: postForm.title || '',
          excerpt: finalExcerpt || '',
          author: postForm.author || currentUser?.name || 'Admin',
          date: postForm.date || new Date().toISOString().split('T')[0],
          imageUrl: postForm.imageUrl || 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1000',
          category: postForm.category || 'General',
          tags: postForm.tags || [],
          blocks: postForm.blocks || []
      };
      if (editingId) onUpdateBlogPost(postData);
      else onAddBlogPost(postData);
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
          startTime: eventForm.startTime || '10:00',
          endTime: eventForm.endTime,
          location: eventForm.location || 'Badajoz',
          description: eventForm.description || '',
          category: eventForm.category as Category,
          organizer: eventForm.organizer || 'Farmamundi',
          lat: eventForm.lat,
          lng: eventForm.lng,
          image: eventForm.image
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
            category: resourceForm.category || Category.Salud,
            address: resourceForm.address || '',
            description: resourceForm.description || '',
            lat: Number(resourceForm.lat),
            lng: Number(resourceForm.lng),
            tags: resourceForm.tags || [],
            image: resourceForm.image
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
            <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">Panel de Administración</h1>
                <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full uppercase">{currentUser?.role}</span>
            </div>
            <p className="text-gray-500 mt-2">Gestiona las propuestas ciudadanas y el contenido de la plataforma.</p>
        </div>
        <div className="flex flex-col items-end gap-4">
             <button onClick={onLogout} className="text-red-500 font-bold text-sm hover:text-red-700 flex items-center gap-1">
                Cerrar Sesión <span>🚪</span>
             </button>
            <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex overflow-x-auto max-w-full">
                {(['solicitudes', 'articulos', 'agenda', 'recursos', 'usuarios'] as const).map(section => (
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
        {/* Editor Column */}
        {activeSection !== 'solicitudes' && (
        <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-24 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-xl">
                        {editingId ? '✏️ Editando' : '➕ Crear Nuevo'}
                    </h3>
                    {editingId && (
                        <button onClick={cancelEdit} className="text-xs text-red-500 font-bold hover:underline">Cancelar</button>
                    )}
                </div>

                {/* --- BLOG EDITOR --- */}
                {activeSection === 'articulos' && (
                    <form onSubmit={handleSubmitPost} className="space-y-6">
                        <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Metadatos</label>
                            <input className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold" placeholder="Título Principal" value={postForm.title || ''} onChange={e => setPostForm({...postForm, title: e.target.value})} />
                            <div className="grid grid-cols-2 gap-2">
                                <input className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs" placeholder="Categoría" value={postForm.category || ''} onChange={e => setPostForm({...postForm, category: e.target.value})} />
                                <input type="date" className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs" value={postForm.date || ''} onChange={e => setPostForm({...postForm, date: e.target.value})} />
                            </div>
                             <div className="relative group w-full h-32 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer hover:border-emerald-400 transition-colors">
                                <input type="file" onChange={handleCoverImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                {postForm.imageUrl ? (
                                    <img src={postForm.imageUrl} className="w-full h-full object-cover" alt="Cover" />
                                ) : (
                                    <div className="text-center text-gray-400"><span className="text-2xl block">📷</span><span className="text-xs font-medium">Portada</span></div>
                                )}
                            </div>
                        </div>

                        {/* BLOCK EDITOR */}
                        <div className="space-y-4">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Contenido por Bloques</label>
                            {postForm.blocks?.map((block, index) => (
                                <div key={block.id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative group">
                                    {/* Block Controls */}
                                    <div className="absolute right-2 top-2 flex gap-1 opacity-20 group-hover:opacity-100 transition-opacity">
                                        <button type="button" onClick={() => moveBlock(index, 'up')} className="p-1 hover:bg-gray-100 rounded text-xs">⬆️</button>
                                        <button type="button" onClick={() => moveBlock(index, 'down')} className="p-1 hover:bg-gray-100 rounded text-xs">⬇️</button>
                                        <button type="button" onClick={() => deleteBlock(index)} className="p-1 hover:bg-red-50 text-red-500 rounded text-xs">🗑️</button>
                                    </div>

                                    {/* Block Content */}
                                    <div className="mb-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{block.type}</span>
                                    </div>

                                    {/* Render based on Type */}
                                    {(block.type === 'paragraph' || block.type === 'header' || block.type === 'quote') && (
                                        <div className="space-y-2">
                                            {/* Text Toolbar */}
                                            <div className="flex gap-2 border-b border-gray-100 pb-2 mb-2">
                                                <button type="button" onClick={() => insertTag(block.id, 'b')} className="text-xs font-bold px-2 py-1 bg-gray-50 rounded hover:bg-gray-200">B</button>
                                                <button type="button" onClick={() => insertTag(block.id, 'i')} className="text-xs italic px-2 py-1 bg-gray-50 rounded hover:bg-gray-200">I</button>
                                                <div className="w-px bg-gray-300 mx-1"></div>
                                                <button type="button" onClick={() => updateBlockSettings(block.id, { textAlign: 'left' })} className={`text-xs px-2 py-1 rounded ${block.settings?.textAlign === 'left' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-50'}`}>L</button>
                                                <button type="button" onClick={() => updateBlockSettings(block.id, { textAlign: 'center' })} className={`text-xs px-2 py-1 rounded ${block.settings?.textAlign === 'center' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-50'}`}>C</button>
                                                <button type="button" onClick={() => updateBlockSettings(block.id, { textAlign: 'right' })} className={`text-xs px-2 py-1 rounded ${block.settings?.textAlign === 'right' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-50'}`}>R</button>
                                                {block.type !== 'header' && <button type="button" onClick={() => updateBlockSettings(block.id, { textAlign: 'justify' })} className={`text-xs px-2 py-1 rounded ${block.settings?.textAlign === 'justify' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-50'}`}>J</button>}
                                            </div>
                                            <textarea 
                                                className={`w-full bg-gray-50 rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-emerald-400 ${block.type === 'header' ? 'font-bold' : ''}`} 
                                                rows={block.type === 'paragraph' ? 4 : 2}
                                                value={block.content}
                                                onChange={(e) => updateBlock(block.id, e.target.value)}
                                                placeholder={block.type === 'header' ? 'Escribe un subtítulo...' : 'Escribe el párrafo...'}
                                            />
                                        </div>
                                    )}

                                    {block.type === 'image' && (
                                        <div className="space-y-3">
                                             <div className="flex gap-2 border-b border-gray-100 pb-2">
                                                 <select 
                                                    className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1"
                                                    value={block.settings?.width || '100%'}
                                                    onChange={(e) => updateBlockSettings(block.id, { width: e.target.value as any })}
                                                 >
                                                     <option value="100%">100% Ancho</option>
                                                     <option value="75%">75%</option>
                                                     <option value="50%">50%</option>
                                                     <option value="25%">25%</option>
                                                 </select>
                                                  <select 
                                                    className="text-xs bg-gray-50 border border-gray-200 rounded px-2 py-1"
                                                    value={block.settings?.filter || 'none'}
                                                    onChange={(e) => updateBlockSettings(block.id, { filter: e.target.value as any })}
                                                 >
                                                     <option value="none">Normal</option>
                                                     <option value="grayscale">B/N</option>
                                                     <option value="sepia">Sepia</option>
                                                     <option value="blur">Blur</option>
                                                 </select>
                                                  <button type="button" onClick={() => updateBlockSettings(block.id, { textAlign: 'center' })} className={`text-xs px-2 py-1 rounded ${block.settings?.textAlign === 'center' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-50'}`}>Centrar</button>
                                             </div>
                                             {block.content ? (
                                                 <div className="relative">
                                                     <img src={block.content} alt="" className="w-full h-32 object-cover rounded-lg bg-gray-100" />
                                                     <button type="button" onClick={() => updateBlock(block.id, '')} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs">✕</button>
                                                 </div>
                                             ) : (
                                                 <input type="file" className="text-xs w-full" onChange={(e) => e.target.files && handleBlockImageUpload(block.id, e.target.files[0])} />
                                             )}
                                             <input 
                                                className="w-full bg-gray-50 rounded-lg p-2 text-xs border border-transparent focus:border-emerald-300 outline-none" 
                                                placeholder="Pie de foto (opcional)"
                                                value={block.settings?.caption || ''}
                                                onChange={(e) => updateBlockSettings(block.id, { caption: e.target.value })}
                                             />
                                        </div>
                                    )}
                                </div>
                            ))}

                            <div className="flex gap-2 justify-center pt-2">
                                <button type="button" onClick={() => addBlock('header')} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg font-bold">H</button>
                                <button type="button" onClick={() => addBlock('paragraph')} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg font-bold">P</button>
                                <button type="button" onClick={() => addBlock('image')} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg font-bold">IMG</button>
                                <button type="button" onClick={() => addBlock('quote')} className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg font-bold">""</button>
                            </div>
                        </div>

                        <button className={`w-full text-white font-bold py-3 rounded-xl transition-colors shadow-lg ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
                            {editingId ? 'Actualizar Artículo' : 'Publicar Artículo'}
                        </button>
                    </form>
                )}

                {activeSection === 'agenda' && (
                    <form onSubmit={handleSubmitEvent} className="space-y-4">
                        <input className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" placeholder="Título Evento" value={eventForm.title || ''} onChange={e => setEventForm({...eventForm, title: e.target.value})} />
                        <div className="grid grid-cols-2 gap-2">
                             <input type="date" className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" value={eventForm.date || ''} onChange={e => setEventForm({...eventForm, date: e.target.value})} />
                             <input type="time" className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" value={eventForm.startTime || ''} onChange={e => setEventForm({...eventForm, startTime: e.target.value})} />
                        </div>
                        <input className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" placeholder="Ubicación" value={eventForm.location || ''} onChange={e => setEventForm({...eventForm, location: e.target.value})} />
                        <textarea className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" placeholder="Descripción" rows={3} value={eventForm.description || ''} onChange={e => setEventForm({...eventForm, description: e.target.value})} />
                        <select className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" value={eventForm.category} onChange={e => setEventForm({...eventForm, category: e.target.value as Category})}>
                            {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <button className={`w-full text-white font-bold py-3 rounded-xl transition-colors ${editingId ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                            {editingId ? 'Actualizar Evento' : 'Agendar Evento'}
                        </button>
                    </form>
                )}

                {activeSection === 'recursos' && (
                    <form onSubmit={handleSubmitResource} className="space-y-4">
                        <input className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" placeholder="Nombre del Lugar" value={resourceForm.name || ''} onChange={e => setResourceForm({...resourceForm, name: e.target.value})} />
                        <select className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" value={resourceForm.category} onChange={e => setResourceForm({...resourceForm, category: e.target.value as Category})}>
                            {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <input className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" placeholder="Dirección" value={resourceForm.address || ''} onChange={e => setResourceForm({...resourceForm, address: e.target.value})} />
                        <div className="grid grid-cols-2 gap-2">
                             <input type="number" step="any" className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" placeholder="Latitud" value={resourceForm.lat || ''} onChange={e => setResourceForm({...resourceForm, lat: parseFloat(e.target.value)})} />
                             <input type="number" step="any" className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" placeholder="Longitud" value={resourceForm.lng || ''} onChange={e => setResourceForm({...resourceForm, lng: parseFloat(e.target.value)})} />
                        </div>
                        <textarea className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" placeholder="Descripción" rows={3} value={resourceForm.description || ''} onChange={e => setResourceForm({...resourceForm, description: e.target.value})} />
                        <button className={`w-full text-white font-bold py-3 rounded-xl transition-colors ${editingId ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                            {editingId ? 'Actualizar Recurso' : 'Añadir al Mapa'}
                        </button>
                    </form>
                )}

                {activeSection === 'usuarios' && (
                    <form onSubmit={handleSubmitUser} className="space-y-4">
                        <input className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" placeholder="Nombre" value={userForm.name || ''} onChange={e => setUserForm({...userForm, name: e.target.value})} />
                        <input className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" type="email" placeholder="Email" value={userForm.email || ''} onChange={e => setUserForm({...userForm, email: e.target.value})} />
                        <select className="w-full bg-gray-50 border-0 rounded-xl p-3 text-sm" value={userForm.role} onChange={e => setUserForm({...userForm, role: e.target.value as Role})}>
                            {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl">Registrar</button>
                    </form>
                )}
            </div>
        </div>
        )}

        {/* List Column */}
        <div className={`${activeSection === 'solicitudes' ? 'lg:col-span-3' : 'lg:col-span-2'} space-y-4`}>
             
             {/* --- SOLICITUDES / PROPUESTAS --- */}
             {activeSection === 'solicitudes' && (
                 <div className="space-y-6">
                     <h2 className="font-bold text-gray-500 text-sm uppercase tracking-wider mb-4">Propuestas Pendientes de Validación</h2>
                     
                     {proposals.filter(p => p.status === ProposalStatus.Pending).length === 0 && (
                         <div className="bg-white p-12 rounded-3xl text-center text-gray-400 border border-gray-100 flex flex-col items-center">
                             <span className="text-4xl block mb-2 opacity-50">🎉</span>
                             <p>¡Todo al día! No hay propuestas pendientes de revisión.</p>
                         </div>
                     )}

                     <div className="grid md:grid-cols-2 gap-4">
                     {proposals.filter(p => p.status === ProposalStatus.Pending).map(proposal => (
                         <div key={proposal.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-full hover:shadow-md transition-shadow">
                            <div>
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide ${proposal.type === 'event' ? 'bg-purple-100 text-purple-700' : proposal.type === 'resource' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {proposal.type === 'event' ? '📅 Actividad' : proposal.type === 'resource' ? '📍 Recurso' : 'Idea'}
                                    </span>
                                    <span className="text-xs text-gray-400">{proposal.date}</span>
                                </div>

                                <h4 className="font-bold text-lg text-gray-900 mb-2 leading-tight">{proposal.title}</h4>
                                <p className="text-sm text-gray-600 mb-4">{proposal.description}</p>
                                
                                <div className="text-xs text-gray-500 mb-2">
                                    <span className="font-bold">Autor:</span> {proposal.author}
                                </div>

                                {proposal.details && (
                                    <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 text-xs space-y-1 mb-4">
                                        {proposal.details.image && (
                                            <img src={proposal.details.image} alt="Adjunto" className="h-20 w-full object-cover rounded-lg mb-2" />
                                        )}
                                        {proposal.details.location && <div><span className="font-bold">📍 Lugar:</span> {proposal.details.location}</div>}
                                        {proposal.details.address && <div><span className="font-bold">📍 Dirección:</span> {proposal.details.address}</div>}
                                        {proposal.details.date && <div><span className="font-bold">🗓 Fecha:</span> {proposal.details.date}</div>}
                                        {proposal.details.startTime && <div><span className="font-bold">⏰ Hora:</span> {proposal.details.startTime}</div>}
                                        {(proposal.details.lat !== undefined) && (
                                            <div className="text-emerald-600 font-medium">✓ Coordenadas geográficas incluidas</div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
                                <button 
                                    onClick={() => handleValidateProposal(proposal)}
                                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-3 px-4 rounded-xl transition-colors shadow-sm"
                                >
                                    Validar & Publicar
                                </button>
                                <button 
                                    onClick={() => handleRejectProposal(proposal)}
                                    className="px-4 py-3 bg-red-50 text-red-500 hover:bg-red-100 text-xs font-bold rounded-xl transition-colors"
                                >
                                    Rechazar
                                </button>
                            </div>
                         </div>
                     ))}
                     </div>
                 </div>
             )}

             {activeSection === 'agenda' && events.map(event => (
                 <div key={event.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">{event.category}</span>
                            <span className="text-xs text-gray-400">{event.date}</span>
                        </div>
                        <h4 className="font-bold text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleEditEvent(event)} className="text-blue-400 hover:text-blue-600 p-2">✏️</button>
                        <button onClick={() => onDeleteEvent(event.id)} className="text-red-400 hover:text-red-600 p-2">🗑️</button>
                    </div>
                 </div>
             ))}

             {activeSection === 'recursos' && resources.map(res => (
                 <div key={res.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                        <h4 className="font-bold text-gray-900">{res.name}</h4>
                        <p className="text-xs text-gray-400">{res.address}</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => handleEditResource(res)} className="text-blue-400 hover:text-blue-600 p-2">✏️</button>
                        <button onClick={() => onDeleteResource(res.id)} className="text-red-400 hover:text-red-600 p-2">🗑️</button>
                    </div>
                 </div>
             ))}

             {activeSection === 'articulos' && blogPosts.map(post => (
                 <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <h4 className="font-bold text-gray-900">{post.title}</h4>
                    <div className="flex gap-2">
                        <button onClick={() => handleEditPost(post)} className="text-blue-400 hover:text-blue-600 p-2">✏️</button>
                        <button onClick={() => onDeleteBlogPost(post.id)} className="text-red-400 hover:text-red-600 p-2">🗑️</button>
                    </div>
                 </div>
             ))}
             {activeSection === 'usuarios' && users.map(user => (
                 <div key={user.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div><h4 className="font-bold text-gray-900">{user.name}</h4><p className="text-xs text-gray-400">{user.email}</p></div>
                    {user.id !== currentUser?.id && <button onClick={() => onDeleteUser(user.id)} className="text-red-400 hover:text-red-600 p-2">🗑️</button>}
                 </div>
             ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
