function initMyBusinessPage(){
	setMybusinessEvent();
}

function setMybusinessEvent(){
	
	$('[data-role=mybusiness-modify]').bind({
		'click':function(){
			modifyProfile();
		}
	});

	
	$('[data-role=mybusiness-save]').bind({
		'click':function(){
			if(isValidRequest()){
				saveProfile();
			}
		}
	});
	
	$('[data-role=cookie-test]').bind({
		'click':function(){			
			cookieTest();			
		}
	});
	
	$('[data-role=req-test]').bind({
		'click':function(){

		var data = {
		     reqTypeCd : 'REQ002'
			,iaCode  : 'B0500009'
			,subject : 'TEST'
			,message : 'MESSAGE'
			};

		$.myBusiness.myRequestLoging(data);

		}
	});
	
	$('[data-role=trial-test]').bind({
		'click':function(){

		var data = {
				 subject :  'Samsung School v1.5 test'
				,iaCode  : ''
				,iaOtherValue : 'others value'
				,supportedModel : 'Galaxy Tab 10.1 testtest'
				};

		$.myBusiness.myTrialLoging(data);

		}
	});
};

function isValidRequest(){
	
    $exitCheck = false;
    $('[data-role=mybusiness-alert]').hide();
   
	if($("#add-p-1").val() == "") {
		$('#alertText').html(myBusiness.messages.company);
		$('[data-role=mybusiness-alert]').show();
		$("#add-p-1").focus();
		return false;
	}
	
	if($("#add-p-2").val() == "") {
		$('#alertText').html(myBusiness.messages.job);
		$('[data-role=mybusiness-alert]').show();
		$("#add-p-2").focus();
		return false;
	}

    $("input[type=checkbox]", "div[data-role=ui-filter-area]").each(function(){
    	if($(this).is(":checked")){
    		$exitCheck = true;
    	}
    });

    if(!$exitCheck){
    	$('#alertText').html(myBusiness.messages.interests);
    	$('[data-role=mybusiness-alert]').show();
		return false;
    }	
	
    if(!$("#tabs-list-p-agree").is(":checked")){
    	$('#alertText').html(myBusiness.messages.agree);
		$('[data-role=mybusiness-alert]').show();
		$("#tabs-list-p-agree").focus();
		return false;
    }

    return true;
}

$(document).ready(function(){
	initMyBusinessPage();
});


var ss = $;
ss.myBusiness = {};
ss.myBusiness.data = {
	'GUID' 						: 'guid',
	'REL_SYS_TYPE_CD' 			: 'SA',
	'USER_TYPE_BV' 				: '2',
	'TYPE_CD_TRIAL' 			: 'UA-TR',
	'TYPE_CD_CNTCT_US'			: 'UA-CU',
	'TYPE_CD_INSIGHT' 			: 'UA-IS',
	// Recently cookie key
	'RECENTLY_SOLUTIONS_KEY' 	: 'recently_s',
	'RECENTLY_PRODUCTS_KEY' 	: 'recently_p',
	'RECENTLY_INSIGHTS_KEY' 	: 'recently_in',
	'RECENTLY_SOLUTIONS_SIZE' 	: 20,
	'RECENTLY_PRODUCTS_SIZE' 	: 30,
	'RECENTLY_INSIGHTS_SIZE' 	: 20	
};

ss.myBusiness.myTrialLoging = function(data){
	guid = $.cookies.get(this.data.GUID);
	
	if(!guid){
		return;
	}
	
	$.ajax({
		url : "/" + SITE_CD + "/business/my-business/cust-userloging",
		type : "post",
		data : {guid 			: guid,
				relSysTypeCd 	: this.data.REL_SYS_TYPE_CD,
				userTypeBv 		: this.data.USER_TYPE_BV,
				useTypeCd 		: this.data.TYPE_CD_TRIAL,
				subject		 	: data.subject,
				iaOtherValue	: data.iaOtherValue,
				relMdlConts		: data.supportedModel,
				iaCd			: data.iaCode
		},
		success: function (data) {},
		error:function(jqXHR, textStatus, errorThrown){}
	});
};

ss.myBusiness.myRequestLoging = function(myRequestMap){
	guid = $.cookies.get(this.data.GUID);
	
	if(!guid){
		return;
	}
	
	$.ajax({
		url : "/" + SITE_CD + "/business/my-business/cust-userloging",
		type : "post",
		data : {guid 			: guid,
				relSysTypeCd 	: this.data.REL_SYS_TYPE_CD,
				userTypeBv 		: this.data.USER_TYPE_BV,
				useTypeCd 		: this.data.TYPE_CD_CNTCT_US,
				reqTypeCd		: myRequestMap.reqTypeCd,
				iaCd			: myRequestMap.iaCode,
				subject			: myRequestMap.subject,
				message			: myRequestMap.message
		},
		success: function (data) {},
		error:function(jqXHR, textStatus, errorThrown){}
	});
};

ss.myBusiness.saveInsightsLoging = function(contsId){
	guid = $.cookies.get(this.data.GUID);
	
	if(!guid){
		return;
	}
	
	$.ajax({
		url : "/" + SITE_CD + "/business/my-business/cust-userloging",
		type : "post",
		data : {guid 			: guid,
				relSysTypeCd 	: this.data.REL_SYS_TYPE_CD,
				userTypeBv 		: this.data.USER_TYPE_BV,
				useTypeCd 		: this.data.TYPE_CD_INSIGHT,				
				relMdlConts		: contsId
		},
		success: function (data) {
			_common.open_popup_layer('contentsave');
			$container = $("[data-role=ui-layer-contentsave]");
			ss.insightclipAction($container, guid);
		},
		error:function(jqXHR, textStatus, errorThrown){}
	});
};

// Solutions recently cookie
ss.myBusiness.recentlySolutionCookie = function(modelCode){
	/*
	if(!$.cookies.get(this.data.GUID)){
		return;
	}
	*/
	
	// modelCode, cookie name, modelCode
	new ss.SpRecentlyCookie(modelCode, this.data.RECENTLY_SOLUTIONS_KEY, this.data.RECENTLY_SOLUTIONS_SIZE);
};

// Products recently cookie
ss.myBusiness.recentlyProductCookie = function(modelCode){
	/*
	if(!$.cookies.get(this.data.GUID)){
		return;
	}
	*/
	
	// modelCode, cookie name, modelCode
	new ss.SpRecentlyCookie(modelCode, this.data.RECENTLY_PRODUCTS_KEY, this.data.RECENTLY_PRODUCTS_SIZE);
};

// Insights recently cookie
ss.myBusiness.recentlyInsightCookie = function(contsId){
	/*
	if(!$.cookies.get(this.data.GUID)){
		return;
	}
	*/
	
	// modelCode, cookie name, modelCode
	new ss.InRecentlyCookie(contsId, this.data.RECENTLY_INSIGHTS_KEY, this.data.RECENTLY_INSIGHTS_SIZE);
};

(function ($) {
	
	/**
    SpRecentlyCookie object
    @class $.SpRecentlyCookie
    @constructor
    **/
	ss.SpRecentlyCookie = function(modelCode, recentlyType, maxCodeSize){
		//var guid = "";
		var recentlyCookie = "";
		var recentlyValue = {};
		
		ss.recentlyValueMap = {
			//guid:"",
			siteCode:"",
			modelCode:[]
		};
		
		function init(){
			//guid = $.cookies.get("guid");

			recentlyCookie = $.cookies.get(recentlyType);
			recentlyValue = ss.recentlyValueMap;
			
			if(recentlyCookie != null){
				$.map(recentlyCookie, function(value, key){
					/*
					if(key == "guid"){
						recentlyValue.guid = value;
					}
					*/
					if(key == "siteCode"){
						recentlyValue.siteCode = value;
					}
					if(key == "modelCode"){
						recentlyValue.modelCode = value;
					}
				});
				
				/*
				if(recentlyValue.guid != guid || recentlyValue.siteCode != SITE_CD){
					recentlyValue.guid = "";
					recentlyValue.siteCode = "";
					recentlyValue.modelCode = [];
				}
				*/
				if(recentlyValue.siteCode != SITE_CD){					
					recentlyValue.siteCode = "";
					recentlyValue.modelCode = [];
				}
			}
			
			createRecently();
			
			if(recentlyValue != null){
				ss.myBusiness.createCookie(recentlyType, JSON.stringify(ss.recentlyValueMap));
			}
		};
		
		function createRecently(){
			recentlyValue = ss.recentlyValueMap;
			
			if(recentlyValue.siteCode == ""){
				//recentlyValue.guid = guid;
				recentlyValue.siteCode = SITE_CD;
				recentlyValue.modelCode.push(modelCode);
			} else{
				if(!arrayContains(recentlyValue.modelCode, modelCode)){
					if(recentlyValue.modelCode.length >= maxCodeSize){
						modelCodeArray = arrayRemove(recentlyValue.modelCode, 0);
						recentlyValue.modelCode = [];
						recentlyValue.modelCode = modelCodeArray;
					}
					recentlyValue.modelCode.push(modelCode);
				} else {
					modelCodeArray = arrayRemove(recentlyValue.modelCode, arrayIndex(recentlyValue.modelCode, modelCode));
					recentlyValue.modelCode = [];
					recentlyValue.modelCode = modelCodeArray;
					
					recentlyValue.modelCode.push(modelCode);
				}
			}
		};
		
		init();
	};
	
	/**
    InRecentlyCookie object
    @class $.InRecentlyCookie
    @constructor
    **/
	ss.InRecentlyCookie = function(contsId, recentlyType, maxIdSize){
		//var guid = "";
		var recentlyCookie = "";
		var recentlyValue = {};
		
		ss.recentlyValueMap = {
			//guid:"",
			siteCode:"",
			contsId:[]
		};
		
		function init(){
			//guid = $.cookies.get("guid");

			recentlyCookie = $.cookies.get(recentlyType);
			recentlyValue = ss.recentlyValueMap;
			
			if(recentlyCookie != null){
				$.map(recentlyCookie, function(value, key){
					/*
					if(key == "guid"){
						recentlyValue.guid = value;
					}
					*/
					if(key == "siteCode"){
						recentlyValue.siteCode = value;
					}
					if(key == "contsId"){
						recentlyValue.contsId = value;
					}
				});
				
				/*
				if(recentlyValue.guid != guid || recentlyValue.siteCode != SITE_CD){
					recentlyValue.guid = "";
					recentlyValue.siteCode = "";
					recentlyValue.contsId = [];
				}
				*/
				if(recentlyValue.siteCode != SITE_CD){
					//recentlyValue.guid = "";
					recentlyValue.siteCode = "";
					recentlyValue.contsId = [];
				}
			}
			
			createRecently();
			
			if(recentlyValue != null){
				ss.myBusiness.createCookie(recentlyType, JSON.stringify(ss.recentlyValueMap));
			}
		};
		
		function createRecently(){
			recentlyValue = ss.recentlyValueMap;
			
			if(recentlyValue.siteCode == ""){
				//recentlyValue.guid = guid;
				recentlyValue.siteCode = SITE_CD;
				recentlyValue.contsId.push(contsId);
			} else{
				if(!arrayContains(recentlyValue.contsId, contsId)){
					if(recentlyValue.contsId.length >= maxIdSize){
						contsIdArray = arrayRemove(recentlyValue.contsId, 0);
						recentlyValue.contsId = [];
						recentlyValue.contsId = contsIdArray;
					}
					recentlyValue.contsId.push(contsId);
				} else {
					contsIdArray = arrayRemove(recentlyValue.contsId, arrayIndex(recentlyValue.contsId, contsId));
					recentlyValue.contsId = [];
					recentlyValue.contsId = contsIdArray;
					
					recentlyValue.contsId.push(contsId);
				}
			}
		};
		
		init();
	};
	
	function arrayRemove(value, index){
		return (index<0 || index>value.length) ? value : value.slice(0, index).concat(value.slice(index+1, value.length));
	}
	
	function arrayContains(value, element) {
		for (var i = 0; i < value.length; i++) {
			if (value[i] == element) {
				return true;
			}
		}
		return false;
	}
	
	function arrayIndex(value, element) {
		for (var i = 0; i < value.length; i++) {
			if (value[i] == element) {
				return i;
			}
		}
	}
	
	ss.myBusiness.createCookie = function(key, value){
		$.cookies.set(key, value);
	};
	
} (jQuery));

function editProfile(){
	if(!$.cookies.get("guid")){
		alert("Please Sign In!!");
		return;
	}
	$.ajax({
		type: 'GET',
		url: '/${siteCode}/business/my-business/edit-myprofile',
		data: $("#contactForm").serialize(),
		success: function(data) {
			window.location.href = '/${siteCode}/business/my-business/myProfile';
		},    
		error: function(e) { 
		}  
	});
};

function modifyProfile(){
	 guid = $.cookies.get("guid");
	 
	 returnURL = window.location.href;
	 
	 $modifyForm = $( "#biz4MemberModifyForm" );
	 
	 $modifyForm.attr('action', 'https://account.samsung.com/account/check.do');
	 $modifyForm.attr('target', '_blank');
	 $("#serviceID", $modifyForm).val( SERVICE_ID );
	 $("#domain", $modifyForm).val( DOMAIN );
	 $("#countryCode", $modifyForm).val( COUNTRY_CODE );
	 $("#languageCode", $modifyForm).val( LANGUAGE_CODE.toLowerCase() );
	 $("#goBackURL", $modifyForm).val( returnURL );
	 $("#GUID", $modifyForm).val( guid );	      
	 
	 $modifyForm.submit();
};

function saveProfile(){	
	guid = $.cookies.get("guid");		
	
	if(!guid){
		alert("Please Sign In!!");
		return;
	} 
	
	var sendData = {};
	
	sendData.iaCd = "";
	sendData.b2bIaClassCd= "";
	sendData.sysCd = "";
	sendData.guid = guid;
	sendData.siteCd = SITE_CD;	
	
	sendData.industryUrlNm = "";
	sendData.prdSoltUrlNm = "";
	
	
    $("input[name='chkIndustry']").each( function() {
    	if($(this).attr('checked')) {
    		sendData.iaCd +=  $(this).val() + "," ;
    		sendData.b2bIaClassCd += $(this).attr("data-class-cd") + "," ;
    		sendData.industryUrlNm += $(this).attr("data-url-nm") + "," ;
    	}		    	
    });
    
    $("input[name='chkCategory']").each( function() {
    	if($(this).attr('checked')) {
    		sendData.iaCd += $(this).val() + "," ;
    		sendData.b2bIaClassCd += $(this).attr("data-class-cd") + "," ;
    		sendData.prdSoltUrlNm += $(this).attr("data-url-nm") + "," ;
    	}		    	
    });
    
    $("input[name='chkType']").each( function() {
    	if($(this).attr('checked')) {
    		sendData.sysCd += $(this).val() + "," ;
    	}		    	
    });
            
    sendData.cmpyNm = $("#add-p-1").val();
    sendData.jobTitle = $("#add-p-2").val();
    
    sendData.firstName = $("#firstName").val();
    sendData.lastName = $("#lastName").val();
    
    sendData.contactId = $("#contactId").val();
    sendData.emailAddress = $("#emailAddress").val();
    
	$.ajax({
		type: 'post',
		url: "/" + SITE_CD + "/business/my-business/save-myprofile",
		data: sendData,		
		success: function(ajaxResult) {
			window.location.href = "/" + SITE_CD + "/business/my-business/myProfile";
		},    
		error: function(e) {
		} 
	});
};