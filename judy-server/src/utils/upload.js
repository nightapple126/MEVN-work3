const uuid = require('uuid/v1');

function upload(imageToUpload, dir, callback) {
    const filename =
      uuid() +
      "." +
      imageToUpload.mimetype.substr(imageToUpload.mimetype.indexOf("/") + 1);
      console.log(__dirname + "/../../" + dir + filename);
        imageToUpload.mv(__dirname + "/../../" + dir + filename,
        err => {
        if (err) callback(err, null);
        callback(null, filename);
        });
}

module.exports.upload = upload;
    