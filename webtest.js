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
 
 

var app = angular.module('myApp', ['ngAnimate','ngSanitize']);




app.controller('ProductDisplay',function($scope, $timeout,$http,$location,$window){
	//$scope.product = {hasVariant2:true,variant2Details:{type:'input',minVal:50,maxVal:100,units:"cm"}};
	$scope.productRadio = {hasVariant2:true,variant2Details:{type:'radio',options:[{type:'input',minVal:50,maxVal:100,units:"cm"},
	 {type:'text',value:"Other option",units:"cm"}]}};
	
});
