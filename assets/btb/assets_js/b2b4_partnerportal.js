$(document).ready(function(){
	function init_partnerportal(){
		setPartnerPortalEvent();
	}
	
	function setPartnerPortalEvent(){
		$('a[data-role=btn-partnerportal]').bind({
			'click':function(){
				$(this).attr('target', '');
				var guid = $.cookies.get('guid');
				var ticketId = $.cookies.get('ticket_id');
				checkTicketId = "";
				
				site = PARTNER_PORTAL_SITE_NATION_MAPPING[SITE_CD].portal_site_cd;
				nation = PARTNER_PORTAL_SITE_NATION_MAPPING[SITE_CD].portal_lang_cd;
				url = 'http://partnerportal.samsung.com/portal/app/main?targetSite=' + site + '&targetNation=' + nation;
				
				if(ticketId){
					ticketId = ticketId.replace('t', '');

					$.ajax({
						type: 'get',
						url: '/' + SITE_CD + '/business/my-business/partnerportal/checkticket',
						data: {
							'guid' : guid,
							'ticketId' : ticketId
						},
						success: function (data) {
							if(data.ticketSiteCode != SITE_CD) {
								partnerPortalOpen('N', guid, ticketId);
							} else {
								partnerPortalOpen(data.checkTicketId, guid, ticketId);
							}
						},
						error : function(c) {
							window.open('about:blank').location.href = url;
						}
					});
				} else{
					window.open('about:blank').location.href = url;
				}
			}
		});
	}
	
	function partnerPortalOpen(checkTicketId, guid, ticketId){
		if(checkTicketId == 'Y' && guid && ticketId) {
			window.open('about:blank').location.href = 'http://partnerportal.samsung.com/portal/app/sso/ssdc?ticket=' + ticketId;
		} else {
			site = PARTNER_PORTAL_SITE_NATION_MAPPING[SITE_CD].portal_site_cd;
			nation = PARTNER_PORTAL_SITE_NATION_MAPPING[SITE_CD].portal_lang_cd;
			window.open('about:blank').location.href = 'http://partnerportal.samsung.com/portal/app/main?targetSite=' + site + '&targetNation=' + nation;
		}
	}
	
	init_partnerportal();
});

var PARTNER_PORTAL_SITE_NATION_MAPPING = {
		africa_en: { portal_site_cd :'empty' ,portal_lang_cd : 'empty'},
		africa_fr: { portal_site_cd :'empty' ,portal_lang_cd : 'empty'},
		ar: { portal_site_cd :'empty' ,portal_lang_cd : 'empty'},
		au: { portal_site_cd :'AU' ,portal_lang_cd : 'AU'},
		at: { portal_site_cd :'AT' ,portal_lang_cd : 'AT'},
		be_fr: { portal_site_cd :'BE' ,portal_lang_cd : 'BE'},
		be: { portal_site_cd :'BE' ,portal_lang_cd : 'BE'},
		br: { portal_site_cd :'BR' ,portal_lang_cd : 'BR'},
		bg: { portal_site_cd :'BG' ,portal_lang_cd : 'EN'},
		ca: { portal_site_cd :'CA-EN' ,portal_lang_cd : 'CA'},
		ca_fr: { portal_site_cd :'CA-FR' ,portal_lang_cd : 'CA'},
		cl: { portal_site_cd :'CL' ,portal_lang_cd : 'CL'},
		cn: { portal_site_cd :'CHINA' ,portal_lang_cd : 'CN'},
		co: { portal_site_cd :'CO' ,portal_lang_cd : 'CO'},
		hr: { portal_site_cd :'SEAD' ,portal_lang_cd : 'HR'},
		cz: { portal_site_cd :'CZ' ,portal_lang_cd : 'CZ'},
		dk: { portal_site_cd :'DK' ,portal_lang_cd : 'DK'},
		eg: { portal_site_cd :'empty' ,portal_lang_cd : 'empty'},
		ee: { portal_site_cd :'EE' ,portal_lang_cd : 'EE'},
		fi: { portal_site_cd :'FI' ,portal_lang_cd : 'FI'},
		fr: { portal_site_cd :'FR' ,portal_lang_cd : 'FR'},
		de: { portal_site_cd :'DE' ,portal_lang_cd : 'DE'},
		gr: { portal_site_cd :'GR' ,portal_lang_cd : 'GR'},
		hk: { portal_site_cd :'HK' ,portal_lang_cd : 'HK'},
		hk_en: { portal_site_cd :'HK' ,portal_lang_cd : 'HK'},
		hu: { portal_site_cd :'HU' ,portal_lang_cd : 'HU'},
		'in': { portal_site_cd :'IN' ,portal_lang_cd : 'IN'},
		id: { portal_site_cd :'ID' ,portal_lang_cd : 'ID'},
		iran: { portal_site_cd :'empty' ,portal_lang_cd : 'empty'},
		il: { portal_site_cd :'empty' ,portal_lang_cd : 'empty'},
		it: { portal_site_cd :'IT' ,portal_lang_cd : 'IT'},
		ie: { portal_site_cd :'IE' ,portal_lang_cd : 'IE'},
		japan: { portal_site_cd :'empty' ,portal_lang_cd : 'empty'},
		jp: { portal_site_cd :'empty' ,portal_lang_cd : 'empty'},
		levant: { portal_site_cd :'SELV' ,portal_lang_cd : 'JO'},
		kz_ru: { portal_site_cd :'KZ-RU' ,portal_lang_cd : 'KZ'},
		latam: { portal_site_cd :'empty' ,portal_lang_cd : 'empty'},
		lv: { portal_site_cd :'LV' ,portal_lang_cd : 'LV'},
		lt: { portal_site_cd :'LT' ,portal_lang_cd : 'LT'},
		my: { portal_site_cd :'MY' ,portal_lang_cd : 'MY'},
		mx: { portal_site_cd :'MX' ,portal_lang_cd : 'MX'},
		n_africa: { portal_site_cd :'MA' ,portal_lang_cd : 'MA'},
		nl: { portal_site_cd :'NL' ,portal_lang_cd : 'NL'},
		nz: { portal_site_cd :'NZ' ,portal_lang_cd : 'NZ'},
		no: { portal_site_cd :'NO' ,portal_lang_cd : 'NO'},
		pk: { portal_site_cd :'empty' ,portal_lang_cd : 'empty'},
		latin: { portal_site_cd :'SELA-ES' ,portal_lang_cd : 'PA'},
		latin_en: { portal_site_cd :'SELA-ES' ,portal_lang_cd : 'PA'},
		pe: { portal_site_cd :'PE' ,portal_lang_cd : 'PE'},
		ph: { portal_site_cd :'PH' ,portal_lang_cd : 'PH'},
		pl: { portal_site_cd :'PL' ,portal_lang_cd : 'PL'},
		pt: { portal_site_cd :'PT' ,portal_lang_cd : 'PT'},
		ro: { portal_site_cd :'SEROM' ,portal_lang_cd : 'RO'},
		ru: { portal_site_cd :'RU' ,portal_lang_cd : 'RU'},
		sa_en: { portal_site_cd :'empty' ,portal_lang_cd : 'empty'},
		sa: { portal_site_cd :'empty' ,portal_lang_cd : 'empty'},
		rs: { portal_site_cd :'SEAD' ,portal_lang_cd : 'RS'},
		sg: { portal_site_cd :'SG' ,portal_lang_cd : 'SG'},
		sk: { portal_site_cd :'SK' ,portal_lang_cd : 'SK'},
		si: { portal_site_cd :'SEAD' ,portal_lang_cd : 'SI'},
		africa_pt: { portal_site_cd :'ZA' ,portal_lang_cd : 'ZA'},
		za: { portal_site_cd :'ZA' ,portal_lang_cd : 'ZA'},
		es: { portal_site_cd :'ES' ,portal_lang_cd : 'ES'},
		se: { portal_site_cd :'SE' ,portal_lang_cd : 'SE'},
		ch: { portal_site_cd :'CH-DE' ,portal_lang_cd : 'CH'},
		ch_fr: { portal_site_cd :'CH-DE' ,portal_lang_cd : 'CH'},
		sec: { portal_site_cd :'empty' ,portal_lang_cd : 'empty'},
		tw: { portal_site_cd :'TW' ,portal_lang_cd : 'TW'},
		th: { portal_site_cd :'TH' ,portal_lang_cd : 'TH'},
		tr: { portal_site_cd :'TR' ,portal_lang_cd : 'TR'},
		ua_ru: { portal_site_cd :'UA' ,portal_lang_cd : 'UA'},
		ua: { portal_site_cd :'UA' ,portal_lang_cd : 'UA'},
		uk: { portal_site_cd :'GB' ,portal_lang_cd : 'GB'},
		ae_ar: { portal_site_cd :'empty' ,portal_lang_cd : 'empty'},
		ae: { portal_site_cd :'empty' ,portal_lang_cd : 'empty'},
		ve: { portal_site_cd :'empty' ,portal_lang_cd : 'empty'},
		vn: { portal_site_cd :'VN' ,portal_lang_cd : 'VN'},
		py: { portal_site_cd :'empty' ,portal_lang_cd : 'empty'},
		uy: { portal_site_cd :'empty' ,portal_lang_cd : 'empty'}
};