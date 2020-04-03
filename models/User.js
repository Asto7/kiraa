const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create schema for codes
const fmSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  },
code:{type:String},
tags:[String],

creationDate:{
  type:Date,
  default:Date.now()
},
});


const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  codes:[fmSchema],
submission:[new Schema({id:String,times:{type:Number,default:0}})]
});

mongoose.model('users', UserSchema);
