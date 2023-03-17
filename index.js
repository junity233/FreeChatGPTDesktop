const { app, BrowserWindow } = require('electron');
const http = require('http');
const path = require('path');
const fs = require("fs");
const mime = require("mime");

var win = null;
var base = null;

if (app.isPackaged)
    base = path.join(__dirname, '..', 'static');
else base = path.join(__dirname, 'third_parts/FreeChatGPT/dist');

const server = http.createServer(function (request, response) {
    const pathname = request.url;
    const file_path = path.join(base, pathname);

    fs.access(file_path, fs.constants.F_OK, (err) => {
        if (err) {
            response.writeHead(404, { 'Content-Type': 'text/plain' });
            response.end('File not found');
        } else {
            fs.readFile(file_path, (err, data) => {
                if (err) {
                    response.writeHead(500, { 'Content-Type': 'text/plain' })
                    response.end('Internal server error');
                }

                response.writeHead(200, {
                    'Content-Type': mime.getType(pathname)
                });
                response.end(data);
            });
        }
    });
});

server.listen(1227, "localhost");
server.on("listening", () => {
    let url = new URL("http://localhost:1227/index.html");
    win.loadURL(url.toString());
})

function createWindow() {
    win = new BrowserWindow({
        webPreferences: {
            webSecurity: false
        }
    });

    if (app.isPackaged)
        win.setMenu(null);
    win.maximize();

    if (app.isPackaged)
        win.setIcon(path.join(base, "..", "icon.ico"));
    else win.setIcon(path.join(__dirname, "icon.ico"));
}

app.whenReady().then(() => {
    createWindow();
})