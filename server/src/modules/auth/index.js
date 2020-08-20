const User = require('./User')

const nodemailer = require('nodemailer')
const dotenv = require('dotenv')    

dotenv.config()

const { hashMd5,
    uuidv4,
    signToken,
    getRandomPassword
    } = require('../utils')
const { use } = require('passport')


const mailTransport = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD
    }
})

const confirmHTML = `
<p>Hi there.</p>
<p>Thank you for your registering. To verify your email address, please click the link below:</p>
`

const resetPwdHTML = `<p>Your password has been reset successfully. Your new password is <strong>`

const handlers = {
    async register(req, res, next) {
        try {
            let data = req.body

            let user = await User.findOne({ email: data.email })

            if(!user) {
                let confirmId = uuidv4()
                data.confirmId = confirmId
                data.password = hashMd5(data.password)
                let user = await User.create(data)
                let userData = user.toObject()
                delete userData.password

                await mailTransport.sendMail({
                    from: process.env.EMAIL,
                    to: userData.email,
                    subject: 'Please verify your email',
                    html: confirmHTML + 
                    `<p><a href='http://localhost:9000/api/user/confirm-email/${userData.confirmId}'>Click me to confirm</a></p>`
                    }, (err) => {
                    if(err) {
                        next(err)
                    } else {
                        res.send({ "message": 'Success! Please check your email' })
                    }
                })
            } else {
                throw new Error('Email already exists')
            }          
        } catch (error) {
            next(error)
        }
    },

    async confirmEmail(req, res, next) {
        try {
            let id = req.params.confirmId
            let user = await User.findOne({ confirmId: id })

            if(user) {
                user.active = true
                user.confirmId = ''
                await User.findByIdAndUpdate(
                    user._id,
                    user,
                    {
                        new: true
                    } 
                )
                res.send(`<html><script>
                    window.onload = function() {
                      alert("Confirm successful");
                    }
                    </script>
                    </html>`)
            } else {
                res.send(`
                <html>
                <script>
                window.onload = function() {
                  alert("Something went wrong");
                }
                </script>
                </html>`)
            }

        } catch (error) {
            next(error)
        }
    },

    async login(req, res, next) {
        try {
            let data = req.body
            let { email, password } = data

            let formattedEmail = String(email)
            let hashedPassword = hashMd5(String(password))
            let populateQuery = [
                { path: 'notifications', model: 'Notification', match: { isSeen: false },
            }
               ]

            let user = await User.findOne({ email: formattedEmail })
            .populate(populateQuery)

            if(!user) {
                throw new Error(`User not found!`)
            } else if (!user.active) {
                throw new Error('Your email is unconfirmed')
            }

            if(user.password !== hashedPassword) {
                throw new Error(`Password incorrect`)
            }

            let payload = {
                id: user._id,
                name: user.name,
                avatar: user.avatar,
                unSeenNotifications: user.notifications.length,
                notes: user.notes,
                reviews: user.reviews,
                flowers: user.flowers,
                rocks: user.rocks
            }

            let token = signToken(payload)

            res.json({
                message: 'Logged in',
                token: 'Bearer ' + token
            })

        } catch (error) {
            next(error)
        }
    },

    async logout(req, res, next) {
        try {
            
        } catch (error) {
            next(err)
        }
    },

    async getProfile(req, res, next) {
        try {
            let id = req.params.userId
            let pathSelect = 'name address avatar rocksTotal flowersTotal notes'
            let populateQuery = [
                { path: 'reviews', model: 'Post', select: pathSelect,
                populate: {path: 'notes', select: 'user._id'} },
                { path: 'notes.post', model: 'Post', select: pathSelect,
                populate: {path: 'notes', select: 'user._id'}}]

            let user = await User.findById(id)
            .populate(populateQuery)

            let userData = user.toObject()
            let notes = userData.notes.map(note => note.post)

            res.json({
                id: user._id,
                name: user.name,
                avatar: user.avatar,
                notes: notes,
                reviews: user.reviews,
                flowersTotal: user.flowersTotal,
                rocksTotal: user.rocksTotal
            })
        } catch (error) {
            next(error)
        }
    },

    async changePassword(req, res, next) {
        try {
            let { newPassword } = req.body.newPassword

            let hashedNewPassword = hashMd5(String(newPassword))
            await User.updateOne({ _id: req.user.id }, { password: hashedNewPassword })

            res.json({ message: 'Password was changed successfully'})
         
        } catch (error) {
            next(error)
        }
    },

    async resetPassword(req, res, next) {
        try {
            let resetPassword = getRandomPassword()
            let { email } = req.body
            let hashedPassword = hashMd5(String(resetPassword))

            await mailTransport.sendMail({
                from: process.env.EMAIL,
                to: email,
                subject: 'Reset your password',
                html: resetPwdHTML + resetPassword + '</strong></p>'
                }, async (err) => {
                if(err) {
                    next(err)
                } else {
                    await User.updateOne({ email: email }, { password: hashedPassword })
                    res.send({ "message": 'Success! Your new password has been sent to your email' })
                }
            })
        } catch (error) {
            next(error)
        }
    },

    async changeName(req, res, next) {
        try {
            let newName = req.body.name
            await User.updateOne({ _id: req.user.id }, { name: newName })

            res.json({ message: 'Name was changed successfully'})

        } catch (error) {
            next(error)
        }
    },

    async changeAvatar(req, res, next) {
        try {
            let newAvatar = req.body.avatar
            await User.updateOne({ _id: req.user.id }, { avatar: newAvatar })

            res.json({ message: 'Avatar was changed successfully'})

        } catch (error) {
            next(error)
        }
    },

    async deleteAll(req, res, next) {
        try {
            let user = await User.deleteMany({})
            res.json(user)
        } catch (error) {
            next(error)
        }
    },
    async findAll(req, res, next) {
        try {
            let users = await User.find({})
            res.json(users)
        } catch (error) {
            next(error)
        }
    },
}

module.exports = handlers