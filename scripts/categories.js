//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

products =  "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+
			"<clothes><mens><shirts>" +
			"<item id=\"SHIRT-MEN-01\">" +
			"<description> <en>Stylish african shirts</en> <hu>Szep Ghanai nadrag</hu></description>" +
			"<image>images/shop/men/shirt_men_01</image>" +
			"<price><huf>5200</huf></price>" +		 
			"<sizes>S,M,L</sizes>" +
			"<categories>shirt</categories></item> </shirts>" +
			"<shorts><item id=\"SHORT-MEN-01\"><description><en>Stylish african shorts</en><hu>Szep Ghanai nadrag</hu></description>" +
			"<image>images/shop/men/short_men_01</image><price><huf>11800</huf></price><sizes>S,M,L</sizes><categories>short</categories></item></shorts></mens>" +
			"</clothes>";

var categoryName="steps";

var app = angular.module('myApp', ['ngSanitize']);
app.controller('Categories', function($scope, $http, $timeout, $location) {
	$scope.products=[];
	//Language stuff
	$scope.backbone = {lang:null};
	$scope.backbone.lang= localStorage.getObj("lang");//for choosing of language	
	$scope.changeLanguage = Common_changeLanguage;
	/////////////////////////////////
	$http.get('/res/products.xml').then(function(library){
		fillTemplate(library.data);
	});
	
	
	function fillTemplate(library){
		let myPath = window.location.href; //we willuse the path name later to determine the language
		let path= getProductPath();
		$scope.category = categoryName;
		parser = new DOMParser();
		library = parser.parseFromString(library,"text/xml");
		let nodes = library.evaluate(path, library, null, XPathResult.ANY_TYPE, null);
		let tags =  nodes.iterateNext();
		while(tags){
			let product = {description:"",price:"",imgSrc:"",href:"",imgPref:""};
			product.href = 'ProductPage.html?id=' + tags.id;
			
		let specificItem = Common_getItemInner(library,"//item[@id='"+ tags.id +"']/description/en");
		if(specificItem==null)
			return;
		if($location.absUrl().search('/en/')>0)
		{
			product.description = specificItem;
		}
		else product.description = Common_getItemInner(library,"//item[@id='"+tags.id+"']/description/hu");
		
		product.dimension = Common_getItemInner(library,"//item[@id='"+ tags.id+"']/dimension");
		
		product.price = Common_getItemInner(library,"//item[@id='"+ tags.id+"']/price/huf");
		
		product.imgSrc = Common_getItemInner(library,"//item[@id='"+ tags.id +"']/image");
		
		product.imgPref = Common_getItemInner(library,"//item[@id='"+ tags.id +"']/image_pref");
		
		
		
			$scope.products.push(product);
			tags = nodes.iterateNext();
		}
		
		
		$timeout(function (){		
			if($scope.products[0].imgPref=="width")
			{
				$('.shop_img').css({width:"100%",height:"auto"});
				
			}
		}, 100);
		
	}


});

//this function is called to get the search string rquired for xpath xml query and will also set the header
//depending on the language
function getProductPath()
{
	let pathname = window.location.href;
	
	if(pathname.search("steps")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('Lépcsők');
		else 
			$('#category-name').append('Lépcsők');
		categoryName = "steps"
		return "products/steps/item";
	}
	if(pathname.search("ramps")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('Rámpák');
		else 
			$('#category-name').append('Rámpák');
		categoryName = "ramps"
		return "products/ramps/item";
	}
	if(pathname.search("mybulldog")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('My Bulldog');
		else 
			$('#category-name').append('My Bulldog');
		categoryName = "mybulldog"
		return "products/mybulldog/item";
	}
	if(pathname.search("others")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('Bújózsák és Babzsák');
		else 
			$('#category-name').append('Bújózsák és Babzsák');
		categoryName = "Bújózsák és Babzsák"
		return "products/others/item";
	}
	if(pathname.search("behappy")>0){
		if(pathname.search("/en")>0)
			$('#category-name').append('BeHappy');
		else 
			$('#category-name').append('BeHappy');
		categoryName = "BeHappy"
		return "products/behappy/item";
	}

	
	
}

















