//This script is mainly called by the "Shopping" pages like Shop, basket and order confirmation

//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

var shopping;
//To ensure continuity of user experience, this function is called on every page to update the items in the Basket
function Shop_refreshBasket()
{
	Common_getShopConfig().then(function(config){
		let savedVersion = parseInt(localStorage.getItem("version"));//This is important so we know to refresh everything if we have just updated the software
		let myOrder = localStorage.getObj("shopping");
		let currentVersion = config.version;
		
		if(myOrder==null || isNaN(savedVersion) || savedVersion < currentVersion)
		{
			myOrder = config.shopping;
			localStorage.setObj("shopping", myOrder);
			localStorage.setItem("version", currentVersion.toString());
		}
		Common_checkLang();
		
		if (myOrder.lastBasketSize>0)
		{
			$(".basket-num").show();
			$(".basket-num").html(myOrder.lastBasketSize);
		}
		else{
			$(".basket-num").html('');
			$(".basket-num").hide();
		}
	})
	
}

function Shop_updateBasketSize(len){//function is called to store the last given basket size
	if(len>0){
		$(".basket-num").show();
		$(".basket-num").html(len);	
	}
	else
		$(".basket-num").hide();
	
	let myOrder=localStorage.getObj("shopping");
	myOrder.lastBasketSize = len;
	localStorage.setObj("shopping",myOrder);
}

function Shop_updateCurrency(curr){	
	let myOrder=localStorage.getObj("shopping");
	myOrder.currency = curr;
	localStorage.setObj("shopping",myOrder);
	location.reload();//Reload to ensure we correctly update page
}

//As required by paypal, returns the country code
function Shop_getCountryCode(country){
	
	switch(country){
		
		case "Hungary":
			return "HU";
		case "Germany":
			return "DE";
		case "UK":
			return "GB";
		case "Switzerland":
			return "CH";
		case "France":
			return "FR";
		case "Romania":
			return "RO";
		case "Italy":
			return "IT";
		case "Slovakia":
			return "SK";
		case 'Austria':
			 return "AT";
		default:
			return "HU";
		
	}
}



	






