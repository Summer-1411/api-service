require('dotenv').config()
const express = require('express')
const cors = require('cors')
const multer = require("multer")
const path = require("path")
const routeAuth = require("./src/routes/auth")

const app = express()
app.use(express.json())
app.use(cors())

app.use("/images", express.static(path.join(__dirname, "public/images")));
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("File uploded successfully");
    } catch (error) {
        console.error(error);
    }
});


app.use("/api/v1", routeAuth)

const PORT = 6868

app.listen(PORT, () => console.log(`Server root started on port ${PORT}`))
