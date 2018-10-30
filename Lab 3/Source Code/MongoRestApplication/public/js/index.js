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
    $scope.origin_address = localStorage.getItem("origin");
    $scope.destination_address = localStorage.getItem("destination");
    // Check browser support
    /*if (typeof(Storage) !== "undefined") {
        // Retrieve
        $("#txt_placeName").val(localStorage.getItem("charge")) ;
    } else {
        document.getElementById("result").innerHTML = "Sorry, your browser does not support Web Storage...";
    }*/
    $scope.insertData = function(){
        /*console.log($scope.formData.tName);
        console.log($scope.formData.cName);
        console.log($scope.formData.email);
        console.log($scope.formData.origin);
        console.log($scope.formData.destination);*/
        //Since formData also contains the variable sCourse which may or may not exist
        //sCourse, even though belonging to another form, is still a part of the formData
        //If formdata is passed instead of a subset dataParams,
        //sCourse will also be inserted into the MongoDB, which should not be the case,
        //because sCourse is only a search term.
        var dataParams = {
            'tName' : $scope.formData.tName,
            'cName' : $scope.formData.cName,
            'email' : $scope.formData.email,
            'origin' : $scope.origin_address,
            'destination' : $scope.destination_address,
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
            console.log("in Client's Success function!");
            //$scope.message = data;
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
        console.log($scope.formData.cName);
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
            console.log(data);
            //studentList will be used to store the JSON result from the retrieved data of the server
            //and also be passed to the HTML page to display as an Angular directive {{ }}
            $scope.tripList = [];
            for (var i = 0; i < data.length; i++) {
                //All the necessary fields will be extracted and stored in the studentList object that
                //will be displayed in the HTML page
                $scope.tripList[i]= {
                    "tName": data[i].tName,
                    "cName": data[i].cName,//Long name of item retrieved in API
                    "email": data[i].email,//Serving Size in Grams
                    "origin": data[i].origin,
                    "destination": data[i].destination,//number of calories in the food type
                    "cost": data[i].cost
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
        //Button Style Customization
        style: {
            label: 'pay',
            size:  'responsive',    // small | medium | large | responsive
            shape: 'pill',     // pill | rect
            color: 'blue',      // gold | blue | silver | black
            layout: 'horizontal',
            fundingicons: 'true',
        },
        funding: {
            allowed: [paypal.FUNDING.CREDIT],
            //disallowed: [ paypal.FUNDING.CARD ]
        },
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
                    console.log("Paypal Server's Returned Status: " + res.status);
                    $scope.insertData();
                });
        }
    }, '#paypal-button');
});