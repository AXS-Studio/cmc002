var IsCont = (function() {
	
	function loaded() {
		myScroll = new iScroll('qcIscroll');
	}
	
	var init: function() {
		loaded();
	};
	
	return {
		init: init
	};
	
})();