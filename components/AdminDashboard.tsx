
import React, { useState, useRef, useEffect } from 'react';
import { AgendaEvent, Resource, BlogPost, Category, User, Role, ContentBlock, BlockType, BlockSettings } from '../types';

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

  // Initialize post form with default values (Header + Paragraph)
  const defaultBlocks: ContentBlock[] = [
    { id: 'def-1', type: 'header', content: '', settings: { textAlign: 'left' } },
    { id: 'def-2', type: 'paragraph', content: '', settings: { textAlign: 'left' } }
  ];

  const [postForm, setPostForm] = useState<Partial<BlogPost>>({ 
      category: 'General', 
      tags: [], 
      blocks: defaultBlocks,
      date: new Date().toISOString().split('T')[0] 
  });
  
  const [eventForm, setEventForm] = useState<Partial<AgendaEvent>>({ category: Category.Salud });
  const [resourceForm, setResourceForm] = useState<Partial<Resource>>({ type: 'General' });
  const [userForm, setUserForm] = useState<Partial<User>>({ role: Role.Editor });
  const [tagInput, setTagInput] = useState('');

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
    setResourceForm({ type: 'General' });
    setTagInput('');
  };

  // -- Block Editor Logic --
  const addBlock = (type: BlockType) => {
    const newBlock: ContentBlock = {
        id: Date.now().toString(),
        type,
        content: '',
        settings: {
          textAlign: 'left',
          width: type === 'image' ? '100%' : undefined
        }
    };
    setPostForm(prev => ({ ...prev, blocks: [...(prev.blocks || []), newBlock] }));
  };

  const updateBlock = (id: string, content: string) => {
    setPostForm(prev => ({
        ...prev,
        blocks: prev.blocks?.map(b => b.id === id ? { ...b, content } : b)
    }));
  };

  const updateBlockSettings = (id: string, newSettings: Partial<BlockSettings>) => {
    setPostForm(prev => ({
        ...prev,
        blocks: prev.blocks?.map(b => b.id === id ? { ...b, settings: { ...b.settings, ...newSettings } } : b)
    }));
  };

  const handleBlockImageUpload = (id: string, file: File) => {
    const url = URL.createObjectURL(file);
    setPostForm(prev => ({
        ...prev,
        blocks: prev.blocks?.map(b => b.id === id ? { ...b, content: url, file } : b)
    }));
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
    setPostForm(prev => ({
        ...prev,
        blocks: prev.blocks?.filter((_, i) => i !== index)
    }));
  };

  // -- WYSIWYG Formatting Logic --
  // Using document.execCommand for simple rich text editing without external libraries
  const applyFormat = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    // Focus back to editor is handled by the user click, but execCommand works on current selection
  };

  // -- Tag Logic --
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

  // -- Cover Image Logic --
  const handleCoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        setPostForm(prev => ({ ...prev, imageUrl: url }));
    }
  };

  // -- Submit Handlers --
  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (postForm.title) {
      // Auto-generate excerpt if empty from first paragraph block
      let finalExcerpt = postForm.excerpt;
      if (!finalExcerpt && postForm.blocks) {
          // We need to strip HTML for the excerpt
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
          imageUrl: postForm.imageUrl || 'https://picsum.photos/800/400',
          category: postForm.category || 'General',
          tags: postForm.tags || [],
          blocks: postForm.blocks || []
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

  // Helper to determine dynamic classes for quote block based on alignment
  const getQuoteClasses = (align?: string) => {
    const base = "italic text-xl font-light text-emerald-700 bg-emerald-50/20";
    switch (align) {
        case 'right':
            return `${base} border-r-4 border-emerald-500 pr-4 py-2`;
        case 'center':
            return `${base} border-t-2 border-b-2 border-emerald-500 px-4 py-4`;
        case 'left':
        default:
            return `${base} border-l-4 border-emerald-500 pl-4 py-2`;
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
            <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 sticky top-24 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-black text-xl">
                        {editingId ? '✏️ Editando' : '➕ Crear Nuevo'}
                    </h3>
                    {editingId && (
                        <button onClick={cancelEdit} className="text-xs text-red-500 font-bold hover:underline">Cancelar</button>
                    )}
                </div>

                {activeSection === 'articulos' && (
                    <form onSubmit={handleSubmitPost} className="space-y-6">
                        
                        {/* Meta Data */}
                        <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Configuración General</label>
                            
                            <input 
                                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold text-gray-800 focus:outline-emerald-500" 
                                placeholder="Título Principal" 
                                value={postForm.title || ''} 
                                onChange={e => setPostForm({...postForm, title: e.target.value})} 
                            />

                            <div className="grid grid-cols-2 gap-2">
                                <input 
                                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs" 
                                    placeholder="Categoría" 
                                    value={postForm.category || ''} 
                                    onChange={e => setPostForm({...postForm, category: e.target.value})} 
                                />
                                <input 
                                    type="date"
                                    className="w-full bg-white border border-gray-200 rounded-xl p-3 text-xs" 
                                    value={postForm.date || ''} 
                                    onChange={e => setPostForm({...postForm, date: e.target.value})} 
                                />
                            </div>

                             {/* Cover Image Upload */}
                             <div className="relative group w-full h-32 border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer hover:border-emerald-400 transition-colors">
                                <input type="file" onChange={handleCoverImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                                {postForm.imageUrl ? (
                                    <img src={postForm.imageUrl} className="w-full h-full object-cover" alt="Cover" />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <span className="text-2xl block">📷</span>
                                        <span className="text-xs font-medium">Arrastra una portada aquí</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                             <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Etiquetas</label>
                             <div className="flex flex-wrap gap-2 mb-2">
                                {postForm.tags?.map(tag => (
                                    <span key={tag} className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                                        #{tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-emerald-900 font-bold">×</button>
                                    </span>
                                ))}
                             </div>
                             <input 
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 text-xs" 
                                placeholder="Escribe etiqueta y pulsa Enter..." 
                                value={tagInput}
                                onChange={e => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                             />
                        </div>

                        <hr className="border-gray-100" />

                        {/* Block Editor */}
                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Contenido (Bloques)</label>
                                <div className="flex gap-1 flex-wrap">
                                    <button type="button" onClick={() => addBlock('paragraph')} className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-200 transition-colors">Párrafo</button>
                                    <button type="button" onClick={() => addBlock('header')} className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-200 transition-colors">Encabezado</button>
                                    <button type="button" onClick={() => addBlock('quote')} className="text-[10px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-2 py-1 rounded border border-emerald-200 transition-colors">Cita Destacada</button>
                                    <button type="button" onClick={() => addBlock('image')} className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-200 transition-colors">Imagen</button>
                                </div>
                            </div>

                            <div className="space-y-6 min-h-[100px]">
                                {postForm.blocks?.map((block, index) => (
                                    <div key={block.id} className="relative group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                        
                                        {/* Unified Header & Toolbar */}
                                        <div className="bg-gray-50 border-b border-gray-100 px-3 py-2 flex justify-between items-center">
                                            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar w-full">
                                                <div className="flex items-center gap-1 shrink-0">
                                                    {/* Move Buttons */}
                                                    <div className="flex flex-col gap-0.5">
                                                        <button type="button" onClick={() => moveBlock(index, 'up')} className="text-[8px] leading-none hover:text-emerald-600">▲</button>
                                                        <button type="button" onClick={() => moveBlock(index, 'down')} className="text-[8px] leading-none hover:text-emerald-600">▼</button>
                                                    </div>
                                                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                                        {block.type === 'header' ? 'Encabezado' : block.type === 'image' ? 'Imagen' : block.type === 'quote' ? 'Cita' : 'Párrafo'}
                                                    </span>
                                                </div>

                                                <div className="w-px h-4 bg-gray-300 mx-1 shrink-0"></div>

                                                {/* INLINE TOOLBAR FOR RICH TEXT (Paragraph & Quote) */}
                                                {(block.type === 'paragraph' || block.type === 'quote') && (
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        {/* Basic Formatting - using MouseDown preventDefault to keep focus on editable area */}
                                                        <button type="button" onMouseDown={(e) => {e.preventDefault(); applyFormat('bold');}} className="w-6 h-6 hover:bg-white hover:shadow-sm rounded text-xs font-bold text-gray-600" title="Negrita">B</button>
                                                        <button type="button" onMouseDown={(e) => {e.preventDefault(); applyFormat('italic');}} className="w-6 h-6 hover:bg-white hover:shadow-sm rounded text-xs italic text-gray-600" title="Cursiva">I</button>
                                                        <button type="button" onMouseDown={(e) => {e.preventDefault(); applyFormat('underline');}} className="w-6 h-6 hover:bg-white hover:shadow-sm rounded text-xs underline text-gray-600" title="Subrayado">U</button>
                                                        
                                                        <div className="w-px h-3 bg-gray-200 mx-1 shrink-0"></div>
                                                        
                                                        {/* Font Size */}
                                                        <button type="button" onMouseDown={(e) => {e.preventDefault(); applyFormat('fontSize', '5');}} className="w-6 h-6 hover:bg-white hover:shadow-sm rounded text-[10px] font-bold text-gray-600" title="Aumentar Letra">A+</button>
                                                        <button type="button" onMouseDown={(e) => {e.preventDefault(); applyFormat('fontSize', '2');}} className="w-6 h-6 hover:bg-white hover:shadow-sm rounded text-[9px] text-gray-600" title="Disminuir Letra">A-</button>
                                                        
                                                        <div className="w-px h-3 bg-gray-200 mx-1 shrink-0"></div>

                                                        {/* Lists */}
                                                        <button type="button" onMouseDown={(e) => {e.preventDefault(); applyFormat('insertUnorderedList');}} className="w-6 h-6 hover:bg-white hover:shadow-sm rounded text-xs text-gray-600 flex items-center justify-center" title="Viñetas">
                                                           •
                                                        </button>
                                                        <button type="button" onMouseDown={(e) => {e.preventDefault(); applyFormat('insertOrderedList');}} className="w-6 h-6 hover:bg-white hover:shadow-sm rounded text-xs text-gray-600 flex items-center justify-center" title="Numeración">
                                                           1.
                                                        </button>

                                                        <div className="w-px h-3 bg-gray-200 mx-1 shrink-0"></div>

                                                        {/* Alignment */}
                                                        <button type="button" onMouseDown={(e) => {e.preventDefault(); applyFormat('justifyLeft'); updateBlockSettings(block.id, { textAlign: 'left' });}} className={`w-6 h-6 hover:bg-white hover:shadow-sm rounded text-xs ${block.settings?.textAlign === 'left' ? 'text-blue-500 bg-white shadow-sm' : 'text-gray-400'}`}>⇤</button>
                                                        <button type="button" onMouseDown={(e) => {e.preventDefault(); applyFormat('justifyCenter'); updateBlockSettings(block.id, { textAlign: 'center' });}} className={`w-6 h-6 hover:bg-white hover:shadow-sm rounded text-xs ${block.settings?.textAlign === 'center' ? 'text-blue-500 bg-white shadow-sm' : 'text-gray-400'}`}>⇹</button>
                                                        <button type="button" onMouseDown={(e) => {e.preventDefault(); applyFormat('justifyRight'); updateBlockSettings(block.id, { textAlign: 'right' });}} className={`w-6 h-6 hover:bg-white hover:shadow-sm rounded text-xs ${block.settings?.textAlign === 'right' ? 'text-blue-500 bg-white shadow-sm' : 'text-gray-400'}`}>⇥</button>
                                                    </div>
                                                )}

                                                {/* INLINE TOOLBAR FOR IMAGE */}
                                                {block.type === 'image' && (
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        {(['25%', '50%', '75%', '100%'] as const).map(w => (
                                                            <button 
                                                                key={w}
                                                                type="button" 
                                                                onClick={() => updateBlockSettings(block.id, { width: w })}
                                                                className={`text-[8px] px-1 rounded ${block.settings?.width === w ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-white hover:text-gray-700'}`}
                                                            >
                                                                {w}
                                                            </button>
                                                        ))}
                                                        <div className="w-px h-3 bg-gray-200 mx-1 shrink-0"></div>
                                                        <button type="button" onClick={() => updateBlockSettings(block.id, { textAlign: 'left' })} className={`text-xs ${block.settings?.textAlign === 'left' ? 'text-blue-500' : 'text-gray-400'}`}>⇤</button>
                                                        <button type="button" onClick={() => updateBlockSettings(block.id, { textAlign: 'center' })} className={`text-xs ${block.settings?.textAlign === 'center' ? 'text-blue-500' : 'text-gray-400'}`}>⇹</button>
                                                        <button type="button" onClick={() => updateBlockSettings(block.id, { textAlign: 'right' })} className={`text-xs ${block.settings?.textAlign === 'right' ? 'text-blue-500' : 'text-gray-400'}`}>⇥</button>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Delete Button */}
                                            <button type="button" onClick={() => deleteBlock(index)} className="text-gray-400 hover:text-red-500 transition-colors ml-2 shrink-0">
                                                ✕
                                            </button>
                                        </div>

                                        {/* Block Content Render */}
                                        <div className="p-3">
                                            {block.type === 'header' && (
                                                <input 
                                                    className="w-full font-black text-xl text-gray-900 border-none focus:ring-0 p-0 placeholder-gray-300 bg-transparent"
                                                    placeholder="Escribe el subtítulo aquí..."
                                                    value={block.content}
                                                    onChange={(e) => updateBlock(block.id, e.target.value)}
                                                />
                                            )}
                                            
                                            {(block.type === 'paragraph' || block.type === 'quote') && (
                                                <div 
                                                    className={`w-full min-h-[80px] focus:outline-none text-gray-900 prose prose-sm max-w-none 
                                                        ${block.type === 'quote' ? getQuoteClasses(block.settings?.textAlign) : 'text-sm'}`}
                                                    contentEditable
                                                    suppressContentEditableWarning
                                                    onBlur={(e) => updateBlock(block.id, e.currentTarget.innerHTML)}
                                                    dangerouslySetInnerHTML={{ __html: block.content }}
                                                    style={{ textAlign: block.settings?.textAlign }}
                                                />
                                            )}

                                            {block.type === 'image' && (
                                                <div className="w-full">
                                                    {block.content ? (
                                                        <div className="relative border border-gray-100 rounded-lg p-2 bg-gray-50/50">
                                                            <div className={`flex w-full ${block.settings?.textAlign === 'center' ? 'justify-center' : block.settings?.textAlign === 'right' ? 'justify-end' : 'justify-start'}`}>
                                                                <img 
                                                                    src={block.content} 
                                                                    className="object-cover rounded shadow-sm transition-all duration-300" 
                                                                    style={{ width: block.settings?.width || '100%', maxHeight: '300px' }}
                                                                />
                                                            </div>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => updateBlock(block.id, '')} 
                                                                className="absolute top-2 right-2 bg-white/90 text-red-500 p-1 rounded-full shadow hover:bg-red-50 transition-colors"
                                                                title="Eliminar imagen"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors relative">
                                                                <input 
                                                                    type="file" 
                                                                    id={`img-${block.id}`}
                                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                                    onChange={(e) => e.target.files && e.target.files[0] && handleBlockImageUpload(block.id, e.target.files[0])}
                                                                />
                                                                <span className="text-2xl block mb-1">📂</span>
                                                                <span className="text-xs text-gray-500 font-bold">Subir Archivo</span>
                                                            </div>
                                                            <div className="border border-gray-200 rounded-lg p-4 flex flex-col justify-center gap-2">
                                                                <span className="text-xs font-bold text-gray-400">O pegar URL:</span>
                                                                <input 
                                                                    type="text"
                                                                    className="w-full bg-gray-50 border border-gray-200 rounded p-2 text-xs"
                                                                    placeholder="https://..."
                                                                    onBlur={(e) => { if(e.target.value) updateBlock(block.id, e.target.value) }}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {postForm.blocks?.length === 0 && (
                                    <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
                                        Añade bloques para empezar a escribir
                                    </div>
                                )}
                            </div>
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
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-gray-400">{post.date}</span>
                                {post.tags?.map(t => (
                                    <span key={t} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 rounded">#{t}</span>
                                ))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2 line-clamp-1">{post.excerpt}</p>
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
