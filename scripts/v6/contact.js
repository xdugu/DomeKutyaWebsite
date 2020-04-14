
var scrollingElement = (document.scrollingElement || document.body);


var app = angular.module('AduguShopApp', []);

app.controller('Contact', ['$scope', 'ApiManager', function($scope, ApiManager) {

	$scope.user = {name:"",email:"", topic: "", comments:"", requestType:"Request"};
	$scope.backbone = {lang: Common_getLang(), formSubmitted: false, submitError: false};
	
	$scope.config;
	$scope.$on('$includeContentLoaded', function () {
		Shop_refreshBasket();
	});

	Common_getShopConfig().then(function(res){
		$scope.config = res;
		$scope.user.storeId = $scope.config.storeId;
	})
	let generalTopic = {en:"General", hu:"Általános"}
	let params = Common_parseUrlParam();
	if(!params.hasOwnProperty('topic')){
		$scope.user.topic = generalTopic[$scope.backbone.lang];
	} else
		$scope.user.topic = params.topic;
	
	$scope.sendRequest = function(){
		$scope.backbone.formSubmitted = false;
		$scope.backbone.submitError = false;

		ApiManager.post('open', 'create/request', {storeId: $scope.config.storeId}, $scope.user).then(function(){
			$scope.backbone.formSubmitted = true;
		}).catch(function(err){
			$scope.backbone.submitError = true;
		})
	}
}]);


	
	





