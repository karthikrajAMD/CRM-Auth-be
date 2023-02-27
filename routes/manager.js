var express = require("express");
const { default: mongoose } = require("mongoose");
var router = express.Router();
const { mongodb, dbName, dbUrl } = require("../config/dbConfig");
const { managerModel } = require("../schema/ManagerSchema");
const { userModel } = require("../schema/UserSchema");
const {
  hashedPassword,
  hashCompare,
  createToken,
  decodeToken,
  validate,
  roleManager,
} = require("../config/auth");
/* GET users listing. */
mongoose.connect(dbUrl);
//......................
router.get("/all-users", validate, roleManager, async (req, res) => {
  try {
    let users = await userModel.find();

    res.send({ statusCode: 200, users });
    // res.send({ statusCode: 200, manager });
  } catch (err) {
    res.send({ statusCode: 500, message: "Internal server in error" });
  }
});
router.post("/get_user", async (req, res) => {
  try {
    console.log(req.body.email);
    let userExist = await managerModel.findOne({ email: req.body.email });
    console.log("get_user", userExist);
    if (userExist) {
      res.send({ statusCode: 200, message: "User found", userExist });
    } else {
      res.send({ statusCode: 400, message: "Invalid user credential" });
    }
  } catch (error) {
    console.log(error);
  }
});
router.put("/updatePassword/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    let isUserExist = await managerModel.findOne({
      _id: req.params.id,
    });
    let newPass = await hashedPassword(req.body.password);
    req.body.password = newPass;
    if (isUserExist) {
      let changeNewPass = await managerModel.findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        {
          password: req.body.password,
        }
      );
      res.send({
        statusCode: 200,
        message: "Password changed Successfully!",
      });
    } else {
      res.send({
        statusCode: 400,
        message: "Internal error",
      });
    }
  } catch (error) {
    res.send({ statusCode: 500, message: "Internal server error" });
  }
});
router.put("/changeProfile/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    let isUserExist = await managerModel.findOne({
      _id: req.params.id,
    });
    if (isUserExist) {
      let changeNewPass = await managerModel.findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        {
          profile: req.body.image,
        }
      );
      res.send({
        statusCode: 200,
        message: "Profile changed Successfully!",
      });
    } else {
      res.send({
        statusCode: 400,
        message: "Internal error",
      });
    }
  } catch (error) {
    res.send({ statusCode: 500, message: "Internal server error" });
  }
});
router.post("/signup", async (req, res) => {
  try {
    console.log(req.body);
    if (req.body.password === req.body.confirmPassword) {
      let userExist = await managerModel.findOne({ email: req.body.email });

      if (!userExist) {
        let newHashedPassword = await hashedPassword(req.body.password);
        console.log(newHashedPassword);
        req.body.password = newHashedPassword;
        let newUser = await managerModel.create(req.body);
        res.send({ statusCode: 200, message: "signup done successfully" });
      } else {
        res.send({ statusCode: 400, message: "User already Exist" });
      }
    } else {
      res.send({ statusCode: 404, message: "Password doesn't match" });
    }
  } catch (err) {
    console.log(err);
    res.send({ statusCode: 500, message: "Internal server error" });
  }
});
router.post("/login", async (req, res) => {
  try {
    let userExist = await managerModel.findOne({ email: req.body.email });
    if (userExist) {
      if (await hashCompare(req.body.password, userExist.password)) {
        let token = await createToken(userExist);
        let email = await userExist.email;
        res.send({
          statusCode: 200,
          message: "login successful",
          token,
          email,
        });
      } else {
        res.send({ statusCode: 400, message: "Password is wrong" });
      }
    } else {
      res.send({ statusCode: 400, message: "Invalid user credential" });
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
