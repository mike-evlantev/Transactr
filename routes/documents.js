const fs = require("fs");
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require("../middleware/auth");
const { check, validationResult } = require("express-validator");
const PDFDocument = require("pdfkit");
require("dotenv").config();
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const Document = require("../models/document");
const Transaction = require("../models/transaction");

// @route       GET api/documents
// @desc        Get all users documents
// @access      Private
router.get("/", auth, async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user.id }).sort({
      date: -1
    });
    res.json(documents);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route       GET api/documents/:id
// @desc        Get document by id
// @access      Private
router.get("/:id", auth, async (req, res) => {
  try {
    let document = await Document.findById(req.params.id);
    if (!document) return res.status(400).json({ msg: "Document not found" });
    // Verify user owns document
    if (document.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });

    // Generate and email pdf
    await emailPdf(document);

    // Send with response to download
    //res.contentType("application/pdf");    
    //doc.pipe(res);
    
    res.status(200).json({msg: "Email sent"});
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// @route       POST api/documents
// @desc        Upload a single document to Documents collection
// @access      Private
router.post(
  "/", 
  [
    auth,
    [
      check("name", "Document name is required")
        .not()
        .isEmpty(),
      check("description", "Document description is required")
        .not()
        .isEmpty(),
      check("format", "Document format is required")
        .not()
        .isEmpty(),
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });
    try {
      console.log(req.body);
      const { transaction, name, description, format } = req.body;
      
      let newDocument = new Document({
        user: req.user.id,
        transaction,
        name,  
        description,
        format
      });

      const document = await newDocument.save();
      // Generate and email pdf
      await emailPdf(document);
      res.json(document);
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
});

// @route       PUT api/documents/:id
// @desc        Update existing document
// @access      Private
router.put("/:id", auth, async (req, res) => {
const { name, description } = req.body;

// Build document object
const documentFields = {};
if (name) documentFields.name = name;
if (description) documentFields.description = description;

try {
  let document = await Document.findById(req.params.id);
  if (!document) return res.status(400).json({ msg: "Document not found" });
  // Verify user owns document
  if (document.user.toString() !== req.user.id)
    return res.status(401).json({ msg: "Not authorized" });
  document = await Document.findByIdAndUpdate(
    req.params.id,
    { $set: documentFields },
    { new: false }
  ); // Does not create new if no document found
  res.json(document);
} catch (error) {
  console.error(error.message);
  res.status(500).send("Server Error");
}
});

// @route       DELETE api/documents/:id
// @desc        Delete existing document
// @access      Private
router.delete("/:id", auth, async (req, res) => {
  try {
    let document = await Document.findById(req.params.id);
    if (!document) return res.status(400).json({ msg: "Document not found" });
    // Verify user owns document
    if (document.user.toString() !== req.user.id)
      return res.status(401).json({ msg: "Not authorized" });
    await Document.findByIdAndRemove(req.params.id);
    res.json({ msg: "Document removed" });
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
    .text("ACME Inc.").moveDown()
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
        to: "mikeev21@gmail.com",
        from: "transactions@acme.com",
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