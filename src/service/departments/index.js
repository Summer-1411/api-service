require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require("multer")
const path = require("path")
const routeDepartment = require("./routes/index")

const app = express()
app.use(express.json())
app.use(cors())


// node ./src/service/departments/index.js
// node ./src/service/majors/index.js
app.use("/api/department", routeDepartment)

const PORT = 6860

app.listen(PORT, () => console.log(`Server department started on port ${PORT}`))
