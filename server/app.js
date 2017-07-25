var os = require('os');
var express = require('express');
var bodyParser = require('body-parser');

var config = require('./config');
var response = require('./response');

var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var errorObj = {
    errorCode: '',
    errorMsg: '接口服务不存在',
}

app.all('/amdin/web/*', (req, res) => {
    let originUrl = req.originalUrl;
    let reqPath = req.path;
    console.log('originUrl: ' + originUrl);
    response.findApi(originUrl, (err, ret) => {
        console.log(err);
        console.log(ret);
        if (!err) {
            if (!ret) {
                res.json(errorObj);
                return;
            }
            res.status(ret.status).json(ret.response);
        } else {
            res.json(errorObj);
        }
    });
});

app.all('/admin-api/*', (req, res) => {
    let originUrl = req.originalUrl;
    let body = req.body;
    response.findApi({ url: body.url }, (err, ret) => {
        if (!err) {
            console.log(ret);
            if (ret) {
                res.json({
                    errorCode: '',
                    errorMsg: '接口已经存在'
                });
            } else {
                response.addApi(body, (err, ret) => {
                    if (!err) {
                        console.log(ret);
                        res.json({
                            errorCode: '',
                            errorMsg: '接口添加成功'
                        });
                    }
                })
            }
        }
    })

});

app.all('/mapi/*', (req, res) => {
    let originUrl = req.originalUrl;
    let reqPath = req.path;
    console.log('originUrl: ' + reqPath);
    reqPath = reqPath.replace(/^\/mapi/g, '');
    response.findApi({ url: reqPath }, (err, ret) => {
        console.log(err);
        console.log(ret);
        if (!err) {
            if (!ret) {
                res.json(errorObj);
                return;
            }
            res.status(ret.status).json(ret.response);
        } else {
            res.json(errorObj);
        }
    });
});

var ifaces = os.networkInterfaces();

console.log('start server on: ');
Object.keys(ifaces).forEach(function(dev) {
    ifaces[dev].forEach(function(details) {
        if (details.family === 'IPv4') {
            console.log('    http://' + details.address + ':' + config.port);
        }
    });
});
app.listen(config.port);