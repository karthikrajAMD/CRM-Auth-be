var express = require("express");
const { default: mongoose } = require("mongoose");
var router = express.Router();
const { mongodb, dbName, dbUrl } = require("../config/dbConfig");
const { adminModel } = require("../schema/AdminSchema");
const { userModel } = require("../schema/UserSchema");

const {
  hashedPassword,
  hashCompare,
  createToken,
  decodeToken,
  validate,
  roleAdmin,
} = require("../config/auth");
const { managerModel } = require("../schema/ManagerSchema");

/* GET users listing. */
mongoose.connect(dbUrl);
router.get("/all-users", validate, roleAdmin, async (req, res) => {
  try {
    console.log(userModel);

    let users = await userModel.find();
    let manager = await managerModel.find();
    let admin = await adminModel.find();
    res.send({ statusCode: 200, users, manager, admin });
    // res.send({ statusCode: 200, manager });
  } catch (err) {
    res.send({ statusCode: 500, message: "Internal server error" });
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    let isUserExist = await adminModel.findOne({
      _id: req.params.id,
    });
    console.log(isUserExist);
    if (isUserExist) {
      isUserExist.firstName = req.body.firstName;
      isUserExist.lastName = req.body.lastName;
      isUserExist.email = req.body.email;
      isUserExist.role = req.body.role;

      await isUserExist.save();

      res.send({
        statusCode: 200,
        message: "Data Edited Successfylly!",
      });
    }
  } catch (error) {
    res.send({ statusCode: 500, message: "Internal server error" });
  }
});
router.put("/update/:id", async (req, res) => {
  try {
    let isUserExist = await userModel.findOne({
      _id: req.params.id,
    });
    console.log(isUserExist);
    if (isUserExist) {
      isUserExist.firstName = req.body.firstName;
      isUserExist.lastName = req.body.lastName;
      isUserExist.email = req.body.email;
      isUserExist.role = req.body.role;

      await isUserExist.save();

      res.send({
        statusCode: 200,
        message: "Data Edited Successfylly!",
      });
    }
  } catch (error) {
    res.send({ statusCode: 500, message: "Internal server error" });
  }
});
router.post("/signup", async (req, res) => {
  try {
    if (req.body.password === req.body.confirmPassword) {
      console.log(req.body);
      let userExist = await adminModel.findOne({ email: req.body.email });

      if (!userExist) {
        let newHashedPassword = await hashedPassword(req.body.password);
        console.log(newHashedPassword);
        req.body.password = newHashedPassword;
        let newUser = await adminModel.create(req.body);
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
router.delete("/deleteManager/:id", async (req, res) => {
  try {
    let deletemanager = await managerModel.deleteOne({
      _id: mongodb.ObjectId(req.params.id),
    });

    res.send({
      statusCode: 200,
      message: "Manager data Deleted Successfully!",
    });
  } catch (error) {
    res.send({ statusCode: 500, message: "Internal error" });
    console.log(error);
  }
});
router.delete("/deleteAdmin/:id", async (req, res) => {
  try {
    let deleteadmin = await adminModel.deleteOne({
      _id: mongodb.ObjectId(req.params.id),
    });
    console.log(deleteadmin);
    res.send({
      statusCode: 200,
      message: "Admin data Deleted Successfully!",
    });
  } catch (error) {
    res.send({ statusCode: 500, message: "Internal error" });
    console.log(error);
  }
});
router.delete("/deleteUsers/:id", async (req, res) => {
  try {
    let deleteUser = await userModel.deleteOne({
      _id: mongodb.ObjectId(req.params.id),
    });
    console.log(deleteUser);
    res.send({
      statusCode: 200,
      message: "User data Deleted Successfully!",
    });
  } catch (error) {
    res.send({ statusCode: 500, message: "Internal error" });
    console.log(error);
  }
});
router.post("/login", async (req, res) => {
  try {
    let userExist = await adminModel.findOne({ email: req.body.email });
    if (userExist) {
      if (await hashCompare(req.body.password, userExist.password)) {
        let token = await createToken(userExist);
        res.send({ statusCode: 200, message: "login successful", token });
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

// Manager ......................................................................
router.put("/manager_update/:id", async (req, res) => {
  try {
    let isUserExist = await managerModel.findOne({
      _id: req.params.id,
    });
    console.log(isUserExist);
    if (isUserExist) {
      let isUserExist = await managerModel.updateOne({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        role: req.body.role,
      });

      res.send({
        statusCode: 200,
        message: "Data Edited Successfully!",
      });
    }
  } catch (error) {
    res.send({ statusCode: 500, message: "Internal server error" });
  }
});
module.exports = router;
