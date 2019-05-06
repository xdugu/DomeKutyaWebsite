//The functions below allow us to store arrays in local storage to be used later
Storage.prototype.setObj = function(key, obj) {
    return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key))
}

var fixedMenu=false;

  $(document).ready(function() {
	  if(isPathCorrect())//if we can't find any of these strings in the path in means that we are in the 
	  //root directory so we will then default to the hungarian header
         $('#header_placeholder').load("header.html", Shop_refreshBasket);	
	  else
		  $('#header_placeholder').load("/hu/header.html", Shop_refreshBasket);	 
		 checkCookie();

    }); 

function checkCookie(){
	
	  window.dataLayer = window.dataLayer || [];
	  window['ga-disable-UA-131830139-2'] = true;
	  
	 
	 let useCookie = localStorage.getItem("useCookie");
	 if(useCookie == null){
		 if(isPathCorrect())
			$('#privacy_placeholder').load("legal/privacy.html");
		 else
			$('#privacy_placeholder').load("/hu/legal/privacy.html"); 
	 }
	else if (useCookie=="true"){
		 window['ga-disable-UA-131830139-2'] = false;
	 }
		 
	
	  function gtag(){dataLayer.push(arguments);}
	  gtag('js', new Date());
	  gtag('config', 'UA-131830139-2', { 'anonymize_ip': true });

}

function isPathCorrect(){//function to check if path has either /hu or /en to indicate 
//if we are in the website root or have made it to the correct directly
	  let pathname = window.location.href;
	  if(pathname.search("/hu/")>=0 || pathname.search("/en/")>=0)
		  return true;
	  else return false;
	
}

function Common_menuClicked()
{
	$("#mobile-submenu").toggle();
	$("#mobile-submenu .toHide").hide();
}

function Common_showBackground()
{
	$('#background_img').css('opacity','0.2');	
}

function Common_changeCookie(setting){
	localStorage.setItem("useCookie",setting);
	$('#privacy_placeholder').hide();
	if(setting==true)
		window['ga-disable-UA-131830139-2']=false;
		
	
}

function Common_checkSubMenu(menu)
{
	allMenu = $("#mobile-submenu .toHide");
	prevState = menu.nextElementSibling.style.display;
	for(var counter=0; counter<allMenu.length; counter++)
	{
		allMenu[counter].style.display = "none";
		menu.firstElementChild.innerHTML= "arrow_drop_down";
	}	

	if(prevState=="none" || prevState=="")
	{
		menu.nextElementSibling.style.display="block";
		menu.firstElementChild.innerHTML= "arrow_drop_up";
	}
}

function Common_getUrlParam(param){
	let url = window.location.href;
	pos = url.search(param);
	if(pos>=0)
	{
		return url.substring(param.length+pos, url.length);
	}
	else return null;
	
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

//This function will search for the item id in the product xml file and return the tag
function Common_getItemById(library, pathname)
{
	 path='//item';
		let nodes = library.evaluate(path, library, null, XPathResult.ANY_TYPE, null);
		let tags =  nodes.iterateNext();
		while (tags)
		{
			if(pathname.search(tags.id)>=0){
				return tags;
			}
			tags = nodes.iterateNext();
		}
		
	return null;
}

function Common_getItemInner(library,path){
	let nodes = library.evaluate(path, library, null, XPathResult.ANY_TYPE, null);
	let tags =  nodes.iterateNext();
	if(tags==null)
		return null;
	return tags.innerHTML;
}

function Common_isElementInView(elem)
{
    var elementTop = $(elem).offset().top;
	var elementBottom = elementTop + $(elem).outerHeight();
	var viewportTop = $(window).scrollTop();
	var viewportBottom = viewportTop + $(window).height();
	
	return elementBottom > viewportTop && elementTop < viewportBottom;	
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

function Common_getNestedValue(obj, key) {
    return key.split(".").reduce(function(result, key) {
       return result[key] 
    }, obj);
}






