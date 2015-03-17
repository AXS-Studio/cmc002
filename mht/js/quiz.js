var quizInProgress = false;

var Quiz = (function() {

    var transitioning = false;

    var isOdd = function(num) {
        // Returns true if the number is odd
        return (num % 2) == 1;
    };

    var back = function(id) {
        console.log('back();');

        $('#back-' + id)
        /*.swipeRight(function() {
		})*/
        .click(function() {
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
                    if ($('html').hasClass('blackberry')) { // ALERT: Added this condition to accomodate BlackBerrys
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
                        window.scrollTo(0, 1); // ALERT: Moved this up, check with Jason to see if this is what he wants
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
                            window.scrollTo(0, 1); // ALERT: Moved this up, check with Jason to see if this is what he wants
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
        $('#next-' + id).addClass('active')
        /*.swipeLeft(function() {
		})*/
        .click(function() {
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
                            results.answers.push({
                                "id": "tags",
                                "answer": null
                            });
                        }
                        results.answers[id].id = 'comments';
                        results.answers[id].answer = $('#comments').val();
                    }
                    // $('#art-' + id).attr('class', 'o0');
                    if ($('html').hasClass('blackberry')) { // ALERT: Added this condition to accomodate BlackBerrys
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
                        window.scrollTo(0, 1); // ALERT: Moved this up, check with Jason to see if this is what he wants
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
                            window.scrollTo(0, 1); // ALERT: Moved this up, check with Jason to see if this is what he wants
                            transitioning = false;
                        }, 250);
                    }

                }
            }
            return false;
        });

    };

    var comment = function(id, pos) {
        $('#art-').attr('id', 'art-' + id);
        $('#back-').attr('id', 'back-' + id);
        //$('#next-').attr('id', 'next-' + id);
        back(id);
        next(id);
        // Show and fade in the header and article wrapper...
        if (loggedIn == false) {
            if ($('html').hasClass('blackberry')) { // ALERT: Added this condition to accomodate BlackBerrys
                //$('header.mht').attr('class', 'mht o1').show();
            } else {
                //$('header.mht').show().removeClass('o0').addClass('o1');
            }
            // $('header.mht').show().removeClass('o0').addClass('o1');
            loggedIn = true;
        }
        // $('#art-' + id).show().attr('class', 'o1');
        if ($('html').hasClass('blackberry')) { // ALERT: Added this condition to accomodate BlackBerrys
            $('#art-' + id).attr('class', 'o1').show();
        } else {
            $('#art-' + id).show().removeClass('o0').addClass('o1');
        }
        // $('#art-' + id).show().removeClass('o0').addClass('o1');
        if (!results.answers[id]) {
            results.answers.push({
                "id": "comments",
                "answer": ""
            });
            results.answers.push({
                "id": "tags",
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
                patientID: results.patientID
            },
            success: function(message) {
                tags_arr = jQuery.parseJSON(message);

                if (tags_arr != null)
                $( "#tags" ).autocomplete({
      				source: tags_arr, 
    			});
            },
            error: function() {}
        });

        $('.add-tag').click(function() {
            if ($('#tags').val() != '') {

                //Strip illegal characters
                var regex = /[^\w-]/gi; //only allow alpha numeric ( a-z, A-Z, 0-9), hypen and underscore
                var tag = $('#tags').val().replace(regex, '');//Strip unwanted characters

                //Search if there is another tag with the same case in tag_arr
                // Iterate over tag_arr, select the first elements that equalsIgnoreCase the "tag" value                
                if (tags_arr!=null){
                    $.each(tags_arr, function(index, value) { 
                      if ( value.toLowerCase()=== tag.toLowerCase() ) {
                        tag = value;
                        //return false; //break
                      }
                    });
                }

                if (tag != '')
                    $('.tag-container').append('<div class="tag">' + tag + '<span class="tag-close">x</span></div>');

                $('#tags').val('');

                $('.tag-close').click(function() {
                    $(this).parent().remove();
                    return false;
                });
            }

            return false;
        });

        // results.date = new Date();
        // var rJson = JSON.stringify(results); // ALERT: Stringify function already happening here!!!
        // localStorage.setItem('lsResults', rJson);

        $('.btnSubmit').click(function() {

            //Cindy: Add in comments from textarea, and tags with class .tag
            for (i = 0; i < results.answers.length; i++) {
                if (results.answers[i].id == "comments")
                    results.answers[i].answer = $('#comments').val();

                if (results.answers[i].id == "tags") {
                    var $tag_object = $(".tag");
                    $tag_object.each(function(index, value) {
                        results.answers[i].answer += " " + $(this).text().slice(0, -1); //remove x at the end
                    });
                    results.answers[i].answer = results.answers[i].answer.substring(1); //remove space at the beginning
                }
            } //end for

            results.date = new Date();
            var rJson = JSON.stringify(results); // ALERT: Stringify function already happening here!!!
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
                $('#content_quiz').html(Pages.loading);
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
                            $('#content_quiz').html(Pages.thanks);

                            // Resize.setSizes();
                            // $('#acWrap').css('height', $('#art-thanks').height() + 'px');
                            $('#art-thanks').show().attr('class', 'o1');
                            Middle.init();

                            quizInProgress = false;

                            $('.end-survey').click(function() {
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


        $('#a--0').attr('name', 'a-' + id).attr('id', 'a-' + id + '-0').attr('value', 'Anchor_0');
        $('#label--0').attr('for', 'a-' + id + '-0').attr('id', 'label-' + id + '-0').html(questionnaire.questions[id].anchors[0]);

        $('#a--1').attr('name', 'a-' + id).attr('id', 'a-' + id + '-1').attr('value', 'Anchor_1');
        $('#label--1').attr('for', 'a-' + id + '-1').attr('id', 'label-' + id + '-1').html(questionnaire.questions[id].anchors[1]);

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
            if ($('html').hasClass('blackberry')) { // ALERT: Added this condition to accomodate BlackBerrys
                //$('header.mht').attr('class', 'mht o1').show();
            } else {
                $('header.mht').show().removeClass('o0').addClass('o1');
            }
            // $('header.mht').show().removeClass('o0').addClass('o1');
            loggedIn = true;
        }
        // $('#art-' + id).show().attr('class', 'o1');
        if ($('html').hasClass('blackberry')) { // ALERT: Added this condition to accomodate BlackBerrys
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


        $('.radioCheckInput, .labelInput').click(function() {
            $('.row').removeClass('rowActive');
            $(this).parent().parent().addClass('rowActive');
        });
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


        $('#a--0').attr('name', 'a-' + id).attr('id', 'a-' + id + '-0').attr('value', 'Anchor_0');
        $('#label--0').attr('for', 'a-' + id + '-0').attr('id', 'label-' + id + '-0').html(questionnaire.questions[id].anchors[0]);

        $('#a--1').attr('name', 'a-' + id).attr('id', 'a-' + id + '-1').attr('value', 'Anchor_1');
        $('#label--1').attr('for', 'a-' + id + '-1').attr('id', 'label-' + id + '-1').html(questionnaire.questions[id].anchors[1]);

        $('#a--2').attr('name', 'a-' + id).attr('id', 'a-' + id + '-2').attr('value', 'Anchor_2');
        $('#label--2').attr('for', 'a-' + id + '-2').attr('id', 'label-' + id + '-2').html(questionnaire.questions[id].anchors[2]);

        $('#a--3').attr('name', 'a-' + id).attr('id', 'a-' + id + '-3').attr('value', 'Anchor_3');
        $('#label--3').attr('for', 'a-' + id + '-3').attr('id', 'label-' + id + '-3').html(questionnaire.questions[id].anchors[3]);

        $('#a--4').attr('name', 'a-' + id).attr('id', 'a-' + id + '-4').attr('value', 'Anchor_4');
        $('#label--4').attr('for', 'a-' + id + '-4').attr('id', 'label-' + id + '-4').html(questionnaire.questions[id].anchors[4]);


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
            if ($('html').hasClass('blackberry')) { // ALERT: Added this condition to accomodate BlackBerrys
                $('header.mht').attr('class', 'mht o1').show();
            } else {
                $('header.mht').show().removeClass('o0').addClass('o1');
            }
            // $('header.mht').show().removeClass('o0').addClass('o1');
            loggedIn = true;
        }
        // $('#art-' + id).show().attr('class', 'o1');
        if ($('html').hasClass('blackberry')) { // ALERT: Added this condition to accomodate BlackBerrys
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


        $('.radioCheckInput, .labelInput').click(function() {
            $('.row').removeClass('rowActive');
            $(this).parent().parent().addClass('rowActive');
        });
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


        $('#a--0').attr('name', 'a-' + id).attr('id', 'a-' + id + '-0').attr('value', 'Anchor_0');
        $('#label--0').attr('for', 'a-' + id + '-0').attr('id', 'label-' + id + '-0').html(questionnaire.questions[id].anchors[0]);

        $('#a--1').attr('name', 'a-' + id).attr('id', 'a-' + id + '-1').attr('value', 'Anchor_1');
        $('#label--1').attr('for', 'a-' + id + '-1').attr('id', 'label-' + id + '-1').html(questionnaire.questions[id].anchors[1]);

        $('#a--2').attr('name', 'a-' + id).attr('id', 'a-' + id + '-2').attr('value', 'Anchor_2');
        $('#label--2').attr('for', 'a-' + id + '-2').attr('id', 'label-' + id + '-2').html(questionnaire.questions[id].anchors[2]);

        $('#a--3').attr('name', 'a-' + id).attr('id', 'a-' + id + '-3').attr('value', 'Anchor_3');
        $('#label--3').attr('for', 'a-' + id + '-3').attr('id', 'label-' + id + '-3').html(questionnaire.questions[id].anchors[3]);

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
            if ($('html').hasClass('blackberry')) { // ALERT: Added this condition to accomodate BlackBerrys
                $('header.mht').attr('class', 'mht o1');
            } else {
                $('header.mht').removeClass('o0').addClass('o1');
            }
            // $('header.mht').show().removeClass('o0').addClass('o1');
            loggedIn = true;
        }
        // $('#art-' + id).show().attr('class', 'o1');
        if ($('html').hasClass('blackberry')) { // ALERT: Added this condition to accomodate BlackBerrys
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

        $('.radioCheckInput, .labelInput').click(function() {
            $('.row').removeClass('rowActive');
            $(this).parent().parent().addClass('rowActive');
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
            if ($('html').hasClass('blackberry')) { // ALERT: Added this condition to accomodate BlackBerrys
                $('header.mht').attr('class', 'mht o1').show();
            } else {
                $('header.mht').show().removeClass('o0').addClass('o1');
            }
            // $('header.mht').show().removeClass('o0').addClass('o1');
            loggedIn = true;
        }
        // $('#art-' + id).show().attr('class', 'o1');
        if ($('html').hasClass('blackberry')) { // ALERT: Added this condition to accomodate BlackBerrys
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
        if (qstn == 'comments') {
            $('#content_quiz').html(Pages.comment);
            comment(id);
        } else if (qstn == 'submit') { // submit
            $('#content_quiz').html(Pages.submit);
            submit(id);
        } else {
            var type = qstn.split('_')[0];

            if (type == 'VAS') {
                $('#content_quiz').html(Pages.range);
                vas(id);
            } else if (type == 'QIDS') {
                $('#content_quiz').html(Pages.mc4);
                qids(id);

            } else if (type == 'ASRM') {
                $('#content_quiz').html(Pages.mc5);
                asrm(id);
            } else /*if (type == 'OTHER') */ {
                $('#content_quiz').html(Pages.other);
                other(id);
            }
        }

        $(":checked").parent().parent().addClass('rowActive');

    };


    var startQuiz = function() {

        $('#page_login').hide();
        $('#page_quiz').show();
        $('.forgot').hide();

        $('.nav li a').removeClass('active');
        $('#nav-survey').addClass('active');

        $('#content_quiz').html(Pages.startQuiz);
        $('.start-quiz').show();
        $('.start-survey').click(function() {

            //Cindy: Put call to download questionnaire and start session here
            setTimeout(function() {

                //Submit the Ajax for the login form...
                $.ajax({
                    type: 'POST',
                    url: './php/query_questionnaire.php',
                    data: results,
                    dataType: 'json',
                    success: function(json) {

                        questionnaire = json;

                        console.log("This is results", results);
                        console.log("This is questionnaire", questionnaire);

                        if (questionnaire.questions.length < 1) {
                            $('#art-loading').removeClass('o1').addClass('o0');
                            setTimeout(function() {
                                // Remove the Loading spinner icon...
                                $('#art-loading').remove();
                                // Add the logged in header and the article wrapper to the beginning of the <body>...
                                $('body').prepend(Pages.sbHeader);
                                // Apply a height style to the new header (didn\'t take from the CSS for some reason)...
                                $('header.mht').css({
                                    height: '0px',
                                    display: 'none'
                                });

                                //$('header.mht').show().removeClass('o0').addClass('o1');
                                $('header.mht').after(Pages.noQuestions);
                                $('#art-nq').show().attr('class', 'o1');
                                Middle.init();
                            }, 250);
                        } else {
                            results.patientID = questionnaire.patientID;
                            results.sessionID = questionnaire.sessionID;
                            if (questionnaire.randomize == 1)
                                questionnaire.questions = fisherYates(questionnaire.questions);
                            if (questionnaire.flip == 1) {
                                $.each(questionnaire.questions, function(i, q) {
                                    var type = q.questionID.split('_')[0];
                                    if (type == 'VAS') {
                                        q["flipped"] = null;
                                        q.flipped = Math.round(Math.random());
                                        if (q.flipped == 1)
                                            q.anchors.reverse();
                                    }
                                });
                            }
                            questionnaire.questions.push({
                                "questionID": "comments"
                            }, {
                                "questionID": "submit"
                            });
                            currQuest = 0;
                            nextQuest = 1;
                            lastQuest = questionnaire.questions.length - 1;
                            // Fade out the Loading spinner icon...
                            $('#art-loading').removeClass('o1').addClass('o0');
                            // After the Loading spinner icon fades out...
                            setTimeout(function() {

                                //After AJAX call sucessful, continue here...
                                typeArt(currQuest);
                                quizInProgress = true;

                            }, 250);
                        }

                    },
                    error: function() {
                        window.alert('Cannot connect to the MHTVP server to load survey. Please check your internet connection.');
                        //rerunLogin('cantConnect');
                    }
                });
            }, 250);

            // //After AJAX call sucessful, continue here...
            // typeArt(currQuest);
            // quizInProgress = true;
        });

        //console.log("Started the quiz");

    };

    var init = function() {
        //typeArt(currQuest);
        startQuiz();
        $('header').hide();
        $('footer .nav').show();
        /* 		$('footer').css('border','0'); */
        // typeArt(nextQuest, true, 'pos3');

    };

    function fisherYates(myArray) {
        var i = myArray.length;
        if (i == 0)
            return false;
        while (--i) {
            var j = Math.floor(Math.random() * (i + 1));
            var tempi = myArray[i];
            var tempj = myArray[j];
            myArray[i] = tempj;
            myArray[j] = tempi;
        }
        return myArray;
    }

    return {
        isOdd: isOdd,
        back: back,
        next: next,
        vas: vas,
        typeArt: typeArt,
        init: init
        //settings: settings
    };

})();