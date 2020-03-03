//This script is mainly called by the "Shopping" pages like Shop, basket and order confirmation

//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}


var app = angular.module('AduguShopApp',[]);
app.controller('Basket', ['$scope', 'ApiManager', function($scope, ApiManager) {
	$scope.basketId = localStorage.getObj("basketId");
	$scope.shopping= localStorage.getObj("shopping");
	$scope.currency = $scope.shopping.currency;
	$scope.backbone = {lang:null, loading: false};
	$scope.couriers = [];
	$scope.backbone.lang= $scope.shopping.contact.lang;//for choosing of language
	
	if($scope.basketId==null || $scope.basketId=="" || $scope.basketId.length<2){
		$scope.order=null;
		return;
	}
	// Get config for app specific stuff
	Common_getShopConfig().then(function(res){
		$scope.config = res;

		$scope.backbone.loading = true;
		ApiManager.post('open', 'get/basket', null, {
				basketId:$scope.basketId, 
				storeId: $scope.config.storeId, 
				countryCode:Shop_getCountryCode($scope.shopping.contact.country), 
				currency:$scope.currency }).then(function(res){
					$scope.backbone.loading = false;
					$scope.order = res.data;
					Shop_updateBasketSize($scope.order.Items.length);
					if($scope.order.hasOwnProperty('Costs')){
						$scope.couriers = Object.keys($scope.order.Costs);
						$scope.shopping.deliveryMethod = $scope.couriers[0];
					}
				}).catch(function(err){
					Shop_updateBasketSize(0);//Probably the basket could not be found
				});
	});
		
	// Called to change quantity of item
	$scope.changeQuantity= function (index, direction){
		if($scope.order.Items[index].Quantity + direction>=1){
			Shop_updateBasketSize($scope.order.Items[index].Quantity + direction);

		ApiManager.post('open', 'update/basket/quantity', null, {
				basketId:$scope.basketId, 
				storeId: $scope.config.storeId, 
				index: index, 
				increment: direction, 
				countryCode:Shop_getCountryCode($scope.shopping.contact.country),
				currency:$scope.currency
			}).then(function(res){
					$scope.order = res.data;
			});
		}
	}
	
	//called to remove item from basket 
	$scope.removeItem = function(index)
	{
		$scope.order.Items.splice(index,1);//pre splice the removed item to make the ui seem for responsive
		ApiManager.post('open', 'update/basket/remove', null, {
				basketId:$scope.basketId, 
				storeId: $scope.config.storeId, 
				index: index, 
				countryCode: Shop_getCountryCode($scope.shopping.contact.country), 
				currency:$scope.currency
			}).then(function(res){
					$scope.order = res.data;
					Shop_updateBasketSize($scope.order.Items.length);
			});
	}
	
	//called when customer chooses/changes the Country to post 
	$scope.updateDeliveryCost = function()
	{
		ApiManager.post('open', 'get/basket', null, {
			basketId:$scope.basketId, 
			storeId: $scope.config.storeId,  
			countryCode: Shop_getCountryCode($scope.shopping.contact.country), 
			currency:$scope.currency
		}).then(function(res){
			$scope.order = res.data;
			Shop_updateBasketSize($scope.order.Items.length);
			$scope.shopping.contact.countryCode = Shop_getCountryCode($scope.shopping.contact.country);
			$scope.couriers = Object.keys($scope.order.Costs);
			$scope.shopping.deliveryMethod = $scope.couriers[0];
			$([document.documentElement, document.body]).animate({
				scrollTop: $("#cost-details").offset().top
			}, 1000);
		});
	}

	$scope.proceedToCheckout = function(){
		localStorage.setObj("shopping", $scope.shopping);
		window.location.href = 'Checkout.html';
	}


	// will return the most appropriate image to be displayed
	$scope.getVariantImage = function (item){
		 let itemCombi = [];

		 item.Combination.forEach(function(combi){
			 itemCombi.push(combi.name);
		 });

		 for(let i = 0; i <  item.Variants.combinations.length; i++){
			 let combi = item.Variants.combinations[i];
			if(JSON.stringify(combi.combination) == JSON.stringify(itemCombi) &&
				combi.linkedImage != null){
				return combi.linkedImage;
			}
		 }

		 return item.Images.list[0].name;
	}
}]);





