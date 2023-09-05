const express = require('express')
const router = express.Router()
const {verifyTokenAndAdmin} = require('../../../middleware/verifyToken')



const pool = require('../../../common/connectDB')
//	id	id_department, name, quantity, description, status	

router.post("/create", verifyTokenAndAdmin, async (req, res) => {
    try {
        const {id_department, name, quantity, description, status} = req.body
        const [result] = await pool.query('INSERT INTO subject (id_department, name, quantity, description, status) VALUES (?, ?, ?, ?, ?)', [id_department, name, quantity, description, status]);
        return res.status(200).json({ success: true, subject: result })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const {id_department, name, quantity, description, status} = req.body
        // /id_department=?, name=?, quantity=?, description=?, status=?
        const [result] = await pool.query('UPDATE subject SET id_department=?, name=?, quantity=?, description=?, status=? WHERE id=?', [id_department, name, quantity, description, status, id]);
        return res.status(200).json({ success: true, subject: result })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.post("/search", async (req, res) => {
    try {
        const {id, id_department, name, quantity, status} = req.body

        let sql = 'SELECT * FROM subject WHERE 1=1'
        if(id){
            sql += ` AND id = ${id}`
        }
        if(id_department){
            sql += ` AND id_department = ${id_department}`
        }
        if(name){
            sql += ` AND name LIKE "%${name}%"`
        }
        if(quantity){
            sql += ` AND quantity = ${quantity}`
        }
        if(status !== null && status !== undefined){
            sql += ` AND status = ${status}`
        }
        const [result] = await pool.query(sql);
        console.log('sql', sql);
        return res.status(200).json({ success: true, subject: result })
    } catch (error) {
        console.log('error', error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})



router.post("/delete", verifyTokenAndAdmin, async (req, res) => {
    try {
        const ids = req.body.ids;
        ids.map(async (item) => {
            await pool.query(`UPDATE subject SET status = ? WHERE id = ?`, [0, item]);
        })
        return res.status(200).json({ success: true})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

module.exports = router