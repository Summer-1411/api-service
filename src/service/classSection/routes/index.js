const express = require('express')
const router = express.Router()
const {verifyTokenAndAdmin} = require('../../../middleware/verifyToken')



const pool = require('../../../common/connectDB')

router.post("/create", verifyTokenAndAdmin, async (req, res) => {
    try {
        //	id	subject_id	max	current	teacher_id	time	status
        const {subject_id, max, teacher_id, time} = req.body
        const [result] = await pool.query('INSERT INTO classSection (subject_id, max, teacher_id, time) VALUES (?, ?, ?, ?)',
            [subject_id, max, teacher_id, time]);
        return res.status(200).json({ success: true, classSection: result })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.post("/search", async (req, res) => {
    try {
        const {id, subject_id, max, teacher_id, time, status} = req.body
        let sql = 'SELECT * FROM classSection WHERE 1=1'
        if(id){
            sql += ` AND id=${id}`
        }
        
        if(teacher_id){
            sql += ` AND teacher_id = "${teacher_id}"`
        }
        if(subject_id){
            sql += ` AND subject_id = ${subject_id}`
        }
        if(max){
            sql += ` AND max = "${max}"`
        }
        if(time){
            sql += ` AND time LIKE "%${time}%"`
        }
        if(status !== null && status !== undefined){
            sql += ` AND status = "${status}"`
        }
        const [result] = await pool.query(sql);
        return res.status(200).json({ success: true, classSection: result })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})



router.post("/delete", verifyTokenAndAdmin, async (req, res) => {
    try {
        const ids = req.body.ids;
        ids.map(async (id) => {
            await pool.query(`UPDATE classSection SET status = ? WHERE id = ?`, [0, id]);
        })
        return res.status(200).json({ success: true})
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        const id = req.params.id;
        const {subject_id, max, teacher_id, time, status} = req.body
        // subject_id=?, max=?, teacher_id=?, time=?
        const [result] = await pool.query('UPDATE classSection SET subject_id=?, max=?, teacher_id=?, time=?,status=?  WHERE id=?', 
        [subject_id, max, teacher_id, time, status, id]);
        return res.status(200).json({ success: true, classSection: result })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})




module.exports = router