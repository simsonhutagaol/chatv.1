if (process.env.NODE_ENV !== "production") {
    require('dotenv').config()
}

const cors = require('cors')
const express = require('express')
const { User } = require('./models/index')
const app = express()
const PORT = process.env.PORT || 3000
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const server = createServer(app);
app.use(cors())
const io = new Server(server, {
    cors: {
        origin: "https://chatsync.simson.id"
    }
});
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
const bcrypt = require('bcryptjs')
const { signToken, verifyToken } = require('./helpers/jwt')

app.post('/register', async (req, res, next) => {
    try {
        const { name, userName, password } = req.body
        await User.create(
            {
                name,
                userName,
                password: bcrypt.hashSync(password, 10)
            })
        res.status(201).json({
            message: "Success"
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
})
app.get('/list', async (req, res, next) => {
    try {
        const fetchUsers = await User.findAll({ attributes: { exclude: ['createdAt', 'updatedAt', 'password'] } })

        res.status(201).json(fetchUsers)
    } catch (err) {
        console.log(err)
        next(err)
    }
})
app.post('/login', async (req, res, next) => {
    try {
        const { userName, password } = req.body
        if (!userName) {
            throw {
                status: 400,
                message: "User Name is required"
            }
        }
        if (!password) {
            throw {
                status: 400,
                message: "Password is required"
            }
        }
        const user = await User.findOne({
            where: {
                userName
            }
        })
        if (!user) {
            throw {
                status: 401,
                message: "Invalid userName/password"
            }
        }
        const compare = bcrypt.compareSync(password, user.password)
        if (!compare) {
            throw {
                status: 401,
                message: "Invalid userName/password"
            }
        }
        const access_token = signToken({
            id: user.id,
            userName: user.userName
        })

        res.status(200).json({
            access_token
        })
    } catch (err) {
        console.log(err)
        next(err)
    }
})

const handleError = (err, req, res, next) => {
    if (err.name == "SequelizeValidationError" || err.name == "SequelizeUniqueConstraintError") {
        const message = err.errors[0].message
        res.status(400).json({
            message
        })
    } else if (err.status && err.message) {
        res.status(err.status).json({
            message: err.message
        })
    } else if (err.name == "JsonWebTokenError") {
        res.status(401).json({
            message: "Invalid token"
        })
    } else {
        res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}

app.use(handleError)

io.use((socket, next) => {
    if (socket.handshake.auth.token) {
        const token = socket.handshake.auth.token
        const { userName } = verifyToken(token)
        socket.username = userName;
    }

    next();
});

io.on('connection', (socket) => {
    const users = [];
    for (let [id, connectedSocket] of io.of("/").sockets) {
        if (!connectedSocket.username) { continue }
        users.push({
            userID: id,
            username: connectedSocket.username,
            key: id,
            self: true
        });
    }
    socket.emit("users", users);

    socket.broadcast.emit("user connected", {
        userID: socket.id,
        username: socket.username,
        key: socket.id,
        self: false,
    });
    socket.on("disconnect", () => {
        socket.broadcast.emit("user disconnected", {
            userID: socket.id,
            username: socket.username,
            key: socket.id,
        });
    });
    socket.on("private message", ({ content, to }) => {
        socket.to(to).emit("private message", {
            content,
            to: to,
            from: socket.username,
            fromID: socket.id
        });
    });
    socket.join(socket.userID)

});

server.listen(PORT, () => {
    console.log(`App on${PORT}`);
})