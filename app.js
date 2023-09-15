require("colors");

const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const routes = require("./routes/routes.js");
const io = require("socket.io")(server);
const session = require("express-session");

app.use(express.json());
app.use("/public", express.static(__dirname + "/public"));
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')));
app.use("", routes);

app.use(session({
    secret: "secretomiop",
    resave: false,
    saveUninitialized: true,
    cookie:{
        secure: true
    }
}));

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

let user_ids = [];

io.on("connection", (socket)=>{
    console.log("New user!".yellow);

    socket.emit("get-id", socket.id);

    socket.on("upload-file", (data)=>{
        console.log(data)
        const filePath = __dirname +  `/uploads/` + data.filename;
        fs.writeFileSync(filePath, data.content, 'binary');

        io.emit("received-file", data);
    });

    socket.on("new-connection", (name, ip) =>{
        io.emit("new-device", name, socket.id, ip);

        user_ids.push({
            name,
            id: socket.id,
            ip
        });

        console.log(user_ids);
    });

    socket.on("disconnect", ()=>{
        let nuevoArray = user_ids.filter(item => item.id !== socket.id);
        io.emit("disconnect-devices", socket.id);
        user_ids = nuevoArray;
    });
});

server.listen(3000, ()=>{
    console.log("El server esta escuchando en el puerto 3000!".green);
});