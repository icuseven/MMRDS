'use strict';
var MESSAGE_ONE_ID = "message-one-";
var MESSAGE_TWO_ID = "message-two-";
var g_message_data = {
    _id: "broadcast-message-list",
    _rev: null,
    date_created: "2023-05-12T09:12:33.108Z",
    created_by: "user1",
    date_last_updated: "2023-05-12T09:12:33.108Z",
    last_updated_by: "user1",
    data_type: "broadcast_message_list",
    message_one: {
        draft: {
            title: "Maintenance scheduled for HH:MM PM on MM/DD/YYYY - HH:MM PM on MM/DD/YYY. Please save case data locally and upload after this maintenance period to prevent data loss.",
            body: "",
            type: "warning"
        },
        published: {
            title: "",
            body: "",
            type: "",
        },
        publish_status: 0
    },
    message_two: {
        draft: {
            title: "MMRIA version 3.1.1 is now live - see release notes for additional information.",
            body: "If text has been entered in the content body section of this message, it will appear here.",
            type: "information",
        },
        published: {
            title: "System maintenance until HH:MM PM on MM/DD/YYY. Please save case data locally and upload after this maintenance period to prevent data loss.",
            body: "If text has been entered in the content body section of this message, it will appear here.",
            type: "error",
        },
        publish_status: 1
    },
};

(async function() {

	window.onload = main;
})()


async function main()
{
    await get_broadcast_message_list();
    /*
	let response = await $.ajax({
		url: `${location.protocol}//${location.host}/api/version/release-version`
	});*/
    //var broadcastMessages = getMessages();
    document.getElementById('form_content_id').innerHTML = render().join("");
    //setBroadcastMessageFormState(broadcastMessages);
}

function saveDraft(g_message_id){
    //To-do: save draft
    var messageContent = createMessageContent(g_message_id);
    console.log(messageContent);
}

function publishLatestDraft(g_message_id){

}

function unpublishMessage(g_message_id){

}

function reset(g_message_id){

}

function createMessageContent(g_message_id){
    var g_form = document.getElementById(g_message_id + "form");
    console.log(g_form);
    return {
        title: g_form[g_message_id + "title"].value,
        body: g_form[g_message_id + "body"].value,
        type: g_form[g_message_id + "type"].value,
    }
}

function getMessages() {
    return [Object.assign(g_message_data.message_one, { id: MESSAGE_ONE_ID }), Object.assign(g_message_data.message_two, { id: MESSAGE_TWO_ID })];
}

function setBroadcastMessageFormState(broadcastMessages){
    var g_message_one_form = document.getElementById(MESSAGE_ONE_ID + "form");
    var g_message_two_form = document.getElementById(MESSAGE_TWO_ID + "form");
    g_message_one_form[MESSAGE_ONE_ID + "title"].value = broadcastMessages[0].draft.title;
	g_message_one_form[MESSAGE_ONE_ID + "body"].value = broadcastMessages[0].draft.body;
	g_message_one_form[MESSAGE_ONE_ID + broadcastMessages[0].draft.type].checked = true;
	g_message_two_form[MESSAGE_TWO_ID + "title"].value = broadcastMessages[1].draft.title;
	g_message_two_form[MESSAGE_TWO_ID + "body"].value = broadcastMessages[1].draft.body;
	g_message_two_form[MESSAGE_TWO_ID + broadcastMessages[1].draft.type].checked = true;
}


async function get_broadcast_message_list()
{
    const get_data_response = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/broadcast-message/GetBroadcastMessageList`
    });


    g_message_data = get_data_response;

    
}

async function set_broadcast_message_list()
{

    const response = await $.ajax
    ({
        url: `${location.protocol}//${location.host}/broadcast-message/GetBroadcastMessageList`,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(g_message_data),
        type: 'POST',
    });

    g_message_data._rev = response.rev;
        //console.log(response);
    
}