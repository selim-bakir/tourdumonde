$.offerRFY = {
	gubun : '',
	storeId : '',
	iaCode : '',
	callback : '',
	storeLocatorOfferList : '',
	
	getRFYOffer : function(storeId, iaCode, f, callback){
		$.offerRFY.storeId = storeId;
		$.offerRFY.iaCode = iaCode;
		$.offerRFY.gubun = f;
		$.offerRFY.callback = callback;
		$.offerRFY.init();
	},
	
	init : function() {
		$.Auth.checkSignIn($.offerRFY.loginCallback, false, false);
	},
	
	// 유저정보 가져오기
	userProfileCallback : function(userData) {
		if (userData) {
			//alert(" 유저정보 ::: "+userData.firstName + userData.lastName);
		} else {
			//alert("유저정보 없음");
		}
	},
	
	loginCallback : function(isLogedIn) {
		var privateCodeArray = [];
		
		if (isLogedIn) { //로그인시
			$.Auth.getUserProfile($.offerRFY.userProfileCallback);
			estore.getWishList("", $.offerRFY.wishListCallback);
		} else { //비로그인시
			privateCodeArray = $.cookies.getPrivateCodeList();
			if($.offerRFY.gubun != "s") {
				offerList(privateCodeArray, privateCodeArray.length, "1", $.offerRFY.storeId, $.offerRFY.iaCode, $.offerRFY.callback);
			} else {
				storeLocatorOfferList(privateCodeArray, privateCodeArray.length, "1", $.offerRFY.storeId, $.offerRFY.iaCode, "");
			}

		}
	},
	
	wishListCallback : function(jsonVo) {
		var list = [];
		var privateCodeArray = [];
		
		if(jsonVo.wishListEntryAllData != null) {
		    for (item in jsonVo.wishListEntryAllData) {
		    	list.push(jsonVo.wishListEntryAllData[item].productCode);
		    }
		} else {
			privateCodeArray = $.cookies.getPrivateCodeList();
			
    		for(var i=0; i<privateCodeArray.length; i++){
    			list.push(privateCodeArray[i]);
    		}
	    }
		if($.offerRFY.gubun != "s") {
			offerList(list, list.length, "2", $.offerRFY.storeId, $.offerRFY.iaCode, $.offerRFY.callback);
		} else {
			storeLocatorOfferList(list, list.length, "2", $.offerRFY.storeId, $.offerRFY.iaCode, "");
		}
	}

};

function offerList(list, listSize, flag, storeId, iaCd, callback) {
	var privateCodeArray = list;
	var privateCodeArraySize = listSize;
	var flg = flag;
	var url = "";
	
	if($.offerRFY.gubun == "l") {
		url = '/' + SITE_CD + "/personal/selectRFYOfferLandingList";
	} else if($.offerRFY.gubun == "c") {
		url = '/' + SITE_CD + "/personal/selectRFYOfferCategoryList";
	}
	
	var params = {
				   "privateCodeArray": privateCodeArray,
				   "privateCodeArraySize" : privateCodeArraySize,
				   "flag" : flg,
				   "storeId" : storeId,
				   "iaCode" : iaCd,
				   "gubun" : $.offerRFY.gubun,
				   "mType"  : 'json'
				 };
    $.ajax({      
        type:"POST",  
        url: url,
        data: params,   
        dataType: 'json',
        success:function(data){   
        	if (callback && typeof(callback) == "function" )
			{
        		$.offerRFY.callback(data);
			}
        },   
        error:function(jqXHR, textStatus, errorThrown){
        	console.error(textStatus);
        }
    });
};

function storeLocatorOfferList(list, listSize, flag, storeId, iaCd, callback) {
	var privateCodeArray = list;
	var privateCodeArraySize = listSize;
	var flg = flag;
	var offerList = [];
	
	var params = {
				   "privateCodeArray": privateCodeArray,
				   "privateCodeArraySize" : privateCodeArraySize,
				   "flag" : flg,
				   "storeId" : storeId,
				   "iaCode" : iaCd,
				   "gubun" : $.offerRFY.gubun,
				   "mType"  : 'json'
				 };
	$.ajax({      
        type:"POST",  
        url: '/' + SITE_CD + "/personal/selectRFYOfferStoreLocatorList",
        data: params,   
        dataType: 'json',
        async: false, // ture: 비동기, false: 동기
        success:function(data){   
        	if(data.hasOwnProperty('personalRecommendModelList')) {
        		personalRecommendModelList = data.personalRecommendModelList;
        		
				var nMax = personalRecommendModelList.length;
				for (var i = 0; i < nMax; i++) {
					offerList.push(personalRecommendModelList[i]);
				}
        	} else {
        		return;
        	}
        },   
        error:function(jqXHR, textStatus, errorThrown){
        	console.error(textStatus);
        }
    });
    return $.offerRFY.storeLocatorOfferList = offerList;
};

