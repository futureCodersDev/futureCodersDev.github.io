var app = angular.module("myApp", []);

//controller for menu items on home page
app.controller("menuCtrl", function($scope, $http) {
    //initialising the subject list
    $http.get("/subjectList")
	.then(function(response) {
	    console.log(response.data.subjList);
        $scope.subjectList = response.data.subjList;
    });
    $scope.expand = false;
    $scope.expandSub = false;
    $scope.hasTopics = function(subject){
        return !subject.topics.length > 0;
    }
    $scope.hasSubTopics = function(topic){
        return !topic.subtopics.length > 0;
    }
    $scope.hasActivities = function(subtopic){
        return !subtopic.activities.length > 0;
    };
    $scope.showProgress = function(subtopic){
        $scope.activities = subtopic.activities;
    };
    $scope.showActivities = function(){
        if($scope.activities != null){
            if($scope.activities.length > 0)
                return true;
        }
        return false;
    };
    $scope.currentActivity = null;
    $scope.activitySelected = false;

    $scope.setCurrentActivity = function(activity){
        $scope.activitySelected = true;
        if(activity.activityType == "QUIZ"){
        }
        else if(activity.activityType == "VIDEO"){
            var vidHttpString = "/vidResource?resourceID=" + activity.activityName;
            $http.get(vidHttpString)
            .then(function(response) {
                $('#activityContent').empty();
                $('#feedbackArea').empty();
                $('#activityContent').html(response.data.embedText);
                activity.description = response.data.embedText;
            });

        }
        else if(activity.activityType == "PASTPAPER"){
            var ppqHttpString = "/ppqResource?resourceID=" + activity.activityName;
            $http.get(ppqHttpString)
            .then(function(response) {
                $('#activityContent').empty();
                $('#feedbackArea').empty();
                $('#activityContent').html(response.data.questionText);
                activity.description = response.data.questionText;
            });
        }
        else {
            alert("No resource available");
        };
        $scope.currentActivity = activity;
    };

    $scope.submitActivity = function(answer) {
        switch($scope.currentActivity.activityType){
            case "QUIZ":
                break;
            case "VIDEO":
                var vidHttpString = "/vidResult?resourceID=" + $scope.currentActivity.activityName + "&answer=" + answer;
                $http.get(vidHttpString)
                .then(function(response) {
                    console.log("Feedback for " + response.data.resID + " " + response.data.feedback);
                    $('#feedbackArea').append("<p>" + response.data.feedback + "</p>");
                });
                break;
            case "PASTPAPER":
                var ppqHttpString = "/ppqResult?resourceID=" + $scope.currentActivity.activityName + "&answer=" + answer;
                $http.get(ppqHttpString)
                .then(function(response) {
                    console.log("Feedback for " + response.data.resID + " " + response.data.feedback);
                    $('#feedbackArea').html("<p>" + response.data.feedback + "</p>");
                });
                break;
            default:
                alert("No resource available");
        }
    }
});
