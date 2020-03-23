//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}
			


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
 
 

var app = angular.module('AduguShopApp', ['ngAnimate', 'ngSanitize', 'slickCarousel']);
app.controller('Accordions', function() {
	
});


app.controller('ProductDisplay', ['$scope', 'ApiManager','CommonFuncs', function($scope, ApiManager, CommonFuncs){
	$scope.pickedSpec = [];
	
	$scope.backbone = {lang: Common_getLang()};
	$scope.basketId = localStorage.getObj("basketId");
	$scope.changeLanguage = Common_changeLanguage;
	$scope.itemInfo = null;
	$scope.showAllErrors = false;
	$scope.modal = {show: false, itemToShow: null}

	$scope.$on('$includeContentLoaded', function () {
		Shop_refreshBasket();
	});

	$('.w3-modal').css('display', 'block');

	// Get config for app specific stuff
	Common_getShopConfig().then(function(res){
		$scope.config = res;

		let shopData = localStorage.getObj("shopping");
		if(shopData == null){
			$scope.currency = res.shopping.currency;
		}else{
			$scope.currency = shopData.currency;	
		}
	});

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
	
	// called when user selects another variant and will workout the price
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
			prevPrice = $scope.itemInfo.Price[$scope.currency.toLowerCase()];
			
			// only need to scroll or update price if there is a difference between the current 
			// and the previous price
			if(prevPrice != combi.price[$scope.currency.toLowerCase()]){
				$scope.itemInfo.Price = Object.assign($scope.itemInfo.Price, combi.price);
				$scope.itemInfo.Quantity = combi.quantity;
				$([document.documentElement, document.body]).animate({
					scrollTop: $("#product_price").offset().top
				}, 1000);
			}
		}
	}

	// called when an item inside a group is selected
	$scope.selectGroupItem = function(variantIndex, group, pattern){
		$scope.pickedSpec[variantIndex] = group; 
		$scope.pickedSpec[parentIndex].chosenVariant = pattern;
		updateProductPrice(); 
		$scope.info.show = true
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
						if(variant.type == "group"){
							groupKeys = Object.keys(variant.groupInfo);
							$scope.pickedSpec[$scope.pickedSpec.length - 1].chosenVariant = 
									variant.groupInfo[groupKeys[0]][0];
						}
					 }
				});
			});

			$scope.itemInfo.Price = Object.assign($scope.itemInfo.Price, combi.price);
			$scope.itemInfo.Quantity = combi.quantity;
		}
	}
	let params = Common_parseUrlParam();
	//$scope.product.id = params.itemId;
		
	$scope.backbone.loading = true;
	ApiManager.get('open', 'get/product', {itemId: params.itemId, storeId: params.storeId}).then(function(res){
		loadProduct(res);
		$scope.backbone.loading = false;
	}).catch(function(err){
		console.log(err);
	});
	
	//called when customer presses the "Add to Basket" button	
	$scope.addToBasket = function(){		
			if($scope.selections.$invalid){
				$scope.showAllErrors = true;
				// scroll to first item in error
				$([document.documentElement, document.body]).animate({
					scrollTop: $($scope.selections.$error.required[0].$$element[0]).offset().top
				}, 1000);
				return;
			}
			let data = {itemId: $scope.itemInfo.ItemId, basketId:$scope.basketId, storeId: 'KutyaLepcso'};
			data.combination = $scope.pickedSpec;
						 
			ApiManager.post('open', 'update/basket', null, data).then(function(res){
					$scope.basketId = res.data.BasketId;
					localStorage.setObj("basketId", $scope.basketId);
					Shop_updateBasketSize(res.data.Items.length);
					runButtonAnimation();
			});
	 }
	 
 
	 
	function loadProduct(res)
	{
		$scope.itemInfo = res.data.data;
		let custom = CommonFuncs.getMeta($scope.itemInfo, 'custom');
		$scope.itemInfo.isCustom =  custom != null;
		// seperate category into an array
		let level = $scope.itemInfo.Category.split('>');
		// assign hierarchy to lower length name variable
		let hierarchy = $scope.itemInfo.ProductHierarchy;

		// put the firt level into an array
		let finalHierarchy = [hierarchy.find(item => item.name == level[0])];

		for(let i = 1; i < level.length; i++){
			// push lower level category data 
			finalHierarchy.push(finalHierarchy[i-1].sub.find(item => item.name == level[i]))
		}
		
		$scope.itemInfo.ProductHierarchy = finalHierarchy;

		$scope.itemInfo.Images.list.forEach(function(img, index){
			if(img.width / img.height < 1)
				$scope.itemInfo.Images.list[index].sizing ='height'
			else
				$scope.itemInfo.Images.list[index].sizing ='width'
		})
		setupVariants();
	}

	//This function returns the search category string
	$scope.getCategoryForLink = function(levelIndex){
		let levels = $scope.itemInfo.Category.split('>');
		let strToReturn= levels[0];

		for(let i = 1; i < levelIndex + 1; i++){
			strToReturn += '>' + levels[i];
		}

		return strToReturn;

	}

}]);
















