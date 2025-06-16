const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const videos = require('./videos.json');

function getCurrentVideoInfo() {
  const now = Date.now();
  const totalDuration = videos.reduce((sum, video) => sum + video.duration, 0);
  const timeOffset = Math.floor((now / 1000) % totalDuration); // segundos

  let accumulated = 0;
  for (const video of videos) {
    if (timeOffset < accumulated + video.duration) {
      const videoTime = timeOffset - accumulated;
      return {
        url: `${video.url}#t=${videoTime}`,
        title: video.title,
        time: videoTime,
      };
    }
    accumulated += video.duration;
  }
  return null;
}

app.get('/', (req, res) => {
  const info = getCurrentVideoInfo();
  if (info) {
    res.redirect(info.url);
  } else {
    res.status(500).send('Error al calcular la transmisión.');
  }
});

app.get('/info', (req, res) => {
  const info = getCurrentVideoInfo();
  res.json(info);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});