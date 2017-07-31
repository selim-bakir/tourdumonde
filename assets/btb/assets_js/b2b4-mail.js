$(document).ready(function(){
		
		var biz4MailUrl;
		
		var value;
		var mailformitem;
		var valid;
		var placeholder;
		var datalabel;
		var maxlength;
		var itemnm;
		
		if("global" != SITE_CD ){
			biz4MailUrl ="/" + SITE_CD + "/business/business-mail/getForm";
	    	$.ajax({
	    		url			: biz4MailUrl,
	    		type		:'GET',
	    		async		:false,
	    		success     : function(data) {
	    			$("body").append(data);
	    			
	    			var role = ["[data-role=ui-layer-mailContactUs]","[data-role=ui-layer-mailInsightDownload]","[data-role=ui-layer-mailTrialRequest]","[data-role=ui-layer-mailInquiryType]"];
	    			$.each(role, function(i, v){
	    			    setMailEvent(v,i);
	    			    setMailSelectBoxType(v,i);
	    			    $(v).find('input[type=text], textarea').placeholder();
	    			});
	    		},
	            error       : function(xhr,st,err) {
	            },
	    	});
		}

        // 161013 [Front-B2B][uk] RE: New Contact Us form for B2B / live site section support email 링크 수정
        if("uk"==SITE_CD){
            $('.kv_btn_box2 button').remove();
            $('.kv_btn_box2').append("<button type='button' class='btn-type1 email first' onclick=\"window.open(\'http://eu.my-samsung.com/optiext/optiextension.dll?ID=7YU7Cx9C58fYe87XgaozJZQI7MUsM5HFEW6jLzjfrciPXnm7ZHZYROGMc2v0wmsjRBWJcp2hEEl77t\'); return false;\">Email</button>");

            // Solution 영역 live site section jump to link change
            $('.floating-jumpmenu .btn-jump-wrap a').remove();
            $('.floating-jumpmenu .btn-jump-wrap').append("<a class='email' target='_blank' href='http://eu.my-samsung.com/optiext/optiextension.dll?ID=7YU7Cx9C58fYe87XgaozJZQI7MUsM5HFEW6jLzjfrciPXnm7ZHZYROGMc2v0wmsjRBWJcp2hEEl77t' onclick=\"sendClickCode(\'jumpto\', \'jump to:contact us\');\"><span class=\'blind-txt'>Contact us</span></a>");
        }
		
    	// validation check
        function isMailValidRequest(container){
        	$popoverContainer = container;
        	$exitCheck = true;
        	
        	$alertText = $(".alert-area", $popoverContainer);
            
            $alertText.html("");
        	 
            
    	    $("input,select,textarea", $popoverContainer).each(function(){
    	    		
    	    	value = $(this).val();
    		    mailformitem = $(this).attr("mailformitem");
    		    valid = $(this).attr("valid");
    		    placeholder = $(this).attr('placeholder');
    		    datalabel = $(this).attr("data-label");
    		    maxlength = $(this).attr("maxlength");
    	    
    	    	if("TT05" == mailformitem && !biz4CheckMail(value))
    	    	{
    	    		$(".alert-area", $popoverContainer).html(requestMsg.msg.txt_valid_email);
	        		$(".alert-area", $popoverContainer).removeClass("hide");
    	    		if((value=="" || value == placeholder) && valid=="Y"){
    	        		$(".alert-area", $popoverContainer).html(requestMsg.msg.txt_valid_email);
    	        		$(".alert-area", $popoverContainer).removeClass("hide");
    	    		}
    	    		$exitCheck = false;
	    	    	$(this).focus();
	    	    	return false;
    	    	}if("TT05" == mailformitem && !biz4CheckSamsungMail(value))
    	    	{
    	    		if(SITE_CD == 'sec'){
    	    			$(".alert-area", $popoverContainer).html("samsung.com 메일 주소는 입력이 안되오니 다른 메일 주소를 입력 하시기 바랍니다.");
    	    		}else{
    	    			$(".alert-area", $popoverContainer).html("Samsung.com email address is not allowed. Please input other email address.");
    	    		}
	        		$(".alert-area", $popoverContainer).removeClass("hide");
    	    		if((value=="" || value == placeholder) && valid=="Y"){
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
    	    	}else if("TT06" == mailformitem && !biz4PhoneNumber(value))
    	    	{
    	    		$(".alert-area", $popoverContainer).html(requestMsg.msg.txt_valid_phone);
	        		$(".alert-area", $popoverContainer).removeClass("hide");
    	    		if((value=="" || value == placeholder) && valid=="Y"){
    	        		$(".alert-area", $popoverContainer).html(requestMsg.msg.txt_valid_phone);
    	        		$(".alert-area", $popoverContainer).removeClass("hide");
    	    		}
    	    		$exitCheck = false;
	    	    	$(this).focus();
	    	    	return false;
    	    	}else if((value=="" || value == placeholder) && valid=="Y"){
	    	    	if("TS06" == mailformitem){		 
	    	    			// INPUT BOX(Full Name)
	    	    			var message=requestMsg.msg.txt_valid1.replace('{0}',datalabel);
	    	        		$(".alert-area", $popoverContainer).html(message);
	    	        		$(".alert-area", $popoverContainer).removeClass("hide");
	    	        		
	    	    	} else if("TS04" == mailformitem || "TS07" == mailformitem || "TS08" == mailformitem){
    	        		//selectbox TS03 , TS07 , TS08
	    	    		var message=requestMsg.msg.txt_valid2.replace('{0}',datalabel);
    	        		$(".alert-area", $popoverContainer).html(message);
    	        		$(".alert-area", $popoverContainer).removeClass("hide");
    	        	} else{
    	        		//textArea
    	        		var message=requestMsg.msg.txt_valid1.replace('{0}',datalabel);
    	        		$(".alert-area", $popoverContainer).html(message);
    	        		$(".alert-area", $popoverContainer).removeClass("hide");
    	        	}
	    	    	$exitCheck = false;
	    	    	$(this).focus();
	    	    	return false;
	    	    // Textarea
    	    	}else if("TT03" == mailformitem){
    	    		if((value).length > maxlength){
    	    			var message=requestMsg.msg.txt_valid_message.replace('{0}',maxlength);
    	    			
    	    			$(".alert-area", $popoverContainer).html(message + " " +datalabel);
    	        		$(".alert-area", $popoverContainer).removeClass("hide");
    	        		$exitCheck = false;
	             		return false;
    	    		}
    	    		
	    	    //checkbox    	    	
    	    	}else if("TS02" == mailformitem && valid=="Y" ){
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
        
        
     // validation check
        function isMailValidRequestFrSite(container){
        	$popoverContainer = container;
        	$exitCheck = true;
        
        	/*
        	Téléphone professionnel : 10 digits 가이드 텍스트 삭제, 숫자 10개일 때만 허용
        	Code postal : 숫자만 입력하도록 Address , Postcode
        	Quantité estimée : 10 digits 가이드 텍스트 삭제, 숫자만 입력하도록
        	Date du projet : MM/YYYY 가이드 텍스트 표시 
        	*/
        	
        	$alertText = $(".alert-area", $popoverContainer);
            
            $alertText.html("");
        	 
    	    $("input,select,textarea", $popoverContainer).each(function(){
    	    	
    	    	value = $(this).val();
    		    mailformitem = $(this).attr("mailformitem");
    		    valid = $(this).attr("valid");
    		    placeholder = $(this).attr('placeholder');
    		    datalabel = $(this).attr("data-label");
    		    maxlength = $(this).attr("maxlength");
    		    itemnm = $(this).attr("itemnm");
    	    		
    	    	if("TT05" == mailformitem && !biz4CheckMail(value))
    	    	{
    	    		$(".alert-area", $popoverContainer).html(requestMsg.msg.txt_valid_email);
	        		$(".alert-area", $popoverContainer).removeClass("hide");
    	    		if((value=="" || value == placeholder) && valid=="Y"){
    	        		$(".alert-area", $popoverContainer).html(requestMsg.msg.txt_valid_email);
    	        		$(".alert-area", $popoverContainer).removeClass("hide");
    	    		}
    	    		$exitCheck = false;
	    	    	$(this).focus();
	    	    	return false;
    	    	}if("TT05" == mailformitem && !biz4CheckSamsungMail(value))
    	    	{
    	    		if(SITE_CD == 'sec'){
    	    			$(".alert-area", $popoverContainer).html("samsung.com 메일 주소는 입력이 안되오니 다른 메일 주소를 입력 하시기 바랍니다.");
    	    		}else{
    	    			$(".alert-area", $popoverContainer).html("Samsung.com email address is not allowed. Please input other email address.");
    	    		}
	        		$(".alert-area", $popoverContainer).removeClass("hide");
    	    		if((value=="" || value == placeholder) && valid=="Y"){
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
    	    	}else if("TT06" == mailformitem && !biz4frSitePhoneNumber(value))
    	    	{
    	    		$(".alert-area", $popoverContainer).html(requestMsg.msg.txt_valid_phone);
	        		$(".alert-area", $popoverContainer).removeClass("hide");
    	    		if((value=="" || value == placeholder) && valid=="Y"){
    	        		$(".alert-area", $popoverContainer).html(requestMsg.msg.txt_valid_phone);
    	        		$(".alert-area", $popoverContainer).removeClass("hide");
    	    		}
    	    		$exitCheck = false;
	    	    	$(this).focus();
	    	    	return false;
    	    	}else if((value=="" || value == placeholder) && valid=="Y"){
	    	    	if("TS06" == mailformitem){		 
	    	    			// INPUT BOX(Full Name)
	    	    			var message=requestMsg.msg.txt_valid1.replace('{0}',datalabel);
	    	        		$(".alert-area", $popoverContainer).html(message);
	    	        		$(".alert-area", $popoverContainer).removeClass("hide");
	    	        		
	    	    	} else if("TS04" == mailformitem || "TS07" == mailformitem || "TS08" == mailformitem){
    	        		//selectbox TS03 , TS07 , TS08
	    	    		var message=requestMsg.msg.txt_valid2.replace('{0}',datalabel);
    	        		$(".alert-area", $popoverContainer).html(message);
    	        		$(".alert-area", $popoverContainer).removeClass("hide");
    	        	}else{
    	        		//textArea
    	        		var message=requestMsg.msg.txt_valid1.replace('{0}',datalabel);
    	        		$(".alert-area", $popoverContainer).html(message);
    	        		$(".alert-area", $popoverContainer).removeClass("hide");
    	        	}
	    	    	$exitCheck = false;
	    	    	$(this).focus();
	    	    	return false;
	    	    // Textarea
    	    	}else if("TT03" == mailformitem){
    	    		if((value).length > maxlength){
    	    			var message=requestMsg.msg.txt_valid_message.replace('{0}',maxlength);
    	    			
    	    			$(".alert-area", $popoverContainer).html(message + " " +datalabel);
    	        		$(".alert-area", $popoverContainer).removeClass("hide");
    	        		$(this).focus();
    	        		$exitCheck = false;
	             		return false;
    	    		}
    	    		
	    	    //checkbox    	    	
    	    	}else if("TS02" == mailformitem && valid=="Y" ){
	             	if(!this.checked){
	             		$(".alert-area", $popoverContainer).html(requestMsg.msg.txt_valid_agree);
    	        		$(".alert-area", $popoverContainer).removeClass("hide");
	             		$exitCheck = false;
	             		return false;
	             	}
	        	}else if (("Address" == itemnm || "Postcode" == itemnm) && !biz4PhoneNumber(value) ){
	        		//textArea
	        		var message=requestMsg.msg.txt_valid1.replace('{0}',datalabel);
	        		$(".alert-area", $popoverContainer).html(message);
	        		$(".alert-area", $popoverContainer).removeClass("hide");
	        		$(this).focus();
	        		$exitCheck = false;
             		return false;
	        	}else if("Address" == itemnm && (value).length != 5){
	        		var message=requestMsg.msg.txt_valid_message.replace('{0}', '5');
	    				$(".alert-area", $popoverContainer).html(message + " " +datalabel);
	        		$(".alert-area", $popoverContainer).removeClass("hide");
	        		$(this).focus();
	        		$exitCheck = false;
             	return false;
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
        
        
        // fr site Phone Number validation
        function biz4frSitePhoneNumber(number) {
        	numberValue = number.replace(/\+/g, '').replace(/-/g, '');
            var check = /^[0-9]{10}$/g;
            if ( !check.test(numberValue)) { 
                return false; 
            } else {
                return true; 
            } 
        }
        
        function setMailEvent(role,index){
        var dataRoleComp;
	        switch(index) {
	            case 0:
	            	dataRoleComp = "[data-role=ui-layer-mailContactUsComp]";
	                break;
	            case 1:
	            	dataRoleComp = "[data-role=ui-layer-mailInsightDownloadComp]";
	                break;
	            default:
	            	dataRoleComp = "[data-role=ui-layer-mailTrialRequestComp]";
	        };
        	
    		// Contact us submit button Event
    		$(role).find($('*[data-role=ui-btn-request-submit]')).each(function(){
    			$(this).unbind().bind({
    				'click':function(){
    					var mailValid = false;
    					if("fr" == SITE_CD && ("[data-role=ui-layer-mailContactUs]" == role || "[data-role=ui-layer-mailTrialRequest]" == role))
    					{
    						mailValid = isMailValidRequestFrSite($(role));
    					}else
    					{
    						mailValid = isMailValidRequest($(role));
    					}
    	    			if(mailValid){
    	    				var biz4SendMailUrl="";
    	    				if("global" == SITE_CD ){
    	    					biz4SendMailUrl ="/" + SITE_CD + "/data-business/business-mail/send";
    	    				}else{
    	    					biz4SendMailUrl ="/" + SITE_CD + "/business/business-mail/send";
    	    				}
    	    				setRequestLoging(role);        
	    	    			return mailSendAjax($(role), $('*[data-role=ui-btn-request-submit]'), $(dataRoleComp), biz4SendMailUrl);
    	    			}  
    				}
        		});
        	});
    		
    		$("select", $(role)).each(function(){
    			mailformitem = $(this).attr("mailformitem");
    			if("TS03" == mailformitem){
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
        }
        
        
        // Contact us common Ajax call
        function mailSendAjax(container, eventBtn, completeLayer, url) {
        	
        	// Extend serializeArray function
        	$.fn.serialize = function (options) {
		        return $.param(this.serializeArray(options));
		    };
		    $.fn.serializeArray = function (options) {
		         var o = $.extend({
		         checkboxesAsBools: false
		    }, options || {});
			
		    var rselectTextarea = /select|textarea/i;
		    var rinput = /text|hidden|password|search/i;
			
		    return this.map(function () {
		        return this.elements ? $.makeArray(this.elements) : this;
		    })
		    .filter(function () {
		        return this.name && !this.disabled &&
		            (this.checked
		            || (o.checkboxesAsBools && this.type === 'checkbox')
		            || rselectTextarea.test(this.nodeName)
		            || rinput.test(this.type));
		        })
		        .map(function (i, elem) {
		            var val = $(this).val();
		            return val == null ?
		            null :
		            $.isArray(val) ?
		            $.map(val, function (val, i) {
		                return { name: elem.name, value: val };
		            }) :
		            {
		                name: elem.name,
		                value: (o.checkboxesAsBools && this.type === 'checkbox') ? //moar ternaries!
		                       (this.checked ? 'on' : 'off') :
		                       val
		            };
		        }).get();
		    };
		    // End of Extend serializeArray function

        	var $submitForm = $('#' + container.find('form').attr('id'));
        	
    		if(document.location.host ==="www.samsung.com"){
    			url = "https://www.samsung.com" + url;
    		} else if(document.location.host ==="origin2.samsung.com"){
    			url = "https://origin2.samsung.com" + url;
    		}
    		
        	$.ajax({
                type        : 'POST',
                url         :  url,
                data        : $($submitForm, container).serializeArray({ checkboxesAsBools: true }),
                dataType    : 'json',
                traditional : false,
                success     : function(data,st) {
					if (!window.console) window.console = {};
					if (!window.console.log) window.console.log = function(){};
					console.log(data.msg1);
					console.log(data.msg2);
					console.log(data.msg3);
                },
                error       : function(xhr,st,err) {
                	if (!window.console) window.console = {};
					if (!window.console.log) window.console.log = function(){};
					console.log('err : ' + err);
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
        
        // select box option value set
        function setMailSelectBoxType(container,index){
        		
        	 $("select", $(container)).each(function(){
        		 datalabel = $(this).attr("data-label");
        		 //local
        		 $(this).prepend("<option value=''> " + datalabel + "</option>");
        		 $('option:first',this).attr("selected", "selected");
     	    });
     	    
     	    $('select[title="Enquiry Type"] > option[value=""]').remove();
        	 
        	 if("[data-role=ui-layer-mailTrialRequest]" == container)
        	 {
        		 
        		 $("#trialRequestTitle").text($("#solution_name").val());
				 $("#trialRequestTitleVal").val($("#solution_name").val());
        		 $("#trialRequestDesc").text($("#solution_desc").val());
        		 $("#trialRequestImage").attr("src",$("#solution_image").val());
        		 $("#trialRequestImage").attr("alt",$("#solution_image_alt").val());
        	 } 

        	 if("[data-role=ui-layer-mailContactUs]" == container && "fr" == SITE_CD)
        	 {
        		 $("input[type=text]", $(container)).each(function(){
        			 if("Text 1" == $(this).attr("itemnm")){
        				 $(this).attr("placeholder" , "MM/AAAA");
        			 }
         	    });
        	 }

        }
        
        function setRequestLoging(container){
        	var data = {
        			reqTypeCd : ''  	/// TS07
        			,iaCode  : ''   //Product IA  TS04
        			,subject : '' //TT02 , Subject
        			,message : ''   //TT03 
        			,supportedModel : ''
        			,iaOtherValue : ''	
        	};
    		
        	$("input,select,textarea", $(container)).each(function(){
        		
        		value = $(this).val();
    		    mailformitem = $(this).attr("mailformitem");
    		    itemNm = $(this).attr("itemNm");
    		    inputFormTypeCd = $("#inputFormTypeCd", $(container)).val();
    		    
    			if("TS07" == mailformitem){
    				data.reqTypeCd = value || '';
    			}else if("TS04" == mailformitem && "CON-US" == inputFormTypeCd){	
    				data.iaCode = value || '';
    			}else if("TS08" == mailformitem && "TR-REQ" == inputFormTypeCd){
    				data.iaCode = value || '';
    			}else if("TT03" == mailformitem){
    				data.message = value || '';
    			}else if(("TT02" == mailformitem && "Subject" == itemNm)){
    				data.subject = value || '';
    			}else if(("TT02" == mailformitem && "Supported Model" == itemNm)){
    				data.supportedModel = value || '';
    			}
    		});
        	
        	if("CON-US" == inputFormTypeCd)
        	{
        		ss.myBusiness.myRequestLoging(data);
        	}else if("TR-REQ" == inputFormTypeCd)
        	{
        		ss.myBusiness.myTrialLoging(data);
        	}
        }

        // 160825 [Front-B2B][ru] Request button source
        /*if(SITE_CD =='ru'){
            $('.item3 li button').first().remove();
            $('.item3 li .act').first().append("<a class='btn-type1 link' target='_blank' href='http://www.samsung.com/ru/business/S7request/' onclick=\"sendClickCode(\'content_click_count\', \'kv1_more\'); sendClickCode(\'pid\',\'ru b2b_s7request_kv1_20160825\');\" style='font-size: 16px; text-transform: inherit; font-family: inherit; cursor: pointer;'>Запрос</a>");    
        }*/
        
        // Omniture
        function setOmniture(dataRole){
        	var $dataRole = dataRole;
        	var $requestSelectType = $('[mailformitem=TS07]', $dataRole);
        	var $solPdSelectType = $('[mailformitem=TS04]', $dataRole);
        	var $industrySelectType = $('[mailformitem=TS08]', $dataRole);
        	var requestType = "";
        	var solPdType = "";
        	var industryType = "";
			
        	// Request Type
        	if($requestSelectType.length > 0){
        		requestType = ":" + $('[value=' + $requestSelectType.val() + ']', $requestSelectType).attr('engNm');
        	}
        	
        	// Solution / Product Type
        	if($solPdSelectType.length > 0){
        		solPdType = ":" + $('[value=' + $solPdSelectType.val() + ']', $solPdSelectType).attr('engNm');
        	}else{
				solPdType = ":" + $.trim($('select[itemnm ="Product / Solution"][mailformitem="TS03"] option:selected').text().replace("Product / Solution",""));
			}
        	
        	// Industry Type
        	if($industrySelectType.length > 0){
        		industryType = ":" + $('[value=' + $industrySelectType.val() + ']', $industrySelectType).attr('engNm');
        	}else{				
				industryType = ":" + $.trim($('select[itemnm ="Industry"][mailformitem="TS03"] option:selected').text().replace("Industry", ""));
			}
        	
        	if(SITE_CD == 'sg'){
        		sendClickCode('content_click', 'make a request_send' + industryType);
        	}else{
        		sendClickCode('content_click', 'make a request_send' + solPdType + requestType);
        	}
        	
        }
});
