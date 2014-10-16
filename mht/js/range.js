var Range = (function() {
	

	
	// Sets the value for the hidden range meter...
	function rangeVal(id) {
		var val = Math.round(parseInt($('#g-' + id).css('left').split('px')[0]) / 2.52);
		if (questionnaire.questions[parseInt(id.split('-')[1])].flipped == 1) 
			val = 100 - val;
		$('#' + id).val(val);
	}
	
	function adjLp(leftPos) {
		if (leftPos <= 5) 
			leftPos = 1;
		else if (leftPos >= 247) 
			leftPos = 251;
		return leftPos;
	}
	
	// Offset function to center the position of the DOM range grip...
	function left($ele, event, touch) {
		// console.log($ele);
		var offset = $ele.offset();
		var leftPos;
		if (touch) {
			var tEvent = event.originalEvent.touches.item(0);
			leftPos = tEvent.clientX - offset.left;
		} else {
			leftPos = event.pageX - offset.left;
		}
		// console.log(leftPos);
		return leftPos;
	}
	
	/*
		changeRange() updates the range value if the user continues to slide the 
		DOM range meter...
	*/
	function changeRange(id) {
		if (!$('html').hasClass('bbNoTouch') && !$('html').hasClass('desktop')) {	// Touch device
			$('#' + id).on('touchstart', function(event) {
				event.preventDefault();
			}).on('touchmove', function(event) {
				var $rb = $(this).parent();
				var leftPos = left($rb, event, true);
				if (leftPos >= 0 && leftPos <= $rb.width()) {
					leftPos = adjLp(leftPos);
					// console.log(leftPos + 'px');
					$(this).css('left', leftPos + 'px');
				}
			}).on('touchend', function() {
				rangeVal(id.split('g-')[1]);
			});
			
		} else if ($('html').hasClass('desktop')) { //Desktop

				clicking = false;
		
			$('#' + id).mousedown(function(event) {
				//event.preventDefault();
				clicking = true;
			});
			
			//Set a bigger area to capture mouse-move, if user drags too fast
			$('#' + id).mousemove(function(event) { //"#content_quiz" -- switched 10-16-2014 mk
				if(clicking) {
					// var $rb = $('#' + id).parent();  -- switched 10-16-2014 mk
					var $rb = $(this).parent();
					var leftPos = left($rb, event, false);
					if (leftPos >= 0 && leftPos <= $rb.width()) {
						leftPos = adjLp(leftPos);
						// $('#' + id).css('left', leftPos + 'px');
						$(this).css('left', leftPos + 'px');
					}
				}//end clicking
			});
			
			//Even bigger area to capture mouse-up
			$('#' + id).mouseup(function() { //document
				if(clicking) {
					rangeVal(id.split('g-')[1]);
					clicking = false;
				}
			});

			$('#' + id).mouseleave(function() { //"#content_quiz"
				if(clicking) {
					rangeVal(id.split('g-')[1]);
					clicking = false;
				}
			});
		} else {	// BlackBerry that doesn\'t support touch or desktop browser
			// window.alert('BlackBerry no touch.');
			$('#rb-' + id.split('g-')[1]).on('click', function(event) {
				var leftPos = left($(this), event, false);
				if (leftPos >= 0 && leftPos <= $(this).width()) {
					leftPos = adjLp(leftPos);
					$('#g-' + id.split('g-')[1]).css('left', leftPos + 'px');
					rangeVal(id.split('g-')[1]);
				}
			});
		}
	}
	
	/*
		setRange() sets the original value of the DOM version and removes the 
		invisible bar in front of it...
	*/
	function setRange(curr, id) {
		if (!$('html').hasClass('bbNoTouch') && !$('html').hasClass('desktop')) {	// Touch device
			$('#nv-' + id).on('touchstart', function(event) {
				if (!results.answers[id]) {
					results.answers.push({
						"id": null,
						"answer": null,
						"flipped": null
					});
				}
				var leftPos = left($(this), event, true);
				if (leftPos >= 0 && leftPos <= $('#rb-' + id).width()) 
					leftPos = adjLp(leftPos);
				$(this).remove();
				$('#g-' + id).css({
					left: leftPos + 'px'
				});
				rangeVal(id);
				changeRange('g-' + id);
				$('#g-' + id).attr('class', 'grip op1');
				setTimeout(function() {
					var quest = parseInt(id.split('-')[1]);
					Quiz.next(quest);
				}, 1000);
			});
		} else {	// BlackBerry that doesn\'t support touch or desktop browser
			// window.alert('BlackBerry no touch.');
			
			
			$('#nv-' + id).on('click', function(event) {
				if (!results.answers[id]) {
					results.answers.push({
						"id": null,
						"answer": null,
						"flipped": null
					});
				}
				var leftPos = left($(this), event, false);
				if (leftPos >= 0 && leftPos <= $('#rb-' + id).width()) 
					leftPos = adjLp(leftPos);
				// leftPos = leftPos - ($('#g-' + id).width() / 2);
				$(this).remove();
				$('#g-' + id).css({
					left: leftPos + 'px'
				});
				rangeVal(id);
				changeRange('g-' + id);
				$('#g-' + id).attr('class', 'grip op1');
				setTimeout(function() {
					var quest = parseInt(id.split('-')[1]);
					Quiz.next(quest);
				}, 1000);
			});
			
		}
	}
	
	/*
		createRange() creates the DOM version of a range meter, however 
		remember that the grip is hidden and the range meter has an 
		invisible bar in front of it...
	*/
	function createRange(curr) {
		$('#art-' + curr + ' form.range fieldset input[type="range"]').each(function() {
			var id = $(this).attr('id');
			$(this).hide();
			if (!results.answers[curr]) {
				$(this).after('<div class="rangeBar" id="rb-' + id + '">\
					<div class="whiteEdgeRight">&nbsp;</div>\
					<div class="grip op0" id="g-' + id + '" style="left: ' + (Math.round($(this).val() * 2.52)) + 'px;">&nbsp;</div>\
				</div>\
				<div class="noVal" id="nv-' + id + '">&nbsp;</div>');
				setRange(curr, id);
			} else {
				$(this).val(results.answers[curr].answer);
				var val = (questionnaire.questions[curr].flipped == 1) ? (100 - results.answers[curr].answer) : results.answers[curr].answer;
				var value = val * 2.52;
				if (value == 252) 
					value = 251;
				// console.log(value);
				$(this).after('<div class="rangeBar" id="rb-' + id + '">\
					<div class="grip op1" id="g-' + id + '" style="left: ' + value + 'px;">&nbsp;</div>\
				</div>');
				changeRange('g-' + id);
				Quiz.next(curr);
			}
		});
	}
	
	var init = function(curr) {
		createRange(curr);
	};
	
	return {
		init: init
	};
	
})();