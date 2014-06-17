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

			$('#art-loading').removeClass('o1').addClass('o0');
			setTimeout(function() {
				// Remove the Loading spinner icon...
				$('#art-loading').remove();
				$('#art-settings').html(Pages.faq).removeClass('o0').addClass('o1');
				$('#art-faq').removeClass('o0').addClass('o1').show();

				$('.cancel').click(function(){
					
					settings();
				});

			}, 250);
		});


		$('.about-setting').click(function(){

			$('#art-loading').removeClass('o1').addClass('o0');
			setTimeout(function() {
				// Remove the Loading spinner icon...
				$('#art-loading').remove();
				$('#art-settings').html(Pages.about).removeClass('o0').addClass('o1');
				$('#art-about').removeClass('o0').addClass('o1').show();

				$('.cancel').click(function(){
					alert("CLICKED");
					settings();
				});

				$('.about-contact').click(function(){
						window.location="mailto:pathadmin@sunnybrook.ca";
				});

			}, 250);
		});

		$('.change-setting').click(function(){

			$('#art-loading').removeClass('o1').addClass('o0');
			setTimeout(function() {
				// Remove the Loading spinner icon...
				$('#art-loading').remove();
				$('#art-settings').html(Pages.changePassword).removeClass('o0').addClass('o1');
				$('#art-about').removeClass('o0').addClass('o1').show();

				$('.cancel').click(function(){
					settings();
				});

			}, 250);
		});

//	}, 250);

}