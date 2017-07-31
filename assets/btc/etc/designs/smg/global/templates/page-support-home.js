$(document).ready(function() {
	
	var strHash = location.hash;
	var productTabUse = typeof($("#tab1").attr("id")) === 'string' ? true : false;
	var solutionTabUse = typeof($("#tab2").attr("id")) === 'string' ? true : false;
	if(strHash == '#product' && productTabUse){
		$("input[name=currentTab]").val(1);
	}else if(strHash == '#solution' && solutionTabUse){
		$("input[name=currentTab]").val(2);
	}
	SUPPORT.Common.responPC(function(){
		var contactUsTabUse = typeof($("#tab3").attr("id")) === 'string' ? true : false;
		
		if(strHash == '#contactus' && contactUsTabUse){
			$("input[name=currentTab]").val(3);
		}
	});
	
	var $currentTab = $("input[name=currentTab]");
	var currentTab = Number($currentTab.val());
	var $currentStep = $("input[name=currentStep]");
	var currentStep = Number($currentStep.val());
	
	if(typeof(currentTab) === 'number' && Number(currentTab) > 1){
		fnChangeTab(currentTab, $("#tab" + currentTab + " a"));
	}
	
	if(typeof(currentStep) === 'number' && Number(currentStep) > 1){
		if(currentTab <= 1){
			fnProductReloadStep(currentStep);
		}else if(currentTab === 2){
			fnSolutionReloadStep(currentStep);
		}
	}
});

function fnChangeTab(tab, objThis){
	var $tabLi = $(objThis).parent();
	var strActive = "active";
	var isActive = $tabLi.hasClass(strActive);
	if(isActive){
		return;
	}else{
		$(".main-tab .hortab li").removeClass(strActive);
		$tabLi.addClass(strActive);
	}
	
	$(".local-layer").trigger("layerClose");
	
	switch(tab){
	case 1 :
		$("#tab2Area").hide();
		$("#tab3Area").hide();
		$("#tab1Area").fadeIn();
		fnProductPrevStep1();
		break;
	case 2 :
		$("#tab1Area").hide();
		$("#tab3Area").hide();
		$("#tab2Area").fadeIn();
		fnSolutionPrevStep1();
		break;
	case 3:
		$("#tab1Area").hide();
		$("#tab2Area").hide();
		$("#tab3Area").fadeIn();
		break;
	default:
		break;
	}
	
	$("input[name=currentTab]").val(tab);
}
function fnSolutionReloadStep(step){
	fnSolutionSetStep();
	
	switch(step){
	case 2 :
		fnSolutionNextStep2();
		break;
	case 3 :
		fnSolutionNextStep2();
		fnSolutionNextStep3();
		break;
	case 4:
		fnSolutionNextStep2();
		fnSolutionNextStep3();
		fnSolutionNextStep4();
		break;
	default:
		break;
	}
	
	fnSolutionSetStep(step);
}

function fnSolutionSetStep(step){
	switch(step){
	case 1 :
		$("#solution2Step").hide();
		$("#solution3Step").hide();
		$("#solution4Step").hide();
		fnSetFirstFocus("#solution1Step .thum-list");
		break;
	case 2 :
		$("#solution2Step").show();
		$("#solution3Step").hide();
		$("#solution4Step").hide();
		fnSetFirstFocus("#solution2Step .stit-label");
		break;
	case 3:
		$("#solution1Step").hide();
		$("#solution2Step").hide();
		$("#solution3Step").show();
		$("#solution4Step").hide();
		fnSetFirstFocus("#solution3Step .stit-label");
		break;
	case 4:
		$("#solution1Step").hide();
		$("#solution2Step").hide();
		$("#solution3Step").hide();
		$("#solution4Step").show();
		fnSetFirstFocus("#solution4Step .stit-label");
		break;
	default:
		$("#solution1Step").hide();
		$("#solution2Step").hide();
		$("#solution3Step").hide();
		$("#solution4Step").hide();
		break;
	}
	
	$('.solution-step').removeClass('solution-step-show');
	$('#solution' + step + 'Step').addClass('solution-step-show');
	
	if(step === 1){
		SUPPORT.Component.solutionStep1Show();
	}else{
		SUPPORT.Component.solutionStepShow();
	}
}

function fnSolutionClearStep2(){	
	$("#solution2Step .pro-list").html("");
	$("#solution2Step .topic-name").text("-");
	$("#solution2Step .solution-area").hide();
	$("#moreItemSolution2").hide();
	$("#btnModelMoreSolution2").show();
	$("#btnModelLessSolution2").hide();
}

function fnSolutionClearStep3(){
	$("#solution3Step .pro-list").html("");
	$("#solution3Step .lay-bich .bich-dep-list .txt").text("");
	$("#solution3Step .category-name").text("-");
	$("#solution3Step .topic-name").text("-");
    $("#solution3Step .solution-area").hide();
    $("#moreItemSolution3").hide();
	$("#btnModelMoreSolution3").show();
	$("#btnModelLessSolution3").hide();
}

function fnSolutionClearStep4(){
	$("#solution4Step .pro-list").html("");
	$("#solution4Step .lay-bich .bich-dep-list .txt").text("");
	$("#solution4Step .category-name").text("-");
	$("#solution4Step .topic-name").text("-");
    $("#solution4Step .solution-area").hide();
    $("#moreItemSolution4").hide();
	$("#btnModelMoreSolution4").show();
	$("#btnModelLessSolution4").hide();
}

function fnSolutionPrevStep1(){	
	fnSolutionClearStep2();
	fnSolutionClearStep3();
	fnSolutionClearStep4();
	
	fnSolutionSetStep(1);
	
	$("input[name=currentStep]").val(1);
}

function fnSolutionPrevStep2(){
	fnSolutionClearStep3();
	fnSolutionClearStep4();
	 
	fnSolutionSetStep(2);
	
	$("input[name=currentStep]").val(2);
}

function fnSolutionPrevStep3(){
	fnSolutionClearStep4();
	 
	fnSolutionSetStep(3);
	
	$("input[name=currentStep]").val(3);
}

function fnSolutionNextStep2(objThis){
	var isShow = false;
	var sympClassNm = $("input[name=sympClassNmSolution]").val();
	var topicNm = $("input[name=topicNmSolution]").val();
	if(typeof(objThis) !== 'undefined'){
		isShow = true;
		sympClassNm = $(objThis).parent().find("input[name=sympClassNm]").val();
		topicNm = $(objThis).parent().find("input[name=topicNm]").val();
	}
	$("input[name=currentStep]").val(2);
	$("input[name=sympClassNmSolution]").val(sympClassNm);
	$("input[name=topicNmSolution]").val(topicNm);
	
	var requestCtgType = "S";
	var strUrl = "/aemapi/support/common/popularcategory";
	$.ajax({
		type: "POST",
		data: {
			"requestSiteCode" : csSiteCode
			,"requestCtgType" : requestCtgType
			,"requestSympClassNm" : sympClassNm
			},
		url: strUrl,
		success: function (data) {
			if(data && data.iaList.length > 0) {
				 var list = data.iaList;
				 var strRow1El = '', strRow2El = '';
				 var showMoreCnt = 6;
				 
				 $.each(list, function (index, iaList) {
					 var pcImageUrl = fnDataCheck(iaList.pcImageUrl, strNoImagePc);
					 var mobileImageUrl = fnDataCheck(iaList.mobileImageUrl, pcImageUrl);
					 var iaPcImgDesc = fnDataCheck(iaList.iaPcImgDesc, strNoImageDesc);
					 
					 var strEl = '';
					 strEl += '<li>';
					 strEl += '	<a href="#" class="item pro" data-scrollGo =".main-tab" onclick="fnSolutionNextStep3(this); return false;" data-omni="' + iaList.iaEngNm + '">';
					 strEl += '		<div class="pro-inner">';
					 strEl += '			<span class="thum"><img src="' + pcImageUrl + '" data-mobileSrc="' + mobileImageUrl + '" alt="' + iaPcImgDesc + '"></span>';
					 strEl += '			<span class="text">' + iaList.iaNm + '</span>';
					 strEl += '		</div>';
					 strEl += '	</a>';
					 strEl += '	<input type="hidden" name="iaLvlNo" value="' + iaList.iaLvlNo + '" />';
					 strEl += '	<input type="hidden" name="iaCode" value="' + iaList.iaCode + '" />';
					 strEl += '	<input type="hidden" name="iaNm" value="' + iaList.iaNm + '" />';
					 strEl += '	<input type="hidden" name="iaEngNm" value="' + iaList.iaEngNm + '" />';
					 strEl += '	<input type="hidden" name="iaUrlNm" value="' + iaList.iaUrlNm + '" />';
					 strEl += '</li>';
					 strEl += '';
					 
					 if(index < showMoreCnt) strRow1El += strEl;
					 else strRow2El += strEl;
				 });
				 
				 var strStepId = "solution2Step";
				 $("#" + strStepId + " .pro-row1").html(strRow1El);
				 $("#" + strStepId + " .pro-row2").html(strRow2El);
				 if(list.length > showMoreCnt){
					 $("#" + strStepId + " .more-low").show();
				 }else{
					 $("#" + strStepId + " .more-low").hide();
				 }
				 $("#" + strStepId + " .topic-name").text(topicNm);
				 
				 SUPPORT.Component.mobileOneProList();//li 한개일때 중앙정렬
				 
				 fnSolutionGetSolution("", "", sympClassNm, strStepId);
				 
				 if(isShow) fnSolutionSetStep(2);
			}
        }
	});		
}

function fnSolutionNextStep3(objThis){
	var isShow = false;
	var sympClassNm = $("input[name=sympClassNmSolution]").val();
	var topicNm = $("input[name=topicNmSolution]").val();
	var iaLvlNo2Depth = $("input[name=iaLvlNo2DepthSolution]").val();
	var iaCode2Depth = $("input[name=iaCode2DepthSolution]").val();
	var iaNm2Depth = $("input[name=iaNm2DepthSolution]").val();
	var iaEngNm2Depth = $("input[name=iaEngNm2DepthSolution]").val();
	var iaUrlNm2Depth = $("input[name=iaUrlNm2DepthSolution]").val();
	if(typeof(objThis) !== 'undefined'){
		isShow = true;
		iaLvlNo2Depth = $(objThis).parent().find("input[name=iaLvlNo]").val();
		iaCode2Depth = $(objThis).parent().find("input[name=iaCode]").val();
		iaNm2Depth = $(objThis).parent().find("input[name=iaNm]").val();
		iaEngNm2Depth = $(objThis).parent().find("input[name=iaEngNm]").val();
		iaUrlNm2Depth = $(objThis).parent().find("input[name=iaUrlNm]").val();
	}
	$("input[name=currentStep]").val(3);
	$("input[name=iaLvlNo2DepthSolution]").val(iaLvlNo2Depth);
	$("input[name=iaCode2DepthSolution]").val(iaCode2Depth);
	$("input[name=iaNm2DepthSolution]").val(iaNm2Depth);
	$("input[name=iaEngNm2DepthSolution]").val(iaEngNm2Depth);
	$("input[name=iaUrlNm2DepthSolution]").val(iaUrlNm2Depth);
	
	var requestOutType = "D";
	var strUrl = "/aemapi/support/common/commoncategory";
	$.ajax({
		type: "POST",
		data: {
			"requestSiteCode" : csSiteCode
			,"requestOutType" : requestOutType
			,"requestIaCode" : iaCode2Depth
			},
		url: strUrl,
		success: function (data) {
			if(data && data.iaList.length > 0) {
				 var list = data.iaList;
				 var strRow1El = '', strRow2El = '';
				 var showMoreCnt = 6;
				 
				 $.each(list, function (index, iaList) {
					 var pcImageUrl = fnDataCheck(iaList.pcImageUrl, strNoImagePc);
					 var mobileImageUrl = fnDataCheck(iaList.mobileImageUrl, pcImageUrl);
					 var iaPcImgDesc = fnDataCheck(iaList.iaPcImgDesc, strNoImageDesc);
					 
					 var strEl = '';
					 strEl += '<li>';
					 strEl += '	<a href="#" class="item pro" data-scrollGo =".main-tab" onclick="fnSolutionNextStep4(this); return false;" data-omni="' + iaList.iaEngNm + '">';
					 strEl += '		<div class="pro-inner">';
					 strEl += '			<span class="thum"><img src="' + pcImageUrl + '" data-mobileSrc="' + mobileImageUrl + '" alt="' + iaPcImgDesc + '"></span>';
					 strEl += '			<span class="text">' + iaList.iaNm + '</span>';
					 strEl += '		</div>';
					 strEl += '	</a>';
					 strEl += '	<input type="hidden" name="iaLvlNo" value="' + iaList.iaLvlNo + '" />';
					 strEl += '	<input type="hidden" name="iaCode" value="' + iaList.iaCode + '" />';
					 strEl += '	<input type="hidden" name="iaNm" value="' + iaList.iaNm + '" />';
					 strEl += '	<input type="hidden" name="iaEngNm" value="' + iaList.iaEngNm + '" />';
					 strEl += '	<input type="hidden" name="iaUrlNm" value="' + iaList.iaUrlNm + '" />';
					 strEl += '</li>';
					 strEl += '';
					 
					 if(index < showMoreCnt) strRow1El += strEl;
					 else strRow2El += strEl;
				 });
				 
				 var iaNm1Depth = fnDataCheck(data.pIaNm);
				 var iaUrlNm1Depth = fnDataCheck(data.pIaUrlNm);
				 $("input[name=iaNm1DepthSolution]").val(iaNm1Depth);
				 $("input[name=iaUrlNm1DepthSolution]").val(iaUrlNm1Depth);
				 
				 var strStepId = "solution3Step";
				 $("#" + strStepId + " .pro-row1").html(strRow1El);
				 $("#" + strStepId + " .pro-row2").html(strRow2El);
				 if(list.length > showMoreCnt){
					 $("#" + strStepId + " .more-low").show();
				 }else{
					 $("#" + strStepId + " .more-low").hide();
				 }
				 $("#" + strStepId + " .lay-bich .bich-dep-list .txt").text(iaNm1Depth);
				 $("#" + strStepId + " .category-name").text(iaNm2Depth);
				 $("#" + strStepId + " .topic-name").text(topicNm);
				 
				 var strPcpUrl = fnLinkUrl( csRoot + "/category" ) + "/" + iaUrlNm1Depth + "/" + iaUrlNm2Depth;
				 $("#solutionPcp2depth a").attr('href', strPcpUrl);
				 $("#solutionPcp2depth a").attr('data-omni', iaEngNm2Depth);
				 
				 SUPPORT.Component.mobileOneProList();//li 한개일때 중앙정렬
				 
				 fnSolutionGetSolution(iaLvlNo2Depth, iaCode2Depth, sympClassNm, strStepId);
				 
				 if(isShow) fnSolutionSetStep(3);
			}
        }
	});		
}

function fnSolutionNextStep4(objThis){
	var isShow = false;
	var sympClassNm = $("input[name=sympClassNmSolution]").val();
	var topicNm = $("input[name=topicNmSolution]").val();
	var iaNm1Depth = $("input[name=iaNm1DepthSolution]").val();
	var iaUrlNm1Depth = $("input[name=iaUrlNm1DepthSolution]").val();
	var iaNm2Depth = $("input[name=iaNm2DepthSolution]").val();
	var iaEngNm2Depth = $("input[name=iaEngNm2DepthSolution]").val();
	var iaUrlNm2Depth = $("input[name=iaUrlNm2DepthSolution]").val();
	var iaLvlNo3Depth = $("input[name=iaLvlNo3DepthSolution]").val();
	var iaCode3Depth = $("input[name=iaCode3DepthSolution]").val();
	var iaNm3Depth = $("input[name=iaNm3DepthSolution]").val();
	var iaEngNm3Depth = $("input[name=iaEngNm3DepthSolution]").val();
	var iaUrlNm3Depth = $("input[name=iaUrlNm3DepthSolution]").val();
	if(typeof(objThis) !== 'undefined'){
		isShow = true;
		iaLvlNo3Depth = $(objThis).parent().find("input[name=iaLvlNo]").val();
		iaCode3Depth = $(objThis).parent().find("input[name=iaCode]").val();
		iaNm3Depth = $(objThis).parent().find("input[name=iaNm]").val();
		iaEngNm3Depth = $(objThis).parent().find("input[name=iaEngNm]").val();
		iaUrlNm3Depth = $(objThis).parent().find("input[name=iaUrlNm]").val();
	}
	$("input[name=currentStep]").val(4);
	$("input[name=iaLvlNo3DepthSolution]").val(iaLvlNo3Depth);
	$("input[name=iaCode3DepthSolution]").val(iaCode3Depth);
	$("input[name=iaNm3DepthSolution]").val(iaNm3Depth);
	$("input[name=iaEngNm3DepthSolution]").val(iaEngNm3Depth);
	$("input[name=iaUrlNm3DepthSolution]").val(iaUrlNm3Depth);
	
	var strUrl = "/aemapi/support/common/popularproduct";
	$.ajax({
		type: "POST",
		data: {
			"requestSiteCode" : csSiteCode
			,"requestIaCode" : iaCode3Depth
			},
		url: strUrl,
		success: function (data) {
			if(data && data.popularList.length > 0) {
				 var list = data.popularList;
				 var productFl = data.productFl;
				 var strRow1El = '', strRow2El = '';
				 var showMoreCnt = 6;
				 
				 $.each(list, function (index, popularList) {
					 var modelCode = fnDataCheck(popularList.modelCode);
					 var modelName = fnDataCheck(popularList.modelName);
					 var displayName = fnDataCheck(popularList.displayName);
					 var modelImageUrl = fnDataCheck(popularList.modelImageUrl, strNoImagePc);
					 var modelImageDesc = fnDataCheck(popularList.modelCode, strNoImageDesc);
					 var dataOmni = modelCode + "," + modelName;
					 var strPdpUrl = fnLinkUrl( csRoot + "/model" ) + "/" + popularList.modelCode;
					 var modelCodeEl = "";
					 if(productFl === 'G'){
						 displayName = fnDataCheck(popularList.genericNm);
						 modelImageUrl = fnDataCheck(popularList.genericImageUrl, strNoImagePc);
						 modelImageDesc = fnDataCheck(popularList.genericUrl, strNoImageDesc);
						 dataOmni = fnDataCheck(popularList.genericUrl) + "," + fnDataCheck(popularList.genericNm);
						 strPdpUrl = fnLinkUrl( csRoot + "/generic" ) + "/" + popularList.genericUrl;
					 }else{
						 modelCodeEl = '			<span class="model">(' + modelCode + ')</span>';
					 }
					 
					 var strEl = '';
					 strEl += '<li>';
					 strEl += '	<a href="' + strPdpUrl + '" class="item pro" data-omni="' + dataOmni + '">';
					 strEl += '		<div class="pro-inner">';
					 strEl += '			<span class="thum"><img src="' + modelImageUrl + '" alt="' + modelImageDesc + '"></span>';
					 strEl += '			<span class="text">' + displayName + '</span>';
					 strEl += modelCodeEl;
					 strEl += '		</div>';
					 strEl += '	</a>';
					 strEl += '</li>';
					 strEl += '';
					 
					 if(index < showMoreCnt) strRow1El += strEl;
					 else strRow2El += strEl;
				 });
				 
				 var strStepId = "solution4Step";
				 $("#" + strStepId + " .pro-row1").html(strRow1El);
				 $("#" + strStepId + " .pro-row2").html(strRow2El);
				 if(list.length > showMoreCnt){
					 $("#" + strStepId + " .more-low").show();
				 }else{
					 $("#" + strStepId + " .more-low").hide();
				 }
				 $("#" + strStepId + " .lay-bich .bich-dep-list .txt").eq(0).text(iaNm1Depth);
				 $("#" + strStepId + " .lay-bich .bich-dep-list .txt").eq(1).text(iaNm2Depth);
				 $("#" + strStepId + " .category-name").text(iaNm3Depth);
				 $("#" + strStepId + " .topic-name").text(topicNm);
				 
				 var strPcpUrl = fnLinkUrl( csRoot + "/category" ) + "/" + iaUrlNm1Depth + "/" + iaUrlNm2Depth + "/" + iaUrlNm3Depth;
				 $("#solutionPcp3depth a").attr('href', strPcpUrl);
				 $("#solutionPcp3depth a").attr('data-omni', iaEngNm3Depth);
				 
				 SUPPORT.Component.mobileOneProList();//li 한개일때 중앙정렬
				 
				 fnSolutionGetSolution(iaLvlNo3Depth, iaCode3Depth, sympClassNm, strStepId);
				 
				 if(isShow) fnSolutionSetStep(4);
			}
        }
	});		
}

function fnSolutionGetSolution(requestIaLvlNo, requestIaCode, requestSympClassEngNm, strStepId){
	
	var strEl = fnGetSolution(requestIaLvlNo, requestIaCode, "", requestSympClassEngNm);
	
	if(strEl !== ""){
		$("#" + strStepId + " .grid-list.type2").html(strEl);
		$("#" + strStepId + " .solution-area").show();
	}else{
		$("#" + strStepId + " .solution-area").hide();
	}
}
var modelGArray = [];
var modelGroupArray = [];

$(document).ready(function() {
	fnRecentPage();
});

function fnRecentPage(){
	var isWcmmode = $("input[name=wcmmode]").val() === 'true' ? true : false;
	var cName = "cs_" + csSiteCode + "_page";
	var pageCookie1 = fnGetCookie(cName + 1);
	
	var strEl = '';
	if($("div.check-ck").hasClass("check-ck") && (pageCookie1 !== '' || isWcmmode)){
		var pageCookieCnt = 5;
		for(var i=1; i<pageCookieCnt; i++){
			var pageCookie = fnGetCookie(cName + i);
			if(pageCookie !== ''){
				var pageCookieArray = pageCookie.split(",");
				var pageTitle = pageCookieArray[0];
				var pageUrl = pageCookieArray[1];
				
				strEl += '<li>';
				strEl += '	<a href="' + pageUrl + '" class="white bich right allowr">';
				strEl += '		<span class="txt">' + pageTitle + '</span>';
				strEl += '	</a>';
				strEl += '</li>';
			}
		}
		
		$("div.check-ck ul.ck-list").html(strEl);
		$("div.check-ck").show();
	}else{
		$("div.check-ck ul.ck-list").html(strEl);
		$("div.check-ck").hide();
	}
}

function fnGetDeviceInfoCheck(){
	SUPPORT.Common.responMobile(function(){
		fnGetDeviceInfo();
	});
}

function fnGetDeviceInfo(){
	if($("#samsungDevice").hasClass("check-ck-m") || $("#othersDevice").hasClass("check-ck-m")){
		var userAgent = window.navigator.userAgent;
		var modelArray = fnGetModelGroup(userAgent);
		
		if(modelArray.length > 0){
			var strPdpUrl = fnLinkUrl( csRoot + "/model" ) + "/" + modelArray[2];
			$("#samsungDevice p.tit-ck strong.bold").text(modelArray[1]);
			$("#samsungDevice ul.ck-list li").eq(0).find("a").attr("href", strPdpUrl);
			$("#samsungDevice ul.ck-list li").eq(1).find("a").attr("href", strPdpUrl + "#downloads");
			$("#samsungDevice").show();
			$("#othersDevice").hide();
		}else{
			var othersText = $("#othersDevice p.tit-ck").text();
			var othersLinkText = $("#othersDevice ul.ck-list li").eq(0).find("span.txt").text();
			var othersLinkUrl = $("#othersDevice ul.ck-list li").eq(0).find("a").attr("href");
			if(othersText.length > 0 && othersLinkText.length > 0 && othersLinkUrl.length > 0){
				$("#othersDevice").show();
			}else{
				$("#othersDevice").hide();
			}
			$("#samsungDevice").hide();
		}
	}
}

function fnGetModelGroup(userAgent){
	var modelArray = [];
	for(var i=0; i<modelGroupArray.length; i++){
		if (userAgent.match(modelGroupArray[i][0]) != null){
			modelArray = modelGroupArray[i];
			break;
		}
	}
	return modelArray;
}

function fnProductReloadStep(step){
	fnProductSetStep();
	
	switch(step){
	case 2 :
		fnProductNextStep2();
		break;
	case 3:
		fnProductNextStep2();
		fnProductNextStep3();
		break;
	default:
		break;
	}
	
	fnProductSetStep(step);
}

function fnProductSetStep(step){
	switch(step){
	case 1 :
		$("#product1Step").show();
		$("#product2Step").hide();
		$("#product3Step").hide();
		fnSetFirstFocus("#product1Step .lay-bich");
		break;
	case 2 :
		$("#product1Step").hide();
		$("#product2Step").show();
		$("#product3Step").hide();
		fnSetFirstFocus("#product2Step .lay-bich");
		break;
	case 3:
		$("#product1Step").hide();
		$("#product2Step").hide();
		$("#product3Step").show();
		fnSetFirstFocus("#product3Step .lay-bich");
		break;
	default:
		$("#product1Step").hide();
		$("#product2Step").hide();
		$("#product3Step").hide();
		break;
	}
	
	$('.product-step').removeClass('product-step-show');
	$('#product' + step + 'Step').addClass('product-step-show');
	SUPPORT.Component.productStepShow();
}

function fnProductClearStep2(){
	$("#product2Step .pro-list").html("");
	$("#product2Step .lay-bich .bich-dep-list .txt").text("");
	$("#product2Step .category-name").text("-");
	$("#product2Step .solution-area").hide();
	$("#moreItemProduct2").hide();
	$("#btnModelMoreProduct2").show();
	$("#btnModelLessProduct2").hide();
}

function fnProductClearStep3(){
	$("#product3Step .pro-list").html("");
	$("#product3Step .lay-bich .bich-dep-list .txt").text("");
	$("#product3Step .category-name").text("-");
	$("#product3Step .solution-area").hide();
	$("#moreItemProduct3").hide();
	$("#btnModelMoreProduct3").show();
	$("#btnModelLessProduct3").hide();
}

function fnProductPrevStep1(){
	fnProductClearStep2();
	fnProductClearStep3();
	 
	fnProductSetStep(1);
	
	$("input[name=currentStep]").val(1);
}

function fnProductPrevStep2(){
	fnProductClearStep3();
	
	fnProductSetStep(2);
	
	$("input[name=currentStep]").val(2);
}

function fnProductAll(){
	
	var strStepId = "product1Step";
	var dataCnt = $("#" + strStepId + " .allpro-list li a").length;
	if(dataCnt > 0){
		return;
	}
	
	var requestOutType = "A";
	
	var strUrl = "/aemapi/support/common/commoncategory";
	
	$.ajax({
		type: "POST",
		data: {
			"requestSiteCode" : csSiteCode
			,"requestOutType" : requestOutType
			},
		url: strUrl,
		success: function (data) {
			if(data && data.iaList.length > 0) {
				 var list = data.iaList;
				 
				 var strEl = '';
				 
				 $.each(list, function (index, iaList) {
					 strEl += '<li>';
					 strEl += '	<a href="#" class="oned">' + iaList.iaNm + '</a>';
					 
					 if(iaList.subIaList.length > 0){
						 strEl += '	<ul class="twod-list">';
						 
						 $.each(iaList.subIaList, function (index, subIaList) {
							 strEl += '		<li>';
							 strEl += '			<a href="#" class="twod" data-scrollGo =".main-tab" onclick="fnProductNextStep2(this); return false;" data-omni="' + subIaList.iaEngNm + '">' + subIaList.iaNm + '</a>';
							 strEl += '			<input type="hidden" name="iaLvlNo" value="' + subIaList.iaLvlNo + '" />';
							 strEl += '			<input type="hidden" name="iaCode" value="' + subIaList.iaCode + '" />';
							 strEl += '			<input type="hidden" name="iaNm" value="' + subIaList.iaNm + '" />';
							 strEl += '			<input type="hidden" name="iaEngNm" value="' + subIaList.iaEngNm + '" />';
							 strEl += '			<input type="hidden" name="iaUrlNm" value="' + subIaList.iaUrlNm + '" />';
							 strEl += '		</li>';
						 });
						 
						 strEl += '	</ul>';
					 }
					 
					 strEl += '</li>';
				 });
				 
				 $("#" + strStepId + " .allpro-list").html(strEl);
				 
				 $(".show-more").trigger("showmoreOpen").addClass("ajaxComplete");
			}
        }
	});		
}

function fnProductNextStep2(objThis){
	var isShow = false;
	var iaLvlNo2Depth = $("input[name=iaLvlNo2DepthProduct]").val();
	var iaCode2Depth = $("input[name=iaCode2DepthProduct]").val();
	var iaNm2Depth = $("input[name=iaNm2DepthProduct]").val();
	var iaEngNm2Depth = $("input[name=iaEngNm2DepthProduct]").val();
	var iaUrlNm2Depth = $("input[name=iaUrlNm2DepthProduct]").val();
	if(typeof(objThis) !== 'undefined'){
		isShow = true;
		iaLvlNo2Depth = $(objThis).parent().find("input[name=iaLvlNo]").val();
		iaCode2Depth = $(objThis).parent().find("input[name=iaCode]").val();
		iaNm2Depth = $(objThis).parent().find("input[name=iaNm]").val();
		iaEngNm2Depth = $(objThis).parent().find("input[name=iaEngNm]").val();
		iaUrlNm2Depth = $(objThis).parent().find("input[name=iaUrlNm]").val();
	}
	$("input[name=currentStep]").val(2);
	$("input[name=iaLvlNo2DepthProduct]").val(iaLvlNo2Depth);
	$("input[name=iaCode2DepthProduct]").val(iaCode2Depth);
	$("input[name=iaNm2DepthProduct]").val(iaNm2Depth);
	$("input[name=iaEngNm2DepthProduct]").val(iaEngNm2Depth);
	$("input[name=iaUrlNm2DepthProduct]").val(iaUrlNm2Depth);
	
	var requestOutType = "D";
	var strUrl = "/aemapi/support/common/commoncategory";
	$.ajax({
		type: "POST",
		data: {
			"requestSiteCode" : csSiteCode
			,"requestOutType" : requestOutType
			,"requestIaCode" : iaCode2Depth
			},
		url: strUrl,
		success: function (data) {
			if(data && data.iaList.length > 0) {
				 var list = data.iaList;
				 var strRow1El = '', strRow2El = '';
				 var showMoreCnt = 6;
				 
				 $.each(list, function (index, iaList) {
					 var pcImageUrl = fnDataCheck(iaList.pcImageUrl, strNoImagePc);
					 var mobileImageUrl = fnDataCheck(iaList.mobileImageUrl, pcImageUrl);
					 var iaPcImgDesc = fnDataCheck(iaList.iaPcImgDesc, strNoImageDesc);
					 
					 var strEl = '';
					 strEl += '<li>';
					 strEl += '	<a href="#" class="item pro" data-scrollGo =".main-tab" onclick="fnProductNextStep3(this); return false;" data-omni="' + iaList.iaEngNm + '">';
					 strEl += '		<div class="pro-inner">';
					 strEl += '			<span class="thum"><img src="' + pcImageUrl + '" data-mobileSrc="' + mobileImageUrl + '" alt="' + iaPcImgDesc + '"></span>';
					 strEl += '			<span class="text">' + iaList.iaNm + '</span>';
					 strEl += '		</div>';
					 strEl += '	</a>';
					 strEl += '	<input type="hidden" name="iaLvlNo" value="' + iaList.iaLvlNo + '" />';
					 strEl += '	<input type="hidden" name="iaCode" value="' + iaList.iaCode + '" />';
					 strEl += '	<input type="hidden" name="iaNm" value="' + iaList.iaNm + '" />';
					 strEl += '	<input type="hidden" name="iaEngNm" value="' + iaList.iaEngNm + '" />';
					 strEl += '	<input type="hidden" name="iaUrlNm" value="' + iaList.iaUrlNm + '" />';
					 strEl += '</li>';
					 
					 if(index < showMoreCnt) strRow1El += strEl;
					 else strRow2El += strEl;
				 });
				 
				 var iaNm1Depth = fnDataCheck(data.pIaNm);
				 var iaUrlNm1Depth = fnDataCheck(data.pIaUrlNm);
				 $("input[name=iaNm1DepthProduct]").val(iaNm1Depth);
				 $("input[name=iaUrlNm1DepthProduct]").val(iaUrlNm1Depth);
				 
				 var strStepId = "product2Step";
				 $("#" + strStepId + " .pro-row1").html(strRow1El);
				 $("#" + strStepId + " .pro-row2").html(strRow2El);
				 if(list.length > showMoreCnt){
					 $("#" + strStepId + " .more-low").show();
				 }else{
					 $("#" + strStepId + " .more-low").hide();
				 }
				 $("#" + strStepId + " .lay-bich .bich-dep-list .txt").text(iaNm1Depth);
				 $("#" + strStepId + " .category-name").text(iaNm2Depth);
				 
				 var strPcpUrl = fnLinkUrl( csRoot + "/category" ) + "/" + iaUrlNm1Depth + "/" + iaUrlNm2Depth;
				 $("#productPcp2depth a").attr('href', strPcpUrl);
				 $("#productPcp2depth a").attr('data-omni', iaEngNm2Depth);
				 
				 SUPPORT.Component.mobileOneProList();//li 한개일때 중앙정렬
				 
				 fnProductGetSolution(iaLvlNo2Depth, iaCode2Depth, "", strStepId);
				 
				 if(isShow) fnProductSetStep(2);
			}
        }
	});
}

function fnProductNextStep3(objThis){
	var isShow = false;
	var iaNm1Depth = $("input[name=iaNm1DepthProduct]").val();
	var iaUrlNm1Depth = $("input[name=iaUrlNm1DepthProduct]").val();
	var iaNm2Depth = $("input[name=iaNm2DepthProduct]").val();
	var iaEngNm2Depth = $("input[name=iaEngNm2DepthProduct]").val();
	var iaUrlNm2Depth = $("input[name=iaUrlNm2DepthProduct]").val();
	var iaLvlNo3Depth = $("input[name=iaLvlNo3DepthProduct]").val();
	var iaCode3Depth = $("input[name=iaCode3DepthProduct]").val();
	var iaNm3Depth = $("input[name=iaNm3DepthProduct]").val();
	var iaEngNm3Depth = $("input[name=iaEngNm3DepthProduct]").val();
	var iaUrlNm3Depth = $("input[name=iaUrlNm3DepthProduct]").val();
	if(typeof(objThis) !== 'undefined'){
		isShow = true;
		iaLvlNo3Depth = $(objThis).parent().find("input[name=iaLvlNo]").val();
		iaCode3Depth = $(objThis).parent().find("input[name=iaCode]").val();
		iaNm3Depth = $(objThis).parent().find("input[name=iaNm]").val();
		iaEngNm3Depth = $(objThis).parent().find("input[name=iaEngNm]").val();
		iaUrlNm3Depth = $(objThis).parent().find("input[name=iaUrlNm]").val();
	}
	$("input[name=currentStep]").val(3);
	$("input[name=iaLvlNo3DepthProduct]").val(iaLvlNo3Depth);
	$("input[name=iaCode3DepthProduct]").val(iaCode3Depth);
	$("input[name=iaNm3DepthProduct]").val(iaNm3Depth);
	$("input[name=iaEngNm3DepthProduct]").val(iaEngNm3Depth);
	$("input[name=iaUrlNm3DepthProduct]").val(iaUrlNm3Depth);
	
	var strUrl = "/aemapi/support/common/popularproduct";
	$.ajax({
		type: "POST",
		data: {
			"requestSiteCode" : csSiteCode
			,"requestIaCode" : iaCode3Depth
			},
		url: strUrl,
		success: function (data) {
			if(data && data.popularList.length > 0) {
				 var list = data.popularList;
				 var productFl = data.productFl;
				 var strRow1El = '', strRow2El = '';
				 var showMoreCnt = 6;
				 
				 $.each(list, function (index, popularList) {
					 var modelCode = fnDataCheck(popularList.modelCode);
					 var modelName = fnDataCheck(popularList.modelName);
					 var displayName = fnDataCheck(popularList.displayName);
					 var modelImageUrl = fnDataCheck(popularList.modelImageUrl, strNoImagePc);
					 var modelImageDesc = fnDataCheck(popularList.modelCode, strNoImageDesc);
					 var dataOmni = modelCode + "," + modelName;
					 var strPdpUrl = fnLinkUrl( csRoot + "/model" ) + "/" + popularList.modelCode;
					 var modelCodeEl = "";
					 if(productFl === 'G'){
						 displayName = fnDataCheck(popularList.genericNm);
						 modelImageUrl = fnDataCheck(popularList.genericImageUrl, strNoImagePc);
						 modelImageDesc = fnDataCheck(popularList.genericUrl, strNoImageDesc);
						 dataOmni = fnDataCheck(popularList.genericUrl) + "," + fnDataCheck(popularList.genericNm);
						 strPdpUrl = fnLinkUrl( csRoot + "/generic" ) + "/" + popularList.genericUrl;
					 }else{
						 modelCodeEl = '			<span class="model">(' + modelCode + ')</span>';
					 }
					 
					 var strEl = '';
					 strEl += '<li>';
					 strEl += '	<a href="' + strPdpUrl + '" class="item pro" data-omni="' + dataOmni + '">';
					 strEl += '		<div class="pro-inner">';
					 strEl += '			<span class="thum"><img src="' + modelImageUrl + '" alt="' + modelImageDesc + '"></span>';
					 strEl += '			<span class="text">' + displayName + '</span>';
					 strEl += modelCodeEl;
					 strEl += '		</div>';
					 strEl += '	</a>';
					 strEl += '</li>';
					 
					 if(index < showMoreCnt) strRow1El += strEl;
					 else strRow2El += strEl;
				 });
				 
				 var strStepId = "product3Step";
				 $("#" + strStepId + " .pro-row1").html(strRow1El);
				 $("#" + strStepId + " .pro-row2").html(strRow2El);
				 if(list.length > showMoreCnt){
					 $("#" + strStepId + " .more-low").show();
				 }else{
					 $("#" + strStepId + " .more-low").hide();
				 }
				 $("#" + strStepId + " .lay-bich .bich-dep-list .txt").eq(0).text(iaNm1Depth);
				 $("#" + strStepId + " .lay-bich .bich-dep-list .txt").eq(1).text(iaNm2Depth);
				 $("#" + strStepId + " .category-name").text(iaNm3Depth);
				 
				 var strPcpUrl = fnLinkUrl( csRoot + "/category" ) + "/" + iaUrlNm1Depth + "/" + iaUrlNm2Depth + "/" + iaUrlNm3Depth;
				 $("#productPcp3depth a").attr('href', strPcpUrl);
				 $("#productPcp3depth a").attr('data-omni', iaEngNm3Depth);
				 
				 SUPPORT.Component.mobileOneProList();//li 한개일때 중앙정렬
				 
				 fnProductGetSolution(iaLvlNo3Depth, iaCode3Depth, "", strStepId);
				 
				 if(isShow) fnProductSetStep(3);
			}
        }
	});		
}

function fnProductGetSolution(requestIaLvlNo, requestIaCode, requestSympClassEngNm, strStepId){
	
	var strEl = fnGetSolution(requestIaLvlNo, requestIaCode, "", requestSympClassEngNm);
	
	if(strEl !== ""){
		$("#" + strStepId + " .grid-list.type2").html(strEl);
		$("#" + strStepId + " .solution-area").show();
	}else{
		$("#" + strStepId + " .solution-area").hide();
	}
}

