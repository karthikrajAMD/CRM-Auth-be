const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const saltRound = 10;
const secretKey = "somewhatismysecretkey";

const hashedPassword = async (password) => {
  let salt = await bcrypt.genSalt(saltRound);
  console.log(salt);
  return await bcrypt.hash(password, salt);
};

const hashCompare = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

const createToken = async ({ email, role, firstName, lastName }) => {
  let token = await jwt.sign({ email, role, firstName, lastName }, secretKey, {
    expiresIn: "1h",
  });
  return token;
};
const decodeToken = async (token) => {
  return await jwt.decode(token);
};

const validate = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    let token = await req.headers.authorization.split(" ")[1];
    let decodeMyToken = await decodeToken(token);
    console.log(decodeMyToken);
    // console.log(decodeMyToken.exp);
    if (Math.round(Date.now() / 1000) < decodeMyToken.exp) {
      next();
    } else {
      res.send({ statusCode: 400, message: "token is expired" });
    }
  } else {
    res.send({ statusCode: 400, message: "Token is missing" });
  }
};

const roleAdmin = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    let token = await req.headers.authorization.split(" ")[1];
    let decodeMyToken = await decodeToken(token);
    if (decodeMyToken.role === "admin") {
      next();
    } else {
      res.send({ statusCode: 400, message: "only admin can access" });
    }
  } else {
    res.send({ statusCode: 400, message: "Token is missing" });
  }
};

const roleManager = async (req, res, next) => {
  console.log(req.headers);
  console.log(req.headers.authorization);
  if (req.headers && req.headers.authorization) {
    let token = await req.headers.authorization.split(" ")[1];
    let decodeMyToken = await decodeToken(token);
    console.log(decodeMyToken);
    if (decodeMyToken.role === "Manager") {
      next();
    } else {
      res.send({ statusCode: 400, message: "only Manager can access" });
    }
  } else {
    res.send({ statusCode: 400, message: "Token is missing" });
  }
};
const roleEmployee = async (req, res, next) => {
  if (req.headers && req.headers.authorization) {
    let token = await req.headers.authorization.split(" ")[1];
    let decodeMyToken = await decodeToken(token);
    console.log(decodeMyToken);
    if (decodeMyToken.role === "user") {
      next();
    } else {
      res.send({
        statusCode: 400,
        message: "only Employee allowed to login this portal ",
      });
    }
  } else {
    res.send({ statusCode: 400, message: "Token is missing" });
  }
};
module.exports = {
  hashedPassword,
  hashCompare,
  createToken,
  decodeToken,
  validate,
  roleAdmin,
  roleManager,
  roleEmployee,
};
