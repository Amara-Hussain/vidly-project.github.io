const joi = require("joi");
const mongoose = require("mongoose");

//Create Module
const Customer = mongoose.model(
  "Customer",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
  })
);
function validateCustomer(customer) {
  const schema = joi.object({
    name: joi.string().min(5).max(50).required(),
    phone: joi.string().min(5).max(50).required(),
    isGold: joi.boolean(),
  });
  return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;
