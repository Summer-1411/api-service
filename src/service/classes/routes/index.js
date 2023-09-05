const express = require('express')
const router = express.Router()
const {verifyTokenAndAdmin} = require('../../../middleware/verifyToken')



const pool = require('../../../common/connectDB')

router.post("/create", verifyTokenAndAdmin, async (req, res) => {
    try {
        const {name, teacher, quantity, id_major, schoolYear, status} = req.body
        const [result] = await pool.query('INSERT INTO class (name, teacher, quantity, id_major, schoolYear, status) VALUES (?, ?, ?, ?, ?, ?)',
            [name, teacher, quantity, id_major, schoolYear, status]);
        return res.status(200).json({ success: true, class: result })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const {name, teacher, quantity, id_major, schoolYear, status} = req.body
        // name=?, teacher=?, quantity=?, id_major=?, schoolYear=?, status=?
        const [result] = await pool.query('UPDATE class SET name=?, teacher=?, quantity=?, id_major=?, schoolYear=?, status=?  WHERE id=?', 
        [name, teacher, quantity, id_major, schoolYear, status, id]);
        return res.status(200).json({ success: true, class: result })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.post("/search", async (req, res) => {
    try {
        const {id, name, teacher, id_major, schoolYear, status} = req.body
        let sql = 'SELECT * FROM class WHERE 1=1'
        if(id){
            sql += ` AND id=${id}`
        }
        if(name){
            sql += ` AND name LIKE '%${name}%'`
        }
        if(teacher){
            sql += ` AND teacher = "${teacher}"`
        }
        if(id_major){
            sql += ` AND id_major = ${id_major}`
        }
        if(schoolYear){
            sql += ` AND schoolYear LIKE "%${schoolYear}%"`
        }
        if(status !== null && status !== undefined){
            sql += ` AND status = ${status}`
        }
        console.log(sql);
        const [result] = await pool.query(sql);
        return res.status(200).json({ success: true, class: result })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})



router.post("/delete", verifyTokenAndAdmin, async (req, res) => {
    try {
        const ids = req.body.ids;
        ids.map(async (item) => {
            await pool.query(`UPDATE class SET status = ? WHERE id = ?`, [0, item]);
        })
        return res.status(200).json({ success: true})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

module.exports = router