const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "..", "public");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
};

function sendResponse(response, statusCode, contentType, body) {
  response.writeHead(statusCode, { "Content-Type": contentType });
  response.end(body);
}

function serveStaticFile(requestPath, response) {
  const relativePath = requestPath === "/" ? "/index.html" : requestPath;
  const filePath = path.normalize(path.join(PUBLIC_DIR, relativePath));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    sendResponse(response, 403, "text/plain; charset=utf-8", "Forbidden");
    return;
  }

  fs.readFile(filePath, (error, fileContents) => {
    if (error) {
      sendResponse(response, 404, "text/plain; charset=utf-8", "Not found");
      return;
    }

    const extension = path.extname(filePath);
    const contentType = MIME_TYPES[extension] || "application/octet-stream";
    sendResponse(response, 200, contentType, fileContents);
  });
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host}`);
  serveStaticFile(requestUrl.pathname, response);
});

server.listen(PORT, () => {
  console.log(`Capstone project running at http://localhost:${PORT}`);
});
