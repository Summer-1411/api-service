require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require("multer")
const path = require("path")
const routeTeacher = require("./routes/index")

const app = express()
app.use(express.json())
app.use(cors())


// node ./src/service/teachers/index.js
app.use("/api/teacher", routeTeacher)

const PORT = 6865

app.listen(PORT, () => console.log(`Server teacher started on port ${PORT}`))
