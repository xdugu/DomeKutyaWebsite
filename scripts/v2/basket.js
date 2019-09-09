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
	
	if($scope.basketId==null || $scope.basketId=="" || $scope.basketId.length<2){
		$scope.order=null;
		return;
	}
		
	 $http({
				method: 'POST',
				crossDomain : true,
				url: 'https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v2/Request/Basket/GetBasket',
				data: JSON.stringify({basketId:$scope.basketId, includeCost: true, country:$scope.shopping.contact.country, currency:$scope.currency }),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(res.data.Result=="OK"){
					let temp = res.data.data;
					$scope.order = temp.Item;
					Shop_updateBasketSize(temp.Item.Items.length);
				}
			}).catch(function(err){
				Shop_updateBasketSize(0);//Probably the basket could not be found
				localStorage.setObj("basketId","");
				$scope.order=null;
			});
	

	
	$scope.changeQuantity= function (index, direction){
		if($scope.order.Items[index].Quantity + direction>=1){
			Shop_updateBasketSize($scope.order.Items[index].Quantity + direction);
		$http({
				method: 'POST',
				crossDomain : true,
				url: 'https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v2/Request/Basket/ChangeQuantity',
				data: JSON.stringify({basketId:$scope.basketId, index: index, increment: direction, country:$scope.shopping.contact.country,currency:$scope.currency}),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(res.data.Result=="OK"){
					$scope.order = res.data.data;
				}
			});
		}
	}
	
	$scope.removeItem = function(index)
	{
		$scope.order.Items.splice(index,1);//pre splice the removed item to make the ui seem for responsive
		$http({
				method: 'POST',
				crossDomain : true,
				url: 'https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v2/Request/Basket/RemoveItem',
				data: JSON.stringify({basketId:$scope.basketId, index: index, country:$scope.shopping.contact.country, currency:$scope.currency}),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(res.data.Result=="OK"){
					$scope.order = res.data.data;
					Shop_updateBasketSize(res.data.data.Items.length);
				}
			});
	}
	
	$scope.updateDeliveryCost = function()//called when customer chooses/changes the Country to post 
	{
		$http({
				method: 'POST',
				crossDomain : true,
				url: 'https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v2/Request/Basket/GetBasket',
				data: JSON.stringify({basketId:$scope.basketId, includeCost: true, country:$scope.shopping.contact.country, currency:$scope.currency}),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(res.data.Result=="OK"){
					let temp = res.data.data;
					$scope.order = temp.Item;
					Shop_updateBasketSize( temp.Item.Items.length);
					$scope.shopping.contact.countryCode = Shop_getCountryCode($scope.shopping.contact.country);
					localStorage.setObj("shopping",$scope.shopping);
				}
			});
	}
	
	
	
});





