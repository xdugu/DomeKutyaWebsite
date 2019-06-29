//This script is mainly called by the "Shopping" pages like Shop, basket and order confirmation

//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

var currentVersion=5;//add dog's name variable

var shopping={ contact:{firstName:"",lastName:"",email:"",address1:"",address2:"",city:"",
				country:"default",number:"",postCode:"", countryCode:"", dogsName:"", 
				lang:"hu"},
				currency:"HUF", paymentMethod:"bankTransfer", lastBasketSize: 0
}
	






//To ensure continuity of user experience, this function is called on every page to update the items in the Basket
function Shop_refreshBasket()
{
	let old=localStorage.getObj("order");
	if (old!=null){//old local storage item tobe removed
		localStorage.removeItem("order");
	}
	let savedVersion = parseInt(localStorage.getItem("version"));//This is important so we know to refresh everything if we have just updated the software
	let myOrder=localStorage.getObj("shopping");
	
	if(myOrder==null || isNaN(savedVersion) || savedVersion<currentVersion)
	{
		myOrder=shopping;
		localStorage.setObj("shopping",myOrder);
		localStorage.setItem("version", currentVersion.toString());
	}
	Common_checkLang();
	
	if (myOrder.lastBasketSize>0)
	{
		$(".basket-num").html(myOrder.lastBasketSize);
	}
	else
		$(".basket-num").html('');
}

function Shop_updateBasketSize(len){//function is called to store the last given basket size
	if(len>0)
		$(".basket-num").html(len);	
	else
		$(".basket-num").html('');
	
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
		case "Switzerland":
			return "CH";
		case "Romania":
			return "RO";
		case "Italy":
			return "IT";
		case "Slovakia":
			return "SK";
		default:
			return "HU";
		
	}
}



	






