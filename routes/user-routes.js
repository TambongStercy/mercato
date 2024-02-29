const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const axios = require("axios");
const cookieParser = require("cookie-parser");

router.use(cookieParser());
// Parse JSON bodies for this router
router.use(bodyParser.json());

// Parse URL-encoded bodies for this router
router.use(bodyParser.urlencoded({ extended: true }));

const {
  getHome,
  getHomme,
  getFemme,
  getAccessoires,
  getPochette,
  getCart,
  getNewArticles,
  getSingleProduct,
  getLogin,
  postLogin,
  getSignup,
  postSignup,
  verifyAuth,
  getUserPage,
  postCaisse,
  getLogout,
  getAddress,
  postAddress,
  flwWebhook,
  testMail,
  getPaymentComplete,
} = require("../controllers/user.controllers.js");

router.get("/", getHome);
router.get("/homme", verifyAuth, getHomme);
router.get("/femme", verifyAuth, getFemme);
router.get("/accessoires", verifyAuth, getAccessoires);
router.get("/pochette", verifyAuth, getPochette);
router.get("/cart", verifyAuth, getCart);
router.get("/newarticles", verifyAuth, getNewArticles);
router.get("/single-product", verifyAuth, getSingleProduct);
router.get("/user-page", verifyAuth, getUserPage);

router.get("/login", getLogin);
router.post("/login", postLogin);
router.get("/signup", getSignup);
router.post("/signup", postSignup);
router.get("/logout", verifyAuth, getLogout);

router.post("/caisse", verifyAuth, postCaisse);
router.get("/address", verifyAuth, getAddress);
router.post("/address", verifyAuth, postAddress);
router.post("/flw-webhook", flwWebhook);
router.get("/payment-completed", getPaymentComplete);
router.get("/test", testMail);

module.exports = router;
