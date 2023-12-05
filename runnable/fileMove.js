const http = require("http");
const fs = require("fs");
const path = require("path");
const host = "localhost";
const port = 3939;

if (process.pid) {
  console.log("This process is your pid " + process.pid);
}

/**
 * Handlers
 */
async function moveFileHandler(req, res) {
  await getBodyContent(req);
  if (!req.body) {
    error(res, new Error("No body in request."));
    return;
  }

  const { source, target } = JSON.parse(req.body);

  try {
    const dir = path.join(target, "../");
    if (!fs.existsSync(dir)){
      console.log('Creating Target DIR', dir);
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.copyFileSync(source, target);
    console.log('Moved file from', source, 'to', target);
    fs.rmSync(source);
    console.log('Delete file', source);
  } catch (e) {
    error(res, e);
    return;
  }

  response(200, res, { status: "success", source, target });
}

/**
 * Basic server
 */
function response(status, res, data) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.writeHead(status);
  res.end(JSON.stringify(data));
}

function error(res, e) {
  console.error("ERROR", e);
  response(500, res, { status: 500, message: e.message, stack: e.stack });
  // throw e;
}

async function getBodyContent(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString(); // convert Buffer to string
    });
    req.on("end", () => {
      console.log(body);
      req.body = body;
      resolve();
    });
  });
}

const requestListener = function (req, res) {
  console.log("REQUEST:", req.method, req.url, new Date().toISOString());
  try {
    switch (req.url + "|" + req.method) {
      case "/health|GET":
        response(200, res, { status: 200, message: "ok" });
        break;
      case "/moveFile|POST":
        moveFileHandler(req, res);
        break;
      default:
        response(404, res, { status: 404, message: "Page not found." });
        break;
    }
  } catch (e) {
    error(res, e);
  }
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
