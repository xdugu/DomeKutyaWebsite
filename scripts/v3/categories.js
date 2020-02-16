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
	let params = Common_parseUrlParam();
	$http.get('https://h0jg4s8gpa.execute-api.eu-central-1.amazonaws.com/v1/open/get/category?category='
			 + params.category + '&storeId='+ params.storeId + '>Product').then(function(res){
		$scope.categoryData = res.data;
		$scope.lang = 'hu';
		$scope.cur= 'huf';

		let level = $scope.categoryData[0].Category.split('>');

		for(let i = 0; i < $scope.categoryData.length; i++){
			$scope.categoryData[i].Images.list.forEach(function(img, index){
				//checking aspect ratio to work out how to display image
				if(img.width/img.height < 0.9)
					$scope.categoryData[i].Images.list[index].sizing = "height";
				else
					$scope.categoryData[i].Images.list[index].sizing = "width";

			});
			$scope.categoryData[i].href = 'itemId=' + $scope.categoryData[i].ItemId + '&storeId=' + $scope.categoryData[i].StoreId;

		}
		
		$('#category-name').append(level[level.length -1]);
			
		
	});
	

	


});



















