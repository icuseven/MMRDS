<!DOCTYPE html>
<!--[if lt IE 8]>      <html class="no-js nav theme-blue lt-ie10 lt-ie9 lt-ie8" lang="en-us"> <![endif]-->
<!--[if IE 8]>         <html class="no-js nav theme-blue lt-ie10 lt-ie9" lang="en-us"> <![endif]-->
<!--[if IE 9]>         <html class="no-js nav theme-blue lt-ie10" lang="en-us"> <![endif]-->
<!--[if !IE]><!-->     <html class="no-js nav theme-blue" lang="en-us"> <!--<![endif]-->
	<head>
		<meta charset="utf-8" />
		<title>E-mail a Link to This Page from CDC.gov Confirmation | CDC</title>

		<meta name="description" content="CDC - E-mail a Link to This Page from CDC.gov Confirmation Page" />
		<meta name="keywords" content="CDC, E-mail, Share" />
		<meta name="viewport" content="width=device-width, initial-scale=1" />

		<meta property="cdc:template_version" content="3.0" />

		<?php include $_SERVER["DOCUMENT_ROOT"] . "/TemplatePackage/3.0/includes/_php/head.php"; ?>

		<!-- Local CSS reference to allow overrides for the page/site -->
		<link rel="stylesheet" href="/TemplatePackage/3.0/css/email-link.css" />

	</head>
	<body>
		<div id="wrapper">
			<header id="header">
				<div class="container">
					<div class="titlebar">
						<h1>E-mail a Link to This Page from CDC.gov Confirmation</h1>
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

								<div id="emailLinkBody">
									<div class="inner">
										<div class="email-link-confirmation">
											<div class="row">
												<div class="message">The following link was successfully sent to [toEmail].</div>
											</div>
											<div class="row">
												<a class="link" href="[PageUrl]">
													[PageTitle]
												</a>
											</div>
											<div class="row">
												<div class="form-actions">
													<div class="policy">
														The information on this page will not be used to send 
														unsolicited email, and will not be sent to a third party.<br />
														<a href="//www.cdc.gov/other/privacy.html">Privacy Policy</a>
													</div>
												</div>
											</div>
										</div>
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
		<!--include virtual="/TemplatePackage/3.0/includes/metricsTop.html" -->
		<!--include virtual="/TemplatePackage/3.0/include/email/metricsSettings.html" -->		
		<!--include virtual="/TemplatePackage/3.0/includes/metricsBottom.html" -->
	</body>
</html>
