<%@ taglib uri="//java.sun.com/jsp/jstl/core" prefix="c" %>if (window.location.href.indexOf('feedback-confirm.html') > -1) {
	s.pageName = 'Sent | ' + s.pageName;
	s.prop8 = "Feedback: Sent";
} else {
	s.pageName = document.title;
	s.prop8 = 'Feedback: Form';
}
s.channel = 'CDC CMS';
s.prop4 = 'Office of the Director (OD)' + ' ^ ' + '' + ' ^ ' + s.pageName;
