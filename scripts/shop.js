//This script is mainly called by the "Shopping" pages like Shop, basket and order confirmation

//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

var currentVersion=3;

order={ items:[], 
		subTotal:0, 
		currency: "HUF",
		delivery:0,
		total:0,
		discount: 0,
		lang:"",
		orderPaid:false,
		paymentMethod: "bankTransfer",
		orderCode:"",
		payOnDeliveryAdditional:0,
		contact:{firstName:"",lastName:"",email:"",address1:"",address2:"",city:"",country:"default",number:"",postCode:"", countryCode:""}
	
};

var deliveryData={
	"stepsAndRamps":
			{
				"HU":{"payOnDelivery":2500,"bankTransfer":2200},
				"UK":{"bankTransfer":7000},
				"OTH":{"bankTransfer":6000},
				"pricing":"individual"
			}
		,
	"myBullDog":
			{
				"HU":{"payOnDelivery":2500,"bankTransfer":2200},
				"OTH":{"bankTransfer":6000},
				"UK":{"bankTransfer":7000},
				"pricing":"grouped"				
			}
		,
	"beHappy":
			{
				"HU":{"payOnDelivery":750,"bankTransfer":450},
				"OTH":{"bankTransfer":6000},
				"UK":{"bankTransfer":7000},
				"pricing":"grouped"
			}	
		
	
	
};


//Called when customer wants to add an item into the basket
function Shop_addToBasket(itemToAdd)
{
		let prod = {stepId:"",patternId:"",quantity:1,price:0,patternPrice:0,stepImg:"",patternImg:"",description:"",hasVariant:false,patternIsItem:false,delivery:0,category:"",id:""};
		let myOrder=localStorage.getObj("order");
		let myBasket = myOrder.items;
		
		prod = Common_mergeObject(prod, itemToAdd);
		
		idMatched=false;

			myBasket.forEach(function(item, index, array) {
			if(item.stepId==prod.stepId && item.patternId==prod.patternId)
			{
				item.quantity+=prod.quantity;
				idMatched=true;
			}
		});
			if(idMatched==false)//if we currently don't have the id of the item
				 myBasket.push(prod);

		localStorage.setObj("order",myOrder);
		Shop_refreshBasket();	
		return myOrder;

	
}

//To ensure continuity of user experience, this function is called on every page to update the items in the Basket
function Shop_refreshBasket()
{
	let myOrder=localStorage.getObj("order");
	if(myOrder==null)
	{
		myOrder=order;
		localStorage.setObj("order",myOrder);

	}
	let savedVersion = parseInt(localStorage.getItem("version"));
	if(isNaN(savedVersion) || savedVersion<currentVersion)
	{
		localStorage.removeItem("order");
		localStorage.setObj("order",order);
		localStorage.setItem("version", currentVersion.toString());
		myOrder = order;
	}
	
	let myBasket= myOrder.items;
	let totalQuantity=0;
	for(let i=0; i<myBasket.length; i++)
	{
		totalQuantity+=myBasket[i].quantity;		
	}	
	
	if (totalQuantity>0)
	{
		$(".basket-num").html(totalQuantity);
	}
	else
		$(".basket-num").html('');
}


//Called to increment or decrement the quantity of an item in the shopping basket
function Shop_changeQuantity(item,changeBy)
{
	let myOrder=localStorage.getObj("order");
	let myBasket=myOrder.items;
	
	for(let i=0; i<myBasket.length; i++)
	{
		if(item.stepId==myBasket[i].stepId && item.patternId==myBasket[i].patternId)
		{
			myBasket[i].quantity +=changeBy;
			if(myBasket[i].quantity<=0)
				myBasket[i].quantity=1;
		}		
	}	
	//myOrder = Shop_updateTotal(myOrder);
	localStorage.setObj("order",myOrder);
	Shop_refreshBasket();
	return myOrder;
}

function Shop_removeItem(id)
{
	let myOrder=localStorage.getObj("order");
	let myBasket=myOrder.items.splice(id,1);
	
	//myOrder = Shop_updateTotal(myOrder);
	localStorage.setObj("order",myOrder);
	Shop_refreshBasket();
	return myOrder;
}

//called after customer has paid for items, then we clear the local storage
function Shop_finishedShopping()
{
	localStorage.removeItem("order");
}

//This function is called to update the data in the item. It calls the products.xml file
function Shop_fillItemData()
{
	
	$.get('/res/products.xml','text').done(function (library){
		let myOrder=localStorage.getObj("order");
		let myBasket=myOrder.items;
		for(let i=0;i<myBasket.length;i++)
		{

			let specificItem = Common_getItemInner(library,"//item[@id='"+ myBasket[i].stepId +"']/description/en") + " ";
			specificItem+= Common_getItemInner(library,"//item[@id='"+ myBasket[i].stepId +"']/dimension");

			if( window.location.href.search('/en/')>0)
			{
				myBasket[i].description = specificItem;
			}
			else myBasket[i].description = Common_getItemInner(library,"//item[@id='"+myBasket[i].stepId+"']/description/hu");
			
			
			myBasket[i].price = parseFloat(Common_getItemInner(library,"//item[@id='"+ myBasket[i].stepId+"']/price/huf"),10);
			if(myBasket[i].hasVariant)
					myBasket[i].price += parseFloat(Common_getItemInner(library,"//item[@id='"+ myBasket[i].patternId+"']/price/huf"),10);
			
			if(myBasket[i].patternIsItem)
				myBasket[i].stepImg = Common_getItemInner(library,"//item[@id='"+ myBasket[i].patternId+"']/image")+ "/img_1.jpg"
			else
			{
				myBasket[i].stepImg = Common_getItemInner(library,"//item[@id='"+ myBasket[i].stepId+"']/image")+ "/img_1.jpg";
				specificItem = Common_getItemInner(library,"//item[@id='"+ myBasket[i].patternId +"']/description/en");
			}

			if( window.location.href.search('/en/')>0)
			{
				myBasket[i].description += (", " + specificItem);
			}
			else myBasket[i].description += (", " + Common_getItemInner(library,"//item[@id='"+myBasket[i].patternId+"']/description/hu"));
			myBasket[i].patternImg = Common_getItemInner(library,"//item[@id='"+ myBasket[i].patternId+"']/image")+ "/img_1.jpg";
			
			myBasket[i].description=myBasket[i].description.replace('<br/>',' ');
			myBasket[i].description=myBasket[i].description.replace('<br/>',' ');
			myBasket[i].description=myBasket[i].description.replace('null',' ');
		}
			
			
			localStorage.setObj("order", Shop_updateTotal(myOrder));			
		
	});
	
}

function Shop_updateContact(contact){
	let myOrder=localStorage.getObj("order");
	myOrder.contact=contact;
	let res= Shop_updateTotal(myOrder);
	localStorage.setObj("order", myOrder);
	
	return myOrder;
}

function Shop_updatePaymentMethod(method){
	let myOrder=localStorage.getObj("order");
	myOrder.paymentMethod = method;
	localStorage.setObj("order",Shop_updateTotal(myOrder));
	return myOrder;
}
//
async function Shop_updateTotal(myOrder)
{
	//res = await $.post("https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v1/Request/CalculatePrice",myOrder);
	
	try{
			res = await $.ajax({
		  type: "POST",
		  url: "https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v1/Request/CalculatePrice",
		  data: JSON.stringify(myOrder),
		  dataType: "json"
		});
	} catch(error)
	{
		return myOrder;
	}
	return res.data;
}

	






