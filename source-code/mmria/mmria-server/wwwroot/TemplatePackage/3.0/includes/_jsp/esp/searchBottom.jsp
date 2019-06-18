<%@ taglib uri="//java.sun.com/jsp/jstl/core" prefix="c" %><form id="searchFormBottom" method="get" action="https://search.cdc.gov/search">
	<fieldset>
		<legend> Inicio de controles de b&#250;squeda </legend>
		<table>
			<tr>
				<td class="searchtd"><label class="search-box"><input id="searchBoxBottom" type="text" placeholder="BUSCAR" name="query" /><span class="hidden">Buscar en el CDC</span></label></td>
				<td class="buttontd"><button class="submit" value="submit"><span class="sprite-16-search-black">Enviar</span></button></td>
			</tr>
		</table>
		<input name="action" value="search" type="hidden" />
		<input type="hidden" value="es" name="language" />
		<input type="hidden" value="es" name="subset" />
		<input type="hidden" name="utf8" value="&#x2713;"/>
		<input type="hidden" name="affiliate" value="cdc-es"/>
	</fieldset>
</form>
