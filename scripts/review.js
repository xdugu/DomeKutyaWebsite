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
app.controller('Review', function($scope, $http) {
	$scope.shopping = localStorage.getObj("shopping");
	$scope.basketId = localStorage.getObj("basketId");
	$scope.order={};
	$scope.temp = {comments:""};
	
	$scope.backbone =  {showPaypalReceipt:false, showBank:false, showConfirmed:false, showPayLater:false};
	//////////////////////////////////////////////
	$scope.currency = shopping.currency;
	 $http({
				method: 'POST',
				crossDomain : true,
				url: 'https://0j7ds3u9r6.execute-api.eu-central-1.amazonaws.com/v2/Request/Basket/GetBasket',
				data: JSON.stringify({basketId:$scope.basketId, includeCost: true, country:$scope.shopping.contact.country}),
				headers: {'Content-Type': 'application/json'}
			}).then(function(res){
				if(res.data.Result=="OK"){
					let temp = res.data.data;
					$scope.order = temp.Item;
					$(".basket-num").html( temp.Item.Items.length);
				}
			});
	
	
	
	
	
	
	
	
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
	
	paypal.Button.render({
				// Configure environment
				env: 'sandbox',
				client: {
				  sandbox: 'ASI3d7KzALQpAbEV15c_bf07VmOIm0sYmPDSgnHM-BVlOfDRmNVOPkJswGmzawaQTPt4xpxdZ6jFEpLe',
				  production: 'demo_production_client_id'
				},
				style: {
				  size: 'large',
				  color: 'blue',
				  shape: 'rect',
				},
				// Set up a payment
		payment: function(data, actions) {
		  return actions.payment.create({
			transactions: [{
			  amount: {
				total:  $scope.order.Costs.total.toString(),
				currency: $scope.currency,		
				details: {
				  subtotal: $scope.order.Costs.subTotal.toString(),
				  shipping: $scope.order.Costs.delivery.toString()
				}
			  },
			  description: 'Dome Kutya Order',
			  custom: $scope.basketId,
			  //invoice_number: '12345', Insert a unique invoice number
			  payment_options: {
				allowed_payment_method: 'INSTANT_FUNDING_SOURCE'
			  },
			  soft_descriptor: 'Dome Kutya',
			  item_list: {
				items: createPayPalObject($scope.currency, $scope.order.Items),
				shipping_address: {
				  recipient_name: $scope.shopping.contact.firstName,
				  line1: $scope.shopping.contact.address1,
				  line2: $scope.shopping.contact.address2,
				  city: $scope.shopping.contact.city,
				  country_code: 'HU',
				  postal_code: $scope.shopping.contact.postCode,
				  phone: $scope.shopping.contact.number,
				}
			  }
			}],
			note_to_payer: 'Contact us at infodomelepcso@gmail.com for any questions on your order.'
		  });
		},
						// Execute the payment
						onAuthorize: function(data, actions) {
						  return actions.payment.execute().then(function() {
							// Show a confirmation message to the buyer
							//window.alert('Thank you for your purchase!');
							$scope.backbone.showPaypalReceipt=true;
							$scope.$apply();
						  });
						}
					  }, '#paypal-button');
  
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
		
		if(currency=='HUF')
			price = obj[i].Price.huf.toString();
		else
			price = obj[i].Price.eur.toString();
		
		myContainer.push({name:itemName,sku:wholeId,price:price,quantity:obj[i].Quantity.toString(), currency:currency});		
	}
	
	return myContainer;
	
}


	
	






