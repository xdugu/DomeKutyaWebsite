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
	$scope.shopping = localStorage.getObj("shopping");
	$scope.currency = $scope.shopping.currency;
	$scope.patterns=[];
	$scope.accessories = [];
	
	$scope.backbone = {lang:null};
	$scope.backbone.lang= $scope.shopping.contact.lang;//for choosing of language
	$scope.basketId = localStorage.getObj("basketId");
	$scope.changeLanguage = Common_changeLanguage;
	$scope.itemInfo;
	
	
	$scope.product.id = Common_getUrlParam('itemId=');
		
	$http.get('https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v2/Request/ItemData?itemId='+ $scope.product.id ).then(function(res){
		loadProduct(res);
	});
	  
	$scope.checkBasket = function(){//called when customer presses the "Add to Basket" button
			let data = {itemId: $scope.product.id, basketId:$scope.basketId};
			if($scope.itemInfo.Variants.hasVariants){
				data['patternId']=$scope.patterns[$scope.product.pattern].id;
			}
		  $('#show_size_prompt').hide();			 
			
			 $http({
				method: 'POST',
				crossDomain : true,
				url: 'https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v2/Request/Basket/AddToBasket',
				data: JSON.stringify(data),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(res.data.Result=="OK"){
					$scope.basketId = res.data.data.basketId;
					localStorage.setObj("basketId", $scope.basketId);
					Shop_updateBasketSize(res.data.data.basketNum);
					runButtonAnimation();
				}
			});

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
		
		$scope.product.category = $scope.itemInfo.Category;
		let numOfImg = $scope.itemInfo.Image.numberOfImages;
		
		
		$scope.product.firstInfo = $scope.itemInfo.additionalInfo.FirstInfo.hu;
		$scope.product.addInfo = $scope.itemInfo.additionalInfo.AdditionalInfo.hu;
		$scope.product.prodInfo = $scope.itemInfo.additionalInfo.ProductInfo.hu;

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
				
			},500);    

		
			
	}
});
















