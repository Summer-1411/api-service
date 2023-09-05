const express = require('express')
const router = express.Router()
const {verifyTokenAndAdmin, verifyToken} = require('../../../middleware/verifyToken')

const pool = require('../../../common/connectDB')

router.post("/register", verifyTokenAndAdmin, async (req, res) => {
    try {
        const {results} = req.body
        const values = results.map(item => [item.id_student, item.id_classSection])
        const sql = 'INSERT INTO result (id_student, id_classSection) VALUES ?';
        const [result] = await pool.query(sql, [values]);	
        const [result1] = await pool.query('UPDATE classSection SET current=?  WHERE id=?', 
        [values?.length, id_classSection]);
        return res.status(200).json({ success: true, result: result })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

//Cham diem
router.post("/set-score/:id", async (req, res) => {
    try {
        const id = req.params.id;	
        const {score} = req.body
        const [result] = await pool.query('UPDATE result SET score=?  WHERE id=?', 
        [score, id]);
        return res.status(200).json({ success: true, result: result })
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error !" })
    }
})

module.exports = router
