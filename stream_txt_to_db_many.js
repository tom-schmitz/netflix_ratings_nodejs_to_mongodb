var fs = require('fs'), es = require("event-stream"), MongoClient = require("mongodb").MongoClient;

var url = "mongodb://127.0.0.1:27017/";

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    console.time("dbsave");
    var connection = db.db('netflix');

    var movieId;
    var batchSize = 0;
    var ratings = [];
    var s = fs.createReadStream('Files/combined_data_1.txt')
        .pipe(es.split())
        .pipe(es.mapSync(function (line) {
            batchSize++;

            if (line.includes(':')) {
                movieId = (line.split(':'))[0];
                return;
            }

            line = line.split(',');
            ratings.push({
                movieId: parseInt(movieId),
                UserId: parseInt(line[0]),
                rating: parseInt(line[1]),
                date: new Date(line[2])
            });

            if (batchSize % 100000 == 0) {
                connection.collection('ratings').insertMany(ratings);
                batchSize = 0;
                ratings = [];
            }
        }).on('error', function (err) {
            console.log('Error while reading file.', err);
            db.close();
        }).on('end', function () {
            if (Array.isArray(ratings) && ratings.length) {
                connection.collection('ratings').insertMany(ratings);
                batchSize = 0;
                ratings = [];
            }
            console.log('File read completed');
            db.close();
            console.timeEnd("dbsave");
        }));
});