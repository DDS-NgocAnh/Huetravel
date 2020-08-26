const dotenv = require('dotenv')
const JwtStrategy = require('passport-jwt').Strategy
const AnonymousStrategy = require('passport-anonymous').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt
const mongoose = require('mongoose')
const User = mongoose.model('User')

dotenv.config()

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
           User.findById(jwt_payload.id)
           .then((user) => {
               if(user) {
                   return done(null, user)
               } else {
                   return done(null, false)
               }
           })
           .catch(err => console.log(err))
        })
    ),
    passport.use(new AnonymousStrategy());
}