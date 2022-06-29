import http from "http"
// import CommonLib from "@hackathon-climat-05/common-lib"

const PORT = parseInt(process.env.PORT || "8080", 10)
const HOST = process.env.HOST || "0.0.0.0"

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.socket.remoteAddress} - ${req.method} http://${req.headers.host}${req.url}`)

    res.writeHead(200, {
        "Content-Type": "application/json"
    })
    res.write(JSON.stringify({
        hello: "world"
    }))
    res.end()
})

server.listen(PORT, HOST)
console.log(`${new Date().toISOString()} - Running on http://${HOST}:${PORT}`)
