
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
		templateUrl: '/scripts/templates/v3/Exhibition.html',
		scope:{
			mainConfig: "=mainconfig",
			config : "=config",
			lang: "=lang",
			currency: "=currency",
			maxItems: "=maxitems"
		},
		link: function($scope){
			$scope.products = [];
			$scope.removeExtension = Common_removeExtension;

			if(typeof $scope.maxItems == "undefined" || $scope.maxItems == null)
				$scope.maxItems = 3;
			
			// choose type of config
			switch($scope.config.type){
				case 'category':
					ApiManager.get('open', 'get/category', 
									{'category': $scope.config.list[0], 
									 'storeId': $scope.mainConfig.storeId + '>Product'
					}).then(res => {
						let candidates = res.data;

						// if more returned items than can fit, choose randomly
						if(candidates.length > $scope.maxItems){
							let indexesToChoose = [];

							for(let i = 0; i < $scope.maxItems; i++){
								let rand, index;

								// find a random value that is not already in the index to choose
								do{
									rand = Math.floor(Math.random() * candidates.length);
									index = indexesToChoose.findIndex(val => rand == val);
								}while(index >= 0)

								indexesToChoose.push(rand);
							}

							// convert indexes into product ids to view
							 indexesToChoose.forEach(index =>{
								$scope.products.push(candidates[index]);
							});
						}
						else
							$scope.products = candidates;
						
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

  // directive to handle cookie policy
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

  // directive to animate showing of element only one in viewport
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


  // directive to handle cookie policy
  angular.module('AduguShopApp').directive('notificationManager', ['ApiManager', function(ApiManager){
    return {
		restrict: 'E',
		templateUrl: '/scripts/templates/v3/Notification.html',
		scope:{
			storeId: '=storeid',
			lang: '=lang'
		},
        link: function ($scope, element, attrs) {
			// get current cached notifications
			let cachedNotifications = localStorage.getItem('notifications');
			$scope.messageToDisplay = null;

			// check if no cache and initial something
			if(cachedNotifications == null)
				cachedNotifications = {list:[]};
			else
				cachedNotifications = JSON.parse(cachedNotifications);


            ApiManager.get('open', 'get/notifications', {storeId: $scope.storeId}).then(res =>{

				// update current cache with fresh data
				for(let iNoti = 0; iNoti < res.data.length; iNoti ++){

					let ind = cachedNotifications.list.findIndex((item) => item.id == res.data[iNoti].Info.id && item.enabled);
					
					if(ind < 0){
						cachedNotifications.list.push(res.data[iNoti].Info);
					}else{
						let lastShown = cachedNotifications.list[ind].lastShown;
						cachedNotifications.list[ind] = res.data[iNoti].Info;
						cachedNotifications.list[ind].lastShown = lastShown;
					} // if
	
				}// for

				// now delete from cache, the ids not existing in server, i.e. have been deleted
				let newList = [];
				
				cachedNotifications.list.forEach((notification) =>{
					if (res.data.findIndex((item)=> item.Info.id == notification.id && item.Info.enabled) >= 0){
						newList.push(notification);
					}
				});

				cachedNotifications.list = newList;
				chooseNotificationToShow(cachedNotifications);
				
			});

			function chooseNotificationToShow(notification){
				for(iList = 0; iList < notification.list.length; iList++){

					// if never shown before, then show or if last shown is longer than frequency to show
					 if((notification.list[iList].lastShown == null && notification.list[iList].enabled) ||
					 	(Date.now() - notification.list[iList].lastShown > notification.list[iList].frequency)){
						 $scope.messageToDisplay  = notification.list[iList];
						 notification.list[iList].lastShown = Date.now();
						 break;
					 }
				}

				localStorage.setItem('notifications', JSON.stringify(notification));
			}
        }
    }
 }]);

