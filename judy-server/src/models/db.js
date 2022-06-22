const mongoose = require('mongoose');
const config = require('../../config/config.json');
const chalk = require('chalk');
const ora = require('ora');

const spinner = ora('Trying to connect to the database ..').start();


mongoose.connect(config.DB_HOST + config.DB_NAME, (err, res) => {
    if(err) return console.log('Database connection error: ' + err);
    spinner.stop();
    console.log(chalk.bgGreen.black('  DONE  '), chalk.green('Connection with database has been established!'));
});

module.exports = mongoose.connection;