var fs = require('fs');

exports.servIndex = function(request, response, headers){
  fs.readFile('../client/index.html', function(err, content) {
    headers['Content-Type'] = "text/html";
    response.writeHead(200, headers);
    response.write(content);
    response.end();
  });
};
exports.filesys = function(request, response, headers){

  fs.readFile('../client' + request.url, function(err, content) {
    headers['Content-Type'] = "application/javascript";
    response.writeHead(200, headers);
    response.write(content);
    response.end();
  });
};