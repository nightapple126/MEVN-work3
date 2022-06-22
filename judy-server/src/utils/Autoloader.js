const fs = require('fs');
const router = require('express').Router();


autoload('guest');
autoload('staff');

function autoload(dir) {

    
    fs.readdir(__dirname + '/../routes/' + dir, (err, files) => {
    if (err) console.log(err);
        if (files) {
            files.forEach(file => {
                console.log('/' + dir + '/' + file.replace(".js",""));
                router.use('/' + dir + '/' + file.replace(".js",""), require('../routes/' + dir + '/' + file));
            });
        }
});

}

module.exports = router;