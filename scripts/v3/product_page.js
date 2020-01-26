//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}
products =  null;
			
var currentProductId;

 function runButtonAnimation(){
	$('#added-prompt').css({'opacity':0.6});
	$('#added-prompt').animate({'opacity':1},2000,'swing',function(){
			 $('#added-prompt').animate({'opacity':0},1000,'linear');
		 });
 }
 
 function handleSizeChange(){
	if($('#product_size').val()!='default')
		 $('#show_size_prompt').hide();	 
 }
 
 

var app = angular.module('myApp', ['ngAnimate','ngSanitize', 'slickCarousel']);
app.controller('Accordions', function() {
	
});


app.controller('ProductDisplay',function($scope, $http){
	$scope.shopping = localStorage.getObj("shopping");
	$scope.currency = $scope.shopping.currency;

	$scope.pickedSpec = [];
	
	$scope.backbone = {lang:null};
	$scope.backbone.lang= $scope.shopping.contact.lang;//for choosing of language
	$scope.basketId = localStorage.getObj("basketId");
	$scope.changeLanguage = Common_changeLanguage;
	$scope.itemInfo;
	$scope.showAllErrors = false;

	$scope.slickConfig={
		dots: true,
		infinite: true,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: false,
		lazyLoad: 'ondemand',
		event: {
			init: function (event, slick) {
				// Work on dynamic height of slider
				let relDiv = slick.$slider[0];
				currImage = $scope.itemInfo.Images.list[0];
				let idealHeight = (slick.listWidth * currImage.height)/currImage.width;
				$(relDiv).height(idealHeight);				
			},
			afterChange: function (event, slick, currentSlide, nextSlide) {
				// Work on dynamic height of slider
				let relDiv = slick.$slider[0];
				currImage = $scope.itemInfo.Images.list[currentSlide];
				let idealHeight = (slick.listWidth * currImage.height)/currImage.width;
				$(relDiv).animate({height: idealHeight});
			}
		}	
		};
	
	// called when user selects another variant ans will workout the price
	$scope.updateProductPrice = function(){
		if($scope.itemInfo.Variants.variants.length > 0){
			let chosenArray = [];
			$scope.pickedSpec.forEach(function(variant){
				chosenArray.push(variant.name);
			})
			function combiMatches(combi){
				return JSON.stringify(combi.combination) == JSON.stringify(chosenArray);
			}
			let combi = $scope.itemInfo.Variants.combinations.find(combiMatches);
			$scope.itemInfo.Price = Object.assign($scope.itemInfo.Price, combi.price);
			$scope.itemInfo.Quantity = combi.quantity;
			$([document.documentElement, document.body]).animate({
				scrollTop: $("#product_price").offset().top
			}, 1000);
		}
	}

	// called after item is loaded
	function setupVariants(){
		if($scope.itemInfo.Variants.variants.length > 0){
			//pre-choose the first combination in list
			function findFirstValid(candidate){
				if($scope.itemInfo.TrackStock)
					return !candidate.disabled && candidate.quantity > 0
				else
					return !candidate.disabled;
			}
			let combi = $scope.itemInfo.Variants.combinations.find(findFirstValid);

			// in case none are valid, choose the first option
			if(combi == undefined)
				combi = $scope.itemInfo.Variants.combinations[0];

			// now loop through each variant to pick right combi
			$scope.itemInfo.Variants.variants.forEach(function(variant, index){
				variant.options.forEach(function(option){
					 if(combi.combination[index] == option.name){
						$scope.pickedSpec.push(option);
					 }
				});
			});

			$scope.itemInfo.Price = Object.assign($scope.itemInfo.Price, combi.price);
			$scope.itemInfo.Quantity = combi.quantity;
		}
	}
	let params = Common_parseUrlParam();
	//$scope.product.id = params.itemId;
		
	$http.get('https://h0jg4s8gpa.execute-api.eu-central-1.amazonaws.com/v1/open/get/product?itemId='
			+ params.itemId + `&storeId=${params.storeId}` ).then(function(res){
		loadProduct(res);
	});
	  
	$scope.checkBasket = function(){//called when customer presses the "Add to Basket" button			
			if($scope.selections.$invalid){
				$scope.showAllErrors = true;
				return;
			}
			let data = {itemId: $scope.itemInfo.ItemId, basketId:$scope.basketId, storeId: 'TestStore'};
			data.combination = $scope.pickedSpec;
						 
			
			 $http({
				method: 'POST',
				crossDomain : true,
				url: `https://h0jg4s8gpa.execute-api.eu-central-1.amazonaws.com/v1/open/update/basket`,
				data: angular.toJson(data),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
					$scope.basketId = res.data.BasketId;
					localStorage.setObj("basketId", $scope.basketId);
					Shop_updateBasketSize(res.data.Items.length);
					runButtonAnimation();
			});

	 }
	 
 
	 
	function loadProduct(res)
	{
		$scope.itemInfo = res.data.data;
		setupVariants();
	}
});
















