"use strict";

angular
    .module("jobrmApp")
    .controller("mainCtrl", mainCtrl)
    .directive('resizer', function($window) {
        return {
            restrict: 'A',
            link: function(scope, elem, attrs) {
                angular.element($window).on('resize', function() {
                    scope.$apply(function() {
                        scope.isMobile = $window.innerWidth < 600 ? true : false;
                    })
                });
            }
        }
    })


function mainCtrl($scope, $window, auth, $state, store, $location, GmailServices, GoogleCalendarServices, UserService) {
    console.log("mainCtrl loaded");
    $scope.hide = true;
    $scope.toggle = () => {
        $scope.hide = !$scope.hide;
    };
    $scope.toggle_mobile = () => {
        console.log('$window.innerWidth: ', $window.innerWidth);
        if ($window.innerWidth < 642) {
            $scope.hide = !$scope.hide;
        }
    };
    if (store.get("currentUser")) {
        $scope.currentUser = store.get("currentUser")
        console.log("Profile info: ", $scope.currentUser)
    }

    //user sign-in
    $scope.signIn = function() {
        auth.signin({}, function(profile, token) {
            store.set("id_token", token);
            $location.path("/");
            console.log("Profile: ", profile)
            saveUserToModel(profile);
            //$scope.currentUser = profile;
        }, function(error) {
            console.log("Error: ", error);
        })
    };
    //user logout
    $scope.logout = function() {
        auth.signout();
        store.remove("currentUser");
        store.remove("id_token");
        $scope.currentUser = null;
        $window.location.reload();
    };
    //save user to local Schema.
    function saveUserToModel(profile) {
        UserService.savedUser(profile)
            .then(response => {
                console.log('response:', response);
                store.set('currentUser', response.data);
                $scope.currentUser = response.data;
                if ($scope.currentUser) {
                    console.log('$scope.currentUser: ', $scope.currentUser);
                }
            })
            .catch(error => {
                console.log('error:', error);
            });
    }

    if (store.get("profile")) {
        let profileInfo = store.get("profile");
        console.log('profileInfo: ', profileInfo);
        //uncomment to have an automatic call to retrieve a list of the User's messages
        // Was Used to test Gmail Calls/Routes
        GmailServices.retrieveInboxList(profileInfo)
            .then(function(response) {
                console.log('response: ', response);
            })
    }
}


// console.log('$scope.currentUser: ', $scope.currentUser);
//uncomment to have an automatic call to retrieve a list of the User's messages
// Was Used to test Gmail Calls/Routes
/*GmailServices.retrieveInboxList(profileInfo)
    .then(function (response) {


        console.log("Response: ", response.data)
    })
    .catch(function(error) {
        console.log("Error: ", error);
    });*/
/*GmailServices.createNewLabel(profileInfo)
    .then(function (response) {
        console.log("Response", response.data);
    })
    .catch(function (error) {
        console.log("Error: ", error);
    });*/
/* GmailServices.addLabelToEmail(profileInfo)
     .then(function (response) {
         console.log("Response: ", response.data);
     })
     .catch(function (error) {
         console.log("Error: ", error);
     })*/
/*GoogleCalendarServices.createNewCalendar(profileInfo)
    .then(function (response) {
        console.log("Response: ", response);
    })
    .catch(function (error) {
        console.log("Error: ", error);
    })*/
/*GoogleCalendarServices.calendarNewEvent(profileInfo)
    .then(function (response) {
        console.log("Response: ", response);
    })
    .catch(function (error) {
        console.log("Error: ", error);
    });*/
