//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}
products =  null;
			
var currentProductId;

 

var app = angular.module('AduguShopApp', ['slickCarousel']);


app.controller('Gallery',['$scope', 'ApiManager', function($scope, ApiManager){
	$scope.backbone = {lang: Common_getLang()}
	$scope.removeExtension = Common_removeExtension;

	$scope.$on('$includeContentLoaded', function () {
		Shop_refreshBasket();
	});

	$scope.galleryImages = null;
	
	$scope.slickConfig = {
				dots: false,
				infinite: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: false,
				centerMode: true,
				variableWidth: true,
				lazyLoad: 'ondemand'
				
		};
	
	Common_getShopConfig().then(
		function(config){
			$scope.config = config;
			ApiManager.get('open', 'get/product', {itemId: 'Vasarloi-kepek', storeId: 'KutyaLepcso'}).then(function(res){
				$scope.galleryImages = res.data.data.Images;
			}).catch(function(err){
				console.log(err);
			});
		}
	)
}]);
















