require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require("multer")
const path = require("path")
const routeResult = require("./routes/index")

const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/result", routeResult)

// node ./src/service/results/index.js

const PORT = 6866

app.listen(PORT, () => console.log(`Server result started on port ${PORT}`))
