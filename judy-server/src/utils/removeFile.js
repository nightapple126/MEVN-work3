const fs = require('fs');
const config = require('../../config/config.json');

module.exports.deletePlateImage = function (filename) {
    fs
    .unlink(__dirname + '/../../' + config.UPLOAD_PLATE_PATH + filename, (err) => {
        console.log(err);
    });
};