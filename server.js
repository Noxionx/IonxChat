var express = require('express');
var app = express();

require("./authentication.js")(app)

app.use(express.static('web'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Started Ionx Chat at http://%s:%s', host, port);

});