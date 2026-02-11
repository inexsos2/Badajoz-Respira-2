
<?php
// Obtener API KEY del entorno si está disponible
$apiKey = getenv('API_KEY') ?: '';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Badajoz Respira - Plataforma Comunitaria</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <!-- Leaflet CSS -->
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
    
    <style>
        body { font-family: 'Inter', sans-serif; scroll-behavior: smooth; }
        .leaflet-pane { z-index: 10 !important; }
        .leaflet-bottom, .leaflet-top { z-index: 20 !important; }
        .view-section { display: none; animation: fadeIn 0.5s ease-in-out; }
        .view-section.active { display: block; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        /* Admin specific styles */
        .prose img { border-radius: 0.5rem; }
    </style>
</head>
<body class="bg-gray-50 text-gray-900 flex flex-col min-h-screen">

    <!-- NAVIGATION -->
    <nav class="sticky top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-100 z-50 transition-all duration-300">
        <div class="max-w-7xl mx-auto px-4 md:px-6 py-2">
            <div class="flex items-center justify-between">
                <!-- Logo -->
                <div class="group flex items-center gap-0 cursor-pointer z-50 relative shrink-0" onclick="router.navigate('inicio')">
                    <img src="https://image2url.com/r2/default/images/1770738689474-b034d35a-a99a-45db-a3e5-e8a9182845b8.png" alt="Logo" class="h-12 md:h-16 w-auto object-contain -mr-4 relative z-10">
                    <div class="font-bold text-xl md:text-2xl tracking-tight hidden sm:flex items-center gap-1 relative z-20">
                        <span class="text-gray-900 transition-colors duration-300 group-hover:text-emerald-600">Badajoz</span>
                        <span class="text-emerald-600">Respira</span>
                    </div>
                </div>

                <!-- Desktop Menu -->
                <div class="hidden md:flex items-center gap-6">
                    <ul class="flex items-center gap-6">
                        <li><button onclick="router.navigate('inicio')" class="nav-btn text-sm font-medium text-gray-500 hover:text-gray-900" data-target="inicio">Inicio</button></li>
                        <li><button onclick="router.navigate('agenda')" class="nav-btn text-sm font-medium text-gray-500 hover:text-gray-900" data-target="agenda">Agenda</button></li>
                        <li><button onclick="router.navigate('mapa')" class="nav-btn text-sm font-medium text-gray-500 hover:text-gray-900" data-target="mapa">Recursos</button></li>
                        <li><button onclick="router.navigate('blog')" class="nav-btn text-sm font-medium text-gray-500 hover:text-gray-900" data-target="blog">Blog</button></li>
                        <li>
                            <button onclick="router.navigate('propuestas')" class="px-5 py-2 rounded-full font-bold text-sm transition-all whitespace-nowrap bg-emerald-600 text-white hover:bg-emerald-700 shadow-md">
                                Proponer
                            </button>
                        </li>
                    </ul>
                </div>

                <!-- Admin/Team Access -->
                <div class="flex items-center gap-4 shrink-0">
                    <button id="admin-btn" onclick="ui.toggleLoginModal()" class="text-xs font-bold text-gray-400 hover:text-emerald-600 uppercase tracking-widest whitespace-nowrap">
                        Equipo
                    </button>
                </div>
            </div>
        </div>
    </nav>

    <!-- MAIN CONTENT CONTAINER -->
    <main class="flex-grow relative">

        <!-- VIEW: INICIO -->
        <div id="view-inicio" class="view-section active">
            <!-- Hero -->
            <section class="relative min-h-[600px] flex items-center justify-center text-center px-4 overflow-hidden shadow-2xl">
                <div class="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop" alt="Background" class="w-full h-full object-cover brightness-90">
                    <div class="absolute inset-0 bg-black/30"></div>
                </div>
                <div class="relative z-10 max-w-5xl space-y-8 flex flex-col items-center">
                    <div class="flex flex-col items-center w-full">
                        <h1 class="text-6xl md:text-8xl font-black tracking-tight text-white leading-none">
                            Badajoz <span class="text-emerald-400 italic">Respira</span>
                        </h1>
                        <h2 class="w-full text-center text-[10px] md:text-sm font-bold tracking-[0.4em] text-white uppercase opacity-95 mt-1 md:mt-0 leading-tight">
                            Sembrando bienestar para una ciudad saludable
                        </h2>
                    </div>
                    <p class="text-lg md:text-2xl text-white font-light max-w-3xl mx-auto leading-relaxed mt-4">
                        Construyendo una ciudad más saludable, verde y comunitaria a través de la participación ciudadana.
                    </p>
                    <div class="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
                        <button onclick="router.navigate('agenda')" class="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-full font-bold shadow-xl transition-all transform hover:scale-105">
                            Explorar Agenda
                        </button>
                        <button onclick="router.navigate('mapa')" class="w-full md:w-auto border-2 border-white/40 hover:border-white text-white bg-white/10 backdrop-blur-sm px-10 py-4 rounded-full font-bold transition-all transform hover:scale-105">
                            Mapa de Recursos
                        </button>
                    </div>
                </div>
            </section>

            <!-- Accesos Rápidos -->
            <section class="max-w-6xl mx-auto px-6 py-20">
                <div class="text-center mb-16 space-y-4">
                    <h2 class="text-4xl font-black text-gray-900">¿Qué es Badajoz Respira?</h2>
                    <div class="w-16 h-1.5 bg-emerald-500 mx-auto rounded-full"></div>
                    <p class="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed pt-4">
                        Una iniciativa intergeneracional de promoción para la salud y el envejecimiento activo.
                    </p>
                </div>
                <div class="grid md:grid-cols-3 gap-8">
                    <!-- Cards -->
                    <div onclick="router.navigate('agenda')" class="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:bg-emerald-50">📅</div>
                        <h3 class="font-bold text-xl text-gray-900 mb-4 group-hover:text-emerald-700">Agenda Colaborativa</h3>
                        <p class="text-gray-500 mb-6">Actividades de ocio saludable y talleres organizados por la comunidad.</p>
                    </div>
                    <div onclick="router.navigate('mapa')" class="bg-white p-10 rounded-3xl border border-emerald-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                        <div class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:bg-emerald-200">📍</div>
                        <h3 class="font-bold text-xl text-emerald-900 mb-4">Mapa de Bienestar</h3>
                        <p class="text-gray-500 mb-6">Encuentra espacios verdes, farmacias y centros saludables.</p>
                    </div>
                    <div onclick="router.navigate('propuestas')" class="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
                        <div class="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-inner group-hover:bg-emerald-50">📝</div>
                        <h3 class="font-bold text-xl text-gray-900 mb-4 group-hover:text-emerald-700">Participación</h3>
                        <p class="text-gray-500 mb-6">Propón tus propias actividades o recursos para mejorar la ciudad.</p>
                    </div>
                </div>
            </section>

            <!-- Chat & News -->
            <div class="max-w-6xl mx-auto px-4 pb-20 grid md:grid-cols-3 gap-12">
                <div class="md:col-span-2 space-y-10">
                    <h2 class="text-3xl font-bold flex items-center gap-3"><span class="text-emerald-500">📰</span> Últimas Noticias</h2>
                    <div id="home-news-grid" class="grid sm:grid-cols-2 gap-8">
                        <!-- News injected by JS -->
                    </div>
                </div>
                <!-- Chatbot -->
                <div class="bg-emerald-900 rounded-[40px] p-10 text-white h-fit sticky top-24 shadow-2xl">
                    <h3 class="text-2xl font-bold mb-4 flex items-center gap-3"><span class="text-emerald-400">🍃</span> Consulta Saludable</h3>
                    <p class="text-emerald-200/80 text-sm mb-8">Pregúntale a nuestra IA sobre cómo mejorar tu entorno en Badajoz.</p>
                    <form id="chat-form" onsubmit="ai.handleChat(event)" class="space-y-6">
                        <textarea id="chat-input" class="w-full bg-emerald-800/40 border border-emerald-700/50 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-emerald-400 focus:outline-none placeholder-emerald-500/30" rows="4" placeholder="Ej: ¿Dónde hay zonas de baja emisión?"></textarea>
                        <button type="submit" id="chat-btn" class="w-full bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-2xl font-bold transition-all transform active:scale-95 shadow-lg">Consultar</button>
                    </form>
                    <div id="chat-response" class="mt-8 p-5 bg-white/5 backdrop-blur-md rounded-2xl text-sm leading-relaxed border border-white/10 text-emerald-50 hidden"></div>
                </div>
            </div>
        </div>

        <!-- VIEW: AGENDA -->
        <div id="view-agenda" class="view-section">
            <div class="max-w-6xl mx-auto px-4 py-10">
                <h2 class="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3"><span class="text-emerald-500">📅</span> Agenda Saludable</h2>
                <div id="agenda-grid" class="grid md:grid-cols-2 gap-6">
                    <!-- Events injected by JS -->
                </div>
            </div>
        </div>

        <!-- VIEW: MAPA -->
        <div id="view-mapa" class="view-section">
            <div class="max-w-7xl mx-auto px-4 py-6 h-[calc(100vh-100px)] flex flex-col">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-black text-gray-900">Mapa de Recursos</h2>
                    <select id="map-filter" onchange="mapApp.filterResources(this.value)" class="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm">
                        <option value="">Todos los recursos</option>
                        <!-- Options injected by JS -->
                    </select>
                </div>
                <div id="map" class="flex-1 rounded-3xl overflow-hidden border border-gray-200 shadow-lg z-0"></div>
            </div>
        </div>

        <!-- VIEW: BLOG (Grid + Detail) -->
        <div id="view-blog" class="view-section">
            <div id="blog-list" class="max-w-6xl mx-auto px-4 py-10">
                <h2 class="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3"><span class="text-emerald-500">📰</span> Blog y Noticias</h2>
                <div id="blog-grid" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <!-- Blog posts injected by JS -->
                </div>
            </div>
            <div id="blog-detail" class="max-w-4xl mx-auto px-4 py-10 hidden">
                <button onclick="ui.showBlogList()" class="text-emerald-600 font-bold text-sm mb-6 flex items-center gap-1 hover:underline">← Volver al blog</button>
                <div id="blog-content-area"></div>
            </div>
        </div>

        <!-- VIEW: PROPUESTAS -->
        <div id="view-propuestas" class="view-section">
            <div class="max-w-4xl mx-auto px-4 py-10">
                <div class="text-center mb-10">
                    <h2 class="text-3xl font-black text-gray-900 mb-2">Participación Ciudadana</h2>
                    <p class="text-gray-500">Propón ideas para mejorar Badajoz y vota las de tus vecinos.</p>
                </div>
                <div class="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl mb-10 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-emerald-800 text-lg">¿Tienes una idea?</h3>
                        <p className="text-emerald-600 text-sm">Tu propuesta será revisada y publicada.</p>
                    </div>
                    <button class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-6 rounded-xl transition-colors">Nueva Propuesta</button>
                </div>
                <div id="proposals-list" class="space-y-6">
                    <!-- Proposals injected by JS -->
                </div>
            </div>
        </div>
        
        <!-- VIEW: ADMIN (Simplified) -->
        <div id="view-admin" class="view-section">
            <div class="max-w-6xl mx-auto px-4 py-10 text-center">
                 <h2 class="text-2xl font-bold">Panel de Administración</h2>
                 <p class="text-gray-500 mt-2">Acceso restringido al equipo de Badajoz Respira.</p>
                 <div class="mt-8 bg-white p-8 rounded-xl shadow border border-gray-100 inline-block text-left w-full max-w-md">
                     <p class="text-sm font-bold text-gray-400 uppercase mb-2">Usuarios Demo</p>
                     <ul class="text-sm space-y-2">
                         <li class="p-2 bg-gray-50 rounded flex justify-between"><span>Alejandro</span> <span class="font-mono text-xs">alejandro@inexsos.com</span></li>
                         <li class="p-2 bg-gray-50 rounded flex justify-between"><span>María</span> <span class="font-mono text-xs">maria@badajoz.es</span></li>
                     </ul>
                     <button onclick="auth.logout()" class="mt-6 w-full bg-red-500 text-white py-2 rounded-lg font-bold">Cerrar Sesión</button>
                 </div>
            </div>
        </div>

    </main>

    <!-- FOOTER -->
    <footer class="w-full">
        <!-- CTA Blog -->
        <div class="bg-emerald-50 py-16 px-6">
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                <div class="space-y-4 max-w-2xl text-center md:text-left">
                    <h2 class="text-3xl md:text-4xl font-black text-gray-900">Mantente al día</h2>
                    <p class="text-gray-600 text-lg leading-relaxed">Lee las últimas noticias sobre el proyecto, artículos sobre salud urbana y novedades de Farmamundi.</p>
                </div>
                <button onclick="router.navigate('blog')" class="border-2 border-emerald-600 text-emerald-700 font-bold px-10 py-4 rounded-full hover:bg-emerald-600 hover:text-white transition-all bg-white shadow-sm">
                    Visitar el Blog
                </button>
            </div>
        </div>

        <!-- Main Footer -->
        <div class="bg-[#0f172a] text-white pt-20 pb-10 px-6">
            <div class="max-w-7xl mx-auto grid md:grid-cols-12 gap-12 mb-20 border-b border-gray-800 pb-16">
                <div class="md:col-span-5 space-y-6">
                    <div class="flex items-center gap-0 mb-6 -ml-4">
                        <img src="https://image2url.com/r2/default/images/1770738689474-b034d35a-a99a-45db-a3e5-e8a9182845b8.png" alt="Logo" class="h-16 w-auto object-contain relative z-10 brightness-0 invert">
                        <div class="flex flex-col relative z-20">
                            <span class="font-bold text-2xl tracking-tight text-white flex items-center gap-1">
                                Badajoz <span class="text-emerald-500">Respira</span>
                            </span>
                        </div>
                    </div>
                    <p class="text-gray-400 leading-relaxed text-sm max-w-md">Un proyecto de Farmamundi para transformar Badajoz.</p>
                </div>
                <div class="md:col-span-3">
                    <h3 class="text-sm font-bold text-white uppercase tracking-widest mb-8">Proyecto</h3>
                    <ul class="space-y-4 text-gray-400 text-sm font-medium">
                        <li><a href="#" class="hover:text-emerald-400">Sobre Farmamundi</a></li>
                        <li><a href="#" onclick="router.navigate('propuestas')" class="hover:text-emerald-400">Cómo Participar</a></li>
                    </ul>
                </div>
                <div class="md:col-span-4">
                    <h3 class="text-sm font-bold text-white uppercase tracking-widest mb-8">Contacto</h3>
                    <ul class="space-y-6 text-gray-400 text-sm">
                        <li class="flex items-start gap-4"><span class="text-emerald-500 text-lg">📞</span><span>924 207 591</span></li>
                        <li class="flex items-start gap-4"><span class="text-blue-400 text-lg">✉️</span><span>extremadura@farmamundi.org</span></li>
                    </ul>
                </div>
            </div>
            
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-center md:items-start">
                <div class="flex flex-col items-center md:items-start gap-4">
                    <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">IMPLEMENTA</span>
                    <img src="https://activando-ods.saludglocal.org/wp-content/themes/saludglocal/assets/images/farmamundi-footer-color.png" alt="Farmamundi" class="h-10 md:h-12 opacity-80 hover:opacity-100 transition-opacity">
                </div>
                <div class="flex flex-col items-center md:items-start gap-4">
                    <span class="text-[10px] font-bold text-gray-500 uppercase tracking-widest">FINANCIA</span>
                    <div class="flex gap-4">
                        <img src="https://activando-ods.saludglocal.org/wp-content/uploads/sites/34/2023/07/2560px-Logotipo_del_Ministerio_de_Derechos_Sociales_y_Agenda_2030.svg-2048x549-1-300x80.png" alt="Financiación" class="h-10 md:h-12 object-contain bg-white rounded px-2 py-1">
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <!-- Login Modal -->
    <div id="login-modal" class="fixed inset-0 z-[99999] flex items-center justify-center p-4 hidden">
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" onclick="ui.toggleLoginModal()"></div>
        <div class="bg-white rounded-3xl p-8 w-full max-w-md relative z-10 shadow-2xl animate-fadeIn">
            <button onclick="ui.toggleLoginModal()" class="absolute top-4 right-4 text-gray-400">✕</button>
            <h2 class="text-2xl font-black text-gray-900 mb-2">Acceso Equipo</h2>
            <form onsubmit="auth.login(event)" class="space-y-4 mt-6">
                <div>
                    <label class="block text-xs font-bold text-gray-700 uppercase mb-2">Email</label>
                    <input type="email" name="email" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3" placeholder="email@inexsos.com">
                </div>
                <button type="submit" class="w-full bg-gray-900 text-white py-3 rounded-xl font-bold">Entrar</button>
            </form>
        </div>
    </div>

    <!-- Scripts -->
    <script>const API_KEY = "<?php echo $apiKey; ?>";</script>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script type="module" src="app.js"></script>
</body>
</html>
