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


app.controller('Gallery',function($scope){
	$scope.slickConfig = {
				dots: false,
				infinite: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: true,
				autoplaySpeed: 2000,
				centerMode: true,
				variableWidth: true,
				lazyLoad: 'ondemand'
				
		};
});
















