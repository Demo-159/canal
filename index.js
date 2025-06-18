const express = require("express");
const http = require("http");
const url = require("url");

const app = express();
const PORT = process.env.PORT || 10000;

app.get("/stream", (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).send("Falta el parámetro ?url");

  const parsedUrl = url.parse(videoUrl);

  const options = {
    hostname: parsedUrl.hostname,
    path: parsedUrl.path,
    port: 80,
    method: "GET",
    headers: {
      "User-Agent": "Mozilla/5.0",
    },
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(200, {
      "Content-Type": "video/mp4",
      "Accept-Ranges": "bytes",
      "Content-Length": proxyRes.headers["content-length"],
      "Content-Disposition": "inline"
    });

    proxyRes.pipe(res);
  });

  proxyReq.on("error", (e) => {
    res.status(500).send("Error: " + e.message);
  });

  proxyReq.end();
});

app.get("/", (req, res) => {
  res.send("Proxy funcionando para tu video.");
});

app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});