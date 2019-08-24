var mongoose = require('mongoose');

//Define a schema
  var Schema = mongoose.Schema;
  var TransferSchema = new Schema({
    key_id: String,
    key_name: String,
    previous_holder: String,
    next_holder: String,
    transfer_date: Date,
    ip_address: String,
  });

  module.exports = mongoose.model('Transfer', TransferSchema );
