const express = require('express')
const router = express.Router()
const {verifyTokenAndAdmin} = require('../../../middleware/verifyToken')

const pool = require('../../../common/connectDB')

router.post("/create", verifyTokenAndAdmin, async (req, res) => {
    try {
        const {name, lead, description} = req.body
        
        const [departmentExist] = await pool.query(`SELECT * FROM department WHERE name = ?`, [name]);
		if(departmentExist.length > 0){
			return res.status(400).json({ success: false, message: "Tên khoa đã tồn tại !"})
		}
        const [result] = await pool.query('INSERT INTO department (name, lead, description) VALUES (?, ?, ?)', [name, lead, description]);
        return res.status(200).json({ success: true, department: result })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const {name, lead, description, status} = req.body
        const [departmentExist] = await pool.query(`SELECT * FROM department WHERE name = ? AND id <> ${id}`, [name]);
		if(departmentExist.length > 0){
			return res.status(400).json({ success: false, message: "Tên khoa đã tồn tại !"})
		}
        const [result] = await pool.query('UPDATE department SET name=?, lead=?,description=?,status=? WHERE id=?', [name, lead, description,status, id]);
        return res.status(200).json({ success: true, department: result })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.post("/search", async (req, res) => {
    try {
        const {id, name, lead, status} = req.body

        console.log({id, name, lead, status});
        let sql = 'SELECT * FROM department WHERE 1=1'
        if(id){
            sql += ` AND id = ${id}`
        }
        if(name){
            sql += ` AND name LIKE "%${name}%"`
        }
        if(lead){
            sql += ` AND lead = "${lead}"`
        }
        if(status !== null && status !== undefined){
            sql += ` AND status = "${status}"`
        }
        const [result] = await pool.query(sql);
        console.log('sql', sql);
        return res.status(200).json({ success: true, department: result })
    } catch (error) {
        console.log('error', error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})



router.post("/delete", verifyTokenAndAdmin, async (req, res) => {
    try {
        const ids = req.body.ids;
        ids.map(async (id) => {
            await pool.query(`UPDATE department SET status = ? WHERE id = ?`, [0, id]);
        })
        return res.status(200).json({ success: true})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

module.exports = router