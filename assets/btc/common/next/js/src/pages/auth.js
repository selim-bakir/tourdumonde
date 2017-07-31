var ss = $;

// Store Login callback function
function nextGenLoginResult(data){
	
}

(function (window, $) {
	
	ss.Sign = function () {
		var policyCheckSite = SITE_CD == "es" ? true : false;
		var receiveEmailChecked = false;
		
		var userData = null;
		var estoreLive = true;
		
		var returnURL = "";

		//var userLoginBtn = ".sys-login-btn";
		var userLoginBtn = ".login-btn";

		var $showLayer = null;
		
		var $loginLayerPopup = null;

		var $loginForm = null;
		var $joinForm = null;
		var $findAccountForm = null;

		var $idInput = null;
		var $pwInput = null;
		var $rememberCheck = null;
		var $rememberCheckLabel = null;
		var $errorIdText = null;
		var $errorPwText = null;

		var $loginCloseBtn = null;
		
		var $dimContainer = null;
		
		/* 팝업 */
		var $privacyPopup = null;
		var $preferencePopup = null;
		var $confirmPopup = null;
		
		var $privacyBtn = null;
		var $preferenceCheckBtn = null;
		
		var beforeStoreIframeSrc = "";
		
		// 로그인 창을 띄운 개체(팝업 닫기 시 포커스를 주기 위함)
		var closeReturnFocusElem = null;
		
		// 공통 제공을 위한 object
		// checkSignIn, getUserProfile
		
		//AU hybris6.0
		ss.Auth = {};
		var isAemGnb = ($('.gb-gnb').length) ? true : false;  // isAemGnb 는 $('#gnbP5UseSite').val() 로 대체함 > 롤백
		var $sMyMenu = null;
		if (isAemGnb && USE_ESTORE) { //[JY]PE login(rb)
			userLoginBtn = '.gb-gnb__utility .s-login, .drilldown-auth a.s-login';
			$sMyMenu = $('.gb-gnb__utility .s-mymenu, .drilldown-auth > ul > li:gt(0) > .s-mymenu');
			if (!$sMyMenu.length) {return;}
			$sMyMenu.each(function (i) {
				var $this = $(this);
				if (i === 0 ) {
					$(this).find('li').last().find('> a').on('click', function (e) {
						e.preventDefault();
			  			ss.Auth.signOut();
					});
				} else {
					$(this).parent().find('.s-depth3-link').last().on('click', function (e) {
						e.preventDefault();
			 			ss.Auth.signOut();
					});
				}
			});
		}

		//date format setting
		Date.prototype.format = function(f) {
		    if (!this.valueOf()) return " ";
		 
		    var d = this;
		     
		    return f.replace(/(yyyy|MM|dd|HH|mm|ss)/gi, function($1) {
		        switch ($1) {
		            case "yyyy": return d.getFullYear();
		            case "MM": return (d.getMonth() + 1).zf(2);
		            case "dd": return d.getDate().zf(2);
		            case "HH": return d.getHours().zf(2);
		            case "mm": return d.getMinutes().zf(2);
		            case "ss": return d.getSeconds().zf(2);
		            default: return $1;
		        }
		    });
		};
		 
		String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
		String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
		Number.prototype.zf = function(len){return this.toString().zf(len);};
		
		// Navi Detecting(New, Old)
		if ($('.sys-login-btn[data-button-type="1"]').size()) {
		    var IS_OLD_NAVI = true;
		    userLoginBtn = ".sys-login-btn";
		}

		// String 파라미터를 오브젝트로 변환
		// SNS 로그인 시 스토어에서 보내주는 파라미터를 읽기 위함 
		function getQueryParams(qs) {
		    qs = qs.split("+").join(" ");
		
		    var params = {}, tokens,
		        re = /[?&]?([^=]+)=([^&]*)/g;
		
		    while (tokens = re.exec(qs)) {
		        params[decodeURIComponent(tokens[1])]
		            = decodeURIComponent(tokens[2]);
		    }
		
		    return params;
		}
		
		// 로그인 요청
		function signIn() {
			
			var valid = true;
			
			if ( $.trim($idInput.val()) == "" )
			{
				$errorIdText.show();
				valid = false;
			}
			
			if ( $.trim($pwInput.val()) == "" )
			{
				$errorPwText.show();
				valid = false;
			}
			
			if (!valid)
				return;
			
			var rememberChecked = $rememberCheck.is(":checked");
			
			if (rememberChecked)
				setRememberId( $.trim($idInput.val()), 7);
			else
				setRememberId( null, -1);
			
			if (!returnURL)
				returnURL = window.location.href;
			
			$("#returnURL", $loginForm).val( encodeURIComponent(returnURL) );
			$("#userId", $loginForm).val( $.trim($idInput.val()) );
			$("#userPass", $loginForm).val( $pwInput.val());
			
			$(window).bind('beforeunload', function(){
				$("#userId", $loginForm).val( "" );
				$("#userPass", $loginForm).val( "" );
			});
			
			$loginForm.submit();

			returnURL = false;
			
			return false;
		}
		
		// 스토어 로그인 요청 쿠키 삭제
		function deleteLoginRequestCookie() {
			$.cookies.del("estoreLoginRequesting");
			$.cookies.del("estoreLoginRequesting", {domain:".samsung.com"});
		}
		
		// 2014.02.21 로그아웃 시 쿠키만 삭제
		function deleteSignCookie() {
			if (SITE_CD == 'uk' || SITE_CD == 'se' || SITE_CD == 'dk' /*|| SITE_CD == 'fi' || SITE_CD == 'no'*/) { //[JY] SENA (jusuk)
				deleteSACookie();
				//$.cookies.del("iPlanetDirectoryPro");
				//$.cookies.del("iPlanetDirectoryPro", {path:'/',domain:'.samsung.com'});
				//$.cookies.del("iPlanetDirectoryProOptVal");
				//$.cookies.del("iPlanetDirectoryProOptVal", {path:'/',domain:'.samsung.com'});
			}
			$.cookies.del("snsSessionId");
			$.cookies.del("snsSessionId", {path:'/',domain:'.samsung.com'});
			$.cookies.del("isStoreLogedIn");
			$.cookies.del("sa_em");
			$.cookies.del("sa_em", {path:'/',domain:'.samsung.com'});
			$.cookies.del("lastName",{domain:".samsung.com"});
			$.cookies.del("firstName",{domain:".samsung.com"});
			
			deleteLoginRequestCookie();
			
			// omniture - 로그아웃
			sendClickCode('account','log out');
		}
		
		/* AU store 6.0 : dotcom taken SA logout */
		function deleteSACookie() {
			$.cookies.del("iPlanetDirectoryPro");
			$.cookies.del("iPlanetDirectoryPro", {path:'/',domain:'.samsung.com'});
			$.cookies.del("iPlanetDirectoryProOptVal");
			$.cookies.del("iPlanetDirectoryProOptVal", {path:'/',domain:'.samsung.com'});
		}
		
		// 로그아웃 요청
		function signOut() {
    
		    deleteSignCookie();
		    
		    // Navi Detecting(New, Old)
		    if (IS_OLD_NAVI) {
		        // Old Navi
		        $(userLoginBtn).filter("[data-button-type=1]")
		                        .contents()
		                        .filter(function(){return this.nodeType==3;})
		                        .remove().end().end()
		                        .append( "SIGN OUT" );
		        $(".nav").find(userLoginBtn + "[data-button-type=1]").attr("title", LOGIN.msg.signBtnText1);
		        $(".nav").find(userLoginBtn + "[data-button-type=1]>span").attr("class", "icon-signin");
		        $(userLoginBtn + "[data-button-type=1]>span").attr("class", "icon-signin");
		    } else {
		        // New Navi
		        $(userLoginBtn + "[data-button-type=1]").attr("title", LOGIN.msg.signBtnText1);
		        $(userLoginBtn + "[data-button-type=1]").find(".login-txt").text(LOGIN.msg.signBtnText1);
		        $(userLoginBtn).addClass('is-login');
		    }
		    
		    userData = null;
		    
		    // gnb util 로그인 텍스트형 버튼 처리
		    if (SITE_CD == 'sec')
		        $('#utillogin').text(LOGIN.msg.signBtnText1);
		    
			//AU Hybris 6.0  //DE Hybris 6.0  //FR Hybris 6.0
			//if (SITE_CD == 'au' || SITE_CD == 'de' || SITE_CD == 'fr')
			if (isAemGnb && USE_ESTORE) //[JY]PE login(rb)
				setMyMenu(false);
			
		    return false;
		}
		
		//Hybris 6.0
		function setMyMenu(isLogedIn) {
			if (SITE_CD == 'sec') {
				if (isLogedIn)
				{
					$.ajax({
						url : "https://" + DOMAIN + "/"  + SITE_CD + "/data-login/getUserProfile",
						type : "post",
						dataType : "jsonp",
						success: function(data){
							if (data)
							{
								$.cookies.del("lastName",{domain:".samsung.com"});
								$.cookies.del("firstName",{domain:".samsung.com"});
								var firstName = data.userBaseVO.userBaseIndividualVO.givenName;
								var lastName = data.userBaseVO.userBaseIndividualVO.familyName;
								$.cookies.set("lastName", lastName, {domain : ".samsung.com"});
								$.cookies.set("firstName", firstName, {domain : ".samsung.com"});
								if (SITE_CD == 'sec') {
									$('.s-mymenu').find('.s-mymenu-name').text("안녕하세요. ").append($('<strong/>', { text: lastName + firstName +"님." }));
								} else {
									$('.s-mymenu').find('.s-mymenu-name').text("Hi, ").append($('<strong/>', { text: firstName + " " + lastName }));
								}
							}
							else {
								$('.s-mymenu').find('.s-mymenu-name').text("Hi, ");
							}
						},
						error : function() {
							console.log("get profile Error");
						}
					});
				}
				else {
					$('.s-mymenu').find('.s-mymenu-name').text("Hi, ");
				}
			} else {
				if ($.cookies.get("lastName") == null || $.cookies.get("firstName") == null) {
					if (isLogedIn)
					{
						$.ajax({
							url : "https://" + DOMAIN + "/"  + SITE_CD + "/data-login/getUserProfile",
							type : "post",
							dataType : "jsonp",
							success: function(data){
								if (data)
								{
									$.cookies.del("lastName",{domain:".samsung.com"});
									$.cookies.del("firstName",{domain:".samsung.com"});
									var firstName = data.userBaseVO.userBaseIndividualVO.givenName;
									var lastName = data.userBaseVO.userBaseIndividualVO.familyName;
									$.cookies.set("lastName", lastName, {domain : ".samsung.com"});
									$.cookies.set("firstName", firstName, {domain : ".samsung.com"});
									if (SITE_CD == 'sec') {
										$('.s-mymenu').find('.s-mymenu-name').text("안녕하세요. ").append($('<strong/>', { text: lastName + firstName +"님." }));
									} else {
										$('.s-mymenu').find('.s-mymenu-name').text("Hi, ").append($('<strong/>', { text: firstName + " " + lastName }));
									}
								}
								else {
									$('.s-mymenu').find('.s-mymenu-name').text("Hi, ");
								}
							},
							error : function() {
								console.log("get profile Error");
							}
						});
					}
					else {
						$('.s-mymenu').find('.s-mymenu-name').text("Hi, ");
					}
				} else {
					var lastName = $.cookies.get("lastName");
					var firstName = $.cookies.get("firstName");
					$('.s-mymenu').find('.s-mymenu-name').text("Hi, ").append($('<strong/>', { text: firstName + " " + lastName }));
				}
			}
		}
		
		// Find Account
		function findAccount() {
			returnURL = window.location.href;
			
			$("#findReturnURL", $findAccountForm).val( returnURL );
			$("#findGoBackURL", $findAccountForm).val( returnURL );
			
			sendClickCode('account','account:find sign in info');
			
			$findAccountForm.submit();
			
			return false;
		}

		// 회원 가입
		function signUp() {
			returnURL = "http://" + window.location.host + "/" + SITE_CD + "/";
			
			// Omniture
			sendClickCode('account','account:sign up');
			
			$("#joinReturnURL", $joinForm).val( returnURL );
			$("#joinGoBackURL", $joinForm).val( returnURL );
			
			$joinForm.submit();
			
			return false;
		}
		
		// input elements 초기화
		function inputInit(isFirstUrl)
		{
			$idInput.val("");
			$pwInput.val("");
			$rememberCheck.attr("checked", false);
			$rememberCheckLabel.removeClass();
			
			$errorIdText.hide();
			$errorPwText.hide();
			
			if (isFirstUrl)
			{
				
				//최초 로딩시 snsiframe 삽입 dong_won.lee
				if("snsIframe".indexOf($('div.connect_wrap >div.sns-wrap > iframe').attr('id'))==-1){
					 $('div.connect_wrap >div.sns-wrap').append('<iframe src="" id="snsIframe" width="100%" height="40" frameborder="0" scrolling="no"></iframe>'); 
			    }	
				var goUrl = returnURL.indexOf("http://") < 0 ? "http://" + DOMAIN + returnURL : returnURL;
				//$("#snsIframe", $loginLayerPopup).attr("src", "http://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/sns/login?goUrl=" + encodeURIComponent(goUrl));
			}
		}

		// 쿠키에 ID 저장
		function setRememberId(value, expiredays)
		{
			var today = new Date();
			today.setDate( today.getDate() + expiredays );
			document.cookie = "_common_saveEmail=" + encodeURIComponent( value ) + "; path=/; domain=.samsung.com; expires=" + today.toGMTString() + ";";
		}

		// 쿠키에 저장된 ID 가져오기
		function getRememberId()
		{
			// userid 쿠키에서 id 값을 가져온다.
			var cook = document.cookie + ";";
			var idx = cook.indexOf("_common_saveEmail", 0);
			var val = "";
			
			if(idx != -1)
			{
				cook = cook.substring(idx, cook.length);
				begin = cook.indexOf("=", 0) + 1;
				end = cook.indexOf(";", begin);
				val = decodeURIComponent( cook.substring(begin, end) );
			}
			
			// 가져온 쿠키값이 있으면
			if(val != "")
			{
				$idInput.val(val);
				$rememberCheck.attr("checked", true);
			}
		}
		
		// sign 버튼 텍스트 처리
		function setSignButtonText(isLogedIn){
    
		    if (isLogedIn)
		    {
		        // Old Navi
		        if (IS_OLD_NAVI) {
		            $(userLoginBtn).filter("[data-button-type=1]")
		                        .contents()
		                        .filter(function(){return this.nodeType==3;})
		                        .remove().end().end()
		                        .append( LOGIN.msg.signBtnText2);
		            $(".nav").find(userLoginBtn + "[data-button-type=1]").attr("title", LOGIN.msg.signBtnText2);
		            $(".nav").find(userLoginBtn + "[data-button-type=1]>span").attr("class", "icon-signout");
		            $(userLoginBtn + "[data-button-type=1]>span").attr("class", "icon-signout");
		        } else {
		        // New Navi
		            $(userLoginBtn + "[data-button-type=1]").attr("title", LOGIN.msg.signBtnText2);
		            $(userLoginBtn + "[data-button-type=1]").find(".login-txt").text(LOGIN.msg.signBtnText2);
		            $(userLoginBtn).addClass('is-login');
		        }
		        
		        // gnb util 로그인 텍스트형 버튼 처리
		        if (SITE_CD === 'sec')
		            $('#utillogin').text(LOGIN.msg.signBtnText2);
				
				//AU hybris6.0
				if (isAemGnb && USE_ESTORE) { //[JY]PE login(rb)
		         	$(userLoginBtn).off('click');
		         	$(userLoginBtn).css('display', 'none');
		         	$sMyMenu.css('display', 'block');
		        }
		    }
		    else
		    {
		        // Old Navi
		        if (IS_OLD_NAVI) {
		            $(userLoginBtn).filter("[data-button-type=1]")
		                        .contents()
		                        .filter(function(){return this.nodeType==3;})
		                        .remove().end().end()
		                        .append( LOGIN.msg.signBtnText1);
		            $(".nav").find(userLoginBtn + "[data-button-type=1]").attr("title", LOGIN.msg.signBtnText1);
		            $(".nav").find(userLoginBtn + "[data-button-type=1]>span").attr("class", "icon-signin");
		        } else {
		        // New Navi
		            $(userLoginBtn + "[data-button-type=1]").attr("title", LOGIN.msg.signBtnText1);
		            $(userLoginBtn + "[data-button-type=1]").find(".login-txt").text(LOGIN.msg.signBtnText1 );
		            $(userLoginBtn).removeClass('is-login');
		        }
		        
		        // gnb util 로그인 텍스트형 버튼 처리
		        if (SITE_CD == 'sec')
		            $('#utillogin').text(LOGIN.msg.signBtnText1);
		    }
		}
		
		// wishlist 동기화 - 로그인 시에 쿠키에 쌓아뒀던 wishlist 를 사용자 정보에 넣어줘야함
		// addWishlist가 완료 되어야 제대로 getWishlist를 할 수 있음
		function syncWishlist() {
			var wishlist = $.cookies.getWishList();
		    var wishlistIndex = 0;
		    
		    function addWishListCallback(data)
	    	{
		    	
		    	if (wishlistIndex < wishlist.length)
		    	{
		    		estore.addWishListItemForce({
			    		'productCode' : wishlist[wishlistIndex]
			    	}, addWishListCallback);
		    		
		    		wishlistIndex++;
		    	}
		    	else
	    		{
		    		$.cookies.deleteWishList();
		    		
		    		// sign complete
					if ($.EstoreIfQueue)
						$.EstoreIfQueue.setIsSignReady(true);
	    		}
	    		
	    	}
		    
		    if (wishlist.length > 0)
		    {
		    	addWishListCallback();
		    }
		    else
		    {
		    	// sign complete
				if ($.EstoreIfQueue)
					$.EstoreIfQueue.setIsSignReady(true);
		    }
		}
		
		// 레이어 팝업 닫기
		function closeLayer() {
			$(".layer_popup").hide();
			$dimContainer.empty();
			
			if (closeReturnFocusElem)
			{
				closeReturnFocusElem.focus();
				closeReturnFocusElem = null;
			}
		}
		
		// 레이어 팝업 띄우기
		// param : noAccessType - 자격 제한 타입
		function popupLayer(noAccessType) {
			
			// 자격 제한 타입이면 일반 메시지 팝업
			if (noAccessType)
			{
				var title = LOGIN.msg.errorTitleText;	// 메시지 팝업의 title text
				var description = "";		// 메시지 팝업의 description text
				switch(noAccessType)
				{
					case "DW":	// 임의 탈퇴
					case "AW":	// 직권 탈퇴
					case "WP":	// 탈퇴 처리중
						description = LOGIN.msg.errorText1;
						break;
					case "BA":	// 자격 정지
						description = LOGIN.msg.errorText2;
						break;
					case "UK":	// UnKnown
						description = LOGIN.msg.errorText3;
						break;
						
					case "ES":	// estore shutdown
						description = LOGIN.msg.errorText4;
						break;
				}
				
				$showLayer = $confirmPopup;
				
				//팝업 레이어 태그 삽입 dong_won.lee
				if ("pop-tit".indexOf($('#confirmPopup >div> div.popup_wrap').find('h2').attr('class'))==-1) {
					$confirmPopup.append('<h2 class="pop-tit">');
					$confirmPopup.append('<p class="msg-text tc">');
				}
				
				$(".pop-tit", $confirmPopup).text(title);
				$(".msg-text", $confirmPopup).text(description);
			}
			
			// 다른 레이어 팝업 hide
			ss.Popover.hideActive(ss.Popover.activePopover);
			
			$(".layer_popup").hide();
			
			if ($showLayer)
			{
				$dimContainer.empty();
				$dimContainer.append('<div class="lightbox-skrim" style="display : block;"></div>');
				
				$showLayer.show();
				
				document.getElementById($showLayer.children("div").attr("id")).popAlign();
				
			}
			
		}
		
		// 정책 동의 업데이트
		function updateAgreePolicy()
		{
			var  setAgreeStorePolicyUrl='';
			
			//AU hybris6.0
			if (SITE_CD == 'au') {
				setAgreeStorePolicyUrl = "https://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/p4v1/agreeStorePolicy?receiveEmail=" + receiveEmailChecked;
			}else if (SITE_CD == 'de' || SITE_CD == 'fr' || SITE_CD == 'nl' || SITE_CD == 'be' || SITE_CD == 'be_fr') { //DE hybris6.0  //FR Hybris 6.0
				setAgreeStorePolicyUrl = "https://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/p4v1/agreeStorePolicy?receiveEmail=" + receiveEmailChecked;
			}else {
				setAgreeStorePolicyUrl = "http://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/p4v1/setAgreeStorePolicy?receiveEmail=" + receiveEmailChecked;
			}
			
			$.ajax({
		        url: setAgreeStorePolicyUrl,
		        type: 'GET',
		        dataType : "jsonp",
		        jsonp : "callback",
		        beforeSend: function () {
		        },
		        success: function (data) {
		        	closeLayer();
		        	
		        	if (data.resultCode == "0000")
		        	{
						if (SITE_CD=='sec') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '36');
	        			$showLayer = $preferencePopup;
	        			
	        			popupLayer();
		        	}
		        },
		        error:function(jqXHR, textStatus, errorThrown){
					if (SITE_CD=='sec') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '37');
		        	console.error(textStatus);
		        }   
		    });
		}
		
		// 로그인 팝업 띄우기
		ss.Auth.popupLoginLayer = function()
		{
			if (!USE_ESTORE)
				return;
			

			//최초 로딩시 snsiframe 삽입 dong_won.lee
		     if("snsIframe".indexOf($('div.connect_wrap >div.sns-wrap > iframe').attr('id'))==-1){
			    $('div.connect_wrap >div.sns-wrap').append('<iframe src="" id="snsIframe" width="100%" height="40" frameborder="0" scrolling="no"></iframe>'); 
			 }	

			var goUrl = returnURL.indexOf("http://") < 0 ? "http://" + DOMAIN + returnURL : returnURL;
			//var afterURL = location.protocol + "//" + STORE_DOMAIN + "/" + SITE_CD + "/ng/sns/login?goUrl=" + encodeURIComponent(goUrl);
			
			// 2014.05.13 로그인 팝업 띄울 시 메뉴 닫기
			if (navigation)
				navigation.clearNav();
			
			// 다른 레이어 팝업 hide
			ss.Popover.hideActive(ss.Popover.activePopover);
			
			$(".layer_popup").hide();
			
			// url에 #이 들어가면 iframe load 이벤트가 발생 안함
			var isInnerLinkPage = false;
			if (location.href.indexOf("#") > -1)
				isInnerLinkPage = true;
			
			// iframe 로드 후 팝업 띄우기
			/*if (beforeStoreIframeSrc != afterURL && !isInnerLinkPage)
			{
				$("#snsIframe", $loginLayerPopup).load(function() {
					$("#snsIframe", $loginLayerPopup).unbind("load");
					
					beforeStoreIframeSrc = afterURL;
					
					try {
						// estoreLive = $("#snsIframe")[0].contentWindow.document.getElementById("snsloginForm");	// todo
						estoreLive = $("#snsIframe")[0].contentWindow.document;
						if (!estoreLive)
						{
							$(".connect_wrap", $loginLayerPopup).hide();
						}
						else
						{
							$(".connect_wrap", $loginLayerPopup).show();
						}
						
					} catch (e) {
						console.log(e);
						
						estoreLive = false;
						$(".connect_wrap", $loginLayerPopup).hide();
					}
					
					$loginLayerPopup.show();
					
					$showLayer = $loginLayerPopup;
					
					document.getElementById($showLayer.children("div").attr("id")).popAlign();
					
					// 모바일이 아닐 때만 포커스
					if (!ss.metrics.isMobile())
						$idInput.focus();
				});
				
				inputInit(true);
				getRememberId();
			}
			else
			{*/
				if (isInnerLinkPage)
					inputInit(true);
				else
					inputInit();
				
				getRememberId();
				
				$loginLayerPopup.show();
				
				$showLayer = $loginLayerPopup;
				
				document.getElementById($showLayer.children("div").attr("id")).popAlign();
				
				// 모바일이 아닐 때만 포커스
				if (!ss.metrics.isMobile())
					$idInput.focus();
			//}
			
			$dimContainer.empty();
			$dimContainer.append('<div class="lightbox-skrim" style="display : block;"></div>');
			
		};
		
		// 로그인 체크
		// param : callback 로그인 체크 후 호출 될 함수
		// param : validate 쿠키 값이 있는지만 체크할 지, 쿠키 값이 유효한 것인지 까지 체크할지 여부 (true / false)
		//         true 일 경우 스토어 or SA로 유효한지 체크
		// param : popupLogin 로그인이 안되있으면 로그인 팝업 띄울지 여부 (true / false)
		ss.Auth.checkSignIn = function(callback, validate, popupLogin) {
			
			var isLogedIn = false;
				
			// 토큰 값이 있을 경우 로그인 되었다고 판단해서 아이콘의 text 변경
			var token = $.cookies.get("iPlanetDirectoryPro", {domain : ".samsung.com"});
			var snsToken = $.cookies.get("snsSessionId", {domain : ".samsung.com"});
			
			// 토큰 값이 있을 경우에만 로그인 체크
			if (token || snsToken)
			{
				if (validate)
				{
					if (SITE_CD != 'sec')
					{
						var checkLocalMemberState = function(isLogedIn) {
							if (!isLogedIn)
								return;
							
							$.ajax({
						        url: SEC_LOCAL_URL_CHECKMEMBERSTATE,
						        type: 'GET',
						        dataType : "jsonp",
						        jsonp : "callback",
						        success: function (data) {
						        	var checked = data.checked;
						        	if (!checked) {
						        		location.assign(SEC_LOCAL_URL_SIGNIN+"?returnURL="+location.href);
						        	}
						        },
						        error:function(jqXHR, textStatus, errorThrown){
						        	throw errorThrown;
						        }   
						    });
						};
					}
					
					// 스토어 연계 사이트
					if (USE_ESTORE)
					{
						var sessionCheckUrl='';
						
						//AU hybris6.0
						if (SITE_CD == 'au') {
							sessionCheckUrl = "https://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/p4v1/sessionCheck";
						}else if (SITE_CD == 'de' || SITE_CD == 'fr' || SITE_CD == 'nl' || SITE_CD == 'be' || SITE_CD == 'be_fr') { //DE Hybris 6.0  //FR Hybris 6.0
							sessionCheckUrl = "https://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/p4v1/sessionCheck";
						}else {
							sessionCheckUrl = "https://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/p4v1/getSessionCheck";
						}
						
						$.ajax({
					        url: sessionCheckUrl,
					        type: 'GET',
					        dataType : "jsonp",
					        jsonp : "callback",
					        beforeSend: function () {
					        },
					        success: function (data) {
					        	if (callback && typeof(callback) == "function" )
								{
					        		var isLogedIn = data.resultCode == "0000" ? true : false;
					        		
				        			// 스토어에서 로그인 실패면 로그아웃 처리
				        			if (isLogedIn == false)
				        			{
				        				signOut();
				        				
				        				if (popupLogin)
				        					ss.Auth.popupLoginLayer();
				        			}
				        			callback(isLogedIn);
				        		
								}
					        },
					        error:function(jqXHR, textStatus, errorThrown){
					        	
					        }   
					    });
					}
					else
					{
						// 스토어를 안쓰는 사이트
						$.ajax({
							url : "/"  + SITE_CD + "/data-login/checkLogin",
							type : "post",
							success: function(data){
								if (callback && typeof(callback) == "function" )
								{
									isLogedIn = data.result;
									
									if (isLogedIn == false)
									{
										signOut();
									}
									
									callback(isLogedIn);
									
									if (popupLogin && !isLogedIn)
										ss.Auth.popupLoginLayer();
								}
							},
							error : function() {
								signOut();
								
								callback(false);
								
								if (popupLogin)
									ss.Auth.popupLoginLayer();
							}
						});
						
					}	// end USE_STORE
				}
				else
				{
					// 쿠키 있는지만 체크 하기 때문에 
					isLogedIn = true;
					
					if (callback && typeof(callback) == "function" )
					{
						callback(isLogedIn);
						
						if (popupLogin && !isLogedIn)
							ss.Auth.popupLoginLayer();
					}
					
				}	// end validate
			}
			else
			{
				if (callback && typeof(callback) == "function" )
				{
					callback(isLogedIn);
					
					if (popupLogin && !isLogedIn)
						ss.Auth.popupLoginLayer();
				}
				
				setSignButtonText(false);
				
			}	// end token || snsToken
			
		};
		
		// 유저 정보 가져오기
		// param : callback 유저 정보 가져온 후 호출 될 함수
		ss.Auth.getUserProfile = function(callback) {
			
			if (!userData)
			{
				var token = $.cookies.get("iPlanetDirectoryPro", {domain:".samsung.com"});
				var snsToken = $.cookies.get("snsSessionId", {domain : ".samsung.com"});
				
				if (!token && snsToken)
				{
					// snsToken 만 있을 경우
					
					$.ajax({
				        url: "http://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/p4v1/getSnsUserInfo?snsSessionId=" + snsToken,
				        type: 'GET',
				        dataType : "jsonp",
				        jsonp : "callback",
				        beforeSend: function () {
				        },
				        success: function (data) {
				        	if (data)
				        	{
				        		userData = {
			        				'firstName' : data.firstName,
			        				'lastName'	: data.lastName,
			        				'emailID'	: data.email
				        		};
				        	}
				        	else
				        		userData = null;
				        	
				        	if (callback && typeof(callback) == "function" )
							{
								callback(userData);
							}
				        	
				        },
				        error:function(jqXHR, textStatus, errorThrown){
				        	console.error(textStatus);
				        }   
				    });
				}
				else
				{
					function getUserInfo() {
						
						$.ajax({
							url : "https://" + DOMAIN + "/"  + SITE_CD + "/data-login/getUserProfile",
							type : "post",
							dataType : "jsonp",
							success: function(data){
								if (data)
								{
									userData = {
											'firstName' : data.userBaseVO.userBaseIndividualVO.givenName,
											'lastName'	: data.userBaseVO.userBaseIndividualVO.familyName,
											'emailID'	: data.userIdentificationVO.loginID
									};
									//AU Hybris 6.0  //DE Hybris 6.0  //FR Hybris 6.0
									//if (SITE_CD == 'au' || SITE_CD == 'de' || SITE_CD == 'fr') {
									if (isAemGnb && USE_ESTORE) { //[JY]PE Login(rb)
										var firstName = data.userBaseVO.userBaseIndividualVO.givenName;
										var lastName = data.userBaseVO.userBaseIndividualVO.familyName;
										$.cookies.set("lastName", lastName, {domain : ".samsung.com"});
										$.cookies.set("firstName", firstName, {domain : ".samsung.com"});
										if (SITE_CD == 'sec') {
											$('.s-mymenu').find('.s-mymenu-name').text("안녕하세요. ").append($('<strong/>', { text: lastName + firstName +"님." }));
										} else {
											$('.s-mymenu').find('.s-mymenu-name').text("Hi, ").append($('<strong/>', { text: firstName + " " + lastName }));
										}
									}
								}
								else {
									userData = null;
									//AU Hybris 6.0  //DE Hybris 6.0  //FR Hybris 6.0
									//if (SITE_CD == 'au' || SITE_CD == 'de' || SITE_CD == 'fr') {
									if (isAemGnb && USE_ESTORE) { //[JY]PE Login(rb)
										$('.s-mymenu').find('.s-mymenu-name').text("Hi, ");
									}
								}
								
								if (callback && typeof(callback) == "function" )
								{
									callback(userData);
								}
							},
							error : function() {
								//AU Hybris 6.0  //DE Hybris 6.0  //FR Hybris 6.0
								//if (SITE_CD == 'au' || SITE_CD == 'de' || SITE_CD == 'fr') {
								if (isAemGnb && USE_ESTORE) { //[JY]PE Login(rb)
									$('.s-mymenu').find('.s-mymenu-name').text("Hi, ");
								}
							}
						});
						
					}
					
					// 2014.03.23 - ESTORE 연계 사이트일 경우 스토어 로그인이 완료 된 후 SA에 요청
					if (USE_ESTORE)
					{
						ss.EstoreIfQueue.setQueue(getUserInfo);
					}
					else
					{
						getUserInfo();
					}
					
					
				}
			}
			else
			{
				if (callback && typeof(callback) == "function" )
				{
					callback(userData);
				}
			}
		};
		
		// 스토어 쪽에서 에러코드 반환시 로그아웃 처리
		// 2014.02.21 무조건 스토어에 로그아웃 요청
		ss.Auth.signOut = function(goUrl)
		{
			if (!goUrl)
				returnURL = window.location.href;
			else
				returnURL = goUrl;

			deleteSignCookie();
			
			if (USE_ESTORE && estoreLive){ //[JY]PE Login(rb)
				if(SITE_CD == 'sec'){
					location.href = "https://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/logout?goUrl=";
				//AU hybris6.0  //DE Hybris 6.0  //FR Hybris 6.0
				} else if (SITE_CD == 'au' || SITE_CD == 'de' || SITE_CD == 'fr' || SITE_CD =='nl' || SITE_CD == 'be' || SITE_CD == 'be_fr'){ //[JY]PE Login(rb)
					
					/* this is for static html file */
					if (document.URL.indexOf('stgweb4') > -1) {
						DOMAIN = 'stgweb4.samsung.com';
					} else if (document.URL.indexOf('preview4') > -1) {
						DOMAIN = 'preview4.samsung.com';
					} else {
						DOMAIN = 'www.samsung.com';
					}
					
					$.ajax({
						url: "http://" + DOMAIN + "/" + SITE_CD + "/data-login/signoutToSA",
						type: 'post',
						async: 'false',
						dataType : "jsonp",
						jsonp : "callback",
						success: function (data) {
							console.log("logout completed");
							if (data == true) {
								deleteSACookie();
								window.location.replace("http://" + DOMAIN + "/" + SITE_CD + "/home");
							}
						},
			    		error:function(jqXHR, textStatus, errorThrown){
			    			console.error(textStatus);
			    			deleteSACookie();
							window.location.replace("http://" + DOMAIN + "/" + SITE_CD + "/home");
			    		}
			    	});
					setMyMenu(false);
				} else{
					if (SITE_CD == 'uk' || SITE_CD == 'se' || SITE_CD == 'dk' /*|| SITE_CD == 'fi' || SITE_CD == 'no'*/) { //[JY] SENA (jusuk)
						location.href = "https://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/logout?goUrl=" + encodeURIComponent(returnURL);
					} else {
						location.href = "http://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/logout?goUrl=" + encodeURIComponent(returnURL);
					}
				}
			}else{
				location.href = returnURL;
			}
			
			returnURL = false;
			
			userData = null;
		};
		
		// Cart Count 호출
		ss.Auth.getGlobalCartCount = function(callback) {
			
			if (!USE_ESTORE || $.cookies.get("estoreLoginRequesting", {domain : ".samsung.com"}) == "Y") {
				//aeseul.kim
				if(SITE_CD == 'sec' && $('#globalCartCount').text() == "...") {
					console.log("globalCartCount test");
					$('#globalCartCount').text( "0" );
				}
				return;
			}
			
			// Set Cart Count
			function setGlobalCartCount( result ) {
				if (isAemGnb) {
					var $chkCartBtn = $('#ss_cart > button');
					var chkStateInterval = setInterval(function () {
						if ($chkCartBtn.hasClass('js-check-ready')) {
							clearInterval(chkStateInterval);
							chkCHangeCartState();
						}
					}, 1000);

					var chkCHangeCartState = function () {
						gnbObj = window.smg.aem.common.gnb;
						if (result) {
							if (result.resultCode == '0000') {
								if(result.cartCount == 0) {
									gnbObj.changeCartState(true);
								} else {
									gnbObj.changeCartState(false);
									$('#globalCartCount').text(result.cartCount );
								}
							} else {
								gnbObj.changeCartState(true);
							}
						} else {
							gnbObj.changeCartState(true);
						}

						if (callback && typeof(callback) == "function" ) {
							callback(result);
						}
					}
				} else {
					if( result ) {
						if (result.resultCode == '0000') {
							$('#globalCartCount').text( result.cartCount );
						} else {
							$('#globalCartCount').text( "0" );
						}
					} else {
						$('#globalCartCount').text( "0" );
					}
				
					if (callback && typeof(callback) == "function" )
					{
						callback(result);
					}
				}

			
				/*
				if( result ) {
					if (result.resultCode == '0000') {
						//AU Hybris 6.0  //DE Hybris 6.0  //FR Hybris 6.0
						if (isAemGnb && window.smg.aem) {
							if(result.cartCount == 0) {
								smg.aem.common.gnb.changeCartState(true);
							}
							else {
								smg.aem.common.gnb.changeCartState(false);
								$('#globalCartCount').text(result.cartCount );
							}
						} else {
							$('#globalCartCount').text( result.cartCount );
						}
					}
					else
					{
						//AU Hybris 6.0  //DE Hybris 6.0  //FR Hybris 6.0
						if (isAemGnb && window.smg.aem) {
							smg.aem.common.gnb.changeCartState(true);
						} else {
							$('#globalCartCount').text( "0" );
						}
					}
				}
				else
				{
					//AU Hybris 6.0  //DE Hybris 6.0  //FR Hybris 6.0
					if (isAemGnb && window.smg.aem) {
						smg.aem.common.gnb.changeCartState(true);
					} else {
						$('#globalCartCount').text( "0" );
					}
				}
				
				if (callback && typeof(callback) == "function" )
				{
					callback(result);
				}
				*/
			}
			
			// 비로그인 시에 everAddCart cookie 값이 있을 경우에만 호출
			ss.Auth.checkSignIn(function(isLogedIn) {
				
				if (isLogedIn)
				{
				     if(SITE_CD == 'sec'){
				    	 var url = 'http://' + STORE_DOMAIN + '/sec/ng/p4v1/deleteBuyNowCookie';
				    	 $.ajax({
				    		 url: url,
				    		 type: 'GET',
				    		 dataType : 'jsonp',
				    		 jsonp : 'callback',
				    		 success  : function (data) {
				    			 estore.getCartCount( setGlobalCartCount );
				    		 },
				    		 error:function(jqXHR, textStatus, errorThrown){
				    			 console.error(textStatus);
				    		 }
				    	 });
				     }else{
				    	 estore.getCartCount( setGlobalCartCount );
				     }
			    }
			    else
			    {
			    	var addCartCookie = ss.cookies.get("everAddCart", {domain:".samsung.com"});
					if(SITE_CD == 'br' || SITE_CD == 'au' || SITE_CD == 'de' || SITE_CD == 'fr' || SITE_CD == 'nl' || SITE_CD == 'be' || SITE_CD == 'be_fr'){ //AU Hybris 6.0  //DE Hybris 6.0  //FR Hybris 6.0
						addCartCookie = "Y";
					}
			    	if (addCartCookie == "Y")
			    	{
			    		if(SITE_CD == 'sec'){
			    			var url = 'http://' + STORE_DOMAIN + '/sec/ng/p4v1/deleteBuyNowCookie';
					       $.ajax({
						        url: url,
						        type: 'GET',
						        dataType : 'jsonp',
						        jsonp : 'callback',
						        success  : function (data) {
						        	estore.getCartCount( setGlobalCartCount );
						        },
						        error:function(jqXHR, textStatus, errorThrown){
						        	console.error(textStatus);
						        }
					       });
			    		}else{
			    			estore.getCartCount( setGlobalCartCount );
			    		}
			     }
			     else
			     {
			    	 $('#globalCartCount').text( "0" );
			     }
			    }
			});

			//aeseul.kim
			if(SITE_CD == 'sec' && $('#globalCartCount').text() == "...") {
				
				$('#globalCartCount').text( "0" );
			}
		};
		
		ss.Auth.setReturnURL = function(returnURL) {
			if (!returnURL)
				returnURL = window.location.href;
			
			//$(userLoginBtn).filter("[data-button-type=1]").attr("data-return-url", returnURL);
		};
				
		// 엘리먼트 등록
		function setElement()
		{
			$loginForm = $( "#loginForm" );				// 로그인 폼
			$joinForm = $( "#joinForm" );				// 회원가입 폼
			$findAccountForm = $( "#findAccountForm" );	// find account 폼
			
			$loginLayerPopup = $( "#loginLayerPopup" );	// layer 팝업
			
			$idInput = $( "#E-mail" );			// ID input
			$pwInput = $( "#pw" );				// PW input
			$rememberCheck = $( "#acceptRemember" );	// ID 기억 체크박스
			$rememberCheckLabel = $("label[for='acceptRemember']", "#loginLayerPopup");	// ID 기억 체크박스 Label
			
			$errorIdText = $("#errorId");	// ID error message
			$errorPwText = $("#errorPw");	// PW error message
			
			$signInBtn = $( ".sign-in-btn" );				// 로그인 버튼
			$signUpBtn = $( ".sign-up-btn" );				// 회원가입 버튼
			$findAccountBtn = $( ".find-account-btn" );		// Find Account 버튼
			
			$signToggleArrow = $('#signToggleArrow');		// social sign in? 토글 버튼
			
			$loginCloseBtn = $(".login-close-btn");			// 닫기 버튼
			$loginLeaveBtn = $(".login-leave-btn");			// 닫기 버튼(클릭 시 로그아웃)
			
			$dimContainer = $("#dimContainer");				// dim container
			
			$storeLoginCheckIframe = $("#storeLoginCheckIframe");	// store hidden iframe
			
			/* 팝업 */
			$privacyPopup = $( "#privacyPopup" );			// privacyPopup
			$preferencePopup = $( "#preferencePopup" ); 	// preferencePopup
			$confirmPopup = $( "#confirmPopup");			// confirmPopup
			
			$privacyBtn = $( "#privacyBtn", $privacyPopup );					// privacy popup YES button
			$privacyCheck1 = $( "#privacy-terms", $privacyPopup );				// privacy popup check1
			$privacyCheck2 = $( "#privacy-terms2", $privacyPopup );				// privacy popup check2
			$errorPrivacy = $( "#errorPrivacy", $privacyPopup);					// privacy popup error text
			$preferenceCheckBtn = $( "#preferenceCheckBtn", $preferencePopup );	// preference popup OK button
			
			/* iframe */
			//$storeLoginIframe = $( "#storeLoginIframe" );	// storeLoginIframe
		}
		
		// 이벤트 등록
		function setEvent()
		{
			// 로그인 버튼 클릭
			$signInBtn.click(function() {
				signIn();
			});
			
			// 회원가입 버튼 클릭
			$signUpBtn.click(function() {
				signUp();
			});
			
			// find account 버튼 클릭
			$findAccountBtn.click(function() {
				findAccount();
			});
			
			// 닫기 버튼 클릭
			$loginCloseBtn.click(function(){
				closeLayer();
				return false;
			});
			
			// 닫기 버튼 클릭(로그아웃)
			$loginLeaveBtn.click(function(){
				
				ss.Auth.signOut();
				
				return false;
			});
			
			// 사용자 sign in button 클릭  
			$( document ).on("click", userLoginBtn, function(event) {
				var _self = this;
				
				closeReturnFocusElem = $(_self);
				
				var currUrl = location.href;
				var url = $(_self).attr("data-return-url");	// 버튼에 명시된 return url
				if (url != null && url != "") {
					if (currUrl && currUrl.indexOf('stgweb4') > -1) { 
						if (url.indexOf('store.samsung.com') > -1) {
							returnURL = url.replace('store.samsung.com','stg-kr.shop.samsung.com');
						} else if (url.indexOf('shop.samsung.com') > -1) {
							returnURL = url.replace('shop.samsung.com','stg-kr.shop.samsung.com');
						} else {
							returnURL = url;
						}
					} else {
						returnURL = url;
					}
				}
				else {
					returnURL = window.location.href;		// 명시된 url 없을 시 현재 페이지로 return
				}
				
				// JY boan (rollback)
				//returnURL = window.location.href;
				
				var buttonType = $(_self).attr("data-button-type");	// "1", "2"
				
				// 로그인 체크 후 호출 
				// param : isLogedIn - 로그인 유효성 체크 후 결과
				function callback(isLogedIn)
				{
					
					if (isLogedIn == false)
					{
						if (buttonType == "1")
						{
						   if (IS_OLD_NAVI) {
						     // omniture - sign in 클릭
						     sendClickCode('gnb', 'sign in');
						   }
						}
						// 모바일 Navi 가 열려있으면 닫음
						$('body').removeClass('nav-open');
						
						//if (SITE_CD == 'sec' || SITE_CD == 'se' || SITE_CD == 'au' || SITE_CD == 'nz' || SITE_CD == 'es' || SITE_CD == 'it' || SITE_CD == 'nl' || SITE_CD == 'be' || SITE_CD == 'be_fr') { //loginTest
						if (SITE_CD == 'br') {
							//window.location.replace('https://' + STORE_DOMAIN + '/br/login?next=/br/account');
							window.open('https://' + STORE_DOMAIN + '/br/login?next=/br/account', '_blank');
						}else if (USE_ESTORE && SITE_CD != 'ru') { //[JY]PE Login(rb)
							if(ss.Detect().device != "desktop") { // desktop이 아니면 mobile check.do 로 호출
								$("#loginForm").attr("action","https://account.samsung.com/mobile/account/check.do");
							} else {
								$("#loginForm").attr("action","https://account.samsung.com/account/check.do");
							}
							if (!returnURL)
								returnURL = window.location.href;
							$("#returnURL", $loginForm).val( encodeURIComponent(returnURL) );
							$loginForm.submit();
							returnURL = false;
						} else {
							ss.Auth.popupLoginLayer(buttonType);
						}
					}
					else
					{
						if (buttonType == "1")
						{
							ss.Auth.signOut(returnURL);
						}
						else
						{
							window.location.href = returnURL;
						}
					}
				}
				
				// 로그인 체크
				ss.Auth.checkSignIn(callback);
					
				return false;
			});
			
			// input text focus in(id / password)
			$(".sign_input").focusin(function() {
				switch ( $(this).attr("id") )
				{
					case $idInput.attr("id"):
						$errorIdText.hide();
						break;
					case $pwInput.attr("id"):
						$errorPwText.hide();
						break;
				}
				
			});
			
			// input text keypress (id / password)
			$(".sign_input").unbind('keydown').bind('keydown', function(e){
				
				if (e.keyCode == "13")
				{
					e.preventDefault();
					
					switch ( $(this).attr("id") )
					{
						case $idInput.attr("id"):
						case $pwInput.attr("id"):
							signIn();
							break;
					}
				}
				
			});
			
			$rememberCheck.focusin(function(e) {
				e.preventDefault();
				
				$rememberCheckLabel.addClass("fs-boarder");

				// web accessibility (ie focus bug fix - j_m.lee )
				$rememberCheck.on('keydown', function(e) {
					if(e.keyCode==32) {
						if($rememberCheck.is(":checked")) $rememberCheck.attr("checked", false);
						else $rememberCheck.attr("checked", true);			
					}
				});

			});
			
			$rememberCheck.focusout(function(e) {
				e.preventDefault();
				
				$rememberCheckLabel.removeClass();
			});
			
			// privacy popup YES button click
			$privacyBtn.click(function() {
				var privacyChecked = $privacyCheck1.is(":checked");
				
				if (!privacyChecked)
				{
					$errorPrivacy.show();
					return false;
				}
				
				// omniture - 계정등록 완료 후 최초로그인시 팝업에서 proceed 클릭 시
				sendClickCode('account','account:email verification');
				
				receiveEmailChecked = $privacyCheck2.is(":checked");
				
				if (policyCheckSite == false)
        		{
					updateAgreePolicy();
        		}
				else
				{
					//cookie set
	        		$.cookies.set('shopPrivacyPolicyAgreeYN','Y',{domain:".samsung.com"});
					init();
				}
			});
			
			// privacy policy checkbox change 
			$privacyCheck1.change(function() {
				$errorPrivacy.hide();
			});
			
			// preference popup OK button click
			$preferenceCheckBtn.click(function() {
				//window.location.href = "http://" + DOMAIN + "/" + SITE_CD + "/estore/mysamsung/updatemyprofile/";
				window.location.href = "http://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/my-samsung/updatemyprofile";
			});
			
			$signToggleArrow.click(function() {
				$('.icon-down-arrow', $loginLayerPopup).toggleClass('icon-up-arrow');
			});
		}
		
		// 초기화
		function init()
		{
			//$("#storeLoginIframe").remove();
			
			// 토큰 값이 있을 경우 로그인 되었다고 판단해서 아이콘의 text 변경
			var token = $.cookies.get("iPlanetDirectoryPro", {domain:".samsung.com"});
			var snsSessionId = $.cookies.get("snsSessionId", {domain : ".samsung.com"});
			
			// estoreLoginRequesting 쿠키 값이 있으면 로그인 요청
			var estoreLoginRequesting = $.cookies.get("estoreLoginRequesting", {domain : ".samsung.com"}) == "Y" ? true : false;
			
			// 토큰 값이 있을 경우에만 로그인 체크
			if (token)
			{
				if (USE_ESTORE) //[JY]PE Login(rb)
				{
					var exceptionReferrerDomain = false;
					if (!estoreLoginRequesting)
					{
						var exceptionDomains = ["www.samsung.com", "origin2.samsung.com", "dev.samsung.com", "p4.samsung.com", "stgweb4.samsung.com", "ptcweb4.samsung.com",  
						                        "qa.shop.samsung.com", "stg-uk.shop.samsung.com", "stg-kr.shop.samsung.com", "stg-eu.shop.samsung,com", "stg.shop.samsung.com", "store.samsung.com", "shop.samsung.com",
						                        "local.dev.my.eu.samsung.com", "dev.my.eu.samsung.com", "stg.my.eu.samsung.com", "my.eu.samsung.com","www.eumysamsung.com","account.samsung.com", "local.sec.samsung.com"];
						for (var i = 0; i < exceptionDomains.length; i++)
						{
							if (document.referrer.indexOf(exceptionDomains[i]) > -1)
							{
								exceptionReferrerDomain = true;
								break;
							}
						}
						
						// ex) www.samsung.com/uk 로 접속 시 home으로 리다이렉팅 되어서 이전 페이지가 samsung.com 페이지가 되기 때문에 이 경우에 예외 처리
						if (exceptionReferrerDomain)
						{
							var dotcomSites = ["www.samsung.com", "dev.samsung.com", "p4.samsung.com", "stgweb4.samsung.com", "ptcweb4.samsung.com",
							                   "local.dev.my.eu.samsung.com", "dev.my.eu.samsung.com", "stg.my.eu.samsung.com", "my.eu.samsung.com","www.eumysamsung.com","account.samsung.com", "local.sec.samsung.com"];
							var refererPage = document.referrer.replace(/http(s)?:\/\//, "");
							
							for (var i = 0; i < dotcomSites.length; i++)
							{
								if (SITE_CD == 'es' || SITE_CD == 'se' || SITE_CD == 'dk' || SITE_CD == 'de' || SITE_CD == 'it' || SITE_CD == 'fr' || SITE_CD == 'nl' || SITE_CD == 'nz' || SITE_CD == 'sec' || SITE_CD == 'au' || SITE_CD == 'cn') { //[JY] SENA (rb)
								if(dotcomSites[i] == "account.samsung.com"){
									var indexPage = dotcomSites[i] + "/";
								}else{
									var indexPage = dotcomSites[i] + "/" + SITE_CD + "/";
								}
								
								//if (indexPage.indexOf(refererPage) > -1 && $.cookies.get("isStoreLogedIn") != "Y")
								if (refererPage.indexOf(indexPage) > -1 && $.cookies.get("isStoreLogedIn") != "Y")
								{
									exceptionReferrerDomain = false;
									break;
								}
							  }else{
							    var indexPage = dotcomSites[i] + "/" + SITE_CD + "/";
								
								if (indexPage.indexOf(refererPage) > -1 && $.cookies.get("isStoreLogedIn") != "Y")
								{
									exceptionReferrerDomain = false;
									break;
								}
							  }
							}
						}
					}
					
					// 외부에서 접속 시 스토어 로그인 요청
					if (!exceptionReferrerDomain)
					{
						
						// Store Login 후 콜백 함수
						nextGenLoginResult = function(data)
						{
							//var isLogedIn = data.resultCode == "0000" ? true : false;
							
						    // 자격 제한 유저
						    if (data.resultCode != "0000")
						    {
								// blacklist 일 경우
								if (data.resultCode == "903")
									popupLayer("BA");
								else
								{
									if (data.customerStatus)
										popupLayer(data.customerStatus);
									else
										popupLayer("UK");
								}
								
								// estoreLoginRequesting 쿠키 삭제
								deleteLoginRequestCookie();
								
								return;
						    }
						    
						    
						    // 처음 접속 유저
							//AU hybris6.0  //FR Hybris 6.0
						    if ((data.hasAddInfo == false && (SITE_CD == 'au' || SITE_CD == 'fr' || SITE_CD == 'nl' || SITE_CD == 'be' || SITE_CD == 'be_fr')) || (data.hasaddinfo == "N" && (SITE_CD != 'sec' && SITE_CD != 'cn' && SITE_CD != 'de')))
							//if (data.hasaddinfo == "N" && (SITE_CD != 'sec' && SITE_CD != 'cn' && SITE_CD != 'de'))
						    {
						    	if (policyCheckSite)
						    	{
						    		// 2014.06.13 스페인 요청으로 스토어 로그인 요청하기전 정책 동의 프로세스 변경
						    		updateAgreePolicy();
						    	}
						    	else
						    	{	
									console.log("처음 접속 유저");
						    		$showLayer = $privacyPopup;
						    		popupLayer();
						    	}
						    }
						    
						    setSignButtonText(true);
							
							//AU Hybris 6.0  //DE Hybris 6.0
							//if (SITE_CD == 'au' || SITE_CD == 'de')
							//	setMyMenu(false);
						    
						    // 해당 쿠키가 있으면 getCartCount 호출
						    if ($.cookies.get("estoreLoginRequesting", {domain : ".samsung.com"}) == "Y")
						    {
						    	// estoreLoginRequesting 쿠키 삭제
								deleteLoginRequestCookie();
								
						    	ss.Auth.getGlobalCartCount();
						    }
						    
						    // wishlist 동기화
						    syncWishlist();
						    
						    // index 페이지로 들어왔을 경우 store 로그인이 되어 있는지 판단 하기 위한 쿠키
						    $.cookies.set("isStoreLogedIn", "Y");
						    
						    //$("#storeLoginIframe").remove();
						};
						
						// 스토어 로그인 요청 중을 나타내는 쿠키 생성
						$.cookies.set("estoreLoginRequesting", "Y", {domain : ".samsung.com"});
						
						if (SITE_CD == 'sec' && location.protocol == 'https:') {
							console.log("SSO:sec(https) login start");
							$.ajax({
						        url: "https://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/p4v1/getSessionCheck",
						        type: 'GET',
						        dataType : "jsonp",
						        jsonp : "callback",
						        success: function (data) {
					        		var isLogedIn = data.resultCode == "0000" ? true : false;
					        		
				        			if (!isLogedIn) { // 스토어로그인 안되어 있을때
				        				sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '01');
				        				alert('로그인을 위해서 메인 페이지로 이동합니다. 로그인 하신 후 원하시는 페이지로 다시 이동하시기 바랍니다.');
				        				//location.assign('http://'+DOMAIN+'/sec/home');
										ss.Auth.signOut();
				        			} else { // 스토어로그인 되어 있을때
			        					nextGenLoginResult(data);
				        			}
						        },
						        error:function(jqXHR, textStatus, errorThrown){
						        	sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '02');
						        	estoreLive = false;
						        }
						    });
						//#1698:login remove
						} else if( SITE_CD == 'sec' || SITE_CD == 'es' || SITE_CD == 'de' || SITE_CD == 'it' || SITE_CD == 'fr' || SITE_CD == 'nl' || SITE_CD == 'nz' || SITE_CD == 'au' || SITE_CD == 'be' || SITE_CD == 'be_fr'){ //SE brandpath
							try {
								console.log("SSO:all login start");
								var sessionCheckUrl='';
								//AU hybris6.0
								if (SITE_CD == 'au') {
									sessionCheckUrl = "https://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/p4v1/sessionCheck";
								}else if(SITE_CD == 'de' || SITE_CD == 'fr' || SITE_CD == 'nl' || SITE_CD == 'be' || SITE_CD == 'be_fr') { //DE hybris6.0  //FR Hybris 6.0
									sessionCheckUrl = "https://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/p4v1/sessionCheck";
								}else {
									sessionCheckUrl = "https://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/p4v1/getSessionCheck";
								}
								
								$.ajax({
									url: sessionCheckUrl,
									type: 'GET',
									dataType : "jsonp",
									jsonp : "callback",
									success: function (data) {

			        					var isLogedIn = data.resultCode == "0000" ? true : false;
										var loginF = "N";

		        						if (!isLogedIn) { // 스토어로그인 안되어 있을때
		        							sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '28');
											console.log("all storelogin(SSO) failed");
											ss.Auth.signOut();
		        						} else { // 스토어로그인 되어 있을때
	        								nextGenLoginResult(data);
		        						}
									},
									error:function(jqXHR, textStatus, errorThrown){
										sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '29');
										console.log("스토어(all)로그인 ajax error");
					        			estoreLive = false;
									 }
								});
								
								if (!estoreLive && SITE_CD != 'sec')
								{
									ss.Auth.signOut();
									// 2014.04.17 스토어 요청으로 에러 팝업 삭제
									// popupLayer("ES");
								}
								
							} catch (e) {
								sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '29');
								console.log("스토어(all)로그인 ajax error");
								estoreLive = false;
								// 2014.04.17 스토어 요청으로 에러 팝업 삭제
								// popupLayer("ES");
							}
						} else if(SITE_CD == 'uk' || SITE_CD == 'se' || SITE_CD == 'dk' /*|| SITE_CD == 'fi' || SITE_CD == 'no'*/){ //[JY] SENA (jusuk)
							console.log("SSO:uk login start");
							estoreLive = true;
							var timeCount = 0;
							$.ajax({
								type: "GET",
								url: "https://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/p4v1/login",
								jsonp: "callback",
								dataType:"jsonp",
								success : function(result){
									$.ajax({
										url: "https://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/p4v1/getSessionCheck",
										type: 'GET',
										dataType : "jsonp",
										jsonp : "callback",
										success: function (data) {

				        					var isLogedIn = data.resultCode == "0000" ? true : false;
											var loginF = "N";
				        					timeCount ++;

			        						if (!isLogedIn) { // 스토어로그인 안되어 있을때
			        							sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '03');
												console.log("storelogin first load fail -------> 2sec wait");

												setTimeout( (function(data) {
													return function() {
														Time(data);
													};
												})(data) , 10000);
												
												function Time(data)
												{
												timeCount ++;
												console.log("Timer call : " + data.resultCode);
												
												$.ajax({
													url: "https://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/p4v1/getSessionCheck",
													type: 'GET',
													dataType : "jsonp",
													jsonp : "callback",
													success: function (data) {
														console.log("success result : " + data.resultCode);

														var isLogedIn = data.resultCode == "0000" ? true : false;
				        		
														if (!isLogedIn) { // 스토어로그인 안되어 있을때
															sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '04');
															console.log("login wating... : login flag : " + loginF);
															if(timeCount = 1 && loginF == "Y" ){
																loginF = "N";
																console.log("login fail-------> 5sec wait");
																setTimeout( (function(data) {
																	return function() {
																	Time(data);
																	};
																})(data) , 5000);
															}else if(loginF == "N"){
																//timeCount ++;
																/*console.log("login fail-------> 7sec wait");
																setTimeout( (function(data) {
																	return function() {
																	Time(data);
																	};
																})(data) , 15000);*/
																ss.Auth.signOut();

															}else{
																console.log("login fail-------> log out");
																ss.Auth.signOut();
															}
				
														} else { // 스토어로그인 되어 있을때
															console.log("storelogin final success!!");
															timeCount = 0;
															nextGenLoginResult(data);
														}
													},
													error:function(jqXHR, textStatus, errorThrown){
														sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '05');
														console.log("스토어(uk)로그인 ajax error");
														estoreLive = false;
													}
												});
											}

												//ss.Auth.signOut();
			        						} else { // 스토어로그인 되어 있을때
												timeCount = 0;
		        								nextGenLoginResult(data);
			        						}
									},
									error:function(jqXHR, textStatus, errorThrown){
										sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '05');
										console.log("스토어(uk)로그인 ajax error");
					        			estoreLive = false;
									 }
									});									
								},
								error : function(json){}
							});
							
						}else if(SITE_CD == 'cn'){ //#1698:login remove
						//}else if(SITE_CD == 'es' || SITE_CD == 'se' || SITE_CD == 'de' || SITE_CD == 'it' || SITE_CD == 'fr' || SITE_CD == 'nl' || SITE_CD == 'nz' || SITE_CD == 'cn'){
							$("body").append("<iframe id='storeLoginIframe' src='https://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/p4v1/login' style='display:block;width:0px;height:0px;border:none;'></iframe>");

							// 스토어 서버 살아 있는지 체크
							$("#storeLoginIframe").load(function() {
								$("#storeLoginIframe").unbind("load");
							
								try {
									console.log("SSO:not sec login start");
									document.getElementById("storeLoginIframe").contentWindow.postMessage('','*');
									var timeCount = 0;
									$.ajax({
										url: "https://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/p4v1/getSessionCheck",
										type: 'GET',
										dataType : "jsonp",
										jsonp : "callback",
										success: function (data) {
				        					var isLogedIn = data.resultCode == "0000" ? true : false;
											var loginF = "N";
				        					timeCount ++;
			        						if (!isLogedIn) { // 스토어로그인 안되어 있을때
			        							if (SITE_CD=='es') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '06');
			        							else if (SITE_CD=='se') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '09');
												else if (SITE_CD=='dk') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '09');
			        							else if (SITE_CD=='de') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '12');
			        							else if (SITE_CD=='it') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '15');
			        							else if (SITE_CD=='fr') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '18');
			        							else if (SITE_CD=='nl') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '21');
			        							else if (SITE_CD=='nz') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '24');
			        							else if (SITE_CD=='au') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '30');
		        								else if (SITE_CD=='cn') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '33');
			        							
												console.log("storelogin first load fail -------> 2sec wait");
												setTimeout( (function(data) {
													return function() {
														Time(data);
													};
												})(data) , 6000);
												function Time(data)
												{
													timeCount ++;
													console.log("Timer call : " + data.resultCode);
													$.ajax({
														url: "https://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/p4v1/getSessionCheck",
														type: 'GET',
														dataType : "jsonp",
														jsonp : "callback",
														success: function (data) {
															console.log("success result : " + data.resultCode);
															var isLogedIn = data.resultCode == "0000" ? true : false;
					        									loginF = "N";
																if (!isLogedIn) { // 스토어로그인 안되어 있을때
																	if (SITE_CD=='es') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '07');
								        							else if (SITE_CD=='se') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '10');
																	else if (SITE_CD=='dk') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '10');
								        							else if (SITE_CD=='de') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '13');
								        							else if (SITE_CD=='it') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '16');
								        							else if (SITE_CD=='fr') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '19');
								        							else if (SITE_CD=='nl') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '22');
								        							else if (SITE_CD=='nz') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '25');
								        							else if (SITE_CD=='au') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '31');
							        								else if (SITE_CD=='cn') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '34');
																	console.log("login wating... : login flag : " + loginF);
																	if(timeCount = 1 && loginF == "Y" ){
																		loginF = "N";
																		console.log("login fail-------> 5sec wait");
																		setTimeout( (function(data) {
																			timeCount = 2;
																			return function() {
																			Time(data);
																			};
																		})(data) , 5000);
																	}else if(loginF == "N"){
																		ss.Auth.signOut();
		
																	}else{
																		console.log("login fail-------> log out");
																		ss.Auth.signOut();
																	}
						
																} else { // 스토어로그인 되어 있을때
																	console.log("storelogin final success!!");
																	timeCount = 0;
																	nextGenLoginResult(data);
																}
														},
														error:function(jqXHR, textStatus, errorThrown){
															if (SITE_CD=='es') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '08');
						        							else if (SITE_CD=='se') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '11');
															else if (SITE_CD=='dk') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '11');
						        							else if (SITE_CD=='de') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '14');
						        							else if (SITE_CD=='it') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '17');
						        							else if (SITE_CD=='fr') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '20');
						        							else if (SITE_CD=='nl') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '23');
						        							else if (SITE_CD=='nz') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '26');
						        							else if (SITE_CD=='au') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '32');
					        								else if (SITE_CD=='cn') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '35');
															console.log("스토어로그인 ajax error");
															estoreLive = false;
														}
													});
												}
			        						} else { // 스토어로그인 되어 있을때
												timeCount = 0;
		        								nextGenLoginResult(data);
			        						}
										},
										error:function(jqXHR, textStatus, errorThrown){
											if (SITE_CD=='es') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '08');
		        							else if (SITE_CD=='se') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '11');
											else if (SITE_CD=='dk') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '11');
		        							else if (SITE_CD=='de') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '14');
		        							else if (SITE_CD=='it') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '17');
		        							else if (SITE_CD=='fr') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '20');
		        							else if (SITE_CD=='nl') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '23');
		        							else if (SITE_CD=='nz') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '26');
		        							else if (SITE_CD=='au') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '32');
	        								else if (SITE_CD=='cn') sendClickCode('account', 'login:samsung account|fail:' + new Date().format("yyyyMMddHHmm") + '35');
											console.log("스토어로그인 ajax error");
						        			estoreLive = false;
										}
									});
									
									if (!estoreLive)
									{
										ss.Auth.signOut();
										// 2014.04.17 스토어 요청으로 에러 팝업 삭제
										// popupLayer("ES");
									}
									
								} catch (e) {
									console.log(e);
									estoreLive = false;
									if (SITE_CD != 'sec'){
										ss.Auth.signOut();
									}
									// 2014.04.17 스토어 요청으로 에러 팝업 삭제
									// popupLayer("ES");
								}
							});
						}else{
							//무의미
							/*
							if(SITE_CD == 'pe') { //[JY]PE Login(jusuk)
								setSignButtonText(true);
								//$.cookies.set("isStoreLogedIn", "Y");
								
								// sign complete
								if ($.EstoreIfQueue)
									$.EstoreIfQueue.setIsSignReady(true);
							}
							*/
						}
					} // end !exceptionReferrerDomain
					else
					{
						setSignButtonText(true);
						
						// sign complete
						if ($.EstoreIfQueue)
							$.EstoreIfQueue.setIsSignReady(true);
					}
				} // end USE_ESTORE
				else
				{
					setSignButtonText(true);
				}
			} // end check token
			else if (snsSessionId) {
				setSignButtonText(true);
				
				// wishlist 동기화
				if (USE_ESTORE)
					syncWishlist();
				
			} // end check snsSessionId
			
			// getCartCount 호출
		    ss.Auth.getGlobalCartCount();
		
			//AU Hybris 6.0  //DE Hybris 6.0  //FR Hybris 6.0
			if (isAemGnb && USE_ESTORE) { 
				if (token)
					setMyMenu(true);
				else 
					setMyMenu(false);
			}
			
			var query = getQueryParams(document.location.search);
			
			// 자격 제한 유저
			if (query.customerStatus != null || query.isblock != null)
			{
				// blacklist 일 경우
				if (query.isblock && query.isblock == "true")
					popupLayer("BA");
				else
				{
					if (data.customerStatus)
						popupLayer(data.customerStatus);
					else
						popupLayer("UK");
				}
			}
			
		}
		
		// 2014.06.13 스페인 요청으로 스토어 로그인 요청하기전 정책 동의 프로세스 변경
		function policyCheck()
		{
			// 토큰 값이 있을 경우 로그인 되었다고 판단해서 아이콘의 text 변경
			var token = $.cookies.get("iPlanetDirectoryPro", {domain:".samsung.com"});
			//var token = true;
			if (token && policyCheckSite)
			{
				$.ajax({
					url: "http://" + STORE_DOMAIN + "/" + SITE_CD + "/ng/p4v1/getGuidCheckInfo",
					type: 'GET',
					dataType : "jsonp",
					jsonp : "callback",
					beforeSend: function () {
					},
					success: function (data) {
						
						if (data.resultCode == "0000")
						{
							// 처음 접속 유저
							if (data.resultValue == "N")
							{
								closeLayer();
								
								$showLayer = $privacyPopup;
								
								popupLayer();
							}
							else
							{
								init();
							}
						}
						else
						{
							ss.Auth.signOut();
						}
					},
					error:function(jqXHR, textStatus, errorThrown){
						console.error(textStatus);
						//ss.Auth.signOut();
					}   
				});
				
			}
			else
			{
				init();
			}
			
		}
		
		setElement();
		setEvent();
		policyCheck();
		
		
	};
	
} (window, ss));

$(document).ready(function(){
	var saLogin = $.cookies.get("sa_l");
	var omnitureGuid = $.cookies.get("GUID");
	if (saLogin == "Y")
	{
		// omniture - 로그인 성공
		(omnitureGuid != null && omnitureGuid != undefined) ? sendClickCode('account', 'login:samsung account|'+omnitureGuid) : sendClickCode('account', 'login:samsung account');
		
			//GUID 쿠키값 로그인 성공시 삭제 
		$.cookies.del("GUID");
		$.cookies.del("GUID",{domain:".samsung.com"});
		$.cookies.del("sa_l");
		$.cookies.del("sa_l", {domain : ".samsung.com"});
	}
	
	var snsLogin = $.cookies.get("nextgenSnsSignInType");
	if (snsLogin)
	{
		// omniture - sns login 성공(스토어에서 쿠키 생성)
		sendClickCode('account', snsLogin);
		
		$.cookies.del("nextgenSnsSignInType");
		$.cookies.del("nextgenSnsSignInType", {domain : ".samsung.com"});
	}
});

new ss.Sign();


//변경 내역
/*


*/