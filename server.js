const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const connectDB = require('./config/db')
const cors = require('cors')
const path = require('path')
const games = require('./routes/games')


dotenv.config({path: `./config/config.env`})

connectDB()

const app = express()

app.use(bodyParser.json())

app.use(cors({
  origin: '*'
}))

app.use('/api/games',games)

app.use(express.static(path.join(__dirname, 'dist')))

app.get('*', (req,res,next)=>{
  res.sendFile(path.join(__dirname, 'dist/index.html'))
})

const PORT = process.env.PORT || 5001

const server = app.listen(PORT, ()=>{
  console.log(`Server is listening on port: ${PORT}`)
})

process.on('unhandledRejection', (err, promise)=>{
  console.log(`Error:${err.message}`)
  server.close(()=> process.exit(1))
})

module.exports = app