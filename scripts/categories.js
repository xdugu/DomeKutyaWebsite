//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}


var categoryName="steps";

var app = angular.module('myApp', ['ngSanitize']);
app.controller('Categories', function($scope, $http, $timeout, $location) {
	$scope.products=[];
	//Language stuff
	$scope.backbone = {lang:null};
	$scope.backbone.lang= localStorage.getObj("lang");//for choosing of language	
	$scope.changeLanguage = Common_changeLanguage;
	$scope.currency = localStorage.getObj("shopping").currency;
	
	
	/////////////////////////////////
	let category = Common_getUrlParam("category=")
	$http.get('https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v1/Request/Category?category='+ category).then(function(res){
		$scope.categoryData = res.data;
		
		if($location.absUrl().search('/en/')>0)//Using Category info on first item
			$('#category-name').append($scope.categoryData[0].CategoryName.en);
		else
			$('#category-name').append($scope.categoryData[0].CategoryName.hu);
			
		for(let i=0; i< $scope.categoryData.length;i++){
		let product = {description:"",price:"",imgSrc:"",href:"",imgPref:""};
		if($location.absUrl().search('/en/')>0){
			product.description = $scope.categoryData[i].Description.en;
		}
		else {
			product.description = $scope.categoryData[i].Description.hu;
		}
			
			product.price = $scope.categoryData[i].Price.huf;
			
			product.imgSrc = $scope.categoryData[i].Image.location;
			
			product.imgPref = $scope.categoryData[i].Image.imagePref;
			
			product.href = 'ProductPage.html?itemId=' +  $scope.categoryData[i].ItemId;
			 
			
			$scope.products.push(product);
		}
		
		$timeout(function (){		
			if($scope.products[0].imgPref=="width")
			{
				$('.shop_img').css({width:"100%",height:"auto"});
				
			}
		}, 100);
	});
	

	


});



















