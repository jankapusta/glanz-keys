var mongoose = require('mongoose');

//Define a schema
  var Schema = mongoose.Schema;
  var OfficeKeySchema = new Schema({
    key_name: String,
    previous_holder: String,
    current_holder: String,
    last_transfer_date: Date,
  });

  module.exports = mongoose.model('OfficeKey', OfficeKeySchema );
