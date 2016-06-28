"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardCtrl", dashboardCtrl)

function dashboardCtrl($stateParams, $scope, Application, $timeout, $state, store, $location, GoogleCalendarServices, DashboardServices) {
    console.log("dashboardCtrl loaded");
    $scope.newApplication = {};
    $scope.applications = $scope.currentUser.applications.reverse();
    let todayDate = moment(Date.now());
    let applicationDefaultDate = new Date().toISOString().split("T")[0];
    let expectedInitialDefaultDate = moment(applicationDefaultDate).add(7, 'day')._d.toISOString().split("T")[0];
    $scope.newApplication.applicationDate = new Date(applicationDefaultDate);
    $scope.newApplication.expectedInitialResponse = new Date(expectedInitialDefaultDate);
    // .toISOString().split("T")[0];
    $scope.newApplicationSubmitted = () => {
        console.log($scope.newApplication);
        console.log($scope.newApplication.applicationDate);
        console.log($scope.newApplication.expectedInitialResponse);

        Application.createOneApplication($scope.newApplication, $scope.currentUser._id).then(afterNewAppRes => {
            console.log("Response after new narrative creation: ", afterNewAppRes);
            let calendarEntry = {
                parentNarrativeId: afterNewAppRes.data.newApplication._id,
                newEndDate: afterNewAppRes.data.newApplication.expectedInitialResponse.slice(0, 10),
                newStartDate: afterNewAppRes.data.newApplication.expectedInitialResponse.slice(0, 10),
                description: `Initial follow up with ${afterNewAppRes.data.newApplication.company} regarding ${afterNewAppRes.data.newApplication.position}`,
                title: `Initial F/U re: ${afterNewAppRes.data.newApplication.position} at ${afterNewAppRes.data.newApplication.company}`
            };
            console.log('calendarEntry: ', calendarEntry);
          GoogleCalendarServices.calendarNewEvent(store.get("googleAPIAccess"), store.get("currentUserMId"), calendarEntry)
                .then((res) => {
                    console.log("response after calendar: ", res);
                    $state.go('application', {
                        applicationId: afterNewAppRes.data.newApplication._id
                    });
                    $scope.applications.unshift(afterNewAppRes.data.newApplication)
                })
                .catch((error) => {
                    console.log("Error: ", error);
                });
        }, err => {
            console.log('err when creating a new application: ', err);
        })
    };
    GoogleCalendarServices.retrieveEventsFromMongoose(store.get("currentUserMId"), store.get("id_token"))
        .then((response) => {
            console.log("Events data from Mongoose: ", response.data);
            if (response.data.events) {
                $scope.sevenDayForecast = GoogleCalendarServices.create7DayForecast(response.data.events);
                console.log("In controller seven day: ", $scope.sevenDayForecast)
            }
        })
        .catch((error) => {
            console.log("Error from Google Calendar: ", error);
        });

    $scope.takeToNarrative = (narrativeId) => {
        $state.go("application", {
            applicationId: narrativeId
        });
    };

    /*GoogleCalendarServices.retrieveEventsFromGoogle(store.get("currentUserMId"), store.get("googleAPIAccess"))
        .then((response) => {
            console.log("Events data from Google Calendar: ", response.data);
            if (response.data.items) {
                $scope.sevenDayForecast = GoogleCalendarServices.create7DayForecast(response.data.items);
                console.log("In controller seven day: ", $scope.sevenDayForecast)
            }
        })
        .catch((error) => {
            console.log("Error from Google Calendar: ", error);
        });*/


    $scope.createTime = (time) => {
        // console.log('checked');
        // console.log('time: ', time);
        return moment(time).calendar(null, {
            sameDay: 'h:mm a, [Today]',
            nextDay: 'h:mm a, [Tomorrow]',
            nextWeek: 'dddd',
            lastDay: 'h:mm:ss a, [Yesterday]',
            lastWeek: 'h:mm:ss a, ddd. MMMM Do YYYY',
            sameElse: 'MM/DD/YY'
        });
    };

    $scope.options = {
        chart: {
            type: 'discreteBarChart',
            height: 450,
            margin: {
                top: 20,
                right: 20,
                bottom: 60,
                left: 55
            },
            x: function(d) {
                return d.label;
            },
            y: function(d) {
                return d.value;
            },
            showValues: true,
<<<<<<< HEAD
            valueFormat: function(d){
                return d3.format('d')(d);
=======
            valueFormat: function(d) {
                return d3.format(',.4f')(d);
>>>>>>> master
            },
            transitionDuration: 500,
            xAxis: {
                axisLabel: 'X Axis'
            },
            yAxis: {
                axisLabel: 'Y Axis',
                axisLabelDistance: 30
            }
        }
    };

    let appCount = 0, appDateArr = [], appDate;

    DashboardServices.getDS3ChartUser($scope.currentUser._id)
        .then(res => {
            appCount = res.data.applications.length;
            appDate = res.data.applications;

            var count = 0;
            var objArr = [];
            appDate.map( c => {

                var isExist = appDateArr.some( c2 => {
                    if ( c.applicationDate.slice(0, 10) ==  c2 ) {
                        // count++;
                        return true;
                    }
                });

                if (!isExist) {
                    appDateArr.push(c.applicationDate.slice(0, 10));
                    count++;

                } else {
                    count++;
                }

                // count++;
                obj = {
                    "label" : c.applicationDate.slice(0, 10),
                    "value": count
                }

                console.log('count', count);

                objArr.push(obj);
            })

            var obj = {
                // "label": appDateArr,
                // "value": appCount
            };

            console.log('objArr', JSON.stringify(objArr));

            appChart(objArr);
        })
        .catch((error) => {
            console.log("Error from DS3 Calendar: ", error);
        });

    // function appChart(appCount, obj) {
    function appChart(objArr) {
        // console.log('appCountappCountappCountappCount', appCount);
        $scope.data = [{
            key: "Cumulative Return",
            // values: [
            //     { "label" : "2016-06-27" , "value" : appCount },
            //     { "label" : "2016-06-28" , "value" : appCount }
            // ]
            values: objArr
        }]
    }

}

/*
googleCalendarData = {
    calendarId: "",
    calendarEvents: []
};*/
