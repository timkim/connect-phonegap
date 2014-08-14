/*!
 * Module dependencies.
 */
 
var archiver = require('archiver'),
    fs = require('fs'),
    path = require('path');
    
module.exports = function(options){
    // this needs to be optimised so badly and put into its own module 
    var output = fs.createWriteStream(process.cwd() + '/app.zip');
    var archive = archiver('zip');
    var cordovaDir = path.join(
                    __dirname,
                    '../../res/middleware/cordova',
                    '3.5.0', 
                    'ios'
                );
                
    output.on('close', function () {
        options.emitter.emit('log', 'archived www/: ' + archive.pointer(), 'total bytes');
    });

    archive.on('error', function(err){
        options.emitter.emit('log', 'error', err);
    });

    archive.pipe(output);
    
    archive.bulk([
        { expand: true, cwd: process.cwd() + '/www', src: ['**/*'] },
        { expand: true, cwd: cordovaDir, src: ['*.js', 'plugins/**/*'] }
    ]);
    
    archive.finalize();

    return function(req, res, next){
        if (req.url.indexOf('/__api__/zip') === 0 && req.method === 'GET') {
            var stream = fs.createReadStream(process.cwd() + '/app.zip');
            stream.pipe(res);
        }else{
            next();
        }
    }
}
