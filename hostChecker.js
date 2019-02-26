var fs = require('fs');


function checkHostAllowed(host, socket) {
  var res = true;
  fs.readFile('forbidden_hosts.json', function (err, data) {
    if (!err) {
      var json = JSON.parse(data);
      console.log(JSON.stringify(json));
      var i = 0;
      for (i = 0; i < json.length; i++) {
        if (json[i].includes(host)) {
          console.log("Host is forbidden");

          socket.end();
          res = false;
        }
      }
      res = true;
    }
  });
  return res;
}

module.exports.checkHostAllowed = checkHostAllowed;
