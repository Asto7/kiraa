const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// create schema
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

 rate:{type:Number,default:0},
 whom:[String],
 tags:[String],
 creationDate:{
  type:Date,
  default:Date.now()
},

});
mongoose.model('FM', fmSchema);
