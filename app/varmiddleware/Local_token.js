export default function (req, res, next) {
  const authToken = req.cookies.token ? true : false;
  res.locals.token = authToken;
  next();
}
