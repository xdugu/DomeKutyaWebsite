

angular.module('myApp').directive('myCostStr', function() {
  return {
	restrict: 'A',
    link: function($scope,elem, attr) {
		function calc(myCost)
		{
			//let myCost=parseInt(attr.myCostStr);
			if(myCost==null)
			{
				return '';
			}
			
			if($scope.currency=="EUR"){
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
		$scope.$watch(attr.myCostStr, function(value) {
				elem.text(calc(value));
		});
    }
  };
});


angular
    .module('myApp')
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
