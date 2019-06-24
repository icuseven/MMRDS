/* 
Turn off the display of the syndicated element by default (turned back on by hhs_postsyndicate.js).
*/
var syndicatedElementForDisplay = document.getElementById("cdc_syndicated");
if (syndicatedElementForDisplay) {
	syndicatedElementForDisplay.style.display = "none";
}
