var WindowObjectReference; // global variable
function openRequestedPopup()
{
               document.url = location.href;
               WindowObjectReference = window.open("https://www.cdc.gov/email.do?url=" +
                              location.href, "_blank",
                              "height=320,width=576,status=yes,toolbar=no,menubar=no,location=no,scrollbars=yes," +
                              "resizable=yes");
}