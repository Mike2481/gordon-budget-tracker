const mongoose = require("mongoose");
// require mongoose to set schema
const Schema = mongoose.Schema;

const transactionSchema = new Schema(
  // schema to consist of name, value, and date.
  {
    name: {
      type: String,
      trim: true,
      required: "Enter a name for transaction"
    },
    value: {
      type: Number,
      required: "Enter an amount"
    },
    date: {
      type: Date,
      // use date.now for format 
      default: Date.now
    }
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
