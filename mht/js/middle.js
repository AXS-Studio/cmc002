var Middle = (function() {

	function heightAuto() {
		$('article.login').css('height', 'auto');
	}

	var destroyMiddle = function() {
		heightAuto();
		$(window).on('orientationchange', function() {
			heightAuto();
		});
	};
	
	function position() {
		var winHeight = $(window).height();
		var headHeight = $('header').height();
		if (headHeight == null) 
			headHeight = 0;
		var middleHeight = $('#middle').height();
		var offset = Math.round((winHeight - middleHeight) / 2) - 40;
		
		$('article.login, article.message, div.message, #art-loading, #art-thanks, #art-forgot, #art-fgThanks, #art-nc, #art-nq').css('height', ((winHeight - headHeight) - 40) + 'px');
		
		// $('article').css('height', ((winHeight - headHeight) - 40) + 'px');
		$('#middle').css('margin-top', (0 - Math.round(middleHeight / 2)) + 'px');
	}
	
	var init = function() {
		position();
		$(window).on('orientationchange', function() {
			position();
		});
		$(window).resize(function() {
			position();
		});
	};
	
	return {
		destroyMiddle: destroyMiddle,
		init: init
	};
	
})();