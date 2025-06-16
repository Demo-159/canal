const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const videos = require('./videos.json');

app.use(express.static('public'));

function getCurrentVideoInfo() {
  const now = Date.now();
  const totalDuration = videos.reduce((sum, video) => sum + video.duration, 0);
  const timeOffset = Math.floor((now / 1000) % totalDuration); // segundos

  let accumulated = 0;
  for (const video of videos) {
    if (timeOffset < accumulated + video.duration) {
      const videoTime = timeOffset - accumulated;
      return {
        url: video.url,
        title: video.title,
        time: videoTime
      };
    }
    accumulated += video.duration;
  }
  return null;
}

app.get('/', (req, res) => {
  const info = getCurrentVideoInfo();
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Canal en Vivo</title>
      <link href="https://unpkg.com/video.js/dist/video-js.min.css" rel="stylesheet">
      <style>
        body { margin: 0; background: #000; display: flex; justify-content: center; align-items: center; height: 100vh; }
        video { width: 100%; max-width: 800px; height: auto; }
      </style>
    </head>
    <body>
      <video id="video" class="video-js vjs-default-skin" controls autoplay preload="auto">
        <source src="${info.url}" type="video/mp4">
      </video>

      <script src="https://unpkg.com/video.js/dist/video.min.js"></script>
      <script>
        const player = videojs('video');
        player.ready(function() {
          player.currentTime(${info.time});
          player.play();
        });
      </script>
    </body>
    </html>
  `);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
