var Login = (function() {

	function fisherYates(myArray) {
		var i = myArray.length;
		if (i == 0) 
			return false;
		while (--i ) {
			var j = Math.floor(Math.random() * (i + 1));
			var tempi = myArray[i];
			var tempj = myArray[j];
			myArray[i] = tempj;
			myArray[j] = tempi;
		}
		return myArray;
	}
	
	function remembered() {
		if (uname != '') 
			$('#userId').val(uname);
		if (pword != '') 
			$('#password').val(pword);
		if (uname != '' && pword != '') 
			$('#remember').prop('checked', true);
		else 
			$('#remember').prop('checked', false);
	}

	var showAlerts = function(id) {
		$('#alert-' + id).show().attr('class', 'alert o1');
		$('#' + id).removeClass('tiWhite').addClass('tiAlert');
		if (id == 'dontMatch') {
			$('#Password, #confirmPassword').animate({
				'background-color': '#ffecec'
			}, 250);//Removed easing for all animations, 'ease-out' error
		} else if (id == 'wrongUserPassword') {
			$('#userId').animate({
				'background-color': '#ffecec'
			}, 250);

		} else if (id == 'cantConnect') {
			/*$('#userId, #password').animate({
				'background-color': '#ffecec'
			}, 250, 'ease-out');*/
		} else if (id == 'userNotEnabled') {
			/*$('#userId, #password').animate({
				'background-color': '#ffecec'
			}, 250, 'ease-out');*/
		} else {
			$('#' + id).animate({
				'background-color': '#ffecec'
			}, 250);
		}
		setTimeout(function() {
			$('#alert-' + id).attr('class', 'alert o0');
		}, 3000);
		setTimeout(function() {
			$('#alert-' + id).hide();
		}, 3500);
	};
	
	var loginFields = function() {
		// $('body').prepend(Pages.login);
		Login.init();
		// Resize.init();
		Forgot.init();
		remembered();
	};
	
	function rerunLogin(id) {
			$('#art-loading').removeClass('o1').addClass('o0');
		setTimeout(function() {
			
			$('#art-loading').remove();
			//$('body').prepend(Pages.login);
			$('header, article').show().removeClass('o0').addClass('o1');
			Middle.destroyMiddle();
			loginFields();

			showAlerts(id);
		}, 250);
	}
	
	var loginSuccess = function(json) {

		results.patientID = json.patientID; //Added by Cindy
		results.patientEmail = json.patientEmail; //Added by Cindy

		if (localStorage.getItem('lsResults')) {
			// console.log(localStorage.getItem('lsResults'));
			$.ajax({
				type: 'POST',
				url: 'php/submit.php',
				data: {
					"results": localStorage.getItem('lsResults')
				},
				// dataType: 'json',
				success: function(message) {
					localStorage.removeItem('lsResults');
				},
				error: function() {
					window.alert('Error submitting previously saved survey!');
				}
			});
		}
			// Fade out the Loading spinner icon...
			$('#art-loading').removeClass('o1').addClass('o0');
			// After the Loading spinner icon fades out...
			setTimeout(function() {
				// Remove the Loading spinner icon...
				$('#art-loading').remove();
				// Add the logged in header and the article wrapper to the beginning of the <body>...
				$('body').prepend(Pages.sbHeader);
				// Apply a height style to the new header (didn\'t take from the CSS for some reason)...
				$('header.mht').css({
					height: '0px',
					display: 'none'
				});// Apply some additional styles to the header\'s <img> (didn\'t take from the CSS for some reason)...
				/*$('header.mht img').css({
					margin: '-13px 0px 0px -40px',
					position: 'absolute',
					left: '50%',
					top: '50%'
				});*/
				Quiz.init();

			}, 250);
		// }
	};//end loginSuccess

	
	
	function validated(data) {
		// Fade out the header and the main login area
		$('header, article').removeClass('o1').addClass('o0');
		// Fade out the ShareAlert box if it\'s still visible
		if ($('#sa').hasClass('o1')) 
			$('#sa').removeClass('o1').addClass('o0');
		// After the header and main login area fades out...
		setTimeout(function() {
			// Remove the header, main login area and ShareAlert box...
			// $('header, #sa').remove(); //article
			// Add the Loading spinner icon to the <body>...
			$('body').prepend(Pages.loading);
			// Show the Loading spinner icon and fade it in...
			$('#art-loading').show().attr('class', 'o1');
			// Vertically align the Loading spinner icon...
			Middle.init();
			// Submit the Ajax for the login form...
			$.ajax({
				type: 'POST',
				url: 'php/login.php',
				data: data,
				dataType: 'json',
				success: function(json) {
					if (json.result === 1) {
						loginSuccess(json);
						//console.log("loginSuccess", json);
					} else if (json.result === 0) {
						// window.alert('Wrong username or password.');
						rerunLogin('cantConnect');
					} else if (json.result === 2) {
						// window.alert('Wrong username or password.');
						rerunLogin('wrongUserPassword');
					} else if (json.result === 3) {
						// window.alert('Wrong username or password.');
						rerunLogin('wrongUserPassword');
					} else if (json.result === 4) {
						// window.alert('Wrong username or password.');
						rerunLogin('userNotEnabled');
					} else {
						// window.alert('Can\'t connect to database.');
						rerunLogin('cantConnect');
					}
				},
				error: function() {
					// window.alert('Can\'t connect to database.');
					rerunLogin('cantConnect');
				}
			});
		}, 250);
	}
	
	function validate(userId, password, remember) {
		var valid = true;
		var validEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		// User ID check
		if (!validEmail.test(userId)) {
			showAlerts('userId');
			valid = false;
		}
		// Password check
		if (password == 0) {
			showAlerts('password');
			// window.alert('Password is a required field.');
			valid = false;
		}
		if (valid == false) 
			return false;
		else {
			var data = {
				userId: userId,
				password: password,
				remember: remember
			};
			// window.alert('Success.');
			validated(data);
		}
	}
	
	var loginUser = function () {
			$('#login input.top, #login input.bottom').css('background-color', '#fff');
			var userId = $('#userId').val();
			var password = $('#password').val();
			var remember = $('#remember').is(':checked');
			validate(userId, password, remember);
	}
	
	var restoreUser = function (username, password, remember) {
			//$('#login input.top, #login input.bottom').css('background-color', '#fff');
/* 			$("#login").css('display','none'); */
alert(username);
			var userId = username;//$('#userId').val();
			var password = password;//$('#password').val();
			var remember = remember;// $('#remember').is(':checked');
			validate(userId, password, false);
	}
	
	
	var init = function() {
		$('#btnLogin').click(function() {
			// $('p.alert').hide().attr('class', 'alert o0');
			$('#login input.top, #login input.bottom').css('background-color', '#fff');
			var userId = $('#userId').val();
			var password = $('#password').val();
			var remember = $('#remember').is(':checked');
			validate(userId, password, remember);
			return false;
		});
	};
	
	return {
		showAlerts: showAlerts,
		loginFields: loginFields,
		loginSuccess: loginSuccess,
		init: init,
		loginUser : loginUser,
		restoreUser : restoreUser
	};
	
})();