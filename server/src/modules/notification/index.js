const Notification = require('./Notification')
const User = require('../auth/User')

const handlers = {
    async getNotification(req, res, next) {
        try {
            let user = await User.findById(req.user.id)
            .populate({ path: 'notifications', model: 'Notification', 
            populate: [{ path: 'commenter', model: 'User', select: 'name avatar'},
            { path: 'replier', model: 'User', select: 'name avatar'}],
            options: { sort: { date: -1 }, limit: 10}})

            let conditions = {}
            conditions.user = req.user.id
            conditions.isSeen = false

            let count = await Notification.countDocuments(conditions)

            res.json({
                listNoti: user.notifications,
                unSeenNoti: count
            })

        } catch (error) {
            next(error)
        }
    },

    async readNotification(req, res, next) {
        try {
            let notificationId = req.params.notificationId
            let notification = await Notification.findById(notificationId)
            if(notification) {
                if(String(notification.user) == String(req.user.id)) {
                    let notificationData = notification.toObject()
                    notificationData.status = 'read'

                    await Notification.findByIdAndUpdate(
                        notificationId,
                        notificationData,
                        {new: true}
                    )
    
                    next()
                } else {
                    throw new Error('Unauthorized')
                }
            } else {
                throw new Error('No notification found')
            }
        } catch (error) {
            next(error)
        }
    },

    async deleteAllNotis(req, res, next) {
        try {
            let notis = await Notification.deleteMany()
            
            res.json(notis)
        } catch (error) {
            next(error)
        }
    },

    async getAllNotis(req, res, next) {
        try {
            let notiss = await Notification.find()
            res.json(notiss)
        } catch (error) {
            next(error)
        }
    },
}

module.exports = handlers