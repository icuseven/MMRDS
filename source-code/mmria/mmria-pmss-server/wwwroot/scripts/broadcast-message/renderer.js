function render()
{
    var result = [];
    var message_one = MESSAGE_ONE_Buffer;
    var message_two = MESSAGE_TWO_Buffer;
    result.push
    (
        `
        <form class="flex-column pl-1 pr-4" id="message-one-form">
            <div>
                <h2 class="h3" id="message-one-header">Message 1 (${message_one.publish_status == 0 ? 'Unpublished' : 'Published'})</h2>            
            </div>
            <div>
                <p class="h5">Title <i class="small">(Limit 250 characters)</i></p>
                <input class="col h-75" type=text id=message-one-title maxlength="250" value="${message_one.draft.title}" onchange="on_message_one_title_change(this.value)"/>           
            </div>
            <div>
                <p class="h5">Detail Content <i class="small">(Limit 2000 characters)</i></p>
                <textarea class="col" id="message-one-body" rows=10 cols=80 maxlength="2000" onchange="on_message_one_body_change(this.value)">${message_one.draft.body}</textarea>
            </div>
            <div id="message_one_type_fieldset">
            ${render_message_one_type_control(message_one.draft.type)}
            </div>
            <div id="message_one_draft_preview">
            ${render_draft_preview(message_one)}
            ${render_published_version(message_one)}
            
            </div>
            </div>
            <div class="row">
                <div class="ml-auto pr-3">
                    <input class="btn btn-primary" type="button" value="Save Draft" onclick="save_draft_message_one()" />
                    <input class="btn btn-primary" type="button" value="Publish Latest Draft" onclick="publish_message_one()" />
                    <input id="unpublish-message-one" class="btn btn-primary" type="button" value="Unpublish Message" onclick="unpublish_message_one()"  ${message_one.publish_status == 0 ? "disabled" : "" } />
                    <input class="btn btn-cancel" type="button" value="Reset" onclick="reset_message_one()" />
                </div>
            </div>
        </form>
        <form class="flex-column pl-1 pr-4" id="message-two-form">
            <div>
                <h2 class="h3" id="message-two-header">Message 2 (${message_two.publish_status == 0 ? 'Unpublished' : 'Published'})</h2>
            </div>
            <div>
                <p class="h5">Title <i class="small">(Limit 250 characters)</i></p>
                <input class="col h-75" type=text id=message-two-title maxlength="250" value="${message_two.draft.title}" onchange="on_message_two_title_change(this.value)" />           
            </div>
            <div>
                <p class="h5">Detail Content <i class="small">(Limit 2000 characters)</i></p>
                <textarea class="col" id="message-two-body" rows=10 cols=80 maxlength="2000" onchange="on_message_two_body_change(this.value)">${message_two.draft.body}</textarea>
            </div>
            <div id="message_two_type_fieldset">
            ${render_message_two_type_control(message_two.draft.type)}
            </div>
            <div id="message_two_draft_preview">
            ${render_draft_preview(message_two)}
            ${render_published_version(message_two)}
            </div>
            <div class="row">
                <div class="ml-auto pr-3">
                    <input class="btn btn-primary" type="button" value="Save Draft" onclick="save_draft_message_two()" />
                    <input class="btn btn-primary" type="button" value="Publish Latest Draft" onclick="publish_message_two()" />
                    <input id="unpublish-message-two" class="btn btn-primary" type="button" value="Unpublish Message" onclick="unpublish_message_two()" ${message_two.publish_status == 0 ? "disabled" : "" }/>
                    <input class="btn btn-cancel" type="button" value="Reset" onclick="reset_message_two()" />
                </div>            
            </div>
        </form>
        `
    );
    return result;
}

function createTypePreviewHTML(message)
{
    return render_draft_preview(message) + render_published_version(message);
}

function render_draft_preview(message)
{
    var draftPreviewHTML = ``;
    var draftAlertTypeStylings= [];

    if (message.draft.type == "information")
        draftAlertTypeStylings = ["alert-info", "cdc-icon-alert_01"]
    else if (message.draft.type == "warning")
        draftAlertTypeStylings = ["alert-warning", "cdc-icon-alert_02"]
    else
        draftAlertTypeStylings = ["alert-danger", "cdc-icon-close-circle"]
        draftPreviewHTML = `
        <p class="h5">Draft Preview</p>
        <div>
            <div class="alert ${draftAlertTypeStylings[0]} col-md-12">
                <div class="row d-flex padding-pagealert align-items-center">
                    <div class="flex-grow-0 col">
                        <span class="fi ${draftAlertTypeStylings[1]} " aria-hidden="true"></span>                        
                    </div>
                    <div class="col">
                        <p class="margin-pagealert">
                        ${message.draft.title}
                        </p>		
                    </div>
                    ${message.draft.body.length > 0 ? `<div class="col flex-grow-0"><input class="btn btn-primary" type="button" value="Details" /></div>` : ``}
                </div>
            </div>
        </div>
    `;

    return draftPreviewHTML;
}

function render_published_version(message)
{
    var publishedPreviewHTML = ``;
    var publishedAlertTypeStyling = [];

        if (message.published.type == "information")
        publishedAlertTypeStyling = ["alert-info", "cdc-icon-alert_01"]
    else if (message.published.type == "warning")
        publishedAlertTypeStyling = ["alert-warning", "cdc-icon-alert_02"]
    else
        publishedAlertTypeStyling = ["alert-danger", "cdc-icon-close-circle"]    

    if(message.publish_status == 0)
    {
        publishedPreviewHTML = `
            <p class="h5">Published Version</p>
            <i>No message published.</i>
        `;
    } 
    else 
    {
        publishedPreviewHTML = `
            <p class="h5">Published Version</p>
            <div>
                <div class="alert ${publishedAlertTypeStyling[0]} col-md-12" id="alert_unique_16262b641c316a">
                <div class="row d-flex padding-pagealert align-items-center">
                    <div class="flex-grow-0 col">
                        <span class="fi ${publishedAlertTypeStyling[1]} " aria-hidden="true"></span>                        
                    </div>
                    <div class="col">
                        <p class="margin-pagealert">
                        ${message.published.title}
                        </p>		
                    </div>
                    ${message.published.body.length > 0 ? `<div class="col flex-grow-0"><input class="btn btn-primary" type="button" value="Details" /></div>` : ``}
                </div>
            </div>
        `;
    }
    return publishedPreviewHTML;
}

function render_message_one_type_control(value)
{
    return `
    <fieldset>
    <legend class="h5">Type</legend>
    <div>
        <label for="message-one-information">
            <input type="radio" id="message-one-information" name="message-one-type" value="information" aria-label="Information" ${ value == "information" ? "checked" : "" } onchange="on_message_one_type_change(this.value)"> Information
        </label>
    </div>
    <div>
        <label for="message-one-warning">
            <input type="radio" id="message-one-warning" name="message-one-type" value="warning" aria-label="Information" ${ value == "warning" ? "checked" : "" } onchange="on_message_one_type_change(this.value)"> Warning
        </label>
    </div>
    <div>
        <label for="message-one-error">
            <input type="radio" id="message-one-error" name="message-one-type" value="error" aria-label="Error" ${ value == "error" ? "checked" : "" } onchange="on_message_one_type_change(this.value)"> Error
        </label>
    </div>  
    </fieldset>
    `;
}

function render_message_two_type_control(value)
{
    return `
    <fieldset>
    <legend class="h5">Type</legend>
    <div>
        <label for="message-two-information">
            <input type="radio" id="message-two-information" name="message-two-type" value="information" aria-label="Information" ${ value == "information" ? "checked" : "" } onchange="on_message_two_type_change(this.value)"> Information
        </label>
    </div>
    <div>
        <label for="message-two-warning">
            <input type="radio" id="message-two-warning" name="message-two-type" value="warning" aria-label="Information" ${ value == "warning" ? "checked" : "" } onchange="on_message_two_type_change(this.value)"> Warning
        </label>
    </div>
    <div>
        <label for="message-two-error">
            <input type="radio" id="message-two-error" name="message-two-type" value="error" aria-label="Error" ${ value == "error" ? "checked" : "" } onchange="on_message_two_type_change(this.value)"> Error
        </label>
    </div> 
    </fieldset>
    `;
}