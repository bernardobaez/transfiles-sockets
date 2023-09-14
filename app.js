require("colors");

const express = require("express");
const fs = require("fs");
const app = express();
const server = require("http").createServer(app);
const routes = require("./routes/routes.js");
const io = require("socket.io")(server);

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use("", routes);

let user_ids = [];

io.on("connection", (socket)=>{
    console.log("New user!".yellow);

    socket.emit("get-id", socket.id);

    socket.on("upload-file", data=>{
        const filePath = __dirname +  '/uploads/' + data.filename;
        fs.writeFileSync(filePath, data.content, 'binary');

        io.emit("received-file", data);
    });
});

server.listen(3000, ()=>{
    console.log("El server esta escuchando en el puerto 3000!".green);
});