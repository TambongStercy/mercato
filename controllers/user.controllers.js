const User = require("../models/UserModel");
const Product = require("../models/Product");
const Order = require("../models/order");
const Promo = require("../models/promo");
const axios = require("axios");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const nodemailer = require("nodemailer");
let discount = 0;
const transporter = nodemailer.createTransport({
  service: "Gmail",
  secure: false, // use SSL
  port: 25, // port for secure SMTP
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const getHome = async (req, res) => {
  res.render("home.ejs", { currentPage: "/" });
};


const getHomme = async (req, res) => {
  try {
    const regx = { $regex: new RegExp("homme", "i") };

    const products = await Product.find({ type: regx });

    res.render("homme.ejs", { products, currentPage: "/" });
  } catch (error) {
    console.log(error);
  }
};

const getFemme = async (req, res) => {
  try {
    const regx = { $regex: new RegExp("femme", "i") };

    const products = await Product.find({ type: regx });
    res.render("femme.ejs", { products, currentPage: "/" });
  } catch (error) {
    console.log(error);
  }
};

const getAccessoires = async (req, res) => {
  try {

    const regx = { $regex: new RegExp("accessoires", "i") };

    const products = await Product.find({ type: regx });

    res.render("accessories.ejs", { products, currentPage: "/" });
  } catch (error) {
    console.log(error);
  }
};

const getPochette = async (req, res) => {
  try {
    const regx = { $regex: new RegExp("pochette", "i") };

    const products = await Product.find({ type: regx });
    res.render("pochette.ejs", { products, currentPage: "/" });
  } catch (error) {
    console.log(error);
  }
};

const getCart = async (req, res) => {
  try {
    res.render("cart.ejs", { currentPage: "/cart"});
  } catch (error) {
    console.log(error);
  }
};

const getNewArticles = async (req, res) => {
  res.redirect('/');
  // res.render("new-articles.ejs", { currentPage: "/newarticles" });
};

const getSingleProduct = async (req, res) => {
  const prdtId = req.query.prdtId;
  console.log(prdtId);
  try {
    const product = await Product.findById(prdtId);
    console.log(product);
    res.render("single-article-page.ejs", { product, currentPage: "/" });
  } catch (error) {
    console.log(error);
  }
};

const getLogin = async (req, res) => {
  res.render("login.ejs", { currentPage: "/Login" });
};



const postLogin = async (req, res) => {
  async function authenticateUser(email, password) {
    try {
      const user = await User.findOne({ email:  { $regex: new RegExp(email, 'i') } });

      if (!user) {
        res.send("User not found.");
        return false;
      }
      bcrypt.compare(password, user.password, async (err, result) => {
        if (err) {
          console.log("Error comparing passwords:", err);
          res.status(500).send("Error comparing passwords.");
        } else {
          if (!result) {
            res.send("Incorrect password.");
          } else {
            console.log("User authenticated successfully.");
            const created = user.formattedCreatedAt();

            const token = await user.createToken();
            // Create cookie
            const cookieOptions = {
              httpOnly: true,
              secure: true,
              sameSite: "Strict",
              maxAge: 24 * 60 * 60 * 1000, // 1 day
            };

            console.log("cookie created");

            // Set cookie in response
            res.cookie("authToken", token, cookieOptions);

            res.redirect("/");
          }
        }
      });
    } catch (error) {
      console.error("Error authenticating user:", error);
      res.status(500).send("Error authenticating user.");
    }
  }

  // Extract email and password from the request body
  const { email, password } = req.body;

  // Call the authenticateUser function
  await authenticateUser(email, password);
};

const getSignup = async (req, res) => {
  res.render("signup.ejs", { currentPage: "/Login" });
};

const postSignup = async (req, res) => {
  salt = 10;
  console.log(req.body);

  async function addUser(userData) {
    try {
      const existingUser = await User.findOne({
        $or: [{ email: { $regex: new RegExp(userData.email, 'i') } }, { telephone: userData.telephone }],
      });
      if (existingUser) {
        res.send("User with this email or telephone number already exists.");
        return;
      }

      if (userData.password !== userData.cpassword) {
        res.send("Password and confirm password do not match.");
        return;
      }
      bcrypt.hash(userData.password, salt, async (err, hash) => {
        if (err) {
          console.log("error hashing password:" + err);
        } else {
          const user = new User({
            name: userData.uName,
            email: userData.email,
            telephone: userData.number,
            password: hash,
          });

          await user.save();

          const token = await user.createToken();
          // Create cookie
          const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 1 day
          };

          console.log("cookie created");

          // Set cookie in response
          res.cookie("authToken", token, cookieOptions);

          console.log("User added successfully.");

          const created = user.formattedCreatedAt();
          res.render("user-page.ejs", { user, created, currentPage: "/Login" });
        }
      });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  }
  addUser(req.body);
};

const getUserPage = async (req, res) => {
  const token = req.cookies.authToken;

  const user = await User.findOne({ token: token });

  const created = user.formattedCreatedAt();

  res.render("user-page", { user, created, currentPage: "/Login" });
};

const getAddress = async (req, res) => {
  const orderId = req.query.orderId;
  res.render("address.ejs", { orderId, currentPage: '' });
};

const postAddress = async (req, res) => {
  try {
    const { orderId, lat, long, name, town, quater, description, phone } =
      req.body;

    const token = req.cookies.authToken;

    const user = await User.findOne({ token: token })


    const order = await Order.findById(orderId);

    if (lat && long) {
      order.address = {
        latitude: lat,
        longitude: long,
      };

      await order.save();
    } else if (name && town && quater && phone) {
      order.address = {
        name,
        town,
        quater,
        description: description ?? "",
        phone,
      };

      await order.save();
    } else {
      console.log("something is lacking");
      return res.redirect("/address?orderId=" + orderId);
    }

    const username = user.name;
    const useremail = user.email;
    const userphone = user.telephone;

    const tx_ref = order.id;
    const total = order.totalAmount;

    // const scretKey = process.env.FLW_TEST_SECRET_KEY; //TEST API KEY
    const scretKey = process.env.FLW_SECRET_KEY;//REAL API KEY

    const options = {
      headers: { Authorization: `Bearer ${scretKey}` },
    };

    //where user should be rediected after paiment is made
    const redirectUrl = `${req.protocol}://${req.get('host')}/payment-completed`;

    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      {
        tx_ref: tx_ref,
        amount: total,
        currency: "XAF",
        redirect_url: redirectUrl,
        payment_options: "mobilemoneyghana, mobilemoneyfranco, card, ussd",
        customer: {
          email: useremail,
          phonenumber: userphone,
          name: username,
        },
        customizations: {
          title: "Mercato",
          logo: "public/assets/logo-no-background.png",
          description: "Nous vous remercions d'avoir choisi MERCATO pour vos achats. Nous sommes impatients de vous revoir très bientôt pour de nouvelles découvertes.",
        },
      },
      options
    );

    const data = response.data.data;
    const paymentLink = data.link;

    console.log(paymentLink);

    res.redirect(paymentLink);
  } catch (error) {
    console.log("server error:\n " + error);
    res.status(500).json({ message: "an error occured pls try again later" });
  }
};

const applyPromoCode = async (req, res, next) => {
  const promoCode = req.body.promoCode; // Get the promo code from the request body
  // Check if the promo code is "mars08" (case insensitive)
  if (promoCode && promoCode.trim().toLowerCase() === "mars08") {
    // Promo code is valid
    discount = 1;
    console.log(`Promo code applied successfully. discount ${discount}`);
    // Your logic here for applying the discount or any other action
    // For example, you might update the database, calculate the discounted price, etc.

    // Send a response indicating success
    res.status(200).json({ success: true, message: "Promo code applied successfully." });
    next();
  } else {
    // Promo code is invalid or missing
    console.log("Invalid promo code.");

    // Your logic here for handling invalid promo code
    // For example, you might display an error message, log the attempt, etc.

    // Send a response indicating failure
    res.status(400).json({ success: false, message: "Invalid promo code." });
  }
};



const applyDiscount = (totalAmount) => {
  // Apply a 20% discount (modify this logic as needed)
  const discountedAmount = totalAmount * 0.8;
  return discountedAmount;
};


const postCaisse = async (req, res) => {
  try {
    const token = req.cookies.authToken;
    const user = await User.findOne({ token: token });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userID = user.id;

    const prdtsCounts = JSON.parse(req.body.products);
    const products = [];
    let totalAmount = 1500;

    for (const IdAndCount of prdtsCounts) {
      const prdtId = IdAndCount.prdt.id;
      const size = IdAndCount.prdt.size;
      const prdtCount = IdAndCount.count;
      const product = await Product.findById(prdtId);

      if (!product) {
        continue;
      }

      products.push({ prdtId: prdtId, count: prdtCount, size: size });
      totalAmount += prdtCount * product.sellingPrice;
    }
    if(discount === 1){
      totalAmount = applyDiscount(totalAmount);
      console.log(`New price with discount: ${totalAmount}`);
    }else{
      console.log("No discount");
    }

    const order = Order({
      products: products,
      totalAmount: totalAmount,
      customer: userID,
    });

    await order.save();

    return res.redirect("/address?orderId=" + order.id);
  } catch (error) {
    console.log("error: " + error);
    res.status(500).json({ message: "An error occurred, please try again later" });
  }
};



const getLogout = async (req, res) => {
  const token = req.cookies.authToken;

  const user = await User.findOne({ token: token });

  await user.deleteToken();
  res.clearCookie("authToken");

  res.redirect("/login");
};

const flwWebhook = async (req, res) => {
  try {
    // If you specified a secret hash, check for the signature
    // const secretHash = process.env.FLW_SECRET_HASH;
    // const signature = req.headers["verif-hash"];
    // if (!signature || (signature !== secretHash)) {
    //     // This request isn't from Flutterwave; discard
    //     res.status(401).end();
    // }

    const payload = req.body;
    const orderId = payload.data.tx_ref;
    const status = payload.data.status;

    console.log(payload.data);
    console.log(payload.data.status);
    console.log(payload.data.customer);

    if (status === "successful") {
      console.log("success webhook payment");

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(400).json({ message: 'No order with this ID' })
      }
      order.paied = true;
      await order.save();

      sendOrderToAdmin(req, order);
    } else if (status === "failed") {
      console.log("failed webhook payment");
    } else {
      console.log("failed with status: " + status);
    }

    res.status(200).end();
  } catch (error) {
    console.log(error);
  }
};

const getPaymentComplete = async (req, res) => {
  res.render("payment-complete.ejs", { currentPage: "/" });
}

const sendOrderToAdmin = async (req,order) => {
  const totalAmount = order.totalAmount;
  const userId = order.customer;
  const products = order.products;
  const address = order.address;
  let displayAddress = "";

  if (address.latitude && address.longitude) {
    displayAddress = `<br/>latitude: ${address.latitude}
    <br/>longitude: ${address.longitude} 
    <br/> <a href ='https://maps.google.com/?q=${address.latitude},${address.longitude}' style="
    text-decoration: none;
    display: inline-block;
    padding: 8px 16px;
    border: 1px solid #6464645c;
    border-radius: 5px;
    background-color: #04AA6D;
    ">view on google map</a>`;
  } else if (address.name && address.town && address.quater && address.phone) {
    displayAddress = `<br/>Vile: ${address.town}<br/>quartier: ${address.quater
      }</br/>description: ${address.description ?? ""}`;
  }

  const user = await User.findById(userId);
  const username = user.name;
  const useremail = user.email;
  const userphone = user.telephone;
  const email = "Mercatoshopcmr@gmail.com";

  const prdts = await Promise.all(
    products.map(async ({ prdtId, count, size }) => {
      const prdt = await Product.findById(prdtId);
      const prdtName = prdt.name;
      const category = prdt.category;
      const type = prdt.type;

      const url = `${req.protocol}://${req.get('host')}${prdt.imagePath}`

      return `<li>
      <div style="
      box-shadow: 0px 2px 8px rgba(29, 37, 56, 0.2);
      max-width: 40%;
      margin-top: 3%;
      text-align: center;
      border-radius: 15px;">
          <img src="${url}" alt="Jean en denim" style="width:100%">
          <h1 style="color: grey;font-size: 12px;">
              Nom: ${prdtName}
          </h1>
          <h3 style="color: grey;font-size: 10px;">
              Catégory: ${category}
          </h3>
          <h3 style="color: grey;font-size: 10px;">
              Type: ${type}
          </h3>
          <h3 style="color: grey;font-size: 10px;">
              Taille: ${size}
          </h3>
          <p style="
          color: grey;
          font-size: 10px;
          ">
              Quantité: ${count}
          </p>
      </div>
    
      
      </li>`;
    })
  );

  const joinedString = prdts.join("");

  await transporter.sendMail({
    from: '"Mercato Buisness" <Mercato@gmail.com>',
    to: email,
    subject: "Commande Effectué.",
    html: `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
    <div style="margin:50px auto;width:70%;padding:20px 0">
      <div style="border-bottom:1px solid #eee">
        <a href="" style="font-size:1.4em;color: #92b127;text-decoration:none;font-weight:600">MERCATO </a>
      </div>
    <div style="max-width: 600px; margin: 20px auto; padding: 20px; background-color: #fff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <h1 style="margin: 0 0 20px;">Commande Effectué</h1>
      <p style="margin: 0 0 20px;">Un client vient de passer une commande pour les articles suivants :</p>
      <ul style="margin: 0 0 20px;">
      ${joinedString}
      </ul>
      <div style="border-top: 1px solid #ddd; padding-top: 20px;">
          <p style="margin: 0 0 20px;">Montant payé : ${totalAmount} XFA</p>
          <h2 style="margin: 0 0 10px;">Le client :</h2>
          <p style="margin: 0 0 10px;"><strong>Nom :</strong> ${username}</p>
          <p style="margin: 0 0 10px;"><strong>Téléphone :</strong> ${userphone}</p>
          <p style="margin: 0 0 10px;"><strong>Email :</strong> ${useremail}</p>
          <h2 style="margin: 0 0 10px;">Address:</h2>
          ${displayAddress}
      </div>
      <p style="margin-top: 20px;">Veuillez contacter ce client dès que possible.</p>
  </div>
      <p style="font-size:0.9em;">Cordialement,<br />MERCATO</p>
      <hr style="border:none;border-top:1px solid #eee" />
      <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
        <p>Mercato Buisness Inc</p>
        <p>Developed by Simbtech,<br /> copyright ©</p>
        <p>Cameroun-Yaoundé</p>
      </div>
    </div>
  </div>`,
  });

  console.log("OK Email sent😊");
};

const testMail = async (req, res) => {
};

const verifyAuth = async (req, res, next) => {
  try {
    const token = req.cookies.authToken;

    // const endPoint = req.route.path;

    if (!token) {
      console.log("token: " + token);
      console.log("not authorized");
      return res.redirect(302, "/login");
    }

    // const admin = await adminModel.findOne({ email: process.env.ADMIN_EMAIL });

    const tokenExist = await User.verifyToken(token);

    //if token exist in db
    if (!tokenExist) {
      console.log("not authorized");
      return res.redirect(302, "/login");
    }

    //successfully authenticated
    return next();
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getHome,
  getHomme,
  getFemme,
  getAccessoires,
  getPochette,
  getCart,
  getNewArticles,
  getSingleProduct,
  applyPromoCode,
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
  
};
