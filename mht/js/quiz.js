var Quiz = (function() {
	
	var transitioning = false;

	var isOdd = function(num) {
		// Returns true if the number is odd
		return (num % 2) == 1;
	};
	
	var back = function(id) {
		// console.log('back();');
		$('#back-' + id)/*.swipeRight(function() {
		})*/.click(function() {
			if ($(this).hasClass('active')) {
				if (transitioning == false) {
					transitioning = true;
					if ($('#art-' + id + ' form').hasClass('range')) {
						if (results.answers[id]) {
							results.answers[id].id = questionnaire.questions[id].questionID;
							results.answers[id].answer = $('#q-' + id).val();
							results.answers[id].flipped = questionnaire.questions[id].flipped;
						}
					}
					if ($('#art-' + id + ' form').hasClass('textarea')) {
						if (!results.answers[id]) {
							results.answers.push({
								"id": null,
								"answer": null
							});
						}
						results.answers[id].id = 'comments';
						results.answers[id].answer = $('#comments').val();
					}
					// $('#art-' + id).attr('class', 'o0');
					if ($('html').hasClass('blackberry')) {	// ALERT: Added this condition to accomodate BlackBerrys
						$('#art-' + id).remove();
						currQuest = prevQuest;
						if (currQuest > 0) 
							prevQuest = currQuest - 1;
						else 
							prevQuest = null;
						if (currQuest < lastQuest) 
							nextQuest = currQuest + 1;
						else 
							nextQuest = null;
						typeArt(currQuest);
						transitioning = false;
						window.scrollTo(0, 1);	// ALERT: Moved this up, check with Jason to see if this is what he wants
					} else {
						$('#art-' + id).removeClass('o1').addClass('o0');
						setTimeout(function() {
							$('#art-' + id).remove();
							currQuest = prevQuest;
							if (currQuest > 0) 
								prevQuest = currQuest - 1;
							else 
								prevQuest = null;
							if (currQuest < lastQuest) 
								nextQuest = currQuest + 1;
							else 
								nextQuest = null;
							typeArt(currQuest);
							transitioning = false;
							window.scrollTo(0, 1);	// ALERT: Moved this up, check with Jason to see if this is what he wants
						}, 250);
					}
					/*$('#art-' + id).removeClass('o1').addClass('o0');
					setTimeout(function() {
						$('#art-' + id).remove();
						currQuest = prevQuest;
						if (currQuest > 0) 
							prevQuest = currQuest - 1;
						else 
							prevQuest = null;
						if (currQuest < lastQuest) 
							nextQuest = currQuest + 1;
						else 
							nextQuest = null;
						typeArt(currQuest);
						transitioning = false;
						window.scrollTo(0, 1);	// ALERT: Moved this up, check with Jason to see if this is what he wants
					}, 250);*/
					// window.scrollTo(0, 1);
				}
				
			}
			return false;
		});
	};
	
	var next = function(id) {
		$('#next-' + id).addClass('active')/*.swipeLeft(function() {
		})*/.click(function() {
			if ($(this).hasClass('active')) {
				if (transitioning == false) {
					transitioning = true;
					if ($('#art-' + id + ' form').hasClass('range')) {
						if (results.answers[id]) {
							results.answers[id].id = questionnaire.questions[id].questionID;
							results.answers[id].answer = $('#q-' + id).val();
							results.answers[id].flipped = questionnaire.questions[id].flipped;
						}
					}
					if ($('#art-' + id + ' form').hasClass('textarea')) {
						if (!results.answers[id]) {
							results.answers.push({
								"id": "comments",
								"answer": null
							});
						}
						results.answers[id].id = 'comments';
						results.answers[id].answer = $('#comments').val();
					}
					// $('#art-' + id).attr('class', 'o0');
					if ($('html').hasClass('blackberry')) {	// ALERT: Added this condition to accomodate BlackBerrys
						$('#art-' + id).remove();
						currQuest = nextQuest;
						if (currQuest > 0) 
							prevQuest = currQuest - 1;
						else 
							prevQuest = null;
						if (currQuest < lastQuest) 
							nextQuest = currQuest + 1;
						else 
							nextQuest = null;
						typeArt(currQuest);
						window.scrollTo(0, 1);	// ALERT: Moved this up, check with Jason to see if this is what he wants
						transitioning = false;
					} else {
						$('#art-' + id).removeClass('o1').addClass('o0');
						setTimeout(function() {
							$('#art-' + id).remove();
							currQuest = nextQuest;
							if (currQuest > 0) 
								prevQuest = currQuest - 1;
							else 
								prevQuest = null;
							if (currQuest < lastQuest) 
								nextQuest = currQuest + 1;
							else 
								nextQuest = null;
							typeArt(currQuest);
							window.scrollTo(0, 1);	// ALERT: Moved this up, check with Jason to see if this is what he wants
							transitioning = false;
						}, 250);
					}
					
				}
			}
			return false;
		});
	};
	
	var submit = function(id) {
		$('#art-').attr('id', 'art-' + id);
		$('#back-').attr('id', 'back-' + id);
		back(id);
		// Add the 'pos2' class to the new article
		// $('#art-' + id).addClass(pos);
		// Apply the height to the article wrapper...
		// $('#acWrap').height(height);
		$('#art-' + id + ' .btnSubmit').click(function() {
			results.date = new Date();
			var rJson = JSON.stringify(results);	// ALERT: Stringify function already happening here!!!
			localStorage.setItem('lsResults', rJson);
			// console.log(localStorage.getItem('lsResults'));
			// $('#art-' + id).attr('class', 'o0');
			$('#art-' + id).removeClass('o1').addClass('o0');
			
			// $('#art-' + id).remove();
			// $('header.mht').after(Pages.loading);
			// Resize.setSizes();
			// $('#acWrap').css('height', $('#art-thanks').height() + 'px');
			/*$('#art-loading').show().attr('class', 'o1');
			Middle.init();*/
			setTimeout(function() {
				$('#art-' + id).remove();
				$('header.mht').after(Pages.loading);
				// Resize.setSizes();
				// $('#acWrap').css('height', $('#art-thanks').height() + 'px');
				$('#art-loading').show().attr('class', 'o1');
				Middle.init();
				$.ajax({
					type: 'POST',
					url: 'php/submit.php',
					data: {
						"results": rJson
					},
					// dataType: 'json',
					success: function(message) {
						localStorage.removeItem('lsResults');
						/*if ($('html').hasClass('blackberry')) {	// ALERT: Added this condition to accomodate BlackBerrys
							$('#art-loading').remove();
							$('header.mht').after(Pages.thanks);
							// Resize.setSizes();
							// $('#acWrap').css('height', $('#art-thanks').height() + 'px');
							$('#art-thanks').attr('class', 'o1').show();
							Middle.init();
						} else {
							$('#art-loading').attr('class', 'o0');
							setTimeout(function() {
								$('#art-loading').remove();
								$('header.mht').after(Pages.thanks);
								// Resize.setSizes();
								// $('#acWrap').css('height', $('#art-thanks').height() + 'px');
								$('#art-thanks').show().attr('class', 'o1');
								Middle.init();
							}, 250);
						}*/
						$('#art-loading').attr('class', 'o0');
						setTimeout(function() {
							$('#art-loading').remove();
							$('header.mht').after(Pages.thanks);
							// Resize.setSizes();
							// $('#acWrap').css('height', $('#art-thanks').height() + 'px');
							$('#art-thanks').show().attr('class', 'o1');
							Middle.init();
						}, 250);
					},
					error: function() {
						$('#art-loading').attr('class', 'o0');
						$('header.mht').after(Pages.noConnection);
						$('#art-nc').show().attr('class', 'o1');
					}
				});
			}, 250);
			return false;
		});
		// Show and fade in the header and article wrapper...
		if (loggedIn == false) {
			if ($('html').hasClass('blackberry')) {	// ALERT: Added this condition to accomodate BlackBerrys
				//$('header.mht').attr('class', 'mht o1').show();
			} else {
				//$('header.mht').show().removeClass('o0').addClass('o1');
			}
			// $('header.mht').show().removeClass('o0').addClass('o1');
			loggedIn = true;
		}
		// $('#art-' + id).show().attr('class', 'o1');
		if ($('html').hasClass('blackberry')) {	// ALERT: Added this condition to accomodate BlackBerrys
			$('#art-' + id).attr('class', 'message o1').show();
		} else {
			$('#art-' + id).show().removeClass('o0').addClass('o1');
		}
		// $('#art-' + id).show().removeClass('o0').addClass('o1');
		Middle.init();
		// Set the sizes for the browser contents based on the device\'™s orientation...
		// Resize.setSizes();
	};
	
	var comment = function(id, pos) {
		$('#art-').attr('id', 'art-' + id);
		$('#back-').attr('id', 'back-' + id);
		//$('#next-').attr('id', 'next-' + id);
		back(id);
		next(id);
		// Show and fade in the header and article wrapper...
		if (loggedIn == false) {
			if ($('html').hasClass('blackberry')) {	// ALERT: Added this condition to accomodate BlackBerrys
				//$('header.mht').attr('class', 'mht o1').show();
			} else {
				//$('header.mht').show().removeClass('o0').addClass('o1');
			}
			// $('header.mht').show().removeClass('o0').addClass('o1');
			loggedIn = true;
		}
		// $('#art-' + id).show().attr('class', 'o1');
		if ($('html').hasClass('blackberry')) {	// ALERT: Added this condition to accomodate BlackBerrys
			$('#art-' + id).attr('class', 'o1').show();
		} else {
			$('#art-' + id).show().removeClass('o0').addClass('o1');
		}
		// $('#art-' + id).show().removeClass('o0').addClass('o1');
		if (!results.answers[id]) {
			results.answers.push({
				"id": "comment",
				"answer": ""
			});
		}


		if (results.answers[id].answer != '') {
			$('#comments').val(results.answers[id].answer);
		}

		var tags_arr = new Array();

		$.ajax({
			type: 'POST',
			url: 'php/get_tags.php',
			data: {
				patientID:results.patientID
			},
			success: function(message) {
				tags_arr = jQuery.parseJSON(message);
				$("#tags").autocompleteArray(	tags_arr	);
			},
			error: function() {
			}
		});

		$('.add-tag').click(function(){
			if($('#tags').val() != ''){
				var tag = $('#tags').val();
				$('.tag-container').append('<div class="tag">'+tag+'<span class="tag-close">x</span></div>');
				$('#tags').val('');

				$('.tag-close').click(function(){
					$(this).parent().remove();
					return false;
				});
			}

			return false;
		});

		results.date = new Date();
		var rJson = JSON.stringify(results);	// ALERT: Stringify function already happening here!!!
		localStorage.setItem('lsResults', rJson);

		$('.btnSubmit').click(function() {
			results.date = new Date();
			var rJson = JSON.stringify(results);	// ALERT: Stringify function already happening here!!!
			localStorage.setItem('lsResults', rJson);
			// console.log(localStorage.getItem('lsResults'));
			// $('#art-' + id).attr('class', 'o0');
			$('#art-' + id).removeClass('o1').addClass('o0');
			
			// $('#art-' + id).remove();
			// $('header.mht').after(Pages.loading);
			// Resize.setSizes();
			// $('#acWrap').css('height', $('#art-thanks').height() + 'px');
			/*$('#art-loading').show().attr('class', 'o1');
			Middle.init();*/
			setTimeout(function() {
				$('#art-' + id).remove();
				$('#content').html(Pages.loading);
				// Resize.setSizes();
				// $('#acWrap').css('height', $('#art-thanks').height() + 'px');
				$('#art-loading').show().attr('class', 'o1');
				Middle.init();
				$.ajax({
					type: 'POST',
					url: 'php/submit.php',
					data: {
						"results": rJson
					},
					// dataType: 'json',
					success: function(message) {
						localStorage.removeItem('lsResults');
						/*if ($('html').hasClass('blackberry')) {	// ALERT: Added this condition to accomodate BlackBerrys
							$('#art-loading').remove();
							$('header.mht').after(Pages.thanks);
							// Resize.setSizes();
							// $('#acWrap').css('height', $('#art-thanks').height() + 'px');
							$('#art-thanks').attr('class', 'o1').show();
							Middle.init();
						} else {
							$('#art-loading').attr('class', 'o0');
							setTimeout(function() {
								$('#art-loading').remove();
								$('header.mht').after(Pages.thanks);
								// Resize.setSizes();
								// $('#acWrap').css('height', $('#art-thanks').height() + 'px');
								$('#art-thanks').show().attr('class', 'o1');
								Middle.init();
							}, 250);
						}*/
						$('#art-loading').attr('class', 'o0');
						setTimeout(function() {
							$('#art-loading').remove();
							$('#content').html(Pages.thanks);
							// Resize.setSizes();
							// $('#acWrap').css('height', $('#art-thanks').height() + 'px');
							$('#art-thanks').show().attr('class', 'o1');
							Middle.init();


							$('.end-survey').click(function(){
								window.location.href = 'index.php';
							});

						}, 250);
					},
					error: function() {
						$('#art-loading').attr('class', 'o0');
						$('header.mht').after(Pages.noConnection);
						$('#art-nc').show().attr('class', 'o1');
					}
				});
			}, 250);
			return false;
		});



	};
	
	var other = function(id) {
		
		$('#art-').attr('id', 'art-' + id);
		$('#days-').attr('id', 'days-' + id);
		$('#dayDays-').attr('id', 'dayDays-' + id);
		$('#cq-').attr('id', 'cq-' + id);
		$('#tq-').attr('id', 'tq-' + id);
		$('#p-').attr('id', 'p-' + id);
		
		// var odd = isOdd(id);
		
		/*if (questionnaire.questions[id].flipped == 1) {
			$('#a--0').attr('name', 'a-' + id).attr('id', 'a-' + id + '-0').attr('value', 'Anchor_1');
			$('#label--0').attr('for', 'a-' + id + '-0').attr('id', 'label-' + id + '-0').html(questionnaire.questions[id].anchors[0]);
			
			$('#a--1').attr('name', 'a-' + id).attr('id', 'a-' + id + '-1').attr('value', 'Anchor_0');
			$('#label--1').attr('for', 'a-' + id + '-1').attr('id', 'label-' + id + '-1').html(questionnaire.questions[id].anchors[1]);
		} else {*/
			$('#a--0').attr('name', 'a-' + id).attr('id', 'a-' + id + '-0').attr('value', 'Anchor_0');
			$('#label--0').attr('for', 'a-' + id + '-0').attr('id', 'label-' + id + '-0').html(questionnaire.questions[id].anchors[0]);
			
			$('#a--1').attr('name', 'a-' + id).attr('id', 'a-' + id + '-1').attr('value', 'Anchor_1');
			$('#label--1').attr('for', 'a-' + id + '-1').attr('id', 'label-' + id + '-1').html(questionnaire.questions[id].anchors[1]);
		// }
		
		
		
		$('#back-').attr('id', 'back-' + id);
		$('#next-').attr('id', 'next-' + id);
		if (questionnaire.questions[id].days > 1) {
			$('#days-' + id).html(questionnaire.questions[id].days);
			$('#dayDays-' + id).html('days');
		} else 
			$('#dayDays-' + id).html('day');
		$('#cq-' + id).html(id + 1);
		$('#tq-' + id).html((lastQuest + 1) - 2);
		$('#p-' + id).html(questionnaire.questions[id].stem);
		if (id == 0) 
			$('#back-' + id).remove();
		else 
			back(id);
		$('#next-' + id).click(function() {
			return false;
		});
		// Add the 'pos2' class to the new article
		// $('#art-' + id).addClass(pos);
		// Apply the height to the article wrapper...
		// $('#acWrap').height(height);
		// Show and fade in the header and article wrapper...
		if (loggedIn == false) {
			if ($('html').hasClass('blackberry')) {	// ALERT: Added this condition to accomodate BlackBerrys
				//$('header.mht').attr('class', 'mht o1').show();
			} else {
				$('header.mht').show().removeClass('o0').addClass('o1');
			}
			// $('header.mht').show().removeClass('o0').addClass('o1');
			loggedIn = true;
		}
		// $('#art-' + id).show().attr('class', 'o1');
		if ($('html').hasClass('blackberry')) {	// ALERT: Added this condition to accomodate BlackBerrys
			$('#art-' + id).attr('class', 'o1').show();
		} else {
			$('#art-' + id).show().removeClass('o0').addClass('o1');
		}
		// $('#art-' + id).show().removeClass('o0').addClass('o1');
		if (!results.answers[id]) {
			results.answers.push({
				"id": null,
				"answer": null
			});
		}
		// Run the multiple four choices set-up functionality...
		Mc.init(id);
		// Set the sizes for the browser contents based on the device\'s orientation...
		// Resize.setSizes();
	};
	
	var asrm = function(id) {
		
		$('#art-').attr('id', 'art-' + id);
		$('#days-').attr('id', 'days-' + id);
		$('#dayDays-').attr('id', 'dayDays-' + id);
		$('#cq-').attr('id', 'cq-' + id);
		$('#tq-').attr('id', 'tq-' + id);
		$('#p-').attr('id', 'p-' + id);
		
		// var odd = isOdd(id);
		
		/*if (questionnaire.questions[id].flipped == 1) {
			$('#a--0').attr('name', 'a-' + id).attr('id', 'a-' + id + '-0').attr('value', 'Anchor_4');
			$('#label--0').attr('for', 'a-' + id + '-0').attr('id', 'label-' + id + '-0').html(questionnaire.questions[id].anchors[0]);
			
			$('#a--1').attr('name', 'a-' + id).attr('id', 'a-' + id + '-1').attr('value', 'Anchor_3');
			$('#label--1').attr('for', 'a-' + id + '-1').attr('id', 'label-' + id + '-1').html(questionnaire.questions[id].anchors[1]);
			
			$('#a--3').attr('name', 'a-' + id).attr('id', 'a-' + id + '-3').attr('value', 'Anchor_1');
			$('#label--3').attr('for', 'a-' + id + '-3').attr('id', 'label-' + id + '-3').html(questionnaire.questions[id].anchors[3]);
			
			$('#a--4').attr('name', 'a-' + id).attr('id', 'a-' + id + '-4').attr('value', 'Anchor_0');
			$('#label--4').attr('for', 'a-' + id + '-4').attr('id', 'label-' + id + '-4').html(questionnaire.questions[id].anchors[4]);
		} else {*/
			$('#a--0').attr('name', 'a-' + id).attr('id', 'a-' + id + '-0').attr('value', 'Anchor_0');
			$('#label--0').attr('for', 'a-' + id + '-0').attr('id', 'label-' + id + '-0').html(questionnaire.questions[id].anchors[0]);
			
			$('#a--1').attr('name', 'a-' + id).attr('id', 'a-' + id + '-1').attr('value', 'Anchor_1');
			$('#label--1').attr('for', 'a-' + id + '-1').attr('id', 'label-' + id + '-1').html(questionnaire.questions[id].anchors[1]);
			
			$('#a--3').attr('name', 'a-' + id).attr('id', 'a-' + id + '-3').attr('value', 'Anchor_3');
			$('#label--3').attr('for', 'a-' + id + '-3').attr('id', 'label-' + id + '-3').html(questionnaire.questions[id].anchors[3]);
			
			$('#a--4').attr('name', 'a-' + id).attr('id', 'a-' + id + '-4').attr('value', 'Anchor_4');
			$('#label--4').attr('for', 'a-' + id + '-4').attr('id', 'label-' + id + '-4').html(questionnaire.questions[id].anchors[4]);
		// }
		$('#a--2').attr('name', 'a-' + id).attr('id', 'a-' + id + '-2').attr('value', 'Anchor_2');
		$('#label--2').attr('for', 'a-' + id + '-2').attr('id', 'label-' + id + '-2').html(questionnaire.questions[id].anchors[2]);
		
		
		
		$('#back-').attr('id', 'back-' + id);
		$('#next-').attr('id', 'next-' + id);
		if (questionnaire.questions[id].days > 1) {
			$('#days-' + id).html(questionnaire.questions[id].days);
			$('#dayDays-' + id).html('days');
		} else 
			$('#dayDays-' + id).html('day');
		$('#cq-' + id).html(id + 1);
		$('#tq-' + id).html((lastQuest + 1) - 2);
		$('#p-' + id).html(questionnaire.questions[id].stem);
		if (id == 0) 
			$('#back-' + id).remove();
		else 
			back(id);
		$('#next-' + id).click(function() {
			return false;
		});
		// Add the 'pos2' class to the new article
		// $('#art-' + id).addClass(pos);
		// Apply the height to the article wrapper...
		// $('#acWrap').height(height);
		// Show and fade in the header and article wrapper...
		if (loggedIn == false) {
			if ($('html').hasClass('blackberry')) {	// ALERT: Added this condition to accomodate BlackBerrys
				$('header.mht').attr('class', 'mht o1').show();
			} else {
				$('header.mht').show().removeClass('o0').addClass('o1');
			}
			// $('header.mht').show().removeClass('o0').addClass('o1');
			loggedIn = true;
		}
		// $('#art-' + id).show().attr('class', 'o1');
		if ($('html').hasClass('blackberry')) {	// ALERT: Added this condition to accomodate BlackBerrys
			$('#art-' + id).attr('class', 'o1').show();
		} else {
			$('#art-' + id).show().removeClass('o0').addClass('o1');
		}
		// $('#art-' + id).show().removeClass('o0').addClass('o1');
		if (!results.answers[id]) {
			results.answers.push({
				"id": null,
				"answer": null
			});
		}
		// Run the multiple four choices set-up functionality...
		Mc.init(id);
		// Set the sizes for the browser contents based on the device\'s orientation...
		// Resize.setSizes();
	};

	var qids = function(id) {
		
		$('#art-').attr('id', 'art-' + id);
		$('#days-').attr('id', 'days-' + id);
		$('#dayDays-').attr('id', 'dayDays-' + id);
		$('#cq-').attr('id', 'cq-' + id);
		$('#tq-').attr('id', 'tq-' + id);
		$('#p-').attr('id', 'p-' + id);
		
		/*var odd = isOdd(id);
		
		if (odd) {
			$('#a--0').attr('name', 'a-' + id).attr('id', 'a-' + id + '-0').attr('value', 'Anchor_3');
			$('#label--0').attr('for', 'a-' + id + '-0').attr('id', 'label-' + id + '-0').html(questionnaire.questions[id].anchors[0]);
			
			$('#a--1').attr('name', 'a-' + id).attr('id', 'a-' + id + '-1').attr('value', 'Anchor_2');
			$('#label--1').attr('for', 'a-' + id + '-1').attr('id', 'label-' + id + '-1').html(questionnaire.questions[id].anchors[1]);
			
			$('#a--2').attr('name', 'a-' + id).attr('id', 'a-' + id + '-2').attr('value', 'Anchor_1');
			$('#label--2').attr('for', 'a-' + id + '-2').attr('id', 'label-' + id + '-2').html(questionnaire.questions[id].anchors[2]);
			
			$('#a--3').attr('name', 'a-' + id).attr('id', 'a-' + id + '-3').attr('value', 'Anchor_0');
			$('#label--3').attr('for', 'a-' + id + '-3').attr('id', 'label-' + id + '-3').html(questionnaire.questions[id].anchors[3]);
		} else {*/
			$('#a--0').attr('name', 'a-' + id).attr('id', 'a-' + id + '-0').attr('value', 'Anchor_0');
			$('#label--0').attr('for', 'a-' + id + '-0').attr('id', 'label-' + id + '-0').html(questionnaire.questions[id].anchors[0]);
			
			$('#a--1').attr('name', 'a-' + id).attr('id', 'a-' + id + '-1').attr('value', 'Anchor_1');
			$('#label--1').attr('for', 'a-' + id + '-1').attr('id', 'label-' + id + '-1').html(questionnaire.questions[id].anchors[1]);
			
			$('#a--2').attr('name', 'a-' + id).attr('id', 'a-' + id + '-2').attr('value', 'Anchor_2');
			$('#label--2').attr('for', 'a-' + id + '-2').attr('id', 'label-' + id + '-2').html(questionnaire.questions[id].anchors[2]);
			
			$('#a--3').attr('name', 'a-' + id).attr('id', 'a-' + id + '-3').attr('value', 'Anchor_3');
			$('#label--3').attr('for', 'a-' + id + '-3').attr('id', 'label-' + id + '-3').html(questionnaire.questions[id].anchors[3]);
		// }
		
		
		
		$('#back-').attr('id', 'back-' + id);
		$('#next-').attr('id', 'next-' + id);
		if (questionnaire.questions[id].days > 1) {
			$('#days-' + id).html(questionnaire.questions[id].days);
			$('#dayDays-' + id).html('days');
		} else 
			$('#dayDays-' + id).html('day');
		$('#cq-' + id).html(id + 1);
		$('#tq-' + id).html((lastQuest + 1) - 2);
		$('#p-' + id).html(questionnaire.questions[id].stem);
		if (id == 0) 
			$('#back-' + id).remove();
		else 
			back(id);
		$('#next-' + id).click(function() {
			return false;
		});
		// Add the 'pos2' class to the new article
		// $('#art-' + id).addClass(pos);
		// Apply the height to the article wrapper...
		// $('#acWrap').height(height);
		// Show and fade in the header and article wrapper...
		if (loggedIn == false) {
			if ($('html').hasClass('blackberry')) {	// ALERT: Added this condition to accomodate BlackBerrys
				$('header.mht').attr('class', 'mht o1');
			} else {
				$('header.mht').removeClass('o0').addClass('o1');
			}
			// $('header.mht').show().removeClass('o0').addClass('o1');
			loggedIn = true;
		}
		// $('#art-' + id).show().attr('class', 'o1');
		if ($('html').hasClass('blackberry')) {	// ALERT: Added this condition to accomodate BlackBerrys
			$('#art-' + id).attr('class', 'o1').show();
		} else {
			$('#art-' + id).show().removeClass('o0').addClass('o1');
		}
		// $('#art-' + id).show().removeClass('o0').addClass('o1');
		if (!results.answers[id]) {
			results.answers.push({
				"id": null,
				"answer": null
			});
		}
		// Run the multiple four choices set-up functionality...
		Mc.init(id);

		$('.radioCheck, .label').click(function(){
			$('.row').removeClass('rowActive');
			$(this).parent().addClass('rowActive');
		});
		
		// Set the sizes for the browser contents based on the device\'s orientation...
		// Resize.setSizes();
	};

	var vas = function(id) {
		$('#art-').attr('id', 'art-' + id);
		$('#days-').attr('id', 'days-' + id);
		$('#dayDays-').attr('id', 'dayDays-' + id);
		$('#qcIscroll-').attr('id', 'qcIscroll-' + id);
		$('#cq-').attr('id', 'cq-' + id);
		$('#tq-').attr('id', 'tq-' + id);
		$('#p-').attr('id', 'p-' + id);
		$('#q-').attr('name', 'q-' + id).attr('id', 'q-' + id);
		$('#rl-').attr('id', 'rl-' + id);
		$('#rr-').attr('id', 'rr-' + id);
		$('#back-').attr('id', 'back-' + id);
		$('#next-').attr('id', 'next-' + id);
		/*if (questionnaire.questions[id].days > 1) {
			$('#days-' + id).html(questionnaire.questions[id].days);
			$('#dayDays-' + id).html('days');
		} else 
			$('#dayDays-' + id).html('day');*/
		$('#cq-' + id).html(id + 1);
		$('#tq-' + id).html((lastQuest + 1) - 2);
		$('#p-' + id).html(questionnaire.questions[id].stem);
		/*if (questionnaire.questions[id].flipped == 1) {
			$('#rl-' + id + ' em').html(questionnaire.questions[id].anchors[1]);
			$('#rr-' + id + ' em').html(questionnaire.questions[id].anchors[0]);
		} else {
			$('#rl-' + id + ' em').html(questionnaire.questions[id].anchors[0]);
			$('#rr-' + id + ' em').html(questionnaire.questions[id].anchors[1]);
		}*/
		$('#rl-' + id + ' em').html(questionnaire.questions[id].anchors[0]);
		$('#rr-' + id + ' em').html(questionnaire.questions[id].anchors[1]);
		if (id == 0) 
			$('#back-' + id).remove();
		else 
			back(id);
		if (id <= lastQuest) {
			$('#next-' + id).click(function() {
				return false;
			});
		} else 
			next(id);
		// Add the 'pos2' class to the new article
		// $('#art-' + id).addClass(pos);
		// Apply the height to the article wrapper...
		// $('#acWrap').height(height);
		// Show and fade in the header and article wrapper...
		if (loggedIn == false) {
			if ($('html').hasClass('blackberry')) {	// ALERT: Added this condition to accomodate BlackBerrys
				$('header.mht').attr('class', 'mht o1').show();
			} else {
				$('header.mht').show().removeClass('o0').addClass('o1');
			}
			// $('header.mht').show().removeClass('o0').addClass('o1');
			loggedIn = true;
		}
		// $('#art-' + id).show().attr('class', 'o1');
		if ($('html').hasClass('blackberry')) {	// ALERT: Added this condition to accomodate BlackBerrys
			$('#art-' + id).attr('class', 'o1').show();
		} else {
			$('#art-' + id).show().removeClass('o0').addClass('o1');
		}
		// $('#art-' + id).show().removeClass('o0').addClass('o1');
		// Apply the iScroll functionalty to the range question box...
		var myScroll = new iScroll('qcIscroll-' + id, {
			vScrollbar: false
		});

		
		
		// Run the range set-up functionality...
		Range.init(id);
		// Set the sizes for the browser contents based on the device\'s orientation...
		// Resize.setSizes();
	};
	
	var typeArt = function(id) {
		
			var qstn = questionnaire.questions[id].questionID;
			if (qstn == 'comment') {
				$('#content').html(Pages.comment);
				comment(id);
			} else if (qstn == 'submit') {	// submit
				$('#content').html(Pages.submit);
				submit(id);
			} else {
				var type = qstn.split('_')[0];
				
				if (type == 'VAS') {
					$('#content').html(Pages.range);
					vas(id);
				} else if (type == 'QIDS') {
					$('#content').html(Pages.mc4);
					qids(id);
					
				} else if (type == 'ASRM') {
					$('#content').html(Pages.mc5);
					asrm(id);
				} else /*if (type == 'OTHER') */{
					$('#content').html(Pages.other);
					other(id);
				}
			}

	};

	var startQuiz = function(){

		$('#content').html(Pages.startQuiz);
		$('.start-quiz').show();

		$('.start-survey').click(function(){
			typeArt(currQuest);
		});


		$('#nav-survey').click(function(){
			$('.nav li a').removeClass('active');
			$(this).addClass('active');

			$('#art-loading').removeClass('o1').addClass('o0');
			// After the Loading spinner icon fades out...
			setTimeout(function() {
				// Remove the Loading spinner icon...
				$('#art-loading').remove();
				Quiz.init();
			}, 250);
			return false;
		});

		$('#nav-timeline').click(function(){
			$('.nav li a').removeClass('active');
			$(this).addClass('active');

			//start
			$('#art-loading').removeClass('o1').addClass('o0');
			// After the Loading spinner icon fades out...
			setTimeout(function() {
				// Remove the Loading spinner icon...
				$('#art-loading').remove();
				$('#content').html(Pages.timeline).removeClass('o0').addClass('o1');
				$('#art-timeline').removeClass('o0').addClass('o1').show();
								
				$('html').removeClass('no-js').addClass('js');
				DataVisualizationSelect.init();
				
			}, 250);
			//end

			return false;
		});

		$('#nav-settings').click(function(){
			$('.nav li a').removeClass('active');
			$(this).addClass('active');
			Quiz.settings();
			return false;
		
		});

	};
	
	var init = function() {
		//typeArt(currQuest);
		startQuiz();
		$('header').hide();
		$('footer .nav').show();
		$('footer').css('border','0');
		// typeArt(nextQuest, true, 'pos3');

	};


	var settings = function() {
		$('#art-loading').removeClass('o1').addClass('o0');
		// After the Loading spinner icon fades out...
		setTimeout(function() {
			// Remove the Loading spinner icon...
			$('#art-loading').remove();
			$('#content').html(Pages.settings).removeClass('o0').addClass('o1');
			$('#art-settings').removeClass('o0').addClass('o1').show();

			// settings buttons
			$('.logout-setting').click(function(){
				window.location.href = 'index.php';
			});

			$('.faq-setting').click(function(){

				$('#art-loading').removeClass('o1').addClass('o0');
				setTimeout(function() {
					// Remove the Loading spinner icon...
					$('#art-loading').remove();
					$('#content').html(Pages.faq).removeClass('o0').addClass('o1');
					$('#art-faq').removeClass('o0').addClass('o1').show();

					$('.cancel').click(function(){
						Quiz.settings();
					});

				}, 250);
			});


			$('.about-setting').click(function(){

				$('#art-loading').removeClass('o1').addClass('o0');
				setTimeout(function() {
					// Remove the Loading spinner icon...
					$('#art-loading').remove();
					$('#content').html(Pages.about).removeClass('o0').addClass('o1');
					$('#art-about').removeClass('o0').addClass('o1').show();

					$('.cancel').click(function(){
						Quiz.settings();
					});

					$('.about-contact').click(function(){
							window.location="mailto:pathadmin@sunnybrook.ca";
					});

				}, 250);
			});

			$('.change-setting').click(function(){

				$('#art-loading').removeClass('o1').addClass('o0');
				setTimeout(function() {
					// Remove the Loading spinner icon...
					$('#art-loading').remove();
					$('#content').html(Pages.changePassword).removeClass('o0').addClass('o1');
					$('#art-about').removeClass('o0').addClass('o1').show();

					$('.cancel').click(function(){
						Quiz.settings();
					});

				}, 250);
			});

		}, 250);
	}
	
	return {
		isOdd: isOdd,
		back: back,
		next: next,
		vas: vas,
		typeArt: typeArt,
		init: init,
		settings: settings
	};
	
})();