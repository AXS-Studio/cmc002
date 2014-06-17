	<article id="art-settings">
				<div id="settings">
				<ul>
					<li><button class="logout-setting">Logout</button></li>
					<li><button class="change-setting">Change password</button></li>
					<li><button class="faq-setting">FAQ</button></li>
					<li><button class="about-setting">About</button></li>
				</ul>
				</div>
				<!-- end settings -->
		</article>

		<article id="art-faq" style="display: none;">
			<nav class="backNext">
				<ul>
					<li class="back cancel"><a href="#" title="Cancel" class="active" id="cancel"><span>Cancel</span></a></li>
					<li class="setting-title">FAQ</li>
				</ul>
			</nav>
			<!-- end backNext -->
			<div class="qCont">
				<div class="faq">
					<p>Insert FAQ copy here</p>
				</div>
				<!-- end faq -->
			</div>
			<!-- end qcIscroll -->
		</article>

		<article  id="art-about" style="display: none;">
				<nav class="backNext">
					<ul>
						<li class="back cancel"><a href="#" title="Cancel" class="active" id="cancel"><span>Cancel</span></a></li>
						<li class="setting-title">About</li>
					</ul>
				</nav>
				<!-- end backNext -->
				<div class="qCont">
					<div class="about">
						<div class="headings">
							<img src="images/MHT_logo.png" alt="MHT" width="160" height="54">
							<p>version 1.0.1</p>
							<button class="about-contact">Contact administrator</button>
						</div>
						<h1>Terms of use</h1>
						<p>Instert terms here</p>
					</div>
					<!-- end about -->
				</div>
				<!-- end qcIscroll -->
			</article>

			<article id="art-change" style="display:none;" class="reset">
						<nav class="backNext">
							<ul>
								<li class="back cancel"><a href="#" title="Cancel" class="active" id="cancel"><span>Cancel</span></a></li>
								<li class="setting-title">Change password</li>
							</ul>
						</nav>
						<!-- end backNext -->
						<div class="change-pwd">
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
						</div>
					</article>