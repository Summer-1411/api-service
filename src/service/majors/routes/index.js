const express = require('express')
const router = express.Router()
const {verifyTokenAndAdmin} = require('../../../middleware/verifyToken')


const pool = require('../../../common/connectDB')

router.post("/create", verifyTokenAndAdmin, async (req, res) => {
    try {
        const {name, idDepartment, description} = req.body
        const [result] = await pool.query('INSERT INTO major (name, id_department, description) VALUES (?, ?, ?)', [name, idDepartment, description]);
        return res.status(200).json({ success: true, major: result })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const {name, idDepartment, description, status} = req.body
        const [result] = await pool.query('UPDATE major SET name=?, id_department=?, description=?, status=? WHERE id=?', [name, idDepartment, description, status,id]);
        return res.status(200).json({ success: true, department: result })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.post("/search", async (req, res) => {
    try {
        const {id, name, idDepartment, status} = req.body
        let sql = 'SELECT * FROM major WHERE 1=1'
        if(id){
            sql += ` AND id = ${id}`
        }
        if(name){
            sql += ` AND name LIKE "%${name}%"`
        }
        if(idDepartment){
            sql += ` AND id_department = ${idDepartment}`
        }
        if(status !== null && status !== undefined){
            sql += ` AND status = ${status}`
        }
        const [result] = await pool.query(sql);
        return res.status(200).json({ success: true, major: result })
    } catch (error) {
        console.log('Check eeroor', error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})


router.post("/delete", verifyTokenAndAdmin, async (req, res) => {
    try {
        const ids = req.body.ids;
        ids.map(async (item) => {
            await pool.query(`UPDATE major SET status = ? WHERE id = ?`, [0, item]);
        })
        return res.status(200).json({ success: true})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

module.exports = router