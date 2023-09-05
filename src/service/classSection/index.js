require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require("multer")
const path = require("path")
const routeClassSection = require("./routes/index")

const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/class-section", routeClassSection)


const PORT = 6867
// node ./src/service/classSection/index.js
app.listen(PORT, () => console.log(`Server class section started on port ${PORT}`))
