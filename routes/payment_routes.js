const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')


router.use(bodyParser.urlencoded({ extended: true }));

const {
    initPay,
    requestPay,
    checkPayment,
    convertXFA,
} = require("../controllers/pay.controller")




router.get("/payment", requestPay)
router.get("/checkpayment", checkPayment)
router.get("/convertxfa", convertXFA)


router.post("/initpayment", initPay)



module.exports = router;
