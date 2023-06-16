'use strict';
var MESSAGE_ONE_Buffer = {};
var MESSAGE_TWO_Buffer = {};
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
    
    //setBroadcastMessageFormState(broadcastMessages);

    MESSAGE_ONE_Buffer = JSON.parse(JSON.stringify(g_message_data.message_one));
    MESSAGE_TWO_Buffer = JSON.parse(JSON.stringify(g_message_data.message_two));

    document.getElementById('form_content_id').innerHTML = render().join("");
}

async function save_draft_message_one()
{
    g_message_data.message_one = Object.assign({}, MESSAGE_ONE_Buffer);
    console.log("save draft 1");
    await set_broadcast_message_list();
}

async function save_draft_message_two()
{
    g_message_data.message_two = Object.assign({}, MESSAGE_TWO_Buffer);
    console.log("save draft 2");
    await set_broadcast_message_list();
}

async function publish_message_one()
{
    MESSAGE_ONE_Buffer.publish_status = 1;
    MESSAGE_ONE_Buffer.published = JSON.parse(JSON.stringify(g_message_data.message_one.draft)); 
    g_message_data.message_one = JSON.parse(JSON.stringify(MESSAGE_ONE_Buffer));
    console.log("publish 1");
    const el = document.getElementById("message_one_draft_preview");
    el.innerHTML = render_draft_preview(MESSAGE_ONE_Buffer) + render_published_version(MESSAGE_ONE_Buffer);

    const el2 = document.getElementById("unpublish-message-one");
    if(el2 != null)
        el2.removeAttribute("disabled");

    const e3 = document.getElementById("message-one-header")
    e3.innerHTML = "Message 1 (Published)"; 

    await set_broadcast_message_list();
}

async function publish_message_two()
{
    MESSAGE_TWO_Buffer.publish_status = 1;
    MESSAGE_TWO_Buffer.published = JSON.parse(JSON.stringify(MESSAGE_TWO_Buffer.draft));
    g_message_data.message_two = JSON.parse(JSON.stringify(MESSAGE_TWO_Buffer));
    console.log("publish 2");
    const el = document.getElementById("message_two_draft_preview");
    el.innerHTML = render_draft_preview(MESSAGE_TWO_Buffer) + render_published_version(MESSAGE_TWO_Buffer);
    
    const el2 = document.getElementById("unpublish-message-two");
    if(el2 != null)
        el2.removeAttribute("disabled");

    const e3 = document.getElementById("message-two-header")
    e3.innerHTML = "Message 2 (Published)"; 

    await set_broadcast_message_list();
}

async function unpublish_message_one()
{
    MESSAGE_ONE_Buffer.publish_status = 0;
    g_message_data.message_one = JSON.parse(JSON.stringify(MESSAGE_ONE_Buffer));
    console.log("un publish 1");
    
    const el = document.getElementById("message_one_draft_preview");
    el.innerHTML = render_draft_preview(MESSAGE_ONE_Buffer) + render_published_version(MESSAGE_ONE_Buffer);
    
    const el2 = document.getElementById("unpublish-message-one");
    if(el2 != null)
        el2.setAttribute("disabled","disabled");


    const e3 = document.getElementById("message-one-header")
    e3.innerHTML = "Message 1 (Unpublished)"; 

    await set_broadcast_message_list();
}

async function unpublish_message_two()
{
    MESSAGE_TWO_Buffer.publish_status = 0;
    g_message_data.message_two = JSON.parse(JSON.stringify(MESSAGE_TWO_Buffer));
    console.log("publish 2");
    const el = document.getElementById("message_two_draft_preview");
    el.innerHTML = render_draft_preview(MESSAGE_TWO_Buffer) + render_published_version(MESSAGE_TWO_Buffer);

    const el2 = document.getElementById("unpublish-message-two");
    el2.setAttribute("disabled","disabled");


    const e3 = document.getElementById("message-two-header")
    e3.innerHTML = "Message 2 (Unpublished)"; 

    await set_broadcast_message_list();


}

function reset_message_one()
{
    MESSAGE_ONE_Buffer = JSON.parse(JSON.stringify(g_message_data.message_one));
    document.getElementById('form_content_id').innerHTML = render().join("");
}

function broadcast_message_detail_button_click(p_message_type, p_message_body) 
{
    $mmria.info_dialog_show("System Message", "", p_message_body, p_message_type);
}

function reset_message_two()
{
    MESSAGE_TWO_Buffer = JSON.parse(JSON.stringify(g_message_data.message_two));
    document.getElementById('form_content_id').innerHTML = render().join("");
}


function on_message_one_title_change(value)
{
    MESSAGE_ONE_Buffer.draft.title = value;
    const el = document.getElementById("message_one_draft_preview");
    el.innerHTML = createTypePreviewHTML(MESSAGE_ONE_Buffer);
}

function on_message_one_body_change(value)
{
    MESSAGE_ONE_Buffer.draft.body = value;
    const el = document.getElementById("message_one_draft_preview");
    el.innerHTML = createTypePreviewHTML(MESSAGE_ONE_Buffer);
}

function on_message_one_type_change(value)
{
    MESSAGE_ONE_Buffer.draft.type = value;
    let el = document.getElementById("message_one_type_fieldset");
    el.innerHTML = render_message_one_type_control(value);
    el = document.getElementById("message_one_draft_preview");
    el.innerHTML = createTypePreviewHTML(MESSAGE_ONE_Buffer);
}

function on_message_two_title_change(value)
{
    MESSAGE_TWO_Buffer.draft.title = value;
    const el = document.getElementById("message_two_draft_preview");
    el.innerHTML = createTypePreviewHTML(MESSAGE_TWO_Buffer);
}

function on_message_two_body_change(value)
{
    MESSAGE_TWO_Buffer.draft.body = value;
    const el = document.getElementById("message_two_draft_preview");
    el.innerHTML = createTypePreviewHTML(MESSAGE_TWO_Buffer);
}

function on_message_two_type_change(value)
{
    MESSAGE_TWO_Buffer.draft.type = value;
    let el = document.getElementById("message_two_type_fieldset");
    el.innerHTML = render_message_two_type_control(value);
    el = document.getElementById("message_two_draft_preview");
    el.innerHTML = createTypePreviewHTML(MESSAGE_TWO_Buffer);
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
        url: `${location.protocol}//${location.host}/broadcast-message/SetBroadcastMessageList`,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(g_message_data),
        type: 'POST',
    });
    g_message_data._rev = response.rev;
}