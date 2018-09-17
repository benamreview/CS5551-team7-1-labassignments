/**
 * Created by user on 24/02/2016.
 */
var myapp = angular.module( 'homeModule', ['googleOauth','FacebookProvider'] );

myapp.config( function (TokenProvider) {
    // Demo configuration for the "angular-oauth demo" project on Google.
    // Log in at will!

    // Sorry about this way of getting a relative URL, powers that be.

    var baseUrl = document.URL.replace( '/home.html', '' );
    TokenProvider.extendConfig( {
        clientId: '202317690708-062ts2disvkoi7lfm6strp08updu3n45.apps.googleusercontent.com',
        redirectUri: baseUrl + '/home.html',  // allow lunching demo from a mirror
        scopes: ["https://www.googleapis.com/auth/userinfo.email"]
    } );
} );
myapp.controller( 'homeController', function ($scope, $http,$rootScope,$log, $window, Token, Facebook,$http,$location) {
    $scope.accessToken = Token.get();
    //  https://api.edamam.com/diet?q=chicken&app_id=${YOUR_APP_ID}&app_key=${YOUR_APP_KEY}&from=0&to=3&calories=gte%20591,%20lte%20722&health=alcohol-free
    $scope.foodList = new Array(); //an Array that contains the list of food
    $scope.venueList = new Array();
    $scope.mostRecentReview;
    $scope.selectedTerm;
    $scope.childmethod = function() {
        //This method is used to invoke the method contained within
        //the newController (a child of this parent controller).
        //the event "CallmyNewControllerMethod" is defined within the newController
        $rootScope.$emit("CallmyNewControllerMethod", {message: 'in my new Controller 2'});
    };

    $scope.lookupFood = function () {
        //var end = document.getElementById('endlocation').value;
        //alert( "hello " + $scope.food )
        //var apiLink = 'https://api.nutritionix.com/v1_1/search/' + $scope.food + '?results=0:1&fields=*&appId=33ae3982&appKey=cc0cb03c44bf271c37f372cc64d0d27e';
        //alert("hello " + apiLink);


        //This is the API reference link for Nutritionix.
        //It needs user input value, username, and key in order to return
        //results in JSON format.
        $http.get( 'https://api.nutritionix.com/v1_1/search/' + $scope.food + '?results=0:1&fields=*&appId=33ae3982&appKey=cc0cb03c44bf271c37f372cc64d0d27e')
            .success( function (data1) {
            //This is to make sure if the API returns more than one statistic for food,
            //The website will be able to display all of them as items of an array.
            for (var i = 0; i < data1.hits.length; i++) {
                //alert( data1.hits[i].fields.item_name);
                $scope.foodList[i]= {

                    "name": data1.hits[i].fields.item_name,//Long name of item retrieved in API
                    "serving": data1.hits[i].fields.nf_serving_weight_grams,//Serving Size in Grams
                    "calories": data1.hits[i].fields.nf_calories //number of calories in the food type
                };
            }
        } );
        $scope.childmethod(); //This method will invoke the child method from the newController

    };
    $scope.lookupInfo = function () {

        //alert(document.getElementById("selectedID").innerHTML);
        var imgurl="Hi!";
        var service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
        var params = {
            'ids': document.getElementById("selectedID").innerHTML,
            'indent': true,
            'key': 'AIzaSyB087vg5c4hTnohVi4sjP63cHv4Eh3jt2s'
        };
        $.getJSON(service_url + '?callback=?', params, function (response) {
            $.each(response.itemListElement, function (i, element) {
                $('.stage').css('background-color', 'lightpink')
                $('.stage').html('');
                $('<div>', {text: element['result']['name']}).appendTo('.stage');
                $('<div>', {text: element['result']['description']}).appendTo('.stage');
                $('<div>', {text: element['result']['detailedDescription']['articleBody']}).appendTo('.stage');
                imgurl = element['result']['image']['contentUrl'];
                //alert (element['result']['image']['contentUrl']);
                //alert(element['result']['detailedDescription']['articleBody']);
                $('#img').attr('src',imgurl);
                //alert ("Before" + imgurl);
                //alert ("After " + $scope.imgURL)
            });
        });
        //$scope.imgURL ="Hi!";
        //alert ("After " + $scope.imgURL);
    };

        $rootScope.updateSession = function () {
            //reads the session variables if exist from php
            $rootScope.session = "hello";

        };

    ;

    $rootScope.updateSession();


    // button functions
    $scope.getLoginStatus = function () {
        Facebook.getLoginStatus();

    };

    $scope.login = function () {
        Facebook.login();
    };

    $scope.logout = function () {
        Facebook.logout();
        console.log("inside");
        $rootScope.facebook_id = "";
    };

    $scope.unsubscribe = function () {
        Facebook.unsubscribe();
    };

    $scope.getInfo = function () {
        FB.api( '/' + $rootScope.facebook_id, function (response) {
            console.log( 'Good to see you, ' + response.name + '.' + $rootScope.facebook_id );

        } );
        $rootScope.info = $rootScope.session;

    };


} )
//In order to maintain Separation of Concern, it is recommended to have separate controllers to
//Do their own thing such as music, video, audio, and other categories to
//Avoid cramming all the features of the application into one big chunk of code.
//Therefore, a new controller is necessary for a second API.
//This new controller will be used for Watson's Text-to-Speech API processing based
//on User's search term.
myapp.controller('newController', function($scope,$rootScope) {
    //This method is basically a wrapping method for the one below
    //This will be the main reference point for the parent Controller
    $rootScope.$on("CallmyNewControllerMethod", function(event,param1){
        $scope.myNewControllerMethod(param1);
    });

    //The actual execution/operation happens here as the audio source is actually
    //defined and loaded into the audio ID that is contained within the <div></div>
    //of the new Controller in the HTML file
    $scope.myNewControllerMethod = function(param1) {
        //alert(param1.message);

        var audio = document.getElementById("audio");
        $scope.audiosrc = "https://stream.watsonplatform.net/text-to-speech/api/v1/synthesize?username=a78ae0df-f032-4345-9478-713e3c1b50cb&password=o2AixHuTJjWW&text=" + $scope.food;
        //alert($scope.audiosrc);
        //Every time an audio source is changed, load() method is needed to reload this
        //new source to the element.
        audio.load();
        //Play the audio as soon as it is (re)loaded.
        audio.play();
    }
});


