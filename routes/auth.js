const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "Harryisagoodb$oy";

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
// router.post(
//   "/createuser",
//   [
//     body("name", "Enter a valid name").isLength({ min: 3 }),
//     body("email", "Enter a valid email").isEmail(),
//     body("phone", "Phone Number must be atleast 10 characters").isLength({
//       min: 10,
//     }),
//     body("company", "Company name must be atleast 3 characters").isLength({
//       min: 3,
//     }),
//     body("city", "City name must be atleast 3 characters").isLength({
//       min: 3,
//     }),
//     body("state", "State name must be atleast 3 characters").isLength({
//       min: 3,
//     }),
//     body("password", "Password must be atleast 5 characters").isLength({
//       min: 5,
//     }),
//   ],
//   async (req, res) => {
//     let success = false;
//     // If there are errors, return Bad request and the errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({
//         success,
//         errors: errors.array(),
//       });
//     }
//     try {
//       // Check whether the user with this email exists already
//       let user = await User.findOne({ email: req.body.email });
//       if (user) {
//         return res.status(400).json({
//           success,
//           error: "Sorry a user with this email already exists",
//         });
//       }
//       const salt = await bcrypt.genSalt(10);
//       const secPass = await bcrypt.hash(req.body.password, salt);

//       // Create a new user
//       user = await User.create({
//         name: req.body.name,
//         password: secPass,
//         email: req.body.email,
//         company: req.body.company,
//         city: req.body.city,
//         state: req.body.state,
//         phone: req.body.phone,
//       });
//       const data = {
//         user: {
//           id: user.id,
//         },
//       };
//       const authtoken = jwt.sign(data, JWT_SECRET);

//       // res.json(user)
//       success = true;
//       res.json({ success, authtoken });
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );

router.post(
  "/createuser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("phone", "Phone Number must be in 10 to 12 characters").isLength({
      min: 10,
      max: 13,
    }),
    body("company", "Company name must be atleast 3 characters").isLength({
      min: 3,
    }),
    body("city", "City name must be atleast 3 characters").isLength({
      min: 3,
    }),
    body("state", "State name must be atleast 3 characters").isLength({
      min: 3,
    }),
    body("password", "Password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success = false;
    let statusDescription = {};
    const err = [];
    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      errors.array().forEach((element) => {
        err.push(element.msg);
      });
      let statusDescription = {
        statusCode: 400,
        statusMessage: err,
      };
      return res.status(400).json({
        statusDescription,
      });
    }
    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      let phone = await User.findOne({ phone: req.body.phone });
      if (user) {
        statusDescription = {
          statusCode: 222,
          statusMessage: "Username Already Exists !!",
        };
        return res.status(200).json({
          statusDescription,
        });
      } else if (phone) {
        statusDescription = {
          statusCode: 222,
          statusMessage: "User With This Phone Name Already Exists !!",
        };
        return res.status(200).json({
          statusDescription,
        });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      // Create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
        company: req.body.company,
        city: req.body.city,
        state: req.body.state,
        phone: req.body.phone,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);

      // res.json(user)
      statusDescription = {
        statusCode: 200,
        statusMessage: "Account  Created Successfully!!",
      };
      res.json({ statusDescription, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required

// router.post(
//   "/login",
//   [
//     body("email", "Enter a valid email").isEmail(),
//     body("password", "Password cannot be blank").exists(),
//   ],
//   async (req, res) => {
//     let success = false;

//     // If there are errors, return Bad request and the errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { email, password } = req.body;
//     try {
//       let user = await User.findOne({ email });
//       if (!user) {
//         success = false;
//         return res
//           .status(400)
//           .json({ error: "Please try to login with correct credentials" });
//       }

//       const passwordCompare = await bcrypt.compare(password, user.password);
//       if (!passwordCompare) {
//         success = false;
//         return res.status(400).json({
//           success,
//           error: "Please try to login with correct credentials",
//         });
//       }

//       const data = {
//         user: {
//           id: user.id,
//         },
//       };
//       const authtoken = jwt.sign(data, JWT_SECRET);
//       success = true;
//       res.json({ success, authtoken });
//     } catch (error) {
//       console.error(error.message);
//       res.status(500).send("Internal Server Error");
//     }
//   }
// );

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    let statusDescription = {};

    // If there are errors, return Bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        statusDescription = {
          statusCode: 5,
          statusMessage:
            "Username or Password is wrong for this Account Type !!!",
        };
        return res.status(200).json({
          statusDescription,
        });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        statusDescription = {
          statusCode: 5,
          statusMessage:
            "Username or Password is wrong for this Account Type !!!",
        };
        return res.status(200).json({
          statusDescription,
        });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      statusDescription = {
        statusCode: 200,
        statusMessage: "Success !!",
      };
      res.json({ statusDescription, authtoken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post("/getuser", fetchuser, async (req, res) => {
  let statusDescription = {};
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    statusDescription = {
      statusMessage: "Success!!",
      statusCode: "200",
    };
    res.send({ statusDescription, userDetails: user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post("/updatuser/:id", fetchuser, async (req, res) => {
  const { name, email, phone } = req.body;
  try {
    let statusDescription = {};

    if (req.params.id.length != 24) {
      statusDescription = {
        statusCode: 400,
        statusMessage: "Send Proper Object Id",
      };
      return res.status(400).send(statusDescription);
    }

    if (!name || !email || !phone) {
      let statusDescription = {
        statusMessage: "Request Body Not Completed !!",
        statusCode: "400",
      };
      return res.status(400).send({ statusDescription });
    }

    const newUser = {};
    if (name) {
      newUser.name = name;
    }
    if (email) {
      newUser.email = email;
    }
    if (phone) {
      newUser.phone = phone;
    }

    // console.log(req.body.email);

    // Find the note to be updated and update it
    let user = await User.findById({ _id: req.params.id });
    let user1 = await User.findOne({ email: req.body.email });
    let user2 = await User.findOne({ phone: req.body.phone });

    // console.log(user1.email == user.email);

    // console.log(user1 == req.user.id, user1, req.user.id);
    if (!user) {
      let statusDescription = {
        statusMessage: "No User With This Id Exist!!",
        statusCode: "401",
      };
      return res.status(200).send({ statusDescription });
    }

    // console.log(user1);

    if (user1 && user.email != req.body.email) {
      let statusDescription = {
        statusMessage: "User With This Email Already Exist!!",
        statusCode: "401",
      };
      return res.status(200).send({ statusDescription });
    }

    if (user2 && user.phone != req.body.phone) {
      let statusDescription = {
        statusMessage: "User With This Phone Number Already Exist!!",
        statusCode: "401",
      };
      return res.status(200).send({ statusDescription });
    }

    if (user._id.toString() !== req.user.id) {
      let statusDescription = {
        statusMessage: "Access Denied!!",
        statusCode: "401",
      };
      return res.status(200).send({ statusDescription });
    }

    // if (user.toString() !== req.user.id) {
    // if (user._id !== req.user.id) {
    //   let statusDescription = {
    //     statusMessage: "Not Allowed!!",
    //     statusCode: "401",
    //   };
    //   return res.status(200).send({ statusDescription });
    //   // return res.status(401).send("Not Allowed");
    // }
    user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: newUser },
      { new: true }
    );
    statusDescription = {
      statusMessage: "User Updated Successfully!!",
      statusCode: "200",
    };
    res.status(200).json({ statusDescription, userDetails: user });
  } catch (error) {
    console.error(error.message, error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
