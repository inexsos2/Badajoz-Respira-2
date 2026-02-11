
// --- MOCK DATA (Replicating constants.tsx) ---
import { GoogleGenAI } from "https://esm.sh/@google/genai@^1.40.0";

const DATA = {
    events: [
        { id: '1', title: 'Ruta Saludable por el Guadiana', date: '2024-05-20', time: '09:00', location: 'Puente de Palmas', description: 'Caminata guiada para conocer la flora local.', category: 'Deporte', organizer: 'Farmamundi' },
        { id: '2', title: 'Taller de Yoga al Aire Libre', date: '2024-05-22', time: '18:30', location: 'Parque de Castelar', description: 'Sesión de relajación y respiración profunda.', category: 'Salud', organizer: 'Badajoz Respira' }
    ],
    resources: [
        { id: 'r1', name: 'Parque del Guadiana', type: 'Espacio Natural', address: 'Ribera del Guadiana', description: 'Pulmón verde de la ciudad.', lat: 38.882, lng: -6.979, tags: ['Aire Puro', 'Running'] },
        { id: 'r2', name: 'Farmacia 24h Centro', type: 'Servicio Salud', address: 'Calle Menacho, 12', description: 'Servicio farmacéutico permanente.', lat: 38.878, lng: -6.970, tags: ['Emergencias', 'Salud'] },
        { id: 'r3', name: 'Huerto Urbano Suerte de Saavedra', type: 'Sostenibilidad', address: 'Calle Antonio Hernández Gil', description: 'Espacio comunitario de cultivo ecológico.', lat: 38.865, lng: -6.955, tags: ['Naturaleza'] }
    ],
    blog: [
        { 
            id: 'b1', title: 'La calidad del aire mejora', excerpt: 'Los últimos datos muestran una tendencia positiva gracias a la peatonalización.', 
            author: 'Redacción', date: '2024-05-15', imageUrl: 'https://picsum.photos/seed/badajoz1/800/400', category: 'Medio Ambiente', tags: ['Aire', 'Salud'],
            content: '<p>Gracias a las nuevas medidas de peatonalización en el centro histórico, los niveles de NO2 han descendido.</p>' 
        },
        { 
            id: 'b2', title: 'Nueva campaña Farmamundi', excerpt: 'Enfocada en el derecho a la salud en entornos urbanos.', 
            author: 'Comunicación', date: '2024-05-10', imageUrl: 'https://picsum.photos/seed/badajoz2/800/400', category: 'Comunidad', tags: ['ONG', 'Derechos'],
            content: '<p>Farmamundi inicia hoy su campaña para promover hábitos saludables.</p>'
        }
    ],
    proposals: [
        { id: 'p1', author: 'Ana Martínez', title: 'Más fuentes de agua', description: 'Es necesario instalar más puntos de hidratación.', votes: 145, status: 'Validada', date: '2024-04-12' },
        { id: 'p2', author: 'Luis G.', title: 'Huertos Urbanos', description: 'Propongo usar solares abandonados para crear huertos.', votes: 89, status: 'En Revisión', date: '2024-04-28' }
    ],
    users: [
        { email: 'alejandro@inexsos.com', role: 'Admin', name: 'Alejandro' },
        { email: 'maria@badajoz.es', role: 'Editor', name: 'María' }
    ]
};

// --- ROUTER & UI LOGIC ---
const router = {
    navigate: (viewId) => {
        // Hide all views
        document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
        // Show target view
        const target = document.getElementById(`view-${viewId}`);
        if(target) target.classList.add('active');
        
        // Update nav styling
        document.querySelectorAll('.nav-btn').forEach(btn => {
            if(btn.dataset.target === viewId) {
                btn.classList.remove('text-gray-500');
                btn.classList.add('text-emerald-600', 'font-bold');
            } else {
                btn.classList.add('text-gray-500');
                btn.classList.remove('text-emerald-600', 'font-bold');
            }
        });
        
        // Specific init logic
        if(viewId === 'mapa') setTimeout(() => mapApp.init(), 100); // Delay for layout reflow
        window.scrollTo(0,0);
    }
};

const ui = {
    toggleLoginModal: () => {
        const modal = document.getElementById('login-modal');
        modal.classList.toggle('hidden');
    },
    
    showBlogDetail: (id) => {
        const post = DATA.blog.find(b => b.id === id);
        if(!post) return;
        
        document.getElementById('blog-list').classList.add('hidden');
        const detail = document.getElementById('blog-detail');
        detail.classList.remove('hidden');
        
        document.getElementById('blog-content-area').innerHTML = `
            <img src="${post.imageUrl}" class="w-full h-80 object-cover rounded-3xl mb-8 shadow-lg">
            <div class="flex items-center gap-3 mb-4">
                <span class="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full uppercase">${post.category}</span>
                <span class="text-gray-400 text-sm">${post.date}</span>
            </div>
            <h1 class="text-4xl font-black text-gray-900 mb-6">${post.title}</h1>
            <div class="prose prose-lg prose-emerald text-gray-600">${post.content}</div>
        `;
        window.scrollTo(0,0);
    },
    
    showBlogList: () => {
        document.getElementById('blog-detail').classList.add('hidden');
        document.getElementById('blog-list').classList.remove('hidden');
    }
};

// --- RENDERERS ---
const render = {
    events: () => {
        const container = document.getElementById('agenda-grid');
        container.innerHTML = DATA.events.map(ev => `
            <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div class="flex justify-between items-start mb-4">
                    <div class="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase">${ev.category}</div>
                    <div class="text-right">
                        <span class="block text-2xl font-black text-gray-900 leading-none">${ev.date.split('-')[2]}</span>
                        <span class="block text-xs text-gray-500 uppercase font-bold">Mayo</span>
                    </div>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">${ev.title}</h3>
                <div class="flex items-center gap-2 text-sm text-gray-500 mb-2"><span>📍 ${ev.location}</span><span>⏰ ${ev.time}</span></div>
                <p class="text-gray-600 text-sm mb-4">${ev.description}</p>
                <div class="text-xs text-emerald-600 font-bold">Organiza: ${ev.organizer}</div>
            </div>
        `).join('');
    },
    
    blog: () => {
        const html = DATA.blog.map(post => `
             <div onclick="ui.showBlogDetail('${post.id}')" class="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer flex flex-col">
                <div class="h-48 overflow-hidden">
                  <img src="${post.imageUrl}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                </div>
                <div class="p-6 flex-1 flex flex-col">
                  <div class="mb-2 flex items-center justify-between">
                      <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">${post.category}</span>
                      <span class="text-xs text-gray-400">${post.date}</span>
                  </div>
                  <h3 class="font-bold text-lg leading-tight group-hover:text-emerald-600 transition-colors mb-2">${post.title}</h3>
                  <p class="text-gray-500 text-sm leading-relaxed line-clamp-3 mb-4 flex-1">${post.excerpt}</p>
                </div>
             </div>
        `).join('');
        document.getElementById('blog-grid').innerHTML = html;
        // Also render first 2 for home
        document.getElementById('home-news-grid').innerHTML = DATA.blog.slice(0, 2).map(post => `
            <div onclick="router.navigate('blog'); ui.showBlogDetail('${post.id}')" class="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all cursor-pointer">
                <div class="h-56 overflow-hidden">
                  <img src="${post.imageUrl}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
                </div>
                <div class="p-8 space-y-3">
                  <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">${post.category}</span>
                  <h3 class="font-bold text-xl leading-tight group-hover:text-emerald-600 transition-colors">${post.title}</h3>
                  <p class="text-gray-500 text-sm leading-relaxed line-clamp-2">${post.excerpt}</p>
                </div>
            </div>
        `).join('');
    },
    
    proposals: () => {
        const container = document.getElementById('proposals-list');
        container.innerHTML = DATA.proposals.map(p => `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start">
                <span class="px-2 py-1 rounded-full text-xs font-medium ${p.status === 'Validada' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}">${p.status}</span>
                <span class="text-xs text-gray-400">${p.date}</span>
              </div>
              <div>
                <h3 class="font-bold text-lg text-gray-800 mb-1">${p.title}</h3>
                <p class="text-sm text-gray-500 italic">Por ${p.author}</p>
              </div>
              <p class="text-gray-600 text-sm line-clamp-3">${p.description}</p>
              <div class="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                <div class="flex items-center gap-2">
                  <span class="text-emerald-600 font-bold">${p.votes}</span>
                  <span class="text-gray-400 text-xs uppercase">apoyos</span>
                </div>
                <button onclick="this.innerHTML='❤️ ¡Gracias!'; this.disabled=true;" class="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <span>👍</span> Apoyar
                </button>
              </div>
            </div>
        `).join('');
    }
};

// --- MAP LOGIC ---
const mapApp = {
    instance: null,
    markers: [],
    
    init: () => {
        if(mapApp.instance) {
            mapApp.instance.invalidateSize();
            return;
        }
        
        mapApp.instance = L.map('map').setView([38.8794, -6.9707], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(mapApp.instance);
        
        mapApp.renderMarkers(DATA.resources);
        
        // Populate filter
        const tags = [...new Set(DATA.resources.flatMap(r => r.tags))].sort();
        document.getElementById('map-filter').innerHTML += tags.map(t => `<option value="${t}">${t}</option>`).join('');
    },
    
    renderMarkers: (resources) => {
        // Clear existing
        mapApp.markers.forEach(m => m.remove());
        mapApp.markers = [];
        
        resources.forEach(res => {
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="w-8 h-8 bg-emerald-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white text-lg">📍</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });
            
            const marker = L.marker([res.lat, res.lng], { icon: icon }).addTo(mapApp.instance);
            marker.bindPopup(`
                <div class="p-1 font-sans">
                    <span class="text-[10px] font-bold text-emerald-600 uppercase block mb-1">${res.type}</span>
                    <h3 class="font-bold text-base text-gray-900 mb-1">${res.name}</h3>
                    <p class="text-xs text-gray-500 mb-2">${res.address}</p>
                    <p class="text-sm text-gray-700 mb-3">${res.description}</p>
                </div>
            `);
            mapApp.markers.push(marker);
        });
    },
    
    filterResources: (tag) => {
        const filtered = tag ? DATA.resources.filter(r => r.tags.includes(tag)) : DATA.resources;
        mapApp.renderMarkers(filtered);
    }
};

// --- AUTH MOCK ---
const auth = {
    login: (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const user = DATA.users.find(u => u.email === email);
        if(user) {
            alert(`Bienvenido ${user.name}`);
            ui.toggleLoginModal();
            document.getElementById('admin-btn').innerText = "Panel Admin";
            document.getElementById('admin-btn').onclick = () => router.navigate('admin');
            router.navigate('admin');
        } else {
            alert('Usuario no encontrado');
        }
    },
    logout: () => {
        router.navigate('inicio');
        document.getElementById('admin-btn').innerText = "Equipo";
        document.getElementById('admin-btn').onclick = ui.toggleLoginModal;
    }
};

// --- GEMINI AI ---
// NOTE: Client-side API keys are not secure for production. 
// Use a PHP proxy in a real deployment.
const ai = {
    handleChat: async (e) => {
        e.preventDefault();
        const input = document.getElementById('chat-input').value;
        const btn = document.getElementById('chat-btn');
        const responseDiv = document.getElementById('chat-response');
        
        if(!input.trim()) return;
        
        btn.disabled = true;
        btn.innerText = "Pensando...";
        responseDiv.classList.add('hidden');

        try {
            if (!API_KEY) throw new Error("API Key faltante");
            
            const aiClient = new GoogleGenAI({ apiKey: API_KEY });
            const response = await aiClient.models.generateContent({
              model: 'gemini-3-flash-preview',
              contents: `Eres un experto en salud urbana de Badajoz. Responde brevemente: ${input}`,
            });
            
            const text = response.text || "No pude generar una respuesta.";
            responseDiv.innerText = text;
            responseDiv.classList.remove('hidden');
        } catch (err) {
            console.error(err);
            responseDiv.innerText = "El asistente no está disponible (Falta API Key o Error de conexión).";
            responseDiv.classList.remove('hidden');
        } finally {
            btn.disabled = false;
            btn.innerText = "Consultar";
        }
    }
};

// --- INIT ---
window.router = router;
window.ui = ui;
window.mapApp = mapApp;
window.auth = auth;
window.ai = ai;

document.addEventListener('DOMContentLoaded', () => {
    render.events();
    render.blog();
    render.proposals();
});
