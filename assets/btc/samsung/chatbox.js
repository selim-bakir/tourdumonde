
var node = document.getElementById("dyduchatbox");
if (node != null) {
	node.id = "dyduchatbox2";
}
if (document.location.href.indexOf("https://shop.samsung.com") === 0 || document.location.href.indexOf("http://shop.samsung.com") === 0 || document.location.href.indexOf("http://www.samsung.com/fr/shop") ===0 ||  document.location.href.indexOf("https://www.samsung.com/fr/shop") ===0 ||  document.location.href.indexOf("http://www.samsung.com/fr/consumer") ===0 ||  document.location.href.indexOf("https://www.samsung.com/fr/consumer") ===0 ) {

	window.onload = function() {
		var s = document.createElement("script");
		s.type = "text/javascript";
		s.id = "dyduchatbox";
		//s.src = "https://assistant.prosodie.com/Prod/4047dcab-a63e-4cfe-b34e-973f5c89ec91/Samsung-shop/chatbox.js";
		s.src = "https://assistant.prosodie.com/Prod/4047dcab-a63e-4cfe-b34e-973f5c89ec91/6f61364f-fc44-4891-8724-35208d3d3b8e/assembly.min.js";
		document.body.appendChild(s);
	}
	//document.write('<script type="text/javascript" id="dyduchatbox" src="https://assistant.prosodie.com/Prod/4047dcab-a63e-4cfe-b34e-973f5c89ec91/6f61364f-fc44-4891-8724-35208d3d3b8e/assembly.min.js"></script>');

} else if (document.location.href.indexOf("http://www.samsung.com/fr/support") === 0 || document.location.href.indexOf("http://www.samsung.com/fr/info/contactus.html") === 0 || document.location.href.indexOf("https://www.samsung.com/fr/support") === 0 || document.location.href.indexOf("https://www.samsung.com/fr/info/contactus.html") === 0 )  {
	//document.write('<script type="text/javascript" id="dyduchatbox" src="https://assistant.prosodie.com/Prod/7c28b070-f7ab-4a05-9c32-d6edc4ba833a/Samsung/chatbox.js"></script>');
	document.write('<script type="text/javascript" id="dyduchatbox" src="https://assistant.prosodie.com/Prod/7c28b070-f7ab-4a05-9c32-d6edc4ba833a/d211ea0f-e54b-4392-bf9b-5f4d35c62477/assembly.min.js"></script>');
}
