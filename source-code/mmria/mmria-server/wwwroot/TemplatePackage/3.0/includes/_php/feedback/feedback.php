<!DOCTYPE html>
<!--[if lt IE 8]>      <html class="no-js nav theme-blue lt-ie10 lt-ie9 lt-ie8" lang="en-us"> <![endif]-->
<!--[if IE 8]>         <html class="no-js nav theme-blue lt-ie10 lt-ie9" lang="en-us"> <![endif]-->
<!--[if IE 9]>         <html class="no-js nav theme-blue lt-ie10" lang="en-us"> <![endif]-->
<!--[if !IE]><!-->     <html class="no-js nav theme-blue" lang="en-us"> <!--<![endif]-->
	<head>
		<meta charset="utf-8" />
		<title>Anonymous Feedback | CDC</title>

		<meta name="description" content="CDC - Anonymous Feedback" />
		<meta name="keywords" content="CDC, Feedback" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />

		<meta property="cdc:template_version" content="3.0" />

		<?php include $_SERVER["DOCUMENT_ROOT"] . "/TemplatePackage/3.0/includes/_php/head.php"; ?>
		<script type="text/javascript" src="http://www.google.com/recaptcha/api.js" async defer></script> 
		<!-- Local CSS reference to allow overrides for the page/site -->
		<link rel="stylesheet" href="/TemplatePackage/3.0/css/email-link.css" />

	</head>
	<body>
		<div id="wrapper">
			<header id="header">
				<div class="container">
					<div class="titlebar">
						<h1>Anonymous Feedback</h1>
					</div>
				</div>
			</header>
			<div class="container">
				<div id="content">
					<div class="row">
						<!-- body -->
						<div id="body" class="span19">
							<div id="contentArea">
								<!-- begin editable -->

								<div id="feedbackBody">
									<div class="inner">
										
										<!-- TEST ACTION -->
										<!-- <form action="http://oadc-dmb-dev.cdc.gov:9088/podcasts/validation.asp" method="get" class="validate form-horizontal" role="form"> -->
										
										<!-- form starts -->
										<form action="https://www2c.cdc.gov/podcasts/validation2.asp" method="get" class="validate form-horizontal" role="form">
											<!--input name="validator" type="hidden" value="cdc_challenge" /-->
											<input name="validator" type="hidden" value="recaptcha" />
											<input name="version" type="hidden" value="2" />
											<input name="EmailTemplate" type="hidden" value="https://www.cdc.gov/TemplatePackage/3.0/includes/feedback/feedback-template.txt" />
											<input name="LineWrap" type="hidden" value="2048" />
											<input name="RCPT" type="hidden" value="" />
											<input name="refer" type="hidden" value="https://www.cdc.gov/TemplatePackage/3.0/includes/feedback/feedback-confirm.html" />
											<input name="VSubject" type="hidden" value="Anonymous Feedback" />
											<input name="Subject" type="hidden" value="Anonymous Feedback" />
											<input name="SMTP" type="hidden" value="smtpgw.cdc.gov" />
											<input name="PageTitle" type="hidden" value="" />
											<input name="PageUrl" type="hidden" value="" />
											<fieldset>
												<legend>Anonymous Feedback</legend>
												<div class="form-group">
													<div id="custom-prompt"></div>
													<label for="comment" class="comment">
													Please provide us your feedback.<br />
														(All comments are anonymous. Include your contact information if you would like a response.)
													</label>
													<textarea id="comment" name="req.comment" 
														rows="8" cols="50" 
														class="form-control input-xxlarge"
														value=""
														required="required"></textarea>
												</div>
												<div>
													In order to help us prevent unintended delivery of feedback e-mail messages from
													automated systems, please enter the characters exactly as shown in the box below.
												</div>
												<?php include $_SERVER["DOCUMENT_ROOT"] . "/TemplatePackage/3.0/includes/_php/captcha-google2.php"; ?>
												<!--include virtual="/TemplatePackage/3.0/includes/captcha-math.html" -->
												<div class="form-actions">
													<button id="submitButton" name="submitButton" class="btn btn-primary" type="submit">Submit</button>
													<button id="cancelButton" name="cancelButton" class="btn" type="reset">Cancel</button>
												</div>
											</fieldset>
										</form>
										<!-- form ends -->
									</div>
								</div>

								<!-- /end editable -->
							</div><!-- /end #contentArea -->
						</div><!-- /end #body -->
					</div>
				</div><!-- /end #content -->
			</div><!-- / end .container -->

			<!-- footer -->
			<footer id="footer">
			</footer>
			<!-- /#footer -->
		</div>
		<?php include $_SERVER["DOCUMENT_ROOT"] . "/TemplatePackage/3.0/includes/_php/js-core.php"; ?>
		<?php include $_SERVER["DOCUMENT_ROOT"] . "/TemplatePackage/3.0/includes/_php/js-modules.php"; ?>
		<?php include $_SERVER["DOCUMENT_ROOT"] . "/TemplatePackage/3.0/includes/_php/feedback/localJs.php"; ?>
		<script>
			$(function() {
				var domain = CDC.getDomain(window.opener.location.href).split(':')[0];
				if (domain.endsWith('.cdc.gov') || domain.endsWith('.hhs.gov')) {
					$('input[type="hidden"][name="PageTitle"]').val(window.opener.document.title);
					$('input[type="hidden"][name="PageUrl"]').val(window.opener.location.href);
					var q = CDC.qs['questionNumber'];
					if (!isNaN(q)) {
						$.ajax({
							url: '/JScript/feedback/' + q + '.html',
							dataType: 'html'
						})
						.done(function(data) {
							// Update the content on the form with the referenced content.
							$('#custom-prompt').html(data);
							// Now update the e-mail addresses that the feedback will be sent to.
							$.ajax({
								url: '/JScript/feedback/ResponseEmailMapping.txt?timestamp=' + (new Date().getTime()),
								dataType: 'text'
							})
							.done(function(data) {
								var lines = data.split('\n');
								for (var i = 0; i < lines.length; i++) {
									var entry = lines[i].split(':');
									if (entry && entry[0] === q) {
										$('#feedbackBody input[type="hidden"][name="RCPT"]').val(entry[1].replace(/[\n\r]/g, ''));
									}
								}
							})
							.fail(function(jqXHR, textStatus, errorThrown) {
								log(textStatus + ' - ' + errorThrown);
							});
						})
						.fail(function(jqXHR, textStatus, errorThrown) {
							log(textStatus + ' - ' + errorThrown);
						});
						// Add event handler to close form when cancel button is clicked.
						$('#cancelButton').click(function() {
							window.close();
						});
					} else {
						window.location = 'https://www.cdc.gov/404.html';
					}
				} else {
					window.location = 'https://www.cdc.gov/404.html';
				}
			});
		</script>
		<?php include $_SERVER["DOCUMENT_ROOT"] . "/TemplatePackage/3.0/includes/_php/metricsTop.php"; ?>
		<?php include $_SERVER["DOCUMENT_ROOT"] . "/TemplatePackage/3.0/includes/_php/email/metricsSettings.php"; ?>
		<?php include $_SERVER["DOCUMENT_ROOT"] . "/TemplatePackage/3.0/includes/_php/metricsBottom.php"; ?>
	</body>
</html>
