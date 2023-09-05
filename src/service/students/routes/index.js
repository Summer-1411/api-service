const express = require('express')
const router = express.Router()
const {verifyTokenAndAdmin} = require('../../../middleware/verifyToken')

const bcrypt = require('bcrypt');
const pool = require('../../../common/connectDB')

//id, account, password, name, email, address, phone, idCode, avatar, birthday, id_class, role, status	

router.post("/create", verifyTokenAndAdmin, async (req, res) => {
    try {
       

        const {code, password, name, email, address, phone, idCode, avatar, birthday, idClass} = req.body
        const  [checkExistIdCode] = await pool.query(`SELECT * FROM student WHERE idCode = "${idCode}"`);
        if(checkExistIdCode.length > 0){
            return res.status(400).json({ success: false, message: "Số CMT/CCCD đã bị trùng lặp !" })
        }
        const  [checkExistCode] = await pool.query(`SELECT * FROM student WHERE code = "${code}"`);
        if(checkExistCode.length > 0){
            return res.status(400).json({ success: false, message: "Tài khoản đã tồn tại !" })
        }
        const  [checkExistIdEmail] = await pool.query(`SELECT * FROM student WHERE email = "${email}"`);
        if(checkExistIdEmail.length > 0){
            return res.status(400).json({ success: false, message: "Email đã tồn tại !" })
        }
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const [result] = await pool.query('INSERT INTO student (code, password, name, email, address, phone, idCode, avatar, birthday, id_class) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [code, hashedPassword, name, email, address, phone, idCode, avatar, birthday, idClass]);
        return res.status(200).json({ success: true, student: result })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const {name, email, address, phone, idCode, avatar, birthday, idClass, status } = req.body
        const  [checkExistIdCode] = await pool.query(`SELECT * FROM student WHERE idCode = ${idCode} AND id <> ${id}`);
        if(checkExistIdCode.length > 0){
            if(checkExistIdCode[0].id != id){
                return res.status(400).json({ success: false, message: "Số CMT/CCCD đã tồn tại !" })
            }
        }

        const  [checkExistEmail] = await pool.query(`SELECT * FROM student WHERE email = "${email}" AND id <> ${id}`);
        if(checkExistEmail.length > 0){
            if(checkExistEmail[0].id != id){
                return res.status(400).json({ success: false, message: "Email đã tồn tại !" })
            }
        }
        const [result] = await pool.query('UPDATE student SET name=?, email=?, address=?, phone=?, idCode=?, avatar=?, birthday=?, id_class=?, status=? WHERE id=?', 
            [name, email, address, phone, idCode, avatar, birthday, idClass, status, id]);
        return res.status(200).json({ success: true, student: result })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.post("/search", async (req, res) => {
    try {
        const {id, code, name, email, address, phone, idCode, birthday, idClass, status} = req.body
        let sql = 'SELECT * FROM student WHERE 1=1'
        if(id){
            sql += ` AND id = ${id}`
        }
        if(idCode){
            sql += ` AND idCode LIKE "%${idCode}%"`
        }
        if(phone){
            sql += ` AND phone LIKE "%${phone}%"`
        }
        if(code){
            sql += ` AND code LIKE "%${code}%"`
        }
        if(name){
            sql += ` AND name LIKE "%${name}%"`
        }
        if(email){
            sql += ` AND email LIKE "%${email}%"`
        }
        if(address){
            sql += ` AND address LIKE "%${address}%"`
        }
        if(birthday){
            sql += ` AND birthday = ${birthday}`
        }
        if(idClass){
            sql += ` AND id_class = ${idClass}`
        }
        if(status !== null && status !== undefined){
            sql += ` AND status = ${status}`
        }
        const [result] = await pool.query(sql);
        return res.status(200).json({ success: true, student: result })
    } catch (error) {
        console.log('Check eeroor', error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})


router.post("/delete", verifyTokenAndAdmin, async (req, res) => {
    try {
        const ids = req.body.ids;
        ids.map(async (item) => {
            await pool.query(`UPDATE student SET status = ? WHERE id = ?`, [0, item]);
        })
        return res.status(200).json({ success: true})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

module.exports = router