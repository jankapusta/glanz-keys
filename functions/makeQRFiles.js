const OfficeKey = require("../models/OfficeKey.js");
const makeDataUrl = require("../functions/makeDataUrl.js");
module.exports =  () => {
  
  OfficeKey.find(
    {},
    function (err, officeKeys) {
      if (err) {
        console.log(err);
        return;
      }
      officeKeys.forEach((officeKey) => {
        makeDataUrl(officeKey, (officeKey) => {
          officeKey.save();
        });
      });
    });

}
