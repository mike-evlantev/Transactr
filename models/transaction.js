const mongoose = require("mongoose");

const TransactionSchema = mongoose.Schema({
  // A transaction has an associated user 
  user: {
    type: mongoose.Schema.Types.ObjectId, // mongoose Object Id for user's Id
    ref: 'users'                          // refer to specific collection 'users'
  },
  date: {
    type: Date,
    default: Date.now
  },
  isValid: {
    type: Boolean,
    default: false,
    require: true,
  },
  firstName: {
    type: String,
    require: true
  },
  lastName: {
    type: String,
    require: true
  },
  company: {
    type: String,
    require: true
  },
  address1: {
    type: String,
    require: true
  },
  address2: {
    type: String,
    require: false
  },
  city: {
    type: String,
    require: true
  },
  state: {
    type: String,
    require: true
  },
  zip: {
    type: String,
    require: true
  },
  phone: {
    type: String,
    require: true
  },
  email: {
    type: String,
    require: true
  },
  detail1: {
    type: String,
    require: true
  },
  detail2: {
    type: String,
    require: true
  },
  detail3: {
    type: String,
    require: true
  },
  detail4: {
    type: String,
    require: true
  },
  detail5: {
    type: String,
    require: true
  },
});

module.exports = mongoose.model("transaction", TransactionSchema);