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
	$scope.product = {}
	$scope.shopping = localStorage.getObj("shopping");
	$scope.currency = $scope.shopping.currency;
	$scope.patterns=[];
	$scope.accessories = [];
	$scope.showVariant2Error = false;
	$scope.pickedSpec = [];
	
	$scope.backbone = {lang:null};
	$scope.backbone.lang= $scope.shopping.contact.lang;//for choosing of language
	$scope.basketId = localStorage.getObj("basketId");
	$scope.changeLanguage = Common_changeLanguage;
	$scope.itemInfo;

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
		}
	}
	params = Common_parseUrlParam();
	//$scope.product.id = params.itemId;
		
	$http.get('https://h0jg4s8gpa.execute-api.eu-central-1.amazonaws.com/v1/open/get/product?itemId='
			+ params.itemId + `&storeId=${params.storeId}` ).then(function(res){
		loadProduct(res);
	});
	  
	$scope.checkBasket = function(){//called when customer presses the "Add to Basket" button
			let data = {itemId: $scope.product.id, basketId:$scope.basketId};
			if($scope.itemInfo.Variants.hasVariants){
				data['patternId']=$scope.patterns[$scope.product.pattern].id;
				data['test']=true;
			}
			if($scope.itemInfo.Variants.hasVariants2){
				if($scope.itemInfo.Variants.variant2Details.type=== "input")
				{
					if(!isNaN($scope.itemInfo.Variants.variant2Val) && 
					($scope.itemInfo.Variants.variant2Val>=$scope.itemInfo.Variants.variant2Details.minVal &&
					$scope.itemInfo.Variants.variant2Val<=$scope.itemInfo.Variants.variant2Details.maxVal) )
					
					{
						$scope.showVariant2Error = false;
						data['variant2Val']=$scope.itemInfo.Variants.variant2Val;
					}
					else
					{
						$scope.showVariant2Error = true;
						return;
					}
				}
				else if(($scope.itemInfo.Variants.variant2Details.type==="radio" && //is the option inside the radio a "input"?
					$scope.itemInfo.Variants.variant2Details.options[$scope.chosenVariant2Option.index].type==="input")){
						if(!isNaN($scope.itemInfo.Variants.variant2Val) && 
						($scope.itemInfo.Variants.variant2Val>=$scope.itemInfo.Variants.variant2Details.options[$scope.chosenVariant2Option.index].minVal &&
						$scope.itemInfo.Variants.variant2Val<=$scope.itemInfo.Variants.variant2Details.options[$scope.chosenVariant2Option.index].maxVal)){
						
							$scope.showVariant2Error = false;
							data['variant2Val']=$scope.itemInfo.Variants.variant2Val;
							data['chosenVariant2Option']= $scope.chosenVariant2Option.index;
						}
						else
						{
							$scope.showVariant2Error = true;
							return;
						}
							
					}
				else if($scope.itemInfo.Variants.variant2Details.type==="radio" && //if option in radio is just text, we just send the index of the option
				$scope.itemInfo.Variants.variant2Details.options[$scope.chosenVariant2Option.index].type==="text"){
					$scope.showVariant2Error = false;
					data['chosenVariant2Option']= $scope.chosenVariant2Option.index;
				
				}

			} 
			
		  $('#show_size_prompt').hide();			 
			
			 $http({
				method: 'POST',
				crossDomain : true,
				url: 'https://api.kutyalepcso.com/v2/Request/Basket/AddToBasket',
				data: JSON.stringify(data),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(res.data.Result=="OK"){
					$scope.basketId = res.data.data.basketId;
					localStorage.setObj("basketId", $scope.basketId);
					Shop_updateBasketSize(res.data.data.basketNum);
					runButtonAnimation();
				}
			});

	 }
	 
 
	 
	function loadProduct(res)
	{
		$scope.itemInfo = res.data.data;
		setupVariants();
////////////////////////////////////////////////////////////

			
	}
});
















