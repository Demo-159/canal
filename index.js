const express = require("express");
const request = require("request");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/stream", (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).send("Falta el parámetro ?url");

  const headers = {
    "User-Agent": req.headers["user-agent"] || "Mozilla/5.0"
  };

  request
    .get(videoUrl, { headers })
    .on("response", (response) => {
      res.setHeader("Content-Type", "video/mp4");
      res.setHeader("Accept-Ranges", "bytes");
    })
    .pipe(res);
});

app.get("/", (req, res) => {
  res.send("Servidor proxy funcionando para streaming de MP4.");
});

app.listen(PORT, () => {
  console.log(`Servidor funcionando en puerto ${PORT}`);
});
