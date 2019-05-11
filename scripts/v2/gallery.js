//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}
products =  null;
			
var currentProductId;

 

var app = angular.module('myApp', []);


app.controller('Gallery',function($scope, $timeout,$http,$location,$window){
		
		$timeout( function(){
			$('#img_stage').slick({
				dots: false,
				infinite: true,
				slidesToShow: 1,
				slidesToScroll: 1,
				autoplay: true,
				autoplaySpeed: 2000,
				centerMode: true,
				variableWidth: true,
				//asNavFor: '.preview-stage'				
			  });
			/*
			$('.preview-stage').slick({
				dots: false,
				arrows: true,
				infinite: true,
				slidesToShow: 4,
				slidesToScroll: 1,
				autoplay: false,
				variableWidth: true,
				centerMode: true,
				asNavFor: '#img_stage',
				focusOnSelect: true
			  });*/
			}
			,100);    
			
});
















