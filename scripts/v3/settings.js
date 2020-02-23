
  
var app = angular.module('AduguShopApp', []);
app.controller('Settings', function($scope) {

//getting a reference to these files so I can check later when both are loaded
t=localStorage.getObj("useCookie");
if(t==true)
	$scope.cookie=true;//for choosing of language	
else 
	$scope.cookie=false;

$scope.changeCookie= Common_changeCookie;


});

	



	