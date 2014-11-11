	<header class="sb o1">
				<img src="images/MHT_logo.png" class="mht-logo" width="133" height="45"/>
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
				// } else if ($desktop == true || $tablet == true) {
				// 	echo '<div class="message o1" id="art-deskTab">
				// 		<div id="middle">
				// 			<p>We\'re sorry, it appears you\'re not using a smartphone<br>
				// 				that features an HTML5/Webkit-based Web browser.</p>
				// 		</div>
				// 		<!-- end middle -->
				// 	</div>';
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