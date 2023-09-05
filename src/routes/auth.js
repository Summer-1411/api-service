const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const pool = require('../common/connectDB')


//Tạo tài khoản admin
router.post('/register', async (req, res) => {
	// code	password	level	avatar	name	nationality	nation	address	phone	idCode	birthday	status	role	
	// const { account, password, name, avatar } = req.body
	const { code, password,	name } = req.body
	if(!code || !password || !name){
		return res
		.status(400)
		.json({ success: false, message: 'Bạn chưa nhập đủ thông tin tạo tài khoản !' })
	}
	
	try {
		const [adminExist] = await pool.query(`SELECT * FROM teacher WHERE code = ?`, [code]);
		if(adminExist.length > 0){
			return res.status(500).json({ success: false, user: "Tài khoản đã tồn tại !"})
		}
		else {
			// All good
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);
	
			await pool.query('INSERT INTO teacher (code, password, name) VALUES (?, ?, ?)', [code, hashedPassword, name]);
	
			
			return res.status(200).json({ success: true, message: "Tạo mới tài khoản Admin thành công"})
		}
		
	} catch (error) {
		console.log(error);
		return res.status(500).json({success: false, message: "Internal server error"})
	}
	
})


//Login Admin
router.post('/login', async (req, res) => {
	const { code, password } = req.body

	// Simple validation
	if (!code || !password)
		return res
			.status(400)
			.json({ success: false, message: 'Bạn chưa nhập tài khoản hoặc mật khẩu !' })

	try {
		// Check for existing user
		const [result] = await pool.query(`SELECT * FROM teacher WHERE code = ?`, [code]);
        console.log("userExist", result, code);
		if (result.length === 0){
			return res
				.status(400)
				.json({ success: false, message: 'Tài khoản không tồn tại !' })
		}
		
		const passwordValid =  bcrypt.compareSync(password, result[0].password)
     
		if (!passwordValid)
			return res
				.status(400)
				.json({ success: false, message: 'Mật khẩu không chính xác' })

		
		const accessToken = jwt.sign({ 
			id: result[0].id,
			role: result[0].role
		},process.env.ACCESS_TOKEN_SECRET
		)
		return res.json({
			success: true,
			message: 'Bạn đã đăng nhập thành công',
			user: result[0],
			accessToken
		})
	} catch (error) {
		console.log(error)
		res.status(500).json({ success: false, message: 'Internal server error' })
	}
})


module.exports = router
