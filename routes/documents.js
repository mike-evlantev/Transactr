const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");

// get a docuemnt

// generate a document
router.post(
  "/",
  [
    auth,
    [
      check("firstName", "First name is required")
        .not()
        .isEmpty(),
      check("lastName", "Last name is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("address1", "Address 1 is required")
        .not()
        .isEmpty(),
      check("city", "City is required")
        .not()
        .isEmpty(),
      check("state", "State is required")
        .not()
        .isEmpty(),
      check("zip", "Zip is required")
        .not()
        .isEmpty(),
      check("phone", "Name is required")
        .not()
        .isEmpty(),
      check("email", "Valid email is required").isEmail(),
      check("detail1", "Detail 1 is required")
        .not()
        .isEmpty(),
      check("detail2", "Detail 2 is required")
        .not()
        .isEmpty(),
      check("detail3", "Detail 3 is required")
        .not()
        .isEmpty(),
      check("detail4", "Detail 4 is required")
        .not()
        .isEmpty(),
      check("detail5", "Detail 5 is required")
        .not()
        .isEmpty(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { 
      firstName,
      lastName,
      company,
      address1,
      address2,
      city, state, zip,
      phone, email,
      detail1,
      detail2,
      detail3,
      detail4,
      detail5
     } = req.body;

    try {
      // new document
      

      // const newTransaction = new Transaction({
      //   user: req.user.id,
      //   firstName,
      //   lastName,
      //   company,
      //   address1,
      //   address2,
      //   city, state, zip,
      //   phone, email,
      //   detail1,
      //   detail2,
      //   detail3,
      //   detail4,
      //   detail5
      // });
      // save document
      const transaction = await newTransaction.save();

      // preview document (browserfy?)
      res.json(transaction);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// delete a document
