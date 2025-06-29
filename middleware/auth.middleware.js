import jwt from 'jsonwebtoken'

export const isLoggedIn = async(req, res, next) => {
    try {
        console.log(req.cookies)
        let token = req.cookies?.sessiontoken

        console.log("Token Found", token ? "yes" : "no")

        if(!token ) {   
            console.log('no token')
            return res.status(401).json({message : "Authentication failed",  success : false})
        }

        //if token found
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log('decoded data', decoded)

        //create an user object and put the decoded data
        req.user = decoded

        next()
        
    } catch (error) {
        console.log("Auth middleware failure", error)
        return res.status(500).json({
            message : "Internal server error",
            success : false
        })
    }   
}