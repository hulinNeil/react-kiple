// This script is used to run the buildFile

const url = require('url'),
  fs = require('fs'),
  http = require('http'),
  path = require('path'),
  paths = require('./paths');

function notFond(res) {
  res.writeHead(200, {
    "Content-Type": "text/html"
  });
  res.end(`<h2>Page Not Found!!!<h2>`);
}

http.createServer(function(req, res) {
  var pathname = url.parse(req.url).pathname;
  console.log('path:', pathname);
  if (!path.extname(pathname).length) {
    res.writeHead(200, {
      "Content-Type": "text/html"
    });
    fs.readFile(path.join(paths.appBuild, 'index.html'), function(err, data) {
      if (err) {
        console.log(err);
        notFond(res);
      } else {
        res.end(data);
      }
    });
    return;
  }
  switch (path.extname(pathname)) {
    case ".html":
      res.writeHead(200, {
        "Content-Type": "text/html"
      });
      break;
    case ".js":
      res.writeHead(200, {
        "Content-Type": "text/javascript"
      });
      break;
    case ".css":
      res.writeHead(200, {
        "Content-Type": "text/css"
      });
      break;
    default:
      res.writeHead(200, {
        "Content-Type": "application/octet-stream"
      });
  }
  fs.readFile(path.join(paths.appBuild, url.parse(req.url).pathname), function(err, data) {
    if (err) {
      console.log(err);
      notFond(res);
    } else {
      res.end(data);
    }
  });
}).listen(3126);
console.log("server run 3126 port");
