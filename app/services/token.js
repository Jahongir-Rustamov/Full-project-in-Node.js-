import jwt from "jsonwebtoken";

const generateJWTToken = (UserId) => {
  const accessToken = jwt.sign({ UserId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return accessToken;
};
export { generateJWTToken };

