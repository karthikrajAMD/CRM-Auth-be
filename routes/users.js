var express = require("express");
const { default: mongoose } = require("mongoose");
var router = express.Router();
const { mongodb, dbName, dbUrl } = require("../config/dbConfig");
const { userModel } = require("../schema/UserSchema");

const {
  hashedPassword,
  hashCompare,
  createToken,
  decodeToken,
  validate,
  roleEmployee,
} = require("../config/auth");
/* GET users listing. */
mongoose.connect(dbUrl);
//......................

router.get("/verify", validate, roleEmployee, async (req, res) => {
  try {
    let users = await userModel.find();
    res.send({ statusCode: 200, users });
  } catch (err) {
    res.send({ statusCode: 500, message: "Internal server in error" });
  }
});
router.post("/signup", async (req, res) => {
  try {
    if (req.body.password === req.body.confirmPassword) {
      console.log(req.body);
      let userExist = await userModel.findOne({ email: req.body.email });

      if (!userExist) {
        let newHashedPassword = await hashedPassword(req.body.password);
        console.log(newHashedPassword);
        req.body.password = newHashedPassword;
        let newUser = await userModel.create(req.body);
        res.send({ statusCode: 200, message: "signup done successfully" });
      } else {
        res.send({ statusCode: 400, message: "User already Exist" });
      }
    } else {
      res.send({ statusCode: 400, message: "Password doesn't match" });
    }
  } catch (err) {
    console.log(err);
    res.send({ statusCode: 500, message: "Internal server error" });
  }
});
// router.delete("/deleteUsers/:id", async (req, res) => {
//   try {
//     let deleteUser = await userModel.deleteOne({
//       _id: mongodb.ObjectId(req.params.id),
//     });
//     res.send({
//       statusCode: 200,
//       message: "User data Deleted Successfully!",
//     });
//   } catch (error) {
//     res.send({ statusCode: 500, message: "Internal error" });
//     console.log(error);
//   }
// });
router.post("/login", async (req, res) => {
  try {
    let userExist = await userModel.findOne({ email: req.body.email });
    if (userExist) {
      if (await hashCompare(req.body.password, userExist.password)) {
        let token = await createToken(userExist);
        let email = userExist.email;
        let name = userExist.firstName + "_" + userExist.lastName;
        res.send({
          statusCode: 200,
          message: "login successful",
          token,
          email,
          name,
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

router.post("/get_user", async (req, res) => {
  try {
    console.log(req.body.email);
    let userExist = await userModel.findOne({ email: req.body.email });
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
    let isUserExist = await userModel.findOne({
      _id: req.params.id,
    });
    let newPass = await hashedPassword(req.body.password);
    req.body.password = newPass;
    if (isUserExist) {
      let changeNewPass = await userModel.findByIdAndUpdate(
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
    let isUserExist = await userModel.findOne({
      _id: req.params.id,
    });
    if (isUserExist) {
      let changeNewPass = await userModel.findByIdAndUpdate(
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

module.exports = router;
