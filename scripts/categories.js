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
	$scope.currency = "EUR";
	
	
	/////////////////////////////////
	let category = Common_getUrlParam("category=")
	$http.get('https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v1/Request/Category?category='+ category).then(function(res){
		$scope.categoryData = res.data;
		
		
		for(let i=0; i< $scope.categoryData.length;i++){
		let product = {description:"",price:"",imgSrc:"",href:"",imgPref:""};
		if($location.absUrl().search('/en/')>0)
			product.description = $scope.categoryData[i].Description.en;
		else 
			product.description = $scope.categoryData[i].Description.hu;
			
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
	
		getProductPath();
	
	
	


});

//this function is called to get the search string rquired for xpath xml query and will also set the header
//depending on the language
function getProductPath()
{
	let pathname = window.location.href.toLowerCase();
	
	
	if(pathname.search("steps")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('Lépcsők');
		else 
			$('#category-name').append('Lépcsők');
		categoryName = "steps"
		return "products/steps/item";
	}
	if(pathname.search("ramps")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('Rámpák');
		else 
			$('#category-name').append('Rámpák');
		categoryName = "ramps"
		return "products/ramps/item";
	}
	if(pathname.search("mybulldog")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('My Bulldog');
		else 
			$('#category-name').append('My Bulldog');
		categoryName = "mybulldog"
		return "products/mybulldog/item";
	}
	if(pathname.search("others")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('Bújózsák és Babzsák');
		else 
			$('#category-name').append('Bújózsák és Babzsák');
		categoryName = "Bújózsák és Babzsák"
		return "products/others/item";
	}
	if(pathname.search("behappy")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('BeHappy');
		else 
			$('#category-name').append('BeHappy');
		categoryName = "BeHappy"
		return "products/behappy/item";
	}

	
	
}

















