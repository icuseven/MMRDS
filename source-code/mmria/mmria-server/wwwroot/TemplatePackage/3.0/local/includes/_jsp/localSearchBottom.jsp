<%@ taglib uri="//java.sun.com/jsp/jstl/core" prefix="c" %><div class="hidden"><a href="#" id="searchTargetBottom">Start of Search Controls</a></div>
<form id="searchFormBottom" method="get" action="https://search.cdc.gov/search">
	<fieldset>
		<legend>Search Form Controls</legend>
		<table class="hidden-two hidden-four">
			<tr>
				<!-- Begin editable/configurable content -->
				<td class="labletd"><label class="subset"><input type="checkbox" name="subset" checked="checked" value="mmwr" />FASDs ONLY</label></td>
			</tr>
		</table>
		<table>
			<tr>
				<td class="hidden-three hidden-one"><label class="subset"><input type="checkbox" name="subset" checked="checked" value="mmwr" />FASDs ONLY</label></td>
				<!-- End editable/configurable content -->
				<td class="searchtd"><label class="search-box"><input id="searchBoxLocalBottom" type="text" placeholder="SEARCH" name="query" /><span class="hidden">Search The CDC</span></label></td>
				<td class="buttontd"><button class="submit"><span class="sprite-16-search-black hidden-one hidden-two">submit</span><span class="sprite-24-search-black hidden-three hidden-four">submit</span></button></td>
			</tr>
		</table>
		<input type="hidden" name="utf8" value="&#x2713;"/>
		<input type="hidden" name="affiliate" value="cdc-main"/>
	</fieldset>
</form>
