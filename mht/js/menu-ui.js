var graphMenuActive = false;
var graphColors = new Array();
var tagColors = new Array();
var timeline = new Timeline();

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
	
	
	$('#legend_content').append('<h3>Survey Questions</h3><ul class="swatches" id="swtchs-legend"></ul><ul class="swatches tags"><h3>Tags</h3></ul>');
	$('#edit_content').append('<h3>Survey Questions</h3><ul class="swatches" id="swtchs-edit"></ul><ul class="swatches tags" id="tags-edit"><h3>Tags</h3></ul>');
	$('#share_content').append('<ul><li><button>Save As PDF</button></li><li><button>Email PDF</button></li></ul></div></ul></li>');
		
	GenerateSwatches.questionSwatches();
	
	GenerateSwatches.tagSwatches();

	GenerateSwatches.filterSwatches();

});



var initAppMenu = (function() {
	
		$('#nav-survey').click(function(){
			$('.nav li a').removeClass('active');
			$(this).addClass('active');
			
			$('#page_login').hide();
			$('#page_graph').hide();
			$('#page_quiz').show();
			$('#page_settings').hide();

		});

		$('#nav-timeline').click(function(){
			$('.nav li a').removeClass('active');
			$(this).addClass('active');

			$('#page_login').hide();
			$('#page_graph').show();
			$('#page_quiz').hide();
			$('#page_settings').hide();
			
		
			timeline.loadQuestionsInitial();

		 	initGraphMenu();

		$('#art-loading').removeClass('o1').addClass('o0');
			setTimeout(function() {
	
				$('#art-loading').remove();
	
				$('#art-timeline').removeClass('o0').addClass('o1').show();
								
				$('html').removeClass('no-js').addClass('js');

				
			}, 250);


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
		
		});
		
	
});



var GenerateSwatches = (function() {
   //  console.log(graphColors);

      var filterSwatches = function() {
        //ajaxPath = 'php/query_answers_initial.php?patientID=Record09&sessionName=Pink&clinicianID=dkreindler';  
        //console.log(results);

        ajaxPath = 'php/query_answers_timeline.php?patientID=' + results.patientID;
        patient = ajaxPath.split('=')[1];
        // console.log(patient);

        $.ajax({
            url: ajaxPath,
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                initialData = response;
                console.log("initialData", initialData);
                //makeGraph();
               DisableSwatches();
            },
            error: function() {
                window.alert('Error loadAnswersInitial!');
            }
        });

    };
     
     var questionSwatches = function() {
     
     	 graphColors = JSON.parse(localStorage.getItem("graphColors"));
     	 console.log(graphColors);
     
         $.ajax({
             url: 'php/query_questions.php',
             type: 'GET',
             dataType: 'json',
             success: function(response) {
                 questions = response;
                 addSwatches();
                 ParseGraphColors();
             },
             complete: function () {
	             
/* 	             AddColourPicker(); */

			AddColourPicker.questionSwatches();	
             },
             error: function() {
                 window.alert('Error: Could not retrieve questions to generate swatches!');
             }
         });

     };
     
     
     
    var tagSwatches = (function(){
    
    	 tagColors = JSON.parse(localStorage.getItem("tagColors"));
		 console.log(tagColors);
		$.ajax({
			type: 'GET',
			url: 'php/get_tags.php',
			data: {
				patientID:results.patientID
			},
			success: function(message) {
				console.log(message);
				tags = jQuery.parseJSON(message);
				addTagSwatches();
				ParseTagColors();
				//AddColourPickerTags();
				AddColourPicker.tagSwatches();	
			},
			error: function() {
			 	window.alert('Error: Could not retrieve tags to generate swatches!');
			}
		});	
	});

  
   return {
         questionSwatches : questionSwatches,
         tagSwatches : tagSwatches,
         filterSwatches : filterSwatches
     };

 })();

	

function addSwatches() {	/* ALERT: Big problem in here regarding the swatches. */
		for (var i = 0; i < questions.length; i++) {
			var category = questions[i].category;
			if (category != 'Aggregate Scores' /* && (category != 'OTHER' || (category == 'OTHER' && otherCount == 0))*/) {
				for (var j = 0; j < questions[i].type.length; j++) {
					var id = questions[i].type[j].id;
					var name = questions[i].type[j].name;
				
					if(IsInGraphColors(id)) {
							/// do.. nothing I suppose.


						} else { 

						var newGraphColor = new GraphColor (id);
						newGraphColor.color = "rgba(0,0,0,0)";
						if(graphColors == null) graphColors = new Array();
						graphColors.push(newGraphColor);
					}
					
					$('#questions-legend').append('<li id="legend-'+id+'" style="display:none;"><span href="#" class="swatches" id="swatch-' + id + '"></span><span>' + name + '</span></li>');
					$('#swtchs-legend').append('<li id="legend-menu-'+id+'"><span class="swatches" id="swatch-' + id + '"></span><span>' + name + '</span></li>');
					$('#swtchs-edit').append('<li><a href="#" title="Change ' + name + '\'s colour" class="swatches" id="swatch-' + id + '"></a><span id="text-' + id +'">' + name + '</span></li>');

					// if(IsTransparent(id)) {
					// 	console.log(id + " is transparent");
					// 		$("#swatch-" + id).css('background-image', 'url(./images/visualizer_colour_select_transparent.gif)');	
					// }
				}
			}
			
			if (category == 'Aggregate Scores') {
					//$('#swtchs-edit').append('<li><a href="#" title="Change QIDS Score\'s colour" id="swatch-SCORE_0"></a> <span>QIDS Score</span></li>');
					
				
					if(IsInGraphColors("SCORE_0")) {
							/// do.. nothing I suppose.
						} else { 

						var newGraphColor = new GraphColor ("SCORE_0");
						newGraphColor.color = "rgba(0,0,0,0)";
						if(graphColors == null) graphColors = new Array();
						graphColors.push(newGraphColor);
					}
					

					$('#questions-legend').append('<li id="legend-SCORE_0" style="display:none;"><span>QIDS Score</span></li>');
					$('#swtchs-legend').append('<li id="legend-menu-SCORE_0"><span class="swatches" id="swatch-SCORE_0"></span> <span>QIDS Score</span></li>');
					$('#swtchs-edit').append('<li><a href="#" title="Change QIDS Score\'s colour" class="swatches" id="swatch-SCORE_0"></a><span id="text-SCORE_0">QIDS Score</span></li>');
					//$('#swtchs-edit').append('<li><a href="#" title="Change ' + name + '\'s colour" id="swatch-' + id + '"></a> <span>' + name + '</span></li>');
				}			

			$('#scs ul.swatches li a').click(function() {
				return false;
			});
		}
}	

function addTagSwatches() {	
	if (tags.length > 0) {
		for (var j = 0; j < tags.length; j++) {
				//var id = tags[j];
				
				if(IsInTagColors(tags[j])) {
					/// do.. nothing I suppose.
					
				} else { 

					var newTagColor = new GraphColor (tags[j]);
					newTagColor.color = "rgba(0,0,0,0)";
					if(tagColors == null) tagColors = new Array();
					tagColors.push(newTagColor);
				}
		
		
			$('.tags').append('<li id="swatch-menu-tag-' + tags[j] + '""\><a href="#" title="Change ' + tags[j] + '\'s colour" class="swatches tag" id="swatch-tag-' + tags[j] + '"\></a> <span>' + tags[j] + '</span></li>'); // style="background-color:#000"
			$('#swatch-tag' + j).css('background-image', 'none');

			$('#scs ul.swatches li a').click(function() {
				return false;
			});
		}
	}
}

var AddColourPicker  = (function() {
	var questionSwatches = (function () {
		$("#swtchs-edit .swatches").spectrum({
			color: "rgb(119, 120, 49)",
			showPalette: true,
			 allowEmpty: true,
			change: function(color) {
				
				id = $(this).attr('id').replace("swatch-", "");
				if(color == null) color = "rgba(0,0,0,0)";
				SetSwatchColor(id,color);
				StoreColor(id,color.toString());

				// if(color == null || color == "rgba(0,0,0,0)") {
				// 	$(this).css('background', 'rgba(0,0,0,0)');
				// 	$(this).css('background-image', 'url(./images/visualizer_colour_select_transparent.gif)');
				// 	StoreColor(id,"rgba(0,0,0,0)");
				// }
				// else {
				// 	$(this).css('background', color);
				// 	StoreColor(id,color.toString());
				// }

				// timeline.updateGraph();
			}
		});
	});
	
	var tagSwatches = (function () {
		$("#tags-edit .swatches").spectrum({
			color: "red",
			showPalette: true,
			change: function(color) {
				$(this).css('background', color);
				id = $(this).attr('id').replace("swatch-tag-", "");
				StoreTagColor(id,color.toString());
			}
		});
	});
	
	  
   return {
         questionSwatches : questionSwatches,
         tagSwatches : tagSwatches
     };
	
})();


function TurnOff(id) {
	var swatchID = '#swatch-' + id.toString();
   	  $('.swatches ' + swatchID).css('background',RGBA(0,0,0,0));

}
	
function ParseGraphColors() {
	for (i = 0; i < graphColors.length; i++) {
		// if(graphColors[i].color == "rgba(0,0,0,0)") {
			
		// 	graphColors[i].color = "rgba(128,128,128,128)"
		// }
		SetSwatchColor(graphColors[i].id, graphColors[i].color);
	}
}

function ParseTagColors() {
	for (i = 0; i < tagColors.length; i++) {
		SetTagColor(tagColors[i].id, tagColors[i].color);
	}
}
       
 function SetSwatchColor(id,color)
 {
 	var swatchID = '#swatch-' + id.toString();
 	var legendID = '#legend-menu-' + id.toString();
 		$('.swatches ' + swatchID).css('background',color);
 		if(color == "rgba(0,0,0,0)") {
 			$('.swatches ' + swatchID).css('background-image', 'url(./images/visualizer_colour_select_transparent.gif)');
 			$('#swtchs-legend').find(legendID).hide();
 		} 
 		else
 		{
 			$('#swtchs-legend').find(legendID).show();
 		}
 }   

 function DisableSwatches () {
 	for (var i = 0; i < initialData.length; i++) {
 		if (initialData[i].id != 'comment' && initialData[i].id != 'tags' && initialData[i].id != 'uniqueTags' && initialData[i].id != 'notes' && initialData[i].id != 'sessions') {

                if (initialData[i].results == null || initialData[i].results.length <= 0) {
                	DisableSwatch(initialData[i].id);	
                	SetSwatchColor(initialData[i].id,"rgba(0,0,0,0)")	
                }
            }
 	}
 }

 function DisableSwatch(id) {
 	var textID = '#text-' + id.toString();
 	var swatchID = '#swatch-' + id.toString();
 	// var legendID = '#legend-menu-' + id.toString();
 	$(textID).css('color', 'grey');
 	$("#swtchs-edit " + swatchID).spectrum("disable");
 }
 
function SetTagColor(id,color)
 {
 	var swatchID = '#swatch-tag-' + id.toString();
 	var legendID = '#swatch-menu-tag-' + id.toString();
     $('.swatches ' + swatchID).css('background',color);
     	if(color == "rgba(0,0,0,0)") {
 			$('.swatches ' + swatchID).css('background-image', 'url(./images/visualizer_colour_select_transparent.gif)');
 			$('#legend_content').find(legendID).hide();
 		}
 		else
 	{
 		$('#legend_content').find(legendID).show();
 	}
 }   
   
 var IsInGraphColors = function (id) 
{
	if(graphColors == null) return false;
    for (i = 0; i < graphColors.length; i++ ){
		if (graphColors[i].id == id) return true;
	}
	return false;
}  

var IsInTagColors = function (id) 
{
	if(tagColors == null) return false;
    for (i = 0; i < tagColors.length; i++ ){
		if (tagColors[i].id == id) return true;
	}
	return false;
}  

var IsTransparent = function (id)
{
	if(graphColors == null) return false;

	for (i = 0; i < graphColors.length; i++) {
		if(graphColors[i].color == null|| graphColors[i].color == "rgba(0,0,0,0)") return true;
	}
	return false;
}

    
function GraphColor (id) 
{
    this.id = id;
    this.color = "";
}
  	
function StoreColor(id,color) 
{

	for (i = 0; i < graphColors.length; i++ )
	{
		if (graphColors[i].id == id) 
		{
			graphColors[i].color = color;
		}
	}

	localStorage.setItem('graphColors', JSON.stringify(graphColors));
}

function StoreTagColor(id,color) 
{

	for (i = 0; i < tagColors.length; i++ )
	{
		if (tagColors[i].id == id) 
		{
			tagColors[i].color = color;
		}
	}

	localStorage.setItem('tagColors', JSON.stringify(tagColors));
}

function GetColor(id) {
	for (i = 0; i < graphColors.length; i++ ){
		if (graphColors[i].id == id) {
			return graphColors[i].color;
		}
	}
	return null;
}	
	
function GetTagColor(id) {
	for (i = 0; i < tagColors.length; i++ ){
		if (tagColors[i].id == id) {
			return tagColors[i].color;
		}
	}
	return null;
}


