var Mc = (function() {
	
	function checkMc(curr) {
		$('#art-' + curr + ' form.radioButtons fieldset input[type="radio"]').each(function() {
			var $radio = $(this);
			if ($radio.val() == results.answers[curr].answer) {	// ALERT: Stopped here
				$radio.attr('checked', 'checked');
				Quiz.next(curr);
			}
			$radio.click(function() {
				if (!results.answers[curr]) {
					results.answers.push({
						"id": null,
						"answer": null
					});
				}
				results.answers[curr].id = questionnaire.questions[curr].questionID;
				results.answers[curr].answer = $radio.val();
				if (!$('#next-' + curr).hasClass('active')) 
					Quiz.next(curr);
			});
		});
	}
	
	var init = function(curr) {
		checkMc(curr);
	};
	
	return {
		init: init
	};
	
})();