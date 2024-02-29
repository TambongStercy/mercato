const router = require('express').Router();

//auth login
router.get('/login',(req,res)=> {
    res.render('login');
})

//google login
router.get('/google',(req,res)=> {
    //passport
    res.send('logging in with google');
})


//auth logout
router.get('/logout',(req,res)=>{
    res.send('logging out')
})

module.exports = router;