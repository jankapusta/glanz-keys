const QRCode = require("qrcode");

module.exports = (officeKey, callback) => {

    const urlPrefix = 'https://glanz-berlin.de/k?id=';
    return QRCode.toDataURL(urlPrefix + officeKey._id.toString(), {
        type: 'png',
        width: 1024,
        height: 1024,
        margin: 1,
    }).then(imageDataUrl => {
        officeKey.qr_code.data_url = imageDataUrl;
        callback(officeKey);
    });
}