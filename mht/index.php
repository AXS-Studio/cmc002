<?php

error_reporting(0);

include 'php/Mobile_Detect.php';

$detect = new Mobile_Detect();

$bbVers = $detect -> version('BlackBerry');
$ua;
$bbBoldishUserAgents = array(
	'BlackBerry 9900'
);


$page;
$tablet = false;
$desktop = false;
$uri = explode('?n=', $_SERVER['REQUEST_URI']);

if ($uri[1] != false) {
	$page = 'reset';
} else {
	$page = 'login';
}

?>
<!DOCTYPE html>
<html class="no-js<?php
if ($detect -> isTablet()) {
	$tablet = true;
	echo ' tablet';
} elseif ($detect -> isMobile()) {
	echo ' smartphone';
	if ($detect -> isiOS()) {
		echo ' ios';
		/*if ($vers >= 6) {
			echo ' hi-fi';
		}*/
	} elseif ($detect -> isAndroidOS()) {
		echo ' android';
	} elseif ($detect -> isBlackBerry()) {
		echo ' blackberry';
		if ($bbVers < 6) {
			echo ' bbNoTouch';
		}
		$ua = $_SERVER['HTTP_USER_AGENT'];
		$ua_deets = explode('; ', $ua);
		foreach ($bbBoldishUserAgents as $bbbua) {
			if ($bbbua == $ua_deets[2]) {
				echo ' bbBoldish';
			}
		}
	}
} else {
	$desktop = true;
	//$desktop = false;
	echo ' desktop';
}
?>" lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width = device-width, initial-scale = 1, maximum-scale = 1.0">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<link rel="apple-touch-icon" href="images/57.png">
		<link rel="apple-touch-icon" sizes="114x114" href="images/114.png">
		<!-- <link rel="apple-touch-startup-image" href="images/startup.png"> -->
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
		<title>MHT</title>
		<link rel="stylesheet" media="screen" href="css/style.css">
		
		<link rel="stylesheet" media="screen" href="css/graph-ui.css">
		<link rel="stylesheet" media="screen" href="css/graph.css">
		<link rel="stylesheet" media="screen" href="css/jquery-ui-styles.css">
	</head>
	
	<body>
		<div class="page-wrap">
			<header class="sb o1">
				<img src="images/MHT_logo.png" class="mht-logo"/>
			</header>
			<div id="content"></div>
			<!-- end sb -->
			<?php
				if ($page == 'reset') {
					echo '
					<article class="reset o1">
						<h1 class="plain">Enter your new password:</h1>
						<p class="alert o0" id="alert-password" style="display: none;"><strong>New password</strong> is a required field.</p>
						<p class="alert o0" id="alert-confirmP" style="display: none;"><strong>Confirm new password</strong> is a required field.</p>
						<p class="alert o0" id="alert-dontMatch" style="display: none;">Your two password fields <strong>don\'t match</strong>. Please try again.</p>
						<p class="alert o0" id="alert-cantConnect" style="display: none;">Cannot connect to the MHT server. <strong>Please check your internet connection.</strong></p>
						<p class="alert o0" id="alert-userNotEnabled" style="display: none;"><strong>User not enabled</strong></p>
						<form id="reset" action="#">
							<fieldset>
								<input type="password" name="password" class="top" id="password" placeholder="New password" required="required">
								<input type="password" name="confirmP" class="bottom" id="confirmP" placeholder="Confirm new password" required="required">
								<input type="submit" name="btnChangePw" id="btnChangePw" value="Submit">
							</fieldset>
						</form>
					</article>';
				} else if ($desktop == true || $tablet == true) {
					echo '<div class="message o1" id="art-deskTab">
						<div id="middle">
							<p>We\'re sorry, it appears you\'re not using a smartphone<br>
								that features an HTML5/Webkit-based Web browser.</p>
						</div>
						<!-- end middle -->
					</div>';
				} else {
					echo '
					<article class="login o1 clearfix">
						
						<p class="alert o0" id="alert-userId" style="display: none;">You must provide a valid <strong>email address</strong>.</p>
						<p class="alert o0" id="alert-password" style="display: none;"><strong>Password</strong> is a required field.</p>
						<p class="alert o0" id="alert-wrongUserPassword" style="display: none;">Wrong <strong>email address</strong> or <strong>password</strong>.</p>
						<p class="alert o0" id="alert-cantConnect" style="display: none;">Cannot connect to the MHT server. <strong>Please check your internet connection.</strong></p>
						<p class="alert o0" id="alert-userNotEnabled" style="display: none;"><strong>User not enabled</strong></p>
						<form id="login" action="#">
							<fieldset>
								<input type="email" name="userId" class="top" id="userId" placeholder="Email" required="required" autocorrect="off" autocapitalize="off">
								<input type="password" name="password" class="bottom" id="password" placeholder="Password" required="required">
								<div class="fRight">
									<input type="checkbox" name="remember" id="remember">
									<label for="remember">Remember me</label>
								</div>
								<!-- end fRight -->
								<input type="submit" name="btnLogin" id="btnLogin" value="Sign in">
							</fieldset>
						</form>
						
					</article>
					
					<!-- end login -->
					<div class="shareAlert o0" id="sa" style="display: none;">
						<a href="#" class="img" id="btnCloseShare"><span>Close</span></a>
						<p>To install this Web site on your device as an app., please tap the <strong>Share</strong> button below and select <strong>Add to Home Screen</strong>.</p>
						<a href="#" id="ds">Don\'t show this message again.</a>
						<div>&nbsp;</div>
					</div>
					<!-- end shareAlert -->
				';
				}
				
				//â€œ â€� // these were around "Add to Home Screen" for some unknown reason, I assume they were supposed to be quotes. 
			?>
		</div>
		<footer>
			<article>
				<p class="forgot"><a href="02_forgot.php" title="Forgot your password?" id="btnForgot">Forgot your password?</a></p>

			</article>
			<ul class='nav'>
				<li><a href="timeline.php" id="nav-timeline">TimeLine</a></li>
				<li><a href="survey.php" id="nav-survey" class="active">Survey</a></li>
				<li><a href="settings.php" id="nav-settings">Settings</a></li>
			</ul>
		</footer>
		<script src="js/jquery.min.js"></script>
		<?php /*?><script src="js/jquery-ui-1.10.2.custom.js"></script>*/?>
		<script src="js/jquery-ui-1.10.4.custom.js"></script>
		<script src="js/jquery.colorpicker.js"></script>
		<script src="js/menu-ui.js"></script>
		<script src="js/d3.js"></script>		
		<script src="js/min/scripts-min.js"></script>
		<script src="js/preloadGraphics.js"></script>
		<script src="js/pages.js"></script>
		<script src="js/mc.js"></script>
		<script src="js/range.js"></script>
		<script src="js/middle.js"></script>
		<script src="js/quiz.js"></script>
		<script src="js/dataVisualizationSelect.js"></script>
		<script src="js/d3graph.js"></script><?php /*?>*/?>
		<?php /*<script src="js/d3graph-mod.js"></script>*/?>
		<!--<script src="js/d3graph-data-only.js"></script>-->
		<script src="js/login.js"></script>
		<script src="js/resize.js"></script>
		<script src="js/forgot.js"></script>
		<script src="js/shareAlert.js"></script>
		<script src="js/jquery.autocomplete.js"></script>
		
		
		<?php
			if ($page == 'reset') {
				echo '
				<script src="js/reset.js"></script>';
			}
		?>

		<script>
			var prevQuest = null;
			var currQuest;
			var nextQuest;
			var lastQuest;
			var lastCompQuest;
		</script>
		<script src="js/questionnaire.js"></script>
		<script>
			var questionnaire;
			var results = {
				"patientID": null,
				"sessionID": null,
				"date": null,
				"answers": []
			};
			/*
				results is going to have a structure like this: 
				{
					"patientID": ,
					"sessionID": ,
					"date": ,
					"answers": [
						{
							"questionID": ,
							"answer": ,
							"flipped": 
						}
					]
				}
			*/
		
			var width;
			var height;
			var pos1 = 0;
			var pos2;
			var pos3;
			var loggedIn = false;

			var uname = <? echo '"' . $_COOKIE['e'] . '"'; ?>;
			var pword = <?php
			if (isset($_COOKIE['n'])){
				$arr = explode("_", $_COOKIE['n'], 2); //explode at "_"
				$length = (int) $arr[0]; //take the first item
				
				echo  '"'.str_repeat("*", $length).'"';
			}
			else
			echo '""';
			?>;
			
			$(document).ready(function() {
				$('html').removeClass('no-js').addClass('js');
				PreloadGraphics.init();
			<?php
			if ($page == 'reset') {
				echo "
						Reset.init();
						// Resize.init();";
			} else if ($desktop == true || $tablet == true) {
				echo "
						Middle.init();";
			} else {
				echo "
						Login.loginFields();
						ShareAlert.init();";
			}
			?>

			});
		</script>
	</body>
</html>