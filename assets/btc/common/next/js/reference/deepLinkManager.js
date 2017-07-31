var ss = $;
(function ($) {
    /**
    The DeepLinkManager object handles deep linking and state management to various pages from the table of contents.  
    For example, you might wish to see different states of the PDP where the product is not available.

    @class $.DeepLinkManager
    @constructor
    @param {Object} params External object settings passed into the object.
    **/
    ss.DeepLinkManager = function (params) {
		var param, value;
        
        /**
        Init function attempts to retrieve any included URL parameters and checks them against a predefined list of options.

        @method init
        **/
        function init() {  	
            // Retrieve any available URL parameters and split them into an array.	
            var urlParameters = window.location.search.substring(1).split('&');

            // Loop through each parameter and value pair and execute any applicable helper functions.
            $.each(urlParameters, function(i) {
                var currentParam = urlParameters[i].split('=')[0];
                var currentValue = urlParameters[i].split('=')[1];
				
				param = currentParam;
				value = currentValue;
				
				
                switch(currentParam) {
                    case 'theme':
                         $('body').addClass('theme-' + currentValue);
                        break;
                    case 'rtl':
                         $('html').removeClass('ltr').addClass('rtl');
                        break;
                    case 'instore':
                         $('body').addClass('instore');
                         break; 
                    case 'lowbandwidth':
                        $('body').addClass('lowbandwidth');
					   break;                    
                }
				
				if (currentParam === 'version') {
					$('[data-version]').each(function(i, el) {
						if ($(el).data('version') === currentValue) {
							$(el).removeClass('hide');	
						} else {
							$(el).addClass('hide');
						}
					});	
				}

                if (currentParam === 'login') {
                    var $loginTrue = $('[data-login=true]');
                    var $loginFalse = $('[data-login=false]');
                    if(currentValue === 'true'){
                        $loginFalse.each(function(){
                            $(this).addClass('hide');
                        });
                        $loginTrue.each(function(){
                            $(this).removeClass('hide');
                        });
                    } else {
                        $loginFalse.each(function(){
                            $(this).removeClass('hide');
                        });
                        $loginTrue.each(function(){
                            $(this).addClass('hide');
                        });
                    }

                }		
				
            });

            // Management of video paths for PDP Wow
            if($('body').hasClass('pdp_wow')) {
                
            }
        }
        
		init();
    };
} (jQuery));
