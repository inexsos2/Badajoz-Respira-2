
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Verificación de path node.js: Configuración necesaria para __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8080;

// Servir los archivos estáticos generados por Vite (carpeta dist)
// Se utiliza path.join para asegurar la compatibilidad de rutas en cualquier SO
app.use(express.static(path.join(__dirname, 'dist')));

// Manejar cualquier otra ruta devolviendo el index.html para soportar el routing de la SPA (React Router)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
