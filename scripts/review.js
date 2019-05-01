//This script is mainly called by the "Shopping" pages like Shop, basket and order confirmation

//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}


var paypalObject, totalAsString;

var app = angular.module('myApp', []);
app.run(function() {
// Trigger input event on change to fix auto-complete
$('input, select').on('change',function() { $(this).trigger('input'); });
});
app.controller('Review', function($scope, $http, $timeout) {
	$scope.shopping = localStorage.getObj("shopping");
	$scope.basketId = localStorage.getObj("basketId");
	$scope.order={};
	$scope.temp = {comments:""};
	$scope.sourceUrl = ""
	
	$scope.backbone =  {showPaypalReceipt:false, showBank:false, showConfirmed:false, showPayLater:false};
	//////////////////////////////////////////////
	$scope.currency = $scope.shopping.currency;
	 $http({
				method: 'POST',
				crossDomain : true,
				url: 'https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v2/Request/Basket/GetBasket',
				data: JSON.stringify({basketId:$scope.basketId, includeCost: true, country:$scope.shopping.contact.country, currency: $scope.currency}),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(res.data.Result=="OK"){
					let temp = res.data.data;
					$scope.order = temp.Item;
					$(".basket-num").html( temp.Item.Items.length);
				}
			});
	
	
	//$("#paypal").attr({src: $scope.sourceUrl});
	
	
	
	
	
	///////////////////////////////////////////////
	$scope.updatePaymentMethod = function(method){
		//$scope.order = Shop_updatePaymentMethod(method);
			//Shop_finishedShopping();
			//localStorage.removeItem("user");
			$scope.createOrderCode();
			$scope.shopping['comments']=$scope.temp.comments;
			$scope.shopping['basketId']= $scope.basketId;
			$scope.shopping['requestType']="SubmitOrder";
			$scope.shopping.paymentMethod = method;
			$http({
				method: 'POST',
				crossDomain : true,
				url: 'https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v2/Request/SubmitOrder',
				data: JSON.stringify($scope.shopping),
				headers: {'Content-Type': 'application/json'}
			});
		
	}
	
	$scope.createOrderCode = function (){
		let currDate = new Date();
		let str = currDate.getFullYear() + Common_pad(currDate.getMonth()+1) + Common_pad(currDate.getDate()) + $scope.shopping.contact.firstName;
		let pos = str.search(" ");//We will take only the first or last name as part of the reference
		if(pos>0){
			str = str.substring(0,pos);
		}
		$scope.shopping.orderCode = str;
	}
	
	$scope.backButtonPressed = function (){
		if( $scope.backbone.showConfirmed==true)
		{
			window.location.href = 'index.html';
		}
		else
		{
			$scope.backbone.showBank=false;
			$scope.backbone.showPayLater=false;
		}
			
	}
	
	$scope.confirmOrder = function(){
		
		
	}
	var script = document.createElement("script");
	script.src = "https://www.paypal.com/sdk/js?client-id=AXIR5FN2_aHZDPJ0B04WvLl7gtekClOeAInB4B6t4Gt8AgzHW6cHsxhpjle6S1dXc0TlwckcxtwIpnPe&currency="+ $scope.currency;
	
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
				value:  $scope.order.Costs.total.toString(),
				currency_code: $scope.currency,		
				breakdown: {
				  item_total: {
					  value: $scope.order.Costs.subTotal.toString(),
					  currency_code: $scope.currency
				  },
				  shipping: {
					  value: $scope.order.Costs.delivery.toString(),
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
			  items: createPayPalObject($scope.currency, $scope.order.Items),
			  shipping:{
				name:{full_name: $scope.shopping.contact.firstName},
				address: {
				  address_line_1: $scope.shopping.contact.address1,
				  address_line_2: $scope.shopping.contact.address2,
				  admin_area_2: $scope.shopping.contact.city,
				  country_code: 'HU',
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
			alert('Transaction completed by ' + details.payer.name.given_name);
			$scope.backbone.showPaypalReceipt=true;
				$scope.$apply();
		  });
		}}).render('#paypal-button');
	}
	document.head.appendChild(script);
  
});

function createPayPalObject(currency,obj)
{
	myContainer = [];
	for(let i=0; i<obj.length; i++)
	{
		let itemName =  obj[i].Description.hu;
		let wholeId = obj[i].ItemId;
		if(obj[i].Variants.hasVariants)
			wholeId +=","+obj[i].Pattern.PatternId;
		let price ={value:"",currency_code:currency};
		if(currency=='HUF')
			price.value = obj[i].Price.huf.toString();
		else
			price.value = obj[i].Price.eur.toString();
		
		myContainer.push({name:itemName,sku:wholeId,unit_amount:price,quantity:obj[i].Quantity.toString(), currency:currency, category:'PHYSICAL_GOODS'});		
	}
	
	return myContainer;
	
}


	
	






