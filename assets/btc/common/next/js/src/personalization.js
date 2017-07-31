$.personalization = {
	/** 쿠키에서 가져온 모델 코드 */	
	modelCode : '',
	
	/** 쿠키에서 가져온 IA TYPE 코드 */
	typeCode : '', 
	
	/** pdp 화면 조회시 현재 상품이 private 코드로 설정되는 경우 사용될 상품코드 */
	alterModelCode : '',

	/** pdp 화면 조회시 현재 상품이 private 코드로 설정되는 경우 사용될 IA코드 */
	alterTypeCode : '', 
	
	/** eStore 에서 가져온 모델 코드 */
	wishModelCode : '', 
	
	/** 임시 변수 */
	temp : null,
	
	requestPage : null,
	requestUrl : null,
	requestData : null,
	
	titleMessage : 'Recommended for you', //default
	
	
	/**
	 * 저장된 쿠키값으로 부터 modelCode와 typeCode를 저장함, iaCode 없으면 null
	 * @param iaCode
	 */
	getCookieInfo : function(iaCode){
		this.modelCode = '';
		this.typeCode = '';
		
		var privateCodeArray = $.cookies.getPrivateCodeList();
		
		if(privateCodeArray.length == 0) {return;}
		
		var max = 0;
		var codeCnt = new CookieMap();

		for(var i=0; i<privateCodeArray.length; i++){
			$codeData = privateCodeArray.pop();
			
			if(iaCode == null || (iaCode != null && $codeData == iaCode)){
				if(codeCnt.get($codeData.modelCode) != undefined){
					var num = codeCnt.get($codeData.modelCode) + 1;
					codeCnt.put($codeData.modelCode, num);
					if(num > max){
						max = num;
						this.modelCode = $codeData.modelCode;
						this.typeCode = $codeData.typeCode;
					}
				} else {
					codeCnt.put($codeData.modelCode, 1);
					if(max < 1) {
						max = 1;
						this.modelCode = $codeData.modelCode;
						this.typeCode = $codeData.typeCode;
					}
				}
			}
		}
	},
	
	/**
	 * eStore 에서 가져온 모델 코드를 wishModelCode 에 저장함
	 */
	getWishListModel : function(fnRequestWishList){  
		this.wishModelCode = '';
		this.temp = fnRequestWishList;
		
		//var param = {"page":1, "pageSize":5};
		var param = {"page":1, "pageSize":1};
		estore.getWishList(param, this.getWishListCallback);
	},
	
	/**
	 * 비로그인 사용자일 경우 모델 코드 조회시 사용, 코드 조회 후 코드 목록 조회를 위한 콜백 함수 필요함
	 * @param fnRequestModelList
	 */
	getModelCodeLogoutUser : function(fnRequestModelList){
		this.modelCode = '';
		this.typeCode = '';
		this.alterModelCode = '';
		this.alterTypeCode = '';
		
		var privateCodeArray = $.cookies.getPrivateCodeList();
		
		if(privateCodeArray.length == 0) {
			
			if($.isFunction(fnRequestModelList)){
				fnRequestModelList(null);
        	}
			return;
		}
		
		var max = 0;
		var codeCnt = new CookieMap();

		for(var i=0; i<privateCodeArray.length; i++){
			var $codeData = privateCodeArray.pop();
			
			var tempModel = this.modelCode;
			var tempType = this.typeCode;
			
			if(codeCnt.get($codeData.modelCode) != undefined){

				var num = codeCnt.get($codeData.modelCode) + 1;
				codeCnt.put($codeData.modelCode, num);
				if(num > max){
					max = num;
					this.modelCode = $codeData.modelCode;
					this.typeCode = $codeData.typeCode;
				}
				
				
			} else {
				codeCnt.put($codeData.modelCode, 1);
				if(max < 1) {
					max = 1;
					this.modelCode = $codeData.modelCode;
					this.typeCode = $codeData.typeCode;
				}
			}
			
			if(this.modelCode != tempModel){
				this.alterModelCode = tempModel;
				this.alterTypeCode = tempType;
			} else {
				if(this.modelCode != $codeData.modelCode){
					this.alterModelCode = $codeData.modelCode;
					this.alterTypeCode = $codeData.typeCode;
				}
			} 
			
		}
		
		if($.isFunction(fnRequestModelList)){
			fnRequestModelList(this.modelCode);
    	}
		
	},
	
	/**
	 * 로그인 사용자일 경우 모델 코드 조회시 사용, 코드 조회 후 코드 목록 조회를 위한 콜백 함수 필요함
	 * @param fnRequestModelList
	 */
	getModelCodeLoginUser : function(fnRequestModelList){
		
		this.wishModelCode = '';
		this.alterModelCode = '';
		this.alterTypeCode = '';
	
		this.temp = fnRequestModelList;
		
		var param = {"page":1, "pageSize":2};
		estore.getWishList(param, this.getModelCodeLoginUserCallback);
		
	},
	
	/**
	 * getWishListModel 함수의 callback
	 * @param data
	 */
	getWishListCallback : function(data){
		var wishList = data.wishListEntryAllData;
		
		if(wishList.length == 0) {return;}
		
		//wish list중 가장 마지막에 추가한 모델을 가져옴.
		//var wishModel = wishList.pop();
		var wishModel = wishList[0];
		$.personalization.wishModelCode = wishModel.productCode;
		
		if($.isFunction($.personalization.temp)){
			$.personalization.temp($.personalization.wishModelCode);
		}
		
	},
	
	/**
	 * getModelCodeLoginUser 함수의 callback
	 * @param data
	 */
	getModelCodeLoginUserCallback : function(data){
		var wishList = data.wishListEntryAllData;
		
		if(wishList.length == 0) {
			$.personalization.wishModelCode = '';
			$.personalization.getModelCodeLogoutUser($.personalization.temp);
			return;
		}
		
		//wish list중 가장 마지막에 추가한 모델을 가져옴.
		//var wishModel = wishList.pop();
		var wishModel = wishList[0];
		
		if(wishList.length > 1){
			var secondModel = wishList[1];
			$.personalization.alterModelCode = secondModel.productCode;
		}

		$.personalization.wishModelCode = wishModel.productCode;

		if($.isFunction($.personalization.temp)){
			$.personalization.temp($.personalization.wishModelCode);
		}
	},
	
	/**
	 * createRecommendedModelBox 추천제품 모델 박스 생성
	 * @param pageType
	 */
	createRecommendedModelBox : function(pageType){
		
		//로컬 QA에 따라 임시 조치, GRO2때의 변경 요구가 있는지 확인 후 페이지별 프로퍼티 적용
		if(pageType == 'category' && (SITE_CD == 'ch' || SITE_CD == 'ch_fr')){
			$('#recommennd-items').empty();
			return;
		}
		
		this.requestPage = pageType;
		
		$.Auth.checkSignIn(function(isLogedIn){
			if(isLogedIn && USE_ESTORE){

				$.personalization.getModelCodeLoginUser(function (modelCode){
					$.personalization.requestUrl = '/' + SITE_CD + '/personal/recommendModel';

					if(modelCode != null){
						switch($.personalization.requestPage){
						case 'home':
							$.personalization.requestUrl = '/' + SITE_CD + '/personal/recommendHomeModel';
							$.personalization.requestData = {"mdlCd":modelCode};
							break;
							
						case 'category':
							$.personalization.requestUrl = '/' + SITE_CD + '/personal/recommendCategoryModel';
							$.personalization.requestData = {"mdlCd":modelCode, "iaCd":typeIaCode};
							break;
							
						case 'pdp':
							var pdpPageModelCode = $('#modelCode').val();
							
							if(pdpPageModelCode != modelCode){
								$.personalization.requestUrl = '/' + SITE_CD + '/personal/recommendPdpModel';
								$.personalization.requestData = {"mdlCd":modelCode, "iaCd":$('#typeCode').val(), "exceptMdlCd":pdpPageModelCode};
							}else if((pdpPageModelCode == modelCode) && ($.personalization.alterModelCode != '')){
								$.personalization.requestUrl = '/' + SITE_CD + '/personal/recommendPdpModel';
								$.personalization.requestData = {"mdlCd":$.personalization.alterModelCode, "iaCd":$('#typeCode').val(), "exceptMdlCd":pdpPageModelCode};
							}else{
								$.personalization.requestData = {"iaCd":$('#typeCode').val(), "exceptMdlCd":pdpPageModelCode};
							}
							break;
						case 'vdPDP':
							var pdpPageModelCode = $('#modelCode').val();
							
							if(pdpPageModelCode != modelCode){
								$.personalization.requestUrl = '/' + SITE_CD + '/personal/recommendPdpModel';
								$.personalization.requestData = {"mdlCd":modelCode, "iaCd":$('#typeCode').val(), "exceptMdlCd":pdpPageModelCode};
							}else if((pdpPageModelCode == modelCode) && ($.personalization.alterModelCode != '')){
								$.personalization.requestUrl = '/' + SITE_CD + '/personal/recommendPdpModel';
								$.personalization.requestData = {"mdlCd":$.personalization.alterModelCode, "iaCd":$('#typeCode').val(), "exceptMdlCd":pdpPageModelCode};
							}else{
								$.personalization.requestData = {"iaCd":$('#typeCode').val(), "exceptMdlCd":pdpPageModelCode};
							}
							break;
						default:
							$.personalization.requestData = '';
						}

					}else{

						switch($.personalization.requestPage){
						case 'home':
							$.personalization.requestData = '';
							break;
							
						case 'category':
							$.personalization.requestData = {"iaCd":typeIaCode};
							break;
							
						case 'pdp':
							var pdpPageModelCode = $('#modelCode').val();
							
							$.personalization.requestData = {"iaCd":$('#typeCode').val(), "exceptMdlCd":pdpPageModelCode};
							break;
						case 'vdPDP':	
							var pdpPageModelCode = $('#modelCode').val();
							
							$.personalization.requestData = {"iaCd":$('#typeCode').val(), "exceptMdlCd":pdpPageModelCode};
							break;	
						default:
							$.personalization.requestData = '';
						}
					}

					$.personalization.getRecommendedModel($.personalization.requestUrl, $.personalization.requestData);

				});

			}else{
				$.personalization.getModelCodeLogoutUser(function(modelCode){
					
					$.personalization.requestUrl = '/' + SITE_CD + '/personal/recommendModel';
 
					if(modelCode != null){
						switch($.personalization.requestPage){
						case 'home':
							$.personalization.requestUrl = '/' + SITE_CD + '/personal/recommendHomeModel';
							$.personalization.requestData = {"mdlCd":modelCode};
							break;
						case 'category':
							$.personalization.requestUrl = '/' + SITE_CD + '/personal/recommendCategoryModel';
							$.personalization.requestData = {"mdlCd":modelCode, "iaCd":typeIaCode};
							break;
						case 'pdp':
							var pdpPageModelCode = $('#modelCode').val();
							
							if(pdpPageModelCode != modelCode){
								$.personalization.requestUrl = '/' + SITE_CD + '/personal/recommendPdpModel';
								$.personalization.requestData = {"mdlCd":modelCode, "iaCd":$('#typeCode').val(), "exceptMdlCd":pdpPageModelCode};
							}else if((pdpPageModelCode == modelCode) && ($.personalization.alterModelCode != '')){
								$.personalization.requestUrl = '/' + SITE_CD + '/personal/recommendPdpModel';
								$.personalization.requestData = {"mdlCd":$.personalization.alterModelCode, "iaCd":$('#typeCode').val(), "exceptMdlCd":pdpPageModelCode};
							}else{
								$.personalization.requestData = {"iaCd":$('#typeCode').val(), "exceptMdlCd":pdpPageModelCode};
							}
							break;
						case 'vdPDP':
							var pdpPageModelCode = $('#modelCode').val();
							
							if(pdpPageModelCode != modelCode){
								$.personalization.requestUrl = '/' + SITE_CD + '/personal/recommendPdpModel';
								$.personalization.requestData = {"mdlCd":modelCode, "iaCd":$('#typeCode').val(), "exceptMdlCd":pdpPageModelCode};
							}else if((pdpPageModelCode == modelCode) && ($.personalization.alterModelCode != '')){
								$.personalization.requestUrl = '/' + SITE_CD + '/personal/recommendPdpModel';
								$.personalization.requestData = {"mdlCd":$.personalization.alterModelCode, "iaCd":$('#typeCode').val(), "exceptMdlCd":pdpPageModelCode};
							}else{
								$.personalization.requestData = {"iaCd":$('#typeCode').val(), "exceptMdlCd":pdpPageModelCode};
							}
							break;		
						default:
							$.personalization.requestData = '';
						}

					}else{
						switch($.personalization.requestPage){
						case 'home':
							$.personalization.requestData = '';
							break;
						case 'category':
							$.personalization.requestData = {"iaCd":typeIaCode};
							break;
						case 'pdp':
							var pdpPageModelCode = $('#modelCode').val();
							
							$.personalization.requestData = {"iaCd":$('#typeCode').val(), "exceptMdlCd":pdpPageModelCode};
							break;
						case 'vdPDP':
							var pdpPageModelCode = $('#modelCode').val();
							
							$.personalization.requestData = {"iaCd":$('#typeCode').val(), "exceptMdlCd":pdpPageModelCode};
							break;	
						default:
							$.personalization.requestData = '';
						}
					}

					$.personalization.getRecommendedModel($.personalization.requestUrl, $.personalization.requestData, pageType);

				});
			}
		}, false, false);


	},

	getRecommendedModel : function (requestUrl, requestData, pageType){
		
		$.ajax({
			type		: 'POST', 
			url			: requestUrl,
			data		: requestData,
			dataType	: 'json',
			success		: function(data) {
				
				var modelList = data.personalRecommendModelList;
				
				$('#recommennd-items').empty();
				
				if(modelList == undefined) { return false; }

				if(modelList.length != undefined && modelList.length != null && modelList.length < 4) { return; }
				
				if(pageType == 'category'){
					
					var inner = $('<div class=\'inner-x\' ></div>');
					var moduleHead = $('<div class=\'module-heading\'></div>');
					
					moduleHead.append('<span class=\'icon-RecommendedForYou heading-icon\'></span>');
					moduleHead.append('<span class=\'heading-text\'>'+$.personalization.titleMessage+'</span>');
					inner.append(moduleHead);
					
					var itemContainer = $('<div class=\'style similar-items-container dynamic-add-more recommand\'></div>');
					var recInner = $('<div id=\'rec-similar\'></div>');
					
					var itemListUl = $('<ul class=\'pdpItemsList\'></ul>');
					var itemListLi = $('<li></li>');
					
					for(var modelIdx = 0; modelIdx < modelList.length ; modelIdx++){
						
						var imgUrl = modelList[modelIdx].mediumMediaFileUrl; //+'?wid=550&hei=600&fmt=png-alpha';
						var urlEnd = imgUrl.indexOf("?");
						var imgUrlString = '';
						
						if(urlEnd > -1){
							imgUrlString = imgUrl.substring(0,urlEnd) + '?$CL-ProductCard$'; 
						}else {
							imgUrlString = imgUrl +'?$CL-ProductCard$';
						}
						
						var item = $('<div class=\'similar-item\'></div>');
						
						var htmlAtag = '<a href=\''+modelList[modelIdx].mdlUrl+'\' class=\'similar-item-link\' onclick=\'sendClickCode("finding_method","recommended for you|'+modelList[modelIdx].mdlNm+'");\'></a>';
						item.html(htmlAtag);
						
						var itemA = item.find('.similar-item-link'); 
						var itemInner = $('<div class=\'similar-item-content\'></div>');
						var itemAlsoview = $('<div class=\'alsoview-hero\'></div>');
						var itemImg = $('<div class=\'image responsive-image\' data-media-desktop=\''+imgUrlString+'\' data-media-tablet-portrait=\''+imgUrlString+'\' role=\'img\' aria-label=\''+modelList[modelIdx].mdlNm+' '+modelList[modelIdx].dispNm.replace( /[\'\"]/g, '' )+'\' style=\'background-image: url('+imgUrlString+');\'  ></div>');

						//특수 문자 escape관련하여 추가함 -dong_won.lee^^;
						itemImg = itemImg.css('background-image', 'url(\''+imgUrlString+'\')');
						itemAlsoview.append(itemImg);
						
						itemInner.append(itemAlsoview);
						itemInner.append('<div class="name">'+modelList[modelIdx].dispNm+'<br/></div>');
						itemA.append(itemInner);
						item.append(itemA);
						
						itemListLi.append(item);
						
					}

					itemListUl.append(itemListLi);
					recInner.append(itemListUl);
					itemContainer.append(recInner);
					
					$('#recommennd-items').append(inner);
					$('#recommennd-items').append(itemContainer);
					
					
				}else if(pageType == 'vdPDP'){
					var result="";
					for(var modelIdx = 0; modelIdx < modelList.length ; modelIdx++){
						var itemListLi = $('<div class="product_i"></div>');
						var imgUrl = modelList[modelIdx].mediumMediaFileUrl;
						var urlEnd = imgUrl.indexOf("?");
						var imgUrlString = '';
						var mdiDesc=modelList[modelIdx].mediumMdiDesc;
						if(urlEnd > -1){
							imgUrlString = imgUrl.substring(0,urlEnd) + '?$M-Thumbnail$'; 
						}else {
							imgUrlString = modelList[modelIdx].mdlImgSrcUrl;
							mdiDesc=modelList[modelIdx].mdiDesc;
						}
						

						var item = $('<div class="product_i"></div>');
						
						var htmlAtag = '<a href=\''+modelList[modelIdx].mdlUrl+'\' class=\'item-link\' onclick=\'sendClickCode("finding_method","recommended for you|'+modelList[modelIdx].mdlNm+'");\'></a>';
						item.html(htmlAtag);
						
						var itemA = item.find('.item-link');  
						
						var itemInner = $('<div class="product_inner"></div>');
						var itemImg = $('<span class="product-image"></span>');
						
						itemImg.append('<img src="'+imgUrlString+'" alt="'+modelList[modelIdx].mdlNm+' '+mdiDesc.replace( /[\'\"]/g, '' )+'" ></img>');
						itemInner.append(itemImg);
						itemInner.append('<p class="name">'+modelList[modelIdx].dispNm+'</p>');
						itemA.append(itemInner);
						item.append(itemA);
						
						itemListLi.append(item);
						result += itemListLi.html();
					}
					$('#tab3').append(result);
				}else{
					
					var inner = $('<div class="inner-x" ></div>');
					var moduleHead = $('<div class="module-heading"></div>');
					
					moduleHead.append('<span class="icon-RecommendedForYou heading-icon"></span>');
					moduleHead.append('<span class="heading-text">'+$.personalization.titleMessage+'</span>');
					inner.append(moduleHead);
					
					var itemContainer = $('<div class="style similar-items-container dynamic-add-more recommand"></div>');
					var recInner = $('<div id="rec-similar"></div>');
					
					var itemListUl = $('<ul class="pdpItemsList"></ul>');
					var itemListLi = $('<li class="pdpItemsList"></li>');
					
					for(var modelIdx = 0; modelIdx < modelList.length ; modelIdx++){
						
						var imgUrl = modelList[modelIdx].mediumMediaFileUrl;
						var urlEnd = imgUrl.indexOf("?");
						var imgUrlString = '';
						var mdiDesc=modelList[modelIdx].mediumMdiDesc;
						
						if(urlEnd > -1){
							imgUrlString = imgUrl.substring(0,urlEnd) + '?$M-Thumbnail$'; 
						}else {
							imgUrlString = modelList[modelIdx].mdlImgSrcUrl;
							mdiDesc=modelList[modelIdx].mdiDesc;
						}
						

						var item = $('<div class="similar-item rpt-node"></div>');
						
						var htmlAtag = '<a href=\''+modelList[modelIdx].mdlUrl+'\' class=\'similar-item-link\' onclick=\'sendClickCode("finding_method","recommended for you|'+modelList[modelIdx].mdlNm+'");\'></a>';
						item.html(htmlAtag);
						
						var itemA = item.find('.similar-item-link');  
						
						var itemInner = $('<div class="similar-item-content inner-x"></div>');
						var itemImg = $('<div class="product-image"></div>');
						
						itemImg.append('<img src="'+imgUrlString+'" alt="'+modelList[modelIdx].mdlNm+' '+mdiDesc+'" ></img>');
						itemInner.append(itemImg);
						itemInner.append('<div class="name">'+modelList[modelIdx].dispNm+'</div>');
						itemA.append(itemInner);
						item.append(itemA);
						
						itemListLi.append(item);
					}
					itemListUl.append(itemListLi);
					recInner.append(itemListUl);
					itemContainer.append(recInner);
					
					$('#recommennd-items').append(inner);
					$('#recommennd-items').append(itemContainer);
					
				}
				
			}
//			,error		: function() {
//				alert('error');
//			}
		});

	}
	
	
	
};

var CookieMap = function(){
	this.map = new Object();
	};
	
CookieMap.prototype = {
	put : function(key, value){ 
		this.map[key] = value;
	},
	get : function(key){   
        return this.map[key];
    }
};

/**************************************************
 * 보안성 조치내용 추가 - START
 **************************************************/

 window.onload=function(){
 	device_type = 'device_type=';
 	var cookieData1 = document.cookie;
 	var start1 = cookieData1.indexOf(device_type);
 	//var exceptCookie = cookieData.split('device_type');

 	var deviceType = '';
 	if(start1 != -1){
 		start1 += device_type.length;
		var end1 = cookieData1.indexOf(';', start1);
		if(end1 == -1)end1 = cookieData1.length;
		   deviceType = cookieData1.substring(start1, end1);
 	}
 	deviceType = deviceType.replace(/</gi,'&lt;');
 	deviceType = deviceType.replace(/>/gi,'&gt;');
 	deviceType = deviceType.replace(/&/gi,'&amp;');
 	deviceType = deviceType.replace(/'/gi,'');
 	deviceType = deviceType.replace(/"/gi,'&quot;');
 	deviceType = deviceType.replace(/javascript/gi,'');
 	deviceType = deviceType.replace(/vbscript/gi,'');

 	$.cookies.del('device_type');
 	$.cookies.set('device_type', deviceType);
};


/**************************************************
 * 보안성 조치내용 추가 - END
 **************************************************/