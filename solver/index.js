let net = require("net");
let fs = require("fs");

let socket = net.Socket()

let req = fs.readFileSync("./req2.http");

socket.connect(15672, "127.0.0.1")
socket.on("data", (data) => {
    console.log(data.toString());
})
socket.on("connect", () => {
    socket.write(req);
    setTimeout(() => {
        socket.end();
    });
})