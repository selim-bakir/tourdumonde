/*
OnlineOpinion v5.9.0
Released: 11/17/2014. Compiled 11/17/2014 01:01:01 PM -0600
Branch: master 7cffc7b9a0b11594d56b71ca0cb042d9b0fc24f5
Components: Inline, Tab
UMD: disabled
The following code is Copyright 1998-2014 Opinionlab, Inc. All rights reserved. Unauthorized use is prohibited. This product and other products of OpinionLab, Inc. are protected by U.S. Patent No. 6606581, 6421724, 6785717 B1 and other patents pending. http://www.opinionlab.com
*/

/* global window, OOo */

var urlOL = document.URL,
    cleanURL = '',
    rp = '',
    stage_url = (urlOL.indexOf('stgweb4') > -1 || urlOL.indexOf('preview4') > -1); //add 'preview4' domain

urlOL = urlOL.replace(/https?:\/\/[^\/]*/, '');

cleanURL += urlOL[1];
cleanURL += urlOL[2];
cleanURL += urlOL[3];

if(stage_url) {
  if(cleanURL.indexOf('sec') > -1) {
    rp = '://sec.stgweb4.samsung.com';
  } else if(cleanURL.indexOf('br') > -1) {
    rp = '://br.stgweb4.samsung.com';
  } else if(cleanURL.indexOf('cn') > -1) {
    rp = '://cn.stgweb4.samsung.com';
  } else if(cleanURL.indexOf('fr') > -1) {
    rp = '://fr.stgweb4.samsung.com';
  } else if(cleanURL.indexOf('in') > -1) {
    rp = '://in.stgweb4.samsung.com';
  } else if(cleanURL.indexOf('it') > -1) {
    rp = '://it.stgweb4.samsung.com';
  } else if(cleanURL.indexOf('ru') > -1) {
    rp = '://ru.stgweb4.samsung.com';
  } else if(cleanURL.indexOf('th') > -1) {
    rp = '://th.stgweb4.samsung.com';
  } else if(cleanURL.indexOf('uk') > -1) {
    rp = '://uk.stgweb4.samsung.com';
  } else if(cleanURL.indexOf('de') > -1) {
    rp = '://de.stgweb4.samsung.com';
  } else {
    rp = '://sec.stgweb4.samsung.com';
  }
} else {
  if(cleanURL.indexOf('sec') > -1) {
    rp = '://sec.samsung.com';
  } else if(cleanURL.indexOf('br') > -1) {
    rp = '://br.samsung.com';
  } else if(cleanURL.indexOf('cn') > -1) {
    rp = '://cn.samsung.com';
  } else if(cleanURL.indexOf('fr') > -1) {
    rp = '://fr.samsung.com';
  } else if(cleanURL.indexOf('in') > -1) {
    rp = '://in.samsung.com';
  } else if(cleanURL.indexOf('it') > -1) {
    rp = '://it.samsung.com';
  } else if(cleanURL.indexOf('ru') > -1) {
    rp = '://ru.samsung.com';
  } else if(cleanURL.indexOf('th') > -1) {
    rp = '://th.samsung.com';
  } else if(cleanURL.indexOf('uk') > -1) {
    rp = '://uk.samsung.com';
  } else if(cleanURL.indexOf('de') > -1) {
    rp = '://de.samsung.com';
  } else {
    rp = '://sec.samsung.com';
  }
}

(function (w, o) {
	'use strict';

	var OpinionLabInit = function () {

		o.oo_feedback = new o.Ocode({
			referrerRewrite: {
				searchPattern: /:\/\/[^\/]*/,
				replacePattern: rp
			},
			customVariables: {
				s_vi: OOo.readCookie('s_vi'),
				s_pageName: typeof s !== 'undefined' ? (typeof s.pageName !== 'undefined' ? s.pageName : '') : ''
			}
		});

		o.oo_tab = new o.Ocode({
			tab: {},
			referrerRewrite: {
				searchPattern: /:\/\/[^\/]*/,
				replacePattern: rp
			},
			customVariables: {
				s_vi: OOo.readCookie('s_vi'),
				s_pageName: typeof s !== 'undefined' ? (typeof s.pageName !== 'undefined' ? s.pageName : '') : ''
			}
		});

	};

	o.addEventListener(w, 'load', OpinionLabInit, false);

})(window, OOo);

window.onload = function  () {
	$('#oo_tab').click(function () {
		sendClickCode('survey_click', 'ol survey tab click');
	});
	
	if(cleanURL.indexOf('sec') > -1) {
		//console.log("b2b sec : " + cleanURL); 
    $('#oo_tab .screen_reader').html('코멘트 카드를 시작하시려면 클릭하세요.');
		$('#oo_tab a').html('간단설문');
		$('#oo_tab a').attr('href', '#');
		$('#oo_tab a').attr('title', '간단설문 : 새창으로 열기');
		$('#oo_tab a').css('font-size', '0');
  } 
	
};
