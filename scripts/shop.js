//This script is mainly called by the "Shopping" pages like Shop, basket and order confirmation

//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

var currentVersion=4;

var shopping={ contact:{firstName:"",lastName:"",email:"",address1:"",address2:"",city:"",
				country:"default",number:"",postCode:"", countryCode:"", 
				lang:"hu"},
				currency:"HUF", paymentMethod:"bankTransfer", lastBasketSize: 0
}
	






//To ensure continuity of user experience, this function is called on every page to update the items in the Basket
function Shop_refreshBasket()
{
	let old=localStorage.getObj("order");
	if (old!=null){
		localStorage.removeItem("order");
	}
	let myOrder=localStorage.getObj("shopping");
	
	if(myOrder==null)
	{
		myOrder=shopping;
		localStorage.setObj("shopping",myOrder);

	}
	
	
	if (myOrder.lastBasketSize>0)
	{
		$(".basket-num").html(myOrder.lastBasketSize);
	}
	else
		$(".basket-num").html('');
}




	






