const express = require('express');
const router = express.Router();

// @route       GET api/transactions
// @desc        Get all users transactions
// @access      Private
router.get('/', (req, res) => {
  res.send('Get all users transactions');
});

// @route       GET api/transactions/:id
// @desc        Get transaction by id
// @access      Private
router.get('/', (req, res) => {
  res.send('Get transaction by id');
});

// @route       POST api/transactions
// @desc        Add new transaction
// @access      Private
router.post('/', (req, res) => {
  res.send('Add new transaction');
});

// @route       PUT api/transactions/:id
// @desc        Update existing transaction
// @access      Private
router.put('/', (req, res) => {
  res.send('Update existing transaction');
});

// @route       DELETE api/transactions/:id
// @desc        Delete existing transaction
// @access      Private
router.delete('/', (req, res) => {
  res.send('Delete existing transaction');
});

module.exports = router;