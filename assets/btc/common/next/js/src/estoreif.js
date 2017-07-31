/*!************************************************
 * E-Store Interface 관련 공통 Util
 * 인터페이스명세서(NG_to_Store)_20140226-v.3.0 적용
 **************************************************/
//var jQuery1910499421933433041_1385598221584 = function(data){ };
var estore = (function(){
	
	/**
	 * JSON 을 URL Parameter 로 변경
	 */
	var jsonToStringParameter = function( jsonParam ) {
		var strParam = '?';
		var idx = 0;
		var value;
		for( key in jsonParam ) {
			if( idx != 0 ) strParam += '&';
			value = jsonParam[key];
			if( $.isArray(value) ) {
				$.each(value, function(idx, data){
					strParam += key + '=' + data;
					if( idx < value.length-1 ) strParam += '&';
				});
			} else {
				strParam += key + '=' + value;
			}
			idx++;
		}
		return strParam;
	};
	
	/**
	 * ESTORE ERROR MESSAGE Alert Show
	 */
	var errorMsgShow = function( message ) {
	    var body = $('.ss_samsung');
	    var isWow = body.hasClass('pdp_wow') || body.hasClass('instore') || body.hasClass('business') ? true : false;
		if(isWow && SITE_CD == 'sec'){
			alert(message);
			return;
		}

		//에러 메시지 출력 분기(sec -> STD && 레이어 팝업 존재) dong_won.lee
		if (SITE_CD == 'sec') {
			if ($('#dummy-popup-container').text().length > 0 && !isWow ) {
				alert(message);
				return;
			}
		}

		var $layer = $('#popup_alert');
		$layer.find('.msg-text').html( message );
		if(SITE_CD == 'sec'){
			$layer.find('.pop-btn').find('.button').text("확인");
			//console.log(aa);
		}
		//console.log(tt);

		$(".layer_popup").hide();
		$layer.parent().show();
		$('.lightbox-skrim').remove();
		if(SITE_CD != 'ru')
			$('body').append('<div class="lightbox-skrim"></div>');
		var l = parseInt(($('body').width() - $layer.width())/2);
		var t = parseInt( $(window).scrollTop() + (($(window).height()-$layer.height())/2) );
		if($(window).height()<$layer.height()){
			t = $(window).scrollTop() + 10;
		}
	
		$layer.css({ "top":t+"px", "left":l+"px"});
		//web accessibility
		$("#popup_alert .popup_wrap .pop-btn").find('a').focus();
		//e.stopPropagation();
		
	};
	
	/*************************
	 * ajax call
	 *************************/
	var send = function( service, param, returnCallback ) {
		var pageQaUrl = document.location.host;
		var pageQaParam = document.location.search;
		if (SITE_CD == 'uk' || SITE_CD == 'de' || SITE_CD == 'fr' || SITE_CD == 'se' || SITE_CD == 'es' || SITE_CD == 'it' || SITE_CD == 'nl') {
			if (pageQaUrl.substring(0,7) == "stgweb4") {
				if (pageQaParam.indexOf("key=DDE6142438AF0208E043CBFEDF820208") > 0) {
					STORE_DOMAIN = "qa.shop.samsung.com";
				}
			}
		}
		
		var currLoc = location.href;
		var isConsumer = false;
		if(currLoc.indexOf('/consumer') > -1 ) {
			isConsumer = true;
		}
 
		var url = '';
		if (SITE_CD === 'sec') {
		 // preview4, stgweb4 - test
		 //url = location.protocol+'//stg-kr.shop.samsung.com/' + SITE_CD + '/ng/p4v1/' + service + ( param ? jsonToStringParameter(param) : '' );
  		 url = location.protocol+'//' + STORE_DOMAIN + '/' + SITE_CD + '/ng/p4v1/' + service + ( param ? jsonToStringParameter(param) : '' );
		}else if (SITE_CD === 'br') {
			if(currLoc.indexOf('www.samsung.com/') > -1){
				STORE_DOMAIN = 'shop.samsung.com';
			} else if (currLoc.indexOf('stgweb4.samsung.com/') > -1){
				//stg를 보도록 수정 요청 2016.08.17
				STORE_DOMAIN = 'br-shop-qa.samsungfk.net';
			} else {
				STORE_DOMAIN = 'shop.samsung.com';
			}
			url = 'https://' + STORE_DOMAIN + '/' + SITE_CD + '/ng/p4v1/' + service + ( param ? jsonToStringParameter(param) : '' );
		} else if (SITE_CD === 'au' || SITE_CD === 'de' || SITE_CD === 'fr') { //DE Hybris 6.0 //FR Hybris 6.0
			if(service == 'getEstoreCategoryList'){
				service = 'getEstoreCategoryListJsonP';
			}else if(service == 'setAgreeStorePolicy'){
				service = 'agreeStorePolicy';
			}else if(service == 'getSessionCheck') {
				service = 'sessionCheck';
			}
			
			url = 'https://' + STORE_DOMAIN + '/' + SITE_CD + '/ng/p4v1/' + service + ( param ? jsonToStringParameter(param) : '' );
			
			//if(currLoc.indexOf('www.samsung.com/') > -1 || currLoc.indexOf('origin2.samsung.com/') > -1){
			//	url = 'https://' + STORE_DOMAIN + '/' + SITE_CD + '/ng/p4v1/' + service + ( param ? jsonToStringParameter(param) : '' );
			//}else{
			//	url = 'https://' + STORE_DOMAIN + '/' + SITE_CD + '/ng/p4v1/' + service + ( param ? jsonToStringParameter(param) : '' );
			//}
		} else if (SITE_CD === 'uk' /*&& (currLoc.indexOf('stgweb4.samsung.com/') > -1 || currLoc.indexOf('preview4.samsung.com/') > -1) */){
			url = 'https://' + STORE_DOMAIN + '/' + SITE_CD + '/ng/p4v1/' + service + ( param ? jsonToStringParameter(param) : '' );
		} else{
		   url = 'http://' + STORE_DOMAIN + '/' + SITE_CD + '/ng/p4v1/' + service + ( param ? jsonToStringParameter(param) : '' );
		}
		
		if(SITE_CD === 'ru' && service == "getRealTimeProductSimpleInfo" && isConsumer){
			url = 'https://online-samsung.ru/api/samsung/getRealTimeProductSimpleInfo/v1?productCode='+$('#modelCode').val();
		}
		
		// sec 미리계산기 Test
		/*if(SITE_CD == 'sec' && service == "preCalcApply") {

			$.ajax({
				url: url,
				type: 'GET',
				async: false, //추가
				dataType : 'jsonp',
				jsonpCallback : 'jQuery1910499421933433041_1385598221584',
				jsonp : 'callback',
				success: function (data) {
					// 쿠키/세션간 사용자 정보가 일치하지 않을 경우
					if( '2100' == data.resultCode ) {
						
						//store 세션없음. 로그아웃처리
						if( param && param.hasOwnProperty('returnUrl') && '' !== param.returnUrl ) {
							$.Auth.signOut( param.returnUrl );
						} else {
							$.Auth.signOut();
						}
						// cn 사이트일 경우 코드값이 2000 ~ 3000번 일때만 경고창 노출
					} else if(SITE_CD == "sec" && 
							 '0000' != data.resultCode && '9000' != data.resultCode && '9001' != data.resultCode && '9002' != data.resultCode &&
								// 2014.05.08. 로그인 중일 때 호출하게 되면 '2110' 반환
								'2110' != data.resultCode &&
								'2002' != data.resultCode && // 판매불가상품 2015.04.17
								(data.resultCode.length == 4 && ('2' == data.resultCode.charAt(0) || '3' == data.resultCode.charAt(0)))){
						errorMsgShow( data.resultMessage );
					}
					// return callback
					if( $.isFunction(returnCallback) ) {
						returnCallback( data );
					}
				},
				error:function(jqXHR, textStatus, errorThrown){
					console.log("e");
				}
			});

		} else*/ if(service == "getRealTimeProductSimpleInfo" && isConsumer && SITE_CD != 'br' && SITE_CD != 'ru'){
			$.ajax({
				url: url,
				type: 'GET',
				dataType : 'jsonp',
				jsonpCallback : 'jQuery1910499421933433041_1385598221584',
				jsonp : 'callback',
				success: function (data) {
					// 쿠키/세션간 사용자 정보가 일치하지 않을 경우
					if( '2100' == data.resultCode ) {
						
						//store 세션없음. 로그아웃처리
						if( param && param.hasOwnProperty('returnUrl') && '' !== param.returnUrl ) {
							$.Auth.signOut( param.returnUrl );
						} else {
							$.Auth.signOut();
						}
						// cn 사이트일 경우 코드값이 2000 ~ 3000번 일때만 경고창 노출
					} else if(SITE_CD == "cn" && 
							 '0000' != data.resultCode && '9000' != data.resultCode && '9001' != data.resultCode && '9002' != data.resultCode &&
								// 2014.05.08. 로그인 중일 때 호출하게 되면 '2110' 반환
								'2110' != data.resultCode &&
								(data.resultCode.length == 4 && ('2' == data.resultCode.charAt(0) || '3' == data.resultCode.charAt(0)))){
						errorMsgShow( data.resultMessage );
					} else if(SITE_CD == "sec" && 
							 '0000' != data.resultCode && '9000' != data.resultCode && '9001' != data.resultCode && '9002' != data.resultCode &&
								// 2014.05.08. 로그인 중일 때 호출하게 되면 '2110' 반환
								'2110' != data.resultCode &&
								'2002' != data.resultCode && // 판매불가상품 2015.04.17
								(data.resultCode.length == 4 && ('2' == data.resultCode.charAt(0) || '3' == data.resultCode.charAt(0)))){
						errorMsgShow( data.resultMessage );
					} else if( SITE_CD != "cn" && SITE_CD != "sec" && '0000' != data.resultCode && '9000' != data.resultCode && '9001' != data.resultCode && '9002' != data.resultCode &&
							// 2014.05.08. 로그인 중일 때 호출하게 되면 '2110' 반환
							'2110' != data.resultCode ) {
						errorMsgShow( data.resultMessage );
					}
					// return callback
					if( $.isFunction(returnCallback) ) {
						returnCallback( data );
					}
				},
				error:function(jqXHR, textStatus, errorThrown){
					//errorMsgShow( ESTORE_FAULT_MSG );
					
					console.log("e");
				}
			});
		} else if(SITE_CD == 'ru'){
			$.ajax({
				type : 'GET',
				dataType : 'json',
				url : url,
				success: function (data) {
					if( $.isFunction(returnCallback) ) {
						returnCallback( data );
					}
					console.log(data);
				},
				error:function(jqXHR, textStatus, errorThrown){
					console.log("error");
				}
			});

		} else{
			$.ajax({
				url: url,
				type: 'GET',
				dataType : 'jsonp',
				jsonp : 'callback',
				success: function (data) {
					// 쿠키/세션간 사용자 정보가 일치하지 않을 경우
					if( '2100' == data.resultCode ) {
						
						//store 세션없음. 로그아웃처리
						if( param && param.hasOwnProperty('returnUrl') && '' !== param.returnUrl ) {
							$.Auth.signOut( param.returnUrl );
						} else {
							$.Auth.signOut();
						}
						// cn 사이트일 경우 코드값이 2000 ~ 3000번 일때만 경고창 노출
					} else if(SITE_CD == "cn" && 
							 '0000' != data.resultCode && '9000' != data.resultCode && '9001' != data.resultCode && '9002' != data.resultCode &&
								// 2014.05.08. 로그인 중일 때 호출하게 되면 '2110' 반환
								'2110' != data.resultCode &&
								(data.resultCode.length == 4 && ('2' == data.resultCode.charAt(0) || '3' == data.resultCode.charAt(0)))){
						errorMsgShow( data.resultMessage );
					} else if(SITE_CD == "sec" && 
							 '0000' != data.resultCode && '9000' != data.resultCode && '9001' != data.resultCode && '9002' != data.resultCode &&
								// 2014.05.08. 로그인 중일 때 호출하게 되면 '2110' 반환
								'2110' != data.resultCode &&
								'2002' != data.resultCode && // 판매불가상품 2015.04.17
								(data.resultCode.length == 4 && ('2' == data.resultCode.charAt(0) || '3' == data.resultCode.charAt(0)))){
									//에러 메시지의 내용 변화 (정확하게 아래의 문구가 맞아 떨어질 때 메시지 조작) dong_won.lee
									if (data.resultMessage.indexOf('구매 한도를 초과하여 구매가 불가능합니다.<br />')!=-1) {
										data.resultMessage =  '구매 한도' + data.resultMessage.split('구매 한도')[1].replace('<br />','\n');
									}
						errorMsgShow( data.resultMessage );
					} else if( SITE_CD != "cn" && SITE_CD != "sec" && '0000' != data.resultCode && '9000' != data.resultCode && '9001' != data.resultCode && '9002' != data.resultCode &&
							// 2014.05.08. 로그인 중일 때 호출하게 되면 '2110' 반환
							'2110' != data.resultCode ) {
						errorMsgShow( data.resultMessage );
					}
					// return callback
					if( $.isFunction(returnCallback) ) {
						returnCallback( data );
					}
				},
				error:function(jqXHR, textStatus, errorThrown){
					//errorMsgShow( ESTORE_FAULT_MSG ); // e-store 작업 관련 
					//returnCallback();
					if (SITE_CD == 'au' || SITE_CD == 'nz' || SITE_CD == 'sec') { // 금주 DB 작업 영향 국가만 
						if (window.location.pathname == '/' + SITE_CD + '/wishlist') {      // wishlist 페이지에서 에러처리 
							//errorMsgShow( ESTORE_FAULT_MSG ); // e-store 작업 관련 
							returnCallback();
						}
					}
					console.log("e");
				}
			});
		}
	};
	
	
	/*************************
	 * public network service
	 *************************/
	var estoreConstructor = function(){};

	/**
	 * buyNow(isBuyNowCartActive) 쿠키 생성
	 * @param callback function
	 */
	estoreConstructor.prototype.makeBuyNowCookie = function( returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'makeBuyNowCookie', null, returnCallback);
	};
	
	/**
	 * 장바구니 상품 추가
	 * @param  
	 * {
	 * 		productCode : 상품코드 [필수],
	 * 		quantity : 수량,
	 * 		returnUrl : 세션 종료시 redirect URL
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.addCart = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'addCart', param, returnCallback);
	};
	
	/**
	 * Cart 건수 조회
	 * @param callback function
	 */
	estoreConstructor.prototype.getCartCount = function( returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'getCartCount', null, returnCallback);
	};
	
	/**
	 * 실시간 상품 정보 조회(가격, 재고, 주문 Min/Max 수량, Promotion 여부)
	 * @param  
	 * {
	 * 		 productCode : 상품코드 [필수],
	 * 		 guid : 글로벌유저아이디
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.getRealTimeProductSimpleInfo = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'getRealTimeProductSimpleInfo', param, returnCallback);
	};
	
	/**
	 * 리스트용 실시간 상품 정보 조회
	 * @param  
	 * {
	 * 		 guid : 글로벌유저아이디,
	 * 		 productCode (Array<string>) : 상품 모델코드 배열
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.getRealTimeProductListInfo = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'getRealTimeProductListInfo', param, returnCallback);
	};
	
	/**
	 * 위시리스트 추가
	 * @param  
	 * {
	 * 		 productCode : 상품코드
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.addWishListItem = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'addWishListItem', param, returnCallback);
	};
	
	/**
	 * 위시리스트 추가(queue에 담을 필요 없는 경우-로그인 직후 cookie에 있는 wishlist 저장 시)
	 * @param  
	 * {
	 * 		 productCode : 상품코드
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.addWishListItemForce = function( param, returnCallback ) {
		send('addWishListItem', param, returnCallback);
	};
	
	/**
	 * 위시리스트 삭제
	 * @param  
	 * {
	 * 		productCode : 상품코드,
	 * 		returnUrl : 세션 종료시 redirect URL
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.delWishListItem = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'delWishListItem', param, returnCallback);
	};
	
	/**
	 * 위시리스트 가져오기
	 * @param  
	 * {
	 * 		 page (int) : 페이지번호[default:0],
	 * 		 pageSize (int) : 페이지사이즈[default:5],
	 * 		 returnUrl : 세션 종료시 redirect URL
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.getWishList = function( param, returnCallback ) {
		// defaultParam setting
		var defaultParam = {
			page : 1,
			pageSize : 5
		};
		if( param && !$.isFunction(param) ) defaultParam = $.extend( defaultParam, param );
		$.EstoreIfQueue.setQueue(send, 'getWishList', defaultParam, returnCallback);
	};
	
	/**
	 * Store Login
	 * @param callback function
	 */
	estoreConstructor.prototype.login = function( returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'login', null, returnCallback);
	};

	
	/**
	 * Store Logout
	 * @param  
	 * {
	 * 		 returnUrl : 세션 종료시 redirect URL
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.logout = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'logout', param, returnCallback);
	};

	/**
	 * 위시리스트용 실시간 상품 정보 조회
	 * @param  
	 * {
	 * 		 guid : 글로벌유저아이디,
	 * 		 productCode (Array<string>) : 상품 모델코드 배열,
	 * 		 returnUrl : 세션 종료시 redirect URL
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.getRealTimeWishProductListInfo = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'getRealTimeWishProductListInfo', param, returnCallback);
	};
	
	/**
	 * 비회원 주문정보 존재여부 조회
	 * @param  
	 * {
	 * 		 orderCode : 주문코드 [필수],
	 * 		 email : 주문자이메일 [필수]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.getGuestOrderExistYn = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'getGuestOrderExistYn', param, returnCallback);
	};
	
	/**
	 * SNS Login 사용자 정보 조회
	 * @param  
	 * {
	 * 		 snsSessionId : SNS Session ID [필수],
	 * 		 returnUrl : 세션 종료시 redirect URL
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.getSnsUserInfo = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'getSnsUserInfo', param, returnCallback);
	};
	
	/**
	 * 미니카트 조회
	 * @param callback function
	 */
	estoreConstructor.prototype.getMiniCartList = function( returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'getMiniCartList', null, returnCallback);
	};
	
	/**
	 * 미니카트 아이템 삭제
	 * @param  
	 * {
	 * 		 productCode : 상품코드 [필수],
	 * 		 moveWishList : WishList 등록여부 [필수:Y/N]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.delMiniCartItem = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'delMiniCartItem', param, returnCallback);
	};
	
	/**
	 * Store 개인정보보호정책 동의
	 * @param  
	 * {
	 * 		 receiveEmail : 메일수신여부 [필수]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.setAgreeStorePolicy = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'setAgreeStorePolicy', param, returnCallback);
	};
	
	/**
	 * Store Session 체크
	 * @param  
	 * {
	 * 		 returnUrl : 세션 종료시 redirect URL
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.getSessionCheck = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'getSessionCheck', param, returnCallback);
	};
	
	/**
	 * Estore Category목록 가져오기
	 * @param callback function
	 */
	estoreConstructor.prototype.getEstoreCategoryList = function( returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'getEstoreCategoryList', null, returnCallback);
	};
	
	/**
	 * 스토어 사용자 정보
	 * @param  
	 * {
	 * 		storeSessionId : SNS Session ID [필수]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.getCurrentUserInfo = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'getCurrentUserInfo', param, returnCallback);
	};
	
	/**
	 * 장바구니 상품 추가
	 * @param  
	 * {
	 * 		productCode : 상품코드 [필수],
	 * 		quantity : 수량
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.buyNow = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'buyNow', param, returnCallback);
	};
	
	/**
	 * 리뷰 조회
	 * @param  
	 * {
	 * 		siteCode : 국가코드 [필수],
	 * 		pageNum : List 시작 페이지 [필수],
	 * 		rowNum : List 개수 [필수],
	 * 		productCode : 상품코드 [필수],
	 * 		sort : 정렬타입 [옵션],
	 * 		userListYn : Y일 경우 사용자가 입력한 Review를 같이 보여줌 [필수]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.getReviews = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'getReviewList', param, returnCallback);
	};		
	
	/**
	 * 나의 리뷰 조회
	 * @param  
	 * {
	 * 		siteCode : 국가코드 [필수],
	 * 		productCode : 상품 코드 [필수]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.getMyReview = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'getMyReview', param, returnCallback);
	};
	
	/**
	 * 나의 리뷰 등록
	 * @param  
	 * {
	 * 		siteCode : 국가코드 [필수],
	 * 		productCode : 상품코드 [필수],
	 * 		rating : Review 평가 [필수],
	 * 		headline : Review 제목 [필수],
	 * 		comment : Review 내용 [필수]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.addReview = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'addReview', param, returnCallback);
	};
	
	/**
	 * 나의 리뷰 수정
	 * @param  
	 * {
	 * 		siteCode : 국가코드 [필수],
	 * 		productCode : 상품코드 [필수],
	 * 		reviewId : Review ID [필수],
	 * 		headline : Review 제목 [필수],
	 * 		comment : Review 내용 [필수],
	 * 		rating : Review 평가 [필수]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.updateReview = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'updateReview', param, returnCallback);
	};
	
	/**
	 * 나의 리뷰 삭제
	 * @param  
	 * {
	 * 		siteCode : 국가코드 [필수],
	 * 		productCode : 상품코드 [필수],
	 * 		reviewId : Review ID [필수]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.deleteReview = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'deleteReview', param, returnCallback);
	};

	/**
	 * 리뷰 추천
	 * @param  
	 * {
	 * 		siteCode : 국가코드 [필수],
	 * 		productCode : 상품코드 [필수],
	 * 		reviewId : Review ID [필수]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.addReviewHelpful = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'setReviewHelpful', param, returnCallback);
	};
	
	/**
	 * 리뷰 추천 등록
	 * @param  
	 * {
	 * 		siteCode : 국가코드 [필수],
	 * 		productCode : 상품코드 [필수],
	 * 		reviewId : Review ID [필수]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.addReviewHelpful = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'setReviewHelpful', param, returnCallback);
	};
	
	/**
	 * 리뷰 비추천 등록
	 * @param  
	 * {
	 * 		siteCode : 국가코드 [필수],
	 * 		productCode : 상품코드 [필수],
	 * 		reviewId : Review ID [필수]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.addReviewUnHelpful = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'setReviewUnHelpful', param, returnCallback);
	};
	
	/**
	 * 전문가 리뷰 조회
	 * @param  
	 * {
	 * 		siteCode : 국가코드 [필수],
	 * 		productCode : 상품코드 [필수],
	 * 		page : 페이지 번호 [필수]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.addReviewAbuse = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'setReviewAbuse', param, returnCallback);
	};
	
	/**
	 * 리뷰신고
	 * @param  
	 * {
	 * 		siteCode : 국가코드 [필수],
	 * 		productCode : 상품코드 [필수],
	 * 		review ID : Review ID [필수],
	 * 		issueDescription : Abuse comment [필수]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.getExpertReviewList = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'getExpertReviewList', param, returnCallback);
	};	
	
	/**
	 * 대물상품 중국의 성 조회( 성 코드, 성 이름 )
	 * @param  
	 * {
	 * 		 
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.getProductDetailRegion = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'getProductDetailRegion', param, returnCallback);
	};
	
	/**
	 * 대물상품 중국의 시 조회( 시 코드, 시 이름 )
	 * @param  
	 * {
	 * 		 region : 지역코드 [필수]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.getProductDetailCity = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'getProductDetailCity', param, returnCallback);
	};
	
	/**
	 * 개통폰 예상금액 조회
	 * @param  
	 * {
	 *       productCode   : 상품 코드 [옵션] 
	 *       makerx           : 통신사 사업자 코드 [옵션]
	 *       charge             : 요금제 [옵션]
	 *       contract          : 약정기간 [옵션]
	 *       jointype           : 가입유형 [옵션]
	 *       monthly          : 단말기할부기간 [옵션]
	 *       subside            : 추가할인 [옵션]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.showProductOpenphoneOption = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'showProductOpenphoneOption', param, returnCallback);
	};
	
	/**
	 * 미리계산기 금액 조회
	 * @param  
	 * {
	 *  productCodePost  : 상품코드 [필수]	 
	 *  quantity                : 수량 [옵션]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.preCalc = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'preCalc', param, returnCallback);
	};
	
	/**
	 * 미리계산기 재계산 금액 조회
	 * @param  
	 * {
	 *  cartCode 					 : 주문 번호	[필수] 
	 *  qty            				     : 수량 [필수]
	 *  voucherCode              : 바우처, 이벤트 코드 [필수]
	 *  releaseYn             		 : 쿠폰 철회 여부 [필수]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.preCalcApply = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'preCalcApply', param, returnCallback);
	};
	
	/**
	 * 매장픽업 상품 조회
	 * @param  
	 * {
	 *  searchall 					 : 전체 검색 여부	 [옵션]
	 *  addr            				 : 주소 [옵션]
	 *  page                            : 페이지 번호 [옵션]
	 *  productCode              	: 상품 코드 [필수]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.stores = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'stores', param, returnCallback);
	};

	/**
	 * 상품평 사용자 정보 조회
	 * @param  
	 * {
	 *  productCode              	: 상품 코드 [필수]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.getReviewStatus = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'getReviewStatus', param, returnCallback);
	};
	
	/**
	 * 상품의 experience 정보 조회수 증가
	 * @param  
	 * {
	 *  id              			: Exeperience 아이디 [필수]
	 *  baseModelCode              	: 상품 베이스 모델 코드 [필수]
	 * }
	 * @param callback function
	 */
	estoreConstructor.prototype.addViewCount = function( param, returnCallback ) {
		$.EstoreIfQueue.setQueue(send, 'addViewCount', param, returnCallback);
	};
	
	return new estoreConstructor();
	
})();