var express = require('express');
var app = express();
var path = require('path');

// app.get('/', function (req, res) {
//     res.send('Hello World!')
// });

var port = process.env.PORT || 8000;

app.listen(port, function () {
    console.log('Example app listening on port ' + port + '!')
});

// app.use('/', express.static(__dirname + '/static'));
app.use('/data', express.static(__dirname + '/static/data'));

// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname + '/static/index.html'));
// });

app.use(express.static('static'))