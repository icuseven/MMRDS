'use strict';
var g_message_one = { tite: "fjd"
};
var g_message_two = {};

(async function() {

	window.onload = main;
})()


async function main()
{
    /*
	let response = await $.ajax({
		url: `${location.protocol}//${location.host}/api/version/release-version`
	});*/

    document.getElementById('form_content_id').innerHTML = render().join("");

}