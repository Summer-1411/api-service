require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require("multer")
const path = require("path")
const routeStudent = require("./routes/index")

const app = express()
app.use(express.json())
app.use(cors())


// node ./src/service/students/index.js
app.use("/api/student", routeStudent)

const PORT = 6864

app.listen(PORT, () => console.log(`Server student started on port ${PORT}`))
