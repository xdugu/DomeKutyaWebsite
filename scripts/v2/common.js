//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

var fixedMenu=false;
var shopConfig = null;

// returns a promise which when successful contains data of the shopping config
function Common_getShopConfig(){
	return  new Promise(function(resolve, reject){
		if(shopConfig != null)
			resolve(shopConfig);
		else {
			$.get('/config.json', function(res){
				shopConfig = res;
				resolve(shopConfig);
			}).fail(function(err){
				reject(err);
			});
		}
	});

	
}

function Common_sideBar(state){
	if(state == 'toggle')
		$('#sidebar').toggle();
	else if(state == 'on')
		$('#sidebar').show();
   else
	  $('#sidebar').hide();
}

$(document).ready(function() {	
		checkCookie();
}); 

function checkCookie(){
	
	  window.dataLayer = window.dataLayer || [];
	  // ga enabled by default
	  window['ga-disable-UA-131830139-2'] = false;
	  
	 let useCookie = localStorage.getItem("useCookie");

	if (useCookie == "false")
		 window['ga-disable-UA-131830139-2'] = true;

		 
	  function gtag(){dataLayer.push(arguments);}
	  gtag('js', new Date());
	  gtag('config', 'UA-131830139-2', { 'anonymize_ip': true });

}


//Sanity to check to make sure we always reflect the right languages. Called on every page refresh
function Common_checkLang(){
	let shopping=localStorage.getObj("shopping");
	let path = window.location.href;
	if (path.search("/hu/")>0 && shopping.contact.lang!=="hu"){
		shopping.contact.lang="hu";
		localStorage.setObj("shopping",shopping);
	}
	else if(path.search("/en/")>0 && shopping.contact.lang!=="en"){
		shopping.contact.lang="en";
		localStorage.setObj("shopping",shopping);
	}	
}

// Get current language of website
function Common_getLang(){
	let path = window.location.href;

	if (path.search("/hu/") > 0)
		return "hu"
	else if(path.search("/en/") > 0)
		return 'en';
	else
		return 'hu';
}

function Common_menuClicked()
{
	$("#mobile-submenu").toggle();
	$("#mobile-submenu .toHide").hide();
}


function Common_changeCookie(setting){
	localStorage.setItem("useCookie",setting);
	$('#privacy_placeholder').hide();
	if(setting==true)
		window['ga-disable-UA-131830139-2'] = false;	
}

//Parses the url parameters
function Common_parseUrlParam(){
	url =  decodeURI(window.location.href);
	let returnParams = {};
	paramPos = url.indexOf('?');
	if(paramPos<0)
		return {};
	url = url.substring(paramPos+1);//don't need the '?' any more
	for(;;){
		paramPos = url.indexOf('=');
		valPos = url.indexOf('&');
		if(paramPos>0 && valPos>0){
			returnParams[url.substring(0,paramPos)] = url.substring(paramPos+1,valPos);
			url = url.substring(valPos+1);
		}
		else if(paramPos>0 && valPos<0){
			returnParams[url.substring(0,paramPos)] = url.substring(paramPos+1);
			url='';
		}
		else if(paramPos<0){
			break;
		}
		
	}
	
	return returnParams;
	
}


function Common_changeLanguage(lang){
	
	let store = localStorage.getObj("shopping");
	let pathname = window.location.href;
	
	if(pathname.search('/hu/')>=0 && lang==='en')
	{
		window.location.href = pathname.replace('/hu','/en');
		store.contact.lang="en";
		localStorage.setObj("shopping",store);
	}
	else if(pathname.search('/en/')>=0 && lang==='hu')
	{
		window.location.href = pathname.replace('/en','/hu');
		store.contact.lang="hu";
		localStorage.setObj("shopping",store);
	}
	else{
		store.contact.lang="hu";
		localStorage.setObj("shopping",store);
	}
}



$(window).scroll(function(){ 
 /*if(!Common_isElementInView('#menu_navigation')&& fixedMenu==false){
	 $('#overall_menu').css({position:'fixed', top: '0', width:'100%'});	 
	 fixedMenu=true;
 }
 else if(Common_isElementInView('#header_main') && fixedMenu==true){ 
	 $('#overall_menu').css({position:'relative'});
	 fixedMenu=false;
 }*/

});

// Recursively loops through every key in an object and checks for empty strings
//which it removes by setting to null
function Common_removeEmptyStrings(obj){
	 switch(typeof obj){
		 case 'object':
			 for(let key in obj){
				 obj[key] = Common_removeEmptyStrings(obj[key]);
			 }
			break;
		 case 'string':
			 if(obj.length <= 0){
				 obj = null;
			 }
			break;
	 }

	 return obj;
}
function Common_pad(val){
	return val<10 ? '0'+val : val.toString();
}

function Common_mergeObject(obj,src){

    for (var key in src) {
        if (src.hasOwnProperty(key)) obj[key] = src[key];
    }
    return obj;	
}








