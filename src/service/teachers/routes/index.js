const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const {verifyTokenAndAdmin} = require('../../../middleware/verifyToken')


const pool = require('../../../common/connectDB')
//

router.post("/create", verifyTokenAndAdmin, async (req, res) => {
    try {
        const {code, password, level, name,	email, address,  phone, idCode, avatar, birthday, status} = req.body
        const  [checkExistIdCode] = await pool.query(`SELECT * FROM teacher WHERE idCode = "${idCode}"`);
        const  [checkExistCode] = await pool.query(`SELECT * FROM teacher WHERE code = "${code}"`);
        if(checkExistCode.length > 0){
            return res.status(400).json({ success: false, message: "Tài khoản đã tồn tại !" })
        }
        if(checkExistIdCode.length > 0){
            return res.status(400).json({ success: false, message: "Số CMT/CCCD đã bị trùng lặp !" })
        }
        const  [checkExistEmail] = await pool.query(`SELECT * FROM teacher WHERE email = "${email}"`);
        if(checkExistEmail.length > 0){
            return res.status(400).json({ success: false, message: "Email đã bị trùng lặp !" })
        }
        const  [checkExistPhone] = await pool.query(`SELECT * FROM teacher WHERE phone = "${phone}"`);
        if(checkExistPhone.length > 0){
            return res.status(400).json({ success: false, message: "Số điện thoại đã bị trùng lặp !" })
        }
        
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        const [result] = await pool.query('INSERT INTO teacher (code, password, level, name, email, address,  phone, idCode, avatar, birthday, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
        [code, hashedPassword, level, name,	email, address,  phone, idCode, avatar, birthday, status]);
        return res.status(200).json({ success: true, teacher: result })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const id = Number(req.params.id);
        const {level, name,	email, address,  phone, idCode, avatar, birthday, status} = req.body
        const  [checkExistIdCode] = await pool.query(`SELECT * FROM teacher WHERE idCode = "${idCode}"`);
        const  [checkExistEmail] = await pool.query(`SELECT * FROM teacher WHERE email = "${email}"`);
        const  [checkExistPhone] = await pool.query(`SELECT * FROM teacher WHERE phone = "${phone}"`);

        if(checkExistIdCode.length > 0){
            if(checkExistIdCode[0].id != id){
                return res.status(400).json({ success: false, message: "Số CMT/CCCD đã bị trùng lặp !" })
            }
        }
        if(checkExistEmail.length > 0){
            if(checkExistIdCode[0].id != id){
                return res.status(400).json({ success: false, message: "Email đã bị trùng lặp !" })
            }
        }
        if(checkExistPhone.length > 0){
            if(checkExistPhone[0].id != id){
                return res.status(400).json({ success: false, message: "Số điện thoại đã bị trùng lặp !" })
            }
        }
       
        const [result] = await pool.query('UPDATE teacher SET level=?, name=?,	email=?, address=?,  phone=?, idCode=?, avatar=?, birthday=?, status=? WHERE id=?', 
            [level, name,	email, address,  phone, idCode, avatar, birthday, status , id]);
        return res.status(200).json({ success: true, teacher: result })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.post("/search", async (req, res) => {
    try {
        const { id, code, level, name, email, phone, status} = req.body
        let sql = 'SELECT * FROM teacher WHERE 1=1'
        if(id){
            sql += ` AND id = "${id}"`
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
        if(level){
            sql += ` AND level = ${level}`
        }
        if(status !== null && status !== undefined){
            sql += ` AND status = ${status}`
        }
        const [result] = await pool.query(sql);
        return res.status(200).json({ success: true, teacher: result })
    } catch (error) {
        console.log('Check eeroor', error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})


router.post("/delete", verifyTokenAndAdmin, async (req, res) => {
    try {
        const ids = req.body.ids;
        ids.map(async (item) => {
            await pool.query(`UPDATE teacher SET status = ? WHERE id = ?`, [0, item]);
        })
        return res.status(200).json({ success: true})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

module.exports = router