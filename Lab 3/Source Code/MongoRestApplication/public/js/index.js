/**
 * Created by user on 23/10/2016.
 */
var myapp = angular.module('demoMongo',[]);
myapp.run(function ($http) {
    // Sends this header with any AJAX request
    $http.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    // Send this header only in post requests. Specifies you are sending a JSON object
    $http.defaults.headers.post['dataType'] = 'json'
});

//These are the necessary variables in the requirements:
// Class ID, Student's Name, Course Of Study, Major, and Minor
myapp.controller('MongoRestController',function($scope,$http){
    console.log(localStorage.getItem("charge"));
    $scope.tripCharge = localStorage.getItem("charge");
    $scope.tripChargeStr = "$"+ localStorage.getItem("charge");
    // Check browser support
    /*if (typeof(Storage) !== "undefined") {
        // Retrieve
        $("#txt_placeName").val(localStorage.getItem("charge")) ;
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    }*/
    $scope.insertData = function(){
        console.log($scope.formData.classID);
        console.log($scope.formData.sName);
        console.log($scope.formData.course);
        console.log($scope.formData.major);
        console.log($scope.formData.minor);
        //Since formData also contains the variable sCourse which may or may not exist
        //sCourse, even though belonging to another form, is still a part of the formData
        //If formdata is passed instead of a subset dataParams,
        //sCourse will also be inserted into the MongoDB, which should not be the case,
        //because sCourse is only a search term.
        var dataParams = {
            'classID' : $scope.formData.classID,
            'sName' : $scope.formData.sName,
            'course' : $scope.formData.course,
            'major' : $scope.formData.major,
            'minor' : $scope.formData.minor,
            'cost' : $scope.tripCharge
        };
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };

        //This is the dynamically created URL from the Express server with dataParams as
        //its newly created data input from the user.

        //Register will take care of inserting new data to MongoDB and store it there.
        var req = $http.post('/register',dataParams);

        //If the insertion is successful, the server will respond with a success message such as
        //"Inserted Successfully
        req.success(function(data, status, headers, config) {
            console.log("HELLO!");
            $scope.message = data;
            //console.log(data);
        });
        req.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });
    };

    //This method is responsible for finding all the relevant entries that match the input value
    //for attribute "Major" from the user
    //E.g: Computer Science, Marketing, Law, Philosophy, Art, ...
    $scope.searchData = function(){
        console.log($scope.formData.sCourse);
        var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        };

        // /search is defined independently from /register
        var req = $http.post('/search',$scope.formData);
        req.success(function(data, status, headers, config) {
            $scope.message = data;
            console.log("IN SUCCESS");

            //studentList will be used to store the JSON result from the retrieved data of the server
            //and also be passed to the HTML page to display as an Angular directive {{ }}
            $scope.studentList = [];
            for (var i = 0; i < data.length; i++) {
                //All the necessary fields will be extracted and stored in the studentList object that
                //will be displayed in the HTML page
                $scope.studentList[i]= {
                    "id": data[i].classID,
                    "name": data[i].sName,//Long name of item retrieved in API
                    "course": data[i].course,//Serving Size in Grams
                    "major": data[i].major,
                    "minor": data[i].minor//number of calories in the food type
                };
            }
        });

        //If server runs into error. Message will be displayed as failure message: ""
        req.error(function(data, status, headers, config) {
            alert( "failure message: " + JSON.stringify({data: data}));
        });
    };
    paypal.Button.render({
        env: 'sandbox', // Or 'production'
        // Set up the payment:
        // 1. Add a payment callback
        payment: function(data, actions) {
            // 2. Make a request to your server
            return actions.request.post('/my-api/create-payment/')
                .then(function(res) {
                    // 3. Return res.id from the response
                    return res.id;
                });
        },
        // Execute the payment:
        // 1. Add an onAuthorize callback
        onAuthorize: function(data, actions) {
            // 2. Make a request to your server
            return actions.request.post('/my-api/execute-payment/', {
                paymentID: data.paymentID,
                payerID:   data.payerID
            })
                .then(function(res) {
                    // 3. Show the buyer a confirmation message.
                    console.log(res.status);
                    $scope.insertData();
                });
        }
    }, '#paypal-button');
});