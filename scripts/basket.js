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
	$scope.order=localStorage.getObj("order");
	

	
	$scope.changeQuantity= function (index, direction){
		$scope.order.items[index].quantity=direction;
		$scope.order= Shop_changeQuantity($scope.order.items[index],direction);
	}
	
	$scope.removeItem = function(index)
	{
		$scope.order = Shop_removeItem(index);
	}
	
	$scope.updateDeliveryCost = function()
	{
		$scope.order=Shop_updateContact($scope.order.contact);
	}
	
	
	
});





