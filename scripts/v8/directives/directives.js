
angular.module('AduguShopApp').filter('myCurrency', function() {
  return function (myCost, currency){
			if(myCost==null)
			{
				return '';
			}
			
			if(currency.toLowerCase() == "eur"){
				myCost = "€" + Number.parseFloat(myCost).toFixed(2);
				myCost+= " EUR";				
			}
			else {
				if(myCost<1000)
				{
					myCost=myCost.toString();
				}
				else
				{
					let partBeforePoint = Math.trunc(myCost/1000);
					let partAfterPoint = myCost - partBeforePoint * 1000;
					if(partAfterPoint<10)
					myCost= partBeforePoint.toString() +'.00'+ partAfterPoint.toString();
					else if(partAfterPoint<100)
						myCost= partBeforePoint.toString() +'.0'+ partAfterPoint.toString();
					else
						myCost= partBeforePoint.toString() +'.'+ partAfterPoint.toString();
				}
				myCost+=" Ft";
			}
		  return myCost;	
		}
});

// This function handles lazy loading ofitems
angular
    .module('AduguShopApp')
    .directive('lazyLoad', lazyLoad)

	function lazyLoad(){
		return {
			restrict: 'A',
			link: function(scope, element, attrs){
				//at the moment, looking at intersection for just one image of group
				const img = angular.element(element)[0];
				img.src = "/images/loading.gif";
				let options = {
					root: null,
					rootMargin: '10% 10% 30% 10%', //setting margin to prempt loading
					threshold: [0, 0.25, 0.5, 0.75, 1.0]
				}
				const observer = new IntersectionObserver(loadImg, options);           
				observer.observe(img)
	
				function loadImg(changes){
					changes.forEach(change => {
						if(change.intersectionRatio > 0){
							if(!change.target.src.includes(attrs.lazyLoad)){
								change.target.src = attrs.lazyLoad;
								observer.unobserve(img);
							}
						}
					})
				}    
	
			}
		}
	}

// This function will check the size of all images under element and keep them all 
//at the same size
angular.module('AduguShopApp').directive('myImageSizerv2', function($interval) {
	return {
	  restrict: 'A',
	  link: function($scope,elem, attr) {

		  $interval(function(){
			  indexOfShortestImage=0;
			  shortestHeight=2000;
			  images = $(elem).find('img');
			  for(let i=0;i< images.length; i++){
				  if(!images[i].complete)
					  return;
				  if(images[i].height<shortestHeight && images[i].src.indexOf('loading')<0)
				  {
					  shortestHeight = images[i].height;
					  indexOfShortestImage = i;
				  }
			  }
			  if(shortestHeight!=2000){
				  //check if image has changed size and that also all the images are not just loading gifs
				for(let i =0; i <images.length; i++){
					let diff = shortestHeight - images[i].height;
					// for margin top and bottom
					diff = diff / 2;
					$(images[i]).css({'margin':  diff.toString() + 'px 0px'})
				}
			  }
  
		  },1000);
	  }
	};
  });

 // This function will show products specified in params with prices and descriptions 
  angular.module('AduguShopApp').directive('myExhibition',['ApiManager', function(ApiManager) {
	
	return{
		restrict : 'E',
		templateUrl: '/scripts/templates/v1/Exhibition.html',
		scope:{
			mainConfig: "=mainconfig",
			config : "=config",
			lang: "=lang",
			currency: "=currency"
		},
		link: function($scope){
			$scope.products = [];
			$scope.removeExtension = Common_removeExtension;
			
			// choose type of config
			switch($scope.config.type){
				case 'category':
					ApiManager.get('open', 'get/category', 
									{'category': $scope.config.list[0], 
									 'storeId': $scope.mainConfig.storeId + '>Product'
					}).then(function(res){
						$scope.products = res.data;
					});
					break;

				case 'product':
				default:
					ApiManager.get('open', 'get/products', {
									storeId:$scope.mainConfig.storeId, 
									items: $scope.config.list.toString()
					}).then(function(res){
						$scope.products = res.data;
					})
					break;
		}
		}
	}

  }]);

  angular.module('AduguShopApp').directive('myCookie', function() {
	return{
		restrict : 'E',
		templateUrl: 'legal/privacy.html',
		scope:{
			lang: '=lang'
		},
		link: function($scope, elem, attr){
			$scope.cookie = {show: false, inFooter: attr.infooter};
			if (localStorage.getObj("useCookie") == null){
				$scope.cookie.show = true;
			}
			$scope.changeCookie = function(state){
				$scope.cookie.show = false;
				Common_changeCookie(state);
			}
		}
	}
  });

  angular.module('AduguShopApp').directive('myAnimate', function() {
	return {
        restrict: 'EA',
        link: function(scope, element, attrs){
			const elem  = angular.element(element)[0];
			$(elem).css('visibility', 'hidden')
			let options = {
				root: null,
				rootMargin: '0px',
				threshold: [0, 0.25, 0.5, 0.75, 1.0]
			}
            const observer = new IntersectionObserver(animate, options);           
            observer.observe(elem)

            function animate(changes){
				changes.forEach(change => {
					if(change.intersectionRatio >= 0.9){
						$(elem).addClass('my-animate-appearance')
						observer.unobserve(elem);
					}
				});
				
            }    

        }
    }

  });

