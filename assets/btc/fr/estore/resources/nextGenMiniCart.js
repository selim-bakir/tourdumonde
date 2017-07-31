function getNextApiDomain()
{
	var nextGenDomain = STORE_DOMAIN ;
	var protocal_ = getProtocal();
	// var isPort = "N" == "Y";
	var domain_ = protocal_ + "://" + nextGenDomain;
	
	var port = "";	
	
	// alert(domain_ + port);
	return domain_;
}

// Delete Cart Action Popup
var doCartConfirmPop = function (entryNumber) {
	var f = $("#miniEntryForm" + entryNumber);
	var signCheck = f.find("input[name='signCheck']").val() || f.find("input[name='signCheck']").attr("valueData");
	console.log("signCheck : " + signCheck);
	
	if(signCheck == "Y"){
		$("#btnMoveToWishList").css("display", "inline-block");
	}else{
		$("#btnMoveToWishList").css("display", "none");
	}
	nextViewPopup('#popup_delete_product_cart');
	
	$("#miniEntryNumber").val(entryNumber);
	$("#miniEntryNumber").attr("valueData", entryNumber);
	$("#cartConfirmCreation").val('miniCart');	
	$("#isRightCartPage").val('');	
}

// Update Cart Count
function updateTotalCartCount(cnt)
{
	var pattern = /^[0-9]+$/;
	if(!pattern.test(cnt)) cnt = 0;
	$('#globalCartCount').text(cnt);
	//$("#ss_cart>.cartbutton>.cartnum").text(cnt);
}

// Hide minicart
function hideMiniCart()
{
	$('#ss_cart .item').removeClass("show");
	navigation.miniCartHide();	
	//navigation.clearNav();	
}

// View Popup Layer
function nextViewPopup(v)
{
	var obj=$("#"+v.split("#")[1]);

	//navigation.clearNav();

	$(".layer_popup, .layer_popup_ng").hide();
	obj.parent().show();
	// alert($(".lightbox-skrim").length);
	if($(".lightbox-skrim").length < 1){
		// alert("test");
		$("body").append("<div class=\"lightbox-skrim\"></div>");
	}
	$(".lightbox-skrim").show();
	// popAlign(obj.attr("id"));
	var layer = document.getElementById(obj.attr("id"));
	console.log(layer);
	
	//layer.popAlign();
	setTimeout(function(){layer.popAlign();}, 100);
	
	return false;
}

// Hide Popup Layer
function hidePopup()
{
	$(".layer_popup, .layer_popup_ng").hide();
	$(".lightbox-skrim").hide(); 
	//navigation.clearNav();	
	return false;
}

// Show Gloval Error Message
function viewGlovalMessagePopup(message)
{
	var obj = $("#gloval_message_popup");
	obj.find(".msg-text").text(message);	
	nextViewPopup("#"+obj.attr("id"));
	obj.find(".pop-btn>.button").click(function(){
		hidePopup();
		return false;
	});
}

function getProtocal()
{
	var url = document.location.href;
	var protocal = url.split("://")[0];
	return protocal;
}

// Call Minicart List API
function getNextGenMiniCartList(ss_cart_item, cart_list_wrap, func)
{	
	$.ajax({
		type: "GET",
		url : getNextApiDomain()+"/fr/ng/p4v1/getMiniCartList",
		jsonp: "callback",
		dataType:"jsonp",
		success : function(result){
			var resultCode = result.resultCode;
			var resultMessage = result.resultMessage;
			var cartCount = 0;

			try{
				cartCount = result.cartCount;				
			}catch (e){
				cartCount = 0;
			}
			updateTotalCartCount(cartCount);
			
			if(resultCode != "0000")
			{
				if(resultCode == "2100"){
					window.location.href=getNextApiDomain() + "/fr/ng/logout";
					// alert(getNextApiDomain() + "/ng/logout");
				}else{
				viewGlovalMessagePopup(resultMessage);
				ss_cart_item.removeClass("show");
				}
			}else{
				var cartlist = result.result;											
				cart_list_wrap.html(cartlist);

				miniCartResult = true;
				func();
			}

			// omni tagging
			$("#shop-button-9").click(function(){
				var link = $(this).attr("href");
				if(link != undefined && link !=""){
					var productResult = "";
					$("input[name^='productName']").each(function(){
						try{
							var productValue = $(this).val() || $(this).attr("valueData");
							
							if(productValue != undefined && productValue != ""){
								productResult += (productResult != "") ? "," : "";
								productResult += ";";								
								productResult += productValue;			
							}
							
						}catch(e){console.log(e);}
					});
					try{
						//sendScView(productResult);
						console.log('result:' + productResult);
					}catch(e){console.log(e);}
					
					
				}				
				return true;
			});
		},
		error : function(json){			
			var resultMessage = "Bad Request. Some or all of the data provided is invalid. Please contact VOC Center. (0330-7267467)";
			viewGlovalMessagePopup(resultMessage);
			ss_cart_item.removeClass("show");
		}
	});
	
}

// Call Delete Cart (move to wishlist) API 
function removeConfirmButton(moveWishList) {	
	var entryNumber = $("#miniEntryNumber").val() || $("#miniEntryNumber").attr("valueData");	
	// alert(entryNumber);
	var productCode = $('#miniEntryForm' + entryNumber).find("input[name^='productCode']").val() || $('#miniEntryForm' + entryNumber).find("input[name^='productCode']").attr("valueData");	
	var productName = $('#miniEntryForm' + entryNumber).find("input[name^='productName']").val() || $('#miniEntryForm' + entryNumber).find("input[name^='productName']").attr("valueData");

	// var f = $('#miniEntryForm' + entryNumber).serialize()+"&moveWishList="+moveWishList;
	var f = "productCode=" + productCode + 	"&moveWishList="+moveWishList;
	console.log('productCode : '+productName);

	// omni tagging
	if(moveWishList == "Y"){
		try { sendClickCode('wish_list', 'wish list:add'); } catch (e) {}
	}else{
		try { sendScRemove(";" + productName); } catch (e) {}		
	}

	// hide popup
	$(".layer_popup, .layer_popup_ng").hide();

	$.ajax({
		url: getNextApiDomain()+"/fr/ng/p4v1/delMiniCartItem",
		data: f,
		jsonp: "callback",
		dataType:"jsonp",
		type: 'GET',
		success: function (result)
		{
			var resultCode = result.resultCode;
			var resultMessage = result.resultMessage;
			var cartCount = 0;

			try{
				cartCount = result.cartCount;				
			}catch (e){
				cartCount = 0;
			}

			if(resultCode != "0000"){
				viewGlovalMessagePopup(resultMessage);
			}
			updateTotalCartCount(cartCount);
			hidePopup();
			hideMiniCart();
			// navigation.clearNav();
			if(moveWishList == "Y"){
				var resultMessage = "Le produit a été ajouté à < Mes envies >";
				viewGlovalMessagePopup(resultMessage);
			}

		},
		error: function (xht, textStatus, ex)
		{			
			var resultMessage = "Bad Request. Some or all of the data provided is invalid. Please contact VOC Center. (0330-7267467)";
			viewGlovalMessagePopup(resultMessage);
			hideMiniCart();
		}	
	});
	return false;
}