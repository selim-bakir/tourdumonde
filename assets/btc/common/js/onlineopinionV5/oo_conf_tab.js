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
	
	/* 160317 - OL Position Modify */
	if (!$('.ss-carousel').length) return;	
	OverlappedCarouselCheck.init($('#oo_tab'), $('.ss-carousel').eq(0));

};

/* 160317 - OL Position Modify */
(function(win, $) {
	'use strict';

	var UTIL = win.smg.util,
		STATIC = win.smg.static,
		PDPSTANDARD = 'pdp_standard'; 

	win.OverlappedCarouselCheck = {
		init: function(target, element) {
			if ($('body').hasClass(STATIC.SUPPORT.IE_LT_8)) return;
			if(!$('body').hasClass(PDPSTANDARD)) return;

			this.target = target;
			this.element = element;

			this.initProperties();
			this.onResize();

			$(win).on('scroll', $.proxy(this.onScroll, this));
			$(win).on('resize', $.proxy(this.onResize, this));
		},
		isTabletView: function() {
			return UTIL.winSize().w <= STATIC.RESPONSIVE.TABLET.WIDTH;
		},
		initProperties: function() {
			this.targetHeight = this.target.outerHeight();
			this.elementHeight = 0; // changed height due to resize event
			this.oringinalPos = parseInt(this.target.css('top'), 10);
			this.threshold = 0;
			this.gap = 10;
		},
reset: function() {
			this.adjustTopPos = 0;
			this.targetPos = {};
			this.elementPos = {};
		},
		onResize: function() {
			this.elementHeight = this.element.height();

			this.applyOriginalPosition();

			if (!this.isTabletView()) return;

			this.target.css('visibility', 'hidden');

			this.reset();
			this.setPosition();
			this.checkBoundary();
			this.applyResultTopPosition();

			this.target.css('visibility', 'visible');
		},
		onScroll: function() {
			if (!this.isTabletView()) return;

			this.setPosition();
			this.checkBoundary();
			this.applyResultTopPosition();

		},
		setTargetPosition: function() {
			var top = this.target.offset().top;

			return {
				top: parseInt(top, 10),  
				bottom: parseInt(top + this.targetHeight, 10)
			};
		},
		setElementPosition: function(){
			var top = this.element.offset().top,
				elementHeight = this.elementHeight;

			return {
				top: parseInt(top, 10) - (elementHeight * 0.5) - 40,  // for arrow position
				bottom: parseInt(top + elementHeight, 10)
			};
		},
		setPosition: function() {
			this.targetPos = this.setTargetPosition();
			this.elementPos = this.setElementPosition();
			this.threshold = this.targetPos.bottom * 0.1;
		},
		checkBoundary: function() {
			if (this.isVerticalOverlapping()) {
				this.adjustTopPos = this.elementPos.bottom; 
			}
		},
		isScrolledOverlapping: function() {        	
			return $('body').scrollTop() <= (this.targetPos.bottom - $('body').scrollTop()) - this.threshold;
		},
		isVerticalOverlapping: function() {
			var targetPos = this.targetPos,
				elementPos = this.elementPos;

			return elementPos.top <= targetPos.top && elementPos.bottom >= targetPos.bottom;
		},
		applyOriginalPosition: function() {
			this.target.removeAttr('style');
		},
		adjustTargetTopPosition: function() {
			var top = parseInt(this.adjustTopPos - (this.targetHeight * 0.7) - this.gap, 10);

			if(top <= 0){
				this.applyOriginalPosition();
				return;
			}

			this.target.css({
				'top': top
			});
		},
		applyResultTopPosition: function() {
			if (this.isScrolledOverlapping()) {
				this.adjustTargetTopPosition();
			} else {
				this.applyOriginalPosition();
			}
		}
	};
})(window, jQuery);

