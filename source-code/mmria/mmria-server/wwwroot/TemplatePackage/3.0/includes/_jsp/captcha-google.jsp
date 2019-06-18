<%@ taglib uri="//java.sun.com/jsp/jstl/core" prefix="c" %>	<div class="form-group recaptcha challenge noLinking noDecoration">
		<script>
			var RecaptchaOptions = { theme : 'white' };
		</script>
		<script type="text/javascript" src="//www.google.com/recaptcha/api/challenge?k=6LeoX_8SAAAAAHg8zLCbOeT3bgPcnziriOmXHxYU"></script>
		<noscript>
			<iframe src="//www.google.com/recaptcha/api/noscript?k=6LeoX_8SAAAAAHg8zLCbOeT3bgPcnziriOmXHxYU" height="300" width="500" title="Challenge field"></iframe>
			<div class="form-group">
				<label for="recaptcha_challenge_field">Respond to the challenge above to get a value to enter in this box:</label>
				<textarea id="recaptcha_challenge_field" name="recaptcha_challenge_field" 
					rows="3" cols="40"></textarea>
				<input type="hidden" name="recaptcha_response_field" value="manual_challenge" />
			</div>
		</noscript>
	</div>

