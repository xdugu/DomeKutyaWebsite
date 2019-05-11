
var app = angular.module('myApp', []);
app.controller('Help', function($scope) {
	$scope.content={showInfo:false, info:""};
	let myPath = window.location.href; 
	if(myPath.search('use-of-personal-data')>=0)
	{
		$scope.content.showInfo=true;
		$scope.content.info='use-of-personal-data';
	}
	else if(myPath.search('contract')>=0)
	{
		$scope.content.showInfo=true;
		$scope.content.info='contract';
	}
	
});













