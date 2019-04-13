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
	$scope.patterns=[];
	$scope.accessories = [];
	
	$scope.backbone = {lang:null};
	$scope.backbone.lang= localStorage.getObj("lang");//for choosing of language	
	$scope.changeLanguage = Common_changeLanguage;
	
	if(window.location.href.toLowerCase().search('step')>=0)
			$scope.category = "steps";
	else
		$scope.category = "ramps";

	$http.get('/res/products.xml').then(function(library){
		loadProduct(library.data);
	});
	//loadProduct(products);
	 $('#show_size_prompt').hide(); 
	 $('#product_size').change(handleSizeChange);
	  
	$scope.checkBasket = function(){

		  $('#show_size_prompt').hide();			 
			 runButtonAnimation();
			 let pattern="";
			 if($scope.product.hasVariants==true)
				 pattern=$scope.patterns[$scope.product.pattern].id;
			 let data = {stepId:$scope.product.id, patternId: pattern, quantity:1,
						hasVariant: $scope.product.hasVariants, patternIsItem: $scope.product.patternIsItem, category: $scope.product.category};
			 Shop_addToBasket(data);
	 }
	 
 
	 
	function loadProduct(library)
	{
		let productId = Common_getUrlParam('id=');
		$scope.product.id = productId;
		parser = new DOMParser();
		let database = parser.parseFromString(library,"text/xml");			
		let myPath = window.location.href; //we will use the path name later to determine the language
		//let tags=Common_getItemById(database, window.location.href);
		let specificItem = Common_getItemInner(database,"//item[@id='"+ productId +"']/description/en");
		if(specificItem==null)
			return;
		if($location.absUrl().search('/en/')>0)
		{
			$scope.product.description = specificItem;
		}
		else $scope.product.description = Common_getItemInner(database,"//item[@id='"+ productId +"']/description/hu");

		$scope.product.dimension = Common_getItemInner(database,"//item[@id='"+ productId +"']/dimension");
		
		$scope.product.price = parseInt(Common_getItemInner(database,"//item[@id='"+ productId +"']/price/huf"));
		
		$scope.product.imgSrc = Common_getItemInner(database,"//item[@id='"+ productId +"']/image");
		
		$scope.product.imgPref = Common_getItemInner(database,"//item[@id='"+ productId +"']/image_pref");
		
		$scope.product.category = Common_getItemInner(database,"//item[@id='"+ productId +"']/category");
		let numOfImg = parseInt(Common_getItemInner(database,"//item[@id='"+ productId +"']/image_num"));
		
		let mylink = (Common_getItemInner(database,"//item[@id='"+ productId +"']/link_to_first_info"));
		$scope.product.firstInfo = Common_getItemInner(database,mylink);
		mylink = (Common_getItemInner(database,"//item[@id='"+ productId +"']/link_to_add_info"));
		$scope.product.addInfo = Common_getItemInner(database,mylink);
		mylink = (Common_getItemInner(database,"//item[@id='"+ productId +"']/link_to_prod_info"));
		$scope.product.prodInfo = Common_getItemInner(database,mylink);
		mylink = Common_getItemInner(database,"//item[@id='"+ productId +"']/item_is_pattern");
		if (mylink=="yes")
			$scope.product.patternIsItem=true;
		else
			$scope.product.patternIsItem=false;
		
		
		if(!isNaN(numOfImg))
			$scope.product.numOfImg = numOfImg;
		////////////////////////////////////////////////////////////////////////////////////////////
		let variant = Common_getItemInner(database,"//item[@id='"+ productId +"']/variants");
		if(variant!=null)
		{
			$scope.product.hasVariants = true;
			let nodes = database.evaluate('products/variants/' + variant+ '/item', database, null, XPathResult.ANY_TYPE, null);
			let tags =  nodes.iterateNext();
			while(tags){
			let pattern = {img:"", id:tags.id, description:"",price: 0};
			
			pattern.img = Common_getItemInner(database,"//item[@id='"+tags.id+"']/image");
			
			pattern.description = Common_getItemInner(database,"//item[@id='"+ tags.id+"']/description/hu");
			
			pattern.price = parseInt(Common_getItemInner(database,"//item[@id='"+ tags.id+"']/price/huf"));
			
				$scope.patterns.push(pattern);
				tags = nodes.iterateNext();
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
				
			},100);    

		
			
	}
});
















