const express = require("express");
const https = require("https");
const http = require("http");
const url = require("url");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/stream", (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).send("Falta el parámetro ?url");

  const parsedUrl = url.parse(videoUrl);
  const client = parsedUrl.protocol === "https:" ? https : http;

  const headers = {
    "User-Agent": req.headers["user-agent"] || "Mozilla/5.0",
    "Range": req.headers["range"] || "bytes=0-"
  };

  const options = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.path,
    headers: headers
  };

  const proxyReq = client.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, {
      "Content-Type": "video/mp4",
      "Content-Length": proxyRes.headers["content-length"],
      "Accept-Ranges": "bytes",
      "Content-Range": proxyRes.headers["content-range"] || ""
    });
    proxyRes.pipe(res);
  });

  proxyReq.on("error", (e) => {
    res.status(500).send("Error en el proxy: " + e.message);
  });

  proxyReq.end();
});

app.get("/", (req, res) => {
  res.send("Proxy listo para streaming de .mp4.");
});

app.listen(PORT, () => {
  console.log("Servidor corriendo en el puerto", PORT);
});