var PreloadGraphics = (function() {
	
	var graphics = [
		'slider_bar_252.png',
		'slider_button_61.png',
		'checkmark_shadow.png',
		'anchor_box_arrow_left.png',
		'anchor_box_arrow_right.png',
		'arrow_grey_back.png',
		'arrow_blue_back.png',
		'arrow_grey_next.png',
		'arrow_blue_next.png',
		'button_shareAlert_close.png',
		'icon_share_arrow.png',
		'ajax-loader.gif',
		'MHT_logo.png',
		'Sunnybrook_logo.png'
	];
	
	function preload() {
		$('body').append('<div id="plg"></div>')
		for (var i = 0; i < graphics.length; i++) {
			$('#plg').append('<img src="images/' + graphics[i] + '">');
		}
	}
	
	var init = function() {
		preload();
	};
	
	return {
		init: init
	};
	
})();