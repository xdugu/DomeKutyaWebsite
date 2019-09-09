  
var app = angular.module('myApp', []);
app.controller('Configure', function($scope) {
 $scope.user={type:null,type2:null,pattern:null};
 $scope.$watch('user.type', function() {
        $scope.user.type2=null;
		$scope.user.pattern=null;
    });
	
$scope.addToBasket = function(){
	Shop_addToBasket($scope.user.type2, $scope.user.pattern, 1);
}
	
});



	