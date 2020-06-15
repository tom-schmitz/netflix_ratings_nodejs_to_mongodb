var fs = require('fs'), es = require("event-stream"), MongoClient = require("mongodb").MongoClient;

var url = "mongodb://127.0.0.1:27017/";

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;
    console.time("dbsave");
    var connection = db.db('netflix');

    var firstSkipped = false;
    var batchSize = 0;
    var ratings = [];
    var s = fs.createReadStream('Files/movie_titles.csv')
        .pipe(es.split())
        .pipe(es.mapSync(function (line) {
            batchSize++;
            if (firstSkipped === false) {
                firstSkipped = true;
                return;
            }

            line = line.split(',');
            ratings.push({
                movieId: parseInt(line[0]),
                movieYear: parseInt(line[1]),
                movieTitle: line[2]
            });

            if (batchSize % 1000 == 0) {
                connection.collection('movies').insertMany(ratings);
                batchSize = 0;
                ratings = [];
            }
        }).on('error', function (err) {
            console.log('Error while reading file.', err);
            db.close();
        }).on('end', function () {
            if (Array.isArray(ratings) && ratings.length) {
                connection.collection('movies').insertMany(ratings);
                batchSize = 0;
                ratings = [];
            }
            console.log('File read completed');
            db.close();
            console.timeEnd("dbsave");
        }));
});