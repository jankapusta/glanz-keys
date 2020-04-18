const OfficeKey = require("../models/OfficeKey.js");
const fs = require('fs');
module.exports =  () => {
  
  OfficeKey.find(
    {}, 
    'qr_code', 
    function (err, officeKeys) {
      if (err) {
        console.log(err);
        return;
      }
      officeKeys.forEach((officeKey) => {
        let filename = './public/images/qr/' + officeKey.qr_code.filename;
        let buffer = officeKey.qr_code.data;
        if (!filename || !buffer) {
          return;
        }
        fs.writeFile(filename, buffer, "binary", (err) => {
          if(err) {
              console.log(err);
          } else {
              console.log("The file " + filename + "was saved");
          }
        });
      });
    });

}