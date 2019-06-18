<%@ taglib uri="//java.sun.com/jsp/jstl/core" prefix="c" %>
<!-- VERSION TWO -->
<header id="header">
	<div class="container">

		<!-- header -->
		<div class="tp-header-sections">
			<!-- cdc -->
			<div id="logo" class="tp-header-section-left">
				<c:import context="/TemplatePackage" url="/3.0/includes/_jsp/logo.jsp" charEncoding="UTF-8"></c:import>
			</div>

			<!-- search -->
			<div id="searchArea" class="tp-header-section-right hidden-one hidden-two">
				<c:import context="/TemplatePackage" url="/3.0/includes/_jsp/search.jsp" charEncoding="UTF-8"></c:import>
				<div class="a2z-button pull-right hidden-one hidden-two"><a href="#" id="azTab">CDC A-Z Index <span class="icon-angle-down"></span></a></div>
			</div>
		</div><!-- row -->

		<c:import context="/TemplatePackage" url="/3.0/includes/_jsp/menu.jsp" charEncoding="UTF-8"></c:import>
		<div class="a2z-bar hide">
			<c:import context="/TemplatePackage" url="/3.0/includes/_jsp/a2z.jsp" charEncoding="UTF-8"></c:import>
		</div>
		<div id="searchArea-two-column" class="hide searchbar hidden-three hidden-four">
			<c:import context="/TemplatePackage" url="/3.0/includes/_jsp/search.jsp" charEncoding="UTF-8"></c:import>
		</div>
		<c:import context="/TemplatePackage" url="/3.0/includes/_jsp/emergency.jsp" charEncoding="UTF-8"></c:import>

		<!-- /header -->
		<div class="titlebar">
			<c:import context="/TemplatePackage" url="/3.0/modules/local/includes/_jsp/siteTitle.jsp" charEncoding="UTF-8"></c:import>
		</div>
		<c:import context="/TemplatePackage" url="/3.0/includes/_jsp/noscript.jsp" charEncoding="UTF-8"></c:import>
	</div>
</header>
<!-- /VERSION TWO -->
