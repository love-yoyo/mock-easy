const nedb = require('nedb');
const path = require('path');

const db = new nedb({
    filename: path.join(__dirname, '../db-data/api.db'),
    autoload: true
});

exports.addApi = (model, cb) => {
    db.insert(model, (err, ret) => {
        cb(err, ret);
    })
};

exports.removeApi = (url, cb) => {
    db.remove({ url }, { multi: true }, (err, ret) => {
        cb(err, ret);
    })
};

exports.findApi = (url, cb) => {
    console.log(url);
    db.findOne(url, (err, ret) => {
        cb(err, ret);
    })
};