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
    $scope.lookupInfo = function () {
        /*Besides using the search widget, the Knowledge Graph API can also be used to query for a specific item
        or a list of items and retrieve more detailed information about that item. In this function, the item ID is passed
        down by the selectHandler() function of the KGSearchWidget in form of a value of a html element named selected ID.
        This selected ID stands for the ID of the item that the user clicked on when he/she is being prompted with a list
        of search results.

        To activate this API, an API key is needed. For my account it is: AIzaSyB087vg5c4hTnohVi4sjP63cHv4Eh3jt2s

        After accessing the API successfully with itemID and proper API key, the user will retrieve a JSON file with all the necessary
        information about that particular item, including name, image, url, description, website, detailedDescription.

        For displaying, I only used 4 attributes: name, description, detailedDescription, and imgUrl in the report.
        */


        var service_url = 'https://kgsearch.googleapis.com/v1/entities:search'; //main URI
        var params = {
            'ids': document.getElementById("selectedID").innerHTML,
            'indent': true,
            'key': 'AIzaSyB087vg5c4hTnohVi4sjP63cHv4Eh3jt2s'
        };
        $.getJSON(service_url + '?callback=?', params, function (response) {
            $.each(response.itemListElement, function (i, element) {
                /*Stage is the html left blank in the beginning of session
                It will be replaced as soon as the user clicks on an item or a new item
                */
                $('.stage').css('background-color', 'lightpink');
                $.html('');
                $('<div>', {text: element['result']['name']}).appendTo('.stage');
                $('<div>', {text: element['result']['description']}).appendTo('.stage');
                $('<div>', {text: element['result']['detailedDescription']['articleBody']}).appendTo('.stage');
                $('#img').attr('src',imgurl); //this will add/modify the image source that will be displayed within the page.
            });
        });
    };

} );


