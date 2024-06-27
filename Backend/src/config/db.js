const mongoose = require("mongoose")

const db_dev = "mongodb+srv://mtduser001:jYkAN8uB0xCFF4dz@cluster0.fwesurt.mongodb.net/mtd_db?retryWrites=true&w=majority&appName=Cluster0"

// mongoose.connect(db_dev)
mongoose.connect('mongodb://localhost:27017/mtd-prod')
let db = mongoose.connection

db.on('error', console.error.bind(console, "[[[Database connection error]]]"))
db.once('open',()=>{
    console.log("[[ Database Connected Successfully ]]")
})


module.exports = db