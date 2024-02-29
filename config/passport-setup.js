const passport = require('passport')
const googleStrategy =  require('passport-google-oauth20')

passport.use(googleStrategy({
    //options for googgle strategy
}),()=>{
    //passport callback funtion
})