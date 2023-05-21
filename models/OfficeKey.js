var mongoose = require('mongoose');
var mongoose_delete = require('mongoose-delete');

//Define a schema
  var Schema = mongoose.Schema;
  var OfficeKeySchema = new Schema({
    key_name: String,
    short_name: String,
    previous_holder: String,
    current_holder: String,
    last_transfer_date: Date,
    qr_code: {
      // data = deprecated
      data: Buffer,
      data_url: String,
      content_type: String,
    }
  });

  OfficeKeySchema.plugin(mongoose_delete, { overrideMethods: true });

  module.exports = mongoose.model('OfficeKey', OfficeKeySchema );
