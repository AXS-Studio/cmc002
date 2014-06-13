var graphMenuActive = false;
var graphColors = new Array();
var tagColors = new Array();

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
			
		 	var timeline = new Timeline();
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
     
     var questionSwatches = function() {
     
     	 graphColors = JSON.parse(localStorage.getItem("graphColors"));
     
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
         tagSwatches : tagSwatches
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
						newGraphColor.color = "rgba(128,128,128,128)";
						if(graphColors == null) graphColors = new Array();
						graphColors.push(newGraphColor);
					}
					
					$('#questions-legend').append('<li id="legend-'+id+'" style="display:none;"><span href="#" class="swatches" id="swatch-' + id + '"></span><span>' + name + '</span></li>');
					$('#swtchs-legend').append('<li style="display:none;"><span class="swatches" id="swatch-' + id + '"></span><span>' + name + '</span></li>');
					$('#swtchs-edit').append('<li><a href="#" title="Change ' + name + '\'s colour" class="swatches" id="swatch-' + id + '"></a><span>' + name + '</span></li>');
				}
			}
			
			if (category == 'Aggregate Scores') {
					//$('#swtchs-edit').append('<li><a href="#" title="Change QIDS Score\'s colour" id="swatch-SCORE_0"></a> <span>QIDS Score</span></li>');
					
				
					if(IsInGraphColors("SCORE_0")) {
							/// do.. nothing I suppose.
						} else { 

						var newGraphColor = new GraphColor ("SCORE_0");
						newGraphColor.color = "rgba(128,128,128,128)";
						if(graphColors == null) graphColors = new Array();
						graphColors.push(newGraphColor);
					}
					

					$('#questions-legend').append('<li id="legend-SCORE_0" style="display:none;"><span>QIDS Score</span></li>');
					$('#swtchs-legend').append('<li><span class="swatches" id="swatch-SCORE_0"></span> <span>QIDS Score</span></li>');
					$('#swtchs-edit').append('<li><a href="#" title="Change QIDS Score\'s colour" class="swatches" id="swatch-SCORE_0"></a><span>QIDS Score</span></li>');
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
		
		
			$('.tags').append('<li><a href="#" title="Change ' + tags[j] + '\'s colour" class="swatches" id="swatch-tag-' + tags[j] + '"\></a> <span>' + tags[j] + '</span></li>'); // style="background-color:#000"
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
				if(color == null) {
					$(this).css('background', 'rgba(0,0,0,0)');
					StoreColor(id,"rgba(0,0,0,0)");
				}
				else {
					$(this).css('background', color);
					StoreColor(id,color.toString());
				}
				
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
		if(graphColors[i].color == "rgba(0,0,0,0)") {
			graphColors[i].color = "rgba(128,128,128,128)"
		}
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
     $('.swatches ' + swatchID).css('background',color);
 }   
 
function SetTagColor(id,color)
 {
 	var swatchID = '#swatch-tag-' + id.toString();
     $('.swatches ' + swatchID).css('background',color);
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


