var MongoClient = require("mongodb").MongoClient;
var url = "mongodb://127.0.0.1:27017/";

MongoClient.connect(url, { useUnifiedTopology: true }, function (err, db) {
    if (err) throw err;

    var dbo = db.db("netflix");

    dbo.collection("ratings").aggregate([
        { $group: { _id: "$movieId", average: { $avg: "$rating" } } },
        {
            $lookup: {
                from: "movies",
                localField: "_id",
                foreignField: "movieId",
                as: "movie"
            }
        },
        { $project: { _id: 0, average: 1, "movie.movieTitle": 1}},
        { $limit: 4 }
    ]).toArray(function (err, res) {
        if (err) throw err;

        // console.log(JSON.stringify(res));
        res.forEach(element => {
            console.log(
                'Title: ' + element.movie[0].movieTitle + '\n' +
                'Average: ' + element.average + '\n'
            );
        });
        db.close();
    });
});