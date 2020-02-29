//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}


var categoryName="steps";

var app = angular.module('AduguShopApp', ['ngSanitize']);
app.controller('Categories', ['$scope', 'CommonFuncs', 'ApiManager', function($scope, CommonFuncs, ApiManager) {
	$scope.products = [];
	//Language stuff
	$scope.backbone = {lang:null};	
	$scope.changeLanguage = Common_changeLanguage;
	$scope.CommonFuncs = CommonFuncs


	// Get config for app specific stuff
	Common_getShopConfig().then(function(res){
		$scope.config = res;

		let shopData = localStorage.getObj("shopping");
		if(shopData == null){
			$scope.currency = res.shopping.currency;
			$scope.backbone.lang = res.shopping.contact.lang;//for choosing of language	
		}else{
			$scope.currency = shopData.currency;
			$scope.backbone.lang= shopData.contact.lang;//for choosing of language	
		}
	});
	
	/////////////////////////////////
	let params = Common_parseUrlParam();
	$scope.backbone.loading = true;
	ApiManager.get('open', 'get/category', {'category': params.category, 'storeId': params.storeId + '>Product'}).then(function(res){
		$scope.backbone.loading = false;
		$scope.categoryData = res.data;

		let level = $scope.categoryData[0].Category.split('>');

		for(let i = 0; i < $scope.categoryData.length; i++){
			$scope.categoryData[i].href = 'itemId=' + $scope.categoryData[i].ItemId + '&storeId=' + $scope.categoryData[i].StoreId;
			let custom = CommonFuncs.getMeta($scope.categoryData[i], 'custom');
			$scope.categoryData[i].isCustom = custom != null;
		}
		
		// looping through the product hierarchy to get the displayable name of the category
		let category = $scope.categoryData[0].ProductHierarchy.find(item => item.name == level[0]);
		for(let i = 1; i < level.length; i++){
			category = category.sub.find(item => item.name == level[i]);
		}
		$('#category-name').append(category.text[$scope.backbone.lang]);
			
	});

	
	

	


}]);



















