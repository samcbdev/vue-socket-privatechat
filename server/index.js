const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:8080",
    },
})

io.use((socket, next) => {
    const username = socket.handshake.auth.username
    if(!username) {
        return next(new Error("invalid username"))
    }
    socket.username = username
    next()
})

io.on("connection", (socket) => {

    const users = [];
    for(let [id, socket] of io.of("/").sockets)
        users.push({
            userId: id,
            username: socket.username
        });
    socket.emit("users", users)

    socket.broadcast.emit("user connected", {
        userId: socket.id,
        username: socket.username
    })

    socket.on("private message", ({message, to}) => {
        socket.to(to).emit("private message", {
            message,
            from: socket.id
        })
    })

    socket.on("disconnect", () => {
        socket.broadcast.emit("user disconnected", socket.id)
    })
})

const PORT = process.env.PORT || 3000

httpServer.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${3000}`);
})