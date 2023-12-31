const jwt = require('jsonwebtoken')


const verifyToken = (req, res, next) => {
	const authHeader = req.header('Authorization')
	const token = authHeader && authHeader.split(' ')[1]

	if (!token)
		return res
			.status(401)
			.json({ success: false, message: 'Access token not found' })

	try {

		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
		req.user = decoded
        //console.log({decoded});
		next()
	} catch (error) {
		console.log(error)
		return res.status(403).json({ success: false, message: 'Invalid token' })
	}
}


const verifyTokenAndAuthorization = (req, res, next) => {
    
    verifyToken(req, res, () => {
        
        const id = Number(req.user.id)
        const par = Number(req.params.id)
        console.log(req.user)

        if(id === par || req.user.role === 2){
            next();
        }else {
            return res.status(403).json("Bạn không được phép làm điều đó !")
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if(req.user.role === 2){
            next();
        }else {
            return res.status(403).json("Bạn không được phép làm điều đó !")
        }
    })
}


module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin
}

