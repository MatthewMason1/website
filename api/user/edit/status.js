const User = require('../../../models/User')
async function status(req, res) {
    console.log(req,req.body,req.query)
    if (!req.session.passport.user) return res.status(401).json({
        status: 401,
        message: '401 Unauthorized'
    }) 
    
    // Fetch user from the database
    await User.findById(req.session.passport.user).then(async (user) => {
        // Get status from the request body
        let status = req.query['newStatus']
        let statusType = req.query['type'] ? req.query['type'] : 0
        // If new status is the same as old status 
        // AND new status TYPE is the same, don't change anything
        if (status === user.status.name && statusType === user.status.type) return res.status(204).json({
            status: 204,
            message: '204 No Content'
        })
        let nuser = { status: { type: null, name: null }}
        // Change status type
        nuser.status.type = parseInt(statusType)
        // Change status name
        nuser.status.name = status
        Object.assign(user,nuser)
        console.log(req.query,status,nuser)
        await User.findByIdAndUpdate(req.session.passport.user, nuser).then(() => {
            console.log(nuser)
            return res.status(200).json({
                status: 200,
                message: '200 OK Status Changed'
            })    
        }).catch(err => {
            res.status(500).json({
                status: 500, message: '500 Internal Server Error'
            })
        })
    }).catch(err => {
        res.status(500).json({
            status: 500, message: '500 Internal Server Error'
        })
    })
}
module.exports = status