import express from "express";
import * as dotenv from "dotenv";
import { dirname, join } from "path";
import { engine, create } from "express-handlebars";
import Authrouter from "./routers/auth.js";
import Productssrouter from "./routers/productss.js";
import varmiddleware from "./varmiddleware/Local_token.js";
import cookieparser from "cookie-parser";
import flash from "connect-flash";
import session from "express-session";
import helpMiddleware from "./utils/index.js";
import usermiddleware from "./varmiddleware/user.js";
const app = express();
dotenv.config();

const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: helpMiddleware,
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(cookieparser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(usermiddleware);
app.use(express.static("public"));
app.use(varmiddleware);

// Flash session !!!
app.use(session({ secret: "Fire", resave: false, saveUninitialized: false }));
app.use(flash());

app.use(Authrouter);
app.use(Productssrouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
