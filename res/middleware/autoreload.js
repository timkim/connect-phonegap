<script type="text/javascript">
//
// Reload the app if server detects local change
//
(function() {

    var url = 'http://' + '10.58.135.131:3000' + '/__api__/autoreload';

    function downloadZip(){
        //alert(typeof zip);
        window.requestFileSystem(
            LocalFileSystem.PERSISTENT,
            0,
            function(fileSystem) {
                //alert('file system');
                var fileTransfer = new FileTransfer();
                var uri = encodeURI('http://10.58.135.130:3000' + '/__api__/zip');
    
                fileTransfer.download(
                    uri,
                    fileSystem.root.toURL() + 'app.zip',
                    function(entry) {
                        //alert('got file');
                        console.log("download complete: " + entry.toURL());
                        
                        zip.unzip(fileSystem.root.toURL() + 'app.zip', fileSystem.root.toURL() +'/app', function(statusCode) {
                            if (statusCode === 0) {
                                alert('unzipped');
                                console.log('[fileUtils] successfully extracted the update payload');
                                //window.location.href = fileSystem.root.toURL() +'/app/index.html'; 
                                window.location.reload();
                            }
                            else {
                                console.error('[fileUtils] error: failed to extract update payload');
                                console.log(zipPath, dirPath);
                            }
                        });
                    },
                    function(error) {
                        console.log("download error source " + error.source);
                        console.log("download error target " + error.target);
                        console.log("upload error code" + error.code);
                    },
                    false
                );        
            },
            function(e) {
                callback(e);
            }
        );
    }

    function postStatus(){
        var xhr = new XMLHttpRequest;
        xhr.open('post', url, false);
        xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && /^[2]/.test(this.status)) {
            }
        }
        xhr.send();
    }

    function checkForReload(){
        var xhr = new XMLHttpRequest;
        xhr.open('get', url, true);
        xhr.setRequestHeader('X-Requested-With','XMLHttpRequest');
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && /^[2]/.test(this.status)) {
                var response = JSON.parse(this.responseText);
                if (response.content.outdated) {
                    postStatus();
                    downloadZip();
                    //window.location.reload();
                    // for content sync - initiate file transfer then reload
                }
            }
        }
        xhr.send();
    }

    setInterval(checkForReload, 1000 * 3);
})(window);
</script>
