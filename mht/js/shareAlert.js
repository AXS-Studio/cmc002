var ShareAlert = (function() {

	/*function scrollFunc(e) {
		if (typeof scrollFunc.x == 'undefined') {
			scrollFunc.x = window.pageXOffset;
			scrollFunc.y = window.pageYOffset;
		}
	
		var diffX = scrollFunc.x - window.pageXOffset;
		var diffY = scrollFunc.y - window.pageYOffset;
	
		if (diffX < 0) {
			// Scroll right
		} else if (diffX > 0) {
			// Scroll left
		} else if (diffY < 0) {
			// Scroll down
			$('#sa').css('bottom', '16px');
		} else if (diffY > 0) {
			// Scroll up
			$('#sa').css('bottom', '16px');
		} else {
			// First scroll Event
		}
		scrollFunc.x = window.pageXOffset;
		scrollFunc.y = window.pageYOffset;
	}*/
	
	function removeSa() {
		$('#sa').removeClass('o1').addClass('o0');
		setTimeout(function() {
			$('#sa').remove();
		}, 250);
	}
	
	function dontShow() {
		$('#ds').on('click', function() {
			window.localStorage.setItem('dontShowSa', true);
			removeSa();
			return false;
		});
	}
	
	function closeSa() {
		$('#btnCloseShare').on('click', function() {
			removeSa();
			return false;
		});
	}
	
	/*function posSa() {
		var wh = $(window).height();
		var saHeight = $('#sa').height() + $('#sa div').height();
		var height = (wh - saHeight) - 5;
		$('#sa').css('top', height + 'px');
	}*/
	
	function showSa() {
		if (($('html').hasClass('ios') && !window.navigator.standalone) && (window.localStorage.getItem('dontShowSa') === null)) {
			$('#sa').show().removeClass('o0').addClass('o1');
			closeSa();
			dontShow();
			/*posSa();
			$(window).on('orientationchange', function() {
				posSa();
			});*/
			// window.onscroll = scrollFunc;
		}
	}
	
	var init = function() {
		showSa();
	};
	
	return {
		init: init
	};
	
})();