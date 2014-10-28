var Reset = (function() {

	var n;
	$('.forgot').hide();

	function resetSuccess(json) {
		$('#art-loading').removeClass('o1').addClass('o0');
		setTimeout(function() {
			$('#art-loading').remove();
			$('header.sb').after(Pages.resetLogin);
			$('#art-resetLogin').show().attr('class', 'o1');
			Middle.destroyMiddle();
			Login.init();
			Forgot.init();
			ShareAlert.init();
			$('.forgot').show();
		}, 250);
	}
	
	function validated(data) {
		/* Ultimately, there's going to be an Ajax call in here. */
		$('article.reset').removeClass('o1').addClass('o0');
		setTimeout(function() {
			$('article.reset').remove();
			$('header.sb').after(Pages.loading);
			$('#art-loading').show().attr('class', 'o1');
			Middle.init();
			
			$.ajax({
				type: 'POST',
				url: 'php/reset_password.php',
				data: data,
				dataType: 'json',
				success: function(json) {
					if (json.result === 1) {
						resetSuccess(json);
					} else if (json.result === 2) {
						window.alert('Password reset link expired.');
					} else {
						window.alert('Error connecting to database');
					}
				},
				error: function() {
					window.alert('Error!');
				}
			});
		}, 250);
	}
	
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
				n: n,
				Password: password
			};
			validated(data);
		}
	}
	
	function requestPw() {
		n = window.location.href.split('?n=')[1];
		$('#btnChangePw').click(function() {
			$('#login input.top, #login input.bottom').css('background-color', '#fff');
			var password = $('#password').val();
			var confirmP = $('#confirmP').val();
			validate(password, confirmP);
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