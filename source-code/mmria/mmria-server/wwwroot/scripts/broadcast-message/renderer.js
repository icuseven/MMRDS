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
                <h2 class="h3">Message 1 (${message_one.publish_status == 0 ? 'Unpublished' : 'Published'})</h2>            
            </div>
            <div>
                <p class="h5">Title <i class="small">(Limit 250 characters)</i></p>
                <input class="col h-75" type=text id=message-one-title maxlength="250" value="${message_one.draft.title}"/>           
            </div>
            <div>
                <p class="h5">Detail Content <i class="small">(Limit 2000 characters)</i></p>
                <textarea class="col" id="message-one-body" rows=10 cols=80 maxlength="2000">
                ${message_one.draft.body}
                </textarea>
            </div>
            ${render_type_control(message_one.draft.type)}
            ${createTypePreviewHTML(message_one)}
            <div class="row">
                <div class="ml-auto pr-3">
                    <input class="btn btn-primary" type="button" value="Save Draft" onclick="saveDraft('${message_one.id}')" />
                    <input class="btn btn-primary" type="button" value="Publish Latest Draft" onclick="publishLatestDraft("${message_one.id}")" />
                    <input class="btn btn-primary" type="button" value="Unpublish Message" onclick="unpublishMessage("${message_one.id}")"  ${message_two.publish_status == 0 ? "disabled" : "" } />
                    <input class="btn btn-cancel" type="button" value="Reset" onclick="reset("${message_one.id}")" />
                </div>
            </div>
        </form>
        <form class="flex-column pl-1 pr-4" id="message-two-form">
            <div>
                <h2 class="h3">Message 2 (${message_two.publish_status == 0 ? 'Unpublished' : 'Published'})</h2>
            </div>
            <div>
                <p class="h5">Title <i class="small">(Limit 250 characters)</i></p>
                <input class="col h-75" type=text id=message-two-title maxlength="250" value="${message_two.draft.title}"/>           
            </div>
            <div>
                <p class="h5">Detail Content <i class="small">(Limit 2000 characters)</i></p>
                <textarea class="col" id="message-two-body" rows=10 cols=80 maxlength="2000">
                ${message_two.draft.body}
                </textarea>
            </div>
            ${render_type_control(message_two.draft.type)}
            ${createTypePreviewHTML(message_two)}
            <div class="row">
                <div class="ml-auto pr-3">
                    <input class="btn btn-primary" type="button" value="Save Draft" onclick="saveDraft("${message_two.id}")" />
                    <input class="btn btn-primary" type="button" value="Publish Latest Draft" onclick="publishLatestDraft("${message_two.id}")" />
                    <input class="btn btn-primary" type="button" value="Unpublish Message" onclick="unpublishMessage("${message_two.id}")" ${message_two.publish_status == 0 ? "disabled" : "" }/>
                    <input class="btn btn-cancel" type="button" value="Reset" onclick="reset("${message_two.id}")" />
                </div>            
            </div>
        </form>
        `
    );
    return result;
}

function createTypePreviewHTML(message)
{
    var draftPreviewHTML = ``;
    var publishedPreviewHTML = ``;
    var draftAlertTypeStylings= [];
    var publishedAlertTypeStyling = [];
    if (message.draft.type == "information")
        draftAlertTypeStylings = ["alert-info", "cdc-icon-alert_01"]
    else if (message.draft.type == "warning")
        draftAlertTypeStylings = ["alert-warning", "cdc-icon-alert_02"]
    else
        draftAlertTypeStylings = ["alert-danger", "cdc-icon-close-circle"]
    if (message.published.type == "information")
        publishedAlertTypeStyling = ["alert-info", "cdc-icon-alert_01"]
    else if (message.published.type == "warning")
        publishedAlertTypeStyling = ["alert-warning", "cdc-icon-alert_02"]
    else
        publishedAlertTypeStyling = ["alert-danger", "cdc-icon-close-circle"]    
    draftPreviewHTML = `
        <p class="h5">Draft Preview</p>
        <div id="${message.id}draft">
            <div class="alert ${draftAlertTypeStylings[0]} col-md-12">
                <div class="row d-flex padding-pagealert align-items-center">
                    <div class="flex-grow-0 col">
                        <span class="fi ${draftAlertTypeStylings[1]} " aria-hidden="true"></span>                        
                    </div>
                    <div class="col">
                        <p id="${message.id}title-draft" class="margin-pagealert">
                        ${message.draft.title}
                        </p>		
                    </div>
                    ${message.draft.body.length > 0 ? `<div class="col flex-grow-0"><input class="btn btn-primary" type="button" value="Details" /></div>` : ``}
                </div>
            </div>
        </div>
    `;
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
            <div id="${message.id}draft">
                <div class="alert ${publishedAlertTypeStyling[0]} col-md-12" id="alert_unique_16262b641c316a">
                <div class="row d-flex padding-pagealert align-items-center">
                    <div class="flex-grow-0 col">
                        <span class="fi ${publishedAlertTypeStyling[1]} " aria-hidden="true"></span>                        
                    </div>
                    <div class="col">
                        <p id="${message.id}title-draft" class="margin-pagealert">
                        ${message.published.title}
                        </p>		
                    </div>
                    ${message.published.body.length > 0 ? `<div class="col flex-grow-0"><input class="btn btn-primary" type="button" value="Details" /></div>` : ``}
                </div>
            </div>
        `;
    }
    return draftPreviewHTML + publishedPreviewHTML;
}

function render_type_control(value)
{


    return `
    <fieldset>
    <legend class="h5">Type</legend>
    <div>
        <label for="message-two-information">
            <input type="radio" id="message-two-information" name="message-two-type" value="information" aria-label="Information" ${ value == "information" ? "checked" : "" }> Information
        </label>
    </div>
    <div>
        <label for="message-two-warning">
            <input type="radio" id="message-two-warning" name="message-two-type" value="information" aria-label="Information" ${ value == "warning" ? "checked" : "" }> Warning
        </label>
    </div>
    <div>
        <label for="message-two-error">
            <input type="radio" id="message-two-error" name="message-two-type" value="information" aria-label="Error" ${ value == "error" ? "checked" : "" }> Error
        </label>
    </div>
</fieldset>   
    `;
}