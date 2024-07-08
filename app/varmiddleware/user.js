import JsonWebToken from "jsonwebtoken";
import { collection } from "../src/mongodb.js";
export default async function (req, res, next) {
  if (!req.cookies.token) {
    next();
    return;
  }
  const token = req.cookies.token;
  const decode = JsonWebToken.verify(token, process.env.JWT_SECRET);
  const user = await collection.findById(decode.UserId);
  req.UserId = user._id;
  next();
}
