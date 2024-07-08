import { Router } from "express";
import { collection, validate1 } from "../src/mongodb.js";
import lodash from "lodash";
import bcrypt from "bcrypt";
import { generateJWTToken } from "../services/token.js";
const router = Router();

router.get("/Login", (req, res) => {
  if (req.cookies.token) {
    res.redirect("/");
    return;
  }
  res.status(200).render("Login", {
    title: "Login User",
    isLogin: true,
    LoginError: req.flash("LoginError"),
  });
});

router.get("/Register", (req, res) => {
  if (req.cookies.token) {
    res.redirect("/");
    return;
  }
  res.status(200).render("Register", {
    title: "Register User",
    isRegister: true,
    RegisterError: req.flash("RegisterError"),
  });
});

router.post("/register", async (req, res) => {
  const { FirstName, LastName, password, email } = req.body;

  // Check if all fields are filled
  if (!FirstName || !LastName || !password || !email) {
    req.flash("RegisterError", "All fields are required");
    return res.redirect("/Register");
  }

  // Validate input
  const { error } = validate1(req.body);
  if (error) {
    req.flash("RegisterError", error.details[0].message);
    return res.redirect("/Register");
  }

  // Check if user already exists
  let user = await collection.findOne({ email: req.body.email });
  if (user) {
    req.flash("RegisterError", "User already exists");
    return res.redirect("/Register");
  }

  // Create new user
  user = new collection(
    lodash.pick(req.body, ["FirstName", "LastName", "password", "email"])
  );

  // Hash the password
  const salt = await bcrypt.genSalt();
  user.password = await bcrypt.hash(user.password, salt);

  try {
    // Save the user
    const savedUser = await user.save();
    const token = generateJWTToken(savedUser._id);

    // Set cookie with token
    res.cookie("token", token, { httpOnly: true, secure: true });
    return res.redirect("/");
  } catch (error) {
    console.error("Error saving user: ", error);
    req.flash("RegisterError", "An error occurred while saving");
    return res.redirect("/Register");
  }
});

//LogOut
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

router.post("/login", async (req, res) => {
  const { password, email } = req.body;

  // Barcha maydonlar to'ldirilmagan bo'lsa
  if (!password || !email) {
    req.flash("LoginError", "All fields is required");
    return res.redirect("/Login");
  }

  try {
    const user = await collection.findOne({ email: req.body.email });

    // Foydalanuvchi topilmasa
    if (!user) {
      req.flash("LoginError", "Email or Password error");
      return res.redirect("/Login");
    }

    const isvalidate = await bcrypt.compare(req.body.password, user.password);

    if (isvalidate) {
      const token = generateJWTToken(user._id);
      res.cookie("token", token, { secure: true });
      return res.redirect("/");
    } else {
      req.flash("LoginError", "Email or Password error");
      return res.redirect("/Login");
    }
  } catch (error) {
    console.error("Saqlashda xatolik: ", error);
    req.flash("LoginError", "Have error with saved");
    return res.redirect("/Login");
  }
});

export default router;
