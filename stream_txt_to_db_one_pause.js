var fs = require('fs'), es = require("event-stream"), MongoClient = require("mongodb").MongoClient;

var url = "mongodb://127.0.0.1:27017/";

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    console.time("dbsave");
    var connection = db.db('netflix');

    var movieId;
    var s = fs.createReadStream('Files/combined_data_1.txt')
        .pipe(es.split())
        .pipe(es.mapSync(function (line) {
            s.pause();
            if (line.includes(':')) {
                movieId = (line.split(':'))[0];
                s.resume();
                return;
            }

            line = line.split(',');

            connection.collection('ratings').insertOne({
                movieId: parseInt(movieId),
                UserId: parseInt(line[0]),
                rating: parseInt(line[1]),
                date: new Date(line[2])
            });
            s.resume();
        }).on('error', function (err) {
            console.log('Error while reading file.', err);
            db.close();
        }).on('end', function () {
            console.log('File read completed');
            db.close();
            console.timeEnd("dbsave");
        }));
});


//----------------------------------------------------------------------------------------------------------------------

// var myInterface = readline.createInterface({
//     input: fs.createReadStream('Files/combined_data_1.txt')
// });

// var lineno = 0;
// var id;
// //var obj = [];
// myInterface.on('line', function (line) {
//     lineno++;
//     if (line.includes(':')) {
//         id = (line.split(':'))[0];
//         return;
//     }

//     line = line.split(',');
//     var obj = { movieIdentifier: id, userIndentifier: line[0], rating: line[1], date: line[2] };

//     fs.appendFile('Files/combined_data_1.json', JSON.stringify(obj), function (err) {
//         if (err) throw err;
//     });

//     console.log('Line number ' + lineno + ': ' + line);
// }).on('close', function (line) {
//     console.log('done');
// });
