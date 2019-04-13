if ('serviceWorker' in navigator) {
  // Service Worker isn't supported on this browser, disable or hide UI.
  window.addEventListener('load', () => {
  
  
	notificationSaved = localStorage.getItem("notified");

	navigator.serviceWorker.register('/service-worker.js');
  });
}
  
var app = angular.module('myApp', []);
app.controller('HomePage', function($http,$scope,$q,$timeout) {

//getting a reference to these files so I can check later when both are loaded
$scope.backbone = {lang:null};
$scope.backbone.lang= localStorage.getObj("lang");//for choosing of language	
$scope.changeLanguage = Common_changeLanguage;
$scope.products = $http.get('/res/home.json');
$scope.database = $http.get('/res/products.xml');

//we are loading the ids of the products we want to display on the homepage
$q.all([$scope.products, $scope.database]).then(function(values) {
	/*let pathname = window.location.href;
	
	if(pathname.search('/en')>0)
		$scope.products = values[0].data.en;
	else $scope.products = values[0].data.hu;
	
	parser = new DOMParser();
    let database = parser.parseFromString(values[1].data,"text/xml");
    for(let i=0; i<$scope.products.length; i++)
	{
		
		let tag=Common_getItemById(database, $scope.products[i].item);

			$scope.products[i].src = tag.getElementsByTagName('image')[0].innerHTML;
	}
	*/
	 $timeout(function (){
		  $('.slide').slick({
		dots: false,
		arrows:false,
        infinite: true,
        slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 2500,
		pauseOnHover: false,
		pauseOnFocus:false,
		speed:2000,
		fade:true,
		swipe : false,
		responsive: [
        {
            breakpoint: 480, // mobile breakpoint
            settings: {
                slidesToShow: 1,
            }
        }
		]	
      });
	 },100);
});

	
});



	