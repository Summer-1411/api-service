require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require("multer")
const path = require("path")
const routeMajor = require("./routes/index")

const app = express()
app.use(express.json())
app.use(cors())



app.use("/api/major", routeMajor)

const PORT = 6862

app.listen(PORT, () => console.log(`Server major started on port ${PORT}`))
