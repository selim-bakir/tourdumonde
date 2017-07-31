var ss = $;
/** 
Page object for the Global.

@module Navigation
@main Navigation
**/
/*global eventBridge, 
		sessionStorage,
		Event,
		eventDictionary,
		Modernizr,
		window,
		document,
		console,
		setTimeout,
		clearTimeout,
		navigator,
		location,
		alert*/

/**
 * e.g
 *
 * new data add 
 ss.InstGAC.pub.popushpData('popular', 'gallexy S4 II')
 ss.InstGAC.pub.popushpData('recent', 'new cookie value')
 *
 * generate popular | recent
 ss.InstGAC.pub.genPopular();
 ss.InstGAC.pub.genRecent();
 *
 */

(function($) {
	/**
	@class $.Global4AC
	@constructor	
	**/ 

	ss.Global4AC = function() {
		
		var _self = this,
			pub = {},
			pri = {},
			_jsonData = arguments[0],
			ss_container = $('.auto-complete'), 
			ss_popular = $('.popular ul'),
			ss_recent = $('.recently-viewed ul'),
			ss_input = $('.search-form-input'),
			ss_input_footer = $('.search-form-input-footer'),
			_input=$('.search-page-form-input'),
			gParam = { dispLen: SEARCH_QC_DISP_LENGTH, jsonp:'returnCallback' },
			_init=true;

/* Private */

		/** 
		@function init
		Initiali
		zation of functions
		**/
		function init() {
			_self.pub = pub;

			new ss.AC(ss_input, {
				url : "http://".concat( SEARCH_URL.autoComplete ),
				params: gParam,
				clickFunc: function(elm, container){
					var value = $(elm).attr( "keyword" );

					//Suggested Searches 태깅 2016-08-29
					sendClickCode('search_suggest','keyword suggestion:'+value);

					ss_input.val( value );
					goSearch( value );
					
					container.removeClass('on');
				},
				submitFunc: function(elm_input, elm_container){
					var result = true;
					if($("#hiddenSearch") && $("#search-form-input").val() == ""){
						var searchdefault = $("#hiddenSearch").val();
						$(elm_input).val(searchdefault);
					}
					goSearch($(elm_input).val(), elm_input, elm_container );
					return result;
				},
				validFn : function() {
					var input = arguments[0];
					var e = arguments[1];
					if ( !e ) e = window.event;
					var result = false;
					var value = ( String( input.value ) ).trim();

					if( 1 < value.length  ) {
						gParam[ "q" ] = value;
						
						if( SITE_CD == "sec" ){	
							gParam[ "tq" ] = SEARCH_TRANSFORMER.transform( value );	
						} else {
							delete gParam[ "tq" ];	
						}
						result = true;
					
					} else {
						gParam[ "q" ]  = "";
						result = false;
					}
					
					return result;	
				},
				container: 'search-form-ac'
			});
			/*$('.search-form-input').each(function(){
				var $this = $(this);
				$this.data('placeholder', $this.attr('placeholder'))
				     .focus(function(){$this.removeAttr('placeholder');})
				     .blur(function(){$this.attr('placeholder', $this.data('placeholder'));});
				});*/
			$('.search-form-input').each(function(){
				var $this = $(this);
				$this.data('placeholder', $this.attr('placeholder'))
				     .focus(function(){
						$this.removeAttr('placeholder');
						pub.replaceData( "recent", getRecentList() );
								 pub.genRecent();
								
								if( !window[ "SCH_POPULAR_LIST" ] )
								{
									$.getScript
									(
										"http://".concat( SEARCH_URL[SEARCH_MODULE_TYPE.concat("_POP")] )
										, function()
										{
											pub.replaceData( "popular", getPopularList() );
											pub.genPopular();
										}
									);
								}
								else
								{
									pub.replaceData( "popular", getPopularList() );
									pub.genPopular();
								}
					      }
					  )
				     .blur(function(){$this.attr('placeholder', $this.data('placeholder'));});
				});
		}
		
		/** 
		@function init footer
		Initialization of functions
		**/
		function init_footer() {
			_self.pub = pub;

			new ss.AC(ss_input_footer, {
				url : "http://".concat( SEARCH_URL.autoComplete ),
				params: gParam,
				clickFunc: function(elm, container){
					var value = $(elm).attr( "keyword" );
					ss_input_footer.val( value );
					goSearch( value );
					container.removeClass('on');
				},
				submitFunc: function(elm_input, elm_container){
					var result = true;
					if($("#hiddenSearch") && $("#search-form-input").val() == ""){
						var searchdefault = $("#hiddenSearch").val();
						$(elm_input).val(searchdefault);
					}
					goSearch($(elm_input).val(), elm_input, elm_container );
					return result;
				},
			});
			$('.search-form-input-footer').each(function(){
				var $this = $(this);
				$this.data('placeholder', $this.attr('placeholder'))
				     .focus(function(){$this.removeAttr('placeholder');})
				     .blur(function(){$this.attr('placeholder', $this.data('placeholder'));});
				});
		}
		
		
/* Public */

		/** 
		@function genPopular
		generate to [popular = css class] html
		**/
		pri.genPopular = function (fn_def) {
			ss_popular.empty();//ss_popular = $('.popular ul')

			$.each(_jsonData.popular, function(k,v) {
				var link = $( '<a href="javascript:void(0);" keyword="" ></a>' );
				link.attr( "keyword", v );
				$('<li></li>').append( link.text(v) ).appendTo(ss_popular); 
			});

			ss_popular.find('li a').on('click', fn_def);
		};

		/** 
		@function genRecent
		generate to [recently-viewed = css class] html
		**/
		pri.genRecent = function (fn_def) {
			ss_recent.empty();//ss_recent = $('.recently-viewed ul')

			$.each(_jsonData.recent, function(k,v) {
				var link = $( '<a href="javascript:void(0);" keyword="" ></a>' );
				link.attr( "keyword", v );
				$('<li></li>').append( link.text(v) ).appendTo(ss_recent); 
				
			});//for

			ss_recent.find('li a').on('click', fn_def);
		};

		/** 
		@function genPopular
		**/
		pub.genPopular = function () {
			pri.genPopular(function() {
				var keyword = ( String( $( this ).attr( "keyword" ) ) ).trim();
				sendClickCode('pop_rct_search','popular:'+ keyword);
				goSearch( keyword );
			});
		};

		/** 
		@function genRecent
		**/
		pub.genRecent = function () {
			pri.genRecent(function() {
				var keyword = ( String( $( this ).attr( "keyword" ) ) ).trim();
				sendClickCode('pop_rct_search' ,'recent:'+keyword);
				goSearch( keyword );
			});
		};

		/** 
		@function replaceData
		replace to json data
		@param node_name => popular | recent
		@param json_list => ['gallexy S3', 'gallexy Note', 'gallexy Note II']
		**/
		pub.replaceData = function (node_name, json_list) {
			_jsonData[node_name] = json_list;
		};

		/** 
		@function addData
		adding new data to origin json data.
		@param node_name => popular | recent
		@param json_list => ['gallexy S3', 'gallexy Note', 'gallexy Note II']
		**/
		pub.addData = function (node_name, json_list) {
			_jsonData[node_name] = _jsonData[node_name].concat(json_list);
		};

		/** 
		@function popushpData 
		push new data of elment to origin json data after remove first element.
		@param node_name => popular | recent
		@param json_item => 'gallexy S3'
		**/
		pub.popushpData = function (node_name, json_item) {
			_jsonData[node_name].pop();
			_jsonData[node_name].unshift(json_item);
		};

/* Constructor */

		init();
		init_footer();

		return _self;
	};

} (jQuery));


/////////////////
//trans.js
/////////////////

/**
* Constructor for EnKoTransformer.
* created by choong10
* created date 2008-05-20
*/
function EnKoTransformer() {
	this.__reg_h = "[" + this.__en_h + "]"; 
	this.__reg_exp = new RegExp("("+this.__reg_h+")("+this.__reg_b+")((?:"+this.__reg_f+")(?=(?:"+this.__reg_h+")(?:"+this.__reg_b+"))|(?:"+this.__reg_f+"))","g");
}

//
//Private members
//
EnKoTransformer.prototype.__en_h = "rRseEfaqQtTdwWczxvg";
EnKoTransformer.prototype.__reg_h = null;
EnKoTransformer.prototype.__en_b = {  k:0,o:1,i:2,O:3,j:4,p:5,u:6,P:7,h:8,hk:9,ho:10,hl:11,y:12,n:13,nj:14,np:15,nl:16,b:17,m:18,ml:19,l:20 };
EnKoTransformer.prototype.__reg_b  = "hk|ho|hl|nj|np|nl|ml|k|o|i|O|j|p|u|P|h|y|n|b|m|l"; 
EnKoTransformer.prototype.__en_f = {  "":0,r:1,R:2,rt:3,s:4,sw:5,sg:6,e:7,f:8,fr:9,fa:10,fq:11,ft:12,fx:13,fv:14,fg:15,a:16,q:17,qt:18,t:19,T:20,d:21,w:22,c:23,z:24,x:25,v:26,g:27 } ;
EnKoTransformer.prototype.__reg_f = "rt|sw|sg|fr|fa|fq|ft|fx|fv|fg|qt|r|R|s|e|f|a|q|t|T|d|w|c|z|x|v|g|"; 
EnKoTransformer.prototype.__reg_exp = null;

//
//Public methods
//
EnKoTransformer.prototype.transform = function(str) {	
	var transfromStr ="";
	if (this.__isAlphabet(str)) {
		if (str.length >= 4 ) {
			transfromStr = this.__toKorean( str );
		} 
	} else {
		transfromStr = "";
	}
	return transfromStr;
};

//
//Private methods
//
EnKoTransformer.prototype.__toKorean = function(str) {
	return str.replace(this.__reg_exp, replaceForEnKoTransformer); 
};

/*
���� : this.__en_h,  this.__en_b, this.__en_f�� ���� undefined�� ����.
�ذ��� : �Ϲ� �Լ�� �Ϲ� �� ���� ����Ͽ� replace�Լ� �����
EnKoTransformer.prototype.replace = function(str,h,b,f) {
	return String.fromCharCode( this.__en_h.indexOf(h)*21*28 + this.__en_b[b]*28 + this.__en_f[f] + 44032); 
};
*/

EnKoTransformer.prototype.__containsCharsOnly = function(str,chars) {
	for (var inx = 0; inx < str.length; inx++) {
		if (chars.indexOf(str.charAt(inx)) == -1)
			return false;
	}
	return true;
};

EnKoTransformer.prototype.__isAlphabet = function(str) {	
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	return this.__containsCharsOnly(str,chars);	
};

//
//normal function & global variables
//
var __en_h = "rRseEfaqQtTdwWczxvg";
var __en_b = {  k:0,o:1,i:2,O:3,j:4,p:5,u:6,P:7,h:8,hk:9,ho:10,hl:11,y:12,n:13,nj:14,np:15,nl:16,b:17,m:18,ml:19,l:20 };
var __en_f = {  "":0,r:1,R:2,rt:3,s:4,sw:5,sg:6,e:7,f:8,fr:9,fa:10,fq:11,ft:12,fx:13,fv:14,fg:15,a:16,q:17,qt:18,t:19,T:20,d:21,w:22,c:23,z:24,x:25,v:26,g:27 } ;

function replaceForEnKoTransformer (str,h,b,f) {
	return String.fromCharCode( __en_h.indexOf(h)*21*28 + __en_b[b]*28 + __en_f[f] + 44032); 
};

/**
 * Keyword 변경 검색 수행
 */
var goSearch = function( keyword, elm_input, elm_container )
{
	var val = ( String( keyword.replaceAll( "\\\\", " " ).replaceAll( "'", " " ).replaceAll( ":", " " ).replaceAll( "\\+", "plus" ).replaceAll( "\"", " " ).replaceAll( "<", " " ).replaceAll( ">", " " ) ) ).trim();
	if( val.length < 1 )
	{
		if( 1 < arguments.length )
		{
			elm_input.focus();
		}
	}
	else
	{
		modifyRecentKeyword( val );
		document.location.href = "http://".concat( SEARCH_URL[SEARCH_MODULE_TYPE] ).concat( "?q=" ).concat( encodeURIComponent( val ) );
	}
};


/**
 * 
 */
var modifyRecentKeyword = function( keyword )
{
	// 1. setCookie
	$.cookies.setSearchKeyword( keyword );
};

var getRecentList = function()
{
	var recentList = $.cookies.getSearchKeyword();
	return recentList.reverse();
};


/**
 * 
 * 
 */
var getPopularList = function()
{
	var result = [];
	if
	(
		window[ "SCH_POPULAR_LIST" ] != undefined &&
		window[ "SCH_POPULAR_LIST" ] != null &&
		window[ "SCH_POPULAR_LIST" ] instanceof Array &&
		window[ "SCH_POPULAR_LIST" ].length > 0
	)
	{
		var list = SCH_POPULAR_LIST;
		
		var loop = Math.min( 3, SCH_POPULAR_LIST.length );
		var key = -1;
		for( var i = 0; i < loop; i++ )
		{
			if( i == 0 && 0 < list.length )
			{
				key = Math.round
					(
						Math.random() 
						* ( list.length - 1 )
					);
			}
			else if( i == 1 && 0 < list.length )
			{
				key = Math.round
					(
						Math.sin
						( 
							( Math.random() * Math.PI / 2 )
						) * ( list.length - 1 )
					);
			}
			if( i == 2 && 0 < list.length )
			{
				key = Math.round
					(
						Math.sin
						( 
							( Math.random() * Math.PI / 2 )
						) * Math.sin
						( 
							( Math.random() * Math.PI / 2 )
						) * ( list.length - 1 )
					);
			}
			if( -1 < key )
			{
				result.push( list[ key ] );
				list = list.slice( 0, key ).concat(	list.slice( key + 1 ) );				
			}
		}

	}
	else{}

	return result;
};

var SEARCH_HOST = DOMAIN;
var SEARCH_INSTORE_CODE = INSTORE_CODE;
var SEARCH_MODULE_TYPE = MODULE_TYPE.length > 0 ? MODULE_TYPE : "B2C";
var SEARCH_URL  =
{
	B2C : SEARCH_HOST.concat( "/" ).concat( SITE_CD ).concat( "/search/" )
	, B2B : SEARCH_HOST.concat( "/" ).concat( SITE_CD ).concat( "/business/search/" )
	, SPP : SEARCH_HOST.concat( "/" ).concat( SITE_CD ).concat( "/search/" )
	, INS : SEARCH_HOST.concat( "/" ).concat( SITE_CD ).concat( "/instore/" ).concat( SEARCH_INSTORE_CODE ).concat( "/search/" )
	
	, B2C_RETRIEVE : SEARCH_HOST.concat( "/" ).concat( SITE_CD ).concat( "/data-search/retrieve.jsn" )
	, B2B_RETRIEVE : SEARCH_HOST.concat( "/" ).concat( SITE_CD ).concat( "/data-search/business/retrieve.jsn" )
	, INS_RETRIEVE : SEARCH_HOST.concat( "/" ).concat( SITE_CD ).concat( "/data-search/instore/").concat( SEARCH_INSTORE_CODE ).concat( "/retrieve.jsn")
	
	, B2C_POP : SEARCH_HOST.concat( "/" ).concat( SITE_CD ).concat( "/data-search/popularList.javascript" )
	, B2B_POP : SEARCH_HOST.concat( "/" ).concat( SITE_CD ).concat( "/data-search/popularList.javascript" )
	, SPP_POP : SEARCH_HOST.concat( "/" ).concat( SITE_CD ).concat( "/data-search/popularList.javascript" )
	, INS_POP : SEARCH_HOST.concat( "/" ).concat( SITE_CD ).concat( "/data-search/instore/" ).concat( SEARCH_INSTORE_CODE ).concat( "/popularList.javascript" )	
	
	, autoComplete : SEARCH_HOST.concat( "/" ).concat( SITE_CD ).concat( "/data-search/autoComplete.jsonp" )
};

var SEARCH_TRANSFORMER = new EnKoTransformer();
var SEARCH_QC_DISP_LENGTH = 6;


/**
 * 
 */
$ (
	function()
	{
		// init ss.InstGAC
		ss.InstGAC = new ss.Global4AC({});
		
		// Render Recent
		/*ss.InstGAC.pub.replaceData( "recent", getRecentList() );
		ss.InstGAC.pub.genRecent();

		// Render Popular
		if( !window[ "SCH_POPULAR_LIST" ] )
		{
			$.getScript
			(
				"http://".concat( SEARCH_URL[SEARCH_MODULE_TYPE.concat("_POP")] )
				, function()
				{
					ss.InstGAC.pub.replaceData( "popular", getPopularList() );
					ss.InstGAC.pub.genPopular();
				}
			);
		}
		else
		{
			ss.InstGAC.pub.replaceData( "popular", getPopularList() );
			ss.InstGAC.pub.genPopular();
		}*/
	}
);