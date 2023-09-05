require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require("multer")
const path = require("path")
const routeSubject = require("./routes/index")

const app = express()
app.use(express.json())
app.use(cors())


// node ./src/service/subjects/index.js
app.use("/api/subject", routeSubject)

const PORT = 6863

app.listen(PORT, () => console.log(`Server subject started on port ${PORT}`))
