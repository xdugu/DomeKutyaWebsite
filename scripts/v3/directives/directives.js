

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


angular
    .module('AduguShopApp')
    .directive('lazyLoad', lazyLoad)

function lazyLoad(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){
			const img = angular.element(element)[0];
			img.src = "/images/loading.gif";
            const observer = new IntersectionObserver(loadImg);           
            observer.observe(img)

            function loadImg(changes){
                changes.forEach(change => {
                    if(change.intersectionRatio > 0){
						if(!change.target.src.includes(attrs.lazyLoad)){
							change.target.src = attrs.lazyLoad;
						}
                    }
                })
            }    

        }
    }
}

angular.module('AduguShopApp').directive('myImageSizerv2', function($interval) {
	return {
	  restrict: 'A',
	  link: function($scope,elem, attr) {
		  let lastSize = 0;
		  let promise = $interval(function(){
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
			  if(shortestHeight != lastSize && shortestHeight!=2000){
				  //check if image has changed size and that also all the images are not just loading gifs
			  //$(elem).find('img').css({'height': shortestHeight.toString() + 'px'});
			  for(let i =0; i <images.length; i++){
				  let diff = shortestHeight - images[i].height;
				  $(images[i]).parent().css({'height':  shortestHeight.toString() + 'px', 'overflow-y': 'hidden'})
			  }
			   //$(elem).find('img').css({'margin-bottom':  '100px'});
			   lastSize = shortestHeight;
			  }
  
		  },1000);
	  }
	};
  });
