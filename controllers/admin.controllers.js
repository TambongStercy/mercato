const User = require("../models/UserModel");
const Product = require("../models/Product");
const adminToken = require("../models/adminToken");
const { createUploadFile, downloadFile, deleteDriveFile } = require('../controllers/googledrive.controller')
const fs = require('fs')


const getSignup = async (req, res) => {
  res.render("admin/signin.ejs");
};

const postAdmin = async (req, res) => {
  const Uname = req.body.name;
  const Upass = req.body.password;

  if (Uname == process.env.ADMIN_NAME && Upass == process.env.ADMIN_PASS) {
    const userCount = await User.countDocuments();

    const token = await adminToken.createToken();
    // Create cookie
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    };

    console.log("cookie created");

    // Set cookie in response
    res.cookie("adminToken", token, cookieOptions);

    res.render("admin/dashboard.ejs", {
      userCount,
      active: 1,
    });
  } else {
    console.log("wrong");
    return res.redirect("/admin/signin");
  }
};

const getDashboard = async (req, res) => {

  const userCount = await User.countDocuments();

  res.render("admin/dashboard.ejs",{ userCount });
};

const getClients = async (req, res) => {
  const users = await User.find({});

  res.render("admin/clients.ejs", { users });
};

const getLogout = async (req, res) => {
  const token = req.cookies.adminToken;

  await adminToken.deleteToken(token);

  res.clearCookie("adminToken");

  res.redirect("/admin/signin");
};

const postProduct = async (req, res) => {
  // const productImage = req.body.image;
  const productName = req.body.name;
  const productCost = req.body.costprice;
  const productSell = req.body.sellingprice;
  const productCategory = req.body.Category;
  const productSize = req.body.size;
  const productType = req.body.type;
  const productStock = req.body.stock;

  try {
    let image;
    let imageId;
    if (req.file) {
      image = `/img/${req.file.filename}`;
      imageId = await createUploadFile(`public${image}`, process.env.PRDT_DIR)
    }

    const product = new Product({
      imageId: imageId,
      imagePath: image,
      name: productName,
      costPrice: productCost,
      sellingPrice: productSell,
      category: productCategory,
      size: productSize,
      type: productType,
      stock: productStock,
    });

    await product.save();
    console.log("Successfully added");
    res.redirect('/admin/products')
  } catch (error) {
    console.error("Error adding product: " + error);
    res.status(500).send("Error adding product");
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.query.id

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      console.log(`Product with ID ${productId} not found.`);
    } else {
      await deleteDriveFile(deletedProduct.imageId)
    }

    res.redirect('/admin/products')
  } catch (error) {
    console.log(error)
  }
}

async function downloadPrdtDrive() {
  try {
    const prdtsWithImageId = await Product.find({ imageId: { $exists: true, $ne: null, $ne: '' } });

    console.log('downloading backup')

    for (const prdt of prdtsWithImageId) {
      const filePath = `public${prdt.imagePath}`
      const fileId = prdt.imageId

      if (!fs.existsSync(filePath)) {

        await downloadFile(filePath, fileId)
      }
    }

  } catch (error) {
    console.log(error)
  }
}


const getOrders = async (req, res) => {
  res.render("admin/orders.ejs");
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find({})
    res.render("admin/warehouse.ejs", { products });
  } catch (err) {
    console.log(err);
  }
};

const getaddProduct = async (req, res) => {
  res.render("admin/add_product.ejs");
};

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.adminToken;

    // const endPoint = req.route.path;

    if (!token) {
      console.log("token: " + token);
      console.log("not authorized");
      return res.redirect("/admin/signin");
    }

    const tokenExist = await adminToken.verifyToken(token);

    //if token exist in db
    if (!tokenExist) {
      console.log("not authorized");
      return res.redirect("/admin/signin");
    }

    //successfully authenticated
    return next();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getSignup,
  getDashboard,
  getOrders,
  getProducts,
  getaddProduct,
  postAdmin,
  postProduct,
  getClients,
  getLogout,
  verifyAdmin,
  downloadPrdtDrive,
  deleteProduct,
};
