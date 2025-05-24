const express = require('express')
const { createServer } = require('node:http')
const { Server } = require('socket.io')

const app = express()
const server = createServer(app)
const io = new Server(server)
const port = 3000

const connectMongoDB = require('./connectionMongoDB')
connectMongoDB()

const rollModel = require('./models/rollModel')

app.use(express.static('public'))

app.get("/kast", async (req, res) => {
  try {
    let rolls = await rollModel.find()
    res.status(200).json(rolls)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

server.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`)
})

io.on('connection', (socket) => {
  console.log(`A client with id ${socket.id} connected to the chat!`)

  socket.on('diceRoll', data => {
    io.emit('newDiceRoll', data)

    let today = new Date()
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
    let dateTime = date + ' ' + time

    const newRoll = new rollModel({
      user: data.name,
      roll: data.roll,
      total: data.total,
      date: dateTime
    })
    newRoll.save()
  })

  socket.on('chatMessage', (data) => {
    io.emit('newChatMessage', data)
  })

  socket.on('disconnect', () => {
  console.log(`Client ${socket.id} disconnected!`)
  })
 
})