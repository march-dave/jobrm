"use strict";

angular
    .module("jobrmApp")
    .controller("dashboardTasksCtrl", dashboardTasksCtrl)


function dashboardTasksCtrl($stateParams, $scope, Application, $timeout, $state) {
    console.log("dashboardTasksCtrl loaded");
    if ($stateParams.applicationId) {
        console.log('applicationId: ', $stateParams.applicationId);
        Application.getOneApplication($stateParams.applicationId).then(res => {
            console.log('res: ', res.data);
            $scope.application = res.data
        }, err => {
            console.log('err when getting all applications: ', err);
        })
    }
}