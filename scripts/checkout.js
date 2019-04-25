
var scrollingElement = (document.scrollingElement || document.body);


var app = angular.module('myApp', []);
app.run(function() {
// Trigger input event on change to fix auto-complete
$('input, select').on('change',function() { $(this).trigger('input'); });
});
app.controller('Checkout', function($scope, $http, $timeout) {
	$scope.order = localStorage.getObj("shopping");
	$scope.user=$scope.order.contact;
	
	$scope.proceedToPayment= function (){
		$scope.order.contact = $scope.user;
		localStorage.setObj("shopping", $scope.order);
		window.location.href = 'review.html';
	}

	$scope.$watch('agreed',function(newValue, oldValue) {
        if (newValue !== oldValue) {
            if(newValue==true){
				$timeout(function(){// I needed to add a delay to cause the document to scroll properly
					var scrollingElement = (document.scrollingElement || document.body);
					 $(scrollingElement).animate({
						  scrollTop: document.body.scrollHeight
					   }, 2000);
				},200);
			}
        }
    });
});


	
	





