var mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

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

  TransferSchema.plugin(mongoose_delete, { overrideMethods: true });

  module.exports = mongoose.model('Transfer', TransferSchema );
