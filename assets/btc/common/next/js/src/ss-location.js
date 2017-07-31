
var ss = $;

(function ($) {
//global eventBridge,eventDictionary,navigator,Modernizr,console,google 
    
    
    //StoreLocations Service Wrapper
    //@class $.StoreLocations
    //@constructor
    
    ss.StoreLocations = function () {

        function init() {

        	// store 검색.
            eventBridge.on(eventDictionary.location.REQUEST_STORES, function(ev, data) {
            	
                if(!data) { // 데이터가 없을 경우 geolocation.
                    geolocateUser(true);
                } else if (data.id) {
                	
                	var lat = $.trim($("#latitude").val());
                	var lng = $.trim($("#longitude").val());
                	
                	eventBridge.trigger(jQuery.Event(eventDictionary.location.GEOLOCATION_RESOLVED), { ob:lat, pb:lng });
                	
                }
            });


            eventBridge.on(eventDictionary.location.LOCATION_FOUND, function(ev, result) {
                listStores(function(stores) {
                    stores.result = result;
                    eventBridge.trigger(jQuery.Event(eventDictionary.location.STORES_FOUND), stores);
                });
            });
			
			// sec only : dongCd 검색.
            eventBridge.on(eventDictionary.location.REQUEST_DONGCODE_STORES, function(ev, data) {
            	$.ajaxSetup({
            	     timeout: 5000
            	  });
            	
            	$.getJSON('http://' + DOMAIN + '/' + SITE_CD + '/api/nearFront/getDongCode/?callback=?').then(handleDongLocationResult, handleDongLocationError);
            });

        }
        
        // geolocation 부분.
        function geolocateUser(coarseGrainedFallback) {
        	
        	if(navigator.geolocation) { // geolocation이 지원하는 브라우져
        		navigator.geolocation.getCurrentPosition(handleGeolocationResult, handleGeolocationDenyResult);
        		return;
            } else if (coarseGrainedFallback) { // geolocation이 지원하지않는 브라우져
            	geolocateByIP();
            }
        }

        function handleGeolocationDenyResult() {
        	var lat = $.trim($("#latitude").val());
        	var lng = $.trim($("#longitude").val());

        	eventBridge.trigger(jQuery.Event(eventDictionary.location.GEOLOCATION_RESOLVED), { ob:lat, pb:lng });
        	
        }
        
        // geolocation이 지원하지 않는 브라우져에서 ip로 좌표값 구함.
        function geolocateByIP() {
            $.getJSON('http://freegeoip.net/json/?callback=?').then(handleGeolocationResult, handleGeolocationError);
            return;
        }

        function handleGeolocationResult(location) {
        	
            //Modernizr.geolocation might come true still when the user rejects the geolocation, so we are better off using hasOwnProperty.
        	
            var lat = typeof location.coords !== 'undefined' ? location.coords.latitude : location.latitude,
                lng = typeof location.coords !== 'undefined' ? location.coords.longitude : location.longitude;
        	
			//매장픽업시 위치정보 활용 목적
			var geoCoords = { latitude: lat, longitude : lng };
			$.cookies.set('geoCoords',geoCoords,{domain:".samsung.com"});
			
            eventBridge.trigger(jQuery.Event(eventDictionary.location.GEOLOCATION_RESOLVED), { ob:lat, pb:lng });
        }
		
		function handleDongLocationResult(dongCode) {
			$.cookies.set('dongCd',dongCode.dongCd,{domain:".samsung.com"}); 
        }
        
        function handleGeolocationError() {
            //Error
            eventBridge.trigger(jQuery.Event(eventDictionary.location.LOCATION_NOT_FOUND));
        }
		
		function handleDongLocationError(dongCode) {
        	console.log("getDongCode API Error : " + dongCode);
        }
        
        function handleLocationError(error) {
            eventBridge.trigger(jQuery.Event(eventDictionary.location.LOCATION_NOT_FOUND), error);
            return;
        }

        init();

    };
} (jQuery));

$(function() {
    ss.storeLocations = new ss.StoreLocations();
});
