/**
 * Created by user on 23/10/2016.
 */

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var request = require('request');
var bodyParser = require("body-parser");
var express = require('express');
var cors = require('cors');
var app = express();
var path = require('path');
var http = require('http').Server(app);
//MongoDB URL
var url = 'mongodb://root:Tuthano1o1o@ds235243.mlab.com:35243/cs5551icp';
//var url = 'mongodb://marmik:2621@ds051923.mlab.com:51923/demo';
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/register', function (req, res) {
    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        if (client == null){
            console.log("CLIENT IS NULL");
        }
        //cs5551icp is my MongoDB database that holds all the records of the students
        const db = client.db('cs5551icp');

        //insertDocument is called with req.body as a parameter that contains all the necessary fields
        //(input from user) and will immediately call the insert() function from the MongoDB database
        //To proceed with the insertion
        insertDocument(db, req.body, function() {
            client.close();
            console.log("IN CALLBACK!")
            res.write("Successfully inserted");
            res.end();
        });
    });
});
var insertDocument = function(db, data, callback) {
    //Since insertOne() is an asynchronous function, it is important to make a callback function for it.
    //callback() will be called as soon as the insertion has finished
    //callback() method will simply close the database client, and finalize
    //the response stream of the Express Server
    db.collection('users').insertOne( data, function(err, result) {
        if(err)
        {
            res.write("Registration Failed, Error While Registering");
            res.end();
        }
        console.log("Inserted a document into the users collection.");
        callback();
    });
};
app.post('/search', function (req, res) {

    MongoClient.connect(url,{ useNewUrlParser: true }, function(err, client) {
        if(err)
        {
            res.write("Failed, Error while connecting to Database");
            res.end();
        }
        if (client == null){
            console.log("CLIENT IS NULL");
        }
        //cs5551icp is my MongoDB database that holds all the records of the students
        const db = client.db('cs5551icp');
        //FinduserbyMajor is the function that takes the req.body (result from the form)
        //to pass to the mongoDB instance as an query entry for comparison and searching.
        findUserbyMajor(db, req.body, function(resultobj) {
            console.log("IN CALLBACK!");
            client.close();
            console.log(resultobj);
            var JSONResult = JSON.stringify(resultobj);
            res.write(JSONResult);
            res.end();
        });

    });
});

var findUserbyMajor = function(db, data, callback) {
    var cursor = db.collection('users').find({"major": data.sCourse});
    //To Array is an asynchronous function that turns all the cursors (documents) into an array
    //The function that succeeds toArray() is a callback method with result as the retrieved data.
    cursor.toArray(function(err, result){
        // Here you can do something with your retrieved data;
        var resultobj = result;
        callback(resultobj);
    })
}

///////////////////From ICP 10
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.get("/home", function(req, res)
{
    res.sendFile(path.join(__dirname,'public', 'home.html'));
});
app.get("/index", function(req, res)
{
    res.sendFile(path.join(__dirname,'public', 'index.html'));
});
app.post('/getDistance', function (req, res) {
    var origin = req.body.origin;
    var destination = req.body.destination;
    var result={
        'location': []
    };
    var name = 'hello';

    //res.render(__dirname + "/index.html", {name:name});

    console.log("In restDistance " + origin + destination);
    request('https://maps.googleapis.com/maps/api/distancematrix/json?' +
        'language=en&units=imperial' +
        '&origins=' + origin +
        '&destinations=' + destination +
        '&key=AIzaSyB087vg5c4hTnohVi4sjP63cHv4Eh3jt2s', function (error, response, body) {
        //Check for error
        if(error){
            return console.log('Error:', error);
        }

        //Check for right status code
        if(response.statusCode !== 200){
            return console.log('Invalid Status Code Returned:', response.statusCode);
        }
        //All is good. Print the body
        body = JSON.parse(body);
        var loc = body.rows[0].elements; //first item of rows in JSON file
        //console.log(loc.elements[0].distance.text);
        //console.log(body.destination_addresses[0]);
        //console.log(loc.length);
        for(var i=0;i<loc.length;i++)
        {
            result.location.push({'distance': loc[i].distance.text,
                'duration':loc[i].duration.text.toString()});
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        var loc = body.rows[0].elements; //first item of rows in JSON file
        for (var i = 0; i < loc.length; i++) {
            var cost = parseInt(loc[i].duration.text.toString().substr(0,1))*5.55;
            result.location.push({
                'distance': loc[i].distance.text,
                'duration': loc[i].duration.text.toString(),
                'charge': cost
            });
        }
        JSONResult = JSON.stringify(result);
        console.log(JSONResult);
        for (var i = 0; i<result.location.length; i++){
            console.log("\nThe Distance is: " + result.location[i].distance);
            console.log("\nThe Time is: " + result.location[i].duration);
        }
        res.write(JSONResult);
        res.end();
    });
    console.log(result);


});

///////////////////////This is used to deploy to Heroku//////////////////
var port = process.env.PORT || 8080;
var server = http.listen(port, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port)
})