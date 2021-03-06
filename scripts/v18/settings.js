
  
var app = angular.module('AduguShopApp', []);
app.controller('Settings', function($scope) {

	$scope.backbone = {lang: Common_getLang(), basketId: localStorage.getItem('basketId')};

	$scope.$on('$includeContentLoaded', function () {
		Shop_refreshBasket();
	});

	//getting a reference to these files so I can check later when both are loaded
	t = localStorage.getObj("useCookie");
	if(t == false)
		$scope.cookie = false;//for choosing of language	
	else 
		$scope.cookie = true;

	$scope.changeCookie= Common_changeCookie;

	// if something goes horribly wrong, we can delete this basket id and start again
	$scope.resetBasketId = function(){
		localStorage.removeItem("basketId");
		$scope.backbone.basketId = '';
	}


});

	



	