//This script is mainly called by the "Shopping" pages like Shop, basket and order confirmation

//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}


var paypalObject, totalAsString;

var app = angular.module('AduguShopApp', ['ngSanitize']);
app.run(function() {
	// Trigger input event on change to fix auto-complete
	$('input, select').on('change',function() { $(this).trigger('input'); });
});
app.controller('Review', ['$scope', 'ApiManager', '$location', function($scope, ApiManager, $location) {
	$scope.shopping = localStorage.getObj("shopping");
	$scope.basketId = localStorage.getObj("basketId");
	$scope.removeExtension = Common_removeExtension;
	$scope.order={};
	$scope.temp = {comments: null};
	$scope.sourceUrl = "";
	$scope.popUpInfo = {};

	$scope.$on('$includeContentLoaded', function () {
		Shop_refreshBasket();
	});
	
	$scope.backbone =  {showPaypalReceipt:false, showCibReceipt:false, showBank:false, showCardRedirectOption: false,
							showConfirmed:false, showPayLater:false, showPaymentFailed: false};
	$scope.backbone.lang= $scope.shopping.contact.lang;//for choosing of language
	//////////////////////////////////////////////
	$scope.currency = $scope.shopping.currency;

	Common_getShopConfig().then(function(res){
		$scope.config = res;
		ApiManager.post('open', 'get/basket', null, {
							basketId:$scope.basketId, 
							storeId: $scope.config.storeId, 
							countryCode:Shop_getCountryCode($scope.shopping.contact.country), 
							currency:$scope.currency 
						}).then(function(res){
						$scope.order = res.data;
						verifyCIBTransaction();
						Shop_updateBasketSize(res.data.Items.length);
		});
	});
	
	//////////Called to submit order/////////////////////////////////////
	$scope.updatePaymentMethod = function(method, details){

			$scope.shopping['comments']=$scope.temp.comments;
			$scope.shopping.paymentMethod = 'payBeforeDelivery';
			if(method == 'payOnDelivery'){
				$scope.shopping.paymentMethod = 'payOnDelivery';
				$scope.shopping.paymentType = 'payOnDelivery';
			}
			else
				$scope.shopping.paymentType = method;

			$scope.shopping.paymentDetails = details;
			
			// Data to be stored in database cannot have empty strings
			$scope.shopping = Common_removeEmptyStrings($scope.shopping);
			
			ApiManager.post('open', 'update/basket/order', null, {
							orderDetails: $scope.shopping, 
							storeId: $scope.config.storeId, 
							basketId:$scope.basketId});
			localStorage.removeItem("shopping");
			localStorage.removeItem("basketId");
	}
	

	$scope.backButtonPressed = function (){
		if( $scope.backbone.showConfirmed==true || $scope.backbone.showPaypalReceipt==true ||
			$scope.backbone.showCibReceipt == true )
		{
			window.location.href = 'index.html';
		}
		else
		{
			$scope.backbone.showBank=false;
			$scope.backbone.showPayLater=false;
		}
			
	}
	
	// will return the most appropriate image to be displayed
	$scope.getVariantImage = function (item){
		let itemCombi = [];

		//Check that item in basket does indeed have a chosen variant
		if(item.Combination !=null){
		   item.Combination.forEach(function(combi){
			   itemCombi.push(combi.name);
		   });
	   }
		for(let i = 0; i <  item.Variants.combinations.length; i++){
			let combi = item.Variants.combinations[i];
		   if(JSON.stringify(combi.combination) == JSON.stringify(itemCombi) &&
			   combi.linkedImage != null){
			   return combi.linkedImage;
		   }
		}

		return item.Images.list[0].name;
   }

   // cib transaction handler
   $scope.startCIBTransaction = function(){

	   // package the data we have now to start transaction
		$scope.shopping['comments']= $scope.temp.comments;
		$scope.shopping.paymentMethod = 'payBeforeDelivery';
		$scope.shopping.paymentType = 'cib';
		
		// Data to be stored in database cannot have empty strings
		$scope.shopping = Common_removeEmptyStrings($scope.shopping);
		$scope.shopping.url= $location.protocol() + '://' + $location.host() + `/${$scope.backbone.lang}/Review.html`;
		
		ApiManager.post('open', 'create/transaction', {storeId: $scope.config.storeId}, {
						orderDetails: $scope.shopping, 
						basketId: $scope.basketId
		}).then(res => {
			// we will receive a specific url to go to and this is what we will do
			$scope.popUpInfo = res.data;
			$scope.backbone.showCardRedirectOption = true;
		});

   }

   // called on every page reload to check if we have a cib transaction
   function verifyCIBTransaction(){
		let params = Common_parseUrlParam();

		if(params.PID != null && params.DATA != null){

			// we have a valid transaction parameter that we need to validate
			ApiManager.post('open', 'update/transaction', {storeId: $scope.config.storeId}, {
				cibResponse: params.DATA,
				basketId:$scope.basketId
			}).then(res => {
				// log returned params
				console.log(JSON.stringify(res.data));
				$scope.popUpInfo = res.data;
				$scope.backbone.showCibReceipt = true;
				localStorage.removeItem("shopping");
				localStorage.removeItem("basketId");

			}).catch(err =>{
				console.log(err);
				$scope.backbone.showPaymentFailed = true;
				$scope.popUpInfo = err.data.response;
				console.log(err.data);
			});
		}
   }
   
	
   	// add paypal script to site to accept payments
	var script = document.createElement("script");
	paypalIdTest = "AXIR5FN2_aHZDPJ0B04WvLl7gtekClOeAInB4B6t4Gt8AgzHW6cHsxhpjle6S1dXc0TlwckcxtwIpnPe";
	paypalIdLive = "AXb7KnR0LgCQXoWW4uo9XDxgCJVx4cpKUEHJSDUeSRPTZCoHnb7kV0Vd-4MMRWX1Z3-yXfV2Z7k44MTO";

	disableMethods = '&disable-funding=credit,bancontact,blik,eps,giropay,ideal,mercadopago,mybank,p24,sepa,sofort,venmo';

	if($scope.shopping.contact.countryCode == 'HU'){
		disableMethods += ',card';
	}
	script.src = "https://www.paypal.com/sdk/js?client-id=" + paypalIdLive + "&currency="+ $scope.currency + disableMethods;
	
	script.onload = function(){
	paypal.Buttons({

		createOrder: function(data, actions) {
		
		  return actions.order.create({
			payer:{
				email_address:  $scope.shopping.contact.email,
				phone: {
					phone_number:{
						national_number: $scope.shopping.contact.number.toString()
						}
				}
			},
			purchase_units: [{
			  amount: {
				value:  $scope.order.Costs[$scope.shopping.contact.countryCode][$scope.shopping.deliveryMethod].payBeforeDelivery.total[$scope.currency.toLowerCase()].toString(),
				currency_code: $scope.currency,		
				breakdown: {
				  item_total: {
					  value: $scope.order.Costs[$scope.shopping.contact.countryCode][$scope.shopping.deliveryMethod].payBeforeDelivery.subTotal[$scope.currency.toLowerCase()].toString(),
					  currency_code: $scope.currency
				  },
				  discount: {
					value: $scope.order.Costs[$scope.shopping.contact.countryCode][$scope.shopping.deliveryMethod].payBeforeDelivery.discount[$scope.currency.toLowerCase()].toString(),
					currency_code: $scope.currency
				 },
				  shipping: {
					  value: $scope.order.Costs[$scope.shopping.contact.countryCode][$scope.shopping.deliveryMethod].payBeforeDelivery.delivery[$scope.currency.toLowerCase()].toString(),
					  currency_code: $scope.currency
				  }
				}
			  },
			  description: 'Dome Kutya Order',
			  custom_id: $scope.basketId,
			  //invoice_number: '12345', Insert a unique invoice number
			  payment_options: {
				allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
			  },
			  soft_descriptor: 'Dome Kutya',
			  items: createPayPalObject($scope.currency, $scope.order.Items, $scope.shopping.contact.lang),
			  shipping:{
				name:{full_name: $scope.shopping.contact.firstName},
				address: {
				  address_line_1: $scope.shopping.contact.address1,
				  address_line_2: $scope.shopping.contact.address2,
				  admin_area_2: $scope.shopping.contact.city,
				  country_code: $scope.shopping.contact.countryCode,
				  postal_code: $scope.shopping.contact.postCode,
				}
			  }
				
			  
			}]
			//note_to_payer: 'Contact us at infodomelepcso@gmail.com for any questions on your order.'
		  });
		},
		onApprove: function(data, actions) {
		  // Capture the funds from the transaction
		  return actions.order.capture().then(function(details) {
			// Show a success message to your buyer
			$scope.updatePaymentMethod('paypal', details);
			$scope.backbone.showPaypalReceipt=true;
			$scope.$apply();
		  });
		}}).render('#paypal-button');
	}
	document.head.appendChild(script);
  
}]);

function createPayPalObject(currency,obj,lang)
{
	myContainer = [];
	for(let i=0; i<obj.length; i++)
	{
		let itemName =  obj[i].Title[lang];
		let wholeId = obj[i].ItemId;

		if(obj[i].Variants.variants.length > 0){
			//wholeId +=","+obj[i].Pattern.PatternId;
			for(let j = 0; j < obj[i].Combination.length; j++){
				let combi = obj[i].Combination[j];
				if(combi.hasOwnProperty('chosenVariant')){
					wholeId += ',' + combi.chosenVariant.Title[lang];
				}
				else
					wholeId += ',' + combi.text[lang];
			}
		}
		let price ={value:"",currency_code:currency};

		price.value = obj[i].Price[currency.toLowerCase()].toString();
		
		myContainer.push({name:itemName,sku:wholeId,unit_amount:price,quantity:obj[i].Quantity.toString(), currency:currency, category:'PHYSICAL_GOODS'});		
	}
	
	return myContainer;
	
}


	
	






