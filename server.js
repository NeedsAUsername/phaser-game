const express = require('express') 
const server = express() 
const path = require('path') 
const bodyParser = require('body-parser') 
const cors = require('cors')


server.use(bodyParser.json()) 
server.use(bodyParser.urlencoded({extended: true}))
server.use(cors())


server.use(express.static('client')) // able to serve files under static folder, ex: localhost:3000/game.js 
server.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
}) 

const PORT = 3000 

server.listen(PORT, () => {
  console.log('server started')
})