if ('serviceWorker' in navigator) {
  // Service Worker isn't supported on this browser, disable or hide UI.
  window.addEventListener('load', () => {
  
	notificationSaved = localStorage.getItem("notified");
	navigator.serviceWorker.register('/service-worker.js');
  });
}

$(document).ready(function() {    
	$('#landing_text').animate({'opacity':'1'}, 3000)
  	$('#landing_img').toggleClass('animate');
});
  
var app = angular.module('AduguShopApp', []);
app.controller('HomePage', function($http,$scope,$q,$timeout) {

//getting a reference to these files so I can check later when both are loaded
$scope.backbone = {lang:null};
$scope.backbone.lang= localStorage.getObj("lang");//for choosing of language	
$scope.changeLanguage = Common_changeLanguage;

//we are loading the ids of the products we want to display on the homepage

	
});



	