export default function (req, res, next) {
  if (!req.cookies.token) {
    res.redirect("/Login");
    return;
  }
  next();
}
