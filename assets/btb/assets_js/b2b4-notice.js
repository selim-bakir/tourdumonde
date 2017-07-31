$(document).ready(function(){

	if(!$.cookies) window.$.cookies=jaaulde.utils.cookies;	

	var browserNotice = $('.browser-notice');
	var cookieNotice = $('.cookie-notice');
	
	function init(){
	
		browserNotice.find('button').on('click', browserNotice_ClickHandler);
		cookieNotice.find('button').on('click', cookieNotice_ClickHandler);
		
		if ($.cookies.get('cookiesaccepted')+'' !== 'true'){
			cookieNotice.css('display','block');
        }
		
		if ($.cookies.get('browseraccepted')+'' !== 'true' && isIE8Less()){
        	browserNotice.css('display','block');
        }
	}
	
	function browserNotice_ClickHandler(e){
        var opt={complete:function(){browserNotice.css('display','none');}};
        browserNotice.slideUp(opt);
        var date = new Date();
        date.setTime(date.getTime() + (90*24*60*60*1000));
        $.cookies.set('browseraccepted','true', {expiresAt: date});
    }

    function cookieNotice_ClickHandler(e){
        var opt={complete:function(){cookieNotice.css('display','none');}};
        cookieNotice.slideUp(opt);
        var date = new Date();
        date.setTime(date.getTime() + (90*24*60*60*1000));
        $.cookies.set('cookiesaccepted','true', {expiresAt: date});
    }
    
    function isIE () {
    	
        var app = navigator.appName,
            reg = new RegExp('Trident/.*rv:([0-9]{1,}[\/.0-9]{0,})'),
            result = false;

        if (app === 'Microsoft Internet Explorer' || (app === 'Netscape' && reg.exec(navigator.userAgent) !== null)) {
            result = true;
        }

        return result;
    }
    
    function isIE8Less() {
    	
        if(!isIE()){
            return false;
        }

        var IE8 = /MSIE\s([\d.]+)/.test(window.navigator.userAgent),
            version = Number(RegExp.$1);
        
        if(version < 9) {
            return true;
        }
        return false;
    }        

    init();

});