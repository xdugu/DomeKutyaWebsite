//This script is mainly called by the "Shopping" pages like Shop, basket and order confirmation

//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}


var app = angular.module('myApp',[]);
app.controller('Basket', function($scope, $http) {
	$scope.basketId = localStorage.getObj("basketId");
	$scope.shopping= localStorage.getObj("shopping");
	$scope.currency = $scope.shopping.currency;
	$scope.backbone = {lang:null};
	$scope.backbone.lang= $scope.shopping.contact.lang;//for choosing of language
	
	if($scope.basketId==null || $scope.basketId=="" || $scope.basketId.length<2){
		$scope.order=null;
		return;
	}
		
	 $http({
				method: 'POST',
				crossDomain : true,
				url: `https://h0jg4s8gpa.execute-api.eu-central-1.amazonaws.com/v1/open/get/basket`,
				data: JSON.stringify({basketId:$scope.basketId, storeId:'KutyaLepcso', countryCode:Shop_getCountryCode($scope.shopping.contact.country), currency:$scope.currency }),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
					$scope.order = res.data;
					Shop_updateBasketSize($scope.order.Items.length);
			}).catch(function(err){
				Shop_updateBasketSize(0);//Probably the basket could not be found
				//localStorage.setObj("basketId","");
				//$scope.order=null;
			});
	

	
	$scope.changeQuantity= function (index, direction){
		if($scope.order.Items[index].Quantity + direction>=1){
			Shop_updateBasketSize($scope.order.Items[index].Quantity + direction);
		$http({
				method: 'POST',
				crossDomain : true,
				url: 'https://h0jg4s8gpa.execute-api.eu-central-1.amazonaws.com/v1/open/update/basket/quantity',
				data: JSON.stringify({basketId:$scope.basketId, storeId: 'KutyaLepcso', index: index, increment: direction, countryCode:Shop_getCountryCode($scope.shopping.contact.country),currency:$scope.currency}),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
					$scope.order = res.data;
			});
		}
	}
	
	$scope.removeItem = function(index)
	{
		$scope.order.Items.splice(index,1);//pre splice the removed item to make the ui seem for responsive
		$http({
				method: 'POST',
				crossDomain : true,
				url: 'https://h0jg4s8gpa.execute-api.eu-central-1.amazonaws.com/v1/open/update/basket/remove',
				data: JSON.stringify({basketId:$scope.basketId, storeId:'KutyaLepcso', index: index, countryCode: Shop_getCountryCode($scope.shopping.contact.country), currency:$scope.currency}),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
					$scope.order = res.data;
					Shop_updateBasketSize($scope.order.Items.length);
			});
	}
	
	$scope.updateDeliveryCost = function()//called when customer chooses/changes the Country to post 
	{
		$http({
				method: 'POST',
				crossDomain : true,
				url: `https://h0jg4s8gpa.execute-api.eu-central-1.amazonaws.com/v1/open/get/basket`,
				data: JSON.stringify({basketId:$scope.basketId, storeId: 'KutyaLepcso',  countryCode: Shop_getCountryCode($scope.shopping.contact.country), currency:$scope.currency}),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
					$scope.order = res.data;
					Shop_updateBasketSize($scope.order.Items.length);
					$scope.shopping.contact.countryCode = Shop_getCountryCode($scope.shopping.contact.country);
					localStorage.setObj("shopping",$scope.shopping);
			});
	}

	// will return the most appropriateimage to be displayed
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
	
	
	
});





