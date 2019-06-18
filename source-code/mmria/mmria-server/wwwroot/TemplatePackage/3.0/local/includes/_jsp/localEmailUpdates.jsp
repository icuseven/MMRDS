<%@ taglib uri="//java.sun.com/jsp/jstl/core" prefix="c" %>	<div class="module-typeG emailupdates">
		<span class="sprite-24-govd-icon"></span>
		<h4>Get Email Updates</h4>
		<p>To receive email updates about this page, enter your email address:</p>
		<form name="govdelivery" action="https://public.govdelivery.com/accounts/USCDC/subscribers/qualify">
			<fieldset>
				<input name="topic_id" type="hidden" value="USCDC" />
				<label>
					<span class="hidden">Enter Email Address</span>
					<input type="text" class="email" name="email" value="" onfocus="this.value=''" />
				</label>
				<a class="explain" href="//www.cdc.gov/emailupdates/">What's this?</a><a href="javascript:quicksubscribe();return false;" class="button">Submit</a>
				<noscript>
					<a class="explain" href="//www.cdc.gov/emailupdates/">What's this?</a>
					<label>
						<span class="hidden">Submit Button</span>
						<input type="submit" class="button submit" name="commit" value="Submit" />
					</label>
				</noscript>
			</fieldset>
		</form>
	</div>

