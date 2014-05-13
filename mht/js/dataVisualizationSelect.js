var DataVisualizationSelect = (function() {
	
	var selectChanged = function(ajaxPath) {		
 		//ajaxPath = 'php/query_answers_initial.php?patientID=Record09&sessionName=Pink&clinicianID=dkreindler';  
		//console.log("ajaxPath " + ajaxPath);
		console.log(results);
		
		ajaxPath = 'php/query_answers_initial.php?patientID=' + results.patientID;
		patient = ajaxPath.split('=')[1];
		// console.log(patient);
		if (ajaxPath != 'Select patient') {
			if ($('#ssForm').length > 0) 
				$('#ssForm').remove();

			$('#cfgGraphs').html('<div class="svgWrap" id="svgParent" style="display: none;"></div>');

			$.ajax({
				url: ajaxPath,
				type: 'GET',
				dataType: 'json',
				success: function(response) {
					initialData = response;
					//console.log(initialData);
					D3graph.init();
					// SessionSelect.init();
				},
				error: function() {
					window.alert('Error Select Changed!');
				}
			});
		}
	};

	$(window).resize(function() {
		//location.reload();
		//alert( 'resize' );
		//D3graph.init();
	});
	
	
	/*function create() {
		var results = $.ajax({
			type: 'GET',
			url: 'php/create_list.php',
			data: {
				"retrieve": "patientListQueryAnswersInitial"
			}
		}).success(function($response) {
			$('#PatientDropdown').html('<option value="Select patient">--Select a patient--</option>' + $response);
		});
	}*/
	
	var init = function() {
		$.ajax({
			url: 'php/query_questions.php',
			type: 'GET',
			dataType: 'json',
			success: function(response) {
				questions = response;
				console.log(questions);				
			},
			complete: function(){
				selectChanged();
				console.log(questions);
			},
			error: function() {
				window.alert('Error Querry Questions!');
			}
		});
		//create();
		//selectChanged();
	};
	
	return {
		init: init
	};
	
})();