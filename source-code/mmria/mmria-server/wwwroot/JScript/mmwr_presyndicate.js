popupWindow = null;
function keep_popupWindow_on_top()
{ 
	if (popupWindow != null) {
		if (popupWindow.closed)
				popupWindow=null;
		 else 
				popupWindow.focus();
	}
}

function openWindow2(url, name) {
	popupWindow = window.open(url, name, 'directories = no , menubar = no,toolbar = no,location=no ,copyhistory=no, status,scrollbars,resizable,stayontop,width=700,height=500,left=0,top=0');
  popupWindow.focus();
}   

function openWindow(ActivityID, CreditType, ProgramName) {
	popupWindow = window.open('http://www2a.cdc.gov/ce/Login.asp?ActivityID=' + escape(ActivityID) + '&CreditType=' + escape(CreditType) + '&T=0&ProgramName=' + escape(ProgramName), 'exam', 'directories,menubar,toolbar,location=no,copyhistory=no,status,scrollbars,resizable,stayontop,width=700,height=500,left=30,top=30');
}

function openWindowDetail(ActivityID, ProgramName, External) { 
	popupWindow = window.open('http://www2a.cdc.gov/ce/CourseDetails.asp?ActivityId=' + escape(ActivityID) + '&ProgramName=' + escape(ProgramName), External);
}
 
function openWindow3(url, name) {
	popupWindow = window.open(url, name, 'directories , menubar,toolbar,location=no ,copyhistory=no, status,scrollbars,resizable,stayontop,width=700,height=500,left=30,top=30') 
  popupWindow.focus ();
}   

function ConfirmClose() {
 if (confirm("Are you sure you wish to exit this window?")) 
	 window.close();
}

function Close() {
	window.close();
}

function PassWin(url)
{
	var hWnd = window.open(url,"PassWin","width=700,height=500,left=30,top=30,toolbar=no,resizable=yes,scrollbars=yes,directories=no");
}

var deRef = "";

