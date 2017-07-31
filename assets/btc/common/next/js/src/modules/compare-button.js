var ss = $;
(function ($) {
	/* global eventDictionary */
	/* global eventBridge */
	/* global console */
	/* global window */

    /**
    CompareButton Module.

    @class $.CompareButton
    @constructor
    @param {Object} params External object settings passed into the object.
    **/
    ss.CompareButton = function (params) {
        var container = params.container;

        var comparisonObject = {
    		id: container.attr('data-product-id'),
    		category: container.attr('data-product-category'),
    		categoryName : container.attr('data-product-category-text'),
    		name: container.attr('data-product-name'),
    		thumb: container.attr('data-product-thumb')
    	};

    	var comparisonProductTemplate = '<div class="product"><a class="close-button icon-close-x" href="javascript:void(0)" data-focus-return-keypress="enter" tabindex="0" aria-label="remove this item from the compare list"></a><div class="thumb"></div><div class="title"></div></div>';

    	var maxComparisons = 3;
    	
        var isComparisonForward = false;

        var popover;

        function init() {
        	
        	setIDs();

        	setupPopover();
        	
            bindEvents();
            
        	initButton();
        
        }

        function setIDs() {
        	var containerId = ( container.attr('data-container-id') ? container.attr('data-container-id') : container.attr('data-product-id') );
        	containerId = containerId + '_' + new Date().getTime();
        	container.attr('id', containerId);
        	container.parent().attr('id', containerId + '-container');
        	// Container ID 추가 저장
        	comparisonObject.containerId = containerId;
        }
        
        function replaceSelectorId( id ) {
        	return String(id).replace(/([.*+?^=! {}()|\[\]\/\\])/g, "\\$1");
        }

        function setupPopover() {
        	popover = new ss.Popover('#' + replaceSelectorId(container.attr('id')), {placement: container.attr('data-popover-position'), content: $('.compare-button-popover-content').html(), html: true, container: '#' + replaceSelectorId(container.parent().attr('id')), animation: false});
            return;
        }

        function bindEvents() {
            
        	eventBridge.on(eventDictionary.compareButton.EVENT_COMPARISON_ADDED, function(e, data){
        		initComparisonProducts();
                initButton();
        	});

            eventBridge.on(eventDictionary.compareButton.EVENT_COMPARISON_REMOVED, function(e, data){
                if($.cookies.getCompareProductCnt() == 0) {
                	hidePopover();
                } else {
                	initComparisonProducts();
                }
                initButton();
            });

            eventBridge.on(eventDictionary.global.RESIZE, function(e, data){
                initComparisonProducts();
            });

            
            // Compare 버튼 클릭
        	container.on('click', function() {
        		if( $.Popover.activePopover ) {
            		// 카테고리 체크
            		var currentCategory = $.cookies.getCategory();
            		var popoverContainer = container.parent().find('.popover .compare-button-popover');
            		if( '' !== currentCategory && currentCategory !== comparisonObject.category ) {
            			popoverContainer.find('.new-compare').text( comparisonObject.categoryName );
            			popoverContainer.find('.org-compare').text( $.cookies.getCategoryName() );
            			popoverContainer.children().hide();
            			popoverContainer.parent().find('.sys-close-btn').hide();
            			popoverContainer.find('.compare-choice').show();
            			
            		} else {
                		if($.cookies.getCompareProductCnt() < maxComparisons && !$.cookies.isCompareProduct(comparisonObject.id)) {
                			// 쿠키추가
                			$.cookies.setCompareProduct(comparisonObject);
                        	eventBridge.trigger(jQuery.Event(eventDictionary.compareButton.EVENT_COMPARISON_ADDED), comparisonObject);
//                        	eventBridge.trigger(jQuery.Event(eventDictionary.global.RESIZE), ss.metrics);
                        } else {
                			initComparisonProducts();
                		}
                		popoverContainer.parent().find('.sys-close-btn').find('span').addClass('blind');
                		popoverContainer.parent().find('.sys-close-btn').show();
            		}
            		// 활성화된 compare popup z-index 조절
//            		$('.compare-button-container').css('z-index','10');
//            		container.parent().css('z-index','20');
            		$(this).focus();
            		try{
            			$(this).popover( "reposition" );
            			relayPositionPopover();
                    }catch(e){}
        		}
        	});

        	// Compare 목록 삭제 버튼 클릭
        	container.parent().on('click', '.popover .products .product .close-button', function(e) {
        		e.stopPropagation();
        		var productId = $(this).parent().attr('data-product-id');
            	$.cookies.deleteCompareProduct(productId); // 쿠키삭제
        		eventBridge.trigger(jQuery.Event(eventDictionary.compareButton.EVENT_COMPARISON_REMOVED), {id:productId});
        		container.focus();
        	});
        	
        	// 팝업 Close
            container.parent().on( 'click', '.title-close-button', function(e) {
                hidePopover();
                container.focus();
            });

        	// 팝업 내부 compare 버튼 클릭 이벤트
        	container.parent().on('click', '.popover .compare-button', function() {
        		if( isComparisonForward ) {
        			var b2bMode = false;
        			var b2cMode = false;
            		var productIDs = '';
            		var OmnitureModelCode = '|';
            		var productArr = ['a','b','c'];
            		var currentComparisons = $.cookies.getCompareProductList();
            		$.each(currentComparisons, function(i) {
            			productIDs += 'prd' + productArr[i] + '=' + currentComparisons[i].id;
            			OmnitureModelCode += currentComparisons[i].id;
            			if(i !== currentComparisons.length - 1) {
            				productIDs += '&';
            				OmnitureModelCode += '^';
            			}
            			if( !b2bMode && 0 <= currentComparisons[i].containerId.indexOf('B2B') ) {
            				b2bMode = true;
            			}
            			if( !b2cMode && 0 <= currentComparisons[i].containerId.indexOf('B2C') ) {
            				b2cMode = true;
            			}
            		});
                    // Omniture 적용
                    sendClickCode('compare', OmnitureModelCode);
                    
                    // comparison 페이지로 이동
            		var comparisonUrl = '/'+SITE_CD+'/consumer/comparison?';
            		// INSTORE MODE
            		if( INSTORE_MODE ) {
            			comparisonUrl = '/'+SITE_CD+'/instore/'+INSTORE_CODE+'/comparison?';
            		}
            		// B2B MODE
            		if( MODULE_TYPE == 'B2B' ) {
            			comparisonUrl = '/'+SITE_CD+'/business/comparison?';
            		}
            		// Search 에서의 B2B MODE
            		if( b2bMode ) {
            			comparisonUrl = '/'+SITE_CD+'/business/comparison?';
            		}
            		// Search 에서의 B2C MODE
            		if( b2cMode ) {
            			comparisonUrl = '/'+SITE_CD+'/consumer/comparison?';
            		}
            		window.location = comparisonUrl + productIDs;
        		} else {
        			hidePopover();
        		}
        	});
        	
        	// 기존 카테고리 삭제
        	container.parent().on('click', '.popover .beforeCategoryDelete', function(){
				// 새로 제품 추가하기 위해 현재 Compare List 전체 삭제
				$.cookies.deleteComparison();
				hidePopover();
				// compare 버튼 클릭 재 실행
				container.trigger('click');
        	});
        }

        function showPopover() {
        	popover.show();
        	positionPopover();
        }

        function hidePopover() {
            popover.hide();
        }

        function positionPopover() {
        	container.parent().find('.popover').hide();
			var timeT = setTimeout(function(){clearTimeout(timeT); relayPositionPopover();}, 100);
		}
        
		function relayPositionPopover() {
    		var popoverContainer = container.parent().find('.popover');

            var runOffRight = container.offset().left + popoverContainer.outerWidth() > $('#content').width();
            var runOffLeft = (container.offset().left + container.outerWidth()) - ($('#content').offset().left + popoverContainer.outerWidth()) < 0;

            if(runOffRight && runOffLeft){
                //center instead of setting left or right
            } else if(runOffRight) {
    			popoverContainer.css({'left': container.position().left - popoverContainer.outerWidth() + container.outerWidth()});
    			popoverContainer.find('.arrow').css({'left': 'auto', 'margin-left': 0, 'right': '15px'});
    		} else if(runOffLeft) {
    			popoverContainer.css({'left': container.position().left});
    			popoverContainer.find('.arrow').css({'left': '15px', 'margin-left': 0});
    		}

    		if(container.attr('data-popover-position') === 'bottom') {
    			popoverContainer.css({'top':  container.outerHeight()});
    		} else {
    			popoverContainer.css({'top':  container.position().top - popoverContainer.outerHeight()});
    		}
    		popoverContainer.show();
        }
        
        function initButton() {
        	if( $.cookies.isCompareProduct(comparisonObject.id) && $.cookies.getCategory() === comparisonObject.category ) {
        		var addedText = comparepopup.messages.added;
        		container.text( addedText.replace('#COUNT#', String($.cookies.getCompareProductCnt())) );
                container.addClass('active');
            } else {
                container.text(comparepopup.messages.compare);
                container.removeClass('active');
            }
        }
        
        function initCompareButton() {
        	// text tag 가 랜덤임
        	var $compareBtnLabel = container.parent().find('.popover .compare-button').children().eq(0);
        	if( $.cookies.getCompareProductCnt() < 2 ) {
        		$compareBtnLabel.text(comparepopup.messages.close);
        		isComparisonForward = false;
        	} else {
        		$compareBtnLabel.text(comparepopup.messages.comparenow);
        		isComparisonForward = true;
        	}
        }

        function initComparisonProducts() { 
        	var popoverContainer = container.parent().find('.popover'),
                productsWidth;

        	popoverContainer.find('.products li .product').remove();
        	
        	var currentComparisons = $.cookies.getCompareProductList(); 
        	$.each(currentComparisons, function(i) {
        		var comparisonProduct = $(comparisonProductTemplate);

        		comparisonProduct.attr('data-product-id', currentComparisons[i].id);

        		comparisonProduct.find('.title').html(currentComparisons[i].name);

        		comparisonProduct.find('.thumb').html('<img src="' + currentComparisons[i].thumb + '" />');

                comparisonProduct.find( 'a' ).attr( 'data-focus-id', currentComparisons[i].id );

                // set data-tab-* attrs
                // 1 product 
                if ( currentComparisons.length === 1 && i === 0 ) {
                    popoverContainer.find( '.title-close-button' ).attr( 'data-tab-next', currentComparisons[i].id );
                    comparisonProduct.find( 'a' )
                        .attr( 'data-tab-next', 'compare-button' )
                        .attr( 'data-tab-previous', 'title-close-button' );
                    popoverContainer.find( '.compare-button' )
                        .attr( 'data-tab-previous', currentComparisons[i].id );
                }
                // 2 products
                else if ( currentComparisons.length === 2 && i === 0 ) {
                    popoverContainer.find( '.title-close-button' ).attr( 'data-tab-next', currentComparisons[i].id );
                    comparisonProduct.find( 'a' )
                        .attr( 'data-tab-next', currentComparisons[i + 1].id )
                        .attr( 'data-tab-previous', 'title-close-button' );
                }
                else if ( currentComparisons.length === 2 && i === 1 ) {
                    comparisonProduct.find( 'a' )
                        .attr( 'data-tab-next', 'compare-button' )
                        .attr( 'data-tab-previous', currentComparisons[i - 1].id );
                    popoverContainer.find( '.compare-button' ).attr( 'data-tab-previous', currentComparisons[i].id );
                }
                // 3 products
                else if ( currentComparisons.length === 3 && i === 0 ) {
                    popoverContainer.find( '.title-close-button' ).attr( 'data-tab-next', currentComparisons[i].id );
                    comparisonProduct.find( 'a' )
                        .attr( 'data-tab-next', currentComparisons[i + 1].id )
                        .attr( 'data-tab-previous', 'title-close-button' );
                }
                else if ( currentComparisons.length === 3 && i === 1 ) {
                    comparisonProduct.find( 'a' )
                        .attr( 'data-tab-next', currentComparisons[i + 1].id )
                        .attr( 'data-tab-previous', currentComparisons[i - 1].id );
                }
                else if ( currentComparisons.length === 3 && i === 2 ) {
                    comparisonProduct.find( 'a' ) 
                        .attr( 'data-tab-next', 'compare-button' )
                        .attr( 'data-tab-previous', currentComparisons[i - 1].id );
                    popoverContainer.find( '.compare-button' ).attr( 'data-tab-previous', currentComparisons[i].id );
                }

        		$(popoverContainer.find('.products li')[i]).append(comparisonProduct);

        	});

        	popoverContainer.find('.full-text').hide();

            // size li
//            productsWidth = popoverContainer.find( '.products' ).outerWidth();
//            popoverContainer.find('.products li').css( 'width', productsWidth/3 );
            popoverContainer.find('.products li').css( 'width', '33.333333%' );

            // show/hide comparison panels
        	if(currentComparisons.length === 1) {
        		$(popoverContainer.find('.products li')[1]).find('.empty-text').show();
        		$(popoverContainer.find('.products li')[2]).find('.empty-text').hide();
        	} else if(currentComparisons.length === 2) {
        		$(popoverContainer.find('.products li')[1]).find('.empty-text').hide();
        		$(popoverContainer.find('.products li')[2]).find('.empty-text').show();
        	} else {
        		$(popoverContainer.find('.products li')[1]).find('.empty-text').hide();
        		$(popoverContainer.find('.products li')[2]).find('.empty-text').hide();

        		popoverContainer.find('.full-text').show();
        	}

        	popoverContainer.find('.category').text(container.attr('data-product-category-text'));

            // have to do this because the popover code happens prior to the content being filled outerHeight
            $(popoverContainer.find( '.products li' )[0]).find( 'a' ).focus();

//        	positionPopover();
        	initCompareButton();
        }

        this.EVENT_COMPARISON_ADDED = eventDictionary.compareButton.EVENT_COMPARISON_ADDED;
        this.EVENT_COMPARISON_REMOVED = eventDictionary.compareButton.EVENT_COMPARISON_REMOVED;

        init();
    };

} (jQuery));