const User = require('./User')

const nodemailer = require('nodemailer')
const dotenv = require('dotenv')    

dotenv.config()

const { hashMd5,
    uuidv4,
    signToken,
    getRandomPassword,
    } = require('../utils')

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
                await mailTransport.sendMail({
                    from: process.env.EMAIL,
                    to: data.email,
                    subject: 'Please verify your email',
                    html: confirmHTML + 
                    `<p><a href='https://huetravel.herokuapp.com/api/user/confirm-email/${confirmId}'>Click me to confirm</a></p>`
                    }, async (err) => {
                    if(err) {
                        next(err)
                    } else {
                        data.confirmId = confirmId
                        data.password = hashMd5(data.password)
                        await User.create(data)
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
            let hashedPassword = hashMd5(password)
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

    async getProfile(userId) {
        try {
            let id = userId
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

            return {
                id: user._id,
                name: user.name,
                avatar: user.avatar,
                notes: notes,
                reviews: user.reviews,
                flowersTotal: user.flowersTotal,
                rocksTotal: user.rocksTotal
            }
        } catch (error) {
            return { error: error }
        }
    },

    async changePassword(req, res, next) {
        try {
            let { newPassword, currentPassword } = req.body
            console.log(currentPassword, newPassword);

            let hashedNewPassword = hashMd5(newPassword)
            let hashedCurrentPassword = hashMd5(currentPassword)

            let user = await User.findById(req.user.id)
            if(user.password != hashedCurrentPassword) {
                throw new Error('Your current password is incorrect')
            } else {
                await User.updateOne({ _id: req.user.id }, { $set: {password: hashedNewPassword }})
                res.json({ message: 'Password was changed successfully'})
            }
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
                    await User.updateOne({ email: email }, { $set: {password: hashedPassword} })
                    res.send({ "message": 'Success! Please check your email' })
                }
            })
        } catch (error) {
            next(error)
        }
    },

    async changeName(req, res, next) {
        try {
            let newName = req.body.name
            await User.updateOne({ _id: req.user.id }, 
            {$set: { name: newName }})

            res.json({ message: 'Name was changed successfully'})

        } catch (error) {
            next(error)
        }
    },

    async getAvatar(userId) {
        try {
            let user = await User.findById(userId)
            return { avatar: user.avatar }
        } catch (error) {
            return { error: error}
        }
    },

    async changeAvatar(req, res, next) {
        try {
            let newAvatar = req.body.avatar
            await User.updateOne({ _id: req.user.id }, { $set: {avatar: newAvatar }})

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