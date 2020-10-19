const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const PDFDocument = require("pdfkit");
require("dotenv").config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const Document = require("../models/document");
const Transaction = require("../models/transaction");

// @route       GET api/transactions
// @desc        Get all users transactions
// @access      Private
router.get("/", auth, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(transactions);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route       GET api/transactions/:id
// @desc        Get transaction by id
// @access      Private
router.get("/:id", auth, async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(400).json({ msg: "Transaction not found" });
    // Verify user owns transaction
    if (transaction.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });
    res.json(transaction);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route       POST api/transactions
// @desc        Add new transaction
// @access      Private
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
      check("documentName", "Document name is required")
        .not()
        .isEmpty(),
      check("documentDescription", "Document description is required")
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
      detail5,
      documentName,
      documentDescription,
     } = req.body;

    try {
      const newTransaction = new Transaction({
        user: req.user.id,
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
        detail5,
      });
      const transaction = await newTransaction.save();

      // Create document for transaction
      let newDocument = new Document({
        user: req.user.id,
        transaction: transaction._id,
        name: documentName,  
        description: documentDescription,
        recipient: req.user.email, 
        format: "pdf"
      });

      const document = await newDocument.save();
      // Generate and email pdf
      await emailPdf(document);

      res.json({transaction, document});
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route       PUT api/transactions/:id
// @desc        Update existing transaction
// @access      Private
router.put("/:id", auth, async (req, res) => {
  const { 
    firstName, lastName,
    company, 
    address1, address2,
    city, state, zip,
    phone, email,
    detail1,
    detail2,
    detail3,
    detail4,
    detail5
   } = req.body;

  // Build transaction object
  const transactionFields = {};
  if (firstName) transactionFields.firstName = firstName;
  if (lastName) transactionFields.lastName = lastName;
  if (company) transactionFields.company = company;
  if (address1) transactionFields.address1 = address1;
  if (address2) transactionFields.address2 = address2;
  if (city) transactionFields.city = city;
  if (state) transactionFields.state = state;
  if (zip) transactionFields.zip = zip;
  if (phone) transactionFields.phone = phone;
  if (email) transactionFields.email = email;
  if (detail1) transactionFields.detail1 = detail1;
  if (detail2) transactionFields.detail2 = detail2;
  if (detail3) transactionFields.detail3 = detail3;
  if (detail4) transactionFields.detail4 = detail4;
  if (detail5) transactionFields.detail5 = detail5;

  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(400).json({ msg: "Transaction not found" });
    // Verify user owns transaction
    if (transaction.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });
    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { $set: transactionFields },
      { new: true }
    ); // Tries to find transaction by id and update. If not found create it.
    res.json(transaction);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route       DELETE api/transactions/:id
// @desc        Delete existing transaction
// @access      Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(400).json({ msg: "Transaction not found" });
    // Verify user owns transaction
    if (transaction.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });
    await Transaction.findByIdAndRemove(req.params.id);
    res.json({ msg: "Transaction removed" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;

function generateHeader(doc) {
  try {
    doc
    .fontSize(10)
    .text("Transactr").moveDown()
    .text("123 Main Street").moveDown()
    .text("New York, NY, 10025").moveDown(); 
  } catch (error) {
    console.error(error.message);
  }
}

function generateFooter(doc, transaction) {
  try {
    doc
      .fontSize(7)
      .text(
        `Transaction prepared by ${transaction.user} on ${transaction.date}`,
        50,
        780,
        { align: "center", width: 500 }
      );
  } catch (error) {
    console.error(error.message);
  }  
}

function generateCustomerInformation(doc, transaction) {
  try {
    doc
    .moveDown()
    .text("Customer Information").moveDown()
    .text(transaction.company).moveDown()

    .text(`${transaction.firstName} ${transaction.lastName}`).moveDown()
    .text(`${transaction.address1} ${transaction.address2}`).moveDown()
    .text(`${transaction.city}, ${transaction.state}, ${transaction.zip}`).moveDown()
    .text(transaction.phone).moveDown()
    .text(transaction.email).moveDown();
  } catch (error) {
    console.error(error.message);
  }
}

function generateTransactionDetails(doc, transaction) {
  try {
    doc
    .moveDown()
    .text("Transaction Details").moveDown()
    .text(`Detail 1: ${transaction.detail1}`).moveDown()
    .text(`Detail 2: ${transaction.detail2}`).moveDown()
    .text(`Detail 3: ${transaction.detail3}`).moveDown()
    .text(`Detail 4: ${transaction.detail4}`).moveDown()
    .text(`Detail 5: ${transaction.detail5}`).moveDown();
  } catch (error) {
    console.error(error.message);
  }
}

const emailPdf = async (document) => {
  try {
   // Get associated transaction
    const transaction = await Transaction.findById(document.transaction);
    let doc = new PDFDocument({margin: 50, bufferPages: true});
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {

      let pdfData = Buffer.concat(buffers).toString('base64');

      // ... now send pdfData as attachment ...
      const msg = {
        to: document.recipient,
        from: "transactions@transactr.gg",
        subject: "Transaction Attached",
        text: `Attached please find transaction ${document.name}`,
        attachments:[{
          content: pdfData,
          filename: document.name,
          type: "application/pdf",
          disposition: "attachment"
        }]
      };
  
      sgMail
        .send(msg)
        .catch(err => {
          console.error(err.message);
          //res.status(500).send("SendGrid Error");
        });
    });

    generateHeader(doc);
    generateCustomerInformation(doc, transaction);
    generateTransactionDetails(doc, transaction);
    generateFooter(doc, transaction);

    doc.end(); 
  } catch (error) {
    console.error(error.message);
  }
}