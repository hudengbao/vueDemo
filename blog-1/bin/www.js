const http = require("http")
const handleServer = require("../app.js")

const PORT = 8000

const server = http.createServer(handleServer)

server.listen(PORT)

console.log("server start")