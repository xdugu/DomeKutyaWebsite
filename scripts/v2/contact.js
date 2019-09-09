
var scrollingElement = (document.scrollingElement || document.body);


var app = angular.module('myApp', []);

app.controller('Contact', function($scope, $http, $timeout) {

	$scope.user = {name:"",email:"", comments:"", requestType:"Request"};
	
	
	$scope.sendRequest = function(){
	
	$http({
				method: 'POST',
				crossDomain : true,
				url: 'https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v2/Request/CustomerRequest',
				data: JSON.stringify($scope.user),
				headers: {'Content-Type': 'application/json'}
			});
	}
});


	
	





