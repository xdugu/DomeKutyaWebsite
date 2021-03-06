if ('serviceWorker' in navigator) {
  // Service Worker isn't supported on this browser, disable or hide UI.
  window.addEventListener('load', () => {
	navigator.serviceWorker.register('/service-worker.js');
  });
}

$(document).ready(function() {    
	$('#landing_text').animate({'opacity':'1'}, 3000)
  	$('#landing_img').toggleClass('animate');
});
  
var app = angular.module('AduguShopApp', ['slickCarousel', 'ngSanitize']);
app.controller('HomePage', ['$scope','ApiManager', function($scope, ApiManager) {

//getting a reference to these files so I can check later when both are loaded
$scope.backbone = {lang : Common_getLang()};
$scope.changeLanguage = Common_changeLanguage;
$scope.removeExtension = Common_removeExtension;
$scope.config = null;
$scope.products = [];
$scope.currency = null;
$scope.slickConfig = {
	dots: false,
	infinite: false,
	slidesToShow: 1,
	slidesToScroll: 1,
	autoplay: true,
	autoplaySpeed: 4000,
	centerMode: true,
	variableWidth: true,
	lazyLoad: 'ondemand'
};

$scope.galleryImages = null;

$scope.$on('$includeContentLoaded', function () {
    Shop_refreshBasket();
});

Common_getShopConfig().then(
 function(config){
	let shopData = localStorage.getObj("shopping");
	if(shopData == null){
		$scope.currency = config.shopping.currency;	
	}else{
		$scope.currency = shopData.currency;
	}
	 $scope.config = config;
	 ApiManager.get('open', 'get/product', {itemId: 'Vasarloi-kepek', storeId: 'KutyaLepcso'}).then(function(res){
		$scope.galleryImages = res.data.data.Images;
	 }).catch(function(err){
		console.log(err);
	 });
 }
)

//we are loading the ids of the products we want to display on the homepage

	
}]);



	