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

//	}, 250);

}