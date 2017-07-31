var ss = $;
(function($) {
	
	/**
	 * WishList Button Module.
	 * @class $.WishListButton
	 * @param
	 */
	
	ss.WishListButton = function( params ) {
		
		// WishList Button
		var container = params.container;
		
		// Popover Container
		var popoverContainer = '.wishlist-popover-container';
		
		// WishList Poover 객체
		var popover;
		
		// 제품 ID
		var wishProductId = container.attr('wish-product-id');
		
		// 위시리스트 max length
		var maxWishList = 6;
		
		// tagging 용 page name
		var taggingPage = container.attr('tagging-page');
		
		function init() {
			setIDs();
        	setupPopover();
            bindEvents();
         }
		
		function setIDs() {
        	container.attr('id', 'WL-' + container.attr('wish-product-id').replace('/','__'));
		}
		
		function setupPopover() {
			if( $(popoverContainer).length <= 0 ) popoverContainer = 'body';
			popover = new ss.Popover( '#'+container.attr('id'), {placement: container.attr('data-popover-position'), content: $('.wishlist-popover-content').html(), html: true, container: popoverContainer, animation: false});
			return;
		}
		
		function bindEvents() {
            // WishList 버튼 클릭
            container.on('click', function(){
            	if( $.Popover.activePopover ) {
            		// 팝업 초기화
                	initWishListPopover();
            	}
            });
            
            // 팝업 내부 View WishList 버튼 클릭 이벤트
            $(popoverContainer).on('click', '.popover .forwardWishList', function(){
            	window.location = '/' + SITE_CD + '/wishlist';
            });
		}
		
		// 팝업 초기화
		function initWishListPopover() {
			var $wishlistPopover = $( popoverContainer ).find('.popover .wishlist-popover');
			$wishlistPopover.hide(); // 화면깨짐방지
			// 팝업 ROW 초기화
			$wishlistPopover.find('.row').hide();
			if( USE_ESTORE ) {
				$.Auth.checkSignIn(function(loginFlag){
					if(loginFlag) {
						$.Auth.getUserProfile(function(profile) {
							
							// 중국, 한총 스토어 인 경우 성 이름 순으로
							if(SITE_CD == "cn"){
						        $wishlistPopover.find('.login .username').text( profile.lastName + ' ' + profile.firstName + ',' );
						       }else if(SITE_CD == "sec"){
						        $wishlistPopover.find('.login .username').text( profile.lastName + ' ' + profile.firstName + '님,' );
						       }else{
						        $wishlistPopover.find('.login .username').text( profile.firstName + ' ' + profile.lastName + ',' );
						       }
							$wishlistPopover.find('.login').show();
							// e-store wishlist 저장
							estore.addWishListItem({'productCode':wishProductId}, function(result) {
				        		// Omniture 적용
				        		if( taggingPage && '' !== taggingPage ) {
					        		sendClickCode(taggingPage,'wish list:add');
				        		}
				    			// 초기화
								$wishlistPopover.show();
								positionPopover(true);
							});
						});
					} else {
						if( $.cookies.getWishListCnt() >= maxWishList ) {
							$wishlistPopover.find('.more').show();
							$wishlistPopover.find('.more+.header-login').show();
						} else {
							$wishlistPopover.find('.save').show();
							$wishlistPopover.find('.save+.header-login').show();
				        	// 현재 상품이 wishList에 없음
				        	if( !$.cookies.isAddedWishList(wishProductId) ) {
				        		// Omniture 적용
				        		if( taggingPage && '' !== taggingPage ) {
					        		sendClickCode(taggingPage,'wish list:add');
				        		}
				        		$.cookies.setWishList( wishProductId );
				            }
						}
		    			// 초기화
						$wishlistPopover.show(); // 화면깨짐방지
		        		positionPopover(false);

					}
				});
			} else {
				if( $.cookies.getWishListCnt() >= maxWishList ) {
					$wishlistPopover.find('.more').show();
					$wishlistPopover.find('.more+.header-login').show();
				} else {
					$wishlistPopover.find('.save').show();
					$wishlistPopover.find('.save+.header-login').show();
		        	// 현재 상품이 wishList에 없음
		        	if( !$.cookies.isAddedWishList(wishProductId) ) {
		        		// Omniture 적용
		        		if( taggingPage && '' !== taggingPage ) {
			        		sendClickCode(taggingPage,'wish list:add');
		        		}
		        		$.cookies.setWishList( wishProductId );
		            }
				}
    			// 초기화
				$wishlistPopover.show(); // 화면깨짐방지
        		positionPopover(false);
        		
			}
		}
		
		function positionPopover(loginFlag) {
			var $wishPopover = $( popoverContainer ).find('.popover .wishlist-popover').parent().parent();
			var $container = $( popover.targetElementSelector );
			if( $wishPopover.hasClass('top') ) {
				$wishPopover.css({'top':  $container.offset().top - $wishPopover.outerHeight()});
			}
			if(loginFlag){
				$wishPopover.find('.forwardWishList').attr('data-focus-id','forwardWishList').attr('data-tab-previous','wish-close').attr('data-tab-next','wish-close');
				$wishPopover.find('.icon-close-x').attr('data-focus-id','wish-close').attr('data-tab-previous','forwardWishList').attr('data-tab-next','forwardWishList');
				$wishPopover.find('.forwardWishList').focus();
				
			}else{
					$wishPopover.find('.sys-login-btn').attr('data-focus-id','wish-login').attr('data-tab-previous','wish-close').attr('data-tab-next','forwardWishList');
					$wishPopover.find('.forwardWishList').attr('data-focus-id','forwardWishList').attr('data-tab-previous','wish-login').attr('data-tab-next','wish-close');
					$wishPopover.find('.icon-close-x').attr('data-focus-id','wish-close').attr('data-tab-previous','forwardWishList').attr('data-tab-next','wish-login');
					$wishPopover.find('.sys-login-btn').focus();							
				
			}
		}
		
		init();
	};
	
	
} (jQuery));