$(document).ready(function() {
	$("#3StepbtnMore").click(function(e) {
		e.preventDefault();
		fn3StepShowMore();
	});
	$("#3StepbtnLess").click(function(e) {
		e.preventDefault();
		fn3StepLessMore();
	});
	$("#moresolutionsbtn").click(function(e) {
		e.preventDefault();
		$("#5SteplistTwo").show();
		$("#5Stepmoresolution").hide();
	});
	


	
});
function fnProductSetStep(step){
	switch(step){
	case 1 :
		$("#1Step").show();
		$("#2Step").hide();
		$("#3Step").hide();
		$("#4Step").hide();
		$("#5Step").hide();
		$('.total-step').removeClass('total-step-show');
		$('#1Step').addClass('total-step-show');
		break;
	case 2 :
		$("#1Step").hide();
		$("#2Step").show();
		$("#2Step .lay-bich .bich-dep-list .dep-last").hide();
		$('.total-step').removeClass('total-step-show');
		$('#2Step').addClass('total-step-show');
		$("#3Step").hide();
		$("#4Step").hide();
		$("#5Step").hide();
		break;
	case 3:
		$("#1Step").hide();
		$("#2Step").show();
		$("#2Step .lay-bich .bich-dep-list .dep-last").show();
		$("#3Step").show();
		SUPPORT.Component.fixedBar();
		$('.total-step').removeClass('total-step-show');
		$('#3Step').addClass('total-step-show');
		$("#4Step").hide();
		$("#5Step").hide();
		break;
	case 4:
		$("#1Step").hide();
		$("#2Step").hide();
		$("#3Step").hide();
		$("#4Step").show();
		$('.total-step').removeClass('total-step-show');
		$('#4Step').addClass('total-step-show');
		$("#5Step").hide();
		break;
	case 5:
		$("#1Step").hide();
		$("#2Step").hide();
		$("#3Step").hide();
		$("#5Step").show();
		$('.total-step').removeClass('total-step-show');
		$('#5Step').addClass('total-step-show');
		break;
	default:
		break;
	}
}

function fnProductClearStep2(){
	$("#2Step .pro-list").html("");
	$("#2Step .lay-bich .bich-dep-list .txt").text("");
	$("#2Step .category-name").text("-");
	$("#moreItem2").hide();
	$("#btnModelMore2").show();
	$("#btnModelLess2").hide();
}

function fnProductClearStep3(){
	$("#3Step .pro-list").html("");
	$("#3Step .lay-bich .bich-dep-list .txt").text("");
	$("#3Step .category-name").text("-");
	$("#3Step .lt-count").html("");
	$("[data-dynamic='result-model']").text("");
	$("#moreItem3").hide();
}

function fnProductPrevStep1(){
	fnProductClearStep2();
	fnProductClearStep3();
	fnProductSetStep(1);
	$(".step-loca-w li").eq(0).addClass("active");
	$(".step-loca-w li").eq(1).removeClass("active");
	SUPPORT.Component.totalStepShow();
	fnSetFirstFocus("#1Step .lay-bich");
}

function fnProductPrevStep2(){
	fnProductClearStep3();
	fnProductSetStep(2);
	$(".step-loca-w li").eq(0).addClass("active");
	$(".step-loca-w li").eq(1).removeClass("active");
	SUPPORT.Component.totalStepShow();
	fnSetFirstFocus("#2Step .lay-bich");
}


function fnProductPrevStep4(){
	$(".step-loca-w li").eq(0).addClass("active");
	$(".step-loca-w li").eq(1).removeClass("active");
	SUPPORT.Component.totalStep4Show();
	SUPPORT.Common.setScroll({ target: $(".step-loca-z") });

}


function fnProductAll(){
	
	var strStepId = "1Step";
	var dataCnt = $("#" + strStepId + " .allpro-list li a").length;
	if(dataCnt > 0){
		return;
	}
	
	var requestSiteCode = csSiteCode;
	var requestOutType = "A";
	
	var strUrl = "/aemapi/support/common/commoncategory";
	
	$.ajax({
		type: "POST",
		data: {
			"requestSiteCode" : requestSiteCode
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
							 strEl += '			<a href="#" class="twod" onclick="fnProductNextStep2(this); return false;" data-omni="' + subIaList.iaEngNm + '">' + subIaList.iaNm + '</a>';
							 strEl += '			<input type="hidden" name="iaLvlNo" value="' + subIaList.iaLvlNo + '" />';
							 strEl += '			<input type="hidden" name="iaCode" value="' + subIaList.iaCode + '" />';
							 strEl += '			<input type="hidden" name="iaNm" value="' + subIaList.iaNm + '" />';
							 strEl += '			<input type="hidden" name="iaEngNm" value="' + subIaList.iaEngNm + '" />';
							 strEl += '         <input type="hidden" name ="piaCode" value="'+subIaList.pIaCode+'" />';
							 strEl += '         <input type="hidden" name ="piaEngNm" value="'+subIaList.pIaEngNm+'" />';
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

	var requestIaCode = $(objThis).parent().find("input[name=iaCode]").val();
	var iaName = $(objThis).parent().find("input[name=iaNm]").val();
	var iaEngName= $(objThis).parent().find("input[name=iaEngNm]").val();
	var piaCode = $(objThis).parent().find("input[name=piaCode]").val();
	var piaEngNm = $(objThis).parent().find("input[name=piaEngNm]").val();
	
    $("input[name=typeCode]").val(requestIaCode);
	$("input[name=typeName]").val(iaName);
	$("input[name=typeEngName]").val(iaEngName);
	$("input[name=groupCode]").val(piaCode);
	$("input[name=groupEngName]").val(piaEngNm);
	
	var requestSiteCode = csSiteCode;
	var requestOutType = "D";
	
	var strUrl = "/aemapi/support/common/commoncategory";
	
	$.ajax({
		type: "POST",
		data: {
			"requestSiteCode" : requestSiteCode
			,"requestOutType" : requestOutType
			,"requestIaCode" : requestIaCode
			},
		url: strUrl,
		success: function (data) {
			if(data && data.iaList.length > 0) {
				 var list = data.iaList;
				 
				 var strRow1El = '';
				 var strRow2El = '';
				 var showMoreCnt = 6;
				 $.each(list, function (index, iaList) {
					 var pcImageUrl = fnDataCheck(iaList.pcImageUrl, strNoImagePc);
					 var mobileImageUrl = fnDataCheck(iaList.mobileImageUrl, pcImageUrl);
					 var iaPcImgDesc = fnDataCheck(iaList.iaPcImgDesc, strNoImageDesc);
					 
					 var strEl = '';
					 strEl += '<li>';
					 strEl += '	<a href="#" class="item pro" onclick="fnProductNextStep3(\'' + iaList.iaLvlNo + '\', \'' + iaList.iaCode + '\', this , true ); return false;" data-omni="'+ iaList.iaEngNm +'">';
					 strEl += '		<div class="pro-inner">';
					 strEl += '			<span class="thum"><img src="' + pcImageUrl + '" data-mobileSrc="' + mobileImageUrl + '" alt="' + iaPcImgDesc + '"></span>';
					 strEl += '			<span class="text">' + iaList.iaNm + '</span>';
					 strEl += '		</div>';
					 strEl += '	</a>';
					 strEl += '	<input type="hidden" name="iaNm3Depth" value="' + iaList.iaNm + '" />';
					 strEl += '	<input type="hidden" name="iaEngNm3Depth" value="' + iaList.iaEngNm + '" />';
					 strEl += '	<input type="hidden" name="iaUrlNm3Depth" value="' + iaList.iaUrlNm + '" />';
					 strEl += '</li>';
					 strEl += '';
					 
					 if(index < showMoreCnt){
						 strRow1El += strEl;
					 }else{
						 strRow2El += strEl;
					 }
				 });
				 
				 fnProductSetStep(2);
				 SUPPORT.Component.totalStepShow();
				 
				 var iaNm1Depth = fnDataCheck(data.pIaNm);
				 var iaUrlNm1Depth = fnDataCheck(data.pIaUrlNm);
				 $("input[name=iaNm1DepthTemp]").val(iaNm1Depth);
				 $("input[name=iaUrlNm1DepthTemp]").val(iaUrlNm1Depth);
				 
				 var strStepId = "2Step";
				 
				 $("#" + strStepId + " .pro-row1").html(strRow1El);
				 $("#" + strStepId + " .pro-row2").html(strRow2El);
				 fnSetFirstFocus("#" + strStepId + " .lay-bich");
				 
				 if(list.length > showMoreCnt){
					 $("#" + strStepId + " .more-low").show();
				 }else{
					 $("#" + strStepId + " .more-low").hide();
				 }
				 
				 $("#" + strStepId + " .lay-bich .bich-dep-list .txt").eq(0).text(iaNm1Depth);
				 $("#" + strStepId + " .category-name").text(iaName);

				 SUPPORT.Component.mobileOneProList();//li 한개일때 중앙정렬

				 SUPPORT.Common.setScroll({ target: $("#2Step") });
			}else{
				fnAlertDialog(objThis, "No Data!");
			}
        }
	});		
}


function fnProductGetSolution(requestIaLvlNo, requestIaCode, requestSympClassNm, requestModelCode, strStepId){
	
	var strEl = fnGetSolution(requestIaLvlNo, requestIaCode, requestSympClassNm, "", requestModelCode, "8");

	$("#" + strStepId + " .mf-z").show();
	
	if(strEl !== ""){
		var splitdata = strEl.split("</li>");
		if((splitdata.length-1) < 5){
			$("#btnMore").hide();
			$("#btnLess").hide();
		}else{
			$("#btnMore").show();
			$("#btnLess").hide();
		}
		$(".email-call").show();
		$("#" + strStepId + " .grid-list.type2.guide.has-moresol").html(strEl);
		$("#5Step-no-result").hide();
		SUPPORT.Component.hasMoreItem();
	}else{

		$(".email-call").hide();
		$("#5Step-no-result").show();
	}
}

function fnSortType(sortname){
	$("input[name=sortType]").val(sortname);
	$("#3Step-result-page").val("1");
	fnProductNextStep3($("input[name=iaLvlNo2Dept]").val(), $("input[name=subtypeCode]").val(),this, true);
	    
}

function fn3StepShowMore(){
	var resultPageCout =  Number($("#3Step-result-page").val()) + 1;
	$("#3Step-result-page").val(resultPageCout);
	fnProductNextStep3($("input[name=iaLvlNo2Dept]").val(), $("input[name=subtypeCode]").val(),this,false);
}

function fn3StepLessMore(){
	$("#3Step-result-page").val(1);
	fnProductNextStep3($("input[name=iaLvlNo2Dept]").val(), $("input[name=subtypeCode]").val(),this,true);
	fnSetFirstFocus(".lr-list");
}

function fnModelSearch(e){
	if (e.keyCode === 13) {
		$("fieldset.search-field").removeClass("active");
		fnProductNextStep3($("input[name=iaLvlNo2Dept]").val(), $("input[name=subtypeCode]").val(),this, true);
	}
}

function fnProductNextStep3(requestIaLvlNo, requestIaCode, objThis, isfirst){
	$("#3Step .rst-more-low.alignc").show();
	$(".listing-result").show();
	$("input[name=subtypeCode]").val(requestIaCode);
	$("input[name=iaLvlNo2Dept]").val(requestIaLvlNo);

	var subtypeName = $(objThis).parent().find("input[name=iaNm3Depth]").val();
	var subtypeEngName = $(objThis).parent().find("input[name=iaEngNm3Depth]").val();
	var iaNm3DepthTemp  = $("input[name=subtypeName]").val();
	var iaEngNm3DepthTemp  = $("input[name=subtypeEngName]").val();
	if(isfirst === true && subtypeName !== undefined){
		$("#3Step-result-page").val("1");
		$("input[name=subtypeName]").val(subtypeName);
		$("input[name=subtypeEngName]").val(subtypeEngName);
		iaNm3DepthTemp = $("input[name=subtypeName]").val();
		iaEngNm3DepthTemp = $("input[name=subtypeEngName]").val();
		$("#searchModel").val(""); //검색어 초기화
		$("fieldset.search-field").removeClass("active");
	}
	
	$("input[name=subtypeName]").val(iaNm3DepthTemp);
	$("input[name=subtypeEngName]").val(iaEngNm3DepthTemp);
	
	var requestSiteCode = csSiteCode;
	var requestSortType = $("input[name=sortType]").val();
	var strUrl = "/aemapi/support/common/commonproduct";
	var requestPage = $("#3Step-result-page").val();
	var requestSearchKeyWord = $("#searchModel").val();
	if($.trim(requestSearchKeyWord) === ''){
		requestSearchKeyWord = "";
		$("#searchModel").val("");
	}
	
	$.ajax({
		type: "POST",
		data: {
			"requestSiteCode" : requestSiteCode,
			"requestIaCode" : requestIaCode,
			"requestSearchKeyWord" : encodeURIComponent(requestSearchKeyWord),
			"requestSortType" : requestSortType,
			"requestPage" : requestPage
			},
		url: strUrl,
		success: function (data) {
			if(data.modelListModel !== null){
 				var strEl = "";
 				var totalcount =  data.modelListModel.totalCnt;
 				var list =  data.modelListModel.productList;
 				
 				fnProductSetStep(3);
 				SUPPORT.Component.totalStepShow();
 				
 				var el_result_cnt = '<span class="lt-count">'+fnNumberWithCommas(totalcount)+'</span>';
 				var el_category_name = '';
 				if(requestSearchKeyWord === ''){
 					el_category_name = '<span class="word-mark">' + iaNm3DepthTemp + '</span>';
 				}else{
 					el_category_name = '<span class="word-mark">' + iaNm3DepthTemp + ' (' + requestSearchKeyWord + ')' +'</span>';
 				}
 				
 				$("[data-dynamic='result-model']").html(Granite.I18n.get("{0} results for {1}", [el_result_cnt,el_category_name],csI18nHint));
 				$("#2Step .lay-bich .bich-dep-list .txt").eq(1).text($("input[name=typeName]").val());
 				$("#2Step .category-name").text(subtypeName);
 				
 				if(totalcount > 0){
 					 $.each(list, function (index, value) { 
 						 strEl += '<li>';
 						 strEl += '	<a href="#" class="lr-link" onclick="fnProductNextStep4(\'' + value.modelCode + '\',\'' + value.modelName + '\',\'' + value.modelImageUrl + '\', this);return false;"data-omni="'+value.modelCode+','+value.modelName+'">';
 						 strEl += '		<span class="dot">';
 						 strEl += '			<span class="lr-name">'+value.displayName+'</span>';
 						 strEl += '			<span class="lr-code">- '+value.modelCode+'</span>';
 						 strEl += '		</span>';
 						 strEl += '	</a>';
 						 strEl += '	<input type="hidden" name="modeliaCode" value="' + value.modelIaCd + '" />';
 						 strEl += '</li>';
 					 });
 					 
 					 var totalpageSize=  Math.ceil(totalcount / 12) ;
 					 var requestPagecount = Number(requestPage); 
 					 var liElement = $( ".lr-list li:last-child");
 					 if(requestPagecount < totalpageSize){
 						 if(isfirst === true){
 							 $(".lr-list").html("");
 							 $(".lr-list").html(strEl);
 							 SUPPORT.Common.setScroll({ target: $("#3Step") });
 							 fnSetFirstFocus(".lr-list");
 						 }
 						 if (isfirst === false){
 							 $(".lr-list").append(strEl);
 							 liElement.next().find('a').focus();
 						 }
 						 $("#3StepbtnMore").show();
 						 $("#3StepbtnLess").hide();
 					 }else if(totalpageSize === 1){
 						 $(".lr-list").html(strEl);
 						 $("#3StepbtnMore").hide();
 						 $("#3StepbtnLess").hide();
 						 SUPPORT.Common.setScroll({ target: $("#3Step") });
 						 fnSetFirstFocus(".lr-list");
 					 }else {
 						 $(".lr-list").append(strEl);
 						 liElement.next().find('a').focus();
 						 $("#3StepbtnMore").hide();
 						 $("#3StepbtnLess").show();
 					 }
 					 SUPPORT.Common.dispatcher(SUPPORT.EVENT.UPDATE_FIXEDBAR);
 					 SUPPORT.Component.resultListing();
 					
 					$("#3Step-no-result").hide();
  					$("#3Step ul.lr-list").show();
 					$("#3Step div.rst-more-low").show();
 				}else{
 					$("#3Step ul.lr-list").hide();
 					$("#3Step div.rst-more-low").hide();
 					$("#3Step-no-result").show();
 				}
			}else{
				SUPPORT.Common.setScroll({ target: $("#2Step") });
				$("#3Step").hide();
			}
        }
	});	
}

function fnProductNextStep4(modelCode ,modelName, modelImageUrl, objThis){
	var ImageUrl; 
	var displayName =  $(objThis).parent().find(".lr-name").html();
	var modeliaCode =  $(objThis).parent().find("input[name=modeliaCode]").val();
	$("input[name=modelCode]").val(modelCode);
	$("input[name=modelName]").val(modelName);
	$("input[name=modelDisplayName]").val(displayName);
	
	if(modelImageUrl !== "null" && modelImageUrl !=="" && modelImageUrl !== "undefined" ){
		ImageUrl = modelImageUrl;
	}else {
		ImageUrl =  "/etc/designs/smg/global/imgs/support/cont/NO_IMG_600x600.png";
	}
	
	$("input[name=modelImageUrl]").val(ImageUrl);

	var requestSiteCode = csSiteCode ;
	var strUrl = "/aemapi/support/common/commontopic";
	
	$.ajax({
		type: "POST",
		data: {
			"requestSiteCode" : requestSiteCode,
			"requestIaCode" : modeliaCode,
			"requestModelCode" : modelCode
			},
		url: strUrl,
		success: function (data) {
			 if( data.topicListModel != null){
				 var strEl = "";
				 var list =  data.topicListModel.topicList;
				 $.each(list, function (index, value) {
					 
					 strEl += '<li>';
					 strEl += '	<a href="#" class="tlink" onclick="fnProductNextStep5(\'' + value.sympClassNm + '\');return false;" data-omni="' + value.sympClassEngNm + '">';
					 strEl += '		<div class="tt-low">';
					 strEl += '			<span class="txt-w"><span class="txt">'+value.sympClassNm+'</span></span>';
					 strEl += '		</div>';
					 strEl += '	</a>';
					 strEl += '</li>';
					 
				 });
                 
				 $("#editTopic").show();
				 fnProductSetStep(4);
				 SUPPORT.Component.totalStepShow();
				 var strStepId = "4Step";
				 				 
				 $("#" + strStepId + " .lay-bich .bich-dep-list .txt").eq(0).text($("input[name=subtypeName]").val());
				 $("#" + strStepId + " .lay-bich .bich-dep-list .txt").eq(1).text($("input[name=modelDisplayName]").val());
				 
				 $(".thum-list").html(strEl);
				 SUPPORT.Common.setScroll({ target: $(".step-loca-z") }); 
				 fnSetFirstFocus("#" + strStepId + " .lay-bich");
			} else {
                fnProductNextStep5('');
            }
        }
	});	
}


function fnProductNextStep5(topicName){
	var strEl;
	$("input[name=topic]").val(topicName);
    if (topicName === '') {
        $("#editTopic").hide();
    }
	
	$(".step-loca-w li").eq(0).removeClass("active");
	$(".step-loca-w li").eq(1).addClass("active");
	 
	var strStepId = "5Step";
	 
	$("#" + strStepId + " .lay-bich .bich-dep-list .txt").eq(0).text($("input[name=subtypeName]").val());
	$("#" + strStepId + " .lay-bich .bich-dep-list .txt").eq(1).text($("input[name=modelDisplayName]").val());
	
	strEl += '<li>';
	strEl += '	<div href="#" class="item pro">';
	strEl += '		<div class="pro-inner">';
	strEl += '			<span class="thum"><img src="'+$("input[name=modelImageUrl]").val()+'" alt="PRODUCT NAME"></span>';
	strEl += '			<span class="text">'+ $("input[name=modelDisplayName]").val()+' </span>';
	strEl += '			<span class="model">'+ $("input[name=modelCode]").val()+'</span>';
	strEl += '		</div>';
	strEl += '	</div>';
	strEl += '</li>';
	 

	$("#5Step-pro-list").html(strEl);
	$("#select-model-label").html(topicName);
	
	SUPPORT.Component.mobileOneProList();//li 한개일때 중앙정렬
	
	fnProductGetSolution($("#iaLvlNo2Dept").val(), $("input[name=subtypeCode]").val(), topicName, $("input[name=modelCode]").val(), strStepId);
	fnProductSetStep(5);
	SUPPORT.Component.totalStepShow();
	SUPPORT.Common.setScroll({ target: $(".step-loca-z") });
	fnSetFirstFocus(".stit-label");
	
}
function fnSendEmail(){
	$("#ermsDataForm").submit();	
}
