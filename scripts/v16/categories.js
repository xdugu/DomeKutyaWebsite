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
	$scope.backbone = {lang:null, categoryName: "Categories"};	
	$scope.changeLanguage = Common_changeLanguage;
	$scope.removeExtension = Common_removeExtension;

	$scope.$on('$includeContentLoaded', function () {
		Shop_refreshBasket();
	});

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
		
		// only get enabled items
		$scope.categoryData = $scope.categoryData.filter(item => item.Enabled);

		let level = params.category.split('>');

		for(let i = 0; i < $scope.categoryData.length; i++){
			let index = $scope.categoryData[i].StoreId.indexOf('>');
			let actualStoreId = $scope.categoryData[i].StoreId;

			if(index >= 0)
				actualStoreId = actualStoreId.substring(0, index);

			$scope.categoryData[i].href = 'itemId=' + $scope.categoryData[i].ItemId + '&storeId=' + actualStoreId;
			let custom = CommonFuncs.getMeta($scope.categoryData[i], 'custom');
			$scope.categoryData[i].isCustom = custom != null;
		}
		
		// looping through the product hierarchy to get the displayable name of the category
		let category;
		ApiManager.get('open', 'get/settings', {storeId: params.storeId, get: 'ProductHierarchy'}).then((res)=>{
			category = res.data.ProductHierarchy.find(item => item.name == level[0]);
			for(let i = 1; i < level.length; i++){
				category = category.sub.find(item => item.name == level[i]);
			}

			$scope.backbone.categoryName = category.text;
		
			// Replace title with category name
			document.title = category.text[$scope.backbone.lang];
		});

				
	});


}]);