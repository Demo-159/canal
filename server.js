// server.js - Servidor principal para canal 24/7
const express = require('express');
const path = require('path');
const fs = require('fs');
const { spawn } = require('child_process');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración
const config = {
    streamKey: process.env.STREAM_KEY || 'live',
    segmentDuration: 10, // segundos por segmento
    playlistLength: 6,   // número de segmentos en playlist
    videoQuality: '720p'
};

// Middleware
app.use(express.static('public'));
app.use('/hls', express.static('hls'));

// Rutas principales
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Endpoint para playlist M3U8
app.get('/live/playlist.m3u8', (req, res) => {
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (fs.existsSync('hls/playlist.m3u8')) {
        res.sendFile(path.resolve('hls/playlist.m3u8'));
    } else {
        res.status(404).send('Stream no disponible');
    }
});

// Endpoint para segmentos TS
app.get('/live/:segment', (req, res) => {
    const segment = req.params.segment;
    const segmentPath = path.join('hls', segment);
    
    if (fs.existsSync(segmentPath)) {
        res.setHeader('Content-Type', 'video/mp2t');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.sendFile(path.resolve(segmentPath));
    } else {
        res.status(404).send('Segmento no encontrado');
    }
});

// API para información del canal
app.get('/api/status', (req, res) => {
    res.json({
        status: 'live',
        viewers: Math.floor(Math.random() * 100) + 1,
        uptime: process.uptime(),
        quality: config.videoQuality
    });
});

// Función para generar contenido de prueba
function generateTestPattern() {
    const ffmpegArgs = [
        '-f', 'lavfi',
        '-i', 'testsrc2=size=1280x720:rate=25',
        '-f', 'lavfi',
        '-i', 'sine=frequency=1000:sample_rate=48000',
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-tune', 'zerolatency',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-b:v', '2000k',
        '-maxrate', '2000k',
        '-bufsize', '4000k',
        '-pix_fmt', 'yuv420p',
        '-g', '50',
        '-f', 'hls',
        '-hls_time', config.segmentDuration,
        '-hls_list_size', config.playlistLength,
        '-hls_flags', 'delete_segments+append_list',
        '-hls_segment_filename', 'hls/segment%03d.ts',
        'hls/playlist.m3u8'
    ];

    return spawn('ffmpeg', ffmpegArgs);
}

// Función para reproducir video desde URL
function streamFromUrl(videoUrl) {
    const ffmpegArgs = [
        '-i', videoUrl,
        '-stream_loop', '-1', // Loop infinito
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-tune', 'zerolatency',
        '-c:a', 'aac',
        '-b:a', '128k',
        '-b:v', '1500k',
        '-maxrate', '1500k',
        '-bufsize', '3000k',
        '-pix_fmt', 'yuv420p',
        '-g', '50',
        '-f', 'hls',
        '-hls_time', config.segmentDuration,
        '-hls_list_size', config.playlistLength,
        '-hls_flags', 'delete_segments+append_list',
        '-hls_segment_filename', 'hls/segment%03d.ts',
        'hls/playlist.m3u8'
    ];

    return spawn('ffmpeg', ffmpegArgs);
}

// Inicializar directorio HLS
if (!fs.existsSync('hls')) {
    fs.mkdirSync('hls');
}

// Iniciar stream
let ffmpegProcess;

function startStream() {
    console.log('Iniciando stream...');
    
    // Usar video de ejemplo o patrón de prueba
    const videoSource = process.env.VIDEO_URL || null;
    
    if (videoSource) {
        ffmpegProcess = streamFromUrl(videoSource);
    } else {
        ffmpegProcess = generateTestPattern();
    }
    
    ffmpegProcess.stdout.on('data', (data) => {
        console.log(`FFmpeg stdout: ${data}`);
    });
    
    ffmpegProcess.stderr.on('data', (data) => {
        console.log(`FFmpeg stderr: ${data}`);
    });
    
    ffmpegProcess.on('close', (code) => {
        console.log(`FFmpeg proceso terminó con código ${code}`);
        // Reiniciar automáticamente
        setTimeout(startStream, 5000);
    });
}

// Manejar cierre graceful
process.on('SIGTERM', () => {
    console.log('Cerrando servidor...');
    if (ffmpegProcess) {
        ffmpegProcess.kill('SIGTERM');
    }
    process.exit(0);
});

// Iniciar servidor y stream
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en puerto ${PORT}`);
    console.log(`Stream disponible en: http://localhost:${PORT}/live/playlist.m3u8`);
    startStream();
});

module.exports = app;
