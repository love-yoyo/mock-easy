const db = require('../db');

exports.findApi = (url, cb) => {
    db.findApi(url, cb);
};

exports.addApi = (model, cb) => {
    db.addApi(model, cb);
};