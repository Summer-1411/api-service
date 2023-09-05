require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require("multer")
const path = require("path")
const routeClass = require("./routes/index")

const app = express()
app.use(express.json())
app.use(cors())


//node ./src/service/classes/index.js

app.use("/api/class", routeClass)

const PORT = 6861

app.listen(PORT, () => console.log(`Server class started on port ${PORT}`))
