const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const cookieParser = require("cookie-parser");
const multer = require("multer");
const fs = require('fs');

const storage = multer.diskStorage({
  destination: async function (req, file, cb) {
    const directoryPath = "public/img/";
    // Ensure the directory structure exists
    await fs.promises.mkdir(directoryPath, { recursive: true });

    cb(null, directoryPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});

const upload = multer({ storage: storage });

router.use(cookieParser());
// Parse JSON bodies for this router
router.use(bodyParser.json());

// Parse URL-encoded bodies for this router
router.use(bodyParser.urlencoded({ extended: true }));

const {
  getSignup,
  postAdmin,
  getaddProduct,
  postProduct,
  getProducts,
  getClients,
  getLogout,
  getDashboard,
  verifyAdmin,
  deleteProduct,
  modifyProduct,
  getmodyfyProduct,
} = require("../controllers/admin.controllers");

router.get("/", verifyAdmin, getDashboard);
router.get("/dashboard", verifyAdmin, getDashboard);
router.get("/addproduct", verifyAdmin, getaddProduct);
router.get("/modifyproduct", verifyAdmin, getmodyfyProduct);
router.get("/products", verifyAdmin, getProducts);
router.get("/clients", verifyAdmin, getClients);
router.get("/logout", getLogout);
router.post("/signin", postAdmin);
router.get("/signin", getSignup);
router.post("/addproduct", verifyAdmin, upload.single("image"), postProduct);
router.post("/modifyproduct", verifyAdmin, upload.single("image"), modifyProduct);
router.get("/delete", verifyAdmin, deleteProduct);


module.exports = router;
