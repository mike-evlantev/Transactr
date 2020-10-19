const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
  // A document has an associated user and transaction 
  user: {
    type: mongoose.Schema.Types.ObjectId, // mongoose Object Id for user's Id
    ref: 'users'                          // refer to specific collection 'users'
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId, // mongoose Object Id for transaction's Id
    ref: 'transactions'                          // refer to specific collection 'transactions'
  },
  name: {
    required: true,
    type: String,
  },
  description: {
      required: true,
      type: String,
  },
  format: {
      required: true,
      type: String,
  },
  recipient: {
    required: false,
    type: String,
  },
  date: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model("document", DocumentSchema);