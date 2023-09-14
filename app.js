require("colors");

const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

app.use(express.json());
app.use(express.static(__dirname + "/public"));

let user_ids = [];

io.on("connection", (socket)=>{
    console.log("New user!".yellow);

    socket.emit("get-id", socket.id);

    socket.on("receive-file", (id, file)=>{

    });
});

app.get("/", (req, res)=>{

});

server.listen(3000, ()=>{
    console.log("El server esta escuchando en el puerto 3000!".green);
});