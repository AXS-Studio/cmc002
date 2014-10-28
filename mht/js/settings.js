var settings = function() {
	//$('#art-loading').removeClass('o1').addClass('o0');
	// After the Loading spinner icon fades out...
	//setTimeout(function() {
		// Remove the Loading spinner icon...
		//$('#art-loading').remove();
/* 		$('#content_settings').html(Pages.settings).removeClass('o0').addClass('o1'); */
		//$('#art-settings').removeClass('o0').addClass('o1').show();

		// settings buttons
		$('.logout-setting').click(function(){
			window.location.href = 'index.php?logout=true';
		});

		$('.faq-setting').click(function(){

			$('#art-settings').hide();
			$('#art-faq').show();
			// $('#page_quiz').show();
			// $('#page_settings').hide();

			// $('#art-loading').removeClass('o1').addClass('o0');
			// setTimeout(function() {
			// 	// Remove the Loading spinner icon...
			// 	$('#art-loading').remove();
			// 	$('#art-settings').html(Pages.faq).removeClass('o0').addClass('o1');
				$('#art-faq').removeClass('o0').addClass('o1');

				$('.cancel').click(function(){
					
					$('#art-faq').hide();
					$('#art-settings').show();
					

					// settings();
				});

			// }, 250);
		});


		$('.about-setting').click(function(){

				$('#art-settings').hide();
					$('#art-about').show();

			// $('#art-loading').removeClass('o1').addClass('o0');
			// setTimeout(function() {
				// Remove the Loading spinner icon...
				// $('#art-loading').remove();
				// $('#art-settings').html(Pages.about).removeClass('o0').addClass('o1');
				// $('#art-about').removeClass('o0').addClass('o1').show();
					$('#art-about').removeClass('o0').addClass('o1');
					$('.cancel').click(function(){
					// alert("CLICKED");
					// settings();
					$('#art-about').hide();
					$('#art-settings').show();
					
				});

				$('.about-contact').click(function(){
						window.location="mailto:pathadmin@sunnybrook.ca";
				});

			// }, 250);
		});

		$('.change-setting').click(function(){
			$('#art-settings').hide();
			$('#art-change').show();
					
			// $('#art-loading').removeClass('o1').addClass('o0');
			// setTimeout(function() {
			// 	// Remove the Loading spinner icon...
			// 	$('#art-loading').remove();
				$('#art-change').removeClass('o0').addClass('o1');
			// 	$('#art-about').removeClass('o0').addClass('o1').show();

				$('.cancel').click(function(){
					$('#art-change').hide();
					$('#art-settings').show();
				});

			// }, 250);
		});

		//Cindy: Implement password change
		$('#btnChangePw').click(function() {
						
			//Reset.init();
			
			$('#login input.top, #login input.bottom').css('background-color', '#fff');
			var password = $('#passwordNew').val();
			var confirmP = $('#confirmP').val();
			console.log(password, confirmP);

			validate(password, confirmP);
			return false;

			//window.alert("Your password has been changed");
		});

	//Based on existing function from reset.js
	function validate(password, confirmP) {
			var valid = true;
			// Email check
			if (password == 0) {
				Login.showAlerts('password');
				valid = false;
			}
			// Password check
			if (confirmP == 0) {
				Login.showAlerts('confirmP');
				valid = false;
			}
			if ((password != 0) && (confirmP != 0) && (password != confirmP)) {
				Login.showAlerts('dontMatch');
				valid = false;
			}
			if (valid == false) 
				return false;
			else {
				var data = {
					n: "sha256:1000:TuDhDJ/3S/K7ANQTqWjzaGmBdu9S5uzo:mTf2rzh5m4uDGR9EOF1+loxeewZ0uzUS",
					patientID: results.patientID,
					Password: password
				};
				validated(data);
			}
	}//end validate

	//Based on existing function from reset.js
	function validated(data) {
		$.ajax({
			type: 'POST',
			url: 'php/reset_password.php',
			data: data,
			dataType: 'json',
			success: function(json) {
				if (json.result === 1) {
					//resetSuccess(json);
					window.alert("Your password has been changed.");
				} else if (json.result === 3) {
					window.alert('Error connecting to database.');
				} else {
					window.alert('Error returning results from database.');
				}
			},
			error: function() {
				window.alert('Error connecting to database.');
			}
		});
	}//end validated

//	}, 250);

}