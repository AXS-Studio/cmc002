// var d3SessionChanged = false;

var SessionSelect = (function() {

	var sessions = {
		nextID: 0,
		data: [ ]
	};

	var initialSession = 'Create New';
	var lastVal = null;
	var formSubmitted = false;
	var nameTaken = false;
	var validName = /^([a-zA-Z0-9\s_-]+)$/;	

	function getCurrVal() {
		// console.log('The current value is ' + $('#sessSelect').val());
		return $('#sessSelect').val();
	}

	function setSS(val) {
		$('#sessSelect').val(val);
		// $('#sessSelect option[val="' + val + '"]').prop('selected', true);
		lastVal = val;
		console.log(val + ' is has just been successfully set as the current value');
	}

	function ssAjax(action, session, sessData) {
		var url = null;
		var data = {};
		switch (action) {
			case 'save' : 
				url = 'php/submit_session.php';
				data = {
					action: 'save',
					clinicianID: clinician,
					patientID: patient,
					session: session,
					data: sessData
				};
				break;
			default : 
				url = 'php/query_answers_initial.php';
				if (session == 'Create New') {
					data = {
						patientID: patient
					};
				} else {
					data = {
						patientID: patient,
						sessionName: session
					};
				}
		}
		$.ajax({
			url: url,
			type: 'POST',
			data: data,
			dataType: 'json',
			success: function(response) {
				switch (action) {
					case 'save' : 
						// console.log(response);
						D3graph.setSessChanged();
						break;
					default : 
						initialData = response;
						// console.log(initialData);
						D3graph.init();
				}
			},
			error: function() {
				window.alert('Save Session error.');
			}
		});
	}

	function loadNewSession(val) {
		// console.log(val);
		if (val == 'session-default') {
			/*var getData = {
				"patientID": patient
			};*/
			disableActions();
		} else {
			/*var getData = {
				"patientID": patient,
				"sessionName": current_htmltext
			};*/
			$('#sessSelect option').prop('selected', false).prop('disabled', false);
		}
		setSS(val);
		ssAjax('get', $('#sessSelect option[value="' + lastVal + '"]').html());	// ALERT: Ajax get
	}
	
	var ssGo = function() {
		var changedVal = getCurrVal();
		switch (changedVal) {
			case 'save' : 
				setSS(lastVal);
				window.alert('Your current session "' + $('#sessSelect option[value="' + lastVal + '"]').html() + '" has been saved.');
				ssAjax('save', $('#sessSelect option[value="' + lastVal + '"]').html(), {	// ALERT: Ajax save
					range1dates: D3graph.getRange1dates(),
					range2dates: D3graph.getRange2dates(),
					settings: D3graph.getSettings()
				});
				break;
			case 'saveAs' : 
				setUpNameForm(changedVal);
				// Form actions for "Save as..." are in setSessEditForm()
				break;
			case 'rename' : 
				setUpNameForm(changedVal);
				// Form actions for "Rename current" are in setSessEditForm()
				break;
			case 'delete' : 
				var delConf = window.confirm('Are you sure you want to delete this session?');
				if (delConf == true) {
					var deleteVal = lastVal.split('-')[1];
					for (var i = 0; i < sessions.data.length; i++) {
						if (sessions.data[i].value == deleteVal) {
							sessions.data.splice(i, 1);
						}
					}
					// console.log(sessions.data);
					if (sessions.data.length < 1) {
						// $('#session-mngr').append(defaultOpt);
						$('#sessSelect option[value="save"], #sessSelect option[value="rename"], #sessSelect option[value="delete"]').prop('disabled', true);
					}
					window.alert('The session titled "' + $('#sessSelect option[value="' + lastVal + '"]').html() + '" has been deleted.');
					// So the "DELETE" doesn't show
					// setSS(lastVal);
					ssAjax('delete', $('#sessSelect option[value="' + lastVal + '"]').html());	// ALERT: Ajax delete
					// Removes the one selected to be dleeted.
					$('#sessSelect option[value="' + lastVal + '"]').remove();
					// changes current val to the new one selected now as a reuslt of deletion.
					var newVal = $('#sessSelect option[value="-"]').next('option').val();	// ALERT: This may be determined by the Ajax
					if (newVal == 'session-default') 
						disableActions();
					setSS(newVal);
				} else 
					setSS(lastVal);
				break;
			case '-' : 
				setSS(lastVal);
				break;
			default : 
				var sessionChanged = D3graph.getSessChanged();
				// var sessionChanged = d3SessionChanged;
				if (sessionChanged == true) {
					var changeConf = window.confirm('You have unsaved changes. Are you sure you want to switch to a different session?');
					if (changeConf == true) 
						loadNewSession($('#sessSelect').val());
					else 
						setSS(lastVal);
				} else 
					loadNewSession($('#sessSelect').val());
		}
	};

	function ssStart() {

		$('#ppdf').live('click',function() {
			//PrintPdf.init();
			alert( 'PDF' );
			console.log('pdf button click');
			return false;
		});

		if (initialSession != 'Create New') {
			$('#ssForm option').prop('selected', false);
			$('#ssForm option').each(function() {
				if ($(this).html() == initialSession) 
					setSS($(this).attr('value'));
			});
		} else 
			setSS('session-default');
	}
	
	var init = function() {
		ssStart();
		//setSessEditForm();
	};
	
	var parseSessInfo = function(info) {	// ALERT: Going to incorporate this tomorrow
		if ($('#ssForm').length < 1) {
			sessions = {
				nextID: 0,
				data: []
			};
			for (var i = 0; i < info.sessions.length; i++) {
				sessions.data.push({
					value: i,
					name: info.sessions[i]
				});
			}
			sessions.nextID = sessions.data.length;
			console.log(sessions);
			initialSession = info.current.name;
			init();
		}
	};
	
	return {
		ssGo: ssGo,
		init: init,
		parseSessInfo: parseSessInfo
	};
	
})();