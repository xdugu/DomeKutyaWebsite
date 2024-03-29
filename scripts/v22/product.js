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
	$scope.groupInfo = {selected: null, list: null};
	$scope.basketId = localStorage.getObj("basketId");
	$scope.changeLanguage = Common_changeLanguage;
	$scope.removeExtension = Common_removeExtension;
	$scope.itemInfo = null;
	$scope.showAllErrors = false;
	$scope.modal = {show: false, imgToShow: null, textToShow: null};
	$scope.storeId = null;

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

				// hack to get height of slick stage to match image height
				$(slick.$slideTrack).height(idealHeight);
				$(relDiv).height(idealHeight);				
			},
			afterChange: function (event, slick, currentSlide, nextSlide) {
				// Work on dynamic height of slider
				let relDiv = slick.$slider[0];
				currImage = $scope.itemInfo.Images.list[currentSlide];

				let idealHeight = (slick.listWidth * currImage.height)/currImage.width;

				// hack to get height of slick stage to match image height
				$(relDiv).animate({height: idealHeight});
				$(slick.$slideTrack).height(idealHeight);
			}
		}	
		};
	
	// called when user selects another variant and will workout the price
	$scope.updateProductPrice = function(){
		
		if($scope.itemInfo.Variants.variants.length > 0){
			let chosenArray = [];
			$scope.pickedSpec.forEach(function(variant){
				chosenArray.push(variant.name);
			});
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

	// puts markers onto variants that are selectable/unselectable
	$scope.determineSelectableItems = function(){
		validateAndCorrectSelection();
		for(let iLevel = 0; iLevel < $scope.itemInfo.Variants.variants.length; iLevel++){
			for(const option of $scope.itemInfo.Variants.variants[iLevel].options){
				option.isSelectable = false; // assume initially not selectable
				let combis;
				
				if(iLevel == 0){
					combis = getCombinations([option.name]);
				}else{
					// look up at current selection to work out what item in lower
					// variant level is selectable
					let currentSelection = $scope.pickedSpec.reduce((accum, currVal)=>{
						accum.push(currVal.name);
						return accum;
					}, []);
					currentSelection = currentSelection.splice(0, iLevel);
					currentSelection.push(option.name);
					combis = getCombinations(currentSelection);
				}
				let validCombi = combis.some(combi => {
					if($scope.itemInfo.TrackStock){
						return combi.quantity > 0 && !combi.disabled;
					}
					else
						return !combi.disabled
				});
				if(validCombi){
					option.isSelectable = true;
				} // if
			} // for
		}
	}

	// gets all combinations that start with the given combination(array)
	function getCombinations(startsWith){
		startsWith = startsWith.join();
		return $scope.itemInfo.Variants.combinations.filter(combi => {
			let joinedCombi = combi.combination.join();
			return joinedCombi.startsWith(startsWith);
		});
	}
	
	// checks if the current selection by user is valid. if not, determines the cloest to what the customer wants
	function validateAndCorrectSelection(){
		currentCombi = $scope.pickedSpec.reduce((accum, elem)=>{
			accum.push(elem.name);
			return accum;
		}, []);

		const combi = $scope.itemInfo.Variants.combinations.find(elem => elem.combination.join() == currentCombi.join());
		if(!isValidCombi(combi)){
			// find a valid combination
			
			for(let index = $scope.pickedSpec.length; index > 0; index--){
				const combinations = getCombinations(currentCombi.slice(0, index - 1));
				for(const combination of combinations){
					if(isValidCombi(combination)){
						$scope.pickedSpec = [];

						for(let combiIndex = 0; combiIndex < combination.combination.length; combiIndex++){
							for(const variant of $scope.itemInfo.Variants.variants){
								for(const option of variant.options){
									if(combination.combination[combiIndex] == option.name){
										$scope.pickedSpec.push(option);
										if(variant.type == "group"){
											groupKeys = Object.keys(variant.groupInfo);
											$scope.pickedSpec[$scope.pickedSpec.length - 1].chosenVariant = 
													variant.groupInfo[groupKeys[0]][0];
										}
									 }
								}
							}
						}
						return;
					}
				}

			}

		} // if

		function isValidCombi(combi){
			if($scope.itemInfo.TrackStock)
				return !combi.disabled && combi.quantity > 0;
			else
				return !combi.disabled;
		}
	}
	

	// called after item is loaded
	async function setupVariants(){
		if($scope.itemInfo.Variants.variants.length > 0){
			//pre-choose the first combination in list
			function findFirstValid(candidate){
				if($scope.itemInfo.TrackStock)
					return !candidate.disabled && candidate.quantity > 0;
				else
					return !candidate.disabled;
			}

			for(let variant of $scope.itemInfo.Variants.variants){
				variant.groupInfo = {};
				if(variant.type === 'group'){
					for(let variantOption of variant.options){
						let resp = await ApiManager.get('open', 'get/category', 
											{storeId: $scope.storeId + '>Variant', category: variantOption.name});
						variant.groupInfo[variantOption.name] = resp.data.filter(item => item.Enabled);
					}
				}
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
		
		$scope.determineSelectableItems();
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
		let data = {itemId: $scope.itemInfo.ItemId, basketId:$scope.basketId, storeId: $scope.storeId};
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
		
		//get and set actual store id
		$scope.storeId = $scope.itemInfo.StoreId;
		let index = $scope.storeId.indexOf('>');
		if(index >= 0)
			$scope.storeId = $scope.storeId.substring(0, index);


		// Replace title with item's actual title and also meta description
		document.title = $scope.itemInfo.Title[$scope.backbone.lang];
		document.querySelector('meta[name="description"]').setAttribute("content", $scope.itemInfo.Description[$scope.backbone.lang].replace(/<(\/|\w)+>/gi, '.'));
		
		let custom = CommonFuncs.getMeta($scope.itemInfo, 'custom');
		$scope.itemInfo.isCustom =  custom != null;
		
		// attempt to link variant images to variants
		for(const image of $scope.itemInfo.Images.list){
			if(image.type.startsWith('variant')){
				let type = image.type.split('-');
				type.splice(0, 1); // remove the first element as it will always be 'variant'
				for(const variant of $scope.itemInfo.Variants.variants){
					if(variant.name == type[0]){
						let index = variant.options.findIndex(option => option.name == type[1]);
						if(index >= 0){
							variant.options[index].linkedImage = image.name;
							variant['hasAttachedImage'] = true;
						}
					}
				}
			}
		}
		// seperate category into an array
		let level = $scope.itemInfo.Category.split('>');

		ApiManager.get('open', 'get/settings', {storeId: params.storeId, get:'ProductHierarchy'}).then((res)=>{
			let hierarchy = res.data.ProductHierarchy;

			// put the first level into an array
			let finalHierarchy = [hierarchy.find(item => item.name == level[0])];

			for(let i = 1; i < level.length; i++){
				// push lower level category data 
				finalHierarchy.push(finalHierarchy[i-1].sub.find(item => item.name == level[i]))
			}
			
			$scope.itemInfo.ProductHierarchy = finalHierarchy;
		});
		

		$scope.itemInfo.Images.list.forEach(function(img, index){
			if(img.width / img.height < 1)
				$scope.itemInfo.Images.list[index].sizing ='height';
			else
				$scope.itemInfo.Images.list[index].sizing ='width';
		});

		setupVariants()
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
















