<!DOCTYPE html>
<!--[if lt IE 8]>      <html class="no-js nav theme-blue lt-ie10 lt-ie9 lt-ie8" lang="en-us"> <![endif]-->
<!--[if IE 8]>         <html class="no-js nav theme-blue lt-ie10 lt-ie9" lang="en-us"> <![endif]-->
<!--[if IE 9]>         <html class="no-js nav theme-blue lt-ie10" lang="en-us"> <![endif]-->
<!--[if !IE]><!-->     <html class="no-js nav theme-blue" lang="en-us"> <!--<![endif]-->
	<head>
		<meta charset="utf-8" />
		<title>E-mail a Link to This Page from CDC.gov | CDC</title>

		<meta name="description" content="CDC - E-mail a Link to This Page from CDC.gov" />
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
						<h1>E-mail a Link to This Page from CDC.gov</h1>
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

								<br/>
								<p>The Email Link functionality is currently not available.  Please try again at a later time.</p>
								<br />

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
		<?php include $_SERVER["DOCUMENT_ROOT"] . "/TemplatePackage/3.0/includes/_php/email/localJs.php"; ?>
		<script>
			$(function() {
				var domain = CDC.getDomain(window.opener.location.href).split(':')[0];
				if (domain.endsWith('.cdc.gov') || domain.endsWith('.hhs.gov')) {
					$('#page-title').html(window.opener.document.title);
					$('#page-url').html(window.opener.location.href);
					$('input[type="hidden"][name="PageTitle"]').val(window.opener.document.title);
					$('input[type="hidden"][name="PageUrl"]').val(window.opener.location.href);
					// Add event handler to close form when cancel button is clicked.
					$('#cancelButton').click(function() {
						window.close();
					});
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
