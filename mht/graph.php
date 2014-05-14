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
	
	<?php include './head.php'; ?>
	
	<body>
		<div class="page-wrap">
		
		<!-- MENU -->
			<nav id="graph-header"><a href="#" class="btnmenu external"></a></nav><div style="clear:both;"></div>
			<aside id="graph-menu">
				<nav id="graph-nav">
					<a href="#" class="btnmenu internal"></a>
					<a href="#" id="legend" class="tab selected">Legend</a>
					<a href="#" id="edit" class="tab">Edit</a>
					<a href="#" id="share" class="tab">Share</a>
				</nav>
				<div id="content">
					<div id="legend_content" class="tab_content active"></div>
					<div id="edit_content" class="tab_content"></div>	
					<div id="share_content" class="tab_content"></div>
				</div>
			</aside>
		<!-- END MENU --> 
		
		<!-- BODY CONTENT --> 
			<article id="content">
				
				
			</article>
		<!-- END BODY CONTENT -->
	
		</div>
		
		<?php include './footer.php'; ?>
		
		
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

			var uname = <?php echo '"' . $_COOKIE['e'] . '"'; ?>;
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
			
				initGraphMenu();
				
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