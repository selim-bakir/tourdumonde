$(document).ready(function(){
	var biz4MailUrl;
	if("global" != SITE_CD ){
		biz4MailUrl ="/" + SITE_CD + "/business/business-mail-step2/getForm";
    	$.ajax({
    		url			: biz4MailUrl,
    		type		:'GET',
    		async		:false,
    		success     : function(data) {
    			$("body").append(data);
    			
    			(function(v){
    				setMailEvent(v);
    				setMailSelectBoxType(v);
    				$(v).find('input[type=text], textarea').placeholder();
    			}("*[data-role=ui-layer-mailStep2ContactUs]"));
    		},
            error       : function(xhr,st,err) {
            },
    	});
	}
	
	function setMailEvent(role){
		var dataRoleComp = "[data-role=ui-layer-mailStep2ContactUsComp]";
        var locationHref = document.location.href;
        
        if(locationHref.indexOf('product') != -1){
        	var iaCd = $('#typeCode').val();
        	
        	$('#prdCategory', $(role)).addClass('active');
        	$('#solCategory', $(role)).removeClass("active");
        	$('#product', $(role)).attr('style', 'display:block;');
        	if(!iaCd) {
        		iaCd = iaCode;
        	}
        	$('[title=' + iaCd + ']', $('li', $('#product', $(role)))).attr('checked', true)
        } else if(locationHref.indexOf('solution') != -1){
        	$('#solCategory', $(role)).addClass('active');
        	$('#prdCategory', $(role)).removeClass("active");
        	$('#solution', $(role)).attr('style', 'display:block;')
        	$('[title=' + $('#typeCode').val() + ']', $('li', $('#solution', $(role)))).attr('checked', true)
        } else {
        	$('#prdCategory', $(role)).addClass('active');
        	$('#solCategory', $(role)).removeClass("active");
        	$('#product', $(role)).attr('style', 'display:block;')
        }
        
        $('#prdCategory', $(role)).bind({
    		'click':function(){
    			if(!$(this).attr("class")){
    				$(this).addClass("active");
        			$('#solCategory', $(role)).removeClass("active");
        			$("#product", $(role)).show();
        			$("#solution", $(role)).hide();
    			}
    		}
        });
			
        $('#solCategory', $(role)).bind({
        	'click':function(){
        		if(!$(this).attr("class")){
        			$(this).addClass("active");
    				$('#prdCategory', $(role)).removeClass("active");
    				$("#solution", $(role)).show();
    				$("#product", $(role)).hide();
        		}
        	}
    	});
        
        $('#btnNext', $(role)).bind({
        	'click':function(){
				if(isValidNext(role)) {
					//omniture
					sendClickCode('content_click', 'request a quote_step1');
					$(".alert-area", $(role)).addClass("hide");
					$('.ui-layer-cont-list > li', $(role)).eq(0).hide();
					$('.ui-layer-cont-list > li', $(role)).eq(1).show();
				}
        	}
		});
        
		// Contact us submit button Event
        $('*[data-role=ui-btn-request-submit]', $(role)).each(function(){
			$(this).unbind().bind({
				'click':function(){
					var mailValid = false;
					mailValid = isMailValidRequest($(role));
					
	    			if(mailValid){
	    				var biz4SendMailUrl="";
	    				if("global" == SITE_CD ){
	    					biz4SendMailUrl ="/" + SITE_CD + "/data-business/business-mail-step2/send";
	    				}else{
	    					biz4SendMailUrl ="/" + SITE_CD + "/business/business-mail-step2/send";
	    				}

	    				return mailSendAjax($(role), $('*[data-role=ui-btn-request-submit]'), $(dataRoleComp), biz4SendMailUrl);
	    			}  
				}
    		});
    	});
		
		$("select", $(role)).each(function(){
			if("TS03" == $(this).attr("mailformitem")){
	    		$(this).change(function () {
	    			var hiddenId = "";
	    			var input = "";
	    			$("input[type=text]",$(this).parent( 'td' )).each(function(){
	    				$(this).remove();
	    			});
	               if("Y" == $("option:selected",this).attr("manualUseFl")){
	            	   hiddenId = $("option:selected",this).attr("hiddenId");
	            	   input = "<input type='text' name='" + hiddenId + "'id='" + hiddenId + "' style='display:block;'>";
	    			   $(this).parent( 'td' ).append(input);
	               }else{
	            	   hiddenId = $("option:selected",this).attr("hiddenId");
	            	   if(hiddenId != null && hiddenId != "" && hiddenId != "undefined"){
	            		   input = "<input type='text' name='" + hiddenId + "'id='" + hiddenId + "' style='display:none;'>";
	            	   }
	    			   $(this).parent( 'td' ).append(input);
	               }
	            }); 
			}
		});
		
		$('.btn-close', $(role)).bind({
        	'click':function(){
        		$('form', $(role))[0].reset();
        		$('.ui-layer-cont-list > li', $(role)).eq(0).show();
				$('.ui-layer-cont-list > li', $(role)).eq(1).hide();
				$(".alert-area", $(role)).addClass("hide");
				setMailEvent(role);
        	}
        });
    }
	
	function isValidNext(role){
		//next > validation check
        if($("input:checkbox:checked", $(role)).length == 0){
        	message = requestMsg.msg.product+", "+requestMsg.msg.solution;
        	b2b4AlertMsg = requestMsg.msg.txt_valid2.replace('{0}', message);
    		$(".alert-area", $(role)).html(b2b4AlertMsg);
    		$(".alert-area", $(role)).removeClass("hide");
            return false;
   	    }
        return true;
    }
	
	// select box option value set
    function setMailSelectBoxType(container,index){
    	 $("select", $(container)).each(function(){
    		 //local
    		 $(this).prepend("<option value=''> " +$(this).attr("data-label") + "</option>");
    		 $('option:first',this).attr("selected", "selected");
    	 });
    }
	
		// validation check
    function isMailValidRequest(container){
    	$popoverContainer = container;
    	$exitCheck = true;
    	$alertText = $(".alert-area", $popoverContainer);
        $alertText.html("");
    	 
	    $("input,select,textarea", $popoverContainer).each(function(){
	    	var mailFormItem = $(this).attr("mailformitem");
	    	var value = $(this).val();
	    	var placeHolder = $(this).attr('placeholder');
	    	var valid = $(this).attr("valid");
	    	
    		if("TT05" == mailFormItem && !biz4CheckMail(value)) {
	    		$(".alert-area", $popoverContainer).html(requestMsg.msg.txt_valid_email);
        		$(".alert-area", $popoverContainer).removeClass("hide");
	    		if((value=="" || value == placeHolder) && valid=="Y"){
	        		$(".alert-area", $popoverContainer).html(requestMsg.msg.txt_valid_email);
	        		$(".alert-area", $popoverContainer).removeClass("hide");
	    		}
	    		$exitCheck = false;
    	    	$(this).focus();
    	    	return false;
	    	}if("TT05" == mailFormItem && !biz4CheckSamsungMail(value))
    	    	{
    	    		if(SITE_CD == 'sec'){
    	    			$(".alert-area", $popoverContainer).html("samsung.com 메일 주소는 입력이 안되오니 다른 메일 주소를 입력 하시기 바랍니다.");
    	    		}else{
    	    			$(".alert-area", $popoverContainer).html("Samsung.com email address is not allowed. Please input other email address.");
    	    		}
	        		$(".alert-area", $popoverContainer).removeClass("hide");
    	    		if((value=="" || value == placeHolder) && valid=="Y"){
    	        		if(SITE_CD == 'sec'){
	    	    			$(".alert-area", $popoverContainer).html("samsung.com 메일 주소는 입력이 안되오니 다른 메일 주소를 입력 하시기 바랍니다.");
	    	    		}else{
	    	    			$(".alert-area", $popoverContainer).html("Samsung.com email address is not allowed. Please input other email address.");
	    	    		}
    	        		
    	        		$(".alert-area", $popoverContainer).removeClass("hide");
    	    		}
    	    		$exitCheck = false;
	    	    	$(this).focus();
	    	    	return false;
    	    	}else if("TT06" == mailFormItem && !biz4PhoneNumber(value)) {
	    		$(".alert-area", $popoverContainer).html(requestMsg.msg.txt_valid_phone);
        		$(".alert-area", $popoverContainer).removeClass("hide");
	    		if((value=="" || value == placeHolder) && valid=="Y"){
	        		$(".alert-area", $popoverContainer).html(requestMsg.msg.txt_valid_phone);
	        		$(".alert-area", $popoverContainer).removeClass("hide");
	    		}
	    		$exitCheck = false;
    	    	$(this).focus();
    	    	return false;
	    	}else if((value=="" || value == placeHolder) && valid=="Y"){
    	    	if("TS06" == mailFormItem){		 
    	    			// INPUT BOX(Full Name)
    	    			var message=requestMsg.msg.txt_valid1.replace('{0}',$(this).attr("data-label"));
    	        		$(".alert-area", $popoverContainer).html(message);
    	        		$(".alert-area", $popoverContainer).removeClass("hide");
    	        		
    	    	} else if("TS04" == mailFormItem || "TS07" == mailFormItem || "TS08" == mailFormItem){
	        		//selectbox TS03 , TS07 , TS08
    	    		var message=requestMsg.msg.txt_valid2.replace('{0}',$(this).attr("data-label"));
	        		$(".alert-area", $popoverContainer).html(message);
	        		$(".alert-area", $popoverContainer).removeClass("hide");
	        	} else{
	        		//textArea
	        		var message=requestMsg.msg.txt_valid1.replace('{0}',$(this).attr("data-label"));
	        		$(".alert-area", $popoverContainer).html(message);
	        		$(".alert-area", $popoverContainer).removeClass("hide");
	        	}
    	    	$exitCheck = false;
    	    	$(this).focus();
    	    	return false;
    	    // Textarea
	    	}else if("TT03" == mailFormItem){
	    		if((value).length > $(this).attr("maxlength")){
	    			var message=requestMsg.msg.txt_valid_message.replace('{0}',$(this).attr("maxlength"));
	    			
	    			$(".alert-area", $popoverContainer).html(message + " " +$(this).attr("data-label"));
	        		$(".alert-area", $popoverContainer).removeClass("hide");
	        		$exitCheck = false;
             		return false;
	    		}
	    		
    	    //checkbox    	    	
	    	}else if("TS02" == mailFormItem && valid=="Y" ){
             	if(!this.checked){
             		$(".alert-area", $popoverContainer).html(requestMsg.msg.txt_valid_agree);
	        		$(".alert-area", $popoverContainer).removeClass("hide");
             		$exitCheck = false;
             		return false;
             	}
        	}
	    });

	    if(!$exitCheck) return false;
	    
	    return true;
    }
    
    // Email validation
    function biz4CheckMail(strMail) {
        var check1 = /(@.*@)|(\.\.)|(@\.)|(\.@)|(^\.)/; 
        var check2 = /^[a-zA-Z0-9\-\.\_]+\@[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,4})$/; 
        if ( !check1.test(strMail) && check2.test(strMail) ) { 
            return true; 
        } else { 
            return false; 
        } 
    }
    
    // Samsung Email validation
        function biz4CheckSamsungMail(strMail) {
            if ( strMail.toLowerCase().indexOf("@samsung.com") != -1 ) { 
                return false; 
            } else { 
                return true; 
            } 
        }
    
    // Phone Number validation
    function biz4PhoneNumber(number) {
    	numberValue = number.replace(/\+/g, '').replace(/-/g, '');
        var check = /^[-0-9]*$/;
        if ( !check.test(numberValue)) { 
            return false; 
        } else {
            return true; 
        } 
    }
    
    // Contact us common Ajax call
    function mailSendAjax(container, eventBtn, completeLayer, url) {
    	
    	var $submitForm = $('#' + container.find('form').attr('id'));
		 	if(document.location.host ==="www.samsung.com"){
				url = "https://www.samsung.com" + url;
			} else if(document.location.host ==="origin2.samsung.com"){
				url = "https://origin2.samsung.com" + url;
			}
		
    	$.ajax({
            type        : 'POST',
            url         :  url,
            data        : $($submitForm, container).serializeArray(),
            dataType    : 'json',
            traditional : false,
            success     : function(data,st) {
            },
            error       : function(xhr,st,err) {
            }
        });
    	
    	mailCompLayerPopup(container, completeLayer, $submitForm);

        return false;
    }
    
    // Contact us submit - Complete popup call
    function mailCompLayerPopup(container, completeLayer, form){
    	// Omniture
    	setOmniture(container);
    	
    	// 1. Contact us form reset
    	form[0].reset();
    	
    	// 2. Contact us form close
    	$(container).find('a.btn-close').trigger('click');
    	
    	
    	// 3. Complete popup call
     	$(this).data('manager', new LayerCommonUI(completeLayer));
 		(function(manager){
			manager._container.removeClass('pop-wrap');
 		}($(this).data('manager')));
    }
    
    // Omniture
    function setOmniture(dataRole){
    	var checkedVal = "";
    	
    	$("input:checkbox", $popoverContainer).each(function(){
    		if($(this).is(":checked")){
    			checkedVal += $(this).val()+"_";
    		}
    	});
    	
    	sendClickCode('content_click', 'request a quote_success:' + checkedVal.toLowerCase().substring(0, checkedVal.lastIndexOf("_")));
    }
    
});