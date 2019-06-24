/*
 * Javascript that defines the mapping of search terms to surveys
cdc_survey_arr[0] = new Mapping("birth defect","http://webeffective.keynote.com/v.asp?inv=7BA8068613D14DB4BC3D03222CFBFD5D", "0000001", 50);
cdc_survey_arr[1] = new Mapping("birth defects", "http://webeffective.keynote.com/v.asp?inv=7BA8068613D14DB4BC3D03222CFBFD5D", "0000001", 20);
cdc_survey_arr[2] = new Mapping("water", "http://webeffective.keynote.com/v.asp?inv=7BA8068613D14DB4BC3D03222CFBFD5D", "0000002", 1);
*/

/*****************************************/
/* Do not alter the code below this line */
/*****************************************/
var searchAgainInput = document.getElementById("searchBox-wide");
// Added the following to allow for disabling the custom Keynote survey -- 2011-10-12, cpv3@cdc.gov.
var keynoteDisabled = true;
if (searchAgainInput && !keynoteDisabled) {
	var searchTerm = searchAgainInput.value;
	if (searchTerm && searchTerm.trim().length > 0) {
		CustomResearch(cdc_survey_arr, searchTerm.trim());
	}
}
