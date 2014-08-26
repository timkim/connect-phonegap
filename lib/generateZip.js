/*!
 * Module dependencies.
 */
 
var archiver = require('archiver'),
    fs = require('fs'),
    path = require('path');

/**
 * Generates the zips of each of the Cordova versions and platforms
 *
 *
 * Arguments:
 * 
 *
 * Return:
 *
 *
 * Example:
 *
 *
 */
     
module.exports = function(options, version, platform, id){
    // perhaps write this to memory rather than file location???
    var cordovaDir = path.join(
                __dirname,
                '../res/middleware/cordova',
                version, 
                platform
            );

    var zipPath = path.join(__dirname, '/../tmp', id);

    if(!fs.existsSync(zipPath)){
        fs.mkdirSync(zipPath);
    }
    
    var output = fs.createWriteStream(zipPath + '/app.zip');
    var archive = archiver('zip');
    
    output.on('close', function () {
        options.emitter.emit('log', 'archived ' + version + ' ' + platform + ' www/: ' + archive.pointer(), 'total bytes');
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
}