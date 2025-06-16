
# Canal 24/7 para Render.com 📺

Un servidor de streaming 24/7 que convierte contenido VOD en un canal en vivo compatible con IPTV.

## ✨ Características

- **Stream 24/7**: Reproducción continua sin interrupciones
- **Compatible IPTV**: Genera streams HLS (M3U8) compatibles con reproductores IPTV
- **Gratuito**: Funciona en el tier gratuito de Render.com
- **Reproductor Web**: Interfaz web moderna para visualizar el stream
- **Auto-recuperación**: Se reinicia automáticamente si hay errores

## 🚀 Deploy en Render.com

### Método 1: Deploy Automático

1. **Fork/Clona** este repositorio
2. **Conecta tu repositorio** a Render.com
3. **Crea un nuevo Web Service** desde tu repo
4. Render detectará automáticamente el `render.yaml`

### Método 2: Manual

1. Ve a [Render.com](https://render.com) y crea una cuenta
2. Crea un nuevo **Web Service**
3. Conecta tu repositorio de GitHub
4. Configura:
   - **Environment**: `Docker`
   - **Build Command**: (automático)
   - **Start Command**: `npm start`

### Variables de Entorno

```bash
NODE_ENV=production
VIDEO_URL=https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4
STREAM_KEY=live
```

## 📁 Estructura del Proyecto

```
canal-247-render/
├── server.js              # Servidor principal
├── package.json           # Dependencias Node.js
├── Dockerfile            # Configuración Docker
├── render.yaml           # Configuración Render
├── public/
│   └── index.html        # Reproductor web
└── README.md            # Este archivo
```

## 🔧 Configuración Local

### Prerrequisitos

- Node.js 18+
- FFmpeg instalado
- Git

### Instalación

```bash
# Clonar repositorio
git clone <tu-repo>
cd canal-247-render

# Instalar dependencias
npm install

# Ejecutar localmente
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📺 URLs del Stream

Una vez deployado, tendrás estas URLs:

### Para Reproductores IPTV:
```
https://tu-app.onrender.com/live/playlist.m3u8
```

### Para Ver en Navegador:
```
https://tu-app.onrender.com
```

## 🎮 Uso con Reproductores IPTV

### VLC Media Player
1. Abrir VLC
2. Media → Abrir ubicación de red
3. Pegar la URL M3U8
4. Reproducir

### Kodi
1. Add-ons → PVR IPTV Simple Client
2. Configurar lista M3U con tu URL
3. Recargar

### Apps Móviles
- **IPTV Smarters**: Agregar lista M3U
- **Perfect Player**: Playlist → Agregar URL
- **VLC Mobile**: Abrir stream de red

## ⚙️ Personalización

### Cambiar Contenido

Edita la variable `VIDEO_URL` en `render.yaml`:

```yaml
envVars:
  - key: VIDEO_URL
    value: "https://tu-video.mp4"
```

### Múltiples Videos (Playlist)

Modifica `server.js` para rotar entre varios videos:

```javascript
const videoPlaylist = [
    'https://video1.mp4',
    'https://video2.mp4',
    'https://video3.mp4'
];
```

### Ajustar Calidad

En `server.js`, modifica los parámetros de FFmpeg:

```javascript
'-b:v', '1500k',  // Bitrate video
'-maxrate', '1500k',
'-bufsize', '3000k'
```

## 📊 Monitoreo

### API de Estado
```
GET /api/status
```

Respuesta:
```json
{
  "status": "live",
  "viewers": 42,
  "uptime": 3600,
  "quality": "720p"
}
```

### Logs
Ver logs en tiempo real en el dashboard de Render.

## ⚠️ Limitaciones del Tier Gratuito

- **750 horas/mes** de compute time
- **512 MB RAM**
- **Suspensión** después de 15min de inactividad
- **Ancho de banda limitado**

### Soluciones:

1. **Keep-Alive**: Usar servicios como UptimeRobot
2. **Upgrade**: Considerar plan Starter ($7/mes)
3. **Optimización**: Reducir calidad del video

## 🔧 Solución de Problemas

### Stream No Carga
1. Verificar que FFmpeg esté instalado
2. Revisar logs en Render dashboard
3. Comprobar URL del video fuente

### Cortes Frecuentes
1. Usar plan pagado para más recursos
2. Implementar keep-alive
3. Reducir calidad del stream

### No Compatible con IPTV
1. Verificar que la URL M3U8 sea accesible
2. Comprobar CORS headers
3. Usar HTTP en lugar de HTTPS si es necesario

## 📝 Logs Útiles

```bash
# Ver logs en vivo
render logs -f

# Logs específicos
render logs --num 100
```

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -am 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Pull Request

## 📄 Licencia

MIT License - Ver `LICENSE` para más detalles.

## 🆘 Soporte

- **Issues**: Reportar bugs en GitHub Issues
- **Discusiones**: GitHub Discussions
- **Email**: tu-email@ejemplo.com

---

### 🎉 ¡Listo!

Tu canal 24/7 debería estar funcionando. Visita tu URL de Render para ver el stream en vivo.

**URL de ejemplo**: `https://mi-canal-247.onrender.com`
