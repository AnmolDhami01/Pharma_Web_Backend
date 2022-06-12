const express = require("express");
const router = express.Router();

const Contact = require("../models/Contact");
const { body, validationResult } = require("express-validator");

// ROUTE 21: Add a new message using: POST "/api/contact". Login not required
// router.post("/contact", async (req, res) => {
//   const { name, email, phone, message } = req.body;

//   if (!name || !email || !phone || !message) {
//     res.status(422).json({ error: "Please Fill the Fields Correctly" });
//   }

//   try {
//     const contact = new Contact({
//       name,
//       email,
//       phone,
//       message,
//     });

//     const savingContact = await contact.save();

//     console.log(savingContact);

//     if (savingContact) {
//       res.status(201).json({ message: "Message Sent" });
//     } else {
//       res.status(422).json({ error: "Message Not Sent" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error });
//   }
// });

router.get("/fetchallcontact", async (req, res) => {
  let statusDescription = {};
  try {
    const contact = await Contact.find({});
    statusDescription = {
      statusMessage: "Success!!",
      statusCode: "200",
    };
    res.status(200).send({ statusDescription, contacts: contact });
    // res.json(contact);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});

router.post(
  "/sendcontact",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Email must be atleast 5 characters").isLength({
      min: 5,
    }),
    body("phone", "Phone Number must be atleast 10 characters").isLength({
      min: 10,
    }),
    body("message", "Message must be atleast 15 characters").isLength({
      min: 15,
    }),
  ],
  async (req, res) => {
    let statusDescription = {};
    const err = [];
    try {
      const { name, email, phone, message } = req.body;

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
      let contact = await Contact.findOne({ email: req.body.email });

      if (contact) {
        statusDescription = {
          statusMessage: "Your Msg have been send already.!!",
          statusCode: "409",
        };
        return res.status(200).send({ statusDescription });
        // return res.status(400).json({
        //   success,
        //   error: "Your Msg have been have send already",
        // });
      }
      contact = new Contact({
        name,
        email,
        phone,
        message,
      });
      const savedContact = await contact.save();
      statusDescription = {
        statusCode: 201,
        statusMessage:
          "Message Delivered, We will try to contact you as soon as possible !!",
      };
      res.json({ statusDescription, savedContact });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
