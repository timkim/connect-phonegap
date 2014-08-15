/*!
 * Module dependencies.
 */
 
var archiver = require('archiver'),
    fs = require('fs'),
    path = require('path');
    
module.exports = function(options){
    return function(req, res, next){
        if (req.url.indexOf('/__api__/zip') === 0 && req.method === 'GET') {
            var zipPath = path.join(__dirname, '../../res/middleware/cordova', req.session.device.version, req.session.device.platform, 'app.zip');
            var stream = fs.createReadStream(zipPath);
            stream.pipe(res);       
        }else{
            next();
        }
    }
}
