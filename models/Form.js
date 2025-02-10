const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  formNo: { type: String, required: true },
  DOB: { type: String, required: true },
  address: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  LastSchoolName:{
    type: String,
    required: true
  },
  markObgained: {
    type: String,
    required: true,
  },
  center: {
    type: String,
    default: "moradabad",
  },
  payment: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  paperDate: {
    type: String,
  },
  class: {
    type: String,
    required: true,
  },
  session: {
    type: Date,
    default: Date.now,
  },
});

const Form = mongoose.model("Form", formSchema);

module.exports = Form;
