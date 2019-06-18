<%@ taglib uri="//java.sun.com/jsp/jstl/core" prefix="c" %><div class="hidden"><a href="#" name="searchTarget">Start of Search Controls</a></div>
<form accept-charset="UTF-8" action="https://search.cdc.gov/search" id="search_form" method="get" class="searchForm" >
	<fieldset class="search-form-wrapper">
		<legend>Search Form Controls</legend>
		<div class="search-form-checkbox">
			<label class="subset"><input type="checkbox" name="subset" checked="checked" value="topic">TOPIC ONLY</label>
		</div>
		<div class="search-input-wrapper">
			<div class="search-buttons">
				<button class="btn-clear"><span class="sprite-14-close">cancel</span></button>
				<button class="btn-submit"><span class="sprite-14-search-black">submit</span></button>
			</div>
			<div class="search-input">
				<label><input type="text" placeholder="SEARCH" autocomplete="off" class="usagov-search-autocomplete" name="query"/><span class="hidden">Search The CDC</span></label>
			</div>
		</div>
		<input type="hidden" name="utf8" value="&#x2713;"/>
		<input type="hidden" name="affiliate" value="cdc-main"/>
	</fieldset>
</form>
<!--
<form accept-charset="UTF-8" action="https://search.cdc.gov/search" id="search_form" method="get">
<input name="utf8" type="hidden" value="&#x2713;" />
<input id="affiliate" name="affiliate" type="hidden" value="cdc-main" />
<label for="query">Enter Search Term(s):</label>
<input autocomplete="off" class="usagov-search-autocomplete" id="query" name="query" type="text" />
<input name="commit" type="submit" value="Search" />
</form>
-->