/*
$("#menubtn").live('click', function(e){
	//if ($("#scs").css('display') == 'inline-block'){
	//	$("#scs").css('display', 'none');
	//	$("#scs").removeAttr('style');
	//}else{
	//	$("#scs").css('display', 'inline-block');
	//}
	
	if ($("#scs").hasClass('comeBack')){
		$("#scs").removeClass('comeBack');
		$("#scs").addClass('goAway');
	}else{
		$("#scs").removeClass('goAway');
		$("#scs").addClass('comeBack');
	}
	return false;
});
*/

var graphMenuActive = false;
var graphColors = new Array();

var initGraphMenu =(function() {

	if(graphMenuActive) return;
	graphMenuActive = true;
	
	var graphMenuWidth =  $(document).width() - ( $(document).width() *0.15) + 10;// $('#graph-menu').width() + 10;
	graphMenuWidth = -graphMenuWidth;

	$('#graph-menu').css({
	"right" : graphMenuWidth,
	"display" : "block"
	});
	
	$(".tab").click(function(e) {
		$(".tab").removeClass('selected');
		$(".tab_content").removeClass('active');
		
		$(this).addClass('selected');
		
		var modID = "#" + $(this).attr("id") + "_content";
		$(modID).addClass('active');
	})

	$(".btnmenu.external").click(function(e) {
		$('#graph-menu').animate({right: '0'});
	});
	
	$(".btnmenu.internal").click(function(e) {
		$('#graph-menu').animate({right: graphMenuWidth});
	});
	
	$(".forgot").hide();
	
	$("footer .nav").show();
	
	
	$('#legend_content').append('<h2>Survey Questions</h2><ul class="swatches" id="swtchs-legend"></ul>');
	$('#edit_content').append('<h2>Survey Questions</h2><ul class="swatches" id="swtchs-edit"></ul>');
	$('#share_content').append('<ul><li><button>Save As PDF</button></li><li><button>Email PDF</button></li></ul></div></ul></li>');
	
	GenerateSwatches.loadQuestions();
	
});

var initAppMenu = (function() {


	
		$('#nav-survey').click(function(){
			$('.nav li a').removeClass('active');
			$(this).addClass('active');
			
			$('#page_login').hide();
			$('#page_graph').hide();
			$('#page_quiz').show();
			$('#page_settings').hide();

			/*
$('#art-loading').removeClass('o1').addClass('o0');
			// After the Loading spinner icon fades out...
			setTimeout(function() {
				// Remove the Loading spinner icon...
				$('#art-loading').remove();
				Quiz.init();
			}, 250);
			return false;
*/
		});

		$('#nav-timeline').click(function(){
			$('.nav li a').removeClass('active');
			$(this).addClass('active');

			$('#page_login').hide();
			$('#page_graph').show();
			$('#page_quiz').hide();
			$('#page_settings').hide();
			
			//load initial data
			
		 	//DataVisualizationInitialization.loadDataInitial();
		 	var timeline = new Timeline();
			timeline.loadQuestionsInitial();

		 	initGraphMenu();


			//DataVisualizationSelect.init();
			
			/* 			initGraphMenu(); */

/* 			initGraphMenu(); */

			
					/* 	DataVisualizationSelect.init(); */
			//start
	

		$('#art-loading').removeClass('o1').addClass('o0');
			// After the Loading spinner icon fades out...
			setTimeout(function() {
				// Remove the Loading spinner icon...
				$('#art-loading').remove();
			//	$('#content').html(Pages.timeline).removeClass('o0').addClass('o1');
				$('#art-timeline').removeClass('o0').addClass('o1').show();
								
				$('html').removeClass('no-js').addClass('js');
				//DataVisualizationSelect.init();
				
			}, 250);


			//end

			//return false;
		});

		$('#nav-settings').click(function(){
			$('.nav li a').removeClass('active');
			$(this).addClass('active');
			
			$('#page_login').hide();
			$('#page_graph').hide();
			$('#page_quiz').hide();
			$('#page_settings').show();		
			
			$('#art-settings').removeClass('o0').addClass('o1');
		
			settings();			
/* 			Quiz.settings(); */
/* 			return false; */
		
		});
		
	
});


/*
$("#scs li h2 a").live('click', function(e){
	//$(".menu-section").css('display', 'none');
	$("#scs li").removeClass('active');
	$("#scs li .menu-section").removeClass('comeBack');
	
	//if($("#scs li .menu-section").hasClass('comeBack') ){
	if($(this).parentsUntil( "li" ).find(".menu-section").hasClass('comeBack') ){
		console.log( $(this).closest("li").find(".menu-section").attr('id') );
		$(this).closest("li").find(".menu-section").addClass('goAway');
		$(this).closest("li").find(".menu-section").removeClass('comeBack');
	}else {
		$(this).closest("li").find(".menu-section").removeClass('goAway');
		$(this).closest("li").find(".menu-section").addClass('comeBack');
		$(this).closest("li").addClass('active');		
	}
	return false;
});
*/




 	var GenerateSwatches = (function() {
 	
		     //query_answers_initial.php was written originally for PATH, returns a set of default questions and their results
		     //and for non-default questions, returns the length of their results so that null sets can be greyed out
		     //Will need to rewrite the php for returning the entire bank of answers for use in the app as a one time download
		     
		     graphColors = JSON.parse(localStorage.getItem("graphColors"));
		     console.log(graphColors);
		     
		     var loadQuestions = function() {
		         $.ajax({
		             url: 'php/query_questions.php',
		             type: 'GET',
		             dataType: 'json',
		             success: function(response) {
		                 questions = response;
		                 console.log("questions", questions);
		                 addSwatches();
		                 ParseGraphColors();
		             },
		             complete: function () {
			             
			             AddColourPicker();
		             },
		             error: function() {
		                 window.alert('Error loadQuestionsInitial!');
		             }
		         });

		     };

		     return {
		         loadQuestions : loadQuestions
		     };
		 })();


	function AddColourPicker () {
		$("#swtchs-edit .swatches").spectrum({
			color: "red",
			change: function(color) {
				$(this).css('background', color);
				id = $(this).attr('id').replace("swatch-", "");
				StoreColor(id,color.toString())
				
			}
		});
		
		
		
	}
	
	function ParseGraphColors() {
		for (i = 0; i < graphColors.length; i++) {
			SetSwatchColor(graphColors[i].id, graphColors[i].color);
			console.log ("Set color for " + graphColors[i].id.toString() + " to " + graphColors[i].color.toString());
		}
		
	}
       
     function SetSwatchColor(id,color){
     	var swatchID = '#swatch-' + id.toString();
	     $('.swatches ' + swatchID).css('background',color);
/* 	     $('#swatch-ASRM_0').css('background',color); */
	  
	     console.log(swatchID +","+color);
     }   
       
    
    function GraphColor (id) {
	    this.id = id;
	    this.color = "";
	/*
    var getColor = function() {
			 return this.color;
		};
*/
	/*
	var setColor = function(color){
			this.color = color;
		};
*/
	    
    }
    
    function IsInGraphColors (id) {
	    for (i = 0; i < graphColors.length; i++ ){
			if (graphColors[i].id == id) return true;
		}
		return false;
    }
       
	
	function StoreColor(id,color) {
		console.log("store request for " + id + " " + color);

		for (i = 0; i < graphColors.length; i++ ){
			if (graphColors[i].id == id) {
				console.log(graphColors[i].color);
				console.log(color);
/* 				graphColors[i].setColor(color);// = color.toString(); */
				graphColors[i].color = color;
			}
		}
		console.log(graphColors)
		
		localStorage.setItem('graphColors', JSON.stringify(graphColors));
		console.log("Colors stored");
/* 		console.log(GetColor(id)); */
	}
	
	function GetColor(id) {
		for (i = 0; i < graphColors.length; i++ ){
			if (graphColors[i].id == id) {
				return graphColors[i].color;
			}
		}
	}

	function addSwatches() {	/* ALERT: Big problem in here regarding the swatches. */
			
			console.log(questions.length);
			for (var i = 0; i < questions.length; i++) {
				var category = questions[i].category;
				/*  ALERT: Here's the problem with the items in the "OTHER" category: Two OTHER categories
					are being included instead of one, so I'm not including the second OTHER object... */
				if (category != 'Aggregate Scores' /* && (category != 'OTHER' || (category == 'OTHER' && otherCount == 0))*/) {
					for (var j = 0; j < questions[i].type.length; j++) {
						var id = questions[i].type[j].id;
						var name = questions[i].type[j].name;
						
						if(IsInGraphColors(id)) {
							console.log("Graph Color for " + id.toString() +  " loaded from local storage");
						} else {
							console.log("Graph Color for " + id.toString() +  " does not exist");
							var newGraphColor = new GraphColor (id);
							newGraphColor.color = 'rgba(0,0,0,0)';
							graphColors.push(newGraphColor);
						}
						
									
/* 						graphColors.push({id : id, color : ""}); */
						
						$('#questions-legend').append('<li id="legend-'+id+'" style="display:none;"><span href="#" class="swatches" id="swatch-' + id + '"></span><span>' + name + '</span></li>');
						$('#swtchs-legend').append('<li style="display:none;"><span class="swatches" id="swatch-' + id + '"></span><span>' + name + '</span></li>');
						$('#swtchs-edit').append('<li><a href="#" title="Change ' + name + '\'s colour" class="swatches" id="swatch-' + id + '"></a><span>' + name + '</span></li>');
					}
				}

				/*  ALERT: End OTHER fix.  */
				if (category == 'Aggregate Scores') {
					//$('#swtchs-edit').append('<li><a href="#" title="Change QIDS Score\'s colour" id="swatch-SCORE_0"></a> <span>QIDS Score</span></li>');
					$('#questions-legend').append('<li id="legend-'+id+'" style="display:none;"><span>QIDS Score</span></li>');
					$('#swtchs-legend').append('<li><span class="swatches" id="swatch-SCORE_0"></span> <span>QIDS Score</span></li>');
					$('#swtchs-edit').append('<li><a href="#" title="Change ' + name + '\'s colour" id="swatch-' + id + '"></a> <span>' + name + '</span></li>');
				}

				// For each setting...
				jQuery.each(settings, function(i, s) {
					$('#swatch-' + s.id).parent().removeClass('disabled');

					/* If the setting's colour is transparent, replace the swatches background colour with a transparency image... */
					if (s.colour == 'transparent'){					
						$('#menu-legend #swatch-' + s.id).css('background', 'url(images/visualizer_colour_select_transparent.gif)');
						$('#menu-edit #swatch-' + s.id).css('background', 'url(images/visualizer_colour_select_transparent.gif)');
						//$('#menu-legend #swatch-' + s.id).parent('li').remove();

					// ...otherwise, use the setting's background colour
					}else{ 
						$('#swatch-' + s.id).css('background', s.colour);
						$('#menu-edit #swatch-' + s.id).css('background', s.colour);
						$('#legend-' + s.id + ' .swatches').css('background', s.colour);
						$('#legend-' + s.id).css('display', 'inline-block');
						$('#swtchs-legend #swatch-' + s.id).parent('li').css('display', 'block');
					}

					if (!$('#swatch-' + s.id).parent().hasClass('disabled')) {
						// Apply ColorPicker plug-in to the swatch
						$('#swtchs-edit #swatch-' + s.id).colorpicker({
							alpha: true,
							color: s.colour,
							colorFormat: 'RGBA',
							inline: false,
							rgb: false,
							hsv: false,
							altAlpha: false,
							preview: false,
							select: function(event, color) {
								sessionChanged = true;
								var newColour = color.formatted;
								var code = $(this).parents('ul.swatches').attr('id').split('-')[1];
								var name = $(this).parent().children('span').html();
								$(this).css('background', newColour);
								if (newColour.split(',')[3] == '0)') {
									newColour = 'transparent';
									$(this).css('background', 'url(images/visualizer_colour_select_transparent.gif)');
								}

								$('.path-' + s.id).css('stroke', newColour);
								$('.ma-' + s.id).css('stroke', newColour);
								$('.path-' + s.id).css('fill', newColour);
								$('.intLeg-' + s.id + ' div').css('background-color', newColour);
								$('#legend-'+ s.id ).css('display', "inline-block");
								$('#legend-'+ s.id ).css('display', "inline-block");
								$('#legend-' + s.id + ' a').css('background', s.colour);
								$('#swatch-' + s.id).css('background', s.colour);
								$('#swtchs-legend #swatch-' + s.id).parent('li').css('display', 'block');

								s.colour = newColour;
								updateColourRefs(initialData, s.id, newColour);
								updateColourRefs(settings, s.id, newColour);

								// Ajax calls are going to go in here
								jQuery.each(initialData, function(i, d) {
										if (s.id == d.id) {
											if (d.results == null) {
												$.ajax({
													type: 'GET',
													url: 'php/query_answers.php',
													data: {
														"patientID": patient,
														"questionID": d.id
													},
													dataType: 'json',
													success: function(response) {
														//console.log(response.results);
														updateInitial(s.id, code + '_' + name, response.results);
														// Reset the range1 and range2 brush settings
														// Re-add the parent SVG's focus graph and context graph
														addFocusContext();
														// Update the integrals table
													},
													error: function() {
														window.alert('Swatch Ajax error.');
													}
												});
											}
										}
								});
							},
							close: function(event, color) {
								var newColour = color.formatted;
								updateColourRefs(initialData, s.id, newColour);
								updateColourRefs(settings, s.id, newColour);
							}
						});
					}
				});
				$('#scs ul.swatches li a').click(function() {
					return false;
				});
			}
			console.log(graphColors);
	
/* 		} */
	}	

