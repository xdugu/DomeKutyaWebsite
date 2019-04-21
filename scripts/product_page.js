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
app.controller('Accordions', function() {
	
});


app.controller('ProductDisplay',function($scope, $timeout,$http,$location,$window){
	$scope.product={description:"", dimension:"", price:"",pattern:0,imgSrc:null,id:"",numOfImg:1,
					hasVariants:false,patternIsItem:false,firstInfo:"",addInfo:"",prodInfo:"",category:"",imgPref:""};
	$scope.currency = localStorage.getObj("order").currency;
	$scope.patterns=[];
	$scope.accessories = [];
	
	$scope.backbone = {lang:null};
	$scope.backbone.lang= localStorage.getObj("lang");//for choosing of language	
	$scope.changeLanguage = Common_changeLanguage;
	$scope.itemInfo;
	
	if(window.location.href.toLowerCase().search('step')>=0)
			$scope.category = "steps";
	else
		$scope.category = "ramps";
	
	$scope.product.id = Common_getUrlParam('itemId=');
		
	$http.get('https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v1/Request/ItemData?itemId='+ $scope.product.id ).then(function(res){
		loadProduct(res);
	});
	  
	$scope.checkBasket = function(){

		  $('#show_size_prompt').hide();			 
			 runButtonAnimation();
			 let pattern="";
			 if($scope.product.hasVariants==true)
				 pattern=$scope.patterns[$scope.product.pattern].id;
			 let data = {stepId:$scope.product.id, patternId: pattern, quantity:1,
						hasVariant: $scope.product.hasVariants, patternIsItem: $scope.product.patternIsItem, category: $scope.product.category};
			 data.id = $scope.product.id;
			 data.description = $scope.product.description;
			if($scope.product.hasVariants==true){
				data.description+= ", " + $scope.patterns[$scope.product.pattern].description;
				data.patternImg= $scope.patterns[$scope.product.pattern].img + "/img_1.jpg";
				data.patternPrice=$scope.patterns[$scope.product.pattern].Price;
			}
			 data.category = "stepsAndRamps"; //$scope.product.Category;
			 data.price = $scope.product.price;
			 data.stepImg = $scope.product.imgSrc + "/img_1.jpg";
			 
			 Shop_addToBasket(data);
	 }
	 
 
	 
	function loadProduct(res)
	{
		$scope.itemInfo = res.data;
		

		if($location.absUrl().search('/en/')>0)
		{
			$scope.product.description = $scope.itemInfo.Description.en;
		}
		else $scope.product.description = $scope.itemInfo.Description.hu;

		
		$scope.product.price = $scope.itemInfo.Price.huf;
		
		$scope.product.imgSrc = $scope.itemInfo.Image.location;
		
		$scope.product.imgPref = $scope.itemInfo.Image.imagePref;
		
		$scope.product.category = $scope.itemInfo.Image.Category;
		let numOfImg = 3;// parseInt(Common_getItemInner(database,"//item[@id='"+ productId +"']/image_num"));
		
		
		$scope.product.firstInfo = $scope.itemInfo.additionalInfo.FirstInfo;
		$scope.product.addInfo = $scope.itemInfo.additionalInfo.AdditonalInfo;
		$scope.product.prodInfo = $scope.itemInfo.additionalInfo.ProductInfo;
		/*
		mylink = Common_getItemInner(database,"//item[@id='"+ productId +"']/item_is_pattern");
		if (mylink=="yes")
			$scope.product.patternIsItem=true;
		else
			$scope.product.patternIsItem=false;
		*/
		
		if(!isNaN(numOfImg))
			$scope.product.numOfImg = numOfImg;
////////////////////////////////////////////////////////////
		if($scope.itemInfo.Variants.hasVariants)
		{
			$scope.product.hasVariants = true;
			for(let i=0;i<$scope.itemInfo.patterns.length;i++){
			let pattern = {img:"", id:$scope.itemInfo.patterns[i].PatternId, description:"",price: 0};
			
			pattern.img = $scope.itemInfo.patterns[i].Image.location;
			
			if($location.absUrl().search('/en/')>0)
				pattern.description = $scope.itemInfo.patterns[i].Description.en;
			else
				pattern.description = $scope.itemInfo.patterns[i].Description.hu;
			
			pattern.price = $scope.itemInfo.patterns[i].Price.huf;
			
				$scope.patterns.push(pattern);
			}
			
		}
		 else $scope.product.hasVariants=false;


			$timeout( function(){
				
				if($scope.product.numOfImg>1)
				{
				$('#img_stage').slick({
					dots: true,
					infinite: true,
					slidesToShow: 1,
					slidesToScroll: 1,
					adaptiveHeight: true,
					autoplay: false,	
				  });
				}
				else{
					$('.sub_image').css({"height":'80vh',"width":'auto',"display":'block'});
			
		       }
				
			},200);    

		
			
	}
});
















