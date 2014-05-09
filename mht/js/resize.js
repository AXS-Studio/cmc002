var Resize = (function() {
	
	var setHeight = function() {
		var artHeight = 0;
		$('article').each(function() {
			// console.log('height: ' + $(this).height() + 'px');
			if ($(this).height() > artHeight) {
				artHeight = $(this).height();
			}
		});
		return artHeight + 6;
	}
	
	var setSizes = function() {
		width = $(window).width();
		height = setHeight();
		pos2 = width;
		pos3 = width * 2;
		$('#acWrap').width(width).height(height);
		$('#ac').width(width * 3);
		$('#ac').css('left', (0 - width) + 'px');
		$('#ac article').width(width - 40);
		$('#ac article.pos1').css('left', pos1 + 'px');
		$('#ac article.pos2').css('left', pos2 + 'px');
		$('#ac article.pos3').css('left', pos3 + 'px');
	}
	
	var init = function() {
		// setSizes();
		$(window).on('orientationchange', function() {
			// setSizes();
		});
	};
	
	return {
		setHeight: setHeight,
		setSizes: setSizes,
		init: init
	};
	
})();