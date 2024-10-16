

angular.module('AduguShopApp').filter('myTranslator', function() {
	return function (id, lang){
		return dict[lang][id];
	}
});

var dict = {
	en:{
		'accessories': "Accessories with this item",
		'and': 'and',
		'or': 'or',
		'okay': 'Okay',
		'add-to-basket': 'Add To Basket',
		'out-of-stock': 'Out of stock',
		'added-to-basket': 'Item has been added to basket',
		'description': 'Product Description',
		'delivery': 'Delivery',
		'returns': 'Returns',
		'stairs': 'Stairs',
		'ramps': 'Ramps',
		'customer-photos': 'Customer Photos',
		'more': 'More',
		'title-home': 'Dome Kutya | Dog Stairs and Ramps Shop',
		'close': 'Close',
		'about-us': 'About Us',
		'settings': 'Settings',
		'contact': 'Contact',
		'contact-us': 'Contact Us',
		'use-of-personal-data': 'Use of personal data',
		'legal-information': 'Legal Information',
		'contact-for-pricing': 'Contact us for pricing',
		'invalid-text': 'Invalid text or empty',
		'your-basket': 'Your Basket',
		'basket-is-empty': 'Your basket is empty',
		'choose-country': 'Choose country',
		'HU': 'Hungary',
		'DE': 'Germany',
		'italy':'Italy',
		'CH': 'Switzerland',
		'RO':'Romania',
		'france':'France',
		'united kingdom': 'United Kingdom',
		'SK': 'Slovakia',
		'AT': "Austria",
		'choose-courier': 'Choose Courier',
		'remove': 'Remove',
		'subtotal': 'Subtotal',
		'total': 'Total',
		'proceed-to-payment': 'Proceed To Payment',
		'proceed-to-checkout': 'Proceed to checkout',
		'cookie-settings': 'Cookie Settings',
		'contact-info': 'Contact Information',
		'full-name': 'Full Name',
		'dogs-name': "Your dog's name",
		'email': 'email address',
		'telephone': 'Telephone Number',
		'delivery-information': 'Delivery Information',
		'address': 'Your address line',
		'postcode': 'Post Code',
		'city': 'City',
		'required': 'Required',
		'order-review': 'Review',
		'quantity': 'Quantity',
		'deliver-to': 'Deliver To',
		'comments': 'Comments',
		'max-length': 'Maximum Length ',
		'bank-transfer': 'Bank Transfer',
		'pay-on-delivery': 'Pay On Delivery',
		'order-confirmation': 'Order Confirmation',
		'confirm': 'Confirm',
		'topic': 'Topic',
		'send-message': 'Send Request',
		'introduction': 'Introduction',
		'terms': 'General Terms & Conditions',
		'shipping-and-delivery': "Shipping & Delivery",
		"use-of-cookies": "Use Of Cookies",
		'dog-beds': 'Dog beds',
		"dog-lofts": 'Dog Lofts',
		'contact-confirm': 'Thank you. We will reply back soon',
		'contact-fail': 'We are sorry that something went wrong. Please try again later :-(',
		'failure': 'Failure',
		'in-stock' : 'In Stock',
		'discount' : 'Discount',
		'coupon-code': 'Coupon Code',
		'apply-code': 'Apply Code',
		'payment-provider': 'Card payment service provider',
		'accepted-cards': 'Accepted Cards',
		'cib-payment-info': 'CIB payment information',
		'cib-faq': 'CIB payment FAQs',
		'transaction-id': 'Transaction ID',
		'transaction-result-code': 'Transaction result code',
		'transaction-result-text': 'Transaction result text',
		'authorisation-number': 'Authorisation number',
		'reset':'Reset',
		'pay-by-card': 'Pay by credit/debit card',
		'dog-clothes': 'Accessories',
		'beds': 'Beds'
	},
	hu:{
		'accessories': "Kiegészítők ehhez a termékhez",
		'and': 'és',
		'or': 'vagy',
		'okay': 'Rendben',
		'add-to-basket': 'Kosárba rakom',
		'out-of-stock': 'Nincs készlete',
		'added-to-basket': 'A termék a kosaradba került',
		'description': 'Leírás',
		'delivery': 'Szállítás',
		'returns': 'Áruvisszaküldés',
		'stairs': 'Lépcsők',
		'ramps': 'Rámpák',
		'customer-photos': 'Vásárlói képek',
		'more': 'Több',
		'title-home': 'Dome Kutya | Kutya lépcso és rámpa web uszlet',
		'close': 'Bezár',
		'about-us': 'Rólunk',
		'settings': 'Beállítások',
		'contact': 'Kapcsolat',
		'contact-us': 'Lépjen kapcsolatba velünk',
		'use-of-personal-data': 'Adatvédelmi nyilatkozat',
		'legal-information': 'Általános szerződési feltételek',
		'contact-for-pricing': 'Lépjen kapcsolatba velünk',
		'invalid-text': 'Érvénytelen szöveg',
		'your-basket': 'Kosár',
		'basket-is-empty': 'Az Ön kosara üres',
		'choose-country': 'Válasszon országot a szállítási költség kalkulálásához',
		'HU': 'Magyarország',
		'DE': 'Németország',
		'italy':'Olaszország',
		'CH': 'Svájc',
		'RO':'Románia',
		'france':'Franciaország',
		'united kingdom': 'Egyesült Királyság',
		'SK': 'Szlovákia',
		'AT': "Ausztria",
		'choose-courier': 'Válasszon futárt',
		'remove': 'Eltávolít',
		'subtotal': 'Részösszeg',
		'total': 'Végösszeg',
		'proceed-to-payment': 'Tovább a fizetéshez',
		'proceed-to-checkout': 'Tovább a fizetéshez',
		'cookie-settings': 'Sütik beállítása(Cookie)',
		'required': 'Megadása szükséges',
		'contact-info': 'Elérhetőség',
		'full-name': 'Név',
		'dogs-name': "A kutyád neve",
		'email': 'Email cím',
		'telephone': 'Telefonszám',
		'delivery-information': 'Szállítási információk',
		'address': 'Szállítási cím',
		'postcode': 'Irányítószám',
		'city': 'Város',
		'order-review': 'A kosár tartalma',
		'quantity': 'Mennyiség',
		'deliver-to': 'Címzett',
		'comments': 'Megjegyzés',
		'max-length': 'Maximális hossz ',
		'bank-transfer': 'Banki átutalás',
		'pay-on-delivery': 'Utánvétes fizetés',
		'order-confirmation': 'Rendelés megerősítése',
		'confirm': 'Megerősít',
		'topic': 'Téma',
		'send-message': 'Üzenet küldése',
		'introduction': 'Impresszum',
		'terms': 'Általános Szerződési Feltételek. (ÁSZF)',
		'shipping-and-delivery': "Szállítás és kézbesítés",
		"use-of-cookies": "Sütik",
		'dog-beds': 'Fekhelyek',
		"dog-lofts": 'Kutya galéria',
		'contact-confirm': 'Köszönjük. Hamarosan jelentkezünk.',
		'contact-fail': 'valami elromlott :-(',
		'failure': 'Valami hiba történt',
		'in-stock' : 'Raktáron',
		'discount' : 'Kedvezmény',
		'coupon-code': 'Kupon kód',
		'apply-code': 'Kuponkód érvényesítése',
		'payment-provider': 'Kártyás fizetés szolgáltatója',
		'accepted-cards': 'Elfogadott kártyák',
		'cib-payment-info': 'CIB bankkártyás fizetés',
		'cib-faq': 'CIB bankkártyás fizetés GYFK',
		'transaction-id': 'A tranzakció azonosítója',
		'transaction-result-code': 'A tranzakció eredményének kódja',
		'transaction-result-text': 'A tranzakció eredményének szöveges ismertetése',
		'authorisation-number': 'A tranzakció eredményének szöveges ismertetése',
		'reset': 'Visszaállítás',
		'pay-by-card': 'Fizetés bankkártyával',
		'dog-clothes': 'Kiegészítők',
		'beds': 'Kutyaágyak'
		
	}
}
  