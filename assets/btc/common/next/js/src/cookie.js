if( SITE_CD == 'cn' ) {
	STORE_DOMAIN = 'store.samsung.com';
}	

if( (SITE_CD == 'fr') || (SITE_CD == 'nl') || (SITE_CD == 'au') ) {
	STORE_DOMAIN = 'shop.samsung.com';
}	



/*!************************************************
 * jquery.cookies.2.2.0.min.js 확장 Cookie Util
 **************************************************/
/**
 * 쿠키 데이터
 */
$.cookies.data = {
	// Cookie Name
	'SEARCH_NAME' : 'sk',
	'NAVIGATION_NAME' : 'nh',
	'PRIVATECODE_NAME' : 'pv',
	'COMPARELIST_NAME' : 'cl',
	'WISHLIST_NAME' : 'wl',
	'INSTORE_PRIVATECODE_NAME' : 'ipv',
	'STORE_REGION_NUM' : "cnregionnum",
	'STORE_REGION_CODE' : "cnregion",
	'STORE_REGION_NAME' : "cnregionname",
	'STORE_CITY_NUM' : "cncitynamenum",
	'STORE_CITY_CODE' : "cncity",
	'STORE_CITY_NAME' : "cncityname",
	// Cookie Value Max Length
	'SEARCH_MAX_SIZE' : 3,
	'PRIVATECODE_MAX_SIZE' : 5,
	'WISHLIST_MAX_SIZE' : 6,
	'STORE_REGION_MAX_SIZE' : 1,
	'STORE_CITY_MAX_SIZE' : 1
};

/**
 * 쿠키의 Default Option return
 */
$.cookies.getDefaultOption = function( expires, path ) {
	// expires 값이 없을 경우 default 1일
	if( !expires || !(expires instanceof Date) ) {
		expires = new Date();
		expires.setTime(expires.getTime() + 1000*60*60*24);
	}
	// path 값이 없을 경우 '/'
	if( !path || '' === path ) {
		path = '/';
	}
	// SITE CODE 별로 저장
	return defaultOptions = {
		expiresAt: expires,
		path: path,
		domain: '.samsung.com',
		secure: false
	};
};

/**************************************************
 * Search - START
 **************************************************/

/**
 * 검색 키워드 저장
 * @param keyword, expires
 */
$.cookies.setSearchKeyword = function( keyword, expires ) {
	var cookieNm = this.data.SEARCH_NAME;
	var cookieVal = this.get( cookieNm );
	if( !cookieVal || '' == cookieVal || 'undefined' == cookieVal ) {
		cookieVal = [ keyword ];
	} else {
		// 중복 체크
		if( $.inArray( keyword, cookieVal ) >= 0 ) {
			return;
		}
		if( cookieVal.length >= this.data.SEARCH_MAX_SIZE ) {
			cookieVal.splice(0,1);
		}
		cookieVal.push( keyword );
	}
	this.set( cookieNm, cookieVal, this.getDefaultOption(expires, '/'+SITE_CD+'/') );
};

/**
 * 검색 키워드 조회
 * @returns Array
 */
$.cookies.getSearchKeyword = function() {
	var cookieVal = this.get( this.data.SEARCH_NAME );
	return ( cookieVal && $.isArray(cookieVal) ? cookieVal : [] );
};

/**
 * 검색 키워드 삭제
 * @returns Array
 */
$.cookies.clearSearchKeyword = function(a){
	this.del(this.data.SEARCH_NAME,this.getDefaultOption(a,"/"+SITE_CD+"/"));
}


/**************************************************
 * Search - END
 **************************************************/


/**************************************************
 * Navigation History - START
 **************************************************/

/**
 * 네비게이션 히스토리 저장
 * @param  type(메뉴별동일값으로지정해야함), val, expires
 */
$.cookies.setNavigationHistory = function( type, val, expires ) {
	var cookieNm = this.data.NAVIGATION_NAME;
	var cookieVal = this.get( cookieNm );
	if( !cookieVal || '' == cookieVal || 'undefined' == cookieVal ) {
		cookieVal = {};
		cookieVal[ type ] = val;
	} else {
		cookieVal[type] = val;
	}
	this.set( cookieNm, cookieVal, this.getDefaultOption(expires) );
};

/**
 * 네비게이션 히스토리 조회
 * @param type (set시 지정해준 type과 동일)
 * @returns string
 */
$.cookies.getNavigationHistory = function( type ) {
	var cookieNm = this.data.NAVIGATION_NAME;
	var cookieVal = this.get( cookieNm );
	return ( cookieVal && cookieVal.hasOwnProperty(type) ? cookieVal[type] : '' );
};


/**************************************************
 * Navigation History - END
 **************************************************/


/**************************************************
 * 개인화 관련 추가 - START
 **************************************************/

/**
 * 개인화 관련 데이터 저장
 * @param param, expires
 */
$.cookies.setPrivateCode = function( param, expires ) {
	var cookieNm = this.data.PRIVATECODE_NAME;
	var cookieVal = this.get( cookieNm );
	if( !cookieVal || '' == cookieVal || 'undefined' == cookieVal ) {
		cookieVal = [ param ];
	} else {
		if( cookieVal.length >= this.data.PRIVATECODE_MAX_SIZE ) {
			cookieVal.splice(0,1);
		}
		cookieVal.push( param );
	}
	this.set( cookieNm, cookieVal, this.getDefaultOption(expires) );
};

/**
 * 개인화 관련 저장된 데이터 조회
 * @returns array
 */
$.cookies.getPrivateCodeList = function() {
	var cookieVal = this.get( this.data.PRIVATECODE_NAME );
	return ( cookieVal && $.isArray(cookieVal) ? cookieVal : [] );
};


/**************************************************
 * 개인화 관련 추가 - END
 **************************************************/


/**************************************************
 * Comparison - START
 **************************************************/
 
/**
 * 카테고리 별 제품 저장
 * @param param, expires
 */
$.cookies.setCompareProduct = function( param, expires ) {

	// validation
	if( !param || !param.hasOwnProperty('category') || !param.hasOwnProperty('id') ) {
		//console.log("저장할 제품 정보가 부족합니다");
		return;
	}
	
	var cookieNm = this.data.COMPARELIST_NAME;
	var cookieVal = this.get( cookieNm );
	if( !cookieVal || '' == cookieVal || 'undefined' == cookieVal ) {
		cookieVal = {
			'category' : param.category,
			'categoryName' : param.categoryName,
			'list' : [param]
		};
	} else {
		// 카테고리 Check
		if( param.category !== cookieVal.category ) {
			//console.log("동일 카테고리만 저장 가능 합니다");
			return;
		}
		// 중복모델 Check
		for( var i=0,iSize=cookieVal.list.length ; i < iSize ; i++ ) {
			if( cookieVal.list[i].id === param.id ) {
				//console.log("이미 저장된 제품 입니다");
				return;
			}
		}
		cookieVal.list.push( param );
	}
	this.set( cookieNm, cookieVal, this.getDefaultOption(expires) );
};

/**
 * 현재 저장된 카테고리
 * @returns category
 */
$.cookies.getCategory = function() {
	var cookieVal = this.get( this.data.COMPARELIST_NAME );
	return ( cookieVal && cookieVal.hasOwnProperty('category') ? cookieVal.category : '' ); 
};

/**
 * 현재 저장된 카테고리명
 * @returns category
 */
$.cookies.getCategoryName = function() {
	var cookieVal = this.get( this.data.COMPARELIST_NAME );
	return ( cookieVal && cookieVal.hasOwnProperty('categoryName') ? cookieVal.categoryName : '' ); 
};

/**
 * 제품수 조회
 * @returns int 해당 카테고리에 저장된 제품수
 */
$.cookies.getCompareProductCnt = function() {
	var cookieVal = this.get( this.data.COMPARELIST_NAME );
	return ( cookieVal && $.isArray(cookieVal.list) ? cookieVal.list.length : 0 );
};

/**
 * 제품 조회
 * @returns array 해당 카테고리에 저장된 제품 리스트
 */
$.cookies.getCompareProductList = function() {
	var cookieVal = this.get( this.data.COMPARELIST_NAME );
	return ( cookieVal && $.isArray(cookieVal.list) ? cookieVal.list : [] );
};


/**
 * 제품 존재 여부
 * @param id
 * @returns boolean 제품 존재 여부
 */
$.cookies.isCompareProduct = function( id ) {
	var cookieNm = this.data.COMPARELIST_NAME;
	var cookieVal = this.get( cookieNm );
	if( cookieVal && $.isArray(cookieVal.list) ) {
		for( var i=0,iSize=cookieVal.list.length ; i < iSize ; i++ ) {
			if( cookieVal.list[i].id == id ) {
				return true;
			}
		}
	}
	return false;
};

/**
 * 제품 삭제
 * @param id
 * @param expires
 * @returns boolean 삭제성공여부
 */
$.cookies.deleteCompareProduct = function( id, expires ) {
	var cookieNm = this.data.COMPARELIST_NAME;
	var cookieVal = this.get( cookieNm );
	if( cookieVal && $.isArray(cookieVal.list) ) {
		var productList = cookieVal.list;
		for( var i=0,iSize=productList.length ; i < iSize ; i++ ) {
			if( productList[i].id == id ) {
				productList.splice(i,1);
				if( productList.length <= 0 ) {
					this.del( cookieNm, this.getDefaultOption(expires) );
				} else {
					cookieVal.list = productList;
					this.set( cookieNm, cookieVal, this.getDefaultOption(expires) );
				}
				return true;
			}
		}
	}
	return false;
};

/**
 * 현재 Compare 쿠키 전체 삭제
 * @param expires
 */
$.cookies.deleteComparison = function( expires ) {
	this.del( this.data.COMPARELIST_NAME, this.getDefaultOption(expires) );
};

/**************************************************
 * Comparison - END
 **************************************************/


/**************************************************
 * WishList - START
 **************************************************/

/**
 * 위시리스트 제품 저장
 * @param id, expires
 */
$.cookies.setWishList = function( id, expires ) {
	var cookieNm = this.data.WISHLIST_NAME;
	var cookieVal = this.get( cookieNm );
	if( !cookieVal || '' == cookieVal || 'undefined' == cookieVal ) {
		cookieVal = [id];
	} else {
		// 중복 체크
		if( $.inArray( id, cookieVal ) >= 0 ) {
			//console.log("위시리스트에 이미 추가되었습니다");
			return;
		}
		if( cookieVal.length >= this.data.WISHLIST_MAX_SIZE ) {
			cookieVal.splice(0,1);
		}
		cookieVal.push( id );
	}
	this.set( cookieNm, cookieVal, this.getDefaultOption(expires) );
};

/**
 * 위시리스트 제품 수 조회
 * @returns int 제품 수
 */
$.cookies.getWishListCnt = function() {
	var cookieVal = this.get( this.data.WISHLIST_NAME );
	return ( cookieVal && $.isArray(cookieVal) ? cookieVal.length : 0 );
};

/**
 * 위시리스트 제품 조회
 * @returns Array 위시리스트 저장된 제품ID 리스트
 */
$.cookies.getWishList = function() {
	var cookieVal = this.get( this.data.WISHLIST_NAME );
	return ( cookieVal && $.isArray(cookieVal) ? cookieVal : [] );
};

/**
 * 위시리스트 제품 존재 여부
 * @param id
 * @returns boolean 제품 존재 여부
 */
$.cookies.isAddedWishList = function( id ) {
	var cookieNm = this.data.WISHLIST_NAME;
	var cookieVal = this.get( cookieNm );
	if( cookieVal && $.isArray(cookieVal) ) {
		for( var i=0,iSize=cookieVal.length ; i < iSize ; i++ ) {
			if( cookieVal[i] == id ) {
				return true;
			}
		}
	}
	return false;
};

/**
 * 위시리스트 제품 삭제
 * @param id
 * @returns boolean 삭제성공여부
 */
$.cookies.deleteWishProduct = function( id, expires ) {
	var cookieNm = this.data.WISHLIST_NAME;
	var cookieVal = this.get( cookieNm );
	if( cookieVal && $.isArray(cookieVal) ) {
		var num = $.inArray(id, cookieVal);
		if( num >= 0 ) {
			cookieVal.splice( num, 1 );
			if( cookieVal.length <= 0 ) {
				this.del( cookieNm, this.getDefaultOption(expires) );
			} else {
				this.set( cookieNm, cookieVal, this.getDefaultOption(expires) );
			}
			return true;
		}
	}
	return false;
};

/**
 * 위시리스트 제품 전체 삭제
 * @returns boolean 삭제성공여부
 */
$.cookies.deleteWishList = function( expires ) {
	this.del( this.data.WISHLIST_NAME, this.getDefaultOption(expires) );
};

/**************************************************
 * WishList - END
 **************************************************/



/**************************************************
 * In-store 개인화 관련 추가 - START
 **************************************************/

/**
 * 개인화 관련 데이터 저장
 * @param param, expires
 */
$.cookies.setInstorePrivateCode = function( param, expires ) {
	var cookieNm = this.data.INSTORE_PRIVATECODE_NAME;
	var cookieVal = this.get( cookieNm );
	if( !cookieVal || '' == cookieVal || 'undefined' == cookieVal ) {
		cookieVal = [ param ];
	} else {
		cookieVal.push( param );
	}
	this.set( cookieNm, cookieVal, this.getDefaultOption(expires) );
};

/**
 * 개인화 관련 저장된 데이터 조회
 * @returns array
 */
$.cookies.getInstorePrivateCodeList = function() {
	var cookieVal = this.get( this.data.INSTORE_PRIVATECODE_NAME );
	return ( cookieVal && $.isArray(cookieVal) ? cookieVal : [] );
};


/**************************************************
 * In-store 개인화 관련 추가 - END
 **************************************************/



/**************************************************
 * Information Accepted Flag 저장 - START
 **************************************************/

$.cookies.informationAccepted = function() {
	this.set('informationaccepted', true);
};

$.cookies.checkInformationAccepted = function() {
	var cookieVal = this.get('informationaccepted');
	return ( true == cookieVal ? true : false );
};

/**************************************************
 * Information Accepted Flag 저장 - END
 **************************************************/


/**************************************************
 * 중국 e-store 전용 - START
 **************************************************/

/**
 *  중국 e-store 지역 정보 저장
 *  @param
 *  {
 *  	cnregionnum : 인덱스
 *  	cnregion : 성코드
 *  	cnregionname : 성이름
 *  }
 *  
 */
$.cookies.setProductDetailRegion = function( param, expires ) {
	
	if(param != undefined && param !=null
		&& param.hasOwnProperty(this.data.STORE_REGION_NUM)
		&& param.hasOwnProperty(this.data.STORE_REGION_CODE)
		&& param.hasOwnProperty(this.data.STORE_REGION_NAME)){
		
		var cookieResionNum = this.data.STORE_REGION_NUM;
		var cookieResionNumVal = param.cnregionnum;
		this.set( cookieResionNum, cookieResionNumVal, this.getDefaultOption(expires) );
		
		var cookieResionCd = this.data.STORE_REGION_CODE;
		var cookieResionCdVal = param.cnregion;
		this.set( cookieResionCd, cookieResionCdVal, this.getDefaultOption(expires) );
		
		var cookieResionNm = this.data.STORE_REGION_NAME;
		var cookieResionNmVal = param.cnregionname;
		this.set( cookieResionNm, cookieResionNmVal, this.getDefaultOption(expires) );
	}
};

/**
 * 중국 e-store 지역 정보 삭제
 * 
 */
$.cookies.delProductDetailRegion = function(expires) {
	this.del( this.data.STORE_REGION_NUM, this.getDefaultOption(expires) );
	this.del( this.data.STORE_REGION_CODE, this.getDefaultOption(expires) );
	this.del( this.data.STORE_REGION_NAME, this.getDefaultOption(expires) );
};

/**
 * 중국 e-store 지역 정보 조회 (인덱스)
 * @returns String 중국 e-store 지역 인덱스
 */
$.cookies.getProductDetailRegionNum = function() {
	var cookieVal = this.get( this.data.STORE_REGION_NUM );
	return cookieVal;
};

/**
 * 중국 e-store 지역 정보 조회 (성코드)
 * @returns String 중국 e-store 성코드
 */
$.cookies.getProductDetailRegionCd = function() {
	var cookieVal = this.get( this.data.STORE_REGION_CODE );
	return cookieVal;
};

/**
 * 중국 e-store 지역 정보 조회 (성이름)
 * @returns String 중국 e-store 성이름
 */
$.cookies.getProductDetailRegionNm = function() {
	var cookieVal = this.get( this.data.STORE_REGION_NAME );
	return cookieVal;
};

/**
 *  중국 e-store 시 정보 저장
 *  @param
 *  {
 *  	cncitynamenum : 인덱스
 *  	cncity : 시코드
 *  	cncityname : 시이름
 *  }
 *  
 */
$.cookies.setProductDetailCity = function( param, expires ) {
	
	if(param != undefined && param !=null
			&&param.hasOwnProperty(this.data.STORE_CITY_NUM)
			&& param.hasOwnProperty(this.data.STORE_CITY_CODE)
			&& param.hasOwnProperty(this.data.STORE_CITY_NAME)){
		
		var cookieCityNum = this.data.STORE_CITY_NUM;
		var cookieCityNumVal = param.cncitynamenum;
		this.set( cookieCityNum, cookieCityNumVal, this.getDefaultOption(expires) );
		
		var cookieCityCd = this.data.STORE_CITY_CODE;
		var cookieCityCdVal = param.cncity;
		this.set( cookieCityCd, cookieCityCdVal, this.getDefaultOption(expires) );
		
		var cookieCityNm = this.data.STORE_CITY_NAME;
		var cookieCityNmVal = param.cncityname;
		this.set( cookieCityNm, cookieCityNmVal, this.getDefaultOption(expires) );
	}
};


/**
 * 중국 e-store 시 정보 삭제
 * 
 */
$.cookies.delProductDetailCity = function(expires) {
	this.del( this.data.STORE_CITY_NUM, this.getDefaultOption(expires) );
	this.del( this.data.STORE_CITY_CODE, this.getDefaultOption(expires) );
	this.del( this.data.STORE_CITY_NAME, this.getDefaultOption(expires) );
};

/**
 * 중국 e-store 시 정보 조회 (인덱스)
 * @returns String 중국 e-store 시 인덱스
 */
$.cookies.getProductDetailCityNum = function() {
	var cookieVal = this.get( this.data.STORE_CITY_NUM );
	return cookieVal;
};

/**
 * 중국 e-store 시 정보 조회 (시코드)
 * @returns String 중국 e-store 시코드
 */
$.cookies.getProductDetailCityCd = function() {
	var cookieVal = this.get( this.data.STORE_CITY_CODE );
	return cookieVal;
};

/**
 * 중국 e-store 시 정보 조회 (성이름)
 * @returns String 중국 e-store 시이름
 */
$.cookies.getProductDetailCityNm = function() {
	var cookieVal = this.get( this.data.STORE_CITY_NAME );
	return cookieVal;
};

/**************************************************
 * 중국 e-store 전용 - END
 **************************************************/

/**
 * SITE CODE 변경 시 현재 SITE CODE의 모든 쿠키 내용 제거
 */
try{
	//console.log( 'SITE_CD >> ', SITE_CD , ', cookie_country >> ', $.cookies.get('cookie_country') );
	if( !$.cookies.get('cookie_country') || '' === $.cookies.get('cookie_country') ) {
		//console.log('SITE CD 초기화');
		$.cookies.set('cookie_country', SITE_CD, $.cookies.getDefaultOption());
	} else if( SITE_CD !== $.cookies.get('cookie_country')) {
		//console.log('이전 SITE_CD의 쿠키 정보를 삭제 합니다');
		var deleteOption = $.cookies.getDefaultOption();
	    $.cookies.del( $.cookies.data.NAVIGATION_NAME, deleteOption );
	    $.cookies.del( $.cookies.data.PRIVATECODE_NAME, deleteOption );
	    $.cookies.del( $.cookies.data.COMPARELIST_NAME, deleteOption );
	    $.cookies.del( $.cookies.data.WISHLIST_NAME, deleteOption );
	    $.cookies.del( $.cookies.data.INSTORE_PRIVATECODE_NAME, deleteOption );
		$.cookies.set('cookie_country', SITE_CD, $.cookies.getDefaultOption());
	}
} catch (e) {}


/*************************************************************
 * P3 GNB에서 사용 중이던 팝업 오픈 함수 추가 2014.06.26
 * **********************************************************/
(function($) {
	$.locator = {
		popup : function(pageTarget,pageName,pageWidth,pageHeight){
			var objPageTarget = $.trim(pageTarget);
			var objPageName = $.trim(pageName);
			var objPageWidth = $.trim(pageWidth);
			var objPageHeight = $.trim(pageHeight);
			option = 'width=' + objPageWidth + ',height=' + objPageHeight;
			
			if(parseInt(pageHeight) >= 650){
				option +=',scrollbars=yes,resizable=yes, toolbar=no,directories=no,location=no,menubar=no,status=no';
			}else {
				option +=',scrollbars=no,resizable=yes, toolbar=no,directories=no,location=no,menubar=no,status=no';
			}
			
			
			window.open(objPageTarget,objPageName, option);
		}
	};
})(jQuery);
