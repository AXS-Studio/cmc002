var Pages = {
	login: '<article class="login o0" style="display: none;">\
				<p class="alert o0" id="alert-userId" style="display: none;">You must provide a valid <strong>email address</strong>.</p>\
				<p class="alert o0" id="alert-password" style="display: none;"><strong>Password</strong> is a required field.</p>\
				<p class="alert o0" id="alert-wrongUserPassword" style="display: none;">Wrong <strong>email address</strong> or <strong>password</strong>.</p>\
				<p class="alert o0" id="alert-cantConnect" style="display: none;">Cannot connect to the MHT server. <strong>Please check your internet connection.</strong></p>\
				<p class="alert o0" id="alert-userNotEnabled" style="display: none;"><strong>User not enabled</strong></p>\
				<form id="login" action="#">\
					<fieldset>\
						<input type="email" name="userId" class="top" id="userId" placeholder="Email address" required="required" autocorrect="off" autocapitalize="off">\
						<input type="password" name="password" class="bottom" id="password" placeholder="Password" required="required">\
						<div class="fRight">\
							<input type="checkbox" name="remember" id="remember">\
							<label for="remember">Remember me</label>\
						</div>\
						<!-- end fRight -->\
						<input type="submit" name="btnLogin" id="btnLogin" value="Login">\
					</fieldset>\
				</form>\
				<p class="forgot"><a href="02_forgot.php" title="Forgot your password?" id="btnForgot">Forgot your password?</a></p>\
			</article>',
	sbHeader: '<header class="mht o0" style="display: none;">\
			<img src="images/MHT_logo.png" alt="MHT" width="80" height="27">\
		</header>',
	range: '<article class="o0" id="art-" style="display: none;">\
			<nav class="backNext">\
				<ul>\
					<li class="back"><a href="#" title="Back" class="active" id="back-"><span>Back</span></a></li>\
					<li class="count"><span id="cq-"></span> of <span id="tq-"></span></li>\
					<li class="next"><a href="#" title="Next" id="next-"><span>Next</span></a></li>\
				</ul>\
			</nav>\
			<!-- end backNext -->\
			<div class="qCont" id="qcIscroll-">\
				<div class="question">\
					<p class="instruction">Using the line below, please rate<br/><span id="p-" style="color:#000;"></span></p>\
					<!-- <p>for the past <span id="days-"></span> <span id="dayDays-"></span>.</p> -->\
				</div>\
				<!-- end question -->\
			</div>\
			<!-- end qcIscroll -->\
			<form class="range">\
				<fieldset>\
					<input type="range" name="q-" id="q-" required>\
				</fieldset>\
				<!-- end range -->\
			</form>\
			<div class="markers">\
				<p class="range left" id="rl-">\
					<em></em>\
					<span>&nbsp;</span>\
				</p>\
				<p class="range right" id="rr-">\
					<em></em>\
					<span>&nbsp;</span>\
				</p>\
			</div>\
			<!-- end markers -->\
		</article>',
	startQuiz: '<article class="start-quiz" style="display: none;">\
			<button class="start-survey">Start survey</button>\
		</article>',
	mc4: '<article class="o0" id="art-" style="display: none;">\
			<nav class="backNext">\
				<ul>\
					<li class="back"><a href="#" title="Back" class="active" id="back-"><span>Back</span></a></li>\
					<li class="count"><span id="cq-"></span> of <span id="tq-"></span></li>\
					<li class="next"><a href="#" title="Next" id="next-"><span>Next</span></a></li>\
				</ul>\
			</nav>\
			<!-- end backNext -->\
			<div class="qCont">\
				<div class="question">\
					<p class="instruction">Please select the one response that best describes you for the past <span id="days-"></span> <span id="dayDays-"></span>.</p>\
					<form class="radioButtons">\
						<fieldset>\
							<div class="row clearfix">\
								<div class="radioCheck"><input type="radio" name="a-" id="a--0" value=""></div>\
								<div class="label"><label for="a--0" id="label--0"></label></div>\
							</div>\
							<!-- end row -->\
							<div class="row clearfix">\
								<div class="radioCheck"><input type="radio" name="a-" id="a--1" value=""></div>\
								<div class="label"><label for="a--1" id="label--1"></label></div>\
							</div>\
							<!-- end row -->\
							<div class="row clearfix">\
								<div class="radioCheck"><input type="radio" name="a-" id="a--2" value=""></div>\
								<div class="label"><label for="a--2" id="label--2"></label></div>\
							</div>\
							<!-- end row -->\
							<div class="row clearfix">\
								<div class="radioCheck"><input type="radio" name="a-" id="a--3" value=""></div>\
								<div class="label"><label for="a--3" id="label--3"></label></div>\
							</div>\
							<!-- end row -->\
						</fieldset>\
					</form>\
					<!-- end radioButtons -->\
				</div>\
				<!-- end question -->\
			</div>\
			<!-- end qcIscroll -->\
		</article>',
	mc5: '<article class="o0" id="art-" style="display: none;">\
			<nav class="backNext">\
				<ul>\
					<li class="back"><a href="#" title="Back" class="active" id="back-"><span>Back</span></a></li>\
					<li class="count"><span id="cq-"></span> of <span id="tq-"></span></li>\
					<li class="next"><a href="#" title="Next" id="next-"><span>Next</span></a></li>\
				</ul>\
			</nav>\
			<!-- end backNext -->\
			<div class="qCont">\
				<div class="question">\
					<p class="instruction">Choose which statement best describes the way you have been feeling for the past <span id="days-"></span> <span id="dayDays-"></span>.</p>\
					<form class="radioButtons">\
						<fieldset>\
							<div class="row clearfix">\
								<div class="radioCheck"><input type="radio" name="a-" id="a--0" value=""></div>\
								<div class="label"><label for="a--0" id="label--0"></label></div>\
							</div>\
							<!-- end row -->\
							<div class="row clearfix">\
								<div class="radioCheck"><input type="radio" name="a-" id="a--1" value=""></div>\
								<div class="label"><label for="a--1" id="label--1"></label></div>\
							</div>\
							<!-- end row -->\
							<div class="row clearfix">\
								<div class="radioCheck"><input type="radio" name="a-" id="a--2" value=""></div>\
								<div class="label"><label for="a--2" id="label--2"></label></div>\
							</div>\
							<!-- end row -->\
							<div class="row clearfix">\
								<div class="radioCheck"><input type="radio" name="a-" id="a--3" value=""></div>\
								<div class="label"><label for="a--3" id="label--3"></label></div>\
							</div>\
							<!-- end row -->\
							<div class="row clearfix">\
								<div class="radioCheck"><input type="radio" name="a-" id="a--4" value=""></div>\
								<div class="label"><label for="a--4" id="label--4"></label></div>\
							</div>\
							<!-- end row -->\
						</fieldset>\
					</form>\
					<!-- end radioButtons -->\
				</div>\
				<!-- end question -->\
			</div>\
			<!-- end qcIscroll -->\
		</article>',
	other: '<article class="o0" id="art-" style="display: none;">\
			<nav class="backNext">\
				<ul>\
					<li class="back"><a href="#" title="Back" class="active" id="back-"><span>Back</span></a></li>\
					<li class="count"><span id="cq-"></span> of <span id="tq-"></span></li>\
					<li class="next"><a href="#" title="Next" id="next-"><span>Next</span></a></li>\
				</ul>\
			</nav>\
			<!-- end backNext -->\
			<div class="qCont">\
				<div class="question">\
					<p class="instruction">Please indicate <br/><span id="p-"></span> in the last <span id="days-"></span> <span id="dayDays-"></span>?</p>\
					<form class="radioButtons">\
						<fieldset>\
							<div class="row clearfix">\
								<div class="radioCheck"><input type="radio" name="a-" id="a--0" value=""></div>\
								<div class="label"><label for="a--0" id="label--0"></label></div>\
							</div>\
							<!-- end row -->\
							<div class="row clearfix">\
								<div class="radioCheck"><input type="radio" name="a-" id="a--1" value=""></div>\
								<div class="label"><label for="a--1" id="label--1"></label></div>\
							</div>\
							<!-- end row -->\
						</fieldset>\
					</form>\
					<!-- end radioButtons -->\
				</div>\
				<!-- end question -->\
			</div>\
			<!-- end qcIscroll -->\
		</article>',
	comment: '<article class="o0" id="art-" style="display: none;">\
			  <nav class="backNext">\
				<ul>\
					<li class="back"><a href="#" title="Back" class="active" id="back-"><span>Back</span></a></li>\
					<li class="next btnSubmit"><a href="#" title="Submit" id="next-"><span>Submit</span></a></li>\
				</ul>\
			</nav>\
			<!-- end backNext -->\
			<div class="twenty clearfix">\
				<p>Comments</p>\
				<form id="comment" action="#" class="textarea">\
					<fieldset>\
						<textarea name="comments" id="comments" placeholder="" rows="5"></textarea>\
					</fieldset>\
					<p>Tags</p>\
					<fieldset>\
						<input name="tags" id="tags" placeholder="" type="text"/><button class="add-tag">+</button>\
					</fieldset>\
					<div class="tag-container"></div>\
				</form>\
			</div>\
			<!-- end textarea -->\
		</article>',
	submit: '<article class="message o0" id="art-" style="display: none;">\
			<div id="middle">\
				<p>Thanks for responding.<br>\
					Please <a href="#" title="Submit your questionnaire" class="btnSubmit">submit</a> your questionnaire to complete this session.</p>\
					<button class="btnSubmit">Submit</button>\
			</div>\
			<!-- end middle -->\
			<div class="bbWrap">\
				<a id="back-" class="backBtn active" title="Back" href="#">\
					<span>Back</span>\
				</a>\
				<!-- end active -->\
			</div>\
			<!-- end bbWrap -->\
		</article>',
	noConnection: '<article class="message o0" id="art-nc" style="display: none;">\
			<div id="middle">\
				<h2>There was a problem</h2>\
				<p>¦and your questionnaire didn\'t submit. Your answers to this questionnaire will submit automatically the next time you successfully log in.</p>\
			</div>\
			<!-- end middle -->\
		</article>',
	noQuestions: '<article class="message o0" id="art-nq" style="display: none;">\
			<div id="middle">\
				<h2>Questionnaire Missing</h2>\
				<p>Contact your doctor.</p>\
			</div>\
			<!-- end middle -->\
		</article>',
	thanks: '<article class="o0" id="art-thanks" style="display: none;">\
			<div id="middle">\
				<h2>Thank you.</h2>\
				<button class="end-survey">Logout</button>\
			</div>\
			<!-- end middle -->\
		</article>',
	forgot: '<article class="o0" id="art-forgot" style="display: none;">\
			<h1 class="plain">Forgot your password?</h1>\
			<p>Enter your email address to help us locate your account information. You may need to check your spam folder or unblock<br>\
				<strong>pathadmin@sunnybrook.ca</strong>.</p>\
			<p class="alert o0" id="alert-email" style="display: none;"><strong>Email address</strong> is a required field.</p>\
			<p class="alert o0" id="alert-wrongUser" style="display: none;">Wrong <strong>email address</strong></p>\
			<p class="alert o0" id="alert-cantConnect" style="display: none;">Cannot connect to the MHT server. <strong>Please check your internet connection.</strong></p>\
			<p class="alert o0" id="alert-userNotEnabled" style="display: none;"><strong>User not enabled</strong></p>\
			<form id="forgot" action="#">\
				<fieldset>\
					<input type="email" name="email" id="email" placeholder="Email" required autocapitalize="off" autocorrect="off">\
					<input type="submit" name="btnSubmit" id="btnSubFgPw" value="Submit">\
				</fieldset>\
			</form>\
		</article>',
	fgThanks: '<article class="o0" id="art-fgThanks" style="display: none;">\
			<div id="middle">\
				<h2>You will recieve an email shortly containing directions on how to reset your account\'s password.</h2>\
			</div>\
			<!-- end middle -->\
		</article>',
	timeline: '<article class="o0" id="art-timeline" style="display: none;">\
			<nav id="graph-header"><a href="#" class="btnmenu external"></a></nav><div style="clear:both;"></div>\
				<aside id="graph-menu">\
		<nav id="graph-nav">\
			<a href="#" class="btnmenu internal"></a>\
			<a href="#" id="legend" class="tab selected">Legend</a>\
			<a href="#" id="edit" class="tab">Edit</a>\
			<a href="#" id="share" class="tab">Share</a>\
		</nav>\
	<div id="content">\
		<div id="legend_content" class="tab_content active"></div>\
		<div id="edit_content" class="tab_content"></div>\
		<div id="share_content" class="tab_content"></div>\
	</div>\
	</aside>\
		<div class="containerForGraphs" id="cfg"><div id="cfgGraphs">&nbsp;</div></div>\
	   </article>',
	settings: '<article class="o0" id="art-settings" style="display: none;">\
				<div id="settings">\
					<button class="logout-setting">Logout</button>\
					<button class="change-setting">Change password</button>\
					<button class="faq-setting">FAQ</button>\
					<button class="about-setting">About</button>\
				</div>\
				<!-- end settings -->\
		</article>',
	faq: '<article class="o0" id="art-faq" style="display: none;">\
			<nav class="backNext">\
				<ul>\
					<li class="back cancel"><a href="#" title="Cancel" class="active" id="cancel"><span>Cancel</span></a></li>\
					<li class="setting-title">FAQ</li>\
				</ul>\
			</nav>\
			<!-- end backNext -->\
			<div class="qCont">\
				<div class="faq">\
					<p>Insert FAQ copy here</p>\
				</div>\
				<!-- end faq -->\
			</div>\
			<!-- end qcIscroll -->\
		</article>',
	about: '<article class="o0" id="art-about" style="display: none;">\
				<nav class="backNext">\
					<ul>\
						<li class="back cancel"><a href="#" title="Cancel" class="active" id="cancel"><span>Cancel</span></a></li>\
						<li class="setting-title">About</li>\
					</ul>\
				</nav>\
				<!-- end backNext -->\
				<div class="qCont">\
					<div class="about">\
						<div class="headings">\
							<img src="images/MHT_logo.png" alt="MHT" width="160" height="54">\
							<p>version 1.0.1</p>\
							<button class="about-contact">Contact administrator</button>\
						</div>\
						<h1>Terms of use</h1>\
						<p>Instert terms here</p>\
					</div>\
					<!-- end about -->\
				</div>\
				<!-- end qcIscroll -->\
			</article>',
	resetLogin: '<article class="login o0" id="art-resetLogin" style="display: none;">\
					<h1 class="plain">Your password has been successfully changed.</h1>\
					<p>Please login to Mental Health Telemetry with your updated information:</p>\
					<p class="alert o0" id="alert-userId" style="display: none;">You must provide a valid <strong>email address</strong>.</p>\
					<p class="alert o0" id="alert-password" style="display: none;"><strong>Password</strong> is a required field.</p>\
					<p class="alert o0" id="alert-wrongUserPassword" style="display: none;">Wrong <strong>email address</strong> or <strong>password</strong>.</p>\
					<p class="alert o0" id="alert-cantConnect" style="display: none;">Cannot connect to the MHT server. <strong>Please check your internet connection.</strong></p>\
					<p class="alert o0" id="alert-userNotEnabled" style="display: none;"><strong>User not enabled</strong></p>\
					<form id="login" action="#">\
						<fieldset>\
							<input type="email" name="userId" class="top" id="userId" placeholder="Email" required="required" autocorrect="off" autocapitalize="off">\
							<input type="password" name="password" class="bottom" id="password" placeholder="Password" required="required">\
							<div class="fRight">\
								<input type="checkbox" name="remember" id="remember">\
								<label for="remember">Remember me</label>\
							</div>\
							<!-- end fRight -->\
							<input type="submit" name="btnLogin" id="btnLogin" value="Sign in">\
						</fieldset>\
					</form>\
				</article>\
				<!-- end login -->\
				<div class="shareAlert o0" id="sa">\
					<a href="#" class="img" id="btnCloseShare"><span>Close</span></a>\
					<p>To install this Web site on your device as an app., please tap the <strong>Share</strong> button below and select <strong>œAdd to Home Screen</strong>.</p>\
					<a href="#" id="ds">Don\'t show this message again.</a>\
					<div>&nbsp;</div>\
				</div>',
	changePassword: '<article class="reset o1">\
						<nav class="backNext">\
							<ul>\
								<li class="back cancel"><a href="#" title="Cancel" class="active" id="cancel"><span>Cancel</span></a></li>\
								<li class="setting-title">Change password</li>\
							</ul>\
						</nav>\
						<!-- end backNext -->\
						<div class="change-pwd">\
						<h1 class="plain">Enter your new password:</h1>\
						<p class="alert o0" id="alert-password" style="display: none;"><strong>New password</strong> is a required field.</p>\
						<p class="alert o0" id="alert-confirmP" style="display: none;"><strong>Confirm new password</strong> is a required field.</p>\
						<p class="alert o0" id="alert-dontMatch" style="display: none;">Your two password fields <strong>don\'t match</strong>. Please try again.</p>\
						<p class="alert o0" id="alert-cantConnect" style="display: none;">Cannot connect to the MHT server. <strong>Please check your internet connection.</strong></p>\
						<p class="alert o0" id="alert-userNotEnabled" style="display: none;"><strong>User not enabled</strong></p>\
						<form id="reset" action="#">\
							<fieldset>\
								<input type="password" name="password" class="top" id="password" placeholder="New password" required="required">\
								<input type="password" name="confirmP" class="bottom" id="confirmP" placeholder="Confirm new password" required="required">\
								<input type="submit" name="btnChangePw" id="btnChangePw" value="Submit">\
							</fieldset>\
						</form>\
						</div>\
					</article>',
	loading: '<article class="o0" id="art-loading" style="display: none;">\
			<div id="middle">\
				<img src="images/ajax-loader.gif" alt="Loading" width="16" height="16">\
			</div>\
			<!-- end middle -->\
		</article>'
};