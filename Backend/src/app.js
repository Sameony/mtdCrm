const express = require('express')
const app = express()
const cors = require('cors')
var routes = require("./routes/index")
const server = require("http").Server(app)
var db = require("./config/db")



app.set('port', process.env.port || 3000)
app.use(cors())
app.get('/', (req, res) => {
  res.status(200).send('Hello World!')
})
app.use("/",routes)
app.use((req, res,next)=>{
  let err = new Error("Not Found");
  err.status = 404
  next(err)
})

server.listen(app.get('port'), () => {
  console.log(`Server started on ${app.get('port')}`)
})