//This script is mainly called by the "Shopping" pages like Shop, basket and order confirmation

//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}


var paypalObject, totalAsString;

var app = angular.module('AduguShopApp', []);
app.run(function() {
	// Trigger input event on change to fix auto-complete
	$('input, select').on('change',function() { $(this).trigger('input'); });
});
app.controller('Review', ['$scope', 'ApiManager', function($scope, ApiManager) {
	$scope.shopping = localStorage.getObj("shopping");
	$scope.basketId = localStorage.getObj("basketId");
	$scope.order={};
	$scope.temp = {comments: null};
	$scope.sourceUrl = ""

	$scope.$on('$includeContentLoaded', function () {
		Shop_refreshBasket();
	});
	
	$scope.backbone =  {showPaypalReceipt:false, showBank:false, showConfirmed:false, showPayLater:false};
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
			
			ApiManager.post('open', 'update/basket/order', null, {
							orderDetails: $scope.shopping, 
							storeId: $scope.config.storeId, 
							basketId:$scope.basketId});
			localStorage.removeItem("shopping");
			localStorage.removeItem("basketId");
	}
	

	$scope.backButtonPressed = function (){
		if( $scope.backbone.showConfirmed==true || $scope.backbone.showPaypalReceipt==true )
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

		item.Combination.forEach(function(combi){
			itemCombi.push(combi.name);
		});

		for(let i = 0; i <  item.Variants.combinations.length; i++){
			let combi = item.Variants.combinations[i];
		   if(JSON.stringify(combi.combination) == JSON.stringify(itemCombi) &&
			   combi.linkedImage != null){
			   return combi.linkedImage;
		   }
		}

		return item.Images.list[0].name;
   }
   
	

	var script = document.createElement("script");
	paypalIdTest = "AXIR5FN2_aHZDPJ0B04WvLl7gtekClOeAInB4B6t4Gt8AgzHW6cHsxhpjle6S1dXc0TlwckcxtwIpnPe";
	paypalIdLive = "AXb7KnR0LgCQXoWW4uo9XDxgCJVx4cpKUEHJSDUeSRPTZCoHnb7kV0Vd-4MMRWX1Z3-yXfV2Z7k44MTO";
	script.src = "https://www.paypal.com/sdk/js?client-id=" + paypalIdTest + "&currency="+ $scope.currency;
	
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
				value:  $scope.order.Costs[$scope.shopping.deliveryMethod].total.toString(),
				currency_code: $scope.currency,		
				breakdown: {
				  item_total: {
					  value: $scope.order.Costs[$scope.shopping.deliveryMethod].subTotal.toString(),
					  currency_code: $scope.currency
				  },
				  shipping: {
					  value: $scope.order.Costs[$scope.shopping.deliveryMethod].delivery.toString(),
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


	
	






