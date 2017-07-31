//created by dong_won.lee^^a

//페퍼민트 관련 스크립트 삽입건 
$(document).ready(function  () {
	//cookie 셋팅
	function _deleteCookie( name, domain ){
		var todayDate = new Date();
		todayDate.setDate( todayDate.getDate() - 1 );
		document.cookie = name + "=; domain=" + domain + "; path=/; expires=" + todayDate.toGMTString() + ";";
	}
	function _getCookie(cName) {
		  cName = cName + '=';
		  var cookieData = document.cookie;
		  var start = cookieData.indexOf(cName);
		  var cValue = '';
		  if(start != -1){
		       start += cName.length;
		       var end = cookieData.indexOf(';', start);
		       if(end == -1)end = cookieData.length;
		       cValue = cookieData.substring(start, end);
		  }
		  return unescape(cValue);
	}
	function _setCookie(cName, cValue, cDay){
		  var expire = new Date();
		  expire.setDate(expire.getDate() + cDay);
		  cookies = cName + '=' + escape(cValue) + '; path=/ '; // 한글 깨짐을 막기위해 escape(cValue)를 합니다.
		  if(typeof cDay != 'undefined') cookies += ';expires=' + expire.toGMTString() + ';';
		  document.cookie = cookies;
	}

	function callPpmtUrl(_mid,_deviceType) {
	 	 //최종적으로 URL셋팅 
		 var scriptTag = document.createElement('script'); 
		 var click = (new Date()).getTime();
		 scriptTag.type = 'text/javascript';
		 scriptTag.async = true;
		 scriptTag.src = "https://ew1.reg.bigdata.ssp.samsung.com/feedback/v2.0/web/" + _mid + '?dt=' + _deviceType + '&t_click='+click+'&pageid=PDP'
		 document.head.appendChild(scriptTag);
		 //var fscr = document.getElementsByTagName('footer')[0]
		 //fscr.parentNode.insertBefore(scriptTag, fscr);
	}
	//테스트를 위해서 집어 넣음. 
	if ("stgweb4,preview4".indexOf(window.location.host.split('.')[0])!=-1 && getOmniUrlParam('ppmt_ref') != "") {
		_setCookie('ppmt',getOmniUrlParam('ppmt_ref').split('mid=')[1],7);
	}
	//디테일인 경우만 실행 
	if("product detail".indexOf(getOmniInputTag('pageTrack').value)!=-1){
		var _ppmtCookies = _getCookie('ppmt');
		//estore cookie 확인 
		var _mid = $.cookies.get('estore_mid');
		var _deviceType = $.cookies.get('estore_dt');

		//페퍼민트 쿠키가 존재시 
		if (_ppmtCookies != null && _ppmtCookies != "") {
			var splitedPpmt;
			splitedPpmt = _ppmtCookies.split('|');
			  //이스토어 쿠키 셋팅
			if(_mid == null){
				_setCookie('estore_mid',splitedPpmt[0],7);
				_setCookie('estore_dt',splitedPpmt[1].split('=')[1],7);
				printOmniLog('First estore_mid : ' + splitedPpmt[0]);
				printOmniLog('First estore_dt : ' + splitedPpmt[1].split('=')[1]);
			}else{
				//초기 쿠키 값이 같지 않으면, 신규로 쿠키값 셋팅 
				if (_mid != splitedPpmt[0]) {
					_setCookie('estore_mid',splitedPpmt[0],7);
					_setCookie('estore_dt',splitedPpmt[1].split('=')[1],7);
					printOmniLog('New estore_mid : ' + splitedPpmt[0]);
					printOmniLog('New estore_dt : ' + splitedPpmt[1].split('=')[1]);
				}else{
					_setCookie('estore_dt',splitedPpmt[1].split('=')[1]);
					printOmniLog('estore_dt : ' + splitedPpmt[1].split('=')[1]);
				}			
			}
			//estore cookie 확인 --> 최초에 null이므로 다시한번 획득
		    var _mid = $.cookies.get('estore_mid');
		    var _deviceType = $.cookies.get('estore_dt');

			if (discontinued.value != 'Y') {
			callPpmtUrl(_mid,_deviceType);		
			}
			//작업이 모두 완료된 후 ppmt쿠키는 버린다. 
			_deleteCookie('ppmt','.samsung.com');
		}else if( (_mid != "" && _mid != null) && (_deviceType != "" && _deviceType != null)){
			
			//스토어 판매 제품인지 확인 
			if (discontinued.value != 'Y') {
				callPpmtUrl(_mid,_deviceType);
			}
		}

	}
	// 독일 카테고리 로딩 시 USP 정렬 안 맞는 이슈 처리, minkyu01.jung
	if(typeof SITE_CD !== 'undefined' && SITE_CD === 'de' && typeof TYPE_NAME !== 'undefined' && (TYPE_NAME === 'Smartphones' || TYPE_NAME === 'Tablets')){
		  var metrics = ss.Detect();
  		  eventBridge.trigger(jQuery.Event(eventDictionary.global.RESIZE), metrics);
	}
});