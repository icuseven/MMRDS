<%@ taglib uri="//java.sun.com/jsp/jstl/core" prefix="c" %><script>
	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}

	var theme = getParameterByName('theme') || 'theme-blue';

	var strClassList = document.documentElement.className;
	document.documentElement.className = strClassList + ' ' + theme;

	console.log(getParameterByName('theme'));
	console.log(document.documentElement.className);
</script>
<style>
	.tp-test-theme-selector li {
		list-style-type: none;
	}
</style>
<h4>Select a theme:</h4>
<ul class="tp-test-theme-selector">
	<li> <a href="?theme=theme-blue">Blue</a></li>
	<li> <a href="?theme=theme-green">Green</a></li>
	<li> <a href="?theme=theme-purple">Purple</a></li>
	<li> <a href="?theme=theme-rose">Rose</a></li>
	<li> <a href="?theme=theme-orange">Orange</a></li>
	<li> <a href="?theme=theme-tan">Tan</a></li>
	<li> <a href="?theme=theme-teal">Teal</a></li>
</ul>