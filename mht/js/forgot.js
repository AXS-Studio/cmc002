var Forgot = (function() {
	
	function rerunLogin(id) {
		$('#art-loading').removeClass('o1').addClass('o0');
		setTimeout(function() {
			$('#art-loading').remove();
			$('body').append(Pages.forgot);
			$('header, article').show().removeClass('o0').addClass('o1');
			Middle.init();
			Login.loginFields();
			Login.showAlerts(id);
			submFgPwBtn();
		}, 250);
	}
	
	function loginSuccess(json) {
		/* Ultimately, there's going to be an Ajax call in here. */
		$('#art-loading').removeClass('o1').addClass('o0');
		setTimeout(function() {
			$('#art-loading').remove();
			$('header.sb').after(Pages.fgThanks);
			$('#art-fgThanks').show().attr('class', 'o1');
			Middle.init();
		}, 250);

	}
	
	function validated(data) {
		$('#art-forgot').removeClass('o1').addClass('o0');
		setTimeout(function() {
			$('#art-forgot').remove();
			$('header.sb').after(Pages.loading);
			$('#art-loading').show().attr('class', 'o1');
			Middle.init();
			$.ajax({
				type: 'POST',
				url: 'php/email_password.php',
				data: data,
				dataType: 'json',
				success: function(json) {
					if (json.result === 1) {
						loginSuccess(json);
					} else if (json.result === 0) {
						rerunLogin('cantConnect');
					} else if (json.result === 2) {
						rerunLogin('wrongUser');
					} else if (json.result === 3) {
						rerunLogin('wrongUser');
					} else if (json.result === 4) {
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
	
	function validate(email) {
		var valid = true;
		var validEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
		// Email check
		if (!validEmail.test(email)) {
			Login.showAlerts('email');
			valid = false;
		}
		if (valid == false) 
			return false;
		else {
			var data = {
				Email: email
			};
			validated(data);
		}
	}
	
	function submFgPwBtn() {
		$('#btnSubFgPw').click(function() {
			$('#email').css('background-color', '#fff');
			var email = $('#email').val();
			validate(email);
			return false;
		});
	}
	
	function requestPw() {
		$('#btnForgot').click(function() {
			// var uidVal = $('#userId').val();
			$('.forgot').hide();
			if ($('html').hasClass('blackberry')) {	// ALERT: Added this condition to accomodate BlackBerrys
				$('article.login').remove();
				$('header.sb').after(Pages.forgot);
				// $('#email').val(uidVal);
				$('#art-forgot').attr('class', 'o1').show();
				submFgPwBtn();
			} else {
				$('article.login').removeClass('o1').addClass('o0');
				setTimeout(function() {
					$('article.login').remove();
					$('header.sb').after(Pages.forgot);
					// $('#email').val(uidVal);
					$('#art-forgot').show().attr('class', 'o1');
					submFgPwBtn();
				}, 250);
			}
			/*$('article.login').removeClass('o1').addClass('o0');
			setTimeout(function() {
				$('article.login').remove();
				$('header.sb').after(Pages.forgot);
				// $('#email').val(uidVal);
				$('#art-forgot').show().attr('class', 'o1');
				submFgPwBtn();
			}, 250);*/
			return false;
		});
	}
	
	var init = function() {
		requestPw();
	};
	
	return {
		init: init
	};
	
})();